chrome.runtime.onInstalled.addListener(() => {
  console.log("Tech Finder extension installed successfully!");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "BACKGROUND_PING") {
    sendResponse({ status: "Background script is running" });
  }
});
