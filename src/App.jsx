import React, { useState } from 'react';
import Navbar from './components/Navbar';
import UploadPage from './pages/UploadPage';
import EvaluatePage from './pages/EvaluatePage';
import PlaceholderPage from './pages/PlaceholderPage';
import { ROSTER_DEFAULT, OCR_DATA } from './data/mockData';
import { resolveAll } from './utils/fuzzyMatch';

export default function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [roster, setRoster] = useState(ROSTER_DEFAULT);
  const [files, setFiles] = useState([
    { name: 'combined_answer_sheets_cs201.pdf', size: '4.2 MB' }
  ]);
  const [pagesPerStudent, setPagesPerStudent] = useState(2);

  // Initialize students by matching OCR data against the initial roster.
  const [students, setStudents] = useState(() => resolveAll(OCR_DATA, ROSTER_DEFAULT));

  const handleNext = () => {
    // Re-resolve the mock OCR data against the current roster
    const resolved = resolveAll(OCR_DATA, roster);
    setStudents(resolved);
    setActiveTab('evaluate');
  };

  const handleStudentUpdate = (id, updatedFields) => {
    setStudents(prev =>
      prev.map(s => (s.id === id ? { ...s, ...updatedFields } : s))
    );
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f4f5f7' }}>
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main style={{ flex: 1 }}>
        {activeTab === 'upload' && (
          <UploadPage
            roster={roster}
            onRosterChange={setRoster}
            files={files}
            onFilesChange={setFiles}
            pagesPerStudent={pagesPerStudent}
            onPagesChange={setPagesPerStudent}
            onNext={handleNext}
          />
        )}
        
        {activeTab === 'evaluate' && (
          <EvaluatePage
            students={students}
            onStudentUpdate={handleStudentUpdate}
          />
        )}
        
        {activeTab !== 'upload' && activeTab !== 'evaluate' && (
          <PlaceholderPage tab={activeTab} />
        )}
      </main>
    </div>
  );
}
