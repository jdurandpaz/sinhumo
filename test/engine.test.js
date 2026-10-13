const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { createEngine } = require('../src/engine');
const { loadFilters, effectiveThreshold } = require('../src/loader');

const root = path.join(__dirname, '..');
const readJson = async (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const posts = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/posts.json'), 'utf8'));

test('todas las reglas compilan y tienen id único', async () => {
  const config = await loadFilters(readJson);
  const ids = new Set();
  for (const r of [...config.filters.flatMap((f) => f.rules), ...config.aporta]) {
    assert.doesNotThrow(() => new RegExp(r.pattern, r.flags || 'm'), r.id);
    assert.ok(!ids.has(r.id), `id repetido: ${r.id}`);
    assert.strictEqual(r.pattern, r.pattern.normalize('NFD').replace(/[̀-ͯ]/g, ''), `${r.id} tiene tildes`);
    ids.add(r.id);
  }
});

for (const post of posts) {
  test(`fixture: ${post.name}`, async () => {
    const engine = createEngine(await loadFilters(readJson));
    const result = engine.classify(post.text, null, post.meta);
    const hits = result.hits.map((h) => h.filter).sort();
    assert.deepStrictEqual(hits, [...post.expect].sort(), JSON.stringify(result.results, null, 2));
  });
}

async function engineAt(level) {
  const config = await loadFilters(readJson);
  for (const f of config.filters) f.threshold = effectiveThreshold(f, { level });
  return createEngine(config);
}

test('nivel de exigencia: escala solo los filtros de forma', async () => {
  const { filters } = await loadFilters(readJson);
  const byId = Object.fromEntries(filters.map((f) => [f.id, f]));
  assert.strictEqual(effectiveThreshold(byId.humo, { level: 'estricto' }), 2.5);
  assert.strictEqual(effectiveThreshold(byId.humo, { level: 'equilibrado' }), 4);
  assert.strictEqual(effectiveThreshold(byId.humo, { level: 'suave' }), 6);
  assert.strictEqual(effectiveThreshold(byId.humo, {}), 2.5, 'el nivel por defecto es estricto');
  assert.strictEqual(effectiveThreshold(byId.politica, { level: 'estricto' }), byId.politica.threshold);
  assert.strictEqual(effectiveThreshold(byId.promocionados, { level: 'estricto' }), byId.promocionados.threshold);
  assert.strictEqual(effectiveThreshold(byId.humo, { level: 'estricto', thresholds: { humo: 5 } }), 5);
});

// En estricto se acepta filtrar más, pero lo que aporta tiene que seguir pasando.
for (const post of posts.filter((p) => !p.expect.length || p.expectStrict)) {
  test(`fixture en estricto: ${post.name}`, async () => {
    const engine = await engineAt('estricto');
    const result = engine.classify(post.text, null, post.meta);
    const hits = result.hits.map((h) => h.filter).sort();
    const expected = post.expectStrict || post.expect;
    if (post.expectStrict) assert.deepStrictEqual(hits, [...expected].sort(), JSON.stringify(result.results, null, 2));
    else assert.deepStrictEqual(hits.filter((h) => !['promocionados'].includes(h)), [], JSON.stringify(result.results, null, 2));
  });
}
