import React, { useState } from 'react';
import { FileText, Upload, Loader2, Download, CheckCircle, ListRestart } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useToast } from '../components/ToastContext';
import './BatchMode.css';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000');

const BatchMode = () => {
  const [file, setFile] = useState(null);
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [progress, setProgress] = useState(0);
  const { addToast } = useToast();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) setFile(selectedFile);
  };

  const processBatch = async () => {
    if (!file) return addToast('Please upload a text file first.', 'warning');

    setLoading(true);
    setProgress(0);

    try {
      const text = await file.text();
      const questions = text.split('\n').filter(q => q.trim().length > 0);

      if (questions.length === 0) throw new Error('No questions found in file.');

      const res = await fetch(`${API_URL}/batch_query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questions,
          subject: subject || null,
          user_name: localStorage.getItem('user_name')
        }),
      });

      if (!res.ok) throw new Error('Batch processing failed');
      const data = await res.json();
      setResults(data.results);
      addToast('Study guide generated successfully!', 'success');
    } catch (e) {
      addToast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const downloadStudyGuide = () => {
    const doc = new jsPDF();

    // Header Branding
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text('VTU Comprehensive Study Guide', 10, 20);
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(`Subject: ${subject || 'All Subjects'}`, 10, 27);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 190, 27, { align: 'right' });
    doc.line(10, 30, 200, 30);

    let yOffset = 40;
    results.forEach((res, i) => {
      if (yOffset > 260) {
        doc.addPage();
        yOffset = 20;
        // Repeat header on new pages
        doc.setFontSize(10);
        doc.setTextColor(120);
        doc.text('VTU Comprehensive Study Guide', 10, 10);
        doc.line(10, 12, 200, 12);
      }
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0);
      const qText = doc.splitTextToSize(`Q${i+1}: ${res.question}`, 180);
      doc.text(qText, 10, yOffset);
      yOffset += (qText.length * 7) + 5;

      doc.setFont(undefined, 'normal');
      const aText = doc.splitTextToSize(res.answer, 180);
      doc.text(aText, 10, yOffset);
      yOffset += (aText.length * 7) + 15;
    });

    doc.save('VTU_Study_Guide.pdf');
    addToast('Study guide PDF downloaded!', 'success');
  };

  return (
    <div className="batch-container fade-in">
      <div className="batch-setup">
        <div className="batch-card">
          <ListRestart size={48} className="batch-icon" />
          <h1>Batch Study Guide</h1>
          <p>Upload a list of questions (one per line) and generate a full formatted study guide PDF.</p>

          <div className="setup-form">
            <div className="form-group">
              <label>Subject (Optional)</label>
              <select value={subject} onChange={e => setSubject(e.target.value)}>
                <option value="">All Subjects</option>
                <option value="BCS401">BCS401</option>
                <option value="BCS403">BCS403</option>
                <option value="BCS405A">BCS405A</option>
                <option value="BBOC407">BBOC407</option>
                <option value="BUHK408">BUHK408</option>
                <option value="BAD401">BAD401</option>
              </select>
            </div>

            <div className="form-group">
              <label>Question List (.txt)</label>
              <div className="file-upload-box" onClick={() => document.getElementById('batch-file').click()}>
                <Upload size={24} />
                <span>{file ? file.name : 'Click to upload text file'}</span>
                <input id="batch-file" type="file" accept=".txt" onChange={handleFileChange} style={{ display: 'none' }} />
              </div>
            </div>

            <button className="btn-process-batch" onClick={processBatch} disabled={loading || !file}>
              {loading ? <Loader2 className="spin" /> : 'Generate Study Guide'}
            </button>
          </div>
        </div>
      </div>

      {results && (
        <div className="results-section fade-in">
          <div className="results-header">
            <h2>Generated Answers</h2>
            <button className="btn-download-guide" onClick={downloadStudyGuide}>
              <Download size={18} /> Download Study Guide PDF
            </button>
          </div>
          <div className="results-list">
            {results.map((res, i) => (
              <div key={i} className="result-item">
                <div className="result-q">Q{i+1}: {res.question}</div>
                <div className="result-a">{res.answer}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchMode;
