import React, { useRef, useState } from 'react';
import {
  Upload, FileSpreadsheet, X, Plus, Trash2,
  Info, FileText, ChevronRight,
} from 'lucide-react';
import { Button, Card, Label, Input, Divider } from '../components/UI';

/* ─── CSV parser ─────────────────────────────────────────────────────────── */
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const header = lines[0].split(',').map(h => h.trim().toLowerCase());
  const nameIdx = header.findIndex(h => h.includes('name'));
  const rollIdx = header.findIndex(h => h.includes('roll') || h.includes('id'));
  if (nameIdx === -1 || rollIdx === -1) return null;
  return lines.slice(1)
    .map(l => {
      const cols = l.split(',');
      return { name: (cols[nameIdx] || '').trim(), roll: (cols[rollIdx] || '').trim() };
    })
    .filter(r => r.name || r.roll);
}

/* ─── Dropzone ───────────────────────────────────────────────────────────── */
function Dropzone({ onFile }) {
  const [drag, setDrag] = useState(false);
  const ref = useRef();

  const handle = file => {
    const reader = new FileReader();
    reader.onload = e => {
      const parsed = parseCSV(e.target.result);
      if (parsed) onFile(parsed);
      else alert('Could not parse CSV. Ensure columns: Name, RollNumber');
    };
    reader.readAsText(file);
  };

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) handle(f); }}
      onClick={() => ref.current.click()}
      style={{
        border: `2px dashed ${drag ? '#2563eb' : '#d1d5db'}`,
        borderRadius: 12, padding: '2.5rem 1.5rem',
        textAlign: 'center', cursor: 'pointer',
        background: drag ? '#eff6ff' : '#fafafa',
        transition: 'all 0.2s',
      }}
    >
      <input ref={ref} type="file" accept=".csv" style={{ display: 'none' }}
        onChange={e => { if (e.target.files[0]) handle(e.target.files[0]); }} />
      <FileSpreadsheet size={36} color={drag ? '#2563eb' : '#9ca3af'} style={{ marginBottom: 12 }} />
      <p style={{ fontWeight: 600, fontSize: 14, color: '#374151', marginBottom: 4 }}>
        Drop your class roster CSV here
      </p>
      <p style={{ fontSize: 12, color: '#9ca3af' }}>
        or <span style={{ color: '#2563eb', textDecoration: 'underline' }}>browse file</span>
      </p>
      <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 8 }}>Required columns: Name, RollNumber</p>
      <pre style={{
        display: 'inline-block', marginTop: 10, padding: '8px 14px',
        background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8,
        fontSize: 11, color: '#6b7280', textAlign: 'left', lineHeight: 1.7,
      }}>
        {`Name,RollNumber\nArjun Sharma,2021CS001\nPriya Nair,2021CS002`}
      </pre>
    </div>
  );
}

/* ─── RosterTable ────────────────────────────────────────────────────────── */
function RosterTable({ roster, onChange, onClear }) {
  const update = (i, key, val) => {
    const next = roster.map((r, idx) => idx === i ? { ...r, [key]: val } : r);
    onChange(next);
  };
  const remove = i => onChange(roster.filter((_, idx) => idx !== i));
  const add = () => onChange([...roster, { name: '', roll: '' }]);

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
      {/* header bar */}
      <div style={{
        background: '#f9fafb', padding: '10px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid #e5e7eb',
      }}>
        <span style={{ fontWeight: 600, fontSize: 13, color: '#374151', display: 'flex', alignItems: 'center', gap: 6 }}>
          <FileSpreadsheet size={15} color="#2563eb" />
          {roster.length} student{roster.length !== 1 ? 's' : ''} loaded
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" icon={<Upload size={12} />} onClick={onClear}>Replace CSV</Button>
          <Button size="sm" variant="ghost" icon={<Trash2 size={12} color="#dc2626" />} onClick={() => onChange([])}>Clear</Button>
        </div>
      </div>

      {/* column headers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 36px', gap: 8, padding: '8px 16px 4px', borderBottom: '1px solid #f3f4f6' }}>
        <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600 }}>NAME</span>
        <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600 }}>ROLL NUMBER</span>
      </div>

      {/* rows */}
      <div style={{ maxHeight: 260, overflowY: 'auto' }}>
        {roster.map((r, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 36px',
            gap: 8, padding: '6px 16px',
            borderBottom: '1px solid #f9fafb',
          }}>
            <Input value={r.name} onChange={v => update(i, 'name', v)} placeholder="Student name"
              style={{ height: 30, fontSize: 12 }} />
            <Input value={r.roll} onChange={v => update(i, 'roll', v)} placeholder="Roll number"
              style={{ height: 30, fontSize: 12 }} />
            <button onClick={() => remove(i)} style={{
              width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', borderRadius: 6,
            }}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* add row */}
      <button onClick={add} style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 6,
        padding: '8px 16px', background: 'none', border: 'none',
        borderTop: '1px dashed #e5e7eb', color: '#2563eb',
        fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
      }}>
        <Plus size={14} /> Add student
      </button>
    </div>
  );
}

