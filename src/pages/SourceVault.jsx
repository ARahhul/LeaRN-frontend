import React from 'react';
import { BookOpen, FileText, StickyNote } from 'lucide-react';
import './SourceVault.css';

const subjects = [
  {
    code: 'BCS401',
    pyq: 'https://drive.google.com/drive/folders/1-f9d0-bdjd5AVf1m5RawttroXzmcmohv?usp=sharing',
    notes: 'https://drive.google.com/drive/folders/1xVhNSSt28QF40lAsHWlITttiXodY25jv?usp=drive_link',
  },
  {
    code: 'BCS405A',
    pyq: 'https://drive.google.com/drive/folders/1FDzSYrq3ep0J0VzDHzLd4t4U-B4bd9iH?usp=sharing',
    notes: 'https://drive.google.com/drive/folders/1HYWN-4Zyhsd3gG1cogvHl0PFh142vRnZ?usp=drive_link',
  },
  {
    code: 'BCS403',
    pyq: 'https://drive.google.com/drive/folders/1BFy0rb8GpnahudDhpFHuyju72hkjGeM0?usp=sharing',
    notes: 'https://drive.google.com/drive/folders/1DkuY6CD6oOyP7VO3UQkZHG_a6HW-_Zm9?usp=drive_link',
  },
  {
    code: 'BBOC407',
    pyq: 'https://drive.google.com/drive/folders/1MIb3VsJtVopONyP1F10n2T-4gKJVBXiU?usp=sharing',
    notes: 'https://drive.google.com/drive/folders/1BeCt7LFeQk1SaTVcSZ9zpp-JYxrjLje0?usp=drive_link',
  },
  {
    code: 'BUHK408',
    pyq: 'https://drive.google.com/drive/folders/1LyklXfe1nhlJ2F5Cn-8hL_qGqMjhOG5j?usp=drive_link',
    notes: 'https://drive.google.com/drive/folders/1JDJQW8T3Moao3djTCHSAtUTNZk5C8izK?usp=drive_link',
  },
  {
    code: 'BAD401',
    pyq: 'https://drive.google.com/drive/folders/1dBZ5hcqqRPRpqTSiaDRgVWmDrkEBO4Kz?usp=drive_link',
    notes: 'https://drive.google.com/drive/folders/1SSLnwwQMzkVJ3q_hVkpdSKurdIZF22Jw?usp=drive_link',
  },
];

const SourceVault = () => {
  return (
    <div className="vault-container fade-in">
      <div className="vault-header">
        <div className="vault-title-group">
          <span className="vault-label">KNOWLEDGE BASE</span>
          <h1 className="vault-title">Source Vault</h1>
          <p className="vault-subtitle">
            Access previous year question papers and module notes for all your subjects.
          </p>
        </div>
      </div>

      <div className="section-header">
        <h2 className="section-title">Subjects</h2>
      </div>

      <div className="cards-grid">
        {subjects.map((subj) => (
          <div className="card" key={subj.code}>
            <div className="card-icon-title">
              <BookOpen className="card-icon" size={22} />
              <div className="card-title">{subj.code}</div>
            </div>
            <div className="card-buttons">
              <a
                href={subj.pyq}
                target="_blank"
                rel="noopener noreferrer"
                className="card-link-btn card-link-pyq"
              >
                <FileText size={14} />
                PYQ
              </a>
              <a
                href={subj.notes}
                target="_blank"
                rel="noopener noreferrer"
                className="card-link-btn card-link-notes"
              >
                <StickyNote size={14} />
                Notes
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SourceVault;
