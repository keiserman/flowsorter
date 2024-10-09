// content.js

// Wait until the DOM is fully loaded
window.addEventListener("load", () => {
  const observer = new MutationObserver((mutations, obs) => {
    const cmsItems = document.querySelectorAll(
      '[data-automation-id="data-manager-table-row-item"]'
    );
    if (cmsItems.length > 0) {
      obs.disconnect();
      initializeDragAndDrop(cmsItems);
    }
  });
  observer.observe(document, { childList: true, subtree: true });
});

function initializeDragAndDrop(cmsItems) {
  cmsItems.forEach((item) => {
    item.setAttribute("draggable", true);

    // Extract item ID from data attributes or DOM
    const itemId = extractItemId(item);
    item.dataset.itemId = itemId;

    item.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", itemId);
      item.classList.add("dragging");
    });

    item.addEventListener("dragover", (e) => {
      e.preventDefault();
      item.classList.add("dragover");
    });

    item.addEventListener("dragleave", () => {
      item.classList.remove("dragover");
    });

    item.addEventListener("drop", (e) => {
      e.preventDefault();
      item.classList.remove("dragover");
      const draggedItemId = e.dataTransfer.getData("text/plain");
      const draggedItem = document.querySelector(
        `[data-item-id="${draggedItemId}"]`
      );
      if (draggedItem && draggedItem !== item) {
        // Swap items in the DOM
        const parent = item.parentNode;
        parent.insertBefore(draggedItem, item.nextSibling);

        // Update sort order
        updateSortOrder();
      }
      item.classList.remove("dragging");
    });
  });
}

function extractItemId(item) {
  // Implement logic to extract the CMS item ID from the DOM
  // This may involve parsing a data attribute or element
  // Example:
  return item.getAttribute("data-item-id");
}

function updateSortOrder() {
  const cmsItems = document.querySelectorAll(
    '[data-automation-id="data-manager-table-row-item"]'
  );
  const newOrder = [];
  cmsItems.forEach((item, index) => {
    const itemId = item.dataset.itemId;
    newOrder.push({ itemId, sortOrder: index + 1 });
  });

  // Send new order to background script
  chrome.runtime.sendMessage(
    { action: "updateSortOrder", data: newOrder },
    (response) => {
      if (response && response.success) {
        console.log("Sort order updated successfully.");
      } else {
        console.error("Failed to update sort order.");
      }
    }
  );
}
