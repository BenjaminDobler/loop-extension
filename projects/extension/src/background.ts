chrome.runtime.onInstalled.addListener(() => {
    chrome.webNavigation.onCompleted.addListener(() => {
      chrome.tabs.query({ active: true, currentWindow: true }, ([{ id }]) => {
        if (id) {
          chrome.pageAction.show(id);
        }
      });
    }, { url: [{ urlMatches: 'youtube.com' }] });
  });


  chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
    console.log('external message', request);
  });