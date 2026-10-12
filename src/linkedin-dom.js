// Todo lo que depende del HTML de LinkedIn vive aquí. LinkedIn cambia sus
// clases seguido: si el filtro deja de funcionar, este es el archivo a revisar.
(function (root) {
  'use strict';

  const POST_SELECTORS = [
    'div.feed-shared-update-v2',
    'div[data-urn^="urn:li:activity"]',
    'div[data-id^="urn:li:activity"]',
  ];

  const TEXT_SELECTORS = [
    '.update-components-text',
    '.feed-shared-inline-show-more-text',
    '.feed-shared-update-v2__description',
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

  root.SinHumoDom = { findPosts, postText };
})(globalThis);
