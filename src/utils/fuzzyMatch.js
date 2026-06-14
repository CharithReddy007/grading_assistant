/**
 * fuzzyMatch.js
 * -------------
 * Standalone fuzzy matching module for student identity resolution.
 *
 * Strategy:
 *   1. Normalise both strings (lowercase, strip punctuation/whitespace).
 *   2. Compute Levenshtein edit-distance.
 *   3. Convert to a 0-100 similarity score.
 *   4. Match roll numbers independently; a roll-number exact/near-exact
 *      hit is treated as a confirmed match regardless of name similarity.
 *   5. Final verdict: "matched" or "unmatched" — no intermediate states.
 *
 * MATCH_THRESHOLD  – minimum combined score to call it a match (0-100).
 * ROLL_EXACT_BONUS – extra points added when the cleaned roll strings are
 *                    identical (handles OCR swaps like 0↔O, 1↔l).
 */

export const MATCH_THRESHOLD = 60;   // tune as needed
export const ROLL_EXACT_BONUS = 40;  // bumps score when rolls match exactly

/* ─── helpers ─────────────────────────────────────────────────────────────── */

/**
 * normalise: lowercase, collapse spaces, strip non-alphanumeric chars,
 * then also apply common OCR confusion substitutions so "2021CS0O7"
 * and "2021CS007" look the same.
 */
export function normalise(str = '') {
  return str
    .toLowerCase()
    .replace(/\s+/g, '')
    // OCR confusions
    .replace(/o/g, '0')   // letter O → digit 0
    .replace(/l/g, '1')   // lowercase l → digit 1
    .replace(/i/g, '1')   // lowercase i → digit 1
    .replace(/s/g, '5')   // S → 5
    .replace(/[^a-z0-9]/g, '');
}

/** Levenshtein edit distance (classic DP). */
export function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  // initialise (m+1) × (n+1) grid
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

/**
 * stringSimilarity: returns a 0-100 score based on edit distance.
 * Both inputs are normalised before comparison.
 */
export function stringSimilarity(a = '', b = '') {
  const na = normalise(a);
  const nb = normalise(b);
  if (!na || !nb) return 0;
  if (na === nb) return 100;
  const dist = levenshtein(na, nb);
  return Math.round((1 - dist / Math.max(na.length, nb.length)) * 100);
}

/* ─── core matching ────────────────────────────────────────────────────────── */

/**
 * scoreCandidate
 * Returns a combined 0-100 score for one (ocrRecord, rosterEntry) pair.
 *
 * @param {{ ocr_name: string, ocr_roll: string }} ocr
 * @param {{ name: string, roll: string }} candidate
 * @returns {number}
 */
export function scoreCandidate(ocr, candidate) {
  const nameSim = stringSimilarity(ocr.ocr_name, candidate.name);
  const rollSim = stringSimilarity(ocr.ocr_roll, candidate.roll);

  // Exact roll match after normalisation → guaranteed high score
  const rollExact = normalise(ocr.ocr_roll) === normalise(candidate.roll);
  const rollBonus = rollExact ? ROLL_EXACT_BONUS : 0;

  // Weighted combination: roll is the stronger signal
  const combined = Math.round(rollSim * 0.65 + nameSim * 0.35 + rollBonus);

  // Cap at 100
  return Math.min(combined, 100);
}

/**
 * rankCandidates
 * Returns roster sorted by descending match score for a single OCR record.
 *
 * @param {{ ocr_name: string, ocr_roll: string }} ocr
 * @param {Array<{ name: string, roll: string }>} roster
 * @returns {Array<{ name: string, roll: string, score: number, nameSim: number, rollSim: number }>}
 */
export function rankCandidates(ocr, roster) {
  return roster
    .map((candidate) => ({
      ...candidate,
      score: scoreCandidate(ocr, candidate),
      nameSim: stringSimilarity(ocr.ocr_name, candidate.name),
      rollSim: stringSimilarity(ocr.ocr_roll, candidate.roll),
    }))
    .sort((a, b) => b.score - a.score);
}

/**
 * resolveIdentity
 * Given an OCR record and a roster, returns the best match (or null) and
 * a binary verdict: "matched" | "unmatched".
 *
 * @param {{ ocr_name: string, ocr_roll: string }} ocr
 * @param {Array<{ name: string, roll: string }>} roster
 * @returns {{
 *   matched: { name: string, roll: string } | null,
 *   status: 'matched' | 'unmatched',
 *   score: number,
 *   nameSim: number,
 *   rollSim: number,
 *   allCandidates: Array
 * }}
 */
export function resolveIdentity(ocr, roster) {
  if (!roster || roster.length === 0) {
    return { matched: null, status: 'unmatched', score: 0, nameSim: 0, rollSim: 0, allCandidates: [] };
  }

  const ranked = rankCandidates(ocr, roster);
  const best = ranked[0];

  const isMatched = best.score >= MATCH_THRESHOLD;

  return {
    matched: isMatched ? { name: best.name, roll: best.roll } : null,
    status: isMatched ? 'matched' : 'unmatched',
    score: best.score,
    nameSim: best.nameSim,
    rollSim: best.rollSim,
    allCandidates: ranked,
  };
}

/**
 * resolveAll
 * Batch-resolve an array of OCR records against a roster.
 *
 * @param {Array<{ ocr_name: string, ocr_roll: string, scores: object }>} ocrData
 * @param {Array<{ name: string, roll: string }>} roster
 * @returns {Array}
 */
export function resolveAll(ocrData, roster) {
  return ocrData.map((ocr, idx) => ({
    id: idx,
    ocr,
    scores: ocr.scores,
    ...resolveIdentity(ocr, roster),
  }));
}