/* ─── File list ──────────────────────────────────────────────────────────── */
function FileList({ files, onRemove, onAdd }) {
  const ref = useRef();
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <Label style={{ marginBottom: 0 }}>Student PDF scripts</Label>
        <Button size="sm" variant="primary" icon={<Upload size={12} />} onClick={() => ref.current.click()}>
          Select PDFs
        </Button>
        <input ref={ref} type="file" accept=".pdf" multiple style={{ display: 'none' }}
          onChange={e => {
            Array.from(e.target.files).forEach(f => onAdd({ name: f.name, size: `${(f.size / 1048576).toFixed(1)} MB` }));
          }} />
      </div>
      <div style={{
        border: '1px dashed #d1d5db', borderRadius: 10, padding: '1rem',
        minHeight: 80, display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {files.length === 0
          ? <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: 13, padding: '0.5rem' }}>No files selected</p>
          : files.map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 12px', background: '#f9fafb',
              borderRadius: 8, border: '1px solid #e5e7eb',
            }}>
              <FileText size={18} color="#2563eb" />
              <span style={{ flex: 1, fontWeight: 500, fontSize: 12, color: '#374151' }}>{f.name}</span>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>{f.size}</span>
              <button onClick={() => onRemove(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex' }}>
                <X size={14} />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

/* ─── UploadPage ─────────────────────────────────────────────────────────── */
export default function UploadPage({ roster, onRosterChange, files, onFilesChange, pagesPerStudent, onPagesChange, onNext }) {
  const [rosterLoaded, setRosterLoaded] = useState(roster.length > 0);

  const handleCSV = parsed => { onRosterChange(parsed); setRosterLoaded(true); };
  const handleClear = () => { setRosterLoaded(false); onRosterChange([]); };

  return (
    <div style={{ padding: '2rem', maxWidth: 860, margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111827' }}>3. Upload &amp; Parse Student Scripts</h2>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
          Upload your class roster and student PDF scripts to begin grading.
        </p>
      </div>

      {/* Configuration */}
      <Card style={{ marginBottom: '1rem' }}>
        <Label>Configuration</Label>
        <div>
          <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Default pages per student</p>
          <Input
            type="number"
            value={String(pagesPerStudent)}
            onChange={v => onPagesChange(Number(v))}
            style={{ maxWidth: 160 }}
          />
          <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
            Used to split a combined PDF into individual student scripts.
          </p>
        </div>
      </Card>

      {/* Class Roster */}
      <Card style={{ marginBottom: '1rem' }}>
        <Label>Class Roster</Label>
        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
          Upload a CSV or enter student names and roll numbers manually. Used to match OCR-read identities during evaluation.
        </p>

        {rosterLoaded
          ? <RosterTable roster={roster} onChange={onRosterChange} onClear={handleClear} />
          : (
            <>
              <Dropzone onFile={handleCSV} />
              <Button
                size="sm"
                style={{ marginTop: 10 }}
                icon={<Plus size={12} />}
                onClick={() => { setRosterLoaded(true); onRosterChange([{ name: '', roll: '' }]); }}
              >
                Enter manually instead
              </Button>
            </>
          )}

        <div style={{
          marginTop: 14, padding: '10px 14px', background: '#eff6ff',
          border: '1px solid #bfdbfe', borderRadius: 8,
          display: 'flex', gap: 8, alignItems: 'flex-start',
        }}>
          <Info size={15} color="#2563eb" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: '#1d4ed8', lineHeight: 1.5 }}>
            OCR-extracted names and roll numbers will be fuzzy-matched against this roster.
            Matched entries show the corrected name; unmatched ones are flagged for manual review.
          </p>
        </div>
      </Card>

      {/* PDFs */}
      <Card>
        <FileList
          files={files}
          onRemove={i => onFilesChange(files.filter((_, idx) => idx !== i))}
          onAdd={f => onFilesChange([...files, f])}
        />

        <Divider />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <Button>Back</Button>
          <Button
            variant="primary"
            disabled={files.length === 0}
            onClick={onNext}
            icon={<ChevronRight size={14} />}
          >
            Parse Locally &amp; Proceed
          </Button>
        </div>
      </Card>
    </div>
  );
}
