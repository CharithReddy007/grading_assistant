import React, { useState } from 'react';
import { X, Search, CheckCircle, XCircle } from 'lucide-react';
import { Button, Input } from './UI';

function ConfBar({ score }) {
  const color = score >= 60 ? '#22c55e' : '#ef4444';
  return (
    <div style={{ flex: 1, height: 5, background: '#f3f4f6', borderRadius: 3, overflow: 'hidden', minWidth: 60 }}>
      <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.3s' }} />
    </div>
  );
}

export default function ResolveModal({ student, onClose, onConfirm, onMarkUnmatched }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(student.matched?.roll || null);

  const filtered = student.allCandidates.filter(c =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.roll.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirm = () => {
    const match = student.allCandidates.find(c => c.roll === selected);
    if (match) onConfirm(match);
  };

  return (
    /* overlay — normal-flow container so iframe sizes correctly */
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 500, padding: '1rem',
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb',
        width: 500, maxWidth: '100%', maxHeight: '85vh', overflowY: 'auto',
        padding: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
      }}
        onClick={e => e.stopPropagation()}
      >
        {/* title row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Resolve Student Identity</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex' }}>
            <X size={18} />
          </button>
        </div>

        {/* OCR read box */}
        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '12px 14px', marginBottom: '1.25rem' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            What OCR detected from this script
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 4, fontSize: 13 }}>
            <span style={{ color: '#6b7280' }}>Name:</span>
            <span style={{ fontStyle: 'italic', fontWeight: 500 }}>"{student.ocr.ocr_name}"</span>
            <span style={{ color: '#6b7280' }}>Roll No.:</span>
            <span style={{ fontStyle: 'italic', fontWeight: 500 }}>"{student.ocr.ocr_roll}"</span>
          </div>
        </div>

        {/* best matches */}
        <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 10 }}>
          Best matches from your class roster
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: '1.25rem' }}>
          {filtered.slice(0, 5).map(c => {
            const isSel = selected === c.roll;
            return (
              <div
                key={c.roll}
                onClick={() => setSelected(c.roll)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 9, cursor: 'pointer',
                  border: `1.5px solid ${isSel ? '#2563eb' : '#e5e7eb'}`,
                  background: isSel ? '#eff6ff' : '#fff',
                  transition: 'all 0.15s',
                }}
              >
                <input type="radio" checked={isSel} onChange={() => setSelected(c.roll)}
                  style={{ accentColor: '#2563eb', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 13, color: '#111827' }}>{c.name}</p>
                  <p style={{ fontSize: 11, color: '#6b7280' }}>{c.roll}</p>
                </div>
                <ConfBar score={c.score} />
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
                  background: c.score >= 60 ? '#dcfce7' : '#fee2e2',
                  color: c.score >= 60 ? '#15803d' : '#dc2626',
                  minWidth: 38, textAlign: 'center',
                }}>
                  {c.score}%
                </span>
              </div>
            );
          })}
        </div>

        {/* manual search */}
        <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 8 }}>Or search manually:</p>
        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
          <Search size={14} color="#9ca3af" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            autoFocus
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or roll number..."
            style={{
              width: '100%', height: 36, paddingLeft: 32, paddingRight: 10,
              border: '1px solid #d1d5db', borderRadius: 8,
              fontSize: 13, fontFamily: 'inherit', outline: 'none',
            }}
          />
        </div>

        {/* footer */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', borderTop: '1px solid #f3f4f6', paddingTop: '1rem' }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="danger" icon={<XCircle size={14} />} onClick={onMarkUnmatched}>Mark as Unmatched</Button>
          <Button variant="primary" disabled={!selected} icon={<CheckCircle size={14} />} onClick={handleConfirm}>
            Confirm Match
          </Button>
        </div>
      </div>
    </div>
  );
}
