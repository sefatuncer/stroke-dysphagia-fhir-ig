// ============================================================================
// compile-cql.mjs — translate CQL → ELM JSON via the cqframework translation
// service (Docker), so the rule can be executed by a real CQL engine.
//
// Prereq (documented in README.md): the translation service is running, e.g.
//   docker run -d --name cql-xlate -p 8083:8080 cqframework/cql-translation-service:latest
//
// Inputs : cql-src/*.cql  (AspirationRiskAlert.cql + FHIRHelpers.cql)
// Outputs: elm/*.json      (one ELM library per source file)
// ============================================================================
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dir, 'cql-src');
const ELM = join(__dir, 'elm');
const SERVICE = process.env.CQL_SERVICE || 'http://localhost:8083/cql/translator?annotations=true&locators=true';

if (!existsSync(ELM)) mkdirSync(ELM, { recursive: true });

// Build one multipart request with every CQL library so `include`s resolve.
const form = new FormData();
const files = readdirSync(SRC).filter(f => f.endsWith('.cql'));
for (const f of files) {
  const name = f.replace(/\.cql$/, '');
  form.append(name, new Blob([readFileSync(join(SRC, f))], { type: 'application/cql' }), f);
}
console.log(`POST ${files.length} CQL libraries → ${SERVICE}`);
const res = await fetch(SERVICE, { method: 'POST', body: form });
if (!res.ok) { console.error(`Translation service HTTP ${res.status}`); process.exit(1); }

// Parse the multipart/form-data response into per-library ELM.
const ctype = res.headers.get('content-type') || '';
const boundary = /boundary=(?:"([^"]+)"|([^;]+))/.exec(ctype)?.[1] ?? /boundary=(?:"([^"]+)"|([^;]+))/.exec(ctype)?.[2];
const raw = await res.text();
if (!boundary) { console.error('No multipart boundary in response'); process.exit(1); }

let errorCount = 0;
for (const part of raw.split(`--${boundary}`)) {
  const m = /name="([^"]+)"/.exec(part);
  const bodyStart = part.indexOf('{');
  if (!m || bodyStart < 0) continue;
  const name = m[1];
  const json = part.slice(bodyStart).trim().replace(/\r?\n$/, '');
  let elm;
  try { elm = JSON.parse(json); } catch { continue; }
  const errs = (elm.library?.annotation || []).filter(a => a.errorSeverity === 'error');
  errorCount += errs.length;
  if (errs.length) errs.forEach(e => console.error(`  [${name}] ${e.message}`));
  writeFileSync(join(ELM, `${name}.json`), JSON.stringify(elm));
  console.log(`  ✓ ${name}.json (${errs.length} errors)`);
}
if (errorCount) { console.error(`\n❌ ${errorCount} translation error(s)`); process.exit(1); }
console.log('\n✅ ELM compiled clean → elm/');
