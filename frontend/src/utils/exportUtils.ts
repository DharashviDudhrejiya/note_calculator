import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { Note, CalculationResult } from '../types';

export const exportToPlainText = (note: Note, includeFormulas: boolean = true) => {
  const content = includeFormulas ? note.content : note.content.replace(/=.+$/gm, '');
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `${note.title}.txt`);
};

export const exportToCSV = (note: Note, results: CalculationResult[]) => {
  const lines = note.content.split('\n');
  const csvData: string[] = ['Line,Content,Result'];

  results.forEach(result => {
    const line = lines[result.lineNumber - 1];
    const content = line.replace(/,/g, '"').replace(/"/g, '""');
    const resultValue = typeof result.result === 'number' ? result.result : '';
    csvData.push(`${result.lineNumber},"${content}",${resultValue}`);
  });

  const blob = new Blob([csvData.join('\n')], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `${note.title}.csv`);
};

export const exportToPDF = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

export const generateShareableText = (note: Note, results: CalculationResult[]) => {
  const lines = note.content.split('\n');
  let shareableContent = `${note.title}\n${'='.repeat(note.title.length)}\n\n`;

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const result = results.find(r => r.lineNumber === lineNumber);
    
    if (result && typeof result.result === 'number') {
      shareableContent += `${line} → ${result.result}\n`;
    } else {
      shareableContent += `${line}\n`;
    }
  });

  return shareableContent;
};