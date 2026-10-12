// Motor de clasificación de sinhumo. Sin dependencias y sin red:
// corre igual en el content script (navegador) y en los tests (Node).
(function (root) {
  'use strict';

  // Minúsculas y sin tildes: las reglas se escriben sin acentos.
  function normalize(text) {
    return String(text || '')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase();
  }

  // Señales independientes del idioma. Reciben el texto y los metadatos del
  // post que entrega la capa de DOM (por ejemplo, si es un anuncio).
  const SIGNALS = {
    // Anuncio pagado ("Promocionado por LinkedIn").
    promoted(_text, meta) {
      return Boolean(meta && meta.promoted);
    },
    // "Broetry": muchas líneas cortas, una idea por línea.
    shortLines(text) {
      const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
      if (lines.length < 8) return false;
      const short = lines.filter((l) => l.split(/\s+/).length <= 8).length;
      return short / lines.length >= 0.7;
    },
    // Listas con emojis como viñetas.
    emojiBullets(text) {
      const lines = text.split('\n').map((l) => l.trim());
      return lines.filter((l) => /^\p{Extended_Pictographic}/u.test(l)).length >= 3;
    },
    // Negritas/cursivas con caracteres Unicode (𝗮𝘀í): no se escriben a mano en
    // LinkedIn, delatan texto pegado desde un generador.
    unicodeBold(text) {
      return (text.match(/[\u{1D400}-\u{1D7FF}]/gu) || []).length >= 6;
    },
    // Exceso de hashtags.
    hashtags(text) {
      return (text.match(/(^|\s)#[\p{L}\d_]+/gu) || []).length >= 5;
    },
  };

  function compile(rules) {
    return (rules || []).map((r) => ({ ...r, re: new RegExp(r.pattern, r.flags || 'm') }));
  }

  // filters: [{ id, name, threshold, reducedByAporta, signals, rules: [...] }]
  // aporta:  reglas de peso negativo (datos, código, fuentes).
  function createEngine({ filters, aporta }) {
    const compiled = filters.map((f) => ({ ...f, compiledRules: compile(f.rules) }));
    const aportaRules = compile(aporta);

    function classify(rawText, enabledIds, meta = {}) {
      const raw = String(rawText || '');
      const text = normalize(raw);
      const enabled = enabledIds ? new Set(enabledIds) : null;

      const aportaMatches = aportaRules.filter((r) => r.re.test(text));
      const aportaScore = aportaMatches.reduce((s, r) => s + r.weight, 0);

      const results = [];
      for (const f of compiled) {
        if (enabled && !enabled.has(f.id)) continue;
        const matches = [];
        for (const r of f.compiledRules) {
          if (r.re.test(text)) matches.push({ id: r.id, weight: r.weight, description: r.description });
        }
        for (const [name, weight] of Object.entries(f.signals || {})) {
          if (SIGNALS[name] && SIGNALS[name](raw, meta)) matches.push({ id: `signal:${name}`, weight, description: name });
        }
        let score = matches.reduce((s, m) => s + m.weight, 0);
        if (f.reducedByAporta && matches.length) score += aportaScore;
        if (!matches.length) continue;
        results.push({ filter: f.id, name: f.name, score, threshold: f.threshold, hit: score >= f.threshold, matches });
      }

      const hits = results.filter((r) => r.hit);
      return { hit: hits.length > 0, hits, results, aporta: aportaMatches.map((r) => r.id) };
    }

    return { classify };
  }

  const api = { createEngine, normalize, SIGNALS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SinHumo = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
