const DEFAULT_SETTINGS = {
  disguiseMode: "crash",
  imageUrl: "",
  imageDataUrl: "",
  uiLocale: "auto"
};
const SUPPORTED_UI_LOCALES = new Set(["zh_CN", "en", "ja", "ko", "de", "fr"]);

const crashView = document.getElementById("crashView");
const imageView = document.getElementById("imageView");
const customImage = document.getElementById("customImage");
const reloadButton = document.getElementById("reloadButton");
const defaultBlueScreenUrl = chrome.runtime.getURL("assets/default-bluescreen.svg");

let localeMessages = null;
let currentUiLocale = "auto";

reloadButton.addEventListener("click", () => {
  window.location.reload();
});

init();

async function init() {
  const settings = await chrome.storage.local.get(DEFAULT_SETTINGS);
  await setUiLocale(settings.uiLocale);

  const imageSource = settings.imageDataUrl || settings.imageUrl || defaultBlueScreenUrl;

  if (settings.disguiseMode === "image") {
    crashView.hidden = true;
    imageView.hidden = false;
    customImage.src = imageSource;
    return;
  }

  crashView.hidden = false;
  imageView.hidden = true;
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
