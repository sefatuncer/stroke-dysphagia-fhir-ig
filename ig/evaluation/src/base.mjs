// Read the stroke base-patient cohort (demographic spine) from the Synthea CSV export.
// Shared by generate-cohort.mjs and sensitivity.mjs so both use exactly the same cohort.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

function parseCsvLine(line) {
  const out = []; let cur = '', q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') q = false;
      else cur += c;
    } else {
      if (c === '"') q = true;
      else if (c === ',') { out.push(cur); cur = ''; }
      else cur += c;
    }
  }
  out.push(cur);
  return out;
}
function readCsv(path) {
  const lines = readFileSync(path, 'utf8').split(/\r?\n/).filter(l => l.length);
  const header = parseCsvLine(lines[0]);
  const idx = Object.fromEntries(header.map((h, i) => [h.trim().toUpperCase(), i]));
  return { idx, rows: lines.slice(1) };
}

export function readBasePatients(csvDir, strokeCode = '230690007') {
  const cond = readCsv(join(csvDir, 'conditions.csv'));
  const cPat = cond.idx['PATIENT'], cCode = cond.idx['CODE'];
  const strokeIds = new Set();
  for (const row of cond.rows) { const f = parseCsvLine(row); if (f[cCode] === strokeCode) strokeIds.add(f[cPat]); }

  const pat = readCsv(join(csvDir, 'patients.csv'));
  const pId = pat.idx['ID'], pBirth = pat.idx['BIRTHDATE'], pGender = pat.idx['GENDER'],
        pFirst = pat.idx['FIRST'], pLast = pat.idx['LAST'];
  const base = [];
  for (const row of pat.rows) {
    const f = parseCsvLine(row);
    if (!strokeIds.has(f[pId])) continue;
    base.push({
      id: f[pId],
      birthDate: f[pBirth] || undefined,
      gender: (f[pGender] || '').toLowerCase() === 'm' ? 'male'
            : (f[pGender] || '').toLowerCase() === 'f' ? 'female' : 'unknown',
      name: (f[pFirst] || f[pLast]) ? [{ family: f[pLast] || 'Synthetic', given: [f[pFirst] || 'Patient'] }] : undefined,
    });
  }
  base.sort((a, b) => a.id.localeCompare(b.id)); // deterministic order
  return base;
}
