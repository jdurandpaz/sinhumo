// Recorre el feed, clasifica cada post y lo atenúa, oculta o etiqueta según la
// configuración. No hace ninguna acción en la cuenta: solo cambia lo que se ve.
(function () {
  'use strict';

  const DONE = 'data-sinhumo';
  const ALLOWED_KEY = 'permitidos';
  let engine = null;
  let settings = null;
  let allowed = new Set();

  function reasons(result) {
    return result.hits.map((h) => h.name).join(' · ');
  }

  function detail(result) {
    return result.hits
      .flatMap((h) => h.matches.map((m) => `${h.name}: ${m.description}`))
      .join('\n');
  }

  // Arma un issue prellenado en el repo del proyecto. Lleva solo el filtro,
  // las reglas y el puntaje: el texto del post no se envía (es de otra
  // persona); quien reporta puede agregar una versión anonimizada si quiere.
  function reportUrl(result) {
    const manifest = chrome.runtime.getManifest();
    const params = new URLSearchParams({
      template: 'falso-positivo.yml',
      title: `Falso positivo: ${result.hits.map((h) => h.filter).join(', ')}`,
      filtros: result.hits.map((h) => `${h.filter} (puntaje ${h.score}, umbral ${h.threshold})`).join('\n'),
      reglas: result.hits.flatMap((h) => h.matches.map((m) => m.id)).join('\n'),
      version: manifest.version,
    });
    return `${manifest.homepage_url}/issues/new?${params}`;
  }

  function remember(key) {
    if (!key) return;
    allowed.add(key);
    // Solo los últimos 500, para no crecer sin límite.
    chrome.storage.local.set({ [ALLOWED_KEY]: [...allowed].slice(-500) });
  }

  function button(text, onClick) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = text;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      onClick();
    });
    return btn;
  }

  // Las cajas visibles del post. LinkedIn envuelve el contenido en nodos con
  // display: contents, que no aceptan opacidad ni alto: hay que bajar a sus hijos.
  function blocks(el) {
    const out = [];
    for (const child of el.children) {
      if (child.classList.contains('sinhumo-bar')) continue;
      if (getComputedStyle(child).display === 'contents') out.push(...blocks(child));
      else out.push(child);
    }
    return out;
  }

  function reveal(post) {
    post.classList.remove(`sinhumo-${settings.mode}`);
    post.classList.add('sinhumo-revealed');
  }

  function decorate(post, result) {
    post.setAttribute(DONE, 'hit');
    post.classList.add(`sinhumo-${settings.mode}`);
    for (const el of blocks(post)) el.classList.add('sinhumo-block');

    const bar = document.createElement('div');
    bar.className = 'sinhumo-bar';
    bar.title = detail(result);

    const label = document.createElement('span');
    label.textContent = `sinhumo: ${reasons(result)}`;
    bar.appendChild(label);

    const actions = document.createElement('span');
    actions.className = 'sinhumo-actions';
    if (settings.mode !== 'etiquetar') {
      const show = button('Ver igual', () => {
        reveal(post);
        show.remove();
      });
      actions.appendChild(show);
    }
    // Falso positivo: se muestra, se recuerda para no volver a filtrarlo y se
    // abre el reporte para que la comunidad ajuste la regla.
    actions.appendChild(
      button('No es humo', () => {
        reveal(post);
        remember(SinHumoDom.postKey(post));
        label.textContent = 'sinhumo: marcado como falso positivo. ¡Gracias por reportarlo!';
        actions.remove();
        window.open(reportUrl(result), '_blank', 'noopener');
      })
    );
    bar.appendChild(actions);
    post.prepend(bar);
  }

  function scan(scope) {
    for (const post of SinHumoDom.findPosts(scope)) {
      if (post.hasAttribute(DONE)) continue;
      if (allowed.has(SinHumoDom.postKey(post))) {
        post.setAttribute(DONE, 'permitido');
        continue;
      }
      const promoted = SinHumoDom.isPromoted(post);
      const text = SinHumoDom.postText(post);
      if (!text && !promoted) continue; // Aún no carga el texto; se reintenta en la próxima mutación.
      const result = engine.classify(text, settings.enabled, { promoted });
      if (result.hit) decorate(post, result);
      else post.setAttribute(DONE, 'ok');
    }
  }

  chrome.runtime.sendMessage({ type: 'sinhumo:config' }, async (response) => {
    if (!response) return;
    engine = SinHumo.createEngine(response.config);
    settings = response.settings;
    const stored = await chrome.storage.local.get(ALLOWED_KEY);
    allowed = new Set(stored[ALLOWED_KEY] || []);
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
