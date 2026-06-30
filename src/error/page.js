const DEFAULT_SETTINGS = {
  disguiseMode: "crash",
  imageUrl: "",
  imageDataUrl: ""
};

const crashView = document.getElementById("crashView");
const imageView = document.getElementById("imageView");
const customImage = document.getElementById("customImage");
const reloadButton = document.getElementById("reloadButton");
const defaultBlueScreenUrl = chrome.runtime.getURL("assets/default-bluescreen.svg");

reloadButton.addEventListener("click", () => {
  window.location.reload();
});

chrome.storage.local.get(DEFAULT_SETTINGS).then((settings) => {
  const imageSource = settings.imageDataUrl || settings.imageUrl || defaultBlueScreenUrl;

  if (settings.disguiseMode === "image") {
    crashView.hidden = true;
    imageView.hidden = false;
    customImage.src = imageSource;
    return;
  }

  crashView.hidden = false;
  imageView.hidden = true;
});
