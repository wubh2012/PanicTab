const DEFAULT_SETTINGS = {
  tripleClickEnabled: false,
  keyboardTriggerEnabled: true,
  keyboardShortcut: "doubleControl",
  groupName: "PanicTab",
  groupColor: "red",
  disguiseMode: "crash",
  imageUrl: "",
  imageDataUrl: ""
};

const defaultBlueScreenUrl = chrome.runtime.getURL("assets/default-bluescreen.svg");

const elements = {
  tripleClickEnabled: document.getElementById("tripleClickEnabled"),
  keyboardTriggerEnabled: document.getElementById("keyboardTriggerEnabled"),
  keyboardShortcut: document.getElementById("keyboardShortcut"),
  groupName: document.getElementById("groupName"),
  groupColor: document.getElementById("groupColor"),
  disguiseMode: document.getElementById("disguiseMode"),
  imageUrl: document.getElementById("imageUrl"),
  imageUpload: document.getElementById("imageUpload"),
  clearImageButton: document.getElementById("clearImageButton"),
  testButton: document.getElementById("testButton"),
  status: document.getElementById("status"),
  previewFrame: document.getElementById("previewFrame"),
  imagePreview: document.getElementById("imagePreview")
};

let statusTimer = 0;

init();

async function init() {
  const settings = await chrome.storage.local.get(DEFAULT_SETTINGS);
  renderSettings(settings);

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

  elements.disguiseMode.addEventListener("change", () => {
    saveSetting("disguiseMode", elements.disguiseMode.value);
  });

  elements.imageUrl.addEventListener("change", () => {
    saveSetting("imageUrl", elements.imageUrl.value.trim());
  });

  elements.imageUpload.addEventListener("change", handleImageUpload);
  elements.clearImageButton.addEventListener("click", clearImage);
  elements.testButton.addEventListener("click", openFakePage);
}

function renderSettings(settings) {
  elements.tripleClickEnabled.checked = Boolean(settings.tripleClickEnabled);
  elements.keyboardTriggerEnabled.checked = Boolean(settings.keyboardTriggerEnabled);
  elements.keyboardShortcut.value = settings.keyboardShortcut;
  elements.groupName.value = settings.groupName || DEFAULT_SETTINGS.groupName;
  elements.groupColor.value = settings.groupColor || DEFAULT_SETTINGS.groupColor;
  elements.disguiseMode.value = settings.disguiseMode;
  elements.imageUrl.value = settings.imageUrl || "";
  renderPreview(settings);
}

async function saveSetting(key, value) {
  await chrome.storage.local.set({ [key]: value });
  const settings = await chrome.storage.local.get(DEFAULT_SETTINGS);
  renderPreview(settings);
  showStatus("已保存");
}

function handleImageUpload() {
  const [file] = elements.imageUpload.files;
  if (!file) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    showStatus("请选择图片文件", true);
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", async () => {
    await chrome.storage.local.set({
      imageDataUrl: reader.result,
      disguiseMode: "image"
    });
    elements.disguiseMode.value = "image";
    const settings = await chrome.storage.local.get(DEFAULT_SETTINGS);
    renderPreview(settings);
    showStatus("图片已保存");
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
  showStatus("图片已清除");
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

function openFakePage() {
  chrome.tabs.create({
    url: chrome.runtime.getURL("src/error/page.html")
  });
}

function showStatus(message, isError = false) {
  window.clearTimeout(statusTimer);
  elements.status.textContent = message;
  elements.status.style.color = isError ? "#b91c1c" : "#047857";
  statusTimer = window.setTimeout(() => {
    elements.status.textContent = "";
  }, 2200);
}
