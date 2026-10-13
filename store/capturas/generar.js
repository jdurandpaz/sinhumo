// Genera las capturas de la Chrome Web Store con posts sintéticos (posts.json),
// clasificados con el motor real y decorados con el CSS real de la extensión.
// Uso: npm run capturas  (necesita Google Chrome instalado)
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { createEngine } = require('../../src/engine');
const { loadFilters, effectiveThreshold } = require('../../src/loader');

const root = path.join(__dirname, '..', '..');
const out = path.join(__dirname, '.build');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const readJson = async (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const url = (p) => 'file://' + path.join(root, p);

const STYLE = `
  * { box-sizing: border-box; }
  body { margin: 0; width: 1280px; height: 800px; display: flex; overflow: hidden;
         font: 14px/1.45 -apple-system, system-ui, sans-serif; color: #1f1f1f; }
  .panel { width: 420px; background: #1f2430; color: #fff; padding: 72px 48px; display: flex; flex-direction: column; }
  .panel img { width: 96px; height: 96px; margin: 0 0 40px -14px; }
  .panel h1 { font-size: 38px; line-height: 1.15; margin: 0 0 20px; letter-spacing: -0.5px; }
  .panel p { font-size: 18px; line-height: 1.5; color: #aab2bd; margin: 0; }
  .panel .marca { margin-top: auto; color: #f4b740; font-weight: 600; letter-spacing: 0.3px; }
  .feed { flex: 1; background: #f3f2ef; padding: 40px 0; overflow: hidden; }
  .col { width: 560px; margin: 0 auto; display: flex; flex-direction: column; gap: 12px; }
  .post { background: #fff; border: 1px solid #e0dfdc; border-radius: 10px; overflow: hidden; }
  .head { display: flex; gap: 10px; align-items: center; padding: 14px 16px 6px; }
  .avatar { width: 44px; height: 44px; border-radius: 50%; background: #cfd5dd; color: #4a505d;
            display: flex; align-items: center; justify-content: center; font-weight: 600; }
  .head b { display: block; } .head span { color: #666; font-size: 12px; }
  .text { padding: 6px 16px 12px; white-space: pre-line; }
  .foot { display: flex; justify-content: space-around; border-top: 1px solid #ebeae7; padding: 8px; color: #666; font-size: 13px; }
`;

function panel(title, body) {
  return `<div class="panel"><img src="${url('icons/icon.svg')}" alt="">
    <h1>${title}</h1><p>${body}</p><div class="marca">sinhumo · open source</div></div>`;
}

// state: undefined (pasa), 'hit' (atenuado con barra) o 'reportado' (tras "No es humo").
function post(p, state, result) {
  const block = state === 'hit' ? ' class="sinhumo-block"' : '';
  let bar = '';
  if (state === 'hit') {
    const names = result.hits.map((h) => h.name).join(' · ');
    bar = `<div class="sinhumo-bar"><span>sinhumo: ${esc(names)}</span>
      <span class="sinhumo-actions"><button>Ver igual</button><button>No es humo</button></span></div>`;
  } else if (state === 'reportado') {
    bar = '<div class="sinhumo-bar"><span>sinhumo: marcado como falso positivo. ¡Gracias por reportarlo!</span></div>';
  }
  const initials = p.autor.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  return `<div class="post${state === 'hit' ? ' sinhumo-atenuar' : ''}">${bar}
    <div${block}><div class="head"><div class="avatar">${initials}</div><div><b>${esc(p.autor)}</b><span>${esc(p.rol)}</span></div></div></div>
    <div${block}><div class="text">${esc(p.texto)}</div></div>
    <div${block}><div class="foot"><span>Me gusta</span><span>Comentar</span><span>Compartir</span></div></div>
  </div>`;
}

function page(body, extraHead = '') {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8">
    <link rel="stylesheet" href="${url('src/content.css')}">${extraHead}<style>${STYLE}</style></head><body>${body}</body></html>`;
}

function optionsPage(config) {
  const rows = config.filters.map((f) => `<div class="filter">
      <label><input type="checkbox"${f.defaultEnabled ? ' checked' : ''}> ${esc(f.name)}</label>
      <input type="number" placeholder="${effectiveThreshold(f, { level: 'estricto' })}"><p>${esc(f.description)}</p></div>`).join('');
  return `<!doctype html><html lang="es"><head><meta charset="utf-8">
    <link rel="stylesheet" href="${url('options/options.css')}"><style>${STYLE}
    .feed { background: #fff; padding: 0; } .feed main { padding-top: 36px; transform: scale(0.7); transform-origin: top center; }
    .filter p { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
    </style></head><body>
    ${panel('Tú eliges qué tan estricto', 'Viene en Estricto. Si te apaga posts que sí valían, bajas a Equilibrado o Suave. Los filtros de temas, como política, vienen apagados y apartan el tema completo, de todos los sectores por igual.')}
    <div class="feed"><main><h1>sinhumo</h1>
      <p class="lead">Elige qué filtrar de tu feed de LinkedIn. Todo se evalúa en tu navegador: nada sale de tu computador.</p>
      <section><h2>Nivel de exigencia</h2>
        <label><input type="radio" checked> Estricto (recomendado para empezar): filtra más humo, y a veces apaga un post que sí valía</label>
        <label><input type="radio"> Equilibrado: filtra solo lo más evidente</label>
        <label><input type="radio"> Suave: casi nada pasa por humo, salvo los casos de manual</label></section>
      <section><h2>Qué hacer con un post filtrado</h2>
        <label><input type="radio" checked> Atenuar (apagado y colapsado, con botón "Ver igual")</label>
        <label><input type="radio"> Ocultar (solo queda una barra)</label>
        <label><input type="radio"> Solo etiquetar</label></section>
      <section><h2>Filtros</h2><p class="hint">Umbral de cada filtro: un número más bajo filtra más. Vacío = el que corresponde al nivel elegido.</p>${rows}</section>
    </main></div></body></html>`;
}

function render(name, html, width = 1280, height = 800) {
  const file = path.join(out, `${name}.html`);
  fs.writeFileSync(file, html);
  execFileSync(CHROME, ['--headless', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
    '--force-color-profile=srgb', `--window-size=${width},${height}`, `--screenshot=${path.join(__dirname, name + '.png')}`,
    'file://' + file], { stdio: 'ignore' });
  console.log(`store/capturas/${name}.png`);
}

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const config = await loadFilters(readJson);
  const engine = createEngine(config);
  const on = config.filters.filter((f) => f.defaultEnabled).map((f) => f.id);
  const posts = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(__dirname, 'posts.json'), 'utf8'))
    .map((p) => [p.id, { ...p, result: engine.classify(p.texto, on) }]));
  // Las capturas deben mostrar lo que el motor hace de verdad.
  for (const p of Object.values(posts)) {
    if (p.result.hit !== (p.id !== 'aporta')) throw new Error(`el motor no clasifica "${p.id}" como se espera`);
  }
  const show = (id, state) => post(posts[id], state, posts[id].result);

  render('captura-1-feed', page(
    panel('Menos humo en tu feed', 'Atenúa las historias infladas, la plantilla publicada sin editar, el cebo y los anuncios. Lo que aporta pasa intacto.') +
    `<div class="feed"><div class="col">${show('humo', 'hit')}${show('aporta')}${show('piloto', 'hit')}</div></div>`));

  render('captura-2-reporte', page(
    panel('¿Se equivocó? Un clic', 'Con "Ver igual" lo lees igual. Con "No es humo" queda visible, no se vuelve a filtrar y abres un reporte para ajustar la regla, sin el texto del post.') +
    `<div class="feed"><div class="col">${show('cebo', 'hit')}${show('aporta', 'reportado')}</div></div>`));

  render('captura-3-opciones', optionsPage(config));

  render('promo-440x280', `<!doctype html><html><head><meta charset="utf-8"><style>
    body { margin: 0; width: 440px; height: 280px; background: #1f2430; color: #fff; display: flex; align-items: center;
           gap: 18px; padding: 0 36px; box-sizing: border-box; font-family: -apple-system, system-ui, sans-serif; }
    img { width: 132px; height: 132px; margin-left: -16px; } h1 { margin: 0; font-size: 44px; letter-spacing: -1px; }
    p { margin: 6px 0 0; color: #aab2bd; font-size: 17px; } b { color: #f4b740; font-weight: 600; }
    </style></head><body><img src="${url('icons/icon.svg')}" alt=""><div><h1>sinhumo</h1><p>Menos humo,<br><b>mejor debate.</b></p></div></body></html>`, 440, 280);

  fs.rmSync(out, { recursive: true, force: true });
})();
