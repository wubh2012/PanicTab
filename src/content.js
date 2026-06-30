const DEFAULT_SETTINGS = {
  tripleClickEnabled: false,
  keyboardTriggerEnabled: true,
  keyboardShortcut: "doubleControl"
};

const CLICK_WINDOW_MS = 650;
const KEY_WINDOW_MS = 500;
let clickTimes = [];
let keyTimes = [];
let activationInFlight = false;
let settings = { ...DEFAULT_SETTINGS };

chrome.storage.local.get(DEFAULT_SETTINGS).then((storedSettings) => {
  settings = { ...DEFAULT_SETTINGS, ...storedSettings };
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "local") {
    return;
  }

  if (changes.tripleClickEnabled) {
    settings.tripleClickEnabled = Boolean(changes.tripleClickEnabled.newValue);
  }

  if (changes.keyboardTriggerEnabled) {
    settings.keyboardTriggerEnabled = Boolean(changes.keyboardTriggerEnabled.newValue);
  }

  if (changes.keyboardShortcut) {
    settings.keyboardShortcut = changes.keyboardShortcut.newValue || DEFAULT_SETTINGS.keyboardShortcut;
  }
});

document.addEventListener(
  "mousedown",
  (event) => {
    if (!settings.tripleClickEnabled || event.button !== 0 || activationInFlight) {
      return;
    }

    const now = Date.now();
    clickTimes = [...clickTimes.filter((time) => now - time <= CLICK_WINDOW_MS), now];

    if (clickTimes.length >= 3) {
      clickTimes = [];
      activate();
    }
  },
  true
);

document.addEventListener(
  "keydown",
  (event) => {
    if (!settings.keyboardTriggerEnabled || activationInFlight || event.repeat) {
      return;
    }

    if (!matchesKeyboardShortcut(event)) {
      return;
    }

    const now = Date.now();
    keyTimes = [...keyTimes.filter((time) => now - time <= KEY_WINDOW_MS), now];

    if (keyTimes.length >= 2) {
      keyTimes = [];
      activate();
    }
  },
  true
);

function matchesKeyboardShortcut(event) {
  if (settings.keyboardShortcut === "doubleShift") {
    return event.key === "Shift";
  }

  if (settings.keyboardShortcut === "doubleAlt") {
    return event.key === "Alt";
  }

  return event.key === "Control";
}

function activate() {
  activationInFlight = true;

  chrome.runtime
    .sendMessage({ type: "PANICTAB_ACTIVATE" })
    .finally(() => {
      window.setTimeout(() => {
        activationInFlight = false;
      }, Math.max(CLICK_WINDOW_MS, KEY_WINDOW_MS));
    });
}
