import React, { useState, useMemo } from 'react';
import {
  CheckCircle, XCircle, Download, Play,
  WifiOff, Trash2, AlertTriangle, Info,
} from 'lucide-react';
import { Button, Badge, Avatar, Card } from '../components/UI';
import ResolveModal from '../components/ResolveModal';
import { AVATAR_COLORS, MAX_SCORES } from '../data/mockData';

/* ─── Score badge ────────────────────────────────────────────────────────── */
function ScoreBadge({ value, max }) {
  const pct = max > 0 ? value / max : 0;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
      minWidth: 54, background: pct > 0 ? '#dcfce7' : '#f3f4f6',
      color: pct > 0 ? '#15803d' : '#9ca3af',
    }}>
      {value}/{max}
    </span>
  );
}

/* ─── Tooltip hover for match info ──────────────────────────────────────── */
function MatchTooltip({ student }) {
  const [show, setShow] = useState(false);
  const isMatched = student.status === 'matched';

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
        background: isMatched ? '#dcfce7' : '#fee2e2',
        color: isMatched ? '#15803d' : '#dc2626',
        cursor: 'default', userSelect: 'none',
      }}>
        {isMatched
          ? <><CheckCircle size={11} /> Matched</>
          : <><XCircle size={11} /> Unmatched</>}
      </span>

      {show && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%',
          transform: 'translateX(-50%)', background: '#1f2937',
          borderRadius: 10, padding: '10px 14px', fontSize: 11,
          color: '#f9fafb', whiteSpace: 'nowrap', zIndex: 300,
          boxShadow: '0 4px 20px rgba(0,0,0,0.18)', minWidth: 230,
          lineHeight: 1.8,
        }}>
          <p style={{ fontWeight: 600, marginBottom: 6, color: '#d1d5db', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            OCR read from script
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '55px 1fr', gap: '1px 8px' }}>
            <span style={{ color: '#9ca3af' }}>Name:</span>
            <span style={{ fontStyle: 'italic' }}>"{student.ocr.ocr_name}"</span>
            <span style={{ color: '#9ca3af' }}>Roll:</span>
            <span style={{ fontStyle: 'italic' }}>"{student.ocr.ocr_roll}"</span>
          </div>
          {isMatched && (
            <>
              <div style={{ borderTop: '1px solid #374151', margin: '8px 0' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '55px 1fr', gap: '1px 8px' }}>
                <span style={{ color: '#9ca3af' }}>Matched:</span>
                <span>{student.matched.name}</span>
                <span style={{ color: '#9ca3af' }}>Score:</span>
                <span style={{ color: '#4ade80', fontWeight: 700 }}>{student.score}% confidence</span>
              </div>
              <div style={{ height: 4, background: '#374151', borderRadius: 2, marginTop: 8 }}>
                <div style={{ width: `${student.score}%`, height: '100%', background: '#4ade80', borderRadius: 2 }} />
              </div>
            </>
          )}
          <p style={{ color: '#6b7280', fontSize: 10, marginTop: 8 }}>Click row to manually resolve</p>
          {/* tooltip arrow */}
          <div style={{
            position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '6px solid transparent', borderRight: '6px solid transparent',
            borderTop: '6px solid #1f2937',
          }} />
        </div>
      )}
    </div>
  );
}

