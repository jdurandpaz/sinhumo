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

  const api = { loadFilters };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SinHumoLoader = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
