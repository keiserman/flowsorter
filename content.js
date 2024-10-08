document.addEventListener("DOMContentLoaded", () => {
  const cmsItems = document.querySelectorAll("[data-cms-item]");

  cmsItems.forEach((item) => {
    item.setAttribute("draggable", true);

    item.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", e.target.id);
    });

    item.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    item.addEventListener("drop", (e) => {
      e.preventDefault();
      const draggedId = e.dataTransfer.getData("text/plain");
      const draggedElement = document.getElementById(draggedId);

      if (draggedElement && draggedElement !== e.target) {
        const targetParent = e.target.parentElement;
        targetParent.insertBefore(draggedElement, e.target);
      }
    });
  });
});
