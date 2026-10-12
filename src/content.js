// Recorre el feed, clasifica cada post y lo atenúa, oculta o etiqueta según la
// configuración. No hace ninguna acción en la cuenta: solo cambia lo que se ve.
(function () {
  'use strict';

  const DONE = 'data-sinhumo';
  let engine = null;
  let settings = null;

  function reasons(result) {
    return result.hits.map((h) => h.name).join(' · ');
  }

  function detail(result) {
    return result.hits
      .flatMap((h) => h.matches.map((m) => `${h.name}: ${m.description}`))
      .join('\n');
  }

  function decorate(post, result) {
    post.setAttribute(DONE, 'hit');
    post.classList.add(`sinhumo-${settings.mode}`);

    const bar = document.createElement('div');
    bar.className = 'sinhumo-bar';
    bar.title = detail(result);

    const label = document.createElement('span');
    label.textContent = `sinhumo: ${reasons(result)}`;
    bar.appendChild(label);

    if (settings.mode !== 'etiquetar') {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = 'Ver igual';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        post.classList.remove(`sinhumo-${settings.mode}`);
        post.classList.add('sinhumo-revealed');
        btn.remove();
      });
      bar.appendChild(btn);
    }
    post.prepend(bar);
  }

  function scan(scope) {
    for (const post of SinHumoDom.findPosts(scope)) {
      if (post.hasAttribute(DONE)) continue;
      const text = SinHumoDom.postText(post);
      if (!text) continue; // Aún no carga el texto; se reintenta en la próxima mutación.
      const result = engine.classify(text, settings.enabled);
      if (result.hit) decorate(post, result);
      else post.setAttribute(DONE, 'ok');
    }
  }

  chrome.runtime.sendMessage({ type: 'sinhumo:config' }, (response) => {
    if (!response) return;
    engine = SinHumo.createEngine(response.config);
    settings = response.settings;
    scan(document);

    let pending = false;
    new MutationObserver(() => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        scan(document);
      });
    }).observe(document.body, { childList: true, subtree: true });
  });
})();
