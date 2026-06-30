const DISGUISE_PAGE_PATH = "src/error/page.html";
const DEFAULT_SETTINGS = {
  groupName: "PanicTab",
  groupColor: "red"
};
const ALLOWED_GROUP_COLORS = new Set([
  "grey",
  "blue",
  "red",
  "yellow",
  "green",
  "pink",
  "purple",
  "cyan",
  "orange"
]);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== "PANICTAB_ACTIVATE") {
    return false;
  }

  activatePanicTab(sender.tab?.windowId)
    .then(() => sendResponse({ ok: true }))
    .catch((error) => {
      console.error("PanicTab activation failed:", error);
      sendResponse({ ok: false, error: String(error?.message || error) });
    });

  return true;
});

chrome.action.onClicked.addListener((tab) => {
  activatePanicTab(tab.windowId).catch((error) => {
    console.error("PanicTab toolbar activation failed:", error);
  });
});

chrome.commands.onCommand.addListener((command, tab) => {
  if (command !== "panic-now") {
    return;
  }

  activatePanicTab(tab?.windowId).catch((error) => {
    console.error("PanicTab shortcut activation failed:", error);
  });
});

async function activatePanicTab(sourceWindowId) {
  const settings = await chrome.storage.local.get(DEFAULT_SETTINGS);
  const windowId = await resolveWindowId(sourceWindowId);
  const disguiseUrl = chrome.runtime.getURL(DISGUISE_PAGE_PATH);
  const tabs = await chrome.tabs.query({ windowId });
  const tabsToGroup = tabs.filter((tab) => isCollectableTab(tab, disguiseUrl));

  if (tabsToGroup.length > 0) {
    const tabIds = tabsToGroup.map((tab) => tab.id).filter(Number.isInteger);
    const groupId = await chrome.tabs.group({ tabIds });
    await chrome.tabGroups.update(groupId, {
      title: sanitizeGroupName(settings.groupName),
      color: sanitizeGroupColor(settings.groupColor),
      collapsed: true
    });
  }

  await chrome.tabs.create({
    windowId,
    url: disguiseUrl,
    active: true
  });
}

async function resolveWindowId(sourceWindowId) {
  if (Number.isInteger(sourceWindowId)) {
    return sourceWindowId;
  }

  const [activeTab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  if (Number.isInteger(activeTab?.windowId)) {
    return activeTab.windowId;
  }

  const currentWindow = await chrome.windows.getCurrent();
  return currentWindow.id;
}

function isCollectableTab(tab, disguiseUrl) {
  if (!Number.isInteger(tab.id) || tab.pinned) {
    return false;
  }

  if (!tab.url || tab.url.startsWith(disguiseUrl)) {
    return false;
  }

  if (tab.url.startsWith("chrome-extension://")) {
    return false;
  }

  return true;
}

function sanitizeGroupName(groupName) {
  const normalizedName = String(groupName || "").trim();
  return normalizedName || DEFAULT_SETTINGS.groupName;
}

function sanitizeGroupColor(groupColor) {
  return ALLOWED_GROUP_COLORS.has(groupColor) ? groupColor : DEFAULT_SETTINGS.groupColor;
}
