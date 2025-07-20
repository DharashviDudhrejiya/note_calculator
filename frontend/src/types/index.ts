export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

export interface CalculationResult {
  lineNumber: number;
  expression: string;
  result: number | string;
  error?: string;
  dependencies: number[];
}

export interface AppSettings {
  theme: 'light' | 'dark';
  fontSize: number;
  decimalPrecision: number;
  currencySymbol: string;
  autoSave: boolean;
  showLineNumbers: boolean;
  currency: string;
}

export interface Variable {
  name: string;
  value: number;
  lineNumber: number;
}

export interface HistoryState {
  content: string;
  timestamp: number;
}