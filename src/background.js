// Carga los paquetes de filtros desde la propia extensión y se los entrega al
// content script. Así las reglas no quedan expuestas a la página de LinkedIn.
importScripts('loader.js');

const DEFAULT_SETTINGS = { mode: 'atenuar', level: 'estricto', enabled: null, languages: ['es', 'en'], thresholds: {} };

const readJson = async (p) => (await fetch(chrome.runtime.getURL(p))).json();

async function getSettings() {
  const { settings } = await chrome.storage.sync.get('settings');
  return { ...DEFAULT_SETTINGS, ...(settings || {}) };
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg && msg.type === 'sinhumo:config') {
    (async () => {
      const settings = await getSettings();
      const config = await SinHumoLoader.loadFilters(readJson, settings.languages);
      if (!settings.enabled) settings.enabled = config.filters.filter((f) => f.defaultEnabled).map((f) => f.id);
      for (const f of config.filters) f.threshold = SinHumoLoader.effectiveThreshold(f, settings);
      sendResponse({ config, settings });
    })();
    return true;
  }
});

// Contador en el ícono: posts filtrados en la pestaña; el detalle va en el
// título que aparece al pasar el mouse.
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (!msg || msg.type !== 'sinhumo:stats' || !sender.tab) return;
  const tabId = sender.tab.id;
  chrome.action.setBadgeBackgroundColor({ tabId, color: '#f4b740' });
  if (chrome.action.setBadgeTextColor) chrome.action.setBadgeTextColor({ tabId, color: '#1f2430' });
  chrome.action.setBadgeText({ tabId, text: String(msg.filtrados) });
  const posts = msg.revisados === 1 ? 'post' : 'posts';
  chrome.action.setTitle({
    tabId,
    title: `sinhumo: revisó ${msg.revisados} ${posts} y filtró ${msg.filtrados}.\nClic para configurar los filtros.`,
  });
});

chrome.action.onClicked.addListener(() => chrome.runtime.openOptionsPage());
