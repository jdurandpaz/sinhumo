const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { createEngine } = require('../src/engine');
const { loadFilters } = require('../src/loader');

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
    const result = engine.classify(post.text);
    const hits = result.hits.map((h) => h.filter).sort();
    assert.deepStrictEqual(hits, [...post.expect].sort(), JSON.stringify(result.results, null, 2));
  });
}
