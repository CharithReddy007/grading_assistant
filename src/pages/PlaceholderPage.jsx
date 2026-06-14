import React from 'react';
import { Card } from '../components/UI';

const TITLES = {
  build:    '0. Build Template',
  annotate: '1. Annotate Answer Script',
  rubrics:  '2. Define Rubrics',
  admin:    'Admin Panel',
};

export default function PlaceholderPage({ tab }) {
  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <Card>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>{TITLES[tab] || tab}</h2>
        <p style={{ color: '#6b7280', fontSize: 13 }}>
          This section is part of the existing Grading Assistant application.
        </p>
      </Card>
    </div>
  );
}
