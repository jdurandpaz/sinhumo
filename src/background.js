// Carga los paquetes de filtros desde la propia extensión y se los entrega al
// content script. Así las reglas no quedan expuestas a la página de LinkedIn.
importScripts('loader.js');

const DEFAULT_SETTINGS = { mode: 'atenuar', enabled: null, languages: ['es', 'en'], thresholds: {} };

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
      for (const f of config.filters) {
        if (settings.thresholds[f.id] != null) f.threshold = settings.thresholds[f.id];
      }
      sendResponse({ config, settings });
    })();
    return true;
  }
});

chrome.action.onClicked.addListener(() => chrome.runtime.openOptionsPage());
