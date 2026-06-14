import React from 'react';
import { LogOut } from 'lucide-react';

const TABS = [
  { id: 'build',    label: '0. Build Template' },
  { id: 'annotate', label: '1. Annotate' },
  { id: 'rubrics',  label: '2. Rubrics' },
  { id: 'upload',   label: '3. Upload PDFs' },
  { id: 'evaluate', label: '4. Evaluate' },
  { id: 'admin',    label: 'Admin Panel' },
];

export default function Navbar({ activeTab, onTabChange }) {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: '#fff', borderBottom: '1px solid #e5e7eb',
      display: 'flex', alignItems: 'center',
      padding: '0 2rem', height: 54, gap: 4,
    }}>
      <span style={{ fontWeight: 700, fontSize: 15, color: '#111827', marginRight: 20, whiteSpace: 'nowrap' }}>
        Grading Assistant
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id)}
            style={{
              padding: '5px 12px', borderRadius: 6, fontSize: 13,
              fontWeight: activeTab === t.id ? 600 : 400,
              color: activeTab === t.id ? '#2563eb' : '#6b7280',
              background: activeTab === t.id ? '#eff6ff' : 'transparent',
              border: activeTab === t.id ? '1.5px solid #bfdbfe' : '1.5px solid transparent',
              cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
              transition: 'all 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <button style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'none', border: 'none', color: '#6b7280',
        fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
      }}>
        <LogOut size={15} /> Logout
      </button>
    </nav>
  );
}
