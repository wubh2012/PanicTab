const DEFAULT_SETTINGS = {
  tripleClickEnabled: false,
  keyboardTriggerEnabled: true,
  keyboardShortcut: "doubleControl",
  groupName: "PanicTab",
  groupColor: "red",
  disguiseMode: "crash",
  imageUrl: "",
  imageDataUrl: "",
  webpageUrl: "",
  uiLocale: "auto"
};

const defaultBlueScreenUrl = chrome.runtime.getURL("assets/default-bluescreen.svg");
const SUPPORTED_UI_LOCALES = new Set(["zh_CN", "en", "ja", "ko", "de", "fr"]);

const elements = {
  uiLocale: document.getElementById("uiLocale"),
  tripleClickEnabled: document.getElementById("tripleClickEnabled"),
  keyboardTriggerEnabled: document.getElementById("keyboardTriggerEnabled"),
  keyboardShortcut: document.getElementById("keyboardShortcut"),
  groupName: document.getElementById("groupName"),
  groupColor: document.getElementById("groupColor"),
  disguiseModeCards: document.getElementById("disguiseModeCards"),
  modeCards: Array.from(document.querySelectorAll(".mode-card")),
  imageSettings: document.getElementById("imageSettings"),
  webpageSettings: document.getElementById("webpageSettings"),
  imageUrl: document.getElementById("imageUrl"),
  imageUpload: document.getElementById("imageUpload"),
  webpageUrl: document.getElementById("webpageUrl"),
  clearImageButton: document.getElementById("clearImageButton"),
  testButton: document.getElementById("testButton"),
  status: document.getElementById("status"),
  previewFrame: document.getElementById("previewFrame"),
  imagePreview: document.getElementById("imagePreview")
};

let statusTimer = 0;
let localeMessages = null;
let currentUiLocale = "auto";

init();

async function init() {
  const settings = await chrome.storage.local.get(DEFAULT_SETTINGS);
  await setUiLocale(settings.uiLocale);
  renderSettings(settings);

  elements.uiLocale.addEventListener("change", saveUiLocale);

  elements.tripleClickEnabled.addEventListener("change", () => {
    saveSetting("tripleClickEnabled", elements.tripleClickEnabled.checked);
  });

  elements.keyboardTriggerEnabled.addEventListener("change", () => {
    saveSetting("keyboardTriggerEnabled", elements.keyboardTriggerEnabled.checked);
  });

  elements.keyboardShortcut.addEventListener("change", () => {
    saveSetting("keyboardShortcut", elements.keyboardShortcut.value);
  });

  elements.groupName.addEventListener("change", () => {
    saveSetting("groupName", elements.groupName.value.trim() || DEFAULT_SETTINGS.groupName);
  });

  elements.groupColor.addEventListener("change", () => {
    saveSetting("groupColor", elements.groupColor.value);
  });

  elements.modeCards.forEach((card) => {
    card.addEventListener("click", () => {
      saveSetting("disguiseMode", card.dataset.mode);
    });
  });

  elements.imageUrl.addEventListener("change", () => {
    saveSetting("imageUrl", elements.imageUrl.value.trim());
  });

  elements.webpageUrl.addEventListener("change", saveWebpageUrl);

  elements.imageUpload.addEventListener("change", handleImageUpload);
  elements.clearImageButton.addEventListener("click", clearImage);
  elements.testButton.addEventListener("click", openFakePage);
}

function renderSettings(settings) {
  elements.uiLocale.value = normalizeUiLocale(settings.uiLocale);
  elements.tripleClickEnabled.checked = Boolean(settings.tripleClickEnabled);
  elements.keyboardTriggerEnabled.checked = Boolean(settings.keyboardTriggerEnabled);
  elements.keyboardShortcut.value = settings.keyboardShortcut;
  elements.groupName.value = settings.groupName || DEFAULT_SETTINGS.groupName;
  elements.groupColor.value = settings.groupColor || DEFAULT_SETTINGS.groupColor;
  renderDisguiseMode(settings.disguiseMode || DEFAULT_SETTINGS.disguiseMode);
  elements.imageUrl.value = settings.imageUrl || "";
  elements.webpageUrl.value = settings.webpageUrl || "";
  renderPreview(settings);
}

async function saveUiLocale() {
  const uiLocale = normalizeUiLocale(elements.uiLocale.value);
  await chrome.storage.local.set({ uiLocale });
  await setUiLocale(uiLocale);
  elements.uiLocale.value = uiLocale;
  showStatus(t("statusSaved"));
}

async function saveSetting(key, value) {
  await chrome.storage.local.set({ [key]: value });
  const settings = await chrome.storage.local.get(DEFAULT_SETTINGS);
  renderDisguiseMode(settings.disguiseMode);
  renderPreview(settings);
  showStatus(t("statusSaved"));
}

