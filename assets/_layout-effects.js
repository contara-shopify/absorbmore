const initLayoutEffects = (bodyElement, headerElement) => {
  const htmlElement = document.documentElement;

  const isHideOnScrollEnabled = !!window?.theme_settings?.layout__header_hide_on_scroll;

  let lastScrollY = window.scrollY;
  let scrollingUp = false;
  let scrollingDown = false;
  let scrolledDown = window.scrollY > 1;

  let headerHeightPixels = 0;
  let lastFullyVisibleOffsetPixels = 0;

  let ticking = false;

  const alwaysShowThresholdPixels = 220;
  const scrollSensitivityPixels = 1;

  function setViewportHeightUnit() {
    const viewportUnit = window.innerHeight * 0.01;
    bodyElement.style.setProperty("--vh", `${viewportUnit}px`);
  }

  function applyOffsetForCurrentVisibility() {
    const isHidden = htmlElement.classList.contains("header-hidden");

    if (isHidden) {
      bodyElement.style.setProperty("--header-height-offset", "0px");
    }
    if (!isHidden) {
      bodyElement.style.setProperty("--header-height-offset", `${lastFullyVisibleOffsetPixels}px`);
    }
  }

  function measureHeader() {
    const rectangle = headerElement.getBoundingClientRect();
    headerHeightPixels = rectangle?.height ?? 0;
    bodyElement.style.setProperty("--header-height", `${headerHeightPixels}px`);
    const isHidden = htmlElement.classList.contains("header-hidden");

    if (!isHidden) {
      // Clamp to avoid sticky overshoot at the very top
      const bottom = Math.max(headerElement.getBoundingClientRect().bottom, 0);
      lastFullyVisibleOffsetPixels = Math.min(bottom, headerHeightPixels);
    }

    applyOffsetForCurrentVisibility();
  }

  function updateHeaderVisibilityByScroll(currentScrollY, deltaY) {
    const lockedOnHeader = headerElement.classList.contains("header-locked");
    const lockedOnBody = bodyElement.classList.contains("header-locked");
    const lockedOnRoot = htmlElement.classList.contains("header-locked");
    const modalOpenClass = bodyElement.classList.contains("modal-open");
    const modalOpenAttr = (() => {
      const v = bodyElement.getAttribute("data-active-modal");
      if (typeof v !== "string") return false;
      if (v === "" || v === "null" || v === "undefined") return false;
      return true;
    })();
    const isLocked = lockedOnHeader || lockedOnBody || lockedOnRoot || modalOpenClass || modalOpenAttr;

    const shouldForceShowNearTop = currentScrollY <= alwaysShowThresholdPixels;
    const shouldHideWhenScrollingDown = deltaY > scrollSensitivityPixels && currentScrollY > alwaysShowThresholdPixels;
    const shouldShowWhenScrollingUp = deltaY < -scrollSensitivityPixels;

    if (!isHideOnScrollEnabled) htmlElement.classList.remove("header-hidden");

    if (isLocked) htmlElement.classList.remove("header-hidden");

    if (isHideOnScrollEnabled && !isLocked) {
      if (shouldForceShowNearTop) htmlElement.classList.remove("header-hidden");
      if (shouldHideWhenScrollingDown) htmlElement.classList.add("header-hidden");
      if (shouldShowWhenScrollingUp) htmlElement.classList.remove("header-hidden");
    }

    applyOffsetForCurrentVisibility();
  }

  function updateScrollClasses(currentScrollY, deltaY) {
    const isScrolledDownNow = currentScrollY > 10;
    const isGoingDown = deltaY > 0;
    const isGoingUp = deltaY < 0;

    if (isGoingDown !== scrollingDown) {
      scrollingDown = isGoingDown;
      if (scrollingDown && !htmlElement.classList.contains("scrolling-down")) htmlElement.classList.add("scrolling-down");
      if (!scrollingDown && htmlElement.classList.contains("scrolling-down")) htmlElement.classList.remove("scrolling-down");
    }

    if (isGoingUp !== scrollingUp) {
      scrollingUp = isGoingUp;
      if (scrollingUp && !htmlElement.classList.contains("scrolling-up")) htmlElement.classList.add("scrolling-up");
      if (!scrollingUp && htmlElement.classList.contains("scrolling-up")) htmlElement.classList.remove("scrolling-up");
    }

    if (isScrolledDownNow !== scrolledDown) {
      scrolledDown = isScrolledDownNow;
      if (scrolledDown && !htmlElement.classList.contains("scrolled-down")) htmlElement.classList.add("scrolled-down");
      if (!scrolledDown && htmlElement.classList.contains("scrolled-down")) htmlElement.classList.remove("scrolled-down");
    }
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY;
      updateScrollClasses(currentScrollY, deltaY);
      updateHeaderVisibilityByScroll(currentScrollY, deltaY);

      // Re-measure when at/near the very top (no transition involved)
      if (!htmlElement.classList.contains("header-hidden") && currentScrollY <= 10) {
        const bottom = Math.max(headerElement.getBoundingClientRect().bottom, 0);
        const clamped = Math.min(bottom, headerHeightPixels);
        if (clamped !== lastFullyVisibleOffsetPixels) {
          lastFullyVisibleOffsetPixels = clamped;
          bodyElement.style.setProperty("--header-height-offset", `${lastFullyVisibleOffsetPixels}px`);
        }
      }

      lastScrollY = currentScrollY;
      ticking = false;
    });
  }

  function onResize() {
    setViewportHeightUnit();
    measureHeader();
  }

  let resizeObserver = null;
  if ("ResizeObserver" in window && headerElement) {
    resizeObserver = new ResizeObserver(() => measureHeader());
    resizeObserver.observe(headerElement);
  }

  let wasHidden = htmlElement.classList.contains("header-hidden");
  let rootClassObserver = null;
  if ("MutationObserver" in window) {
    rootClassObserver = new MutationObserver(() => {
      const nowHidden = htmlElement.classList.contains("header-hidden");
      if (nowHidden !== wasHidden) {
        if (nowHidden) {
          bodyElement.style.setProperty("--header-height-offset", "0px");
        }
        if (!nowHidden) {
          bodyElement.style.setProperty("--header-height-offset", `${lastFullyVisibleOffsetPixels}px`);
        }
        wasHidden = nowHidden;
      }
    });
    rootClassObserver.observe(htmlElement, { attributes: true, attributeFilter: ["class"] });
  }

  headerElement.addEventListener("transitionend", (e) => {
    if (e.propertyName === "transform" || e.propertyName === "top") {
      if (!htmlElement.classList.contains("header-hidden")) {
        const bottom = Math.max(headerElement.getBoundingClientRect().bottom, 0);
        lastFullyVisibleOffsetPixels = Math.min(bottom, headerHeightPixels);
        bodyElement.style.setProperty("--header-height-offset", `${lastFullyVisibleOffsetPixels}px`);
      }
    }
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  window.addEventListener(
    "pageshow",
    () => {
      setViewportHeightUnit();
      measureHeader();
    },
    { once: true }
  );

  setViewportHeightUnit();
  measureHeader();
  onScroll();

  return { measure: measureHeader };
};

window._sections["initLayoutEffects"] = initLayoutEffects;

/* LAST HASH: 0cb66cd42e9abbdc600f4fc0d6b93d5a7de8bf27 */
