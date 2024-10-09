// background.js

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateSortOrder") {
    const newOrder = message.data;
    updateSortOrder(newOrder)
      .then(() => {
        sendResponse({ success: true });
      })
      .catch((error) => {
        console.error(error);
        sendResponse({ success: false });
      });
    return true; // Keeps the message channel open for async response
  }
});

async function updateSortOrder(newOrder) {
  const accessToken = await getAccessToken();
  const collectionId = await getCollectionId();

  for (const item of newOrder) {
    const { itemId, sortOrder } = item;
    const url = `https://api.webflow.com/collections/${collectionId}/items/${itemId}`;
    const body = {
      fields: {
        "sort-order": sortOrder,
      },
    };

    await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "Accept-Version": "1.0.0",
      },
      body: JSON.stringify(body),
    });
  }
}

async function getAccessToken() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(["accessToken"], (data) => {
      resolve(data.accessToken);
    });
  });
}

async function getCollectionId() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(["collectionId"], (data) => {
      resolve(data.collectionId);
    });
  });
}
