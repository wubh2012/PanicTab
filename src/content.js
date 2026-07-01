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
let extensionContextInvalidated = false;
let settings = { ...DEFAULT_SETTINGS };

try {
  chrome.storage.local
    .get(DEFAULT_SETTINGS)
    .then((storedSettings) => {
      settings = { ...DEFAULT_SETTINGS, ...storedSettings };
    })
    .catch(handleExtensionContextError);
} catch (error) {
  handleExtensionContextError(error);
}

try {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local" || extensionContextInvalidated) {
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
} catch (error) {
  handleExtensionContextError(error);
}

document.addEventListener(
  "mousedown",
  (event) => {
    if (
      extensionContextInvalidated ||
      !settings.tripleClickEnabled ||
      event.button !== 0 ||
      activationInFlight
    ) {
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
    if (
      extensionContextInvalidated ||
      !settings.keyboardTriggerEnabled ||
      activationInFlight ||
      event.repeat
    ) {
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
  if (!isExtensionContextAvailable()) {
    extensionContextInvalidated = true;
    activationInFlight = false;
    return;
  }

  activationInFlight = true;
  let activationMessage;

  try {
    activationMessage = chrome.runtime.sendMessage({ type: "PANICTAB_ACTIVATE" });
  } catch (error) {
    handleExtensionContextError(error);
    activationInFlight = false;
    return;
  }

  Promise.resolve(activationMessage)
    .catch(handleExtensionContextError)
    .finally(() => {
      window.setTimeout(() => {
        activationInFlight = false;
      }, Math.max(CLICK_WINDOW_MS, KEY_WINDOW_MS));
    });
}

function isExtensionContextAvailable() {
  try {
    return Boolean(chrome.runtime?.id) && !extensionContextInvalidated;
  } catch (error) {
    handleExtensionContextError(error);
    return false;
  }
}

function handleExtensionContextError(error) {
  if (isExtensionContextInvalidatedError(error)) {
    extensionContextInvalidated = true;
    return;
  }

  console.error("PanicTab content script error:", error);
}

function isExtensionContextInvalidatedError(error) {
  return String(error?.message || error).includes("Extension context invalidated");
}
