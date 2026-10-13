const DEFAULT_SETTINGS = { mode: 'atenuar', level: SinHumoLoader.DEFAULT_LEVEL, enabled: null, languages: ['es', 'en'], thresholds: {} };
const readJson = async (p) => (await fetch(chrome.runtime.getURL(p))).json();

async function load() {
  const { settings: stored } = await chrome.storage.sync.get('settings');
  const settings = { ...DEFAULT_SETTINGS, ...(stored || {}) };
  const config = await SinHumoLoader.loadFilters(readJson);
  if (!settings.enabled) settings.enabled = config.filters.filter((f) => f.defaultEnabled).map((f) => f.id);
  return { settings, config };
}

function save(settings) {
  chrome.storage.sync.set({ settings }).then(() => {
    const status = document.getElementById('status');
    status.textContent = 'Guardado. Recarga LinkedIn para aplicar.';
    setTimeout(() => (status.textContent = ''), 2500);
  });
}

load().then(({ settings, config }) => {
  for (const radio of document.querySelectorAll('input[name=mode]')) {
    radio.checked = radio.value === settings.mode;
    radio.addEventListener('change', () => { settings.mode = radio.value; save(settings); });
  }

  const levelHints = [];
  for (const radio of document.querySelectorAll('input[name=level]')) {
    radio.checked = radio.value === settings.level;
    radio.addEventListener('change', () => {
      settings.level = radio.value;
      save(settings);
      for (const update of levelHints) update();
    });
  }

  const box = document.getElementById('filters');
  for (const f of config.filters) {
    const row = document.createElement('div');
    row.className = 'filter';

    const toggle = document.createElement('label');
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = settings.enabled.includes(f.id);
    check.addEventListener('change', () => {
      settings.enabled = check.checked
        ? [...new Set([...settings.enabled, f.id])]
        : settings.enabled.filter((id) => id !== f.id);
      save(settings);
    });
    toggle.append(check, ` ${f.name}`);

    const threshold = document.createElement('input');
    threshold.type = 'number';
    threshold.min = '1';
    threshold.step = '0.5';
    threshold.value = settings.thresholds[f.id] ?? '';
    const showLevel = () => {
      threshold.placeholder = String(SinHumoLoader.effectiveThreshold(f, { ...settings, thresholds: {} }));
    };
    showLevel();
    levelHints.push(showLevel);
    threshold.setAttribute('aria-label', `Umbral de ${f.name}`);
    threshold.addEventListener('change', () => {
      if (threshold.value === '') delete settings.thresholds[f.id];
      else settings.thresholds[f.id] = Number(threshold.value);
      save(settings);
    });

    const desc = document.createElement('p');
    desc.textContent = f.description;

    row.append(toggle, threshold, desc);
    box.appendChild(row);
  }

  const langs = document.getElementById('languages');
  for (const lang of config.languages) {
    const label = document.createElement('label');
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = settings.languages.includes(lang);
    check.addEventListener('change', () => {
      settings.languages = check.checked
        ? [...new Set([...settings.languages, lang])]
        : settings.languages.filter((l) => l !== lang);
      save(settings);
    });
    label.append(check, ` ${lang}`);
    langs.appendChild(label);
  }
});
