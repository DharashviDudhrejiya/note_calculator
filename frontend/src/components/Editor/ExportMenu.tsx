import React from 'react';
import { FileText, Download, Share2, FileSpreadsheet } from 'lucide-react';
import { Note, CalculationResult } from '../../types/index.ts';
import { exportToPlainText, exportToCSV, exportToPDF, generateShareableText } from '../../utils/exportUtils.ts';

interface ExportMenuProps {
  note: Note;
  results: CalculationResult[];
  onClose: () => void;
}

const ExportMenu: React.FC<ExportMenuProps> = ({ note, results, onClose }) => {
  const handleExportPlainText = (includeFormulas: boolean) => {
    exportToPlainText(note, includeFormulas);
    onClose();
  };

  const handleExportCSV = () => {
    exportToCSV(note, results);
    onClose();
  };

  const handleExportPDF = () => {
    exportToPDF('note-editor', note.title);
    onClose();
  };

  const handleShare = () => {
    const shareableText = generateShareableText(note, results);
    if (navigator.share) {
      navigator.share({
        title: note.title,
        text: shareableText,
      });
    } else {
      navigator.clipboard.writeText(shareableText);
      alert('Shareable text copied to clipboard!');
    }
    onClose();
  };

  return (
    <div className="export-menu">
      <div className="export-menu-header">
        <h3>Export Options</h3>
        <button onClick={onClose} className="close-btn">×</button>
      </div>
      
      <div className="export-options">
        <button
          onClick={() => handleExportPlainText(true)}
          className="export-option"
        >
          <FileText size={20} />
          <div>
            <span>Plain Text (with formulas)</span>
            <small>Export as .txt with calculations</small>
          </div>
        </button>
        
        <button
          onClick={() => handleExportPlainText(false)}
          className="export-option"
        >
          <FileText size={20} />
          <div>
            <span>Plain Text (results only)</span>
            <small>Export as .txt without formulas</small>
          </div>
        </button>
        
        <button
          onClick={handleExportCSV}
          className="export-option"
        >
          <FileSpreadsheet size={20} />
          <div>
            <span>CSV (calculated values)</span>
            <small>Export numbers to spreadsheet</small>
          </div>
        </button>
        
        <button
          onClick={handleExportPDF}
          className="export-option"
        >
          <Download size={20} />
          <div>
            <span>PDF Document</span>
            <small>Export as formatted PDF</small>
          </div>
        </button>
        
        <button
          onClick={handleShare}
          className="export-option"
        >
          <Share2 size={20} />
          <div>
            <span>Share Results</span>
            <small>Copy shareable text with results</small>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ExportMenu;