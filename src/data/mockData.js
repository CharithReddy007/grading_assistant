export const ROSTER_DEFAULT = [
  { name: 'Arjun Sharma',  roll: '2021CS001' },
  { name: 'Priya Nair',    roll: '2021CS002' },
  { name: 'Rohit Verma',   roll: '2021CS003' },
  { name: 'Mehta Suresh',  roll: '2021CS004' },
  { name: 'Lakshmi Rao',   roll: '2021CS005' },
  { name: 'Sneha Iyer',    roll: '2021CS006' },
  { name: 'Kiran Kumar',   roll: '2021CS007' },
];

// Simulated OCR output — intentionally noisy
export const OCR_DATA = [
  { ocr_name: 'Arjun Sharm',  ocr_roll: '2021CS001', scores: { Q1: 16, Q3: 0,  Q4: 4, Q5: 0, Q6: 7,  Q7: 4.5 } },
  { ocr_name: 'P. Nair',      ocr_roll: '2021CS002', scores: { Q1: 7,  Q3: 9,  Q4: 9, Q5: 8, Q6: 5,  Q7: 4.5 } },
  { ocr_name: 'Rohit Verma',  ocr_roll: '2021CS003', scores: { Q1: 22, Q3: 1,  Q4: 5, Q5: 0, Q6: 5,  Q7: 1.5 } },
  { ocr_name: 'Meh—ta S',     ocr_roll: '20210S04',  scores: { Q1: 0,  Q3: 0,  Q4: 0, Q5: 0, Q6: 0,  Q7: 0   } },
  { ocr_name: '???',           ocr_roll: '????',       scores: { Q1: 0,  Q3: 0,  Q4: 0, Q5: 0, Q6: 0,  Q7: 0   } },
  { ocr_name: 'Sneha lyer',   ocr_roll: '2021CS006', scores: { Q1: 0,  Q3: 0,  Q4: 0, Q5: 0, Q6: 0,  Q7: 0   } },
  { ocr_name: 'Kiran Kumar',  ocr_roll: '2021CS0O7', scores: { Q1: 0,  Q3: 0,  Q4: 0, Q5: 0, Q6: 0,  Q7: 0   } },
];

export const MAX_SCORES = { Q1: 30, Q3: 10, Q4: 10, Q5: 10, Q6: 10, Q7: 5 };

export const AVATAR_COLORS = [
  { bg: '#dbeafe', fg: '#1e40af' },
  { bg: '#fce7f3', fg: '#9d174d' },
  { bg: '#dcfce7', fg: '#15803d' },
  { bg: '#fef9c3', fg: '#a16207' },
  { bg: '#ede9fe', fg: '#5b21b6' },
  { bg: '#ffedd5', fg: '#c2410c' },
  { bg: '#cffafe', fg: '#0e7490' },
];