function handleImageUpload() {
  const [file] = elements.imageUpload.files;
  if (!file) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    showStatus(t("statusSelectImageFile"), true);
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", async () => {
    await chrome.storage.local.set({
      imageDataUrl: reader.result,
      disguiseMode: "image"
    });
    const settings = await chrome.storage.local.get(DEFAULT_SETTINGS);
    renderDisguiseMode(settings.disguiseMode);
    renderPreview(settings);
    showStatus(t("statusImageSaved"));
  });
  reader.readAsDataURL(file);
}

async function clearImage() {
  await chrome.storage.local.set({
    imageUrl: "",
    imageDataUrl: ""
  });
  elements.imageUrl.value = "";
  elements.imageUpload.value = "";
  elements.previewFrame.hidden = true;
  elements.imagePreview.removeAttribute("src");
  showStatus(t("statusImageCleared"));
}

function renderPreview(settings) {
  const imageSource =
    settings.imageDataUrl ||
    settings.imageUrl ||
    (settings.disguiseMode === "image" ? defaultBlueScreenUrl : "");

  if (!imageSource) {
    elements.previewFrame.hidden = true;
    elements.imagePreview.removeAttribute("src");
    return;
  }

  elements.previewFrame.hidden = false;
  elements.imagePreview.src = imageSource;
}

function renderDisguiseMode(disguiseMode) {
  const mode = ["crash", "image", "webpage"].includes(disguiseMode) ? disguiseMode : DEFAULT_SETTINGS.disguiseMode;

  elements.modeCards.forEach((card) => {
    const selected = card.dataset.mode === mode;
    card.classList.toggle("selected", selected);
    card.setAttribute("aria-checked", String(selected));
  });

  elements.imageSettings.hidden = mode !== "image";
  elements.webpageSettings.hidden = mode !== "webpage";
}

async function saveWebpageUrl() {
  const rawUrl = elements.webpageUrl.value.trim();

  if (!rawUrl) {
    await saveSetting("webpageUrl", "");
    return;
  }

  const normalizedUrl = sanitizeWebpageUrl(rawUrl);
  if (!normalizedUrl) {
    const settings = await chrome.storage.local.get(DEFAULT_SETTINGS);
    elements.webpageUrl.value = settings.webpageUrl || "";
    showStatus(t("statusInvalidWebpageUrl"), true);
    return;
  }

  elements.webpageUrl.value = normalizedUrl;
  await saveSetting("webpageUrl", normalizedUrl);
}

async function openFakePage() {
  const settings = await chrome.storage.local.get(DEFAULT_SETTINGS);
  const mode = getSelectedDisguiseMode() || settings.disguiseMode;
  const url =
    mode === "webpage"
      ? sanitizeWebpageUrl(elements.webpageUrl.value) ||
        sanitizeWebpageUrl(settings.webpageUrl) ||
        chrome.runtime.getURL("src/error/page.html")
      : chrome.runtime.getURL("src/error/page.html");

  chrome.tabs.create({
    url
  });
}

function getSelectedDisguiseMode() {
  const selectedCard = elements.modeCards.find((card) => card.classList.contains("selected"));
  return selectedCard?.dataset.mode || "";
}

function sanitizeWebpageUrl(rawUrl) {
  try {
    const url = new URL(String(rawUrl || "").trim());
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}

async function setUiLocale(uiLocale) {
  currentUiLocale = normalizeUiLocale(uiLocale);
  localeMessages = await loadLocaleMessages(currentUiLocale);
  applyLocaleMetadata();
  localizeDocument();
}

async function loadLocaleMessages(uiLocale) {
  if (uiLocale === "auto") {
    return null;
  }

  try {
    const response = await fetch(chrome.runtime.getURL(`_locales/${uiLocale}/messages.json`));
    return response.ok ? await response.json() : null;
  } catch {
    return null;
  }
}

function applyLocaleMetadata() {
  const locale = currentUiLocale === "auto" ? chrome.i18n.getMessage("@@ui_locale") : currentUiLocale;
  document.documentElement.lang = (locale || "zh_CN").replace("_", "-");
  document.documentElement.dir = currentUiLocale === "auto" ? chrome.i18n.getMessage("@@bidi_dir") || "ltr" : "ltr";
}

function localizeDocument() {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const message = t(element.dataset.i18n);
    if (message) {
      element.textContent = message;
    }
  });

  document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
    element.dataset.i18nAttr.split(",").forEach((entry) => {
      const [attributeName, messageName] = entry.split(":").map((part) => part.trim());
      const message = t(messageName);
      if (attributeName && message) {
        element.setAttribute(attributeName, message);
      }
    });
  });
}

function t(messageName) {
  return localeMessages?.[messageName]?.message || chrome.i18n.getMessage(messageName) || "";
}

function normalizeUiLocale(uiLocale) {
  return SUPPORTED_UI_LOCALES.has(uiLocale) ? uiLocale : DEFAULT_SETTINGS.uiLocale;
}

function showStatus(message, isError = false) {
  window.clearTimeout(statusTimer);
  elements.status.textContent = message;
  elements.status.style.color = isError ? "#b91c1c" : "#047857";
  statusTimer = window.setTimeout(() => {
    elements.status.textContent = "";
  }, 2200);
}
