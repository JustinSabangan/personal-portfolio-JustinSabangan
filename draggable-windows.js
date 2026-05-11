(function () {
  let desktopArea = document.querySelector(".desktop-area");
  if (!desktopArea) return;

  let windowElements = Array.prototype.slice.call(
    desktopArea.querySelectorAll(".win7-window")
  );
  if (windowElements.length === 0) return;

  let highestZIndex = 10;
  windowElements.forEach(function (windowEl) {
    let zIndexText = getComputedStyle(windowEl).zIndex || "0";
    let zIndexValue = parseInt(zIndexText, 10);
    if (!isNaN(zIndexValue)) {
      highestZIndex = Math.max(highestZIndex, zIndexValue);
    }
  });

  function bringWindowToFront(windowEl) {
    highestZIndex += 1;
    windowEl.style.zIndex = String(highestZIndex);
  }

  windowElements.forEach(function (windowEl) {
    let titleBar = windowEl.querySelector(".title-bar");
    if (!titleBar) return;

    titleBar.style.cursor = "move";

    titleBar.addEventListener("pointerdown", function (event) {
      if (event.button !== 0) return;
      if (event.target && event.target.closest(".title-bar-controls")) return;

      bringWindowToFront(windowEl);

      let windowRect = windowEl.getBoundingClientRect();
      let parentElement = windowEl.offsetParent || desktopArea;
      let parentRect = parentElement.getBoundingClientRect();

      let pointerOffsetX = event.clientX - windowRect.left;
      let pointerOffsetY = event.clientY - windowRect.top;

      windowEl.style.right = "auto";
      windowEl.style.bottom = "auto";
      windowEl.style.transform = "none";

      windowEl.style.left = String(windowRect.left - parentRect.left) + "px";
      windowEl.style.top = String(windowRect.top - parentRect.top) + "px";

      if (titleBar.setPointerCapture) {
        titleBar.setPointerCapture(event.pointerId);
      }

      function onPointerMove(moveEvent) {
        windowEl.style.left =
          String(moveEvent.clientX - parentRect.left - pointerOffsetX) + "px";
        windowEl.style.top =
          String(moveEvent.clientY - parentRect.top - pointerOffsetY) + "px";
      }

      function stopDragging(upEvent) {
        if (titleBar.releasePointerCapture) {
          titleBar.releasePointerCapture(upEvent.pointerId);
        }
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", stopDragging);
        window.removeEventListener("pointercancel", stopDragging);
      }

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", stopDragging);
      window.addEventListener("pointercancel", stopDragging);
    });

    windowEl.addEventListener("pointerdown", function (event) {
      if (event.button !== 0) return;
      bringWindowToFront(windowEl);
    });
  });
})();

(function () {
  let timeEl = document.querySelector(".taskbar-clock-time");
  let dateEl = document.querySelector(".taskbar-clock-date");
  let timeRoot = document.getElementById("taskbar-time");
  function tick() {
      let d = new Date();
      if (timeEl) {
          timeEl.textContent = d.toLocaleTimeString(undefined, {
              hour: "numeric",
              minute: "2-digit",
              second: "2-digit"
          });
      }
      if (dateEl) {
          dateEl.textContent = d.toLocaleDateString(undefined, {
              month: "numeric",
              day: "numeric",
              year: "numeric"
          });
      }
      if (timeRoot) {
          timeRoot.dateTime = d.toISOString();
      }
  }
  tick();
  setInterval(tick, 1000);
})();