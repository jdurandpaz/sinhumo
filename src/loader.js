// Arma la configuración del motor a partir de filters/. Recibe una función
// readJson(ruta) para funcionar igual con fetch (extensión) y fs (tests).
(function (root) {
  'use strict';

  async function loadFilters(readJson, languages) {
    const index = await readJson('filters/index.json');
    const langs = languages && languages.length ? languages : index.languages;

    async function rulesFor(dir) {
      const all = [];
      for (const lang of langs) {
        if (!index.languages.includes(lang)) continue;
        try {
          all.push(...(await readJson(`filters/${dir}/${lang}.json`)));
        } catch (_) {
          // El filtro todavía no tiene reglas en este idioma.
        }
      }
      return all;
    }

    const filters = [];
    for (const id of index.filters) {
      const meta = await readJson(`filters/${id}/filter.json`);
      filters.push({ ...meta, rules: await rulesFor(id) });
    }
    return { filters, aporta: await rulesFor(index.aporta), languages: index.languages };
  }

  // Nivel de exigencia: escala el umbral de los filtros de forma (humo,
  // piloto, autobombo, cebo). Los de tema y los anuncios ("nivel": false)
  // quedan fijos: un tema no se filtra "más fuerte" por mencionarlo de pasada.
  const LEVELS = { estricto: 0.6, equilibrado: 1, suave: 1.5 };
  const DEFAULT_LEVEL = 'estricto';

  function effectiveThreshold(filter, settings = {}) {
    const custom = settings.thresholds && settings.thresholds[filter.id];
    if (custom != null) return custom;
    if (filter.nivel === false) return filter.threshold;
    const factor = LEVELS[settings.level] || LEVELS[DEFAULT_LEVEL];
    return Math.max(1, Math.round(filter.threshold * factor * 2) / 2);
  }

  const api = { loadFilters, effectiveThreshold, LEVELS, DEFAULT_LEVEL };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SinHumoLoader = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