/* ─── EvaluatePage ───────────────────────────────────────────────────────── */
export default function EvaluatePage({ students, onStudentUpdate }) {
  const [modalId, setModalId] = useState(null);
  const [selected, setSelected] = useState(new Set());

  const cols = Object.keys(MAX_SCORES);

  // Unmatched always rise to top; within groups, preserve original order
  const sorted = useMemo(() => {
    return [...students].sort((a, b) => {
      if (a.status === 'unmatched' && b.status !== 'unmatched') return -1;
      if (b.status === 'unmatched' && a.status !== 'unmatched') return 1;
      return a.id - b.id;
    });
  }, [students]);

  const unmatchedCount = students.filter(s => s.status === 'unmatched').length;
  const modalStudent = modalId !== null ? students.find(s => s.id === modalId) : null;

  const handleConfirm = (match) => {
    onStudentUpdate(modalId, { matched: match, status: 'matched', overridden: true });
    setModalId(null);
  };
  const handleMarkUnmatched = () => {
    onStudentUpdate(modalId, { matched: null, status: 'unmatched', score: 0 });
    setModalId(null);
  };

  const toggleSelect = id => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };
  const toggleAll = () => {
    selected.size === students.length ? setSelected(new Set()) : setSelected(new Set(students.map(s => s.id)));
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
      {/* top bar */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111827' }}>4. Evaluation</h2>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
            Names resolved by fuzzy matching. Hover the match badge for OCR details.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button icon={<WifiOff size={14} />}>Offline View</Button>
          <Button icon={<Download size={14} />} style={{ color: '#2563eb', borderColor: '#2563eb' }}>Export Excel</Button>
          <Button variant="danger" icon={<Trash2 size={14} />}>Finish &amp; Clear Memory</Button>
        </div>
      </div>

      {/* unmatched warning banner */}
      {unmatchedCount > 0 && (
        <div style={{
          background: '#fff7ed', border: '1px solid #fed7aa',
          borderRadius: 10, padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 10,
          marginBottom: '1.25rem',
        }}>
          <AlertTriangle size={18} color="#ea580c" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: 13, color: '#9a3412' }}>
            <strong>{unmatchedCount} student{unmatchedCount > 1 ? 's' : ''}</strong> could not be matched to the roster.
            Click their row to resolve manually.
          </p>
        </div>
      )}

      {/* legend */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#6b7280' }}>
          <CheckCircle size={13} color="#22c55e" /> Matched — identity confirmed from roster
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#6b7280' }}>
          <XCircle size={13} color="#ef4444" /> Unmatched — click row to resolve
        </div>
      </div>

      {/* table card */}
      <Card style={{ padding: 0, overflow: 'auto' }}>
        {/* table actions */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          gap: 8, padding: '10px 16px', borderBottom: '1px solid #f3f4f6',
        }}>
          <Button size="sm" icon={<Play size={12} />} variant="primary">
            Evaluate ({selected.size} tasks)
          </Button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ width: 40, padding: '10px 12px', borderBottom: '1px solid #e5e7eb' }}>
                <input type="checkbox" checked={selected.size === students.length}
                  onChange={toggleAll} style={{ accentColor: '#2563eb' }} />
              </th>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, fontSize: 12, color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>
                Student
              </th>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, fontSize: 12, color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>
                Match
              </th>
              {cols.map(c => (
                <th key={c} style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600, fontSize: 12, color: '#6b7280', borderBottom: '1px solid #e5e7eb', whiteSpace: 'nowrap' }}>
                  {c} <span style={{ fontWeight: 400, opacity: 0.6 }}>/{MAX_SCORES[c]}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((s, idx) => {
              const display = s.matched || { name: s.ocr.ocr_name === '???' ? 'Unknown Student' : s.ocr.ocr_name, roll: s.ocr.ocr_roll === '????' ? '—' : s.ocr.ocr_roll };
              const isUnknown = s.ocr.ocr_name === '???';
              const ac = AVATAR_COLORS[idx % AVATAR_COLORS.length];
              const isUnmatched = s.status === 'unmatched';

              return (
                <tr
                  key={s.id}
                  onClick={() => setModalId(s.id)}
                  style={{
                    cursor: 'pointer',
                    background: isUnmatched ? '#fff7f7' : 'transparent',
                    transition: 'background 0.12s',
                    borderLeft: isUnmatched ? '3px solid #fca5a5' : '3px solid transparent',
                  }}
                  onMouseEnter={e => { if (!isUnmatched) e.currentTarget.style.background = '#f9fafb'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = isUnmatched ? '#fff7f7' : 'transparent'; }}
                >
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid #f3f4f6' }}
                    onClick={e => { e.stopPropagation(); toggleSelect(s.id); }}>
                    <input type="checkbox" checked={selected.has(s.id)}
                      onChange={() => toggleSelect(s.id)} style={{ accentColor: '#2563eb' }} />
                  </td>

                  <td style={{ padding: '10px 12px', borderBottom: '1px solid #f3f4f6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar name={isUnknown ? 'UK' : display.name} bg={ac.bg} fg={ac.fg} />
                      <div>
                        <p style={{
                          fontWeight: 600, fontSize: 13,
                          color: isUnmatched ? '#dc2626' : isUnknown ? '#9ca3af' : '#111827',
                          fontStyle: isUnknown ? 'italic' : 'normal',
                        }}>
                          {isUnknown ? 'Unknown Student' : display.name}
                        </p>
                        <p style={{ fontSize: 11, color: '#9ca3af' }}>{display.roll}</p>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '10px 12px', borderBottom: '1px solid #f3f4f6' }}
                    onClick={e => e.stopPropagation()}>
                    <div onClick={() => setModalId(s.id)} style={{ cursor: 'pointer' }}>
                      <MatchTooltip student={s} />
                    </div>
                  </td>

                  {cols.map(c => (
                    <td key={c} style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '1px solid #f3f4f6' }}>
                      <ScoreBadge value={s.scores[c] || 0} max={MAX_SCORES[c]} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* Resolve modal */}
      {modalStudent && (
        <ResolveModal
          student={modalStudent}
          onClose={() => setModalId(null)}
          onConfirm={handleConfirm}
          onMarkUnmatched={handleMarkUnmatched}
        />
      )}
    </div>
  );
}
