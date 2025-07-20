import { evaluate, parse } from 'mathjs';
import { CalculationResult, Variable } from '../types';

export class CalculationEngine {
  private variables: Map<string, number> = new Map();
  private lineResults: Map<number, number> = new Map();

  parseContent(content: string): CalculationResult[] {
    const lines = content.split('\n');
    const results: CalculationResult[] = [];
    
    // Reset state
    this.variables.clear();
    this.lineResults.clear();

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const result = this.parseLine(line, lineNumber, lines);
      if (result) {
        results.push(result);
        if (typeof result.result === 'number') {
          this.lineResults.set(lineNumber, result.result);
        }
      }
    });

    return results;
  }

  private parseLine(line: string, lineNumber: number, allLines: string[]): CalculationResult | null {
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (!trimmedLine) return null;

    try {
      // Check for variable assignment (e.g., "tax = 0.10")
      const variableMatch = trimmedLine.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/);
      if (variableMatch) {
        const [, varName, expression] = variableMatch;
        const processedExpression = this.processExpression(expression, lineNumber);
        const value = evaluate(processedExpression);
        this.variables.set(varName, value);
        return {
          lineNumber,
          expression: trimmedLine,
          result: value,
          dependencies: this.findDependencies(expression),
        };
      }

      // Check for calculation expression (starts with =)
      const calcMatch = trimmedLine.match(/^=(.+)$/);
      if (calcMatch) {
        const expression = calcMatch[1];
        const processedExpression = this.processExpression(expression, lineNumber);
        const result = evaluate(processedExpression);
        return {
          lineNumber,
          expression: trimmedLine,
          result,
          dependencies: this.findDependencies(expression),
        };
      }

      // Check for inline calculation (contains = somewhere in the line)
      const inlineMatch = trimmedLine.match(/^(.+?):\s*=(.+)$/);
      if (inlineMatch) {
        const [, label, expression] = inlineMatch;
        const processedExpression = this.processExpression(expression, lineNumber);
        const result = evaluate(processedExpression);
        return {
          lineNumber,
          expression: trimmedLine,
          result,
          dependencies: this.findDependencies(expression),
        };
      }

    } catch (error) {
      return {
        lineNumber,
        expression: trimmedLine,
        result: 'Error',
        error: error instanceof Error ? error.message : 'Unknown error',
        dependencies: [],
      };
    }

    return null;
  }

  private processExpression(expression: string, currentLine: number): string {
    let processed = expression;

    // Replace line references (@1, @2, etc.)
    processed = processed.replace(/@(\d+)/g, (match, lineNum) => {
      const refLineNum = parseInt(lineNum);
      if (refLineNum >= currentLine) {
        throw new Error(`Cannot reference line ${refLineNum} from line ${currentLine}`);
      }
      const value = this.lineResults.get(refLineNum);
      if (value === undefined) {
        throw new Error(`No result found for line ${refLineNum}`);
      }
      return value.toString();
    });

    // Replace variables
    this.variables.forEach((value, name) => {
      const regex = new RegExp(`\\b${name}\\b`, 'g');
      processed = processed.replace(regex, value.toString());
    });

    // Handle functions like sum(), avg(), min(), max()
    processed = this.processFunctions(processed);

    return processed;
  }

  private processFunctions(expression: string): string {
    // Handle sum() function
    expression = expression.replace(/sum\(([^)]+)\)/g, (match, args) => {
      const values = this.parseArguments(args);
      return values.reduce((sum, val) => sum + val, 0).toString();
    });

    // Handle avg() function
    expression = expression.replace(/avg\(([^)]+)\)/g, (match, args) => {
      const values = this.parseArguments(args);
      return (values.reduce((sum, val) => sum + val, 0) / values.length).toString();
    });

    // Handle min() function
    expression = expression.replace(/min\(([^)]+)\)/g, (match, args) => {
      const values = this.parseArguments(args);
      return Math.min(...values).toString();
    });

    // Handle max() function
    expression = expression.replace(/max\(([^)]+)\)/g, (match, args) => {
      const values = this.parseArguments(args);
      return Math.max(...values).toString();
    });

    return expression;
  }

  private parseArguments(args: string): number[] {
    const values: number[] = [];
    const parts = args.split(',').map(part => part.trim());

    parts.forEach(part => {
      // Handle range notation (@1:@5)
      const rangeMatch = part.match(/@(\d+):@(\d+)/);
      if (rangeMatch) {
        const start = parseInt(rangeMatch[1]);
        const end = parseInt(rangeMatch[2]);
        for (let i = start; i <= end; i++) {
          const value = this.lineResults.get(i);
          if (value !== undefined) {
            values.push(value);
          }
        }
      } else if (part.startsWith('@')) {
        // Single line reference
        const lineNum = parseInt(part.substring(1));
        const value = this.lineResults.get(lineNum);
        if (value !== undefined) {
          values.push(value);
        }
      } else {
        // Direct number or expression
        try {
          values.push(evaluate(part));
        } catch {
          // Skip invalid values
        }
      }
    });

    return values;
  }

  private findDependencies(expression: string): number[] {
    const dependencies: number[] = [];
    const lineRefs = expression.match(/@(\d+)/g);
    
    if (lineRefs) {
      lineRefs.forEach(ref => {
        const lineNum = parseInt(ref.substring(1));
        dependencies.push(lineNum);
      });
    }

    return dependencies;
  }
}