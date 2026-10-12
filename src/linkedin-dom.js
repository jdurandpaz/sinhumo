// Todo lo que depende del HTML de LinkedIn vive aquí. LinkedIn cambia sus
// clases seguido: si el filtro deja de funcionar, este es el archivo a revisar.
(function (root) {
  'use strict';

  // Desde 2026 LinkedIn usa clases ofuscadas (gfl...) que cambian en cada
  // deploy. Nos anclamos a roles y data-testid, que son más estables.
  // Verificado en el feed el 2026-10-11 (Chrome, macOS).
  const POST_SELECTORS = [
    '[data-testid="mainFeed"] [role="listitem"][componentkey^="update-card"]',
    // Respaldo: HTML anterior a 2026.
    'div.feed-shared-update-v2',
    'div[data-urn^="urn:li:activity"]',
  ];

  const TEXT_SELECTORS = [
    '[data-testid="expandable-text-box"]',
    // Respaldo: HTML anterior a 2026.
    '.update-components-text',
    '.feed-shared-inline-show-more-text',
  ];

  function findPosts(scope) {
    const found = new Set();
    for (const sel of POST_SELECTORS) scope.querySelectorAll(sel).forEach((el) => found.add(el));
    // Si hay contenedores anidados, quedarse con el más externo.
    return [...found].filter((el) => ![...found].some((other) => other !== el && other.contains(el)));
  }

  function postText(post) {
    for (const sel of TEXT_SELECTORS) {
      const el = post.querySelector(sel);
      if (el && el.innerText.trim()) return el.innerText;
    }
    return '';
  }

  // La etiqueta del anuncio va en el encabezado de la tarjeta, como una línea
  // propia: "Promocionado por LinkedIn", "Promocionado • Colaboración con X"
  // (es) o "Promoted" (en).
  const PROMOTED_LINE = /^(promocionado|patrocinado|promoted|sponsored)( por | by | [•·] |$)/i;

  function isPromoted(post) {
    return post.innerText.split('\n').slice(0, 25).some((l) => PROMOTED_LINE.test(l.trim()));
  }

  // Identificador estable del post dentro del feed, para recordar los que la
  // persona marcó como "no es humo".
  function postKey(post) {
    return post.getAttribute('componentkey') || post.getAttribute('data-urn') || null;
  }

  root.SinHumoDom = { findPosts, postText, isPromoted, postKey };
})(globalThis);
