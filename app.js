(() => {
  const doc = document;
  const windows = Array.from(doc.querySelectorAll(".reader-window"));
  const slots = Array.from(doc.querySelectorAll(".window-slot"));
  const scrim = doc.querySelector(".focus-scrim");
  const topbar = doc.querySelector(".topbar");
  const hero = doc.querySelector(".hero");
  const mobile = window.matchMedia("(max-width: 1080px)");
  let focused = null;
  let lastTrigger = null;

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  const updateProgress = (win) => {
    const scroller = win.querySelector(".window-scroll");
    const fill = win.querySelector(".progress-fill");
    const value = win.querySelector(".progress-value");
    if (!scroller || !fill || !value) return;
    const max = scroller.scrollHeight - scroller.clientHeight;
    const p = max > 0 ? clamp(scroller.scrollTop / max, 0, 1) : 0;
    fill.style.width = `${(p * 100).toFixed(2)}%`;
    value.textContent = String(Math.round(p * 100)).padStart(2, "0");
  };

  windows.forEach((win) => {
    const scroller = win.querySelector(".window-scroll");
    if (!scroller) return;
    scroller.addEventListener("scroll", () => updateProgress(win), { passive: true });
    const article = win.querySelector(".article");
    if ("ResizeObserver" in window && article) {
      new ResizeObserver(() => updateProgress(win)).observe(article);
    }
    updateProgress(win);
  });

  const setBackgroundInert = (inert, exceptSlot) => {
    [topbar, hero, ...slots].forEach((el) => {
      if (!el || el === exceptSlot) return;
      el.inert = inert;
    });
  };

  const close = ({ restoreFocus = true } = {}) => {
    if (!focused) return;
    const win = focused;
    const trigger = lastTrigger;
    win.classList.remove("is-focused");
    win.removeAttribute("role");
    win.removeAttribute("aria-modal");
    doc.body.classList.remove("has-focus");
    if (scrim) scrim.hidden = true;
    setBackgroundInert(false);
    if (trigger) {
      trigger.setAttribute("aria-pressed", "false");
      trigger.setAttribute("aria-label", trigger.dataset.openLabel || "展开阅读");
    }
    focused = null;
    lastTrigger = null;
    if (restoreFocus && trigger) trigger.focus({ preventScroll: true });
  };

  const open = (win, trigger) => {
    if (mobile.matches) return;
    if (focused) close({ restoreFocus: false });
    focused = win;
    lastTrigger = trigger;
    const slot = win.closest(".window-slot");
    win.classList.add("is-focused");
    win.setAttribute("role", "dialog");
    win.setAttribute("aria-modal", "true");
    doc.body.classList.add("has-focus");
    if (scrim) scrim.hidden = false;
    setBackgroundInert(true, slot);
    trigger.setAttribute("aria-pressed", "true");
    trigger.setAttribute("aria-label", trigger.dataset.closeLabel || "收起阅读");
    const scroller = win.querySelector(".window-scroll");
    if (scroller) scroller.focus({ preventScroll: true });
    updateProgress(win);
  };

  windows.forEach((win) => {
    const trigger = win.querySelector(".focus-toggle");
    if (!trigger) return;
    const title = win.querySelector(".article-title")?.textContent?.trim() || "文章";
    trigger.dataset.openLabel = `展开阅读：${title}`;
    trigger.dataset.closeLabel = `收起阅读：${title}`;
    trigger.setAttribute("aria-label", trigger.dataset.openLabel);
    trigger.addEventListener("click", () => {
      if (focused === win) close();
      else open(win, trigger);
    });
  });

  if (scrim) scrim.addEventListener("click", () => close());

  doc.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && focused) {
      event.preventDefault();
      close();
    }
  });

  const onBreakpoint = () => {
    if (mobile.matches && focused) close({ restoreFocus: false });
  };
  if (mobile.addEventListener) mobile.addEventListener("change", onBreakpoint);
  else mobile.addListener(onBreakpoint);

  doc.querySelectorAll(".top-nav a").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (mobile.matches) return;
      const target = doc.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.classList.remove("is-targeted");
      // Restart the short highlight if the same target is clicked twice.
      void target.offsetWidth;
      target.classList.add("is-targeted");
      window.setTimeout(() => target.classList.remove("is-targeted"), 900);
      const scroller = target.querySelector(".window-scroll");
      if (scroller) scroller.focus({ preventScroll: true });
    });
  });
})();
