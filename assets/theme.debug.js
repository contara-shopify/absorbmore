// ---- _polyfills.js ----
(function(){
"use strict";
const supported = typeof window === "undefined" ? true : "onscrollend" in window;

if (!supported) {
  const scrollendEvent = new Event("scrollend");
  const pointers = new Set();

  // Track if any pointer is active
  document.addEventListener(
    "touchstart",
    (e) => {
      for (const touch of e.changedTouches) pointers.add(touch.identifier);
    },
    { passive: true }
  );

  document.addEventListener(
    "touchend",
    (e) => {
      for (const touch of e.changedTouches) pointers.delete(touch.identifier);
    },
    { passive: true }
  );

  document.addEventListener(
    "touchcancel",
    (e) => {
      for (const touch of e.changedTouches) pointers.delete(touch.identifier);
    },
    { passive: true }
  );

  // Map of scroll-observed elements.
  const observed = new WeakMap();

  // Forward and observe calls to a native method.
  // eslint-disable-next-line no-inner-declarations
  function observe(proto, method, handler) {
    const native = proto[method];
    proto[method] = function () {
      // eslint-disable-next-line prefer-rest-params
      const args = Array.prototype.slice.apply(arguments, [0]);
      native.apply(this, args);
      args.unshift(native);
      handler.apply(this, args);
    };
  }

  // eslint-disable-next-line no-inner-declarations
  function onAddListener(originalFn, type, handler, options) {
    // Polyfill scrollend event on any element for which the developer listens
    // to 'scrollend' explicitly or 'scroll' (so that adding a scrollend listener
    // from within a scroll listener works).
    // eslint-disable-next-line eqeqeq
    if (type != "scroll" && type != "scrollend") return;

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const scrollport = this;
    let data = observed.get(scrollport);
    if (data === undefined) {
      let timeout = 0;
      data = {
        scrollListener: (evt) => {
          clearTimeout(timeout);
          // @ts-ignore
          timeout = setTimeout(() => {
            if (pointers.size) {
              // if pointer(s) are down, wait longer
              setTimeout(data.scrollListener, 180);
            } else {
              // dispatch
              if (scrollport) {
                scrollport.dispatchEvent(scrollendEvent);
              }
              timeout = 0;
            }
          }, 180);
        },
        listeners: 0, // Count of number of listeners.
      };
      originalFn.apply(scrollport, ["scroll", data.scrollListener]);
      observed.set(scrollport, data);
    }
    data.listeners++;
  }

  // eslint-disable-next-line no-inner-declarations
  function onRemoveListener(originalFn, type, handler) {
    // eslint-disable-next-line eqeqeq
    if (type != "scroll" && type != "scrollend") return;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const scrollport = this;
    const data = observed.get(scrollport);

    // Mismatched addEventListener / removeEventListener
    if (data === undefined) return;

    data[type]--;
    // If there are still listeners, nothing more to do.
    if (--data.listeners > 0) return;

    // Otherwise, remove the added listeners.
    originalFn.apply(scrollport, ["scroll", data.scrollListener]);
    observed.delete(scrollport);
  }

  observe(Element.prototype, "addEventListener", onAddListener);
  observe(window, "addEventListener", onAddListener);
  observe(document, "addEventListener", onAddListener);
  observe(Element.prototype, "removeEventListener", onRemoveListener);
  observe(window, "removeEventListener", onRemoveListener);
  observe(document, "removeEventListener", onRemoveListener);
}

(() => {
  window.onerror = function (...args) {
    return args?.[0] === "Script error.";
  };

  window.onunhandledrejection = function (event) {
    console.warn("🚨 Unhandled Promise Rejection:", event.reason);
  };

  const origConsoleWarn = console.warn;
  window.console.warn = function (...args) {
    if (args?.[0]?.includes?.("Alpine Warning: You can't use [x-trap]")) {
      return;
    }
    if (args?.[0]?.includes?.("Alpine Expression Error")) {
      const [message, ...rest] = args;
      console.error(
        `%cAlpine JS Error:%c \n\n${message?.replaceAll("\n\n", "\n")}\n`,
        "color: red; font-size: 17px; font-weight: 600;",
        "font-weight: 600; font-size: 14px;",
        ...rest
      );
      return;
    }
    return origConsoleWarn.apply(this, args);
  };
})();
{};

/* LAST HASH: 6201e06430a9e487007fe2f9791a6792dc0437f3 */
;

})();

// ---- _layout-effects.js ----
(function(){
"use strict";
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
;

})();

// ---- _video-player.js ----
(function(){
"use strict";
const initVideoPlayer = ($el) => {
  const video = $el.querySelector("video");

  const state = Alpine.reactive({
    playing: !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2),
    started: video.currentTime > 0,
    ended: video.ended,
    player: undefined,
    currentTime: video.currentTime | 0,
    duration: isFinite(video.duration) ? video.duration : 0,
    buffered: 0,
    seeking: false,
  });

  const playVideo = () => video.play();
  const pauseVideo = () => video.pause();

  const seek = (t) => {
    const time = Number(t) || 0;
    video.currentTime = time;
    state.currentTime = time;
  };

  const nudge = (delta) => {
    const time = Math.min(Math.max((video.currentTime || 0) + delta, 0), state.duration || 0);
    video.currentTime = time;
    state.currentTime = time;
  };

  const formatTime = (s) => {
    if (!Number.isFinite(s)) return "0:00";
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${sec}`;
  };

  const updateBuffered = () => {
    try {
      let end = 0;
      for (let i = 0; i < video.buffered.length; i++) end = Math.max(end, video.buffered.end(i));
      state.buffered = Math.min(end, video.duration || 0);
    } catch {
      state.buffered = 0;
    }
  };

  const startSeek = (e) => {
    state.seeking = true;
    e.currentTarget?.setPointerCapture?.(e.pointerId);
    _seekFromEvent(e);
  };
  const moveSeek = (e) => {
    _seekFromEvent(e);
  };
  const endSeek = (e) => {
    state.seeking = false;
    e?.currentTarget?.releasePointerCapture?.(e.pointerId);
  };
  const _seekFromEvent = (e) => {
    const rect = e?.currentTarget?.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const ratio = rect.width ? x / rect.width : 0;
    seek(ratio * (state.duration || 0));
  };

  return {
    videoPlayer: state,
    videoEl: video,
    playVideo,
    pauseVideo,
    seek,
    nudge,
    formatTime,
    updateBuffered,
    startSeek,
    moveSeek,
    endSeek,
    _seekFromEvent,
  };
};

window._sections["initVideoPlayer"] = initVideoPlayer;

/* LAST HASH: fd26d6ebd702493700be852de0a2df194f999c1f */
;

})();

// ---- _tabs.js ----
(function(){
"use strict";
const createEnsureNoHiddenTabs = ({ rootElement, tabsStore, cooldownInMilliseconds = 200 }) => {
  let isInCooldownPeriod = false;

  const runCoreCheck = async () => {
    for (let i = 0; i < tabsStore[rootElement.id].current_tabs.length; i++) {
      const nodes = [...rootElement.querySelectorAll(`[data-tab-group="${i}"][data-tab-id]`)];

      if (!nodes.length) return;

      const currentId = tabsStore[rootElement.id].current_tabs?.[i];
      const currentElement = nodes.find((el) => el.getAttribute("data-tab-id") === currentId);
      const isCurrentVisible = currentElement ? utils.isVisible(currentElement) : false;

      if (isCurrentVisible) return;

      for (const node of nodes) {
        if (node === currentElement) continue;
        tabsStore[rootElement.id].current_tabs[i] = node?.getAttribute("data-tab-id") ?? "";
        let shouldBreakLoop = false;

        await new Promise((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              if (utils.isVisible(node)) {
                shouldBreakLoop = true;
              }
              resolve(true);
            });
          });
        });

        if (shouldBreakLoop) {
          break;
        }
      }
    }
  };

  const runAfterLayoutHasSettled = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        void runCoreCheck();
      });
    });
  };

  return () => {
    if (isInCooldownPeriod) return;
    isInCooldownPeriod = true;

    runAfterLayoutHasSettled();

    window.setTimeout(() => {
      isInCooldownPeriod = false;
    }, cooldownInMilliseconds);
  };
};
const initTabsStore = () => {
  window.Alpine.store("tabs", {});

  const tabs = window.Alpine.store("tabs");
  window.Alpine.magic("tabs", () => tabs);
  window._stores["tabs"] = tabs;
};
const initTabs = ($el) => {
  const raw_tabs = utils.JSONParse($el.getAttribute("data-tabs") ?? "[]");

  const tabs = window.Alpine.store("tabs");

  const liquidHandle = (str = "") =>
    str
      .replace(/<[^>]*>/g, "")
      .toLowerCase()
      .trim()
      .replace(/['"]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  tabs[$el.id] = {
    tabs: raw_tabs?.map((t) => (t?.split("|%S%|") || []).map(liquidHandle)),
    current_tabs: raw_tabs?.map((t) => liquidHandle(t?.split("|%S%|")?.[0] || "")),
  };

  const ensureNoHiddenTabs = createEnsureNoHiddenTabs({
    rootElement: $el,
    tabsStore: tabs,
    cooldownInMilliseconds: 200,
  });

  if ($el.querySelector("[data-hotspot-canvas]")) {
    window.setTimeout(() => {
      ensureNoHiddenTabs();
    }, 60);

    [480, 640, 768, 1024, 1280, 1536].forEach((pixelWidth) => {
      window.matchMedia(`(min-width: ${pixelWidth}px)`).addEventListener("change", ensureNoHiddenTabs);
    });

    window.addEventListener("orientationchange", ensureNoHiddenTabs, { passive: true });
  }

  return tabs[$el.id];
};

window._sections["initTabs"] = initTabs;

document.addEventListener("alpine:init", initTabsStore);

/* LAST HASH: 22229dd2a65a8a3e1790e0be9c5fc131d5cb3a63 */
;

})();

// ---- _modals.js ----
(function(){
"use strict";
const initModals = () => {
  const modalsContainer = document.querySelector("[data-dynamic-modals]");

  window.Alpine.store("modal", {
    id: "",
    submenu_handle: "",
    loaded: !!modalsContainer?.children.length || window.modalsLoaded,
    hoverTrigger: false,
    product: _products[Object.keys(_products)[0]],
    variant_id: _products[Object.keys(_products)[0]]?.variants?.[0]?.id,
    setId(value, hover = false, productHandle, productId, selectedVariantId, updateOriginalCard) {
      this.id = value;
      this.hoverTrigger = hover;

      if (productHandle && productId) {
        this.product = _products[productHandle];
        this.variant_id = selectedVariantId || this.product?.variants?.[0]?.id;
        this.updateOriginalCard = updateOriginalCard || null;
        _product.getHydratedProductData(productHandle, productId)?.then((res) => {
          this.product = res;
        });
      }
    },
    setSubId(value, hover = false) {
      this.sub_id = value;
    },
  });

  const modalStore = window.Alpine.store("modal");
  window.Alpine.magic("modal", () => modalStore);
  window._stores["modal"] = modalStore;

  const handleKeydown = (e) => {
    if (e.key === "Escape") {
      modalStore.setId("");
      modalStore.setSubId("");
    }
  };

  let placeholder = null;

  const ensurePlaceholder = (header) => {
    if (!placeholder) {
      placeholder = document.createElement("div");
      placeholder.style.width = "100%";
      placeholder.style.visibility = "hidden";
      placeholder.style.pointerEvents = "none";
      header.parentElement?.insertBefore(placeholder, header);
    }
    placeholder.style.height = `${header.offsetHeight}px`;
  };

  const removePlaceholder = (header) => {
    if (placeholder?.parentElement) {
      placeholder.parentElement.removeChild(placeholder);
    }
    placeholder = null;
  };

  const lockHeader = (header) => {
    if (document.body.classList.contains("header-locked")) return;
    document.body.classList.add("header-locked");

    const rect = header.getBoundingClientRect();
    ensurePlaceholder(header);

    header.style.position = "fixed";
    header.style.top = `${rect.top}px`;
    header.style.left = `${rect.left}px`;
    header.style.width = `${rect.width}px`;
    header.style.zIndex = "9999";
    header.style.transition = "none";
  };

  const unlockHeader = (header) => {
    if (!document.body.classList.contains("header-locked")) return;
    document.body.classList.remove("header-locked");

    header.style.transition = "top 200ms ease";
    header.style.top = getComputedStyle(header).top; // go back to sticky offset

    const cleanup = () => {
      header.style.position = "";
      header.style.top = "";
      header.style.left = "";
      header.style.width = "";
      header.style.zIndex = "";
      header.style.transition = "";

      removePlaceholder(header);
      header.removeEventListener("transitionend", cleanup);
    };

    header.addEventListener("transitionend", cleanup);
  };

  let scrollPosition = 0;

  window.Alpine.effect(() => {
    const blockScroll =
      modalStore?.id &&
      (!/^megamenu--/gi.test(modalStore?.id) || window.innerWidth < 768) &&
      (modalStore?.id !== "search" || window.innerWidth < 768) &&
      modalStore?.id !== "account_menu";

    if (blockScroll) {
      scrollPosition = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.width = "100%";
    }

    if (!blockScroll && document.body.style.position === "fixed") {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollPosition);
    }

    document.body.classList.toggle("!overflow-clip", blockScroll);
    document.body.classList.toggle("pr-[--scrollbar-width]", blockScroll);
    document.documentElement.classList.toggle("!overflow-clip", blockScroll);

    const header = document.querySelector("[data-header-section]");

    if (header) {
      const freezeHeader =
        modalStore?.id &&
        !blockScroll && // only for modals that don't block scroll
        /^megamenu--/gi.test(modalStore?.id) &&
        window.innerWidth >= 768;

      if (freezeHeader) {
        lockHeader(header);
      } else {
        unlockHeader(header);
      }
    }

    if (modalStore?.id) {
      document.addEventListener("keydown", handleKeydown);
    }
    if (!modalStore?.id) {
      document.removeEventListener("keydown", handleKeydown);
    }
  });

  const initEvents = () => {
    window.initDeferredComponents();
    document
      .querySelectorAll(
        '[href*="#modal--"]:not([data-megamenu-initialized]), ' +
          '[href*="#popup--"]:not([data-megamenu-initialized]), ' +
          '[href*="#drawer--"]:not([data-megamenu-initialized]), ' +
          '[href*="#megamenu--"]:not([data-megamenu-initialized]), ' +
          "[data-megamenu-handle]:not([data-megamenu-initialized])"
      )
      .forEach((link) => {
        const handle = (link.getAttribute("data-megamenu-handle") || link.href?.replace(/.*?#/gi, "")?.split("?")?.[0]) ?? "";
        const sub_handle = link.getAttribute("data-megamenu-submenu-handle") ?? "";
        const hasActualLink =
          link.href
            ?.replace(window.location.origin, "")
            ?.replace(window.location.pathname, "")
            ?.replace(window.location.search, "")
            ?.split("#")?.[0]?.length > 1;
        const target = document.querySelector(`[data-megamenu="${handle}"]`);
        const submenu_target = target?.querySelector(`[data-megamenu-submenu="${sub_handle}"]`);

        if (handle.includes("megamenu--") && (!target || (sub_handle && !submenu_target))) {
          return;
        }

        link.setAttribute("data-megamenu-initialized", "true");

        link.onclick = (e) => {
          if (hasActualLink && modalStore.id === handle && (modalStore.sub_id === sub_handle || !sub_handle)) {
            return;
          }
          e.preventDefault();
          e.stopPropagation();

          if (modalStore.id === handle && (modalStore.sub_id === sub_handle || !sub_handle)) {
            if (modalStore.hoverTrigger) return;
            modalStore.setId("");
            modalStore.setSubId("");
            return;
          }
          modalStore.setId(handle);
          modalStore.setSubId(sub_handle);
        };

        const handleFocusKeydown = (e) => {
          if (modalStore.id === handle && (e.key === " " || e.key === "Enter" || e.key === "ArrowUp")) {
            e.preventDefault();
            e.stopPropagation();
            modalStore.setId("");
            modalStore.setSubId("");
            return;
          }

          if (e.key === " " || e.key === "Enter" || e.key === "ArrowDown") {
            e.preventDefault();
            e.stopPropagation();
            modalStore.setId(handle);
            modalStore.setSubId(sub_handle);
          }
        };

        link.onfocus = (e) => {
          link.addEventListener("keydown", handleFocusKeydown);
        };

        link.onblur = (e) => {
          link.removeEventListener("keydown", handleFocusKeydown);
        };
      });
  };

  if (Shopify.designMode) {
    document.addEventListener(
      "theme:init",
      () => {
        const editor = window.Alpine.store("editor");

        window.Alpine.effect(() => {
          if (editor?.load_section_id) {
            initEvents();
          }
        });
      },
      { once: true }
    );
  }

  let hoverTimeout;

  const exitHover = (e) => {
    clearTimeout(hoverTimeout);

    hoverTimeout = setTimeout(() => {
      const modal = document.querySelector(`[data-megamenu="${modalStore.id}"] [x-trap\\.noautofocus="show"]`);
      const effectBlocker = document.querySelector(`[data-megamenu-effect-block="${modalStore.id}"]`);
      const selectPopup = document.querySelector(`[x-show="show_popover"]`);
      const trigger = document.querySelector(`[href="#${modalStore.id}"]`);

      if (
        [...(e.target?.children ?? [])].some((child) => child === trigger) ||
        e.target?.closest(`[href="#${modalStore.id}"]`) ||
        e.target?.closest(`[data-megamenu-effect-block*="megamenu--"]`) ||
        e.target?.closest(`[data-megamenu="${modalStore.id}"] [x-trap\\.noautofocus="show"]`) ||
        e.target?.closest(`[x-show="show_popover"]`) ||
        e.target?.closest(`[data-style-id="section_group__megamenu"]`) ||
        e.target === modal ||
        e.target === effectBlocker ||
        e.target === trigger ||
        e.target === selectPopup
      ) {
        return;
      }

      modalStore.id = "";
      modalStore.hoverTrigger = false;
    }, 100);
  };

  window.Alpine.effect(() => {
    if (modalStore.id && modalStore.hoverTrigger) {
      document.addEventListener("pointerover", exitHover);
    }
    if (!modalStore.hoverTrigger || !modalStore.id) {
      document.removeEventListener("pointerover", exitHover);
    }
  });

  const debouncedInitEvents = utils.debounce(initEvents, 10);

  const mutationObserver = new MutationObserver((e) => {
    e?.forEach((record) => {
      const nodes = [];

      if (record?.addedNodes?.length && record?.target instanceof Element) {
        debouncedInitEvents();
      }
    });
  });
  mutationObserver.observe(document.body, { childList: true, subtree: true });

  initEvents();
};

document.addEventListener("alpine:init", initModals);

/* LAST HASH: b28ce14bdd1e46653c257322e7642c1a58d046bc */
;

})();

// ---- _utils.js ----
(function(){
"use strict";
let initCollapsible = undefined;
let initContentSlider = undefined;

initCollapsible = undefined;
initContentSlider = undefined;

const JSONParse = (object, origin = "") => {
  if (object === undefined) {
    return null;
  }
  try {
    return JSON.parse(object);
  } catch (err) {
    return null;
  }
};

const getImageSrcSet = (src, maxWidth) => {
  if (!src || typeof src !== "string") {
    return "";
  }
  if (src?.includes("?")) {
    return [3840, 1920, 1440, 1200, 960, 640, 460, 384, 256, 180, 96]
      .map((number, index, arr) => {
        if (maxWidth && arr[index + 1] > maxWidth) {
          return null;
        }
        return `${src}&width=${number} ${number}w`;
      })
      .filter((d) => !!d)
      .slice(0, 5)
      .join(",");
  }
  return [3840, 1920, 1440, 1200, 960, 640, 460, 384, 256, 180, 96]
    .map((number, index, arr) => {
      if (maxWidth && arr[index + 1] > maxWidth) {
        return null;
      }
      return `${src}?width=${number} ${number}w`;
    })
    .filter((d) => !!d)
    .slice(0, 5)
    .join(",");
};

const getReviewStarGradients = (rating, position) => {
  return `url(#star-rating-${
    rating < position - 1
      ? 0
      : rating < position && rating > position - 1
      ? Math.floor(((rating - (position - 1)) * 100) / 25) * 25
      : 100
  })`;
};

const pushSearchParams = ({ update = {}, remove = [], title }) => {
  const url = new URL(window.location.href);
  Object.entries(update).forEach(([key, value]) => {
    url.searchParams.set(key, `${value}`);
  });
  remove.forEach((key) => {
    url.searchParams.delete(key);
  });

  window.history.pushState(null, null, url);
};

const replaceSearchParams = ({ update = {}, remove = [], title }) => {
  const url = new URL(window.location.href);
  Object.entries(update).forEach(([key, value]) => {
    url.searchParams.set(key, `${value}`);
  });
  remove.forEach((key) => {
    url.searchParams.delete(key);
  });

  window.history.replaceState(null, null, url);
};

const getSiblingUrl = (handle) => {
  const url = new URL(window.location.href);
  url.pathname = /\/collections\/[^/]\/products\//gi.test(url.pathname)
    ? url.pathname.replace(/\/products\/[^?]*/gi, `/products/${handle}`)
    : `/products/${handle}`;
  url.searchParams.delete("variant");
  url.searchParams.delete("selling_plan");
  return url.toString();
};

const pushUrlTarget = (id) => {
  const url = new URL(window.location.href);
  url.hash = id;

  window.history.replaceState(null, null, url);
};

const checkDomain = function (url) {
  if (url && url?.indexOf("//") === 0) {
    url = location.protocol + url;
  }
  return url
    .toLowerCase()
    .replace(/([a-z])?:\/\//, "$1")
    .split("/")[0];
};

const isExternalURL = function (url) {
  if (!url || typeof url !== "string") {
    return false;
  }

  return (url?.indexOf(":") > -1 || url?.indexOf("//") > -1) && checkDomain(location.href) !== checkDomain(url);
};

const liquidHandle = (str = "") =>
  str
    .replace(/<[^>]*>/g, "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const transpileRichtextMetafield = (schema) => {
  function convertSchemaToHtml(schema) {
    let html = ``;
    if (!Array.isArray(schema) && schema.type === "root") {
      html += convertSchemaToHtml(schema.children);
    }

    if (Array.isArray(schema)) {
      schema?.forEach((el) => {
        switch (el.type) {
          case "paragraph":
            html += buildParagraph(el);
            break;
          case "heading":
            html += buildHeading(el);
            break;
          case "list":
            html += buildList(el);
            break;
          case "list-item":
            html += buildListItem(el);
            break;
          case "link":
            html += buildLink(el);
            break;
          case "text":
            html += buildText(el);
            break;
          default:
            break;
        }
      });
    }
    return html;
  }

  function buildParagraph(el) {
    if (el?.children) {
      return `<p>${convertSchemaToHtml(el?.children)}</p>`;
    }
    return "";
  }

  function buildHeading(el) {
    if (el?.children) {
      return `<h${el?.level}>${convertSchemaToHtml(el?.children)}</h${el?.level}>`;
    }
    return "";
  }

  function buildList(el) {
    if (el?.children) {
      if (el?.listType === "ordered") {
        return `<ol>${convertSchemaToHtml(el?.children)}</ol>`;
      } else {
        return `<ul>${convertSchemaToHtml(el?.children)}</ul>`;
      }
    }
    return "";
  }

  function buildListItem(el) {
    if (el?.children) {
      return `<li>${convertSchemaToHtml(el?.children)}</li>`;
    }
    return "";
  }

  function buildLink(el) {
    return `<a href="${el?.url}" title="${el?.title}" target="${el?.target}">${convertSchemaToHtml(el?.children)}</a>`;
  }

  function buildText(el) {
    if (el?.bold) {
      return `<strong>${el?.value}</strong>`;
    }
    if (el?.italic) {
      return `<em>${el?.value}</em>`;
    }
    return el?.value;
  }

  return convertSchemaToHtml(schema);
};

const clsx = (...props) => {
  let i = 0;
  let tmp;
  let str = "";
  const len = props.length;
  for (; i < len; i++) {
    if ((tmp = props[i])) {
      if (typeof tmp === "string") {
        str += (str && " ") + tmp;
      }
    }
  }
  return str;
};

const shortUUID = () => {
  // I generate the UID from two parts here
  // to ensure the random number provide enough bits.
  let firstPart = (Math.random() * 46656) | 0;
  let secondPart = (Math.random() * 46656) | 0;
  firstPart = `000${firstPart.toString(36)}`.slice(-3);
  secondPart = `000${secondPart.toString(36)}`.slice(-3);
  return firstPart + secondPart;
};

const isEmail = (str) => {
  if (!str) return false;
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(str);
};

const formatMoney = (cents, money_format = window.money_format, no_rounding = true) => {
  if (money_format?.includes("store_default")) {
    money_format = window.money_format;
  }
  if (cents === null || cents === undefined) return "";

  if (typeof cents === "string") {
    cents = cents.replace(/[^\d]/g, "");
    cents = parseInt(cents, 10);
  }

  const formatRegex = /{{\s*(\w+)\s*}}/;
  const formatKey = money_format?.match(formatRegex)?.[1];

  const formatNumber = (value, decimals = 2, thousandsSep = ",", decimalSep = ".") => {
    if (isNaN(value)) return "0";
    const fixed = (value / 100).toFixed(decimals);
    const [intPart, decPart] = fixed.split(".");
    const intWithSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
    return decimals > 0 ? `${intWithSep}${decimalSep}${decPart}` : intWithSep;
  };

  let formatted = "";
  switch (formatKey) {
    case "amount":
      formatted = formatNumber(cents, 2);
      break;
    case "amount_no_decimals":
      formatted = no_rounding && cents % 100 > 0 ? formatNumber(cents, 2) : formatNumber(cents, 0);
      break;
    case "amount_with_comma_separator":
      formatted = formatNumber(cents, 2, ".", ",");
      break;
    case "amount_with_space_separator":
      formatted = formatNumber(cents, 2, "\u00A0", ",");
      break;
    case "amount_with_period_and_space_separator":
      formatted = formatNumber(cents, 2, " ", ".");
      break;
    case "amount_no_decimals_with_comma_separator":
      formatted = formatNumber(cents, 0, ".", ",");
      break;
    case "amount_no_decimals_with_space_separator":
      formatted = formatNumber(cents, 0, "\u00A0", ",");
      break;
    case "amount_with_apostrophe_separator":
      formatted = formatNumber(cents, 2, "'", ".");
      break;
    default:
      return formatNumber(cents, 2);
  }

  return money_format?.replace(formatRegex, formatted) ?? formatted;
};

window["formatMoney"] = formatMoney;

const roundToIndex = function (x, index = 0) {
  // Rounds a number to a given index around the decimal point.
  //
  // Args:
  //   x - Number to round.
  //   index - Index of the least significan digit; 0 is the decimal point.
  // Returns:
  //   rounded - Number rounded using the least signficant digit.

  const power = Math.pow(10, -index);
  return Math.round(x * power) / power;
};

const easeInOutQuad = ({ currentTime, start, change, duration }) => {
  let newCurrentTime = currentTime;
  newCurrentTime /= duration / 2;

  if (newCurrentTime < 1) {
    return (change / 2) * newCurrentTime * newCurrentTime + start;
  }

  newCurrentTime -= 1;
  return (-change / 2) * (newCurrentTime * (newCurrentTime - 2) - 1) + start;
};

const scrollToY = (duration, to, container = window, callback = () => {}) => {
  const start = container instanceof HTMLElement ? container.scrollTop : container.scrollY;

  const change = to - start;
  const startDate = new Date().getTime();

  const animateScroll = () => {
    const currentDate = new Date().getTime();
    const currentTime = currentDate - startDate;

    container.scrollTo(
      0,
      easeInOutQuad({
        currentTime,
        start,
        change,
        duration,
      })
    );

    if (currentTime < duration) {
      requestAnimationFrame(animateScroll);
    } else {
      container.scrollTo(0, to);
      callback();
    }
  };
  animateScroll();
};

const scrollToX = (duration, to, container = window, callback = () => {}) => {
  const start = container instanceof HTMLElement ? container.scrollLeft : container.scrollX;

  const change = to - start;
  const startDate = new Date().getTime();

  const animateScroll = () => {
    const currentDate = new Date().getTime();
    const currentTime = currentDate - startDate;

    container.scrollTo(
      easeInOutQuad({
        currentTime,
        start,
        change,
        duration,
      }),
      0
    );

    if (currentTime < duration) {
      requestAnimationFrame(animateScroll);
    } else {
      container.scrollTo(to, 0);
      callback();
    }
  };
  animateScroll();
};

const scrollToXY = (duration, x, y, container = window, callback = () => {}) => {
  const startX = container instanceof HTMLElement ? container.scrollLeft : container.scrollX;
  const startY = container instanceof HTMLElement ? container.scrollTop : container.scrollY;

  const changeX = x - startX;
  const changeY = y - startY;
  const startDate = Date.now();

  const animateScroll = () => {
    const currentDate = Date.now();
    const currentTime = currentDate - startDate;

    container.scrollTo(
      easeInOutQuad({
        currentTime,
        start: startX,
        change: changeX,
        duration,
      }),
      easeInOutQuad({
        currentTime,
        start: startY,
        change: changeY,
        duration,
      })
    );

    if (currentTime < duration) {
      requestAnimationFrame(animateScroll);
    } else {
      container.scrollTo(x, y);
      callback();
    }
  };
  animateScroll();
};

const isElementScrollable = (element) => {
  if (!element) return false;
  const { overflowX, overflowY } = getComputedStyle(element);
  const isScrollableX = element.scrollWidth > element.clientWidth && overflowX !== "visible";
  const isScrollableY = element.scrollHeight > element.clientHeight && overflowY !== "visible";

  return isScrollableX || isScrollableY;
};

function getElementPosition(element) {
  const box = element.getBoundingClientRect();

  const body = document.body;
  const docEl = document.documentElement;

  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  const clientTop = docEl.clientTop || body.clientTop || 0;
  const clientLeft = docEl.clientLeft || body.clientLeft || 0;

  const top = box.top + scrollTop - clientTop;
  const left = box.left + scrollLeft - clientLeft;

  return { top: Math.round(top), left: Math.round(left) };
}

const getElementOffset = (el) => {
  const rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const debounce = (callback, wait = 1) => {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, wait);
  };
};

const findAllScrollableParents = (element) => {
  const scrollableParents = [];
  let parent = element.parentElement;

  while (parent) {
    const style = window.getComputedStyle(parent);
    const overflowY = style.getPropertyValue("overflow-y");

    if (overflowY === "auto" || overflowY === "scroll") {
      scrollableParents.push(parent);
    }

    parent = parent.parentElement;
  }

  // Check if the document element is a scrollable container (window)
  if (document.scrollingElement) {
    scrollableParents.push(document.scrollingElement);
  }
  scrollableParents.push(window);

  return scrollableParents;
};

const findCurrentlyAllScrollableParents = (element) => {
  const scrollableParents = [];
  let parent = element.parentElement;

  while (parent) {
    const style = window.getComputedStyle(parent);
    const overflowY = style.getPropertyValue("overflow-y");

    if ((overflowY === "auto" || overflowY === "scroll") && parent.scrollHeight > parent.clientHeight) {
      scrollableParents.push(parent);
    }

    parent = parent.parentElement;
  }
  parent = document.scrollingElement;
  const style = window.getComputedStyle(document.scrollingElement);
  const overflowY = style?.getPropertyValue("overflow-y");

  if ((overflowY === "auto" || overflowY === "scroll") && parent.scrollHeight > parent.clientHeight) {
    scrollableParents.push(document.scrollingElement);
  }

  return scrollableParents;
};

const handlelize = (str) => {
  str = str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/([^\w]+|\s+)/g, "-") // Replace space and other characters by hyphen
    .replace(/--+/g, "-") // Replaces multiple hyphens by one hyphen
    .replace(/(^-+|-+$)/g, "") // Remove extra hyphens from beginning or end of the string
    .toLowerCase(); // To lowercase

  return str;
};

const serializeForm = (formElement) => {
  const obj = {};
  const formData = new FormData(formElement);
  for (const key of formData.keys()) {
    obj[key] = formData.get(key);
  }
  return obj;
};

const deepEqual = (a, b) => {
  if (a === b) return true;

  if (a && b && typeof a === "object" && typeof b === "object") {
    if (a.constructor !== b.constructor) return false;

    let length, i, keys;
    if (Array.isArray(a)) {
      length = a.length;
      // eslint-disable-next-line eqeqeq
      if (length != b.length) return false;
      for (i = length; i-- !== 0; ) if (!deepEqual(a[i], b[i])) return false;
      return true;
    }

    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

    // eslint-disable-next-line prefer-const
    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;

    for (i = length; i-- !== 0; ) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (i = length; i-- !== 0; ) {
      const key = keys[i];

      if (!deepEqual(a[key], b[key])) return false;
    }

    return true;
  }

  // true if both NaN, false otherwise
  return a !== a && b !== b;
};

window.clsx = clsx;

const isVisible = (elem, isParent = false) => {
  if (!(elem instanceof Element)) {
    return false;
  }
  const style = getComputedStyle(elem);
  if (style.display === "none") return false;
  if (!isParent && style.pointerEvents === "none") return false;
  if (style.visibility !== "visible") return false;
  if (+style.opacity < 0.1) return false;
  if (elem.offsetWidth + elem.offsetHeight + elem.getBoundingClientRect().height + elem.getBoundingClientRect().width === 0) {
    return false;
  }
  if (elem.parentElement) {
    return isVisible(elem.parentElement, true);
  }
  return true;
};

const isInViewport = (element) => {
  const { y } = element.getBoundingClientRect();
  if (y > window.innerHeight || y < 0) {
    return false;
  }
  return true;
};

const isElementVisiblyOnTop = (element) => {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const topElement = document.elementFromPoint(centerX, centerY);

  return element === topElement || element.contains(topElement);
};

const isElementFullyVisible = (el) => isInViewport(el) && isElementVisiblyOnTop(el);

const unwrapNestedBlocksSimple = (html) => {
  if (typeof html !== "string") {
    return html;
  }
  return (
    html?.replace(
      /<(?<outer>p|h[1-6])[^>]*>\s*<(?<inner>\k<outer>)[^>]*>((?:.|\n)*?)<\/\k<inner>>\s*<\/\k<outer>>/gi,
      "<$<inner>>$3</$<inner>>"
    ) ?? ""
  );
};

const applyInlinePluralization = (content) => {
  let replaced = content;

  // Step 1: Direct "number word{...}" matches
  replaced = replaced.replace(/(\d+)\s+([a-zA-Z]+)\{([^{}|]+)(?:\|([^{}|]+))?\}/g, (_, number, base, singular, plural) => {
    const count = parseInt(number, 10);
    return plural === undefined
      ? `${number} ${base}${count === 1 ? "" : singular}`
      : `${number} ${count === 1 ? base + singular : base + plural}`;
  });

  // Step 2: Fallback for lone word{...} — use last number before it
  replaced = replaced.replace(/([a-zA-Z]+)\{([^{}|]+)(?:\|([^{}|]+))?\}/g, (match, base, singular, plural, offset) => {
    const upToMatch = replaced.slice(0, offset);
    const matchNumber = upToMatch.match(/(\d+)(?!.*\d)/); // last number before match
    const count = matchNumber ? parseInt(matchNumber[1], 10) : 1;

    return plural === undefined ? `${base}${count === 1 ? "" : singular}` : `${count === 1 ? base + singular : base + plural}`;
  });

  return replaced;
};

const getBracketInputDynamicPluralizedText = (content, object = {}) => {
  let returnValue = "";

  returnValue =
    content?.replace(/\[([^\]]*)\]/gi, (...matches) => {
      if (!matches[1]) {
        return "";
      }
      if (/^icon\./gi.test(matches[1])) {
        return matches[0];
      }
      let result =
        // @ts-ignore
        matches?.[1]?.split(".")?.reduce(
          (acc, selector, index, arr) => {
            if (!selector || acc[0] === undefined || acc[0] === null) {
              if (/price$/gi.test(acc[1]) && typeof acc[0] === "number") {
                return [utils.formatMoney(acc[0]), selector];
              }
              if (/_at$/gi.test(acc[1]) && Date.parse(acc[0])) {
                return [new Date(acc[0]).toLocaleDateString(), selector];
              }
              if (typeof acc[0] === "string" && acc[0].includes("®")) {
                return [acc[0].replace(/®/gi, `<sup style="font-size: 0.7em;">®</sup>`), selector];
              }

              if (Array.isArray(acc[0]) && acc[0].every((val) => typeof val === "string" || typeof val === "number")) {
                return [acc[0].join(", "), selector];
              }
              return acc;
            }

            if (acc[0] && typeof acc[0] === "object" && selector in acc[0]) {
              if (/price$/gi.test(selector) && typeof acc[0][selector] === "number") {
                return [utils.formatMoney(acc[0][selector]), selector];
              }
              if (/_at$/gi.test(selector) && Date.parse(acc[0][selector])) {
                if (arr[index + 1]) {
                  return [window.dayjs(acc[0][selector])?.format(arr[index + 1]), selector];
                }
                return [new Date(acc[0][selector]).toLocaleDateString(), selector];
              }
              if (typeof acc[0][selector] === "string" && acc[0][selector].includes("®")) {
                return [acc[0][selector].replace(/®/gi, `<sup style="font-size: 0.7em;">®</sup>`), selector];
              }
              if (index === arr.length - 1) {
                if (
                  Array.isArray(acc[0][selector]) &&
                  acc[0][selector].every((val) => typeof val === "string" || typeof val === "number")
                ) {
                  return [acc[0][selector].join(", "), selector];
                }
              }

              return [acc[0][selector], selector];
            }
            if (selector && typeof acc[0] === "string") {
              return acc;
            }
            return ["", ""];
          },
          [object, ""]
        )?.[0] ?? "";

      if (typeof result === "string" && result?.includes("Default Title")) {
        result = result?.replace("Default Title", "");
      }
      return result;
    }) ?? "";

  return unwrapNestedBlocksSimple(applyInlinePluralization(returnValue ?? ""));
};

const getBracketInputDynamicValue = (content, object = {}) => {
  let returnValue = null;
  if (!content || typeof content !== "string") {
    return null;
  }
  content?.replace(/\[([^\]]*)\]/gi, (...matches) => {
    if (!matches[1]) {
      return returnValue;
    }

    // @ts-ignore
    returnValue = matches?.[1]?.split(".")?.reduce(
      (acc, selector) => {
        if (!selector || acc[0] === undefined || acc[0] === null) {
          if (/price$/gi.test(acc[1]) && typeof acc[0] === "number") {
            return [utils.formatMoney(acc[0]), selector];
          }
          if (/_at$/gi.test(acc[1]) && Date.parse(acc[0])) {
            return [new Date(acc[0]).toLocaleDateString(), selector];
          }
          if (typeof acc[0] === "string" && acc[0].includes("®")) {
            return [acc[0].replace(/®/gi, `<sup style="font-size: 0.7em;">®</sup>`), selector];
          }
          return acc;
        }

        if (acc[0] && selector in acc[0]) {
          if (/price$/gi.test(selector) && typeof acc[0][selector] === "number") {
            return [utils.formatMoney(acc[0][selector]), selector];
          }
          if (/_at$/gi.test(selector) && Date.parse(acc[0][selector])) {
            return [new Date(acc[0][selector]).toLocaleDateString(), selector];
          }
          if (typeof acc[0][selector] === "string" && acc[0][selector].includes("®")) {
            return [acc[0][selector].replace(/®/gi, `<sup style="font-size: 0.7em;">®</sup>`), selector];
          }
          return [acc[0][selector], selector];
        }
        return ["", ""];
      },
      [object, ""]
    )?.[0];
    return "";
  });

  return unwrapNestedBlocksSimple(returnValue ?? "");
};

function unescape(htmlStr) {
  htmlStr = htmlStr.replace(/&lt;/g, "<");
  htmlStr = htmlStr.replace(/&gt;/g, ">");
  htmlStr = htmlStr.replace(/&quot;/g, '"');
  htmlStr = htmlStr.replace(/&#39;/g, "'");
  htmlStr = htmlStr.replace(/&amp;/g, "&");
  return htmlStr;
}

function setUniformHeightById(id) {
  // Get all elements with the specified ID
  const elements = document.querySelectorAll(`[data-style-id="${id}"]`);

  // If there are no elements with the given ID, do nothing
  if (elements.length === 0) {
    return;
  }

  // Calculate the maximum height
  let maxHeight = 0;
  elements.forEach((element) => {
    // Reset height to auto to correctly measure the height if it was previously set
    element.style.height = "auto";
    const elementHeight = element.offsetHeight;
    if (elementHeight > maxHeight) {
      maxHeight = elementHeight;
    }
  });

  // Set all elements to the maximum height
  elements.forEach((element) => {
    element.style.height = `${maxHeight}px`;
  });
}

const setCookie = (cookieName, cookieValue, cookieMinutes = 60 * 24) => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }
  const d = new Date();
  d.setTime(d.getTime() + cookieMinutes * 60 * 1000); // Set the cookie expiration time (cookieLifespan is in days).
  const expires = d.toUTCString();
  document.cookie = `${cookieName}=${cookieValue};expires=${expires};path=/;SameSite=Strict;`;
  return true;
};

const getCookie = (cookieName) => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }

  const name = `${cookieName}=`;
  const cookieArray = document.cookie.split(";"); // Split the document's cookie string into an array.
  for (let i = 0; i < cookieArray.length; i++) {
    // For every cookie in the array.
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === " ") {
      // Remove any space from the start of the cookie name.
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length); // Return the value of the cookie.
    }
  }
  return false; // Return false if there were no matching cookies.
};

const checkCookie = (cookieName) => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }
  return !!cookieName && document.cookie.includes(`${cookieName}=`); // Return true if the requested cookie name exists in the document.
};

const removeCookie = (cookieName) => {
  setCookie(cookieName, "", -1); // Cause the browser to remove the cookie by setting its expiration to a date in the past.
};

const focusSelectorString = `:not(.placeholder) a[href]:not(:where([disabled],[tabindex="-1"])),
              :not(.placeholder) button:not(:where([disabled],[tabindex="-1"])),
              :not(.placeholder) textarea:not(:where([disabled],[tabindex="-1"])),
              :not(.placeholder) input[type="text"]:not(:where([disabled],[tabindex="-1"])),
              :not(.placeholder) input[type="radio"]:not(:where([disabled],[tabindex="-1"])),
              :not(.placeholder) input[type="checkbox"]:not(:where([disabled],[tabindex="-1"])),
              :not(.placeholder) select:not(:where([disabled],[tabindex="-1"])),
              :not(.placeholder, [tabindex="-1"]) [tabindex]:not(:where([disabled],[tabindex="-1"])`;

const getHeaderHeight = () => {
  return Math.max(utils.roundToIndex(document.querySelector("[data-navigation-bar]")?.getBoundingClientRect().bottom, -2), 0);
};

const initYouTube = async () => {
  if (!window.YT && !window._youtube_initialized) {
    window._youtube_initialized = true;
    await new Promise((resolve) => {
      if (!window.onYouTubeIframeAPIReady) {
        window.onYouTubeIframeAPIReady = () => {
          resolve(true);
          document.dispatchEvent(new CustomEvent("youtube-loaded"));
        };
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
    });
  }
};

const simulateAnchorTag = ($el) => {
  if (!$el) return;
  const modalStore = window.Alpine.store("modal");

  $el.addEventListener("click", (e) => {
    if (e.target.closest("a") || !$el.getAttribute("data-href")) return;

    e.preventDefault();
    e.stopPropagation();

    if (e.button === 1 || e.ctrlKey || e.metaKey || $el.getAttribute("data-target") === "_blank") {
      window.open($el.getAttribute("data-href"), "_blank", "noopener,noreferrer");
    } else if (e.shiftKey) {
      window.open($el.getAttribute("data-href"), "_blank");
    } else {
      barba.go($el.getAttribute("data-href"));
      modalStore.setId("");
    }
  });

  $el.addEventListener("mousedown", (e) => {
    if (e.target.closest("a") || !$el.getAttribute("data-href") || e.button !== 1) return;

    if (e.ctrlKey || e.metaKey || $el.getAttribute("data-target") === "_blank") {
      window.open($el.getAttribute("data-href"), "_blank", "noopener,noreferrer");
      e.preventDefault();
    }
  });

  $el.addEventListener("keydown", (e) => {
    if (!$el.getAttribute("data-href")) return;
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();

      if ($el.getAttribute("data-target") === "_blank") {
        window.open($el.getAttribute("data-href"), "_blank", "noopener,noreferrer");
        return;
      } else {
        barba.go($el.getAttribute("data-href"));
        modalStore.setId("");
      }
    }
  });
};

const preloadImage = (src) => {
  if (!src) return true;
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
};

const applyStyles = (el, styles) => {
  Object.entries(styles).forEach(([key, value]) => {
    el.style[key] = value;
  });
};

const richtextWithPrices = (content, price = 0, compare_at_price = 0) => {
  if (!content) return content ?? "";

  return (
    content
      ?.replace(
        "[price|no-decimals]",
        utils.formatMoney(price, window?.money_format?.replace(/\{(\s*)amount(\s*)}/gi, "{$1amount_no_decimals$2}"))
      )
      ?.replace("[price]", utils.formatMoney(price))
      ?.replace(
        "[compare_at_price|no-decimals]",
        compare_at_price > price
          ? `<span style='text-decoration: line-through; opacity: 0.5;'>${utils.formatMoney(
              compare_at_price,
              window?.money_format?.replace(/\{(\s*)amount(\s*)}/gi, "{$1amount_no_decimals$2}")
            )}</span>`
          : ""
      )
      ?.replace(
        "[compare_at_price]",
        compare_at_price > price
          ? `<span style='text-decoration: line-through; opacity: 0.5;'>${utils.formatMoney(compare_at_price)}</span>`
          : ""
      ) ?? ""
  );
};

const validateFormAndToast = (formEl) => {
  const inputs = formEl.querySelectorAll("input, textarea, select");
  let firstInvalid = null;

  for (const input of inputs) {
    // Reset any prior custom errors
    input.setCustomValidity("");

    if (input.disabled) continue;

    const value = input.value.trim();
    const label = input.getAttribute("aria-label") || input.name || "This field";

    // Required field check
    if (input.hasAttribute("required") && !value) {
      _stores.toast.addToast({
        type: "error",
        target: "generic",
        title: "We've encountered a problem.",
        content: `${label} is required.`,
        timestamp: Date.now(),
      });
      input.setCustomValidity("Required");
      firstInvalid = firstInvalid || input;
      continue;
    }

    // Email format check
    if (
      (input.type === "email" || input.getAttribute("data-type") === "email") &&
      value &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
    ) {
      _stores.toast.addToast({
        type: "error",
        target: "generic",
        title: "We've encountered a problem.",
        content: `${label} must be a valid email address.`,
        timestamp: Date.now(),
      });
      input.setCustomValidity("Invalid");
      firstInvalid = firstInvalid || input;
    }
  }

  if (firstInvalid) {
    firstInvalid.reportValidity(); // Optional: show browser error indicator
    firstInvalid.scrollIntoView({ behavior: "instant", block: "start" });
    setTimeout(() => {
      window.scrollBy({ top: -230, behavior: "instant" });
    }, 10);
    firstInvalid.focus();
    return false;
  }

  return true;
};

const normalizePhoneInput = (input) =>
  input
    ?.replace(/[^\d+]/g, "")
    ?.replace(/^00/, "+")
    ?.replace(/^0+/, "");

const getShopifyCacheUrl = (href) => {
  try {
    const url = new URL(href);
    const searchParams = [];
    // @ts-ignore
    for (const [key, value] of url.searchParams) {
      if (key === "page") {
        searchParams.push(`${key}=${value}`);
      }
      if (key === "sort_by") {
        searchParams.push(`${key}=${value}`);
      }
      if (/^filter\./gi.test(key)) {
        searchParams.push(`${key}=${value}`);
      }
    }

    const sortedSearchParams = [...searchParams].sort();

    if (sortedSearchParams?.length) {
      return `${href?.split(/[?#&]/gi)?.[0]?.replace(/(\/collections\/[^/]*\/)/gi, "/")}?${sortedSearchParams.join("&")}`;
    }
    return href?.split(/[?#&]/gi)?.[0]?.replace(/(\/collections\/[^/]*\/)/gi, "/");
  } catch (err) {
    return href?.split(/[?#&]/gi)?.[0]?.replace(/(\/collections\/[^/]*\/)/gi, "/");
  }
};

const fetchFromCache = async (urlString, options = {}) => {
  if (!urlString.includes(window.location.origin)) {
    urlString = window.location.origin + urlString;
  }

  const url = new URL(urlString);
  const cacheUrl = getShopifyCacheUrl(urlString);

  const cachePath = url.toString().replace(window.location.origin, "");

  let cache = barba.cache.get(cacheUrl);

  if (!cache?.request) {
    const keys = await idbKeyval.keys();

    const key = keys.find((key) => key.includes(cacheUrl));

    if (key) {
      cache = barba.cache.set(cacheUrl, idbKeyval.get(key)?.then((res) => res?.data), "prefetch");
    }
  }

  if (!cache?.request) {
    const data = fetch(urlString, { cache: "force-cache", ...options })
      .then((res) => res.text())
      .then((html) => ({
        html,
        url: { hash: undefined, href: cacheUrl, path: cachePath },
      }));

    // @ts-ignore
    cache = barba.cache.set(cacheUrl, data, "prefetch");
    document.dispatchEvent(new CustomEvent("barba:prefetch:fulfilled", { detail: { url: cacheUrl } }));
  }

  let request = await cache?.request;
  let html = request?.html;

  if (!html) {
    const data = fetch(urlString, { cache: "force-cache", ...options })
      .then((res) => res.text())
      .then((html) => ({
        html,
        url: { hash: undefined, href: cacheUrl, path: cachePath },
      }));

    // @ts-ignore
    cache = barba.cache.set(cacheUrl, data, "prefetch");
    request = await cache?.request;
    html = request?.html;
    document.dispatchEvent(new CustomEvent("barba:prefetch:fulfilled", { detail: { url: cacheUrl } }));
  }

  return html;
};

const hasAlpine = new Promise((resolve) => {
  window.addEventListener("alpine:initialized", resolve, { once: true, passive: true });
});

const initializeIgnoredAlpineTree = (el) => {
  utils.hasAlpine.then(() => {
    if (el.hasAttribute("x-ignore")) {
      el.setAttribute("data-x-ignore", "");
      el.removeAttribute("x-ignore");
    }
    queueMicrotask(() => Alpine.initTree(el));
  });
};

const barbaPrefetchTargetPage = (element, url, delayMs = 2500) => {
  const abortController = new AbortController();
  let idleCallback;
  const timeout = setTimeout(() => {
    idleCallback = requestIdleCallback(() => {
      barba?.prefetch(url);
      abortController.abort();
    });
  }, delayMs);

  ["pointerenter", "pointerdown", "focusin"].forEach((event) => {
    element.addEventListener(
      event,
      () => {
        abortController.abort();
        if (timeout) clearTimeout(timeout);
        if (idleCallback) cancelIdleCallback(idleCallback);
        barba?.prefetch(url);
      },
      { signal: abortController.signal, passive: true, once: true }
    );
  });
};

const spreadGenericCardFunctions = (state) => {
  const getDynamicValue = (content) => {
    return utils.getBracketInputDynamicValue(content, state);
  };

  const getDynamicValueWithFallbacks = (content) => {
    return content.split(",")?.reduce((acc, item) => {
      acc ||= utils.getBracketInputDynamicValue(item.trim(), state);
      return acc;
    }, "");
  };

  const getDynamicText = (content) => {
    return utils.getBracketInputDynamicPluralizedText(content, state);
  };

  const getContentLabels = (key) => {
    const labels = key
      .replace(/[[\]]/gi, "")
      .split(".")
      .reduce((acc, selector) => {
        if (!selector || acc === undefined || acc === null) return acc || "";

        if (acc && selector in acc) {
          return acc[selector];
        }
        return "";
      }, state);

    if (Array.isArray(labels)) {
      return labels.filter(Boolean);
    }
    return [labels].filter(Boolean);
  };

  return {
    getDynamicValue,
    getDynamicValueWithFallbacks,
    getDynamicText,
    getContentLabels,
  };
};

const hideIfEmpty = (element, hide_if_empty, isEmpty = false) => {
  switch (hide_if_empty) {
    case "none":
      break;
    case "section":
      element.closest(`.shopify-section`)?.classList.toggle("!hidden", isEmpty);
      break;
    case "container":
      element
        .closest(`[data-style-id]:not([data-style-id="${element.getAttribute("data-style-id")}"])`)
        ?.classList.toggle("!hidden", isEmpty);
      break;
    case "block":
      break;
  }
};

const fallbackHydrationQueue = new Map();

document.addEventListener("modalsLoaded", () => {
  fallbackHydrationQueue.entries().forEach(([el, type]) => {
    hydrateCardContent(el, type);
  });
  fallbackHydrationQueue.clear();
});

const hydrateCardContent = ($el, cardType) => {
  const node = document.querySelector(`[data-${cardType}-card='${$el.getAttribute(`data-card-handle`)}']`)?.cloneNode(true);

  if (!node) {
    fallbackHydrationQueue.set($el, cardType);
    return;
  }

  const object_handle = $el.getAttribute(`data-${cardType}-handle`);
  const object_id = $el.getAttribute(`data-${cardType}-id`);
  const addon_target_product = $el.getAttribute("data-addon-product-target");

  if (addon_target_product) {
    node.setAttribute("data-addon-product-target", addon_target_product);
    if ($el.hasAttribute("data-addon-auto-add")) node.setAttribute("data-addon-auto-add", "");
    if ($el.hasAttribute("data-addon-cart-bundle")) node.setAttribute("data-addon-cart-bundle", "");
  }

  node.removeAttribute(`data-${cardType}-card`);
  node.setAttribute(`data-${cardType}-handle`, object_handle);
  node.setAttribute(`data-${cardType}-id`, object_id);
  node.querySelectorAll("[data-loop-item], [data-x-if], style").forEach((el) => el.remove());
  node.querySelectorAll("[data-x-ignore]").forEach((el) => el.setAttribute("x-ignore", ""));
  node.querySelectorAll("[x-defer-active]").forEach((el) => el.removeAttribute("x-defer-active"));
  node.removeAttribute("x-defer-active");

  node.classList.add("card-loading", ...utils.JSONParse($el.getAttribute(`data-card-classes`) ?? "[]"));
  $el.parentNode?.replaceChild(node, $el);
};

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting && entry.target instanceof HTMLElement) {
        utils.hydrateCardContent(entry.target, entry.target.getAttribute("data-card-type"));
        observer.unobserve(entry.target);
      }
    }
  },
  { rootMargin: "300px 300px 300px 300px" }
);

const hydrateCard = (cardType) => {
  return ($el) => {
    if ($el.hasAttribute("data-intersected")) {
      utils.hydrateCardContent($el, cardType);
      return;
    }

    $el.setAttribute("data-card-type", cardType);
    observer.observe($el);
  };
};

const hydrateImages = (show, element) => {
  if (show) {
    element.querySelectorAll("img[data-src]").forEach((img) => {
      const src = img.getAttribute("data-src");
      const srcset = img.getAttribute("data-srcset");
      if (srcset) {
        img.setAttribute("srcset", srcset);
        img.removeAttribute("data-srcset");
      }
      if (src) {
        img.setAttribute("src", src);
        img.removeAttribute("data-src");
      }
    });
  }
};

const truncateChildren = (element, container) => {
  const children = [...container.children];
  if (children.at(-2)?.offsetLeft + children.at(-2)?.clientWidth < container.clientWidth) {
    return children.length - 2;
  }
  return (
    children.findIndex(
      (childElement) =>
        childElement.offsetLeft +
          childElement.clientWidth +
          element.clientWidth +
          +getComputedStyle(container).gap.replace("px", "") +
          15 >
        container.clientWidth
    ) - 1
  );
};

const utils = {
  hasAlpine,
  initializeIgnoredAlpineTree,
  normalizePhoneInput,
  initYouTube,
  simulateAnchorTag,
  clsx,
  getImageSrcSet,
  JSONParse,
  getSiblingUrl,
  getHeaderHeight,
  unescape,
  getShopifyCacheUrl,
  validateFormAndToast,
  richtextWithPrices,
  applyStyles,
  preloadImage,
  setCookie,
  getCookie,
  checkCookie,
  removeCookie,
  isVisible,
  isInViewport,
  getReviewStarGradients,
  transpileRichtextMetafield,
  handlelize,
  delay,
  debounce,
  scrollToY,
  scrollToX,
  scrollToXY,
  isElementScrollable,
  checkDomain,
  isExternalURL,
  liquidHandle,
  getElementPosition,
  applyInlinePluralization,
  getBracketInputDynamicPluralizedText,
  getBracketInputDynamicValue,
  spreadGenericCardFunctions,
  deepEqual,
  getElementOffset,
  shortUUID,
  serializeForm,
  roundToIndex,
  formatMoney,
  findAllScrollableParents,
  findCurrentlyAllScrollableParents,
  isEmail,
  pushSearchParams,
  replaceSearchParams,
  pushUrlTarget,
  setUniformHeightById,
  fetchFromCache,
  focusSelectorString,
  isElementVisiblyOnTop,
  isElementFullyVisible,
  initContentSlider,
  initCollapsible,
  barbaPrefetchTargetPage,
  hideIfEmpty,
  hydrateCardContent,
  hydrateCard,
  hydrateImages,
  truncateChildren,
};
utils;

// @ts-ignore
window.utils = utils;
document.dispatchEvent(new CustomEvent("theme:utils:loaded"));

})();

// ---- _css-autoprefixer.js ----
(function(){
"use strict";
const initCSSAutoPrefixer = (forceCheck = false) => {
  const needsAutoprefixing = () => {
    const testElem = document.createElement("div");
    testElem.style.userSelect = "none";
    testElem.style.backdropFilter = "blur(10px)";
    testElem.style.appearance = "none";
    testElem.style.clipPath = "circle(50%)";

    return (
      testElem.style.userSelect !== "none" ||
      testElem.style.backdropFilter !== "blur(10px)" ||
      testElem.style.appearance !== "none" ||
      testElem.style.clipPath !== "circle(50%)"
    );
  };

  const isOldBrowser = () => {
    if (forceCheck) {
      return true;
    }
    const ua = navigator.userAgent;

    // Older iOS Safari (12-14)
    const isOldiOS = /iP(hone|od|ad)/.test(ua) && /Version\/(12|13|14).*Safari/.test(ua);

    // Older Samsung Internet Browser
    const isOldSamsung = /SamsungBrowser\/([0-9]+)/.test(ua) && parseInt(ua.match(/SamsungBrowser\/([0-9]+)/)[1], 10) < 15;

    // Older Android WebView / Chrome / Firefox versions
    const isOldAndroid =
      /Android/.test(ua) &&
      ((/Chrome\/([0-9]+)/.test(ua) && parseInt(ua.match(/Chrome\/([0-9]+)/)[1], 10) < 90) ||
        (/Firefox\/([0-9]+)/.test(ua) && parseInt(ua.match(/Firefox\/([0-9]+)/)[1], 10) < 85) ||
        /wv/.test(ua)); // WebView detection

    return isOldiOS || isOldSamsung || isOldAndroid || needsAutoprefixing();
  };

  const loadAutoprefixerForOldBrowsers = async () => {
    if (!isOldBrowser()) {
      return;
    }

    try {
      // @ts-ignore
      const postcss = (await import("https://jspm.dev/postcss@8.1.10")).default;
      // @ts-ignore
      const autoprefixer = (await import("https://jspm.dev/autoprefixer@10.0.2")).default;

      const processStylesWithAutoprefixer = async () => {
        const styleTags = document.querySelectorAll("style");

        for (const styleTag of styleTags) {
          const css = styleTag.textContent;
          try {
            const result = await postcss([
              autoprefixer({
                overrideBrowserslist: [
                  "iOS 12-14",
                  "Safari 12-14",
                  "Samsung 4-15",
                  "Android >= 6",
                  "Chrome <= 90",
                  "Firefox <= 85",
                ],
              }),
            ]).process(css, { from: undefined });
            if (forceCheck) {
              console.log(`CSS style element check Completed`);
              continue;
            }
            styleTag.textContent = result.css;
          } catch (err) {
            console.error("❌ CSS Validation - Autoprefixer Error:", styleTag, err, { css });
          }
        }
      };

      processStylesWithAutoprefixer();
    } catch (error) {
      console.error("❌ Failed to load PostCSS or Autoprefixer:", error);
    }
  };

  loadAutoprefixerForOldBrowsers();
};

window.initCSSAutoPrefixer = initCSSAutoPrefixer;

initCSSAutoPrefixer();

/* LAST HASH: 6d16248fbede4361a5a6a06f21bc88bb1d7f56c0 */
;

})();

// ---- _scroll-progress.js ----
(function(){
"use strict";
const initScrollProgress = () => {
  window.Alpine.store("scrollProgress", {
    progress: new Map(),
    observers: new Map(),
    registerSection: () => {},
  });

  const state = window.Alpine.store("scrollProgress");

  state.registerSection = (sectionEl) => {
    if (!sectionEl || state.observers.has(sectionEl)) return;

    let ticking = false;

    const updateProgress = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const rect = sectionEl.getBoundingClientRect();
          let progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
          progress = Math.min(Math.max(progress, 0), 1);
          state.progress.set(sectionEl, progress);
          ticking = false;
        });
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            window.addEventListener("scroll", updateProgress, { passive: true });
            updateProgress();
          } else {
            window.removeEventListener("scroll", updateProgress);
          }
        });
      },
      { threshold: [0, 1] }
    );

    observer.observe(sectionEl);
    state.observers.set(sectionEl, observer);

    const rect = sectionEl.getBoundingClientRect();
    const isVisible = rect.bottom >= 0 && rect.top <= window.innerHeight;
    if (isVisible) {
      window.addEventListener("scroll", updateProgress, { passive: true });
      updateProgress();
    } else {
      updateProgress();
    }
  };

  window.addEventListener("pageshow", () => {
    requestAnimationFrame(() => {
      for (const [el] of state.progress) {
        const rect = el.getBoundingClientRect();
        let progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        progress = Math.min(Math.max(progress, 0), 1);
        state.progress.set(el, progress);
      }
    });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      requestAnimationFrame(() => {
        for (const [el] of state.progress) {
          const rect = el.getBoundingClientRect();
          let progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
          progress = Math.min(Math.max(progress, 0), 1);
          state.progress.set(el, progress);
        }
      });
    }
  });

  window.Alpine.magic("scrollProgress", () => state);
  window._stores["scrollProgress"] = state;
};

document.addEventListener("alpine:init", initScrollProgress);

/* LAST HASH: 03888ba9d902ea8f3be497270d59f06a18d7f976 */
;

})();

// ---- _search.js ----
(function(){
"use strict";
const initSearch = () => {
  const query = new URL(window.location.href).searchParams.get("q") ?? "";

  window.Alpine.store("search", {
    query: query,
  });

  const searchStore = window.Alpine.store("search");

  Alpine.effect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("q", searchStore.query);

    if (!searchStore.query) {
      url.searchParams.delete("q");
    }
    barba.history.add(url.toString(), "barba", "replace");
  });

  window.Alpine.magic("search", () => searchStore);
};

document.addEventListener("alpine:init", initSearch);

/* LAST HASH: 5f4e88200b6f5dceb905674651c1fa836a4d20cc */
;

})();

// ---- _textarea.js ----
(function(){
"use strict";
const _textarea = {
  init: (label, { maxRows = null }) => {
    const state = Alpine.reactive({
      active: false,
      paddingLeft: "",
    });

    const textarea = label.querySelector("textarea");

    state.active = !!textarea?.value && !!label?.textContent;
    state.paddingLeft = getComputedStyle(textarea).paddingLeft;

    Alpine.nextTick(() => resizeTextarea());

    const resizeTextarea = () => {
      if (!textarea) return;

      textarea.style.height = "auto";

      const style = getComputedStyle(textarea);
      const borderTop = parseInt(style.borderTopWidth) || 0;
      const borderBottom = parseInt(style.borderBottomWidth) || 0;
      const paddingTop = parseInt(style.paddingTop) || 0;
      const paddingBottom = parseInt(style.paddingBottom) || 0;
      const lineHeight = parseInt(style.lineHeight) || 20;

      const borderHeight = borderTop + borderBottom;
      const paddingHeight = paddingTop + paddingBottom;
      const maxHeight = maxRows ? maxRows * lineHeight + borderHeight + paddingHeight : Infinity;
      const newHeight = Math.min(textarea.scrollHeight + borderHeight, maxHeight);

      textarea.style.height = `${newHeight}px`;
    };

    return {
      textarea: state,
      resizeTextarea,
    };
  },
};

window._textarea = _textarea;

/* LAST HASH: f37fc6909763caf85f30c49357c7781e67b92927 */
;

})();

// ---- _accessibility.js ----
(function(){
"use strict";
const initAccessibility = () => {
  document.querySelectorAll(`[role="button"], [role="link"], [data-icon-handle]`).forEach((element) => {
    element.onkeydown = (event) => {
      if (element.role !== "link" && element.role !== "button") {
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        event.stopPropagation();
        element.dispatchEvent(new Event("click"));
      }
    };
  });
};

initAccessibility();

/* LAST HASH: 34b4514faa88a66700515c462682e1b73284bb72 */
;

})();

// ---- _cart.js ----
(function(){
"use strict";
const initCart = () => {
  const initial_selling_plan = window._cart_data?.items?.find((item) => item?.selling_plan_allocation?.selling_plan?.id)
    ?.selling_plan_allocation?.selling_plan;

  window.Alpine.store("cart", {
    history: [structuredClone(window._cart_data)],
    state: {
      ...window._cart_data,
      items: window._cart_data?.items?.filter((item) => item.quantity).map((item, index) => ({ ...item, index })) ?? [],
    },
    upsell_products: [],
    gift_products: {},
    _gift_with_purchase_disable_auto_add: utils.JSONParse(sessionStorage.getItem("_gift_with_purchase_disable_auto_add") || "[]"),
    loading: false,
    isChanging: false,
    debounce_updates: {},
    possible_selling_plans: [],
    cart_selling_plan_id: initial_selling_plan?.id,
    cart_selling_plan_name: initial_selling_plan?.name,
    cart_selling_plan_discount_wording: "",
    isSubscriptionChanging: false,
    global_subscriptions: false,
    bundle: {
      parent: null,
      child: null,
      added: false,
    },
  });

  const cart = window.Alpine.store("cart");
  window.Alpine.magic("cart", () => cart);
  window._stores["cart"] = cart;
  window._cart_data = cart.state;

  const use_native_bundles = window.theme_settings.data__cart__enable_shopify_bundle_display;
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "smart-theme": "true",
  };

  const get = async (productAdded = false) => {
    const data = await fetch(use_native_bundles ? "/cart/update.js?smart_theme=true" : "/cart.js?smart_theme=true", {
      method: use_native_bundles ? "POST" : "GET",
      headers,
      body: use_native_bundles ? JSON.stringify({ sections: "data_cart_json" }) : undefined,
    })
      .then((res) => res.json())
      .catch((e) => {
        _stores.toast.addToast({
          type: "error",
          target: "cart",
          title: "Cart Error",
          content: e.statusMessage,
        });
        cart.isChanging = false;
        return window._stores["cart"].state;
      });

    if ("status" in data) {
      _stores.toast.addToast({
        type: "error",
        target: "cart",
        title: data.message,
        content: data.description,
      });
      cart.isChanging = false;
      return window._stores["cart"].state;
    }

    const item_components = utils.JSONParse(data.sections?.data_cart_json?.split("||%!SPLIT%!||")?.[1] ?? "[]") ?? [];

    setTimeout(async () => {
      if (data?.items?.filter((item) => !item.quantity)?.length) {
        const removeItems = data?.items?.filter((item) => !item.quantity);
        for (let i = 0; i < removeItems?.length; i++) {
          const item = removeItems[i];
          const update = await change({ id: item.key, quantity: 0 });
        }
        await get();
      }
    }, 0);

    const newCartData = {
      ...data,
      items:
        data?.items
          ?.filter((item) => item.quantity)
          .map((item, index) => ({
            ...item,
            index,
            item_components: item_components[index],
          })) ?? [],
      item_count: data.items
        ?.filter((item) => !item?.properties?._p_id_link && !item?.properties?._p_hidden)
        ?.reduce((acc, item) => (acc += item.quantity), 0),
    };

    if (newCartData?.item_count === 0) {
      cart._gift_with_purchase_disable_auto_add = [];
      sessionStorage.setItem("_gift_with_purchase_disable_auto_add", JSON.stringify([]));
    }
    cart.history.unshift(structuredClone(newCartData));
    cart.state = newCartData;
    if (cart.history.length > 5) {
      cart.history.pop();
    }
    cart.isChanging = false;
    if (productAdded) {
      document.dispatchEvent(new CustomEvent("productAddedToCart", { detail: newCartData }));
    }
    return newCartData;
  };

  const add = async (cartItems) => {
    cart.isChanging = true;
    const data = await fetch("/cart/add.js?smart_theme=true", {
      method: "POST",
      headers,
      body: JSON.stringify({ ...cartItems, sections: use_native_bundles ? "data_cart_json" : undefined }),
    })
      .then((res) => res.json())
      .catch(async (e) => {
        _stores.toast.addToast({
          type: "error",
          target: "cart",
          title: "Cart Error",
          content: e.statusMessage,
        });
        return {
          ...(await get()),
          cart_error: true,
        };
      });

    if ("status" in data) {
      _stores.toast.addToast({
        type: "error",
        target: "cart",
        title: data.message === data.description ? "Cart Error" : data.message,
        content: data.description,
      });
      return {
        ...(await get()),
        cart_error: true,
      };
    }

    get();

    const item_components = utils.JSONParse(data.sections?.data_cart_json?.split("||%!SPLIT%!||")?.[1] ?? "[]") ?? [];

    const items = [
      ...(data?.items ?? []),
      ...(cart.state?.items?.filter((item) => !data?.items?.some((newItem) => newItem.key === item.key)) ?? []),
    ]
      ?.filter((item) => item.quantity)
      .map((item, index) => ({
        ...item,
        index,
        item_components: item_components[index],
      }));

    const newCartData = {
      ...cart.state,
      items,
      item_count: items
        ?.filter((item) => !item?.properties?._p_id_link && !item?.properties?._p_hidden)
        ?.reduce((acc, item) => (acc += item.quantity), 0),
      original_total_price: items.reduce((acc, item) => acc + (item.original_line_price ?? 0), 0),
      items_subtotal_price: items.reduce((acc, item) => acc + (item.final_line_price ?? 0), 0),
      total_discount: items.reduce((acc, item) => acc + (item.line_level_total_discount ?? 0), 0),
      total_price: items.reduce((acc, item) => acc + (item.final_line_price ?? 0), 0),
      total_weight: items.reduce((acc, item) => acc + (item.grams ?? 0) * item.quantity, 0),
      requires_shipping: items.some((item) => item.requires_shipping),
    };

    cart.state = newCartData;
    cart.isChanging = false;

    document.dispatchEvent(new CustomEvent("productAddedToCart", { detail: newCartData }));

    return newCartData;
  };

  const update = async (updates) => {
    cart.isChanging = true;
    const data = await fetch("/cart/update.js?smart_theme=true", {
      method: "POST",
      headers,
      body: JSON.stringify({ ...updates, sections: use_native_bundles ? "data_cart_json" : undefined }),
    })
      .then((res) => res.json())
      .catch(async (e) => {
        _stores.toast.addToast({
          type: "error",
          target: "cart",
          title: "Cart Error",
          content: e.statusMessage,
        });

        return await get();
      });

    if ("status" in data) {
      _stores.toast.addToast({
        type: "error",
        target: "cart",
        title: data.message,
        content: data.description,
      });
      return await get();
    }

    if (data?.discount_codes?.length) {
      let update = false;
      data.discount_codes = data.discount_codes.filter((code) => {
        if (code.applicable) return true;
        update = true;
        _stores.toast.addToast({
          type: "error",
          target: "cart",
          title: "Discount code is not applicable",
          content: `The discount code: "${code.code}" is not applicable to this cart. Please try a different code.`,
        });

        return false;
      });

      if (update) {
        _cart.update({ discount: data.discount_codes.map((d) => d.code).join(",") });
      }
    }

    const item_components = utils.JSONParse(data.sections?.data_cart_json?.split("||%!SPLIT%!||")?.[1] ?? "[]");

    const newCartData = {
      ...data,
      items:
        data?.items
          ?.filter((item) => item.quantity)
          .map((item, index) => ({
            ...item,
            index,
            item_components: item_components[index],
          })) ?? [],
      item_count: data.items
        ?.filter((item) => !item?.properties?._p_id_link && !item?.properties?._p_hidden)
        ?.reduce((acc, item) => (acc += item.quantity), 0),
    };
    if (newCartData?.item_count === 0) {
      cart._gift_with_purchase_disable_auto_add = [];
      sessionStorage.setItem("_gift_with_purchase_disable_auto_add", JSON.stringify([]));
    }
    cart.history.unshift(structuredClone(newCartData));
    cart.state = newCartData;
    if (cart.history.length > 5) {
      cart.history.pop();
    }
    cart.isChanging = false;
    return newCartData;
  };

  const change = async (cartItem) => {
    cart.isChanging = true;
    const data = await fetch("/cart/change.js?smart_theme=true", {
      method: "POST",
      headers,
      body: JSON.stringify({ ...cartItem, sections: use_native_bundles ? "data_cart_json" : undefined }),
    })
      .then((res) => res.json())
      .catch(async (e) => {
        _stores.toast.addToast({
          type: "error",
          target: "cart",
          title: "Cart Error",
          content: e.statusMessage,
        });
        return await get();
      });

    if ("status" in data) {
      _stores.toast.addToast({
        type: "error",
        target: "cart",
        title: data.message,
        content: data.description,
      });
      return await get();
    }

    const item_components = utils.JSONParse(data.sections?.data_cart_json?.split("||%!SPLIT%!||")?.[1] ?? "[]");

    const { items_added, items_removed, ...cart_data } = data;

    const newCartData = {
      ...cart_data,
      items:
        cart_data?.items
          ?.filter((item) => item.quantity)
          .map((item, index) => ({
            ...item,
            index,
            item_components: item_components[index],
          })) ?? [],
      item_count: data.items
        ?.filter((item) => !item?.properties?._p_id_link && !item?.properties?._p_hidden)
        ?.reduce((acc, item) => (acc += item.quantity), 0),
    };
    if (newCartData?.item_count === 0) {
      cart._gift_with_purchase_disable_auto_add = [];
      sessionStorage.setItem("_gift_with_purchase_disable_auto_add", JSON.stringify([]));
    }
    cart.history.unshift(structuredClone(newCartData));
    cart.state = newCartData;
    if (cart.history.length > 5) {
      cart.history.pop();
    }
    cart.isChanging = false;
    return newCartData;
  };

  const clear = async () => {
    const data = await fetch("/cart/clear.js?smart_theme=true", {
      method: "POST",
      headers,
    })
      .then((res) => res.json())
      .catch(async (e) => {
        _stores.toast.addToast({
          type: "error",
          target: "cart",
          title: "Cart Error",
          content: e.statusMessage,
        });
        return await get();
      });

    if ("status" in data) {
      _stores.toast.addToast({
        type: "error",
        target: "cart",
        title: data.message,
        content: data.description,
      });
      return await get();
    }

    const newCartData = {
      ...data,
      items: [],
      item_count: 0,
    };
    cart._gift_with_purchase_disable_auto_add = [];
    sessionStorage.setItem("_gift_with_purchase_disable_auto_add", JSON.stringify([]));

    cart.history.unshift(structuredClone(newCartData));
    cart.state = newCartData;
    if (cart.history.length > 5) {
      cart.history.pop();
    }
    cart.isChanging = false;
    return newCartData;
  };

  const showConditionally = (show_conditionally) => {
    if (!show_conditionally) {
      return true;
    }

    switch (show_conditionally) {
      case "always": {
        return true;
      }
      case "cart_empty": {
        return !cart.state.item_count;
      }
      case "items_added": {
        return !!cart.state.item_count;
      }
    }
  };

  const updateLineItemQuantity = (quantity, index) => {
    if (
      !cart.state.items[index] ||
      cart.state.items[index]?.quantity === quantity ||
      cart.state.items.length !== _stores.cart?.history[0].items.length
    ) {
      return;
    }

    const old_quantity = cart.state.items[index].quantity;
    const quantity_difference = Math.max(0, quantity) - cart.state.items[index].quantity;

    cart.state.items[index].quantity = Math.max(0, quantity);

    const p_id = cart.state.items[index]?.properties?._p_id;

    if (p_id) {
      cart.state.items.forEach((child, childIndex) => {
        if (child?.properties?._p_id_link !== p_id) return;
        const quantity_ratio = child.quantity / old_quantity;
        cart.state.items[childIndex].quantity = Math.max(0, child.quantity + quantity_difference * quantity_ratio);
      });
    }

    cart.state.item_count = cart.state.items
      ?.filter((item) => !item?.properties?._p_id_link && !item?.properties?._p_hidden)
      ?.reduce((acc, item) => (acc += item.quantity), 0);

    cart.state.total_price = cart.state.items.reduce((acc, item) => (acc += item.price * item.quantity), 0);
    cart.debounce_updates = cart.state.items.reduce((acc, item) => {
      acc[`${item.key}`] = item.quantity;
      return acc;
    }, {});
  };

  const renderGiftProducts = async (
    $el,
    {
      target_type,
      target,
      receives_quantity,
      allow_duplicates,
      product_card_class,
      hide_if_empty,
      handleResize,
      block_id,
      auto_add_to_cart,
      auto_remove_from_cart,
      hide_in_cart,
    }
  ) => {
    const products = utils.JSONParse($el.getAttribute("data-gift-products"));
    const preorder_threshold = +(window.theme_settings.data__product__variant__preorder_threshold ?? 1);

    handleResize();
    setTimeout(() => {
      handleResize();
    }, 50);

    let sourceNode = document.querySelector(`[data-product-card='${product_card_class}']`);

    if (!sourceNode && !window.modalsLoaded) {
      await new Promise((resolve) => {
        document.addEventListener(
          "modalsLoaded",
          () => {
            sourceNode = document.querySelector(`[data-product-card='${product_card_class}']`);
            resolve(true);
          },
          { once: true }
        );
      });
    }

    const received_quantity = cart?.state?.items?.reduce(
      (acc, lineItem) => (lineItem?.properties?.["_gift_with_purchase"] === `${block_id}` ? (acc += lineItem.quantity) : acc),
      0
    );
    const received_value = cart?.state?.items?.reduce(
      (acc, lineItem) =>
        lineItem?.properties?.["_gift_with_purchase"] === `${block_id}` ? (acc += lineItem.final_line_price) : acc,
      0
    );

    target = target_type === "item_count" ? target + received_quantity : target + received_value;

    const controlProducts =
      cart.state[target_type] >= target && received_quantity < receives_quantity
        ? products
            ?.filter((prod) => allow_duplicates || !cart.state.items.some((item) => item.product_id === prod.id))
            ?.filter((a, i, arr) => arr.findIndex((b) => b.id === a.id) === i)
        : [];

    if (auto_remove_from_cart && cart.state[target_type] < target) {
      cart?.state?.items?.forEach((lineItem) => {
        if (lineItem.quantity && lineItem.properties["_gift_with_purchase"] === `${block_id}`) {
          _cart.updateLineItemQuantity(0, lineItem.index);
        }
      });
      cart.gift_products[block_id] = [];
      return;
    }

    if (auto_add_to_cart && controlProducts?.length) {
      const getControlItems = () => {
        let addedQuantity = cart?.state?.items?.reduce(
          (acc, lineItem) => (lineItem?.properties?.["_gift_with_purchase"] === `${block_id}` ? (acc += lineItem.quantity) : acc),
          0
        );

        return controlProducts
          .filter((p) => !p.variants.some((v) => cart._gift_with_purchase_disable_auto_add.includes(v.id)))
          .map((p) => p.variants.find((v) => v.available))
          .map((variant) => {
            if (
              (!allow_duplicates && cart.state.items.some((item) => item.variant_id === variant.id)) ||
              addedQuantity >= receives_quantity
            ) {
              return null;
            }
            const properties = {
              _gift_with_purchase: `${block_id}`,
              _gift_with_purchase_auto_add: "true",
              ...(hide_in_cart ? { _p_hidden: "true" } : {}),
            };

            if (variant?.preorder && variant?.inventory_quantity < preorder_threshold) {
              properties["Preorder"] = `true`;
              if (variant?.preorder_date) {
                properties["Preorder"] = `Shipping ${new Date(variant.preorder_date).toLocaleDateString(navigator.language, {
                  month: "short",
                  year: "numeric",
                })}`;
              }
            }

            let addQuantity = 1;
            if (!allow_duplicates) {
              addedQuantity += 1;
            } else {
              addQuantity = Math.min(
                variant?.inventory_management === "shopify" && variant?.inventory_policy === "deny"
                  ? variant?.inventory_quantity
                  : 9999,
                receives_quantity - addedQuantity
              );
              addedQuantity += addQuantity;
            }

            return {
              id: variant.id,
              quantity: addQuantity,
              selling_plan: cart.global_subscriptions
                ? variant?.selling_plan_allocations?.find((plan) => plan.selling_plan?.id === cart.cart_selling_plan_id)
                    ?.selling_plan?.id
                : undefined,
              properties: {
                ...properties,
              },
            };
          })
          .filter(Boolean);
      };

      const controlItems = getControlItems();

      if (!controlItems?.length) {
        cart.gift_products[block_id] = [];
        return;
      }

      if (cart.loading || cart.isChanging || cart.isSubscriptionChanging || Object.keys(cart.debounce_updates)?.length) {
        await new Promise((resolve, reject) => {
          const start = performance.now();
          const isBusy = () =>
            cart.loading || cart.isChanging || cart.isSubscriptionChanging || Object.keys(cart.debounce_updates || {}).length > 0;

          const check = () => {
            const now = performance.now();

            if (!isBusy()) {
              clearInterval(tid);
              resolve(true);
              return;
            }

            if (now - start >= 5000) {
              clearInterval(tid);
              reject(new Error("Timed out waiting for cart to become idle"));
            }
          };

          const tid = setInterval(check, 32);
          check();
        });
      }

      const addItems = getControlItems();

      if (addItems?.length) {
        await _cart.add({
          items: addItems,
        });
      }

      cart.gift_products[block_id] = [];
      return;
    }

    switch (hide_if_empty) {
      case "none":
        break;
      case "section":
        $el.closest(`.shopify-section`)?.classList.toggle("!hidden", controlProducts?.length === 0);
        break;
      case "container":
        $el
          .closest(`[data-style-id]:not([data-style-id="${$el.getAttribute("data-style-id")}"])`)
          ?.classList.toggle("!hidden", controlProducts?.length === 0);
        break;
      case "block":
        $el?.classList.toggle("!hidden", controlProducts?.length === 0);
        break;
    }

    cart.gift_products[block_id] = controlProducts;

    const renderProducts = controlProducts?.filter(
      (prod, index) => prod.handle !== $el.children?.[index]?.getAttribute("data-product-handle")
    );

    if (!renderProducts.length) {
      return;
    }

    const nonProductElements = $el.querySelectorAll(":scope > :not([data-product-handle])");

    $el.innerHTML = "";
    nonProductElements.forEach((el) => {
      $el.appendChild(el);
    });

    controlProducts.forEach((prod, i, arr) => {
      const node = sourceNode?.cloneNode(true);

      if (node) {
        node.querySelectorAll("[data-x-ignore]").forEach((el) => {
          el.setAttribute("x-ignore", "");
        });
        node.querySelectorAll("[x-defer-active]").forEach((el) => {
          el.removeAttribute("x-defer-active");
        });
        node.removeAttribute("x-defer-active");

        node.setAttribute("x-ignore", "");

        const div = document.createElement("div");
        div.setAttribute("data-product-handle", prod.handle);
        div.setAttribute("class", `shrink-0 max-w-full w-full h-full order-[--order]`);
        div.style.setProperty("--order", `${(i + 1) * 10}`);
        node.removeAttribute(`data-product-card`);
        node.setAttribute("data-product-handle", prod.handle);
        node.setAttribute("data-product-id", `${prod.id}`);
        node.setAttribute("data-gift-with-purchase", `${block_id}`);
        if (hide_in_cart) {
          node.setAttribute("data-hide-in-cart", `true`);
        }
        node.classList.add("card-loading");
        node.querySelectorAll("[data-loop-item], [data-x-if], style").forEach((el) => {
          el.remove();
        });
        div.appendChild(node);
        $el.appendChild(div);
      }
    });
  };

  const getDynamicTextWithFormattedPrice = (content) => {
    return (
      content?.replace(/\[([^\]]*)\]/gi, (...matches) => {
        // @ts-ignore
        return matches?.[1]?.split(".").reduce(
          (acc, selector) => {
            if (!selector || acc[0] === undefined || acc[0] === null) {
              if (/price$/gi.test(acc[1]) && typeof acc[0] === "number") {
                return [utils.formatMoney(acc[0]), selector];
              }
              return acc;
            }

            if (acc[0] && selector in acc[0]) {
              if (/price$/gi.test(selector) && typeof acc[0][selector] === "number") {
                return [utils.formatMoney(acc[0][selector]), selector];
              }
              return [acc[0][selector], selector];
            }
            return ["", ""];
          },
          [{ cart: cart.state }, ""]
        )[0];
      }) ?? ""
    );
  };

  const getBundleLineItem = async () => {
    const itemsWithProductData = await Promise.all(
      cart.state.items?.map(async (lineItem) => {
        const product = _products[lineItem?.handle] ?? (await _product.getProductData(lineItem?.handle, lineItem?.product_id));

        return {
          line_item: lineItem,
          product: product,
          variant: product?.variants?.find((variant) => variant.id === lineItem?.variant_id),
        };
      })
    );
    const item = itemsWithProductData.find((item) => item?.product?.metafields?.smart?.bundle_parent);
    const bundleParent = item?.product?.metafields?.smart?.bundle_parent?.[0];
    if (item && bundleParent) {
      cart.bundle.parent = bundleParent;
      cart.bundle.child = item;
    }
  };

  const getBundleParentDynamicTextWithFormattedPrice = (content, product) => {
    return utils.getBracketInputDynamicPluralizedText(content, product);
  };

  const upgradeLineItemToBundle = async () => {
    if (cart.loading || cart.isChanging || !cart.bundle.parent || !cart.bundle.child || cart.bundle.added) {
      return;
    }

    cart.loading = true;
    cart.isChanging = true;
    try {
      const key = cart.bundle.child.line_item.key;

      await fetch("/cart/change.js?smart_theme=true", {
        method: "POST",
        headers,
        body: JSON.stringify({ id: key, quantity: 0 }),
      }).then((res) => res.json());

      await _cart.add({
        items: [
          {
            id: cart.bundle.parent.selected_variant_id || cart.bundle.parent.variants[0]?.id,
            quantity: 1,
            selling_plan: null,
          },
        ],
      });

      /* NB: State will have updated by this point */
      const cartItemIndex = cart.state.items.findIndex((item) => item.key === key);

      if (cartItemIndex !== -1) {
        cart.state.items[cartItemIndex].quantity = 0;
      }

      cart.bundle.added = true;
    } catch (e) {
      _stores.toast.addToast({
        type: "error",
        target: "cart",
        title: "Cart Error",
        content: e.statusMessage,
      });
    } finally {
      cart.isChanging = false;
      cart.loading = false;
    }
  };

  const debounceCartUpdates = window.Alpine.debounce(async () => {
    const b = cart.history[0]?.items.reduce((acc, item) => {
      acc[`${item.key}`] = item.quantity;
      return acc;
    }, {});
    if (!utils.deepEqual(b, cart.debounce_updates) && Object.keys(cart.debounce_updates ?? {}).length) {
      cart.loading = true;

      const new_gift_with_purchase_disable_auto_add = [
        ...new Set([
          ...cart._gift_with_purchase_disable_auto_add,
          ...cart.state.items
            .map((item) =>
              item.properties._gift_with_purchase_auto_add && cart.debounce_updates[item.key] <= 0 ? item.variant_id : null
            )
            .filter(Boolean),
        ]),
      ];

      if (!utils.deepEqual(cart._gift_with_purchase_disable_auto_add, new_gift_with_purchase_disable_auto_add)) {
        cart._gift_with_purchase_disable_auto_add = new_gift_with_purchase_disable_auto_add;
        sessionStorage.setItem("_gift_with_purchase_disable_auto_add", JSON.stringify(new_gift_with_purchase_disable_auto_add));
      }

      await update({ updates: cart.debounce_updates });

      cart.debounce_updates = {};
      cart.loading = false;
    }
    cart.loading = false;
  }, 650);

  const ensureCartCookies = () => {
    const currentToken = utils.getCookie("cart");

    if (currentToken) {
      sessionStorage.setItem("_shopify_stable_cart_token", currentToken);
    }

    setInterval(async () => {
      const testCookie = utils.getCookie("_shopify_test");
      const newCartToken = utils.getCookie("cart");
      const storedToken = sessionStorage.getItem("_shopify_stable_cart_token");

      if (testCookie === "1") {
        console.warn("[Cart Restorer] Detected _shopify_test=1 (CLI dev mode)");
      }

      if (storedToken && newCartToken && newCartToken !== storedToken) {
        utils.setCookie("cart", storedToken);

        fetch("/cart/update.js?smart_theme=true", {
          method: "POST",
          headers,
          body: JSON.stringify({ updates: {}, attributes: {}, token: storedToken }),
        });
      }

      // Update sessionStorage if cart was just created
      if (!storedToken && newCartToken) {
        sessionStorage.setItem("_shopify_stable_cart_token", newCartToken);
      }
    }, 3000);
  };

  ensureCartCookies();

  window.Alpine.effect(() => {
    cart.state.item_count = cart.state.items
      ?.filter((item) => !item?.properties?._p_id_link && !item?.properties?._p_hidden)
      ?.reduce((acc, item) => (acc += item.quantity), 0);
    window._cart_data = cart.state;
  });

  window.Alpine.effect(async () => {
    if (cart.loading || cart.isChanging) return;

    const itemsWithProductData = await Promise.all(
      cart.state.items?.map(async (lineItem) => {
        const product = _products[lineItem?.handle] ?? (await _product.getProductData(lineItem?.handle, lineItem?.product_id));
        const variant = product?.variants?.find((v) => v.id === lineItem?.variant_id);

        return {
          line_item: lineItem,
          variant,
        };
      })
    );

    cart.state.original_pre_selling_plan_total_price = itemsWithProductData.reduce((acc, item) => {
      const compare_at = Math.max(
        item.line_item?.original_price ?? 0,
        item.variant?.compare_at_price ?? 0,
        item.line_item?.selling_plan_allocation?.compare_at_price ?? 0
      );
      return acc + compare_at * item.line_item.quantity;
    }, 0);
    cart.state.selling_plan_discount_applications = cart.state?.items?.reduce((acc, item) => {
      if (!item?.selling_plan_allocation?.selling_plan?.name) {
        return acc;
      }
      const index = acc.findIndex((selling_plan) => selling_plan.name === item?.selling_plan_allocation?.selling_plan?.name);

      if (index !== -1) {
        acc[index].value +=
          (item?.selling_plan_allocation?.compare_at_price - item?.selling_plan_allocation?.price) * item?.quantity;
        return acc;
      }

      acc.push({
        name: item?.selling_plan_allocation?.selling_plan?.name,
        value: (item?.selling_plan_allocation?.compare_at_price - item?.selling_plan_allocation?.price) * item?.quantity,
      });

      return acc;
    }, []);
  });

  window.Alpine.effect(() => {
    if (Object.keys(cart.debounce_updates ?? {})?.length) {
      debounceCartUpdates();
    }
  });

  Alpine.effect(() => {
    cart.state.items?.forEach((a, i, arr) => {
      if (a?.properties?._p_id_link && !arr.find((b) => b.properties?._p_id)) {
        updateLineItemQuantity(0, i);
      }
    });
  });

  Alpine.effect(async () => {
    if (cart.loading || cart.isChanging) return;

    const itemsWithProductData = await Promise.all(
      cart.state.items?.map(async (lineItem) => {
        const product = _products[lineItem?.handle] ?? (await _product.getProductData(lineItem?.handle, lineItem?.product_id));

        return {
          line_item: lineItem,
          product: product,
          variant: product?.variants?.find((variant) => variant.id === lineItem?.variant_id),
        };
      })
    );
    const possible_selling_plans = new Map();

    itemsWithProductData.forEach((item) => {
      item.variant?.selling_plan_allocations?.forEach((selling_plan) => {
        possible_selling_plans.set(selling_plan.selling_plan.id, selling_plan.selling_plan);
      });
    });

    cart.possible_selling_plans = [...possible_selling_plans.values()];
    cart.cart_selling_plan_discount_wording = "";

    const selling_plan =
      cart.possible_selling_plans.find((plan) => plan.id === cart.cart_selling_plan_id) ?? cart.possible_selling_plans?.[0];

    cart.cart_selling_plan_discount_wording = selling_plan?.price_adjustments?.[0]?.value
      ? selling_plan?.price_adjustments?.[0]?.value_type === "fixed_amount"
        ? `${utils.formatMoney(
            itemsWithProductData.reduce((acc, entry) => {
              const plan = entry.variant.selling_plan_allocations?.find(
                (allocation) => allocation.selling_plan?.id === selling_plan.id
              );
              if (plan) {
                acc += plan.selling_plan.price_adjustments?.[0]?.value * entry.line_item.quantity;
              }
              return acc;
            }, 0)
          )}`
        : selling_plan?.price_adjustments?.[0]?.value_type === "percentage"
        ? `${selling_plan?.price_adjustments?.[0]?.value}%`
        : ""
      : "";
  });

  Alpine.effect(() => {
    if (cart.global_subscriptions && !cart.isSubscriptionChanging) {
      const initial_selling_plan = cart.state?.items?.find((item) => item?.selling_plan_allocation?.selling_plan?.id)
        ?.selling_plan_allocation?.selling_plan;
      cart.cart_selling_plan_id = initial_selling_plan?.id;
      cart.cart_selling_plan_name = initial_selling_plan?.name;
    }
  });

  Alpine.effect(() => {
    cart.bundle.parent = null;
    cart.bundle.child = null;
    cart.bundle.added = false;
    if (cart.state.items.length > 0) {
      getBundleLineItem();
    }
  });

  document.addEventListener("productAddedToCart", async (event) => {
    const updatedCart = cart.state;
    if (typeof window._learnq !== "undefined") {
      const cartData = {
        total_price: updatedCart.total_price / 100,
        $value: updatedCart.total_price / 100,
        total_discount: updatedCart.total_discount,
        original_total_price: updatedCart.original_total_price / 100,
        items: updatedCart.items,
      };

      window._learnq.push(["track", "Added to Cart", cartData]);
    }
  });

  const initDynamicLineItemCards = (
    $el,
    {
      line_item_card_class,
      hide_if_empty,
      order_offset = 1,
      section_id,
      block_id,
      handleResize = () => {},
      addon_id,
      filter_keys,
      filter_keys_include,
    }
  ) => {
    const container = $el.parentElement;

    const cart = window.Alpine.store("cart");
    const modal = window.Alpine.store("modal");
    const editor = window.Alpine.store("editor");

    const renderDynamicLineItemCards = async () => {
      handleResize();
      setTimeout(() => handleResize, 50);

      let sourceNode = document.querySelector(`[data-line-item-card='${line_item_card_class}']`);

      if (!sourceNode && !window.modalsLoaded) {
        await new Promise((resolve) => {
          document.addEventListener(
            "modalsLoaded",
            () => {
              sourceNode = document.querySelector(`[data-line-item-card='${line_item_card_class}']`);
              resolve(true);
            },
            { once: true }
          );
        });
      }

      let items = addon_id
        ? cart.state.items?.filter((item) => item?.properties?._p_id_link === addon_id && item.quantity)
        : cart.state.items?.filter((item) => !item?.properties?._p_id_link && !item?.properties?._p_hidden && item.quantity);

      if (filter_keys?.trim()) {
        const filter_keys_arr = filter_keys.split(",").map((key) => key.trim());
        items = items.filter((item) => !Object.keys(item?.properties).some((key) => filter_keys_arr.includes(key.trim())));
      }
      if (filter_keys_include?.trim()) {
        const filter_keys_arr = filter_keys_include.split(",").map((key) => key.trim());
        items = items.filter((item) => Object.keys(item?.properties).some((key) => filter_keys_arr.includes(key.trim())));
      }

      switch (hide_if_empty) {
        case "none":
          break;
        case "section":
          container.closest(`.shopify-section`)?.classList.toggle("!hidden", items?.length === 0);
          break;
        case "container":
          container
            .closest(`[data-style-id]:not([data-style-id="${container.getAttribute("data-style-id")}"])`)
            ?.classList.toggle("!hidden", items?.length === 0);
          break;
        case "block":
          break;
      }

      const existingItems = [...container.querySelectorAll(`[data-render-index*="${block_id}--"]`)].filter((el) => {
        if (items.some((lineItem) => el.getAttribute("data-line-item-id") === lineItem.key && lineItem.quantity)) return true;
        el.remove();
        return false;
      });

      items?.forEach((lineItem, i, arr) => {
        const existingItem = existingItems.find((el) => el.getAttribute("data-line-item-id") === lineItem.key);
        if (existingItem) {
          existingItem.setAttribute("data-render-index", `${block_id}--${i}`);
          existingItem.style.setProperty("--order", `${(i + order_offset) * 10}`);
          return;
        }
        const node = sourceNode?.cloneNode(true);

        if (node) {
          node.querySelectorAll("[data-x-ignore]").forEach((el) => {
            el.setAttribute("x-ignore", "");
          });
          node.querySelectorAll("[x-defer-active]").forEach((el) => {
            el.removeAttribute("x-defer-active");
          });
          node.removeAttribute("x-defer-active");

          node.setAttribute("x-ignore", "");

          const div = document.createElement("div");
          div.setAttribute("data-line-item-id", lineItem.key);
          div.setAttribute("data-style-id", `${section_id}--${block_id}`);
          div.setAttribute("data-render-index", `${block_id}--${i}`);
          div.setAttribute("class", `shrink-0 max-w-full w-full order-[--order]`);
          div.style.setProperty("--order", `${(i + order_offset) * 10}`);
          node.removeAttribute(`data-line-item-card`);
          node.setAttribute("data-line-item-id", lineItem.key);
          node.querySelectorAll("[data-loop-item], [data-x-if], style").forEach((el) => el.remove());
          node.classList.add("card-loading");
          div.appendChild(node);
          container.appendChild(div);
        }
      });

      handleResize();
    };

    renderDynamicLineItemCards();

    Alpine.effect(() => {
      const show =
        !container.closest("[data-dynamic-modals]") ||
        editor?.select_section_id === section_id ||
        modal.id === "modal--cart-drawer";

      if ((cart.state.total_price || cart.state.item_count || cart.state.item_count <= 0) && show) {
        renderDynamicLineItemCards();
      }
    });
  };

  const setSubscription = async (selling_plan_id) => {
    cart.isSubscriptionChanging = true;
    cart.cart_selling_plan_id = +selling_plan_id;
    cart.cart_selling_plan_name = cart.possible_selling_plans?.find((plan) => +plan.id === +selling_plan_id)?.name;

    const itemsWithProductData = await Promise.all(
      cart.state.items?.map(async (lineItem) => {
        const product = _products[lineItem?.handle] ?? (await _product.getProductData(lineItem?.handle, lineItem?.product_id));

        return {
          line_item: {
            ...lineItem,
          },
          product: product,
          variant: product?.variants?.find((variant) => variant.id === lineItem?.variant_id),
        };
      })
    );

    const changeProducts = itemsWithProductData?.filter(
      (item) =>
        item.variant?.selling_plan_allocations?.length &&
        +item.line_item?.selling_plan_allocation?.selling_plan?.id !== +selling_plan_id
    );

    let items = cart.state.items;

    if (changeProducts?.length && changeProducts?.length <= 2) {
      for (const item of changeProducts) {
        const lineItem =
          items.find((lineItem) => lineItem.key === item.line_item.key) ??
          items.find(
            (lineItem) =>
              lineItem.id === item.line_item.id &&
              lineItem.quantity === item.line_item.quantity &&
              utils.deepEqual(lineItem.properties, item.line_item.properties)
          );

        if (!lineItem) continue;
        cart.isChanging = true;

        const result = await fetch("/cart/change.js?smart_theme=true", {
          method: "POST",
          headers,
          body: JSON.stringify({
            id: lineItem?.key,
            quantity: lineItem?.quantity,
            selling_plan: +selling_plan_id,
          }),
        })
          .then((res) => res.json())
          .catch(async (e) => {
            _stores.toast.addToast({
              type: "error",
              target: "cart",
              title: "Cart Error",
              content: e.statusMessage,
            });
            return await get();
          });

        items = result?.items ?? cart?.state?.items;
      }

      requestIdleCallback(() => {
        _cart.get();
      });
    }

    if (changeProducts?.length > 2) {
      await fetch("/cart/clear.js?smart_theme=true", {
        method: "POST",
        headers,
      });

      await add({
        items: itemsWithProductData?.toReversed().map((item) => ({
          id: item.line_item.variant_id,
          quantity: item.line_item.quantity,
          properties: item.line_item.properties ?? {},
          selling_plan:
            item.variant?.selling_plan_allocations?.length &&
            +item.line_item?.selling_plan_allocation?.selling_plan?.id !== +selling_plan_id
              ? selling_plan_id || undefined
              : item.line_item?.selling_plan_allocation?.selling_plan?.id || undefined,
        })),
        attributes: cart?.state.attributes,
      });
    }
    cart.isSubscriptionChanging = false;
  };

  window._cart = {
    add,
    get,
    update,
    change,
    clear,
    showConditionally,
    updateLineItemQuantity,
    getDynamicTextWithFormattedPrice,
    renderGiftProducts,
    initDynamicLineItemCards,
    setSubscription,
    getBundleParentDynamicTextWithFormattedPrice,
    upgradeLineItemToBundle,
  };

  return {
    add,
    get,
    update,
    change,
    clear,
    showConditionally,
    updateLineItemQuantity,
    getDynamicTextWithFormattedPrice,
    renderGiftProducts,
    initDynamicLineItemCards,
    setSubscription,
    getBundleParentDynamicTextWithFormattedPrice,
    upgradeLineItemToBundle,
  };
};

document.addEventListener("alpine:init", initCart);

})();

// ---- _editor.js ----
(function(){
"use strict";
document.addEventListener("theme:editor:init", () => {
  const styleHiddenElement = (el, type, element, block_type) => {
    const styleId = element.getAttribute("data-style-id");
    if (element.querySelector(`[data-hide-empty-for-id="${styleId}"]`)) {
      return;
    }

    if (getComputedStyle(element)?.position === "static") {
      element.style.position = "relative";
    }

    element.style.outline = "4px solid #10c6c6";
    element.style.outlineOffset = "-4px";

    const div = document.createElement("div");
    div.setAttribute("data-shopify-editor-block", el.getAttribute("data-shopify-editor-block"));
    div.innerHTML = type === "block" ? `Empty Block Hidden` : `${type} Hidden - Empty Source: ${block_type}`;
    div.classList.add("hide-dynamically-display");
    div.setAttribute("data-hide-empty-for-id", styleId);
    element.appendChild(div);
  };

  const shopifyEvents = [
    "shopify:inspector:activate",
    "shopify:inspector:deactivate",
    "shopify:section:load",
    "shopify:section:unload",
    "shopify:section:select",
    "shopify:section:deselect",
    "shopify:section:reorder",
    "shopify:block:select",
    "shopify:block:deselect",
  ];

  shopifyEvents.forEach((eventType) => {
    document.addEventListener(eventType, (event) => {
      if (event?.detail) {
        // console.log(event.type, event.detail.blockId, event.detail);
      }

      document.querySelectorAll(`[data-hide-if-empty-block]`).forEach((el) => {
        const block_type = el.getAttribute("data-block-type");
        styleHiddenElement(el, "block", el, block_type);
      });
      document.querySelectorAll(`[data-hide-if-empty-container]`).forEach((el) => {
        const block_type = el.getAttribute("data-block-type");
        const element = el.closest(`[data-style-id]:not([data-style-id="${el.getAttribute("data-style-id")}"])`);
        styleHiddenElement(el, "container", element, block_type);
      });
      document.querySelectorAll(`[data-hide-if-empty-section]`).forEach((el) => {
        const block_type = el.getAttribute("data-block-type");
        const element = el.closest(`.shopify-section`);
        styleHiddenElement(el, "section", element, block_type);
      });

      const action = event.type.replace(/shopify:(section|block):/gi, "");
      const editor = window.Alpine.store("editor");
      const resetEditor = {
        load_section_id: "",
        unload_section_id: "",
        reorder_section_id: "",
        deselect_block_id: "",
        deselect_section_id: "",
      };

      const resetEditorFn = () => {
        editor.load_section_id = "";
        editor.unload_section_id = "";
        editor.reorder_section_id = "";
        editor.deselect_block_id = "";
        editor.deselect_section_id = "";
      };

      switch (event.type) {
        case "shopify:section:load": {
          if (event.target instanceof HTMLElement) {
            const sectionElement = event.target.closest("[data-shopify-editor-section]");

            const tab_blocks = [[], [], []];

            sectionElement.setAttribute("x-data", "{ ..._sections.initTabs($el) }");

            sectionElement.querySelectorAll("tab-content-group").forEach((group) => {
              const label = group.nextElementSibling;
              const group_index = +group.textContent.trim();
              const label_text = label.textContent;
              tab_blocks[group_index] ??= [];
              tab_blocks[group_index].push(label_text);
              label.remove();
              group.remove();
            });

            sectionElement.querySelectorAll("tab-navigation").forEach((navigation) => {
              const label = navigation.querySelector("tab-label");
              const label_content = label.textContent;
              const label_richtext = navigation.querySelector("tab-label-richtext");
              const label_richtext_content = label_richtext.textContent;
              const tab_group = navigation.querySelector("tab-group");
              const tab_group_index = +tab_group.textContent;
              const button_class = navigation.querySelector("tab-button-class");
              const button_class_content = button_class.textContent;
              const hover_trigger = navigation.querySelector("tab-hover-trigger");
              const hover_trigger_content = hover_trigger.textContent;
              const buttons_placeholder = navigation.querySelector("tab-navigation-buttons-placeholder");

              buttons_placeholder.parentElement.innerHTML = tab_blocks[tab_group_index]
                ?.map((tab_label) => {
                  const transformedLabel = label_content?.replaceAll("[label]", tab_label);
                  const transformedRichtextLabel = label_richtext_content?.replaceAll("[label]", tab_label);
                  return `<button type="button"
                            @click="current_tabs[${tab_group_index}] = '${transformedLabel}'"
                            @pointerover="if ($el.getAttribute('data-tab-hover-trigger') === 'true') { current_tabs[${tab_group_index}] = '${transformedLabel}' }"
                            data-tab-hover-trigger="${hover_trigger_content}"
                            class="shrink-0 ${button_class_content}"
                            :class="current_tabs[${tab_group_index}] === '${transformedLabel}' ? 'active' : ''">${transformedRichtextLabel}</button>`;
                })
                ?.join("");

              label.remove();
              label_richtext.remove();
              tab_group.remove();
              button_class.remove();
              hover_trigger.remove();
            });

            sectionElement.setAttribute("data-tabs", JSON.stringify(tab_blocks.map((group) => group.join("|%S%|"))));

            /* This is important as we are parsing all styles on the Server Side into a single block, but the Theme editor loads in duplicates. */
            document.querySelectorAll("style").forEach((el) => {
              if (sectionElement.contains(el)) {
                sectionElement?.prepend(el);
                return;
              }
              if (el.innerHTML?.includes(event.detail.sectionId)) {
                el.innerHTML = el.innerHTML?.replaceAll(event.detail.sectionId, "overwritten-css-elements-not-in-use");
              }
            });

            window.Shopify.editor = {
              ...(window.Shopify.editor ?? {}),
              ...resetEditor,
              load_section_id: event.detail.sectionId,
            };
            resetEditorFn();
            editor.load_section_id = event.detail.sectionId;

            document.dispatchEvent(new CustomEvent(`editor-${action}--${event.detail.sectionId}`));
            document.dispatchEvent(new CustomEvent(`editor_load`));
          }

          break;
        }
        case "shopify:section:unload": {
          if (event.target instanceof HTMLElement) {
            const sectionElement = event.target.closest("[data-shopify-editor-section]");

            window.Shopify.editor = {
              ...(window.Shopify.editor ?? {}),
              ...resetEditor,
              unload_section_id: event.detail.sectionId,
            };
            resetEditorFn();
            editor.unload_section_id = event.detail.sectionId;
            // window.Alpine.destroyTree(sectionElement);
            document.dispatchEvent(new CustomEvent(`editor-${action}--${event.detail.sectionId}`));
            document.dispatchEvent(new CustomEvent(`editor_unload`));
          }
          break;
        }
        case "shopify:section:select":
          window.Shopify.editor = {
            ...(window.Shopify.editor ?? {}),
            ...resetEditor,
            select_section_id: event.detail.sectionId,
          };
          resetEditorFn();
          editor.select_block_id = "";
          editor.load_section_id = event.detail.load ? event.detail.sectionId : "";
          editor.select_section_id = event.detail.sectionId;
          document.dispatchEvent(new CustomEvent(`editor-${action}--${event.detail.sectionId}`));
          break;
        case "shopify:section:deselect":
          window.Shopify.editor = {
            ...(window.Shopify.editor ?? {}),
            ...resetEditor,
            select_section_id: "",
            select_block_id: "",
            deselect_section_id: event.detail.sectionId,
          };
          resetEditorFn();
          editor.select_section_id = "";
          editor.select_block_id = "";
          editor.deselect_section_id = event.detail.sectionId;
          document.dispatchEvent(new CustomEvent(`editor-${action}--${event.detail.sectionId}`));
          break;
        case "shopify:section:reorder":
          window.Shopify.editor = {
            ...(window.Shopify.editor ?? {}),
            ...resetEditor,
            reorder_section_id: event.detail.sectionId,
          };
          resetEditorFn();
          editor.reorder_section_id = event.detail.sectionId;
          document.dispatchEvent(new CustomEvent(`editor-${action}--${event.detail.sectionId}`));
          break;
        case "shopify:block:select":
          window.Shopify.editor = {
            ...(window.Shopify.editor ?? {}),
            ...resetEditor,
            select_block_id: event.detail.blockId,
          };
          resetEditorFn();
          editor.load_section_id = event.detail.load ? event.detail.sectionId : "";
          editor.select_block_id = event.detail.blockId;
          document.dispatchEvent(new CustomEvent(`editor-${action}--${event.detail.blockId}`));
          break;
        case "shopify:block:deselect":
          window.Shopify.editor = {
            ...(window.Shopify.editor ?? {}),
            ...resetEditor,
            select_block_id: "",
            deselect_block_id: event.detail.blockId,
          };
          resetEditorFn();
          editor.select_block_id = "";
          editor.deselect_block_id = event.detail.blockId;
          document.dispatchEvent(new CustomEvent(`editor-${action}--${event.detail.blockId}`));
          break;
        case "shopify:inspector:activate":
          window.Shopify.editor = {
            ...(window.Shopify.editor ?? {}),
            ...resetEditor,
            inspector: true,
          };
          resetEditorFn();
          editor.inspector = true;
          break;
        case "shopify:inspector:deactivate":
          window.Shopify.editor = {
            ...(window.Shopify.editor ?? {}),
            ...resetEditor,
            inspector: false,
          };
          editor.inspector = false;
          break;
      }
    });
  });

  document.querySelectorAll(`[data-hide-if-empty-block]`).forEach((el) => {
    const block_type = el.getAttribute("data-block-type");
    styleHiddenElement(el, "block", el, block_type);
  });
  document.querySelectorAll(`[data-hide-if-empty-container]`).forEach((el) => {
    const block_type = el.getAttribute("data-block-type");
    const element = el.closest(`[data-style-id]:not([data-style-id="${el.getAttribute("data-style-id")}"])`);
    styleHiddenElement(el, "container", element, block_type);
  });
  document.querySelectorAll(`[data-hide-if-empty-section]`).forEach((el) => {
    const block_type = el.getAttribute("data-block-type");
    const element = el.closest(`.shopify-section`);
    styleHiddenElement(el, "section", element, block_type);
  });
});

const messageHandler = (e) => {
  if (e?.data?.type === "StorefrontMessage::SelectElement" && e?.data?.payload?.blockDomId && e?.data?.payload?.sectionGid) {
    const editor = window.Alpine.store("editor");
    const resetEditor = {
      load_section_id: "",
      unload_section_id: "",
      reorder_section_id: "",
      deselect_block_id: "",
      deselect_section_id: "",
    };

    window.Shopify.editor = {
      ...(window.Shopify.editor ?? {}),
      ...resetEditor,
      select_block_id: e?.data?.payload?.blockDomId,
    };

    editor.select_block_id = e?.data?.payload?.blockDomId;

    const htmlElement = document.querySelector(`[data-style-id*="${e?.data?.payload?.blockDomId}"]`);

    if (htmlElement) {
      const [_, sectionId, blockId] = htmlElement?.getAttribute("data-style-id")?.match(/^(.*?)--([^-]*)$/i) ?? [];

      if (!blockId) {
        return;
      }

      window.Shopify.editor = {
        ...(window.Shopify.editor ?? {}),
        ...resetEditor,
        select_section_id: sectionId,
        select_block_id: blockId,
      };

      editor.select_block_id = blockId;
      editor.select_section_id = sectionId;
    }

    window.removeEventListener("message", messageHandler);
  }
};
window.addEventListener("message", messageHandler);

/* LAST HASH: e56f99ecf433f50f4f8ee0b4edfec90a6b757a34 */
;

})();

// ---- _media-gallery.js ----
(function(){
"use strict";
const initMediaGallery = () => {
  const modalStore = Alpine.store("modal");

  window.Alpine.store("mediaGallery", {
    media: _products[Object.keys(_products)[0]]?.media ?? [],
    videos: [],
    index: 0,
    scrollIndex: 0,
    showGallery({ media = [], index = 0 }) {
      this.media = media;
      this.index = index;
      this.scrollIndex = index;

      modalStore.setId("media-gallery--vertical-gallery");
    },
    showVideoGallery(element, siblings) {
      const index = siblings.indexOf(element);

      this.videos = siblings.map((el) => {
        const video = utils.JSONParse(el.getAttribute("data-ugc-video") || el.getAttribute("data-video-product-card"));
        const products = utils.JSONParse(el.getAttribute("data-ugc-products") ?? "[]");
        const autoplay = el.hasAttribute("data-autoplay");
        const muted = el.hasAttribute("data-muted");
        const loop = el.hasAttribute("data-loop");
        const controls = el.hasAttribute("data-controls");

        return {
          video:
            typeof video === "string"
              ? {
                  alt: el.textContent,
                  media_type: "external_video",
                  preview_image: null,
                  external_id: new URL(video)?.pathname.split(/[/?#]/gi)?.[1],
                  src: video,
                  host: video?.toLowerCase()?.includes("vimeo") ? "vimeo" : "youtube",
                }
              : video,
          products,
          autoplay,
          muted,
          loop,
          controls,
        };
      });
      this.index = index;
      this.scrollIndex = index;

      modalStore.setId("media-gallery--video-product-gallery");
    },
  });

  const mediaGalleryStore = window.Alpine.store("mediaGallery");
  Alpine.effect(() => {
    if (!modalStore?.id && mediaGalleryStore.media.length) {
      mediaGalleryStore.media = [];
    }
    if (!modalStore?.id && mediaGalleryStore.videos.length) {
      mediaGalleryStore.videos = [];
    }
  });
  window.Alpine.magic("mediaGallery", () => mediaGalleryStore);
  window._stores["mediaGallery"] = mediaGalleryStore;
};

document.addEventListener("alpine:init", initMediaGallery);

/* LAST HASH: d9b6b141f30f14911a02f0e5abf8f1e54aed208c */
;

})();

// ---- _page-transitions.js ----
(function(){
"use strict";
const startTime = Date.now();

let initialized = false;
let firstRender = true;
const initPageTransitions = () => {
  if (initialized) return;
  const rootContainer = document.querySelector("[data-content-root]");

  const scrollToTarget = () => {
    if (window.location.hash) {
      const target = document?.querySelector(window.location.hash);
      if (!target) return;

      if (
        utils.isElementScrollable(target.parentElement) &&
        utils.isVisible(target.parentElement) &&
        utils.isInViewport(target)
      ) {
        if (target.parentElement.scrollWidth > target.parentElement.offsetWidth) {
          utils.scrollToXY(260, target.offsetLeft, target.parentElement?.scrollTop, target.parentElement);
        }
        if (target.parentElement.scrollHeight > target.parentElement.offsetHeight) {
          utils.scrollToXY(260, target.parentElement?.scrollLeft, target.offsetTop, target.parentElement);
        }

        return;
      }

      const targetPosition =
        utils.getElementPosition(target)?.top -
        Math.max(70, document.querySelector(".header-sections-container")?.getBoundingClientRect()?.bottom ?? 0);

      utils.scrollToY(70 + Math.abs(Math.round((window.scrollY - targetPosition) / 15)), targetPosition);
    }
  };

  window.Alpine.store("router", {
    pathname: rootContainer.getAttribute("data-pathname"),
    template: rootContainer.getAttribute("data-template"),
    search: window.location.search,
    hash: window.location.hash,
    setValue(key, value) {
      this[key] = value;
    },
  });

  const routerStore = window.Alpine.store("router");

  window.Alpine.magic("router", () => routerStore);
  window._stores["router"] = routerStore;

  if (window.design_mode || !window.page_transitions_enabled) {
    // @ts-ignore
    barba.go = (href) => {
      if (typeof href === "string" && window.location.href !== href) {
        window.location.href = href;
      }
    };
    barba.prefetch = () => {};
  }

  barba.use(barbaPrefetch, {
    root: document.body,
    timeout: 4000,
    /* @ts-ignore */
    limit: 0,
  });

  /*
   barba.prefetch = (href) => {
    return barba.prefetch(href);
  };
*/

  const handleRouteCaching = (url) => {
    if (typeof idbKeyval !== "undefined" && !window.design_mode) {
      requestIdleCallback(
        async () => {
          const parsedUrl = utils.getShopifyCacheUrl(url);
          if (!barba.cache.get(parsedUrl)) return;

          const fetchResults = await barba.cache.get(parsedUrl).request.then((res) => ({ data: res }));

          const div = document.createElement("div");
          div.innerHTML = fetchResults?.data?.html;
          const productData = div.querySelectorAll(`[data-product-data]`);

          productData?.forEach(async (scriptElement) => {
            const product = utils.JSONParse(scriptElement.innerHTML);
            if (product?.handle) {
              const dbKey = `_${window.Shopify.theme.id}-product--${product.handle}--${window.theme_settings.development__cache_version}`;
              _products[product.handle] = {
                _recommendations_loaded_at: 0,
                related_products: [],
                complementary_products: [],
                ...(_products[product.handle] ?? ((await idbKeyval.get(dbKey)) || {})),
                ...(product?._full_data ? product : _products[product.handle]?._full_data ? _products[product.handle] : product),
                _updated_at: Date.now(),
              };
              await idbKeyval.set(dbKey, _products[product.handle]);
              if (_products[product.handle]?._full_data) {
                sessionStorage.setItem(dbKey, "1");
              }
            }
          });

          await idbKeyval.set(`barba-prefetch---${startTime}-//-${parsedUrl}`, fetchResults);
        },
        { timeout: 3000 }
      );
    }
  };

  document.addEventListener("barba:prefetch:fulfilled", async (e) => {
    handleRouteCaching(e.detail.url?.replace(/(\/collections\/[^/]*\/)/gi, "/"));
  });

  if (typeof idbKeyval !== "undefined" && window.theme_settings && !window.design_mode) {
    idbKeyval
      .keys()
      .then(async (res) => {
        res.forEach(async (key) => {
          if (key.includes("/account")) {
            idbKeyval.del(key);
            return;
          }
          const [timestamp, cacheKey] = key.replace("barba-prefetch---", "").split("-//-");

          if (cacheKey && +timestamp > Date.now() - 1000 * 60 * 10) {
            barba.cache.set(
              cacheKey,
              idbKeyval.get(key).then((res) => res.data),
              "prefetch"
            );
          } else if (cacheKey && +timestamp > 0) {
            idbKeyval.del(key);
          }
        });
        await utils.delay(100);
        barba.timeout = window.origin.includes("127.0.0.1") ? 30000 : 4000;
      })
      .catch(async (err) => {
        await utils.delay(100);
        barba.timeout = window.origin.includes("127.0.0.1") ? 30000 : 4000;
      });
  }

  const transitionOverlay = document.querySelector("[data-transition-overlay]");
  barba.init({
    prefetchIgnore: [
      "/challenge",
      "/gift_cards",
      "/search",
      "/account/logout",
      "/account/logout/:any",
      "/customer_identity",
      "/customer_identity/:any",
      "/apps",
      "/apps/:any",
      ...(window.page_transitions_ignore ?? []),
    ].filter(Boolean),
    cacheIgnore: [
      "/challenge",
      "/gift_cards",
      "/search",
      "/account/logout",
      "/account/logout/:any",
      "/customer_identity",
      "/customer_identity/:any",
      "/apps",
      "/apps/:any",
      ...(window.page_transitions_ignore ?? []),
    ].filter(Boolean),
    debug: false,
    /* @ts-ignore */
    cacheFirstPage: true,
    timeout: window.origin.includes("127.0.0.1") ? 30000 : 4000, // default is 2000ms,
    transitions: [
      {
        name: "opacity-transition",
        leave: (data) => {
          transitionOverlay?.classList.add("active", "out-active");
          transitionOverlay?.parentElement?.classList.add("active", "out-active");
        },
        enter: (data) => {
          const handleTransitionend = () => {
            transitionOverlay?.classList.remove("out-active");
            transitionOverlay?.parentElement?.classList.remove("out-active");
            transitionOverlay?.removeEventListener("transitionend", handleTransitionend);
          };
          transitionOverlay?.classList.remove("active");
          transitionOverlay?.parentElement?.classList.remove("active");
          transitionOverlay?.addEventListener("transitionend", handleTransitionend);

          const scrollToTopWithStickyCompensation = () => {
            requestAnimationFrame(() => {
              window.scrollTo({ top: 0, behavior: "auto" });

              requestAnimationFrame(() => {
                const header = document.querySelector("[data-header-section]");
                const offset = header?.getBoundingClientRect().bottom ?? 0;

                window.scrollBy({
                  top: -offset,
                  behavior: "auto",
                });

                const topSentinel = document.createElement("div");
                topSentinel.style.position = "absolute";
                topSentinel.style.top = "0";
                topSentinel.style.width = "1px";
                topSentinel.style.height = "1px";
                document.body.prepend(topSentinel);

                const observer = new IntersectionObserver(
                  ([entry]) => {
                    if (!entry.isIntersecting) {
                      window.scrollBy({ top: -offset, behavior: "auto" });
                    }
                    observer.disconnect();
                    topSentinel.remove();
                  },
                  {
                    threshold: 0.01,
                  }
                );

                observer.observe(topSentinel);
              });
            });
          };
          scrollToTopWithStickyCompensation();
        },
      },
    ],
    views: [
      {
        beforeLeave: (data) => {
          console.debug("beforeLeave", data);
          window._stores?.modal?.setId("");
          window._stores?.modal?.setSubId("");
          // window.Alpine?.destroyTree?.(data.current.container);
        },
        namespace: "tmp",
        afterLeave(data) {
          console.debug("afterLeave", data);

          routerStore.setValue("pathname", window.location.pathname);
          routerStore.setValue("search", window.location.search);
          if (!data?.next?.container) {
            return;
          }
          routerStore.setValue("template", data?.next?.container?.getAttribute("data-template"));
        },
        beforeEnter: (data) => {
          console.debug("beforeEnter", data);
          data?.next?.container?.querySelectorAll("[x-defer-active]").forEach((el) => el.removeAttribute("x-defer-active"));
        },
        afterEnter: (data) => {
          console.debug("afterEnter", data);

          // window.Alpine?.stopObservingMutations?.();
          // window.Alpine?.deferMutations?.();

          data?.current?.container?.remove();
          window._stores["quickView"].show = false;
          window._stores?.modal?.setId("");
          window._stores?.modal?.setSubId("");

          const productDataContainer = data.next.container?.querySelector("[data-product-data-init]");

          if (productDataContainer) {
            const newScriptTag = document.createElement("script");
            newScriptTag.innerHTML = productDataContainer.innerText;
            newScriptTag.setAttribute("data-product-data-init", "");

            document.head.appendChild(newScriptTag);
          }

          // requestAnimationFrame(() => {
          //   requestAnimationFrame(() => {
          //     window.Alpine?.flushAndStopDeferringMutations?.();
          //     window.Alpine?.startObservingMutations?.();
          //   });
          // });

          if (data?.next?.container && !firstRender) {
            utils.delay(60).then(() => {
              // window.Alpine?.stopObservingMutations?.();
              // window.Alpine?.deferMutations?.();

              scrollToTarget();

              const html = document.createElement("html");
              html.innerHTML = data.next?.html;

              html.querySelectorAll(".shopify-block.shopify-app-block").forEach((element) => {
                const currentElement = document.getElementById(element.id);
                currentElement.parentNode.replaceChild(element, currentElement);
              });

              const contentScripts = html.querySelectorAll("[data-content-root] script[src]");

              html.querySelectorAll(":not([data-content-root]) script[src]").forEach((scriptElement) => {
                const existingScript =
                  document.head.querySelector(`script[src*="${scriptElement.src.split("?")[0]?.split("/").at(-1)}"]`) ||
                  [...contentScripts].includes(scriptElement);

                if (!existingScript) {
                  const newScriptTag = document.createElement("script");
                  scriptElement.getAttributeNames().forEach((name) => {
                    newScriptTag.setAttribute(name, scriptElement.getAttribute(name));
                    if (name === "src") {
                      newScriptTag.setAttribute(
                        name,
                        scriptElement.src?.includes("?")
                          ? `${scriptElement?.src}&v_id=${Date.now()}`
                          : `${scriptElement?.src}?v_id=${Date.now()}`
                      );
                    }
                  });
                  document.head.appendChild(newScriptTag);
                  // console.log(barba.cache, "barba.cache", scriptElement.src);
                }
              });

              document
                .querySelectorAll("[data-content-root] script:not(script[src],[data-product-data],[type='application/json'])")
                .forEach((scriptElement) => {
                  const newScriptTag = document.createElement("script");
                  newScriptTag.innerHTML = scriptElement.innerHTML;
                  scriptElement.getAttributeNames().forEach((name) => {
                    newScriptTag.setAttribute(name, scriptElement.getAttribute(name));
                    if (name === "src") {
                      newScriptTag.setAttribute(
                        name,
                        scriptElement.src?.includes("?")
                          ? `${scriptElement?.src}&v_id=${Date.now()}`
                          : `${scriptElement?.src}?v_id=${Date.now()}`
                      );
                    }
                  });
                  scriptElement.parentNode.replaceChild(newScriptTag, scriptElement);
                });

              document.querySelectorAll("[data-content-root] script[src]").forEach((scriptElement) => {
                const newScriptTag = document.createElement("script");
                scriptElement.getAttributeNames().forEach((name) => {
                  newScriptTag.setAttribute(name, scriptElement.getAttribute(name));
                  if (name === "src") {
                    newScriptTag.setAttribute(
                      name,
                      scriptElement.src?.includes("?")
                        ? `${scriptElement?.src}&v_id=${Date.now()}`
                        : `${scriptElement?.src}?v_id=${Date.now()}`
                    );
                  }
                });

                scriptElement.parentNode.replaceChild(newScriptTag, scriptElement);
              });

              // window.Alpine?.initTree?.(data.next.container);
              //
              // window.Alpine?.flushAndStopDeferringMutations?.();
              // window.Alpine?.startObservingMutations?.();
            });
          }

          // if (data?.next?.container && firstRender) {
          //   window.Alpine?.initTree?.(data.next.container);
          // }

          if (!firstRender) {
            requestIdleCallback(
              () => {
                document.dispatchEvent(new Event("DOMContentLoaded"));
                window.dispatchEvent(new Event("DOMContentLoaded"));
                document.dispatchEvent(new CustomEvent("pageFullyLoaded", {}));
                Shopify?.PaymentButton?.init();
                window?.okeWidgetApi?.initAllWidgets();
                window?.yotpoWidgetsContainer?.initWidgets();
                window?.loyaltylion?.ui?.refresh();

                setTimeout(() => {
                  window?.okeWidgetApi?.initAllWidgets();
                }, 1000);

                setTimeout(() => {
                  window?.okeWidgetApi?.initAllWidgets();
                }, 3000);
              },
              { timeout: 5000 }
            );
          }

          firstRender = false;
        },
      },
    ],
  });
  [...(barba.cache.keys() ?? [])].forEach((key) => {
    if (key.includes("/account")) {
      barba.cache.delete(key);
    }
  });

  handleRouteCaching(window.location.origin + window.location.pathname);
  barba.timeout = 1;

  initialized = true;
};

document.addEventListener("alpine:init", initPageTransitions);

/* LAST HASH: c79f74702bb6e19229906a62b1dbcbf49da293fb */
;

})();

// ---- _pagination.js ----
(function(){
"use strict";
const initPagination = () => {};
const _pagination = {
  init: (paginationContainer, container) => {
    const paginateToUrl = async (url) => {
      if (!container) {
        return;
      }
      try {
        container
          ?.querySelectorAll(
            "[class^=product-card--], [class^=collection-card--], [class^=article-card--], [class^=blog-card--], [class^=page-card--]"
          )
          ?.forEach((card) => {
            card?.classList?.add("button-loading-transparent");
          });

        if (!url.includes(window.location.origin)) {
          url = `${window.location.origin}${url}`;
        }
        const html = await utils.fetchFromCache(url);

        const newDocument = new DOMParser().parseFromString(html, "text/html");

        const newContent = newDocument.querySelector(`[data-next-url][x-ref="${container?.getAttribute("x-ref")}"]`);
        const newPagination = newDocument.querySelector(`[data-pagination][x-ref="pagination"]`);

        if (newContent) {
          container.innerHTML = newContent.innerHTML;
        }
        if (newPagination) {
          paginationContainer.innerHTML = newPagination.innerHTML;
        }
        window.scrollTo({
          top: container?.getBoundingClientRect().y + window.scrollY - 260,
          behavior: "smooth",
        });

        barba.history.add(url.toString(), "barba", "push");
      } catch (error) {
        console.error("Error loading new page:", error);
      }
    };

    return {
      paginateToUrl,
    };
  },
};

window._pagination = _pagination;

initPagination();

/* LAST HASH: 849fe3b1ded651cd8ca874c6e3eabb42f9c83f07 */
;

})();

// ---- _product-data.js ----
(function(){
"use strict";
const _product = {
  getHtmlProduct: (handle) => {
    const product = utils.JSONParse(
      document.querySelector(`[data-primary-product-data="${handle}"]`)?.innerHTML ??
        document.querySelector(`[data-product-data="${handle}"]`)?.innerHTML
    );

    if (product) {
      _products[handle] = {
        _recommendations_loaded_at: 0,
        complementary_products: [],
        related_products: [],
        ...(_products[handle] ?? {}),
        ...(product?._full_data ? product : _products[handle]?._full_data ? _products[handle] : product),
        _updated_at: Date.now(),
      };
      if (!_products[handle]?._full_data) {
        const dbKey = `_${window.Shopify.theme.id}-product--${handle}`;

        idbKeyval.get(dbKey).then((dbProduct) => {
          if (dbProduct?._full_data) {
            _products[handle] = {
              ...(_products[handle] ?? {}),
              ...dbProduct,
              _updated_at: Date.now(),
            };
            _product.saveProduct(handle);
          }
        });
      }
      _product.saveProduct(handle);

      return _products[handle];
    }
    return null;
  },
  getCachedProduct: async (handle) => {
    const dbKey = `_${window.Shopify.theme.id}-product--${handle}`;

    try {
      if (!window._cached_products.has(handle)) {
        window._cached_products.set(
          handle,
          idbKeyval.get(dbKey).then((product) => {
            if (!product) return null;

            _products[handle] = {
              ...(_products[handle] ?? {}),
              ...(product?._full_data ? product : _products[handle]?._full_data ? _products[handle] : product),
            };

            if (product && (product._updated_at ?? 0) < Date.now() - 1000 * 60 * 15) {
              _product.getFetchProduct(handle, product.id, "low");
            }
            return _products[handle];
          })
        );
      }

      return await window._cached_products.get(handle);
    } catch (err) {
      return null;
    }
  },
  getFetchProduct: async (handle, productId, priority = "auto") => {
    if (!productId) return null;

    try {
      if (!window._fetch_products.has(handle)) {
        window._fetch_products.set(
          handle,
          fetch(
            `/recommendations/products?product_id=${productId}&limit=10&section_id=data_product_json&intent=related&with_product_data=true`,
            { priority: priority }
          )
            .then((res) => {
              if (res.status === 404) {
                window._recent_products = window._recent_products.filter((recent_product) => recent_product[0] !== handle) ?? [];
                localStorage?.setItem("_recent_products_storage", JSON.stringify(window._recent_products));
                return null;
              }
              return res.text();
            })
            .then((text) => {
              const html = document.createElement("div");
              html.innerHTML = text;

              const product = utils.JSONParse(html.querySelector("[data-product-data]")?.innerHTML ?? "{}");
              product.related_products = utils.JSONParse(html.querySelector("[data-product-recommendations]")?.innerHTML ?? "[]");

              requestIdleCallback(
                async () => {
                  [...(product.related_products ?? [])]
                    .filter((a, i, arr) => arr.findIndex((b) => a.handle === b.handle) === i)
                    .map(async (product) => {
                      const dbKey = `_${window.Shopify.theme.id}-product--${product.handle}--${window.theme_settings.development__cache_version}`;
                      _products[product.handle] = {
                        _recommendations_loaded_at: 0,
                        related_products: [],
                        complementary_products: [],
                        ...(_products[product.handle] ?? ((await idbKeyval.get(dbKey)) || {})),
                        ...(product?._full_data
                          ? product
                          : _products[product.handle]?._full_data
                          ? _products[product.handle]
                          : product),
                        _updated_at: Date.now(),
                      };
                      idbKeyval.set(dbKey, _products[product.handle]);
                      if (_products[product.handle]?._full_data) {
                        sessionStorage.setItem(dbKey, "1");
                      }
                    });
                },
                { timeout: 5000 }
              );

              product._recommendations_loaded_at = Date.now();
              return product;
            })
        );
      }

      const product = await window._fetch_products.get(handle);

      if (product) {
        _products[handle] = {
          complementary_products: [],
          ...(_products[handle] ?? {}),
          ...(product?._full_data ? product : _products[handle]?._full_data ? _products[handle] : product),
          _recommendations_loaded_at: product._recommendations_loaded_at,
          related_products: product.related_products,
          _updated_at: Date.now(),
        };
        _product.saveProduct(handle);
        return _products[handle];
      }
      return null;
    } catch (err) {
      return null;
    }
  },
  saveProduct: (handle, dataOverride = undefined) => {
    _products[handle] = {
      ...(_products[handle] ?? {}),
      ...(dataOverride ?? {}),
    };

    const product = _products[handle];
    if (!product) return null;

    const dbKey = `_${window.Shopify.theme.id}-product--${handle}`;

    const nextSeq = (window._save_product_sequence.get(handle) ?? 0) + 1;
    window._save_product_sequence.set(handle, nextSeq);

    if (window._save_product_schedule.has(handle)) {
      return product;
    }

    window._save_product_schedule.add(handle);

    requestIdleCallback(
      async () => {
        try {
          // eslint-disable-next-line no-constant-condition
          while (true) {
            const sequence_before = window._save_product_sequence.get(handle) ?? 0;
            const latest = _products[handle];
            await idbKeyval.set(dbKey, latest);

            const sequence_after = window._save_product_sequence.get(handle) ?? 0;
            if (sequence_after === sequence_before) {
              break;
            }
          }
        } finally {
          window._save_product_schedule.delete(handle);
        }
      },
      { timeout: 5000 }
    );

    return product;
  },
  getHydratedProductData: async (handle, productId, priority = "auto") => {
    if (!_products[handle]?.handle || (_products[handle]?._recommendations_loaded_at ?? 0) < Date.now() - 1000 * 60 * 30) {
      _product.getHtmlProduct(handle);
    }
    if (!_products[handle]?.handle || (_products[handle]?._recommendations_loaded_at ?? 0) < Date.now() - 1000 * 60 * 30) {
      await _product.getCachedProduct(handle);
    }
    if (!_products[handle]?.handle || (_products[handle]?._recommendations_loaded_at ?? 0) < Date.now() - 1000 * 60 * 30) {
      await _product.getFetchProduct(handle, productId || _products[handle]?.id, priority);
    }
    if (!_products[handle]?.handle || (_products[handle]?._recommendations_loaded_at ?? 0) < Date.now() - 1000 * 60 * 30) {
      return null;
    }

    return _products[handle];
  },
  getProductData: async (handle, productId, priority = "auto") => {
    if (!_products[handle]?.handle) {
      _product.getHtmlProduct(handle);
      // console.warn("html", _products[handle]);
    }
    if (!_products[handle]?.handle) {
      await _product.getCachedProduct(handle);
      // console.warn("cache", _products[handle]);
    }
    if (!_products[handle]?.handle) {
      await _product.getFetchProduct(handle, productId, priority);
      // console.warn("fetch", _products[handle]);
    }
    if (!_products[handle]?.handle) {
      return null;
    }
    return _products[handle];
  },
  initDynamicProductCards: async (
    $el,
    {
      targeting_type,
      target_product_handle,
      target_product_id,
      primary_source,
      fallback_source,
      product_class,
      desktop_display_limit = 50,
      mobile_display_limit = 50,
      addon_products,
      addon_auto_add,
      addon_bundle_in_cart,
      addon_target_product,
      hide_if_empty,
      handleResize = () => {},
      order_offset = 1,
      section_id,
      filter_by_type = "",
      hide_out_of_stock = false,
      block_id,
    }
  ) => {
    const container = $el.parentElement;

    const limit = Math.max(desktop_display_limit, mobile_display_limit);

    const product =
      utils.JSONParse(document.querySelector(`[data-product-data="${target_product_handle}"]`)?.innerHTML) ??
      (await _product.getHydratedProductData(target_product_handle, target_product_id));

    const fallback_products_source = utils.JSONParse($el.getAttribute(`data-fallback-products`) ?? "[]");

    let sourceNode = document.querySelector(`[data-product-card='${product_class}']`);

    if (!sourceNode && !window.modalsLoaded) {
      await new Promise((resolve) => {
        document.addEventListener(
          "modalsLoaded",
          () => {
            sourceNode = document.querySelector(`[data-product-card='${product_class}']`);
            resolve(true);
          },
          { once: true }
        );
      });
    }

    const cart = window.Alpine.store("cart");
    const modal = window.Alpine.store("modal");
    const editor = window.Alpine.store("editor");

    const state = window.Alpine.reactive({
      product: product,
    });

    const renderDynamicProductCards = async () => {
      handleResize();
      setTimeout(handleResize, 50);

      const lineItemProducts = /^cart_/gi.test(targeting_type)
        ? await Promise.all(cart.state.items?.map((item) => _product.getHydratedProductData(item.handle, item.product_id)))
        : [];

      const recentlyViewedProducts = /^recently_viewed_/gi.test(targeting_type)
        ? await Promise.all(_recent_products?.map(([handle, product_id]) => _product.getHydratedProductData(handle, product_id)))
        : [];

      const products = [];
      const complementary_products = [];
      const related_products = [];

      switch (targeting_type) {
        case "product": {
          state.product?.complementary_products?.forEach((item) => {
            if (hide_out_of_stock && !item.available) return;
            if (item?.metafields?.seo?.hidden) return;
            if (item.id !== state.product?.id) {
              complementary_products.push(item);
            }
          });
          state.product?.related_products?.forEach((item) => {
            if (hide_out_of_stock && !item.available) return;
            if (item.id !== state.product?.id) {
              related_products.push(item);
            }
          });
          break;
        }
        case "recently_viewed_ai": {
          const expensive = [...recentlyViewedProducts].sort((a, b) => b.price - a.price).slice(0, 3);
          const recent = recentlyViewedProducts.slice(0, 2).sort((a, b) => b.price - a.price);

          [...recent, ...expensive]?.forEach((product, parentIndex) => {
            product?.complementary_products?.forEach((item, i) => {
              if (hide_out_of_stock && !item.available) return;
              if (item?.metafields?.seo?.hidden) return;
              if (i >= 2 || (i >= 1 && parentIndex >= 2)) {
                return;
              }
              complementary_products.push(item);
            });
            product?.related_products?.forEach((item, i) => {
              if (hide_out_of_stock && !item.available) return;
              if (item?.metafields?.seo?.hidden) return;
              if (i >= 2 || (i >= 1 && parentIndex >= 2)) {
                return;
              }
              related_products.push(item);
            });
          });
          break;
        }
        case "recently_viewed_most_expensive": {
          [...recentlyViewedProducts]
            .sort((a, b) => b.price - a.price)
            ?.forEach((product, parentIndex) => {
              product?.complementary_products?.forEach((item, i) => {
                if (hide_out_of_stock && !item.available) return;
                if (item?.metafields?.seo?.hidden) return;
                if (i >= 2 || (i >= 1 && parentIndex >= 2)) {
                  return;
                }
                complementary_products.push(item);
              });
              product?.related_products?.forEach((item, i) => {
                if (hide_out_of_stock && !item.available) return;
                if (item?.metafields?.seo?.hidden) return;
                if (i >= 2 || (i >= 1 && parentIndex >= 2)) {
                  return;
                }
                related_products.push(item);
              });
            });
          break;
        }
        case "recently_viewed_least_expensive": {
          [...recentlyViewedProducts]
            .sort((a, b) => a.price - b.price)
            ?.forEach((product, parentIndex) => {
              product?.complementary_products?.forEach((item, i) => {
                if (hide_out_of_stock && !item.available) return;
                if (item?.metafields?.seo?.hidden) return;
                if (i >= 2 || (i >= 1 && parentIndex >= 2)) {
                  return;
                }
                complementary_products.push(item);
              });
              product?.related_products?.forEach((item, i) => {
                if (hide_out_of_stock && !item.available) return;
                if (item?.metafields?.seo?.hidden) return;
                if (i >= 2 || (i >= 1 && parentIndex >= 2)) {
                  return;
                }
                related_products.push(item);
              });
            });
          break;
        }
        case "cart_ai": {
          const expensive = [...cart.state.items].sort((a, b) => b.final_price - a.final_price).slice(0, 3);
          const recent = cart.state.items.slice(0, 2).sort((a, b) => b.final_price - a.final_price);

          [...recent, ...expensive]?.forEach((line, parentIndex) => {
            const product = lineItemProducts.find((p) => p.handle === line.handle);

            product?.complementary_products?.forEach((item, i) => {
              if (hide_out_of_stock && !item.available) return;
              if (item?.metafields?.seo?.hidden) return;
              if (i >= 2 || (i >= 1 && parentIndex >= 2)) {
                return;
              }
              complementary_products.push(item);
            });
            product?.related_products?.forEach((item, i) => {
              if (hide_out_of_stock && !item.available) return;
              if (item?.metafields?.seo?.hidden) return;
              if (i >= 2 || (i >= 1 && parentIndex >= 2)) {
                return;
              }
              related_products.push(item);
            });
          });
          break;
        }
        case "cart_most_expensive": {
          [...cart.state.items]
            .sort((a, b) => b.final_price - a.final_price)
            ?.forEach((line, parentIndex) => {
              const product = lineItemProducts.find((p) => p.handle === line.handle);

              product?.complementary_products?.forEach((item, i) => {
                if (hide_out_of_stock && !item.available) return;
                if (item?.metafields?.seo?.hidden) return;
                if (i >= 2 || (i >= 1 && parentIndex >= 2)) {
                  return;
                }
                complementary_products.push(item);
              });
              product?.related_products?.forEach((item, i) => {
                if (hide_out_of_stock && !item.available) return;
                if (item?.metafields?.seo?.hidden) return;
                if (i >= 2 || (i >= 1 && parentIndex >= 2)) {
                  return;
                }
                related_products.push(item);
              });
            });
          break;
        }
        case "cart_least_expensive": {
          [...cart.state.items]
            .sort((a, b) => a.final_price - b.final_price)
            ?.forEach((line, parentIndex) => {
              const product = lineItemProducts.find((p) => p.handle === line.handle);

              product?.complementary_products?.forEach((item, i) => {
                if (hide_out_of_stock && !item.available) return;
                if (item?.metafields?.seo?.hidden) return;
                if (i >= 2 || (i >= 1 && parentIndex >= 2)) {
                  return;
                }
                complementary_products.push(item);
              });
              product?.related_products?.forEach((item, i) => {
                if (hide_out_of_stock && !item.available) return;
                if (item?.metafields?.seo?.hidden) return;
                if (i >= 2 || (i >= 1 && parentIndex >= 2)) {
                  return;
                }
                related_products.push(item);
              });
            });
          break;
        }
        case "cart_recently_added": {
          cart.state.items?.forEach((line, parentIndex) => {
            const product = lineItemProducts.find((p) => p.handle === line.handle);

            product?.complementary_products?.forEach((item, i) => {
              if (hide_out_of_stock && !item.available) return;
              if (item?.metafields?.seo?.hidden) return;
              if (i >= 2 || (i >= 1 && parentIndex >= 2)) {
                return;
              }
              complementary_products.push(item);
            });
            product?.related_products?.forEach((item, i) => {
              if (hide_out_of_stock && !item.available) return;
              if (item?.metafields?.seo?.hidden) return;
              if (i >= 2 || (i >= 1 && parentIndex >= 2)) {
                return;
              }
              related_products.push(item);
            });
          });
          break;
        }
      }

      switch (primary_source) {
        case "complementary": {
          complementary_products?.forEach((prod) => products.push(prod));
          break;
        }
        case "related": {
          related_products?.forEach((prod) => products.push(prod));
          break;
        }
        case "recently_viewed": {
          const recent_products = await Promise.all(
            (window?._recent_products ?? [])?.map(([handle, product_id]) => _product.getHydratedProductData(handle, product_id))
          );
          recent_products?.forEach((prod) => products.push({ ...prod, recommendation_params: undefined }));
          break;
        }
        case "manual": {
          const fallback_products = await Promise.all(
            fallback_products_source?.map(([handle, product_id]) => _product.getHydratedProductData(handle, product_id))
          );
          fallback_products?.forEach((prod) => products.push({ ...prod, recommendation_params: undefined }));
          break;
        }
      }

      switch (fallback_source) {
        case "complementary": {
          complementary_products?.forEach((prod) => products.push(prod));
          break;
        }
        case "related": {
          related_products?.forEach((prod) => products.push(prod));
          break;
        }
        case "recently_viewed": {
          const recent_products = await Promise.all(
            (window?._recent_products ?? []).map(([handle, product_id]) => _product.getHydratedProductData(handle, product_id))
          );
          recent_products?.forEach((prod) => products.push({ ...prod, recommendation_params: undefined }));
          break;
        }
        case "manual": {
          const fallback_products = await Promise.all(
            fallback_products_source?.map(([handle, product_id]) => _product.getHydratedProductData(handle, product_id))
          );
          fallback_products?.forEach((prod) => products.push({ ...prod, recommendation_params: undefined }));
          break;
        }
      }

      const renderProducts =
        products
          ?.filter((prod) => {
            if (targeting_type === "product") {
              if (!prod || prod.id === state?.product?.id) return false;
            }
            if (/^cart_/gi.test(targeting_type)) {
              if (cart.state.items.some((item) => item.product_id === prod?.id)) return false;
            }
            if (/^recently_viewed_/gi.test(targeting_type)) {
              if (_recent_products.some(([handle, id]) => id === prod?.id)) return false;
            }
            if (filter_by_type) {
              if (prod.type.toLowerCase().trim() !== filter_by_type) return false;
            }
            if (hide_out_of_stock && !prod.available) {
              return false;
            }
            if (prod?.metafields?.seo?.hidden) return false;
            return true;
          })
          ?.filter((a, i, arr) => arr.findIndex((b) => b.id === a.id) === i) ?? [];

      switch (hide_if_empty) {
        case "none": {
          if (renderProducts?.length === 0 && fallback_products_source.length) {
            const fallback_products = await Promise.all(
              fallback_products_source?.map(([handle, product_id]) => _product.getHydratedProductData(handle, product_id))
            );

            const validFallbackProducts =
              fallback_products
                ?.filter((prod) => {
                  if (targeting_type === "product") {
                    if (!prod || prod.id === state?.product?.id) return false;
                  }
                  if (/^cart_/gi.test(targeting_type)) {
                    if (cart.state.items.some((item) => item.product_id === prod?.id)) return false;
                  }
                  if (/^recently_viewed_/gi.test(targeting_type)) {
                    if (_recent_products.some(([handle, id]) => id === prod?.id)) return false;
                  }
                  if (filter_by_type) {
                    if (prod.type.toLowerCase().trim() !== filter_by_type) return false;
                  }
                  if (hide_out_of_stock && !prod.available) {
                    return false;
                  }
                  if (prod?.metafields?.seo?.hidden) return false;
                  return true;
                })
                ?.filter((a, i, arr) => arr.findIndex((b) => b.id === a.id) === i) ?? [];

            validFallbackProducts.forEach((prod) => renderProducts.push(prod));
          }
          break;
        }
        case "section": {
          container.closest(`.shopify-section`)?.style?.setProperty?.("display", "block");
          container.closest(`.shopify-section`)?.classList.toggle("!hidden", renderProducts?.length === 0);
          break;
        }
        case "container": {
          container?.classList.toggle("!hidden", renderProducts?.length === 0);
          break;
        }
        case "block": {
          break;
        }
      }

      const existingItems = [...container.querySelectorAll(`[data-render-index*="${block_id}--"]`)].filter((el) => {
        if (renderProducts.slice(0, limit).some((prod) => el.getAttribute("data-product-handle") === prod.handle)) return true;
        el.remove();
        return false;
      });

      renderProducts.slice(0, limit).forEach((prod, i, arr) => {
        if (!_products[prod.handle]) {
          _products[prod.handle] = prod;
        }

        const existingItem = existingItems.find((el) => el.getAttribute("data-product-handle") === prod.handle);
        if (existingItem) {
          existingItem.setAttribute("data-render-index", `${block_id}--${i}`);
          existingItem.style.setProperty("--order", `${(i + order_offset) * 10}`);
          if (prod.recommendation_params) {
            existingItem.setAttribute("data-recommendation-params", prod.recommendation_params);
          }
          return;
        }

        const node = sourceNode?.cloneNode(true);

        if (node) {
          node.querySelectorAll("[data-x-ignore]").forEach((el) => {
            el.setAttribute("x-ignore", "");
          });
          node.querySelectorAll("[x-defer-active]").forEach((el) => {
            el.removeAttribute("x-defer-active");
          });
          node.removeAttribute("x-defer-active");

          node.setAttribute("x-ignore", "");

          const div = document.createElement("div");
          div.setAttribute("data-product-handle", prod.handle);
          div.setAttribute("data-style-id", `${section_id}--${block_id}`);
          div.setAttribute("data-render-index", `${block_id}--${i}`);

          div.setAttribute(
            "class",
            `shrink-0 max-w-full w-full order-[--order] ${
              i > desktop_display_limit ? "mobile-only" : i > mobile_display_limit ? "desktop-tablet-only" : ""
            }`
          );
          div.style.setProperty("--order", `${(i + order_offset) * 10}`);
          node.removeAttribute(`data-product-card`);
          node.setAttribute("data-product-handle", prod.handle);
          node.setAttribute("data-product-id", `${prod.id}`);
          node.setAttribute("data-variant-id", `${prod.variants?.[0]?.id}`);
          node.classList.add("card-loading");
          if (prod.recommendation_params) {
            node.setAttribute("data-recommendation-params", prod.recommendation_params);
          }
          if (addon_products) {
            node.setAttribute("data-addon-product-target", addon_target_product);
            if (addon_auto_add) {
              node.setAttribute("data-addon-auto-add", "");
            }
            if (addon_bundle_in_cart) {
              node.setAttribute("data-addon-cart-bundle", "");
            }
          }
          node.querySelectorAll("[data-loop-item], [data-x-if], style").forEach((el) => el.remove());
          div.appendChild(node);
          container.appendChild(div);
        }
      });
      handleResize();
    };

    renderDynamicProductCards();

    if (targeting_type === "product" && (primary_source === "related" || fallback_source === "related")) {
      Alpine.effect(() => {
        if (state.product?._recommendations_loaded_at || state.product?.complementary_products?.length) {
          renderDynamicProductCards();
        }
      });
    }

    if (/^cart_/gi.test(targeting_type)) {
      Alpine.effect(() => {
        const show =
          !container.closest("[data-dynamic-modals]") ||
          editor?.select_section_id === section_id ||
          modal.id === "modal--cart-drawer";

        if ((cart.state.total_price || cart.state.item_count || cart.state.item_count <= 0) && show) {
          renderDynamicProductCards();
        }
      });
    }

    _product.getHydratedProductData(product?.handle, product?.id).then((res) => {
      state.product = state.product?.handle === res?.handle ? res : state.product;
    });
  },
  getSelectedVariant: (product, variantId) => {
    const {
      variants = [],
      selected_variant_id,
      selected_or_first_available_variant_id,
      options_with_values = [],
    } = product ?? {};

    const matchLastOptions = (v, depth) =>
      options_with_values
        .slice(0, depth)
        .every((option, i) => _product.lastOptions[option?.name?.toLowerCase()] === v.options[i]);

    const matchSomeLastOptions = (v) =>
      options_with_values.some((option, i) => _product.lastOptions[option?.name?.toLowerCase()] === v.options[i]);

    const strategies = [
      (v) => v.id === variantId,
      (v) => v.id && v.available && !v.preorder && matchLastOptions(v, options_with_values.length),
      (v) => v.id && v.available && !v.preorder && matchLastOptions(v, options_with_values.length - 1),
      (v) => v.id && v.available && !v.preorder && matchLastOptions(v, options_with_values.length - 2),
      (v) => v.id && v.available && !v.preorder && matchSomeLastOptions(v),
      (v) => v.id === selected_variant_id && v.available && !v.preorder,
      (v) => v.id === selected_or_first_available_variant_id && v.available && !v.preorder,
      (v) => v.id && v.available && !v.preorder,
      (v) => v.id && v.available && matchLastOptions(v, options_with_values.length),
      (v) => v.id && v.available && matchLastOptions(v, options_with_values.length - 1),
      (v) => v.id && v.available && matchLastOptions(v, options_with_values.length - 2),
      (v) => v.id && v.available && matchSomeLastOptions(v),
      (v) => v.id === selected_variant_id && v.available,
      (v) => v.id === selected_or_first_available_variant_id && v.available,
      (v) => v.id && v.available,
    ];

    return strategies.map((fn) => variants.find(fn)).find(Boolean) || variants[0];
  },
  lastOptions: utils.JSONParse(sessionStorage.getItem("_p_last_options") || "{}") ?? {},
};

window._product = _product;

})();

// ---- _quick-view.js ----
(function(){
"use strict";
const initQuickView = () => {
  window.Alpine.store("quickView", {
    show: false,
    loading: false,
    handle: "",
    dynamic_popups: [],
    container: document.querySelector("[data-quick-view-container]"),
    show_all_container: document.querySelector("[data-quick-view-show-more]"),
    loading_container: document.querySelector("[data-quick-view-loading]"),

    async renderQuickView(handle, $data, bundleButton, variantId) {
      requestAnimationFrame(async () => {
        requestAnimationFrame(async () => {
          const container = this.container;
          this.handle = handle;
          this.show = true;

          this.loading_container?.classList?.remove("opacity-0", "pointer-events-none");
          if (!handle || !container) return;

          container.parentElement?.querySelectorAll?.("style")?.forEach((style) => {
            style.remove();
          });

          const html = await utils.fetchFromCache(`${window.location.origin}/products/${handle}`);

          const div = document.createElement("div");

          div.innerHTML = html;
          const productData = div.querySelector(`[data-product-data="${handle}"]`);
          div.querySelectorAll("[data-popup]").forEach((popup) => {
            document.body.appendChild(popup);
            this.dynamic_popups.push(popup);
          });
          const form = div.querySelector(`[data-content-root] [data-section-type="main_product"]`);
          const section = div.querySelector(`[data-content-root] [data-section-type="main_product"]`)?.parentElement;

          if (!form || !section) {
            return;
          }

          section?.classList.add("!h-full", "!overflow-hidden");
          form.classList.add(
            "max-lg:!max-h-full",
            "max-lg:!overflow-y-auto",
            "scrollbar-none",
            "!h-full",
            "!py-8",
            "lg:!overflow-hidden"
          );

          form.querySelectorAll(":scope > [data-style-id]")?.forEach((childContainer) => {
            childContainer.classList.add("lg:!max-h-full", "lg:!overflow-y-auto", "scrollbar-none");
            childContainer?.style?.setProperty("position", "relative", "important");
            childContainer?.style?.setProperty("top", "unset", "important");
            childContainer?.style?.setProperty("height", "unset", "important");
            childContainer?.style?.setProperty("max-height", "unset", "important");
            if (childContainer.querySelector("[data-main-product-images]")) {
              childContainer?.classList.add("@container");
            }
          });

          section?.parentElement?.querySelectorAll("style")?.forEach((style) => {
            container.parentElement.prepend(style);
          });
          const sideContent = form?.querySelector('[x-ref="content"]');
          sideContent?.classList.add("max-h-full", "overflow-y-auto");

          form?.setAttribute("data-quick-view", "true");
          form?.classList?.remove(
            "px-container-xs",
            "px-container-sm",
            "px-container-md",
            "px-container-lg",
            "px-container-fullwidth"
          );
          form?.classList?.add("px-container-gutter");

          this.loading_container?.classList?.add("opacity-0", "pointer-events-none");
          container.innerHTML = (productData ? productData?.outerHTML : "") + section?.outerHTML;

          const stateElement = container.querySelector('[data-section-type="main_product"]');

          if ($data && bundleButton && stateElement) {
            stateElement
              .querySelectorAll('[data-block-type="quantity_selector"], [data-block-type="complementary_products"]')
              .forEach((el) => {
                el.remove();
              });

            stateElement.querySelectorAll(`[data-block-type="add_to_cart_button"]`).forEach((element) => {
              const clonedBundleButton = bundleButton.cloneNode(true);
              element.innerHTML = "";
              element.appendChild(clonedBundleButton);
            });

            Alpine.nextTick(() => {
              stateElement?._x_dataStack?.forEach((proxyState) => {
                if (proxyState?.card && proxyState?.bundle && proxyState?.state) {
                  proxyState.card = proxyState.state;
                  proxyState.bundle = $data.bundle;
                }
              });
            });
          }

          if (variantId) {
            Alpine.nextTick(() => {
              stateElement?._x_dataStack?.forEach((proxyState) => {
                if (proxyState?.state && proxyState.setSelectedVariant) {
                  proxyState.setSelectedVariant(+variantId);
                }
              });
            });
          }

          if (this.show_all_container) {
            this.show_all_container.innerHTML = `<button type="button" class="plain-link" @click="$quickView.show = false; barba.go('${window.location.origin}/products/${handle}')">Full details</a>`;
          }
        });
      });
    },
  });

  const quickViewStore = window.Alpine.store("quickView");

  const handleKeydown = (e) => {
    if (e.key === "Escape") {
      quickViewStore.show = false;
    }
  };

  window.Alpine.effect(() => {
    document.body.classList.toggle("!overflow-hidden", quickViewStore.show);

    if (quickViewStore.show) {
      document.addEventListener("keydown", handleKeydown);
    }
    if (!quickViewStore.show) {
      document.removeEventListener("keydown", handleKeydown);
      quickViewStore.dynamic_popups?.forEach((element) => {
        element.remove();
      });
      quickViewStore.dynamic_popups = [];
    }
  });
  window.Alpine.magic("quickView", () => quickViewStore);
  window._stores["quickView"] = quickViewStore;
};

document.addEventListener("alpine:init", initQuickView);

/* LAST HASH: f7f17bd5db8b4d1fff189ee88a48bdd1d54c722c */
;

})();

// ---- _scrollbar.js ----
(function(){
"use strict";
const _scrollbar = {
  init: (bar, thumb, scroll_speed = 150) => {
    const findScrollContainer = (element) => {
      return (
        (element?.parentElement?.querySelector('[x-ref="scrollContainer"]') || findScrollContainer(element.parentElement)) ??
        container
      );
    };

    const container = findScrollContainer(bar);

    const isHorizontal = () => {
      return !!(
        getComputedStyle(container).overflowY === "hidden" ||
        getComputedStyle(container).gridAutoFlow === "column" ||
        container.scrollWidth > container?.clientWidth
      );
    };

    const horizontal = isHorizontal();
    const state = window.Alpine.reactive({
      horizontal: horizontal,
      current_index: Math.max(
        1,
        horizontal
          ? Math.min(
              [...(container?.children ?? [])]?.filter(
                (child) => getComputedStyle(child).display !== "none" && getComputedStyle(child).scrollSnapAlign !== "none"
              ).length,
              [...(container?.children ?? [])]
                ?.filter(
                  (child) => getComputedStyle(child).display !== "none" && getComputedStyle(child).scrollSnapAlign !== "none"
                )
                .findIndex((child) => {
                  const center = container?.clientWidth / 2 + container?.scrollLeft;
                  const start =
                    container?.scrollLeft + +getComputedStyle(container).scrollPaddingLeft.replace("px", "").replace("auto", "0");

                  if (container?.children.length > Math.round((container?.scrollWidth / container?.clientWidth) * 100) / 100) {
                    return child.offsetLeft - 5 <= start && child.offsetLeft + child.clientWidth > start;
                  }
                  return child.offsetLeft < center && child.offsetLeft + child.clientWidth > center;
                }) + 1
            )
          : Math.min(
              [...(container?.children ?? [])]?.filter(
                (child) => getComputedStyle(child).display !== "none" && getComputedStyle(child).scrollSnapAlign !== "none"
              ).length,
              [...(container?.children ?? [])]
                ?.filter(
                  (child) => getComputedStyle(child).display !== "none" && getComputedStyle(child).scrollSnapAlign !== "none"
                )
                .findIndex((child) => {
                  const center = container?.clientHeight / 2 + container?.scrollTop;
                  const start =
                    container?.scrollTop + +getComputedStyle(container).scrollPaddingTop.replace("px", "").replace("auto", "0");

                  if (container?.children.length > Math.round((container?.scrollHeight / container?.clientHeight) * 100) / 100) {
                    return child.offsetTop - 5 <= start && child.offsetTop + child.clientHeight > start;
                  }
                  return child.offsetTop < center && child.offsetLeft + child.clientHeight > center;
                }) + 1
            ),
      ),
      pages: [...(container?.children ?? [])]?.filter(
        (child) => getComputedStyle(child).display !== "none" && getComputedStyle(child).scrollSnapAlign !== "none"
      ).length,
      width: (container?.clientWidth / container?.scrollWidth) * 100,
      height: (container?.clientHeight / container?.scrollHeight) * 100,
      left: ((container?.scrollLeft / container?.scrollWidth) * bar.clientWidth) / bar.clientWidth,
      top: ((container?.scrollTop / container?.scrollHeight) * bar.clientHeight) / bar.clientHeight,
      manual_scroll: false,
      no_next_page: horizontal
        ? container?.scrollLeft + container?.clientWidth + 25 >= container?.scrollWidth
        : container?.scrollTop + container?.clientHeight + 25 >= container?.scrollHeight,
    });

    const calculatePosition = () => {
      state.horizontal = isHorizontal();
      const children = [...(container?.children ?? [])]
        .filter((el) => el.tagName !== "STYLE")
        .filter((child) => getComputedStyle(child).display !== "none" && getComputedStyle(child).scrollSnapAlign !== "none")
        .toSorted((a, b) => +getComputedStyle(a).order - +getComputedStyle(b).order);

      if (state.horizontal) {
        state.current_index = Math.max(
          1,
          Math.min(
            children.length,
            children?.findIndex((child, i, arr) => {
              const center = container?.clientWidth / 2 + container?.scrollLeft;

              const start =
                container?.scrollLeft + parseFloat(getComputedStyle(container).scrollPaddingLeft.replace("auto", "0"));

              if (arr.length > Math.round((container?.scrollWidth / container?.clientWidth) * 100) / 100) {
                return child.offsetLeft - 5 <= start && child.offsetLeft + child.clientWidth > start;
              }
              return child.offsetLeft < center && child.offsetLeft + child.clientWidth > center;
            }) + 1 || children.length
          ),
        );
      }

      if (!state.horizontal) {
        state.current_index = Math.max(
          1,
          Math.min(
            children.length,
            children?.findIndex((child, i, arr) => {
              const center = container?.clientHeight / 2 + container?.scrollTop;

              const start = container?.scrollTop + parseFloat(getComputedStyle(container).scrollPaddingTop.replace("auto", "0"));

              if (arr.length > Math.round((container?.scrollHeight / container?.clientHeight) * 100) / 100) {
                return child.offsetTop - 5 <= start && child.offsetTop + child.clientHeight > start;
              }
              return child.offsetTop < center && child.offsetTop + child.clientHeight > center;
            }) + 1 || children.length
          ),
        );
      }

      state.pages = children?.filter((child) => getComputedStyle(child).display !== "none").length;
      state.width = container?.clientWidth / container?.scrollWidth;
      state.height = container?.clientHeight / container?.scrollHeight;
      state.left = ((container?.scrollLeft / container?.scrollWidth) * bar.clientWidth) / bar.clientWidth;
      state.top = ((container?.scrollTop / container?.scrollHeight) * bar.clientHeight) / bar.clientHeight;
      state.no_next_page =
        state.current_index === state.pages ||
        (state.horizontal
          ? container?.scrollLeft + container?.clientWidth + 25 >= container?.scrollWidth
          : container?.scrollTop + container?.clientHeight + 25 >= container?.scrollHeight);
    };

    const handleScrollBarClick = (e, content_slider) => {
      if (state.horizontal) {
        const percentage =
          (e.clientX - bar.getBoundingClientRect().left) / bar.clientWidth -
          ((state.width / 2) * bar.clientWidth) / bar.clientWidth;
        if (content_slider?.state) {
          content_slider.state.block_scroll_events = true;
        }
        container?.scrollTo({
          left: percentage * container?.scrollWidth,
          behavior: "instant",
        });
      }
      if (!state.horizontal) {
        const percentage =
          (e.clientY - bar.getBoundingClientRect().top) / bar.scrollHeight -
          ((state.height / 2) * bar.scrollHeight) / bar.scrollHeight;
        if (content_slider?.state) {
          content_slider.state.block_scroll_events = true;
        }
        container?.scrollTo({
          top: percentage * container?.scrollHeight,
          behavior: "instant",
        });
      }

      if (content_slider?.state) {
        content_slider.state.block_scroll_events = false;
      }

      calculatePosition();
    };

    const handleScrollThumbPointerDown = (e, content_slider) => {
      if (!container) return;
      container.style.scrollSnapType = "none";
      if (state.horizontal) {
        const startX = e.clientX;
        const startLeft = state.left * bar.clientWidth;
        document.body.classList.add("[&_*]:!cursor-grabbing");
        thumb.classList.add("active");
        if (content_slider?.state) {
          content_slider.state.block_scroll_events = true;
        }
        const handleDocumentPointerMove = (e) => {
          const percentage = Math.max(0, Math.min(1, (startLeft + e.clientX - startX) / bar.clientWidth));

          container?.scrollTo({
            left: percentage * container?.scrollWidth,
            behavior: "instant",
          });
          calculatePosition();
        };
        const handleDocumentPointerUp = (e) => {
          removeEventListeners();
        };

        const removeEventListeners = () => {
          document.body.classList.remove("[&_*]:!cursor-grabbing");
          thumb.classList.remove("active");
          container.style.scrollSnapType = "";
          document.removeEventListener("pointermove", handleDocumentPointerMove);
          document.removeEventListener("pointerup", handleDocumentPointerUp);
          if (content_slider?.state) {
            content_slider.state.block_scroll_events = false;
          }
        };

        document.addEventListener("pointermove", handleDocumentPointerMove);
        document.addEventListener("pointerup", handleDocumentPointerUp);
      }

      if (!state.horizontal) {
        const startY = e.clientY;
        const startTop = state.top * bar.scrollHeight;
        document.body.classList.add("[&_*]:!cursor-grabbing");
        thumb.classList.add("active");
        if (content_slider?.state) {
          content_slider.state.block_scroll_events = true;
        }
        const handleDocumentPointerMove = (e) => {
          const percentage = Math.max(0, Math.min(1, (startTop + e.clientY - startY) / bar.scrollHeight));

          container?.scrollTo({
            top: percentage * container?.scrollHeight,
            behavior: "instant",
          });
          calculatePosition();
        };
        const handleDocumentPointerUp = (e) => {
          removeEventListeners();
        };

        const removeEventListeners = () => {
          document.body.classList.remove("[&_*]:!cursor-grabbing");
          thumb.classList.remove("active");
          container.style.scrollSnapType = "";
          document.removeEventListener("pointermove", handleDocumentPointerMove);
          document.removeEventListener("pointerup", handleDocumentPointerUp);
          if (content_slider?.state) {
            content_slider.state.block_scroll_events = false;
          }
        };

        document.addEventListener("pointermove", handleDocumentPointerMove);
        document.addEventListener("pointerup", handleDocumentPointerUp);
      }
    };

    const handlePrevClick = (e, content_slider) => {
      if (!container) return;
      container.style.scrollSnapType = "none";
      if (content_slider?.state) {
        content_slider.state.block_scroll_events = true;
      }

      const activeChildren = [...(container?.children ?? [])]?.filter(
        (child) =>
          getComputedStyle(child).display !== "none" &&
          getComputedStyle(child).scrollSnapAlign !== "none" &&
          child.tagName !== "STYLE"
      );

      const index = Math.max(0, state.current_index - 2 < 0 ? activeChildren?.length - 1 : state.current_index - 2);

      const sortedActiveChildren = activeChildren?.toSorted((a, b) => +getComputedStyle(a).order - +getComputedStyle(b).order);

      sortedActiveChildren.forEach((child, i) => {
        child.classList.toggle("scroll-active", i === index);
      });

      if (state.horizontal) {
        utils.scrollToX(
          scroll_speed,
          (sortedActiveChildren[index]?.offsetLeft ?? 0) -
            +getComputedStyle(container).scrollPaddingLeft.replace("px", "").replace("auto", "0"),
          container,
          () => {
            container.style.scrollSnapType = "";
            calculatePosition();
            if (content_slider?.state) {
              content_slider.state.block_scroll_events = false;
              content_slider?.handleScroll();
              content_slider?.handleInfiniteScroll();
            }
          }
        );
      }
      if (!state.horizontal) {
        utils.scrollToY(
          scroll_speed,
          (sortedActiveChildren[index]?.offsetTop ?? 0) -
            +getComputedStyle(container).scrollPaddingTop.replace("px", "").replace("auto", "0"),
          container,
          () => {
            container.style.scrollSnapType = "";
            calculatePosition();
            if (content_slider?.state) {
              content_slider.state.block_scroll_events = false;
              content_slider?.handleScroll();
              content_slider?.handleInfiniteScroll();
            }
          }
        );
      }
    };

    const handleNextClick = (e, content_slider) => {
      if (!container) return;
      container.style.scrollSnapType = "none";
      if (content_slider?.state) {
        content_slider.state.block_scroll_events = true;
      }
      const activeChildren = [...(container?.children ?? [])]?.filter(
        (child) =>
          getComputedStyle(child).display !== "none" &&
          getComputedStyle(child).scrollSnapAlign !== "none" &&
          child.tagName !== "STYLE"
      );

      const sortedActiveChildren = activeChildren?.toSorted((a, b) => +getComputedStyle(a).order - +getComputedStyle(b).order);

      let found = false;
      const target =
        sortedActiveChildren.find((el) => {
          if (found) {
            el.classList.add("scroll-active");
            return true;
          }
          if (el.classList.contains("scroll-active")) {
            el.classList.remove("scroll-active");
            found = true;
          }
          return false;
        }) ?? sortedActiveChildren[1];

      if (state.horizontal) {
        utils.scrollToX(
          scroll_speed,
          (target?.offsetLeft ?? 0) - +getComputedStyle(container).scrollPaddingLeft.replace("px", "").replace("auto", "0"),
          container,
          () => {
            container.style.scrollSnapType = "";
            calculatePosition();
            if (content_slider?.state) {
              content_slider.state.block_scroll_events = false;
              content_slider?.handleScroll();
              content_slider?.handleInfiniteScroll();
            }
          }
        );
      }
      if (!state.horizontal) {
        utils.scrollToY(
          scroll_speed,
          (target?.offsetTop ?? 0) - +getComputedStyle(container).scrollPaddingTop.replace("px", "").replace("auto", "0"),
          container,
          () => {
            container.style.scrollSnapType = "";
            calculatePosition();
            if (content_slider?.state) {
              content_slider.state.block_scroll_events = false;
              content_slider?.handleScroll();
              content_slider?.handleInfiniteScroll();
            }
          }
        );
      }
    };

    container?.addEventListener("scroll", (e) => {
      calculatePosition();
    });

    const mutationObserver = new MutationObserver((e) => {
      calculatePosition();
    });

    mutationObserver.observe(container, {
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    const resizeObserver = new ResizeObserver((e) => {
      calculatePosition();
    });

    resizeObserver.observe(container, { box: "content-box" });

    calculatePosition();

    return {
      handleScrollBarClick,
      handleScrollThumbPointerDown,
      handlePrevClick,
      handleNextClick,
      scrollbar: state,
      containerRef: container,
    };
  },
  initScrollPagination: ($el) => {
    const findScrollContainer = (element) => {
      return element?.parentElement?.querySelector('[x-ref="scrollContainer"]') || findScrollContainer(element.parentElement);
    };
    const container = findScrollContainer($el);

    const content_slider = container
      ?.closest('[x-data*="initContentSlider"]')
      // @ts-ignore
      ?._x_dataStack?.find((state) => state["content_slider"])?.content_slider;

    return {
      containerRef: container,
      content_slider: content_slider ?? {},
    };
  },
};

window._scrollbar = _scrollbar;

/* LAST HASH: 2bada99b6d71d8e3779f0f3a7325ace1cfe4c202 */
;

})();

// ---- _smooth-scroll.js ----
(function(){
"use strict";
const initSmoothScroll = () => {
  const elements = new Set();

  const scrollToElementByTargetId = (id) => {
    let target = document.getElementById(id);
    if (!target) {
      return;
    }

    if (utils.isElementScrollable(target.parentElement) && utils.isVisible(target.parentElement) && utils.isInViewport(target)) {
      if (target.parentElement.scrollWidth > target.parentElement.offsetWidth) {
        utils.scrollToXY(260, target.offsetLeft, target.parentElement?.scrollTop, target.parentElement);
      }
      if (target.parentElement.scrollHeight > target.parentElement.offsetHeight) {
        utils.scrollToXY(260, target.parentElement?.scrollLeft, target.offsetTop, target.parentElement);
      }
      return;
    }

    if (target.hasAttribute("data-tab-id")) {
      target = target.closest(".shopify-section");
    }

    const targetPosition =
      utils.getElementPosition(target)?.top -
      Math.max(70, document.querySelector(".header-sections-container")?.getBoundingClientRect()?.bottom ?? 0);

    utils.scrollToY(70 + Math.min(Math.abs(Math.round((window.scrollY - targetPosition) / 15)), 500), targetPosition);
  };

  const initEvents = (target = document) => {
    const links = target.querySelectorAll(
      `:where([href*="#"],[data-href*="#"]):not([href*="#modal--"], [href*="#popup--"], [href*="#drawer--"], use)`
    );

    links.forEach((link) => {
      const href = link.href ?? link.getAttribute("data-href");

      if (typeof href !== "string") return;
      if (elements.has(link)) return;
      elements.add(link);
      if (utils.isExternalURL(href)) return;

      const id = href?.split("#")?.at(1)?.split(/[?&]/)?.at(0);
      const target = document.getElementById(id);

      if (!target) return;

      link.addEventListener(
        "click",
        (e) => {
          e.stopPropagation();
          scrollToElementByTargetId(id);
        },
        { capture: true }
      );
    });
  };

  const mutationObserver = new MutationObserver((e) => {
    e?.forEach((record) => {
      const nodes = [];

      if (record?.addedNodes?.length && record?.target instanceof Element) {
        initEvents(record.target);
      }
    });
  });
  mutationObserver.observe(document.body, { childList: true, subtree: true });

  if (window.location.hash) {
    scrollToElementByTargetId(window.location.hash.replace(/#/gi, ""));
  }

  initEvents();
};

document.addEventListener("alpine:init", initSmoothScroll);

/* LAST HASH: a0041974a6dee70e0a9314ae36b665602dbcb395 */
;

})();

// ---- _toast.js ----
(function(){
"use strict";
const initToast = () => {
  window.Alpine.store("toast", {
    toasts: [],
    paused: false,
    interval: null,
    addToast: function ({ type = "plain", target = "generic", timestamp = Date.now(), title, content, icon, hide = 0 }) {
      const defaultIcon = {
        plain: "bolt",
        warning: "warning-triangle",
        error: "error-circle",
        info: "info-circle",
        success: "check-circle",
      }[type];

      this.toasts.push({
        type,
        target,
        timestamp,
        title,
        content,
        icon: icon || defaultIcon,
        hide,
      });
      this.toasts = this.toasts.filter((a, i, arr) => arr.findIndex((b) => a.title === b.title && a.content === b.content) === i);
    },
    removeAllToasts: function () {
      this.toasts = [];
    },
    pauseRemoval: function () {
      this.paused = true;
      clearInterval(this.interval);
      this.interval = null;
    },
    continueRemoval: function () {
      this.paused = false;
    },
  });

  const toastStore = window.Alpine.store("toast");
  window.Alpine.magic("toast", () => toastStore);

  window.Alpine.effect(() => {
    if (toastStore.toasts.length && !toastStore.interval && !toastStore.paused) {
      toastStore.interval = setInterval(() => {
        const checkTimestamp = Date.now() - 4000;
        toastStore.toasts = toastStore.toasts.map((toast) => ({
          ...toast,
          hide: toast.timestamp < checkTimestamp ? Date.now() : 0,
        }));

        if (toastStore.toasts.every((toast) => toast.hide && toast.hide > 500)) {
          toastStore.toasts = [];
        }
      }, 500);
    }
    if (toastStore.interval && !toastStore.toasts.length) {
      clearInterval(toastStore.interval);
      toastStore.interval = null;
    }
  });
  window._stores["toast"] = toastStore;
};

document.addEventListener("alpine:init", initToast);

/* LAST HASH: 63df5b300a5b371fa0dda45320f25a83c336b804 */
;

})();

// ---- _tooltip.js ----
(function(){
"use strict";
const initTooltip = () => {
  const container = document.querySelector("[data-tooltip-container]");
  window.Alpine.store("tooltip", {
    tooltips: new Map(),
    async addTooltip(element, content, position = "top") {
      const currentTooltip = this.tooltips.get(element);
      if (!currentTooltip) {
        const parents = utils.findAllScrollableParents(element);
        const tooltipElement = document.createElement("div");
        tooltipElement.innerHTML = content;
        const abortController = new AbortController();
        const handleUpdateCoordinates = () => {
          const { top, left, right, width, height, bottom } = element.getBoundingClientRect();
          tooltipElement.classList.add("active");
          if (position === "top") {
            tooltipElement.style.top = `${top}px`;
            tooltipElement.style.left = `${left + width / 2}px`;
          }
          if (position === "bottom") {
            tooltipElement.style.top = `${bottom}px`;
            tooltipElement.style.left = `${left + width / 2}px`;
          }
          if (position === "left") {
            tooltipElement.style.top = `${top + height / 2}px`;
            tooltipElement.style.left = `${left}px`;
          }
          if (position === "right") {
            tooltipElement.style.top = `${top + height / 2}px`;
            tooltipElement.style.left = `${right}px`;
          }
        };

        this.tooltips.set(element, {
          tooltip: tooltipElement,
          timeout: null,
          handleUpdateCoordinates,
          scrollParents: parents,
          abortController,
        });
        container.appendChild(tooltipElement);
        tooltipElement.classList.add("tooltip", `tooltip--${position}`);
        await utils.delay(1);

        handleUpdateCoordinates();

        parents.forEach((parent) => {
          parent.addEventListener("scroll", handleUpdateCoordinates, { signal: abortController.signal });
        });
      }
      if (currentTooltip) {
        clearTimeout(currentTooltip.timeout);
        currentTooltip.timeout = null;
      }
    },
    async removeTooltip(element) {
      const currentTooltip = this.tooltips.get(element);

      if (currentTooltip) {
        currentTooltip.abortController?.abort?.();
        const tooltip = currentTooltip.tooltip;
        currentTooltip.timeout = setTimeout(async () => {
          tooltip.classList.remove("active");
          this.tooltips.delete(element);
          tooltip.ontransitionend = (event) => {
            tooltip.remove();
          };
        }, 50);
      }
    },
  });
  const tooltipStore = window.Alpine.store("tooltip");
  window.Alpine.magic("tooltip", () => tooltipStore);
  window._stores["tooltip"] = tooltipStore;
};

document.addEventListener("alpine:init", initTooltip);

/* LAST HASH: b1d11d03c43cf1897d8178e21d530bcd6b829efe */
;

})();

// ---- _theme.js ----
(function(){
"use strict";
const initTheme = () => {
  window.Alpine.store("editor", {
    load_section_id: "",
    unload_section_id: "",
    select_section_id: "",
    reorder_section_id: "",
    select_block_id: "",
    inspector: false,
    setValue(key, value) {
      this[key] = value;
    },
  });
  const editor = window.Alpine.store("editor");
  window.Alpine.magic("editor", () => editor);
  if (window.design_mode) {
    document.dispatchEvent(new CustomEvent("theme:editor:init"));
  }
  document.dispatchEvent(new CustomEvent("theme:init"));
  console.log("theme:init", performance.now());
};

document.addEventListener("alpine:init", initTheme);

/* LAST HASH: e43fe954326010349381dc737d464c85902728ad */
;

})();

// ---- __block--countdown.js ----
(function(){
"use strict";
const initCountDownTimer = function (
  $el,
  {
    type,
    end_date,
    end_time,
    timezone,
    duration_offset_hours,
    auto_refresh_hours,
    content,
    timer_expired_message,
    hide_if_expired,
    block_id,
  }
) {
  const state = window.Alpine.reactive({
    content: "",
    expired: false,
    interval: null,
    remaining: -1,
    target: Date.now(),
  });

  const tick = () => {
    const now = Date.now();
    const distance = state.target - now;

    if (distance <= 0) {
      // Auto-refresh for date-based mode
      if (type === "date" && auto_refresh_hours > 0) {
        const next = new Date(state.target + auto_refresh_hours * 3_600_000);
        if (next > new Date()) {
          state.target = next.getTime();
          return;
        }
      }

      clearInterval(state.interval);
      state.expired = true;
      state.content = timer_expired_message;
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    state.content = content
      .replace("[days]", String(days).padStart(2, "0"))
      .replace("[hours]", String(hours).padStart(2, "0"))
      .replace("[minutes]", String(minutes).padStart(2, "0"))
      .replace("[seconds]", String(seconds).padStart(2, "0"));
  };

  if (type === "date") {
    const offsetHours = timezone === "user" ? -(new Date().getTimezoneOffset() / 60) : parseFloat(timezone);

    const baseTarget = new Date(`${end_date}T${end_time}`);
    const baseTimestamp = baseTarget.getTime() - offsetHours * 3_600_000;

    let finalTarget = new Date(baseTimestamp);

    const now = Date.now();
    if (auto_refresh_hours > 0 && finalTarget.getTime() < now) {
      const interval = auto_refresh_hours * 3_600_000;
      const missed = Math.floor((now - finalTarget.getTime()) / interval) + 1;
      finalTarget = new Date(finalTarget.getTime() + missed * interval);
    }

    state.target = finalTarget.getTime();
  }

  if (type === "duration_offset") {
    const now = new Date();
    const cookieKey = `_countdown_${block_id}_${type}`;
    const stored = localStorage.getItem(cookieKey);
    const durationMs = duration_offset_hours * 3_600_000;
    const refreshMs = auto_refresh_hours * 3_600_000;

    let start = stored ? new Date(stored) : now;
    let target = new Date(start.getTime() + durationMs);

    if (stored && auto_refresh_hours > 0 && now > target) {
      const nextStart = new Date(target.getTime() + refreshMs);
      if (now > nextStart) {
        start = now;
        localStorage.setItem(cookieKey, start.toISOString());
        target = new Date(start.getTime() + durationMs);
      }
    }

    if (!stored) {
      localStorage.setItem(cookieKey, start.toISOString());
    }

    state.target = target.getTime();
  }

  state.interval = setInterval(() => tick(), 1000);
  tick();

  Alpine.effect(() => {
    if (state.expired) {
      switch (hide_if_expired) {
        case "section":
          $el.closest(".shopify-section")?.classList.add("!hidden");
          break;
        case "container":
          $el.closest(`[data-style-id]:not([data-style-id="${$el.getAttribute("data-style-id")}"])`)?.classList.add("!hidden");
          break;
        case "block":
          $el.classList.add("!hidden");
          break;
        case "none":
        default:
          break;
      }
    }
  });

  return {
    countdown: state,
  };
};

window._sections["initCountDownTimer"] = initCountDownTimer;

/* LAST HASH: c5e0675433287932972a006b6709a229e6db05f0 */
;

})();

// ---- __block--marquee.js ----
(function(){
"use strict";
const initMarqueeBar = ($el, duration) => {
  const handleMarqueeResize = () => {
    if ($el.children[0]?.children.length) {
      const initialChildren = [...$el.children[0].children];
      const initialChildren2 = [...$el.children[1].children];

      while ($el.children[0].clientWidth < $el.clientWidth) {
        initialChildren.forEach((child) => {
          const newChild = child.cloneNode(true);
          newChild.setAttribute("aria-hidden", "true");
          newChild.removeAttribute("data-shopify-editor-block");
          newChild.querySelectorAll("[data-shopify-editor-block]").forEach((element) => {
            element.removeAttribute("data-shopify-editor-block");
          });
          $el.children[0].appendChild(newChild);
        });
        initialChildren2.forEach((child) => {
          const newChild = child.cloneNode(true);
          newChild.removeAttribute("data-shopify-editor-block");
          newChild.querySelectorAll("[data-shopify-editor-block]").forEach((element) => {
            element.removeAttribute("data-shopify-editor-block");
          });
          $el.children[1].appendChild(newChild);
        });
      }

      $el.style.setProperty("--animate-duration", `${duration}`);
    }
  };

  return {
    handleMarqueeResize,
  };
};

window._sections["initMarqueeBar"] = initMarqueeBar;

/* LAST HASH: 8db23d8eb443219635909e0aa0008955e3caac9c */
;

})();

// ---- __block--parallax_image.js ----
(function(){
"use strict";
const initParallax = ($el) => {
  window._stores.scrollProgress.registerSection($el.closest(`.shopify-section`));

  const calculateParallax = (progress = 0, breakpoints) => {
    const points = breakpoints
      .split(",")
      .map((pair) => {
        const [p, v] = pair.trim().split(":").map(Number);
        return { progress: p, value: v };
      })
      .sort((a, b) => a.progress - b.progress);

    // Find two nearest points around current progress
    let start = points[0],
      end = points[points.length - 1];
    for (let i = 0; i < points.length - 1; i++) {
      if (progress >= points[i].progress && progress <= points[i + 1].progress) {
        start = points[i];
        end = points[i + 1];
        break;
      }
    }

    // Linear interpolation between start and end points
    const range = end.progress - start.progress;
    const factor = range === 0 ? 0 : (progress - start.progress) / range;
    const interpolated = start.value + (end.value - start.value) * factor;

    return interpolated;
  };

  return { calculateParallax };
};

window._sections["initParallax"] = initParallax;

/* LAST HASH: 5951c1481d290529ab1c8faca333dda321420c3d */
;

})();

// ---- __section--bundle.js ----
(function(){
"use strict";
const initBundle = ($el) => {
  const random_id = utils.shortUUID();
  const preorder_threshold = +(window.theme_settings.data__product__variant__preorder_threshold ?? 1);

  const bundle_products = [...$el.querySelectorAll("[data-product-handle][data-product-id]")]?.map((element) => ({
    element,
    ..._product.getHtmlProduct(element.getAttribute("data-product-handle")),
  }));

  const section_settings = utils.JSONParse($el.getAttribute("data-section-settings"));

  const select_settings = utils.JSONParse($el.querySelector("[data-select-settings]")?.getAttribute("data-select-settings"));

  const select_type = select_settings?.type ?? "auto";

  const bundle_targets = [...($el.querySelectorAll("[data-bundle-target]") ?? [])].map((el) =>
    utils.JSONParse(el.getAttribute("data-bundle-target")),
  );

  const initial_bundle_target_id = bundle_targets?.[0]?.id;
  const initial_target = {
    ...bundle_targets?.[0],
  };

  bundle_targets?.sort((a, b) => a.settings?.target - b?.settings?.target);

  const bundle_target_objects = bundle_targets?.reduce((acc, item, i) => {
    acc[item.id] = item.settings;
    return acc;
  }, {});

  const incentive_targets = [...($el.querySelectorAll("[data-bundle-incentive-target]") ?? [])].map((el) =>
    utils.JSONParse(el.getAttribute("data-bundle-incentive-target")),
  );

  const bundle_type = section_settings.bundle_target_type;

  const addToBundle = ({ product, variant, price }) => {
    if (variant?.inventory_management && variant?.inventory_policy !== "continue") {
      const quantity_added = state.items_added.reduce((acc, item) => {
        if (item?.variant?.id === variant.id) {
          acc += 1;
        }
        return acc;
      }, 0);

      if (variant.inventory_quantity - quantity_added < 1) {
        _stores.toast.addToast({
          type: "error",
          title: "Not enough inventory",
          content: "It looks like you already added the item and the inventory limit has been reached.",
        });
        return;
      }
    }

    if (section_settings.restrict_bundle_quantity === "hard_limit") {
      if (state?.[bundle_type] < state.bundle_target?.target) {
        state.items_added.push({ product, variant, price_override: price });
      }
      return;
    }

    if (section_settings.restrict_bundle_quantity === "upgrade_limit") {
      const lastBundleTarget = [...bundle_targets].sort((a, b) => a?.settings?.target - b?.settings?.target)?.at(-1);
      if (state?.[bundle_type] < lastBundleTarget?.settings?.target) {
        state.items_added.push({ product, variant, price_override: price });
      } else {
        _stores.toast.addToast({
          type: "warning",
          title: "Your Bundle is already complete!",
        });
        return;
      }
    }

    if (section_settings.restrict_bundle_quantity === "no_limit") {
      state.items_added.push({ product, variant, price_override: price });
    }

    updateBundleById();
  };

  const removeFromBundle = ({ product, variant }) => {
    const index = state.items_added?.findLastIndex((item) => item?.variant?.id === variant?.id && item.product.id === product.id);
    state.items_added.splice(index, 1);
  };

  const state = window.Alpine.reactive({
    items_added: [],
    bundle_target_titles: [],
    bundle_target_id: initial_bundle_target_id,
    total_price: 0,
    discounted_price: 0,
    current_wording: "",
    difference_wording: "",
    target_wording: "",
    final_price: 0,
    before_discounts_price: 0,
    target_discount_wording: "",
    active_target_discount_wording: "",
    discount_wording: "",
    active_discount_wording: "",
    item_count: 0,
    target_difference: "",
    bundle_target: initial_target?.settings,
    achieved_bundle_target: null,
    incentive_target: incentive_targets?.[0],
    isAdding: false,
    items_added_to_cart: false,
    show_mobile_details: false,
    addToBundle: addToBundle,
    removeFromBundle: removeFromBundle,
    item_added_summary: [],
  });

  const getTargetTitles = () => {
    return bundle_targets?.map((item) => {
      const lowestPrice = Math.min(...bundle_products.map((product) => product.price_min));
      const highestPrice = Math.max(...bundle_products.map((product) => product.price_max ?? product.price));
      const priceVaries = (state?.final_price || lowestPrice) !== (state?.total_price || highestPrice);

      return item.label?.trim()
        ? `<span class="flex gap-2 w-full items-center">${utils.unescape(
            item.label
              ?.replace(
                "[price]",
                `<span>${utils.formatMoney(
                  state?.final_price ||
                    (lowestPrice -
                      ((item?.settings?.discount_percentage ?? 0) / 100) * lowestPrice -
                      (item?.settings?.discount_amount ?? 0)) *
                      (section_settings?.bundle_target_type === "item_count" ? item.settings?.target : 1)
                )}</span>`,
              )
              .replace(
                "[compare_at_price]",
                `<span class="opacity-50 line-through">${utils.formatMoney(
                  state?.total_price ||
                    lowestPrice * (section_settings?.bundle_target_type === "item_count" ? item.settings?.target : 1)
                )}</span>`,
              ),
          )}</span>`
        : `<span class="flex items-center gap-2">
       ${
         section_settings?.bundle_target_type === "total_price" && item.settings?.target
           ? `<span>Spend ${utils.formatMoney(item.settings?.target)}</span>`
           : ""
       }
       ${
         section_settings?.bundle_target_type === "item_count"
           ? `<span>${item.settings?.target} ${item.settings?.target === 1 ? "item" : "items"}</span>`
           : ""
       }
       ${
         item?.settings?.discount_percentage > 0 && select_settings?.discount_label?.trim()
           ? `<span class="${select_settings?.discount_label}">${item?.settings?.discount_percentage}% off</span>`
           : ""
       }
       ${
         item?.settings?.discount_amount > 0 && select_settings?.discount_label?.trim()
           ? `<span class="${select_settings?.discount_label}">${utils.formatMoney(
               item?.settings?.discount_percentage
             )} off</span>`
           : ""
       }
       ${
         select_settings?.price_content
           ? `<span class="flex-1 flex justify-end gap-2">
           ${select_settings?.price_content
             ?.replace(
               "[price]",
               `<span>${utils.formatMoney(
                 state?.final_price ||
                   (lowestPrice -
                     ((item?.settings?.discount_percentage ?? 0) / 100) * lowestPrice -
                     (item?.settings?.discount_amount ?? 0)) *
                     (section_settings?.bundle_target_type === "item_count" ? item.settings?.target : 1)
               )}</span>`,
             )
             .replace(
               "[compare_at_price]",
               priceVaries
                 ? `<span class="opacity-50 line-through">${utils.formatMoney(
                     state?.total_price ||
                       lowestPrice * (section_settings?.bundle_target_type === "item_count" ? item.settings?.target : 1)
                   )}</span>`
                 : ""
             )}`
           : ""
       }
      </span>`
            ?.replace(/\n/gi, "")
            .trim();
    });
  };

  state.bundle_target_titles = getTargetTitles();

  window.Alpine.effect(() => {
    state.item_count = state.items_added?.length;
    state.total_price = state.items_added.reduce((acc, item) => (acc += item?.price_override ?? item.variant?.price), 0);

    state.achieved_bundle_target = [...bundle_targets]
      .sort((a, b) => b.settings?.target - a?.settings?.target)
      ?.find((bundle) => bundle.settings.target <= state?.[bundle_type])?.settings;

    if (select_type === "auto") {
      state.bundle_target = [...bundle_targets]
        .sort((a, b) => a.settings?.target - a?.settings?.target)
        .find((bundle) => bundle.settings.target > state?.[bundle_type])?.settings;
    }

    state.discounted_price =
      state.total_price -
      (state.achieved_bundle_target?.discount_amount ?? 0) -
      state.total_price * ((state?.achieved_bundle_target?.discount_percentage ?? 0) / 100);

    state.before_discounts_price = state.total_price;

    state.final_price = state.discounted_price;

    state.target_difference =
      bundle_type === "item_count"
        ? state.bundle_target?.target - state.item_count > 0
          ? `${state.bundle_target?.target - state.item_count}`
          : ""
        : state.bundle_target?.target - state.total_price
        ? `${utils.formatMoney(state.bundle_target?.target - state.item_count)}`
        : "";

    state.target_wording =
      bundle_type === "item_count" ? `${state.bundle_target?.target}` : utils.formatMoney(state.bundle_target?.target);

    state.current_wording = bundle_type === "item_count" ? `${state.item_count}` : utils.formatMoney(state.total_price);

    state.difference_wording =
      bundle_type === "item_count"
        ? `${state.bundle_target?.target - state.item_count}`
        : utils.formatMoney(state.bundle_target?.target - state.total_price);

    state.target_discount_wording = state.bundle_target?.discount_amount
      ? `Save ${utils.formatMoney(state.bundle_target?.discount_amount)}`
      : state?.bundle_target?.discount_percentage
      ? `${state?.bundle_target?.discount_percentage}% off`
      : "";

    state.discount_wording = `${utils.roundToIndex((1 - state.final_price / state.total_price) * 100, 0)}% off`;

    state.active_target_discount_wording = state.total_price > state.final_price ? state.target_discount_wording : "";

    state.active_discount_wording = state.total_price > state.final_price ? state.discount_wording : "";

    state.item_added_summary = state?.items_added?.reduce((acc, item) => {
      const addedIndex = acc.findIndex((item2) => item?.variant?.id === item2?.variant?.id);
      if (addedIndex !== -1 && item.price_override === acc[addedIndex]["price_override"]) {
        acc[addedIndex]["quantity"] += 1;
      } else {
        acc.push({
          quantity: 1,
          price: item.variant?.price,
          compare_at_price: item.variant?.compare_at_price,
          ...item,
        });
      }
      return acc;
    }, []);

    state.bundle_target_titles = getTargetTitles();
  });

  const updateBundleById = (bundle_id = state.bundle_target_id) => {
    state.bundle_target_id = bundle_id;
    if (state.bundle_target_id || state.items_added?.length) {
      state.bundle_target = bundle_targets.find((target) => {
        if (bundle_type === "item_count") {
          return target.id === state.bundle_target_id && target.settings.target >= state.items_added?.length;
        } else {
          return target.id === state.bundle_target_id;
        }
      })?.settings;

      if (!state.bundle_target && bundle_targets?.length) {
        const bundle_target =
          [...bundle_targets]
            .sort((a, b) => a.settings.target - b.settings.target)
            .find((target) => {
              if (bundle_type === "item_count") {
                return target.settings.target >= state.items_added?.length;
              } else {
                return true;
              }
            }) ?? [...bundle_targets].sort((a, b) => b.settings.target - a.settings.target)?.[0];

        state.bundle_target = bundle_target?.settings;
        state.bundle_target_id = bundle_target?.id;
      }
    }
  };

  const handleAddToCart = async (action) => {
    try {
      state.isAdding = true;
      const data = await _cart.add({
        items: state.items_added?.map((item) => {
          return {
            id: item?.variant?.id,
            properties: {
              _bundle_id: random_id,
              Bundle: state.achieved_bundle_target?.label,
              Preorder:
                item?.variant?.preorder && item?.variant?.inventory_quantity < preorder_threshold
                  ? item?.variant?.preorder_date
                    ? `Shipping ${new Date(item?.variant.preorder_date).toLocaleDateString(navigator.language, {
                        month: "short",
                        year: "numeric",
                      })}`
                    : "true"
                  : undefined,
            },
            quantity: 1,
          };
        }),
      });
      if (data.cart_error) {
        state.isAdding = false;
        return;
      }

      if (action === "add_to_cart") {
        _stores.modal.setId("modal--cart-drawer");
      }

      if (action === "checkout") {
        document.querySelector('[data-cart-drawer-checkout-form] button[name="checkout"]')?.click();

        state.isAdding = false;
        state.items_added_to_cart = true;
        await utils.delay(3500);
        state.items_added_to_cart = false;
        return;
      }

      state.items_added = [];
      state.bundle_target_id = bundle_targets?.[0]?.id;
      state.total_price = 0;
      state.discounted_price = 0;
      state.final_price = 0;
      state.discount_wording = "";
      state.item_count = 0;
      state.target_difference = "";
      state.bundle_target = bundle_targets?.[0]?.settings;
      state.achieved_bundle_target = null;
      state.incentive_target = incentive_targets?.[0];
      state.isAdding = false;
      state.show_mobile_details = false;
      state.items_added_to_cart = true;
      await utils.delay(3500);
      state.items_added_to_cart = false;
    } catch (error) {
      /*console.log(error);*/
    }
  };

  const getDynamicText = (content) => {
    return utils.getBracketInputDynamicPluralizedText(content, state);
  };

  const getDynamicValue = (content) => {
    return utils.getBracketInputDynamicValue(content, state);
  };

  const getDynamicValueWithFallbacks = (content) => {
    return content.split(",")?.reduce((acc, item) => {
      acc ||= utils.getBracketInputDynamicValue(item.trim(), state);
      return acc;
    }, "");
  };

  const showConditionally = (show_conditionally) => {
    switch (show_conditionally) {
      case "always": {
        return true;
      }
      case "active_discount": {
        return !!state.active_discount_wording;
      }
      case "no_active_discount": {
        return !state.active_discount_wording;
      }
      case "target_reached": {
        return !state.target_difference;
      }
      case "target_not_reached": {
        return !!state.target_difference;
      }
    }
  };

  return {
    bundle: state,
    bundle_targets,
    bundle_target_objects,
    incentive_targets,
    section_settings,
    bundle_type,
    addToBundle,
    removeFromBundle,
    updateBundleById,
    handleAddToCart,
    getDynamicValue,
    getDynamicValueWithFallbacks,
    getDynamicText,
    showConditionally,
  };
};

// export type BundleState = ReturnType<InitBundle>["bundle"];

window._sections["initBundle"] = initBundle;

/* LAST HASH: 747f12e1b129d70566a8fc60e6e5b99139673198 */
;

})();

// ---- __section--card_article_card.js ----
(function(){
"use strict";
const initArticleCard = ($el, $refs, articleHandle) => {
  const random_id = utils.shortUUID();

  const article =
    _articles[articleHandle] || utils.JSONParse(document.querySelector(`[data-article-data="${articleHandle}"]`)?.innerHTML);

  const state = window.Alpine.reactive({
    random_id,
    hydrated: true,
    ...(article ?? {}),
    url: article?.url ?? `/blogs/${article?.handle}`,
  });

  if (article) {
    setTimeout(() => {
      $el.querySelectorAll("[x-ignore]:not([x-defer])").forEach((child) => {
        if (!document.contains(child)) return;
        utils.initializeIgnoredAlpineTree(child);
      });
    }, 2);
  }

  return {
    card: state,
    $el,
    ...utils.spreadGenericCardFunctions(state),
  };
};

const hydrateArticleCard = utils.hydrateCard("article");

window._sections["initArticleCard"] = initArticleCard;
window._sections["hydrateArticleCard"] = hydrateArticleCard;

/* LAST HASH: a89dcb7ce15bc3e230264e628bb4fc8e54900684 */
;

})();

// ---- __section--card_blog_card.js ----
(function(){
"use strict";
const initBlogCard = ($el, $refs, blogHandle) => {
  const random_id = utils.shortUUID();

  const blog = _blogs[blogHandle] || utils.JSONParse(document.querySelector(`[data-blog-data="${blogHandle}"]`)?.innerHTML);

  const state = window.Alpine.reactive({
    random_id,
    hydrated: true,
    ...(blog ?? {}),
    url: blog?.url ?? `/blogs/${blog?.handle}`,
  });

  if (blog) {
    setTimeout(() => {
      $el.querySelectorAll("[x-ignore]:not([x-defer])").forEach((child) => {
        if (!document.contains(child)) return;
        utils.initializeIgnoredAlpineTree(child);
      });
    }, 2);
  }

  return {
    card: state,
    $el,
    ...utils.spreadGenericCardFunctions(state),
  };
};

const hydrateBlogCard = utils.hydrateCard("blog");

window._sections["initBlogCard"] = initBlogCard;
window._sections["hydrateBlogCard"] = hydrateBlogCard;

/* LAST HASH: 1049c4046eff98760882d66182cdc862d449d120 */
;

})();

// ---- __section--card_collection_card.js ----
(function(){
"use strict";
const initCollectionCard = ($el, $refs, collectionHandle) => {
  const random_id = utils.shortUUID();

  const collection =
    _collections[collectionHandle] ||
    utils.JSONParse(document.querySelector(`[data-collection-data="${collectionHandle}"]`)?.innerHTML);

  const state = window.Alpine.reactive({
    random_id,
    hydrated: true,
    ...(collection ?? {}),
    url: collection?.url ?? `/collection/${collection?.handle}`,
  });

  if (collection) {
    setTimeout(() => {
      $el.querySelectorAll("[x-ignore]:not([x-defer])").forEach((child) => {
        if (!document.contains(child)) return;
        utils.initializeIgnoredAlpineTree(child);
      });
    }, 2);
  }

  return {
    card: state,
    $el,
    ...utils.spreadGenericCardFunctions(state),
  };
};

const hydrateCollectionCard = utils.hydrateCard("collection");

window._sections["initCollectionCard"] = initCollectionCard;
window._sections["hydrateCollectionCard"] = hydrateCollectionCard;

/* LAST HASH: 96047c7a7a61a338c6a84f6d0c7aa0948047b4ae */
;

})();

// ---- __section--card_comment_card.js ----
(function(){
"use strict";
const initCommentCard = ($el, $refs, commentId) => {
  const random_id = utils.shortUUID();

  const comment =
    _comments[commentId] || utils.JSONParse(document.querySelector(`[data-comment-data="${commentId}"]`)?.innerHTML);

  const state = window.Alpine.reactive({
    random_id,
    hydrated: true,
    ...(comment ?? {}),
    url: comment?.url,
  });

  if (comment) {
    setTimeout(() => {
      $el.querySelectorAll("[x-ignore]:not([x-defer])").forEach((child) => {
        if (!document.contains(child)) return;
        utils.initializeIgnoredAlpineTree(child);
      });
    }, 2);
  }

  return {
    card: state,
    $el,
    ...utils.spreadGenericCardFunctions(state),
  };
};

const hydrateCommentCard = utils.hydrateCard("comment");

window._sections["initCommentCard"] = initCommentCard;
window._sections["hydrateCommentCard"] = hydrateCommentCard;

/* LAST HASH: a1e2e9b98dcc848ed9f8e968779c3f8894e6e40c */
;

})();

// ---- __section--card_line_item_card.js ----
(function(){
"use strict";
const initLineItemCard = ($el, lineItemKey) => {
  const random_id = utils.shortUUID();

  const cart = Alpine.store("cart");

  const lineItem = Shopify.designMode
    ? cart.state.items.find((item) => item.key === lineItemKey) ??
      cart.state.items.find((item) => !!item?.properties?._p_id) ??
      cart.state.items.find((item) => !item?.properties?._p_id_link && !item?.properties?._p_hidden) ??
      cart.state.items[0]
    : cart.state.items.find((item) => item.key === lineItemKey);

  const children = lineItem?.properties?._p_id
    ? cart.state.items
        .filter((child) => child?.properties?._p_id_link === lineItem?.properties?._p_id && child.quantity)
        ?.map((child) => {
          let product = _products[child?.handle];

          if (!product) {
            _product.getProductData(child?.handle, child?.product_id).then((prod) => {
              const index = state.children.findIndex((line) => line.line_item?.key === child?.key);
              if (index !== -1) {
                state.children[index] = {
                  line_item: child,
                  product: prod,
                  variant: prod?.variants?.find((variant) => variant.id === child?.variant_id),
                };
              }
            });
          }
          product ??= _products[child?.handle];

          const variant = product?.variants?.find((variant) => variant.id === child?.variant_id);

          return {
            line_item: child,
            product,
            variant,
          };
        })
    : [];

  let product = _products[lineItem?.handle];

  if (!product) {
    _product.getProductData(lineItem?.handle, lineItem?.product_id).then((prod) => {
      state.product = prod;
      state.variant = prod?.variants?.find((variant) => variant.id === lineItem?.variant_id);
      state.hydrated = true;
    });
  }
  product ??= _products[lineItem?.handle];

  const variant = product?.variants?.find((variant) => variant.id === lineItem?.variant_id);

  const selling_plan = lineItem?.selling_plan_allocation?.selling_plan ?? variant?.selling_plan_allocations?.[0]?.selling_plan;

  const selling_plan_discount_wording = selling_plan?.price_adjustments?.[0]?.value
    ? selling_plan?.price_adjustments?.[0]?.value_type === "fixed_amount"
      ? `${utils.formatMoney(selling_plan?.price_adjustments?.[0]?.value * lineItem.quantity)}`
      : selling_plan?.price_adjustments?.[0]?.value_type === "percentage"
      ? `${selling_plan?.price_adjustments?.[0]?.value}%`
      : ""
    : "";

  const state = window.Alpine.reactive({
    random_id,
    subscriptionIsChanging: false,
    hydrated: !!variant,
    line_item: lineItem,
    initial_quantity: lineItem.quantity,
    product: product,
    variant: variant,
    selling_plan_discount_wording,
    url: lineItem?.url,
    children: [...children],
    price: lineItem?.final_price,
    compare_at_price: Math.max(
      lineItem?.original_price ?? 0,
      variant?.compare_at_price ?? 0,
      lineItem?.selling_plan_allocation?.compare_at_price ?? 0
    ),
    bundle_price:
      lineItem?.final_price +
      (children?.reduce(
        (acc, child) => (acc += child?.line_item?.final_price * (child?.line_item?.quantity / lineItem.quantity) || 0),
        0
      ) || 0),
    bundle_compare_at_price:
      Math.max(
        lineItem?.original_price ?? 0,
        variant?.compare_at_price ?? 0,
        lineItem?.selling_plan_allocation?.compare_at_price ?? 0
      ) +
      (children?.reduce(
        (acc, child) =>
          (acc += Math.max(
            child?.line_item?.original_price * (child?.line_item?.quantity / lineItem.quantity) || 0,
            child?.variant?.compare_at_price * (child?.line_item?.quantity / lineItem.quantity) || 0,
            child?.line_item?.selling_plan_allocation?.compare_at_price * (child?.line_item?.quantity / lineItem.quantity) || 0
          )),
        0
      ) || 0),
    quantity_limit: !children?.length
      ? Math.min(
          variant?.inventory_management === "shopify" && variant?.inventory_policy === "deny"
            ? variant?.inventory_quantity -
                cart.state.items.reduce(
                  (acc, line) => (acc += line.variant_id === variant?.id && line.key !== lineItem.key ? line.quantity : 0),
                  0
                )
            : variant?.preorder && variant?.preorder_quantity
            ? variant?.inventory_quantity +
              variant?.preorder_quantity -
              cart?.state?.items?.reduce((acc, line) => (line.variant_id === variant.id ? acc + line.quantity : acc), 0)
            : 99999
        )
      : Math.min(
          variant?.inventory_management === "shopify" && variant?.inventory_policy === "deny"
            ? variant?.inventory_quantity
            : 9999,
          ...children.map((child) => {
            const quantity_ratio = child.line_item.quantity / lineItem?.quantity;

            return child?.variant?.inventory_management === "shopify" && child?.variant?.inventory_policy === "deny"
              ? Math.floor(
                  (child?.variant?.inventory_quantity -
                    cart.state.items.reduce(
                      (acc, line) =>
                        (acc += line.variant_id === child?.variant?.id && line.key !== child.line_item.key ? line.quantity : 0),
                      0
                    )) /
                    quantity_ratio
                )
              : 9999;
          })
        ),
  });

  const setSubscription = async (selling_plan_id) => {
    state.subscriptionIsChanging = true;
    const p_id = state.line_item?.properties?._p_id;
    const key = state?.line_item?.key;
    const quantity = state?.line_item?.quantity;

    const getUpdateAbleChildren = async (id) => {
      const children = [];
      for (const child of cart.state.items) {
        if (child?.properties?._p_id_link !== id) continue;
        let product = _products[child?.handle];

        if (!product) {
          await _product.getProductData(child?.handle, child?.product_id);
        }
        product ??= _products[child?.handle];

        const variant = product?.variants?.find((variant) => variant.id === child?.variant_id);
        if (
          (!selling_plan_id && child.selling_plan_allocation?.selling_plan?.id) ||
          (variant?.selling_plan_allocations?.some((plan) => plan?.selling_plan?.id === selling_plan_id) &&
            child.selling_plan_allocation?.selling_plan?.id !== selling_plan_id)
        ) {
          children.push({
            line_item: child,
            product,
            variant,
          });
        }
      }
      return children;
    };

    if (p_id) {
      while ((await getUpdateAbleChildren(p_id))?.length) {
        const firstChild = (await getUpdateAbleChildren(p_id))[0];
        await _cart.change({
          id: firstChild.line_item.key,
          selling_plan: +selling_plan_id,
          quantity: firstChild?.line_item.quantity,
        });
      }
      const mainItem = cart.state.items?.find((item) => item?.properties?._p_id === p_id);
      await _cart.change({ id: mainItem.key, selling_plan: +selling_plan_id, quantity: mainItem.quantity });
    }

    if (!p_id) {
      await _cart.change({ id: key, selling_plan: +selling_plan_id, quantity: quantity });
    }

    state.subscriptionIsChanging = false;
  };

  const showConditionally = (condition) => {
    switch (condition) {
      case "no_addon_products":
        return !state.children?.length;
      case "addon_products":
        return !!state.children?.length;
      case "always": {
        return true;
      }
      case "with_subscriptions": {
        return !!state.line_item?.selling_plan_allocation?.selling_plan?.id;
      }
      case "no_subscriptions": {
        return !state.line_item?.selling_plan_allocation?.selling_plan?.id;
      }
      case "with_variants": {
        return state?.product?.variants?.length > 1;
      }
      case "no_variants": {
        return state?.product?.variants?.length <= 1;
      }
    }
  };

  Alpine.effect(() => {
    const lineItem = Shopify.designMode
      ? cart.state.items.find((item) => item.key === lineItemKey) ??
        cart.state.items.find((item) => !!item?.properties?._p_id) ??
        cart.state.items.find((item) => !item?.properties?._p_id_link && !item?.properties?._p_hidden) ??
        cart.state.items[0]
      : cart.state.items.find((item) => item.key === lineItemKey) ?? state.line_item;

    if (!utils.deepEqual(lineItem, state.line_item)) {
      state.line_item = lineItem;
    }
  });

  Alpine.effect(() => {
    const selling_plan =
      state?.line_item?.selling_plan_allocation?.selling_plan ?? state?.variant?.selling_plan_allocations?.[0]?.selling_plan;

    state.selling_plan_discount_wording = selling_plan?.price_adjustments?.[0]?.value
      ? selling_plan?.price_adjustments?.[0]?.value_type === "fixed_amount"
        ? `${utils.formatMoney(selling_plan?.price_adjustments?.[0]?.value * state?.line_item?.quantity)}`
        : selling_plan?.price_adjustments?.[0]?.value_type === "percentage"
        ? `${selling_plan?.price_adjustments?.[0]?.value}%`
        : ""
      : "";
  });

  Alpine.effect(() => {
    if (!state.line_item) return;
    state.children = state?.line_item?.properties?._p_id
      ? cart.state.items
          .filter((child) => child?.properties?._p_id_link === state?.line_item?.properties?._p_id && child.quantity)
          ?.map((child) => {
            let product = _products[child?.handle];

            if (!product) {
              _product.getProductData(child?.handle, child?.product_id).then((prod) => {
                const index = state.children.findIndex((line) => line.line_item?.key === child?.key);
                if (index !== -1) {
                  state.children[index] = {
                    line_item: child,
                    product: prod,
                    variant: prod?.variants?.find((variant) => variant.id === child?.variant_id),
                  };
                }
              });
            }
            product ??= _products[child?.handle];

            const variant = product?.variants?.find((variant) => variant.id === child?.variant_id);

            return {
              line_item: child,
              product,
              variant,
            };
          })
      : [];

    state.price = state.line_item?.final_price;
    state.compare_at_price = Math.max(
      state.line_item?.original_price ?? 0,
      state.variant?.compare_at_price ?? 0,
      state.line_item?.selling_plan_allocation?.compare_at_price ?? 0
    );
    state.bundle_price =
      state.line_item?.final_price +
      (state.children?.reduce(
        (acc, child) => (acc += child?.line_item?.final_price * (child?.line_item?.quantity / state.line_item.quantity) || 0),
        0
      ) || 0);
    state.bundle_compare_at_price =
      Math.max(
        state.line_item?.original_price ?? 0,
        state.variant?.compare_at_price ?? 0,
        state.line_item?.selling_plan_allocation?.compare_at_price ?? 0
      ) +
      (state.children?.reduce(
        (acc, child) =>
          (acc += Math.max(
            child?.line_item?.original_price * (child?.line_item?.quantity / state.line_item.quantity) || 0,
            child?.variant?.compare_at_price * (child?.line_item?.quantity / state.line_item.quantity) || 0,
            child?.line_item?.selling_plan_allocation?.compare_at_price *
              (child?.line_item?.quantity / state.line_item.quantity) || 0
          )),
        0
      ) || 0);

    state.quantity_limit = !state.children?.length
      ? Math.min(
          state.variant?.inventory_management === "shopify" && state.variant?.inventory_policy === "deny"
            ? state.variant?.inventory_quantity -
                cart.state.items.reduce(
                  (acc, line) =>
                    (acc += line.variant_id === state.variant?.id && line.key !== state?.line_item?.key ? line.quantity : 0),
                  0
                )
            : state.variant?.preorder && state.variant?.preorder_quantity
            ? state.variant?.inventory_quantity +
              state.variant?.preorder_quantity -
              cart?.state?.items?.reduce((acc, line) => (line.variant_id === state.variant.id ? acc + line.quantity : acc), 0)
            : 99999
        )
      : Math.min(
          state.variant?.inventory_management === "shopify" && state.variant?.inventory_policy === "deny"
            ? state.variant?.inventory_quantity
            : 9999,
          ...state.children.map((child) => {
            const quantity_ratio = child.line_item.quantity / state.line_item?.quantity;

            return child?.variant?.inventory_management === "shopify" && child?.variant?.inventory_policy === "deny"
              ? Math.floor(
                  (child?.variant?.inventory_quantity -
                    cart.state.items.reduce(
                      (acc, line) =>
                        (acc += line.variant_id === child?.variant?.id && line.key !== child.line_item.key ? line.quantity : 0),
                      0
                    )) /
                    quantity_ratio
                )
              : 9999;
          })
        );
  });

  return {
    line_card: state,
    $el,
    ...utils.spreadGenericCardFunctions(state),
    showConditionally,
    setSubscription,
  };
};

const hydrateLineItemCard = utils.hydrateCard("line-item");

window._sections["initLineItemCard"] = initLineItemCard;
window._sections["hydrateLineItemCard"] = hydrateLineItemCard;

/* LAST HASH: 0a9766402b69ef6269e054fdf1450cc2571ec99e */
;

})();

// ---- __section--card_page_card.js ----
(function(){
"use strict";
const initPageCard = ($el, $refs, pageHandle) => {
  const random_id = utils.shortUUID();

  const page = _pages[pageHandle] || utils.JSONParse(document.querySelector(`[data-page-data="${pageHandle}"]`)?.innerHTML);

  const state = window.Alpine.reactive({
    random_id,
    hydrated: true,
    ...(page ?? {}),
    url: page?.url ?? `/pages/${page?.handle}`,
  });

  if (page) {
    setTimeout(() => {
      $el.querySelectorAll("[x-ignore]:not([x-defer])").forEach((child) => {
        if (!document.contains(child)) return;
        utils.initializeIgnoredAlpineTree(child);
      });
    }, 2);
  }

  return {
    card: state,
    $el,
    ...utils.spreadGenericCardFunctions(state),
  };
};

const hydratePageCard = utils.hydrateCard("page");

window._sections["initPageCard"] = initPageCard;
window._sections["hydratePageCard"] = hydratePageCard;

/* LAST HASH: ca3774d7873255c92cf8b804c954c9f9c62e447d */
;

})();

// ---- __section--card_product_card.js ----
(function(){
"use strict";
const initProductCard = ($el, $refs, productHandle, productId, variantId, default_select_selling_plan = false) => {
  let initialized = false;
  const random_id = utils.shortUUID();
  const addon_target = $el
    .closest(".shopify-section")
    ?.querySelector(`form[data-product-handle="${$el.getAttribute("data-addon-product-target")}"]`);

  const addon_auto_add = $el.hasAttribute("data-addon-auto-add");
  const addon_bundle_in_cart = $el.hasAttribute("data-addon-cart-bundle");
  const preorder_threshold = +(window.theme_settings.data__product__variant__preorder_threshold ?? 1);

  const cart = window.Alpine.store("cart");

  const gallery = $el.querySelector(`[data-product-card-gallery]`);
  const gallerySettings = utils.JSONParse(gallery?.getAttribute("data-settings"));

  const option_blocks = [
    ...($el.querySelectorAll("[data-options-block]")?.length
      ? $el.querySelectorAll("[data-options-block]")
      : $el.querySelector("template")?.content?.querySelectorAll("[data-options-block]") ?? []),
  ].map((block) => utils.JSONParse(block.getAttribute("data-options-block")));

  let product = _products[productHandle] ?? _product.getHtmlProduct(productHandle);

  if (!product && productHandle) {
    _product.getProductData(productHandle, productId).then((res) => {
      updateProductState(res, variantId);
    });
  }

  product ??= _products[productHandle];

  if (product && !product._full_data) {
    _product.getHydratedProductData(productHandle, productId).then((res) => {
      if (state.product?.handle === res.handle) {
        state.product = res;
      }
    });
  }

  const selected_variant = _product.getSelectedVariant(product, variantId);

  const selling_plan_allocations = selected_variant?.selling_plan_allocations;
  const selected_selling_plan =
    default_select_selling_plan || product?.requires_selling_plan ? selling_plan_allocations?.[0]?.selling_plan : null;
  const selling_plan_discount_wording = +selected_selling_plan?.price_adjustments?.[0]?.value
    ? selected_selling_plan?.price_adjustments?.[0]?.value_type === "fixed_amount"
      ? `${utils.formatMoney(selected_selling_plan?.price_adjustments?.[0]?.value)}`
      : selected_selling_plan?.price_adjustments?.[0]?.value_type === "percentage"
      ? `${selected_selling_plan?.price_adjustments?.[0]?.value}%`
      : ""
    : "";

  let discounted_price = selected_variant?.price;
  const price_adjustment =
    selected_selling_plan?.price_adjustments?.[0] ??
    selected_variant?.selling_plan_allocations?.[0]?.selling_plan?.price_adjustments?.[0];

  if (price_adjustment?.value_type === "fixed_amount") {
    discounted_price = Math.max(discounted_price - Math.round(+price_adjustment?.value), 0);
  }

  if (price_adjustment?.value_type === "percentage") {
    discounted_price = Math.max(discounted_price - Math.round((+price_adjustment?.value / 100) * discounted_price), 0);
  }

  const available_quantity =
    selected_variant?.inventory_management === "shopify" && selected_variant?.inventory_policy === "deny"
      ? selected_variant?.inventory_quantity -
        cart?.state?.items?.reduce((acc, line) => (line.variant_id === selected_variant.id ? acc + line.quantity : acc), 0)
      : selected_variant?.preorder && selected_variant?.preorder_quantity
      ? selected_variant?.inventory_quantity +
        selected_variant?.preorder_quantity -
        cart?.state?.items?.reduce((acc, line) => (line.variant_id === selected_variant.id ? acc + line.quantity : acc), 0)
      : 99999;

  const state = Alpine.reactive({
    random_id,
    addon_target,
    addon_auto_add,
    addon_bundle_in_cart,
    product_handle: productHandle,
    initial_variant_id: variantId,
    images_cleaned: false,
    hydrated: !!product,
    variant_changed: false,
    product: product,
    selected_media_id: product?.media?.[0]?.id,
    previous_selected_media_id: product?.media?.[0]?.id,
    properties: {},
    selected_variant,
    selling_plan_allocations,
    selected_selling_plan,
    last_selected_selling_plan: selected_selling_plan,
    selling_plan_discount_wording,
    isAdding: false,
    selected_options: selected_variant?.options ?? [],
    quantity: 1,
    sibling_handle: "",
    hasVariants: product?.variants?.length > 1 || product?.variants?.[0]?.title !== "Default Title",
    hasSubscription: !!selected_variant?.options?.length,
    soldOut: available_quantity <= 0,
    available_quantity,
    preorder:
      selected_variant?.preorder &&
      selected_variant?.inventory_quantity -
        cart?.state?.items?.reduce((acc, line) => (line.variant_id === selected_variant.id ? acc + line.quantity : acc), 0) <
        preorder_threshold,
    gallery_media: product?.media ?? [],
    selected_price: discounted_price,
    selected_compare_at_price: Math.max(selected_variant?.compare_at_price, selected_variant?.price),
  });

  const handleImageSelection = (filter_images, variant = state.selected_variant) => {
    switch (filter_images) {
      case "show_all": {
        return state.product?.media;
      }
      case "selected_variant": {
        return state.product?.media?.filter((media) => media.id === variant?.featured_media?.id);
      }
      case "variant_images_by_order": {
        let hide = true;

        return state.product?.media?.filter((media) => {
          if (media.id === variant?.featured_media?.id) {
            hide = false;
          }

          if (state.product?.variants.map((v) => v?.featured_media?.id).includes(media.id)) {
            hide = true;
          }
          return !hide;
        });
      }
      case "variant_images_by_metafield": {
        return [
          ...(state.product?.media?.filter((media) => media.id === variant?.featured_media?.id) ?? []),
          ...(state.selected_variant?.metafields?.smart?.images ?? []),
        ];
      }
      case "variant_images_and_unassigned": {
        return [
          ...(state.product?.media?.filter((media) => media.id === variant?.featured_media?.id) ?? []),
          ...(state.product?.media?.filter(
            (media) => !state.product?.variants.map((v) => v?.featured_media?.id).includes(media.id)
          ) ?? []),
        ];
      }
      case "only_unassigned": {
        return state.product?.media?.filter(
          (media) => !state.product?.variants.map((v) => v?.featured_media?.id).includes(media.id)
        );
      }
      case "first_or_selected_image": {
        return state.product?.media?.filter((media) => media.id === state.selected_media_id);
      }
    }
  };

  const scrollToMediaById = async (mediaId, scrollContainer) => {
    const isHorizontal = () => {
      return !!(
        getComputedStyle(scrollContainer).overflowY === "hidden" ||
        getComputedStyle(scrollContainer).gridAutoFlow === "column" ||
        scrollContainer.scrollWidth > scrollContainer?.clientWidth
      );
    };
    await utils.delay(5);

    const image = scrollContainer?.querySelector(`[data-media-id="${mediaId}"]`);

    if (!image) return;
    await utils.delay(5);
    const header = document.querySelector(".header-sections-container");
    const offsetHeight = Math.max(180, header?.getBoundingClientRect()?.bottom ?? 0);
    const imageOffset = utils.getElementPosition(image);

    await utils.delay(20);

    if (utils.isElementScrollable(scrollContainer)) {
      let scrollSnap = false;
      if (["snap-both", "snap-x", "snap-y"].some((c) => scrollContainer?.classList?.contains(c))) {
        scrollContainer?.classList.remove("snap-both", "snap-x", "snap-y");
        scrollSnap = true;
      }
      utils.scrollToXY(200, image.offsetLeft, image.offsetTop, scrollContainer, () => {
        if (scrollSnap) {
          scrollContainer?.classList.add(isHorizontal() ? "snap-x" : "snap-y");
        }
        state.selected_media_id = mediaId;
      });
      return;
    }

    if (scrollContainer.closest("[data-modal-id]")) return;

    utils.scrollToXY(
      200,
      image.offsetLeft,
      imageOffset.top - offsetHeight - +getComputedStyle(scrollContainer).paddingTop.replace("px", ""),
      window,
      () => {
        state.selected_media_id = mediaId;
      }
    );
  };

  const handleAddToCart = async (e, openCartDrawer = true) => {
    const random_id = utils.shortUUID();

    const properties = {};
    const form = $el.querySelector("form");
    const giftItemBlockId = $el.closest("[data-gift-with-purchase]")?.getAttribute("data-gift-with-purchase");
    const isHiddenItem = !!$el.closest("[data-hide-in-cart]");

    if (giftItemBlockId) {
      properties["_gift_with_purchase"] = giftItemBlockId;
    }
    if (isHiddenItem) {
      properties["_p_hidden"] = "true";
    }

    if (state.selected_variant?.preorder && state.selected_variant?.inventory_quantity < preorder_threshold) {
      properties["Preorder"] = `true`;
      if (state.selected_variant?.preorder_date) {
        properties["Preorder"] = `Shipping ${new Date(state.selected_variant.preorder_date).toLocaleDateString(
          navigator.language,
          {
            month: "short",
            year: "numeric",
          }
        )}`;
      }
    }

    if (form) {
      Object.entries(utils.serializeForm(form))?.forEach(([key, value]) => {
        if (key.includes("properties[") && value) {
          properties[key.replace(/^properties\[(.*)]$/gi, "$1")] = value;
        }
      });
    }

    e?.preventDefault();
    e?.stopPropagation();
    state.isAdding = true;
    const data = await _cart.add({
      items: [
        {
          id: state.selected_variant.id,
          quantity: state.quantity,
          selling_plan: cart.global_subscriptions
            ? state.selected_variant?.selling_plan_allocations?.find(
                (plan) => plan.selling_plan?.id === cart.cart_selling_plan_id
              )?.selling_plan?.id
            : state.selected_selling_plan?.id,
          properties: {
            ...properties,
            ...state.properties,
          },
        },
      ],
    });

    state.isAdding = false;

    if (!data.cart_error && openCartDrawer) {
      _stores.modal.setId("modal--cart-drawer");
      _stores.quickView.show = false;
    }
  };

  const handleBackInStockNotification = async (e) => {
    if (state?.selected_variant?.available) return;
    e.preventDefault();
    e.stopPropagation();
    _stores.modal.setId("back_in_stock");
    _stores.backInStockNotification.product = state.product;
    _stores.backInStockNotification.selected_variant = state.selected_variant;
  };

  const setSelectedVariant = (id) => {
    state.selected_variant = state.product.variants?.find((variant) => variant.id === id);
    state.selected_options = state.selected_variant?.options;
    state.variant_changed = true;

    if (
      state.selected_selling_plan &&
      !state.selected_variant?.selling_plan_allocations?.some(
        (plan) => plan?.selling_plan?.id === state.selected_selling_plan?.id
      )
    ) {
      state.selected_selling_plan = state.selected_variant?.selling_plan_allocations?.[0]?.selling_plan ?? null;
    }

    if (state.product.requires_selling_plan && !state.selected_selling_plan) {
      state.selected_selling_plan =
        state.selected_variant?.selling_plan_allocations?.[0]?.selling_plan ??
        state.product.selling_plan_groups?.[0]?.selling_plans?.[0];
    }

    if (gallerySettings?.scroll_to_selected_variant_image && state.selected_variant?.featured_media?.id) {
      scrollToMediaById(state.selected_variant?.featured_media?.id);
    }
    _product.lastOptions = {
      ...(_product.lastOptions ?? {}),
      ...(state.product.options_with_values?.reduce((acc, option, index) => {
        acc[utils.handlelize(option?.name)] = state.selected_options[index];
        return acc;
      }, {}) ?? {}),
    };
    setTimeout(() => {
      sessionStorage.setItem("_p_last_options", JSON.stringify(_product.lastOptions));
    });
  };

  const setProductOption = ({ index, value }) => {
    const options = [...state.selected_options];
    options[index] = value;

    setSelectedVariant(
      state.product?.variants?.find((variant) => variant.options.every((option, i) => options[i] === option))?.id ??
        state.product?.variants?.find((variant) => variant.options[index] === value)?.id ??
        state.product?.variants?.find(({ available }) => available)?.id ??
        state.product?.variants?.[0]?.id
    );
  };

  const setSellingPlan = (selling_plan_id) => {
    state.selected_selling_plan = state.selling_plan_allocations.find(
      (allocation) => allocation.selling_plan.id === selling_plan_id
    )?.selling_plan;

    if (state.selected_selling_plan) {
      state.last_selected_selling_plan = state.selected_selling_plan;
    }

    const selling_plan = state.selected_selling_plan ?? selling_plan_allocations?.[0]?.selling_plan;

    state.selling_plan_discount_wording = selling_plan?.price_adjustments?.[0]?.value
      ? selling_plan?.price_adjustments?.[0]?.value_type === "fixed_amount"
        ? `${utils.formatMoney(selling_plan?.price_adjustments?.[0]?.value)}`
        : selling_plan?.price_adjustments?.[0]?.value_type === "percentage"
        ? `${selling_plan?.price_adjustments?.[0]?.value}%`
        : ""
      : "";
  };

  const getDiscountLabel = (type, show_subscription_price) => {
    const price = state.selected_variant?.price ?? 0;
    const compare_at_price = state.selected_variant?.compare_at_price ?? 0;
    const subscription_price = state.selected_price ?? 0;

    if (compare_at_price <= price && compare_at_price <= subscription_price) {
      return "";
    }

    switch (type) {
      case "sale": {
        return "Sale";
      }
      case "percentage": {
        const percentage = Math.round(((compare_at_price - price) * 100) / compare_at_price);
        const subscription_percentage = Math.round(((price - subscription_price) * 100) / price);
        if (show_subscription_price) {
          const final_percentage = Math.round(
            (1 -
              (percentage > 0 ? 1 - percentage / 100 : 1) *
                (subscription_percentage > 0 ? 1 - subscription_percentage / 100 : 1)) *
              100,
          );
          return final_percentage > 0 ? `${final_percentage}% off` : "";
        } else {
          return percentage > 0 ? `${percentage}% off` : "";
        }
      }
      case "value": {
        return `Save ${utils.formatMoney(
          compare_at_price - price,
          window?.money_format?.replace(/\{(\s*)amount(\s*)}/gi, "{$1amount_no_decimals$2}")
        )}`;
      }
      default: {
        return "";
      }
    }
  };

  const hasAvailableVariant = (index, value) => {
    return state?.product?.variants?.some((variant) => {
      if (variant.metafields.custom.hide_on_frontend) {
        return false;
      }
      switch (index) {
        case 0: {
          return variant.options[index] === value && variant.available;
        }
        case 1: {
          return variant.options[0] === state?.selected_options[0] && variant.options[index] === value && variant.available;
        }
        case 2: {
          return (
            variant.options[0] === state?.selected_options[0] &&
            variant.options[1] === state?.selected_options[1] &&
            variant.options[index] === value &&
            variant.available
          );
        }
      }
      return false;
    });
  };

  const updateProductState = (product, selectedVariantId, selectedSellingPlanId) => {
    const selected_variant = _product.getSelectedVariant(product, selectedVariantId);

    const selling_plan_allocations = selected_variant?.selling_plan_allocations;
    const selected_selling_plan = selectedSellingPlanId
      ? selling_plan_allocations?.find((plan) => plan.selling_plan.id === selectedSellingPlanId)?.selling_plan
      : default_select_selling_plan
      ? selling_plan_allocations?.[0]?.selling_plan
      : null;
    const selling_plan_discount_wording = +selected_selling_plan?.price_adjustments?.[0]?.value
      ? selected_selling_plan?.price_adjustments?.[0]?.value_type === "fixed_amount"
        ? `${utils.formatMoney(selected_selling_plan?.price_adjustments?.[0]?.value)} off`
        : selected_selling_plan?.price_adjustments?.[0]?.value_type === "percentage"
        ? `Save ${selected_selling_plan?.price_adjustments?.[0]?.value}%`
        : ""
      : "";

    state.product_handle = product?.handle ?? state.product_handle ?? productHandle;
    state.product = product;
    if (state.selected_media_id !== product?.media?.[0]?.id) {
      state.previous_selected_media_id = state.selected_media_id;
    }
    state.selected_media_id = product?.media?.[0]?.id;
    state.properties = {};
    state.selected_variant = selected_variant;
    state.selling_plan_allocations = selling_plan_allocations;
    state.selected_selling_plan = selected_selling_plan;
    state.selling_plan_discount_wording = selling_plan_discount_wording;
    state.isAdding = false;
    state.selected_options = selected_variant?.options;
    state.quantity = 1;
    state.sibling_handle = "";
    state.gallery_media = product?.media;
    state.hydrated = true;

    setTimeout(
      () => {
        $el.querySelectorAll("[x-ignore]:not([x-defer])").forEach((child) => {
          if (!document.contains(child)) return;
          utils.initializeIgnoredAlpineTree(child);
        });
      },
      initialized ? 2 : 50
    );
  };

  const getCTAButtonProps = (el, preview) => {
    let attribute =
      el.hasAttribute("data-sold-out-action") && state.soldOut
        ? "sold-out-"
        : el.closest("[data-bundle-section]") && el.hasAttribute("data-bundle-action")
        ? "bundle-"
        : el.hasAttribute("data-pdp-action") && addon_target
        ? "pdp-"
        : el.hasAttribute("data-preorder-action") && state.preorder
        ? "preorder-"
        : el.hasAttribute("data-subscription-action") && state.hasSubscription
        ? "subscription-"
        : el.hasAttribute("data-variant-action") && state.hasVariants
        ? "variant-"
        : "";

    if (preview) {
      switch (preview) {
        case "default":
          attribute = "";
          break;
        case "variant":
          attribute = "variant-";
          break;
        case "subscription":
          attribute = "";
          break;
        case "bundle":
          attribute = "bundle-";
          break;
        case "bundle_added":
          attribute = "bundle-";
          break;
        case "in_pdp":
          attribute = "pdp-";
          break;
        case "in_pdp_added":
          attribute = "pdp-";
          break;
        case "out_of_stock":
          attribute = "sold-out-";
          break;
        default:
          attribute = "";
      }
    }
    el.classList.remove(...el.classList);
    el.classList.add("w-full", ...(el.getAttribute(`data-${attribute}class`).split(" ") ?? []));

    return {
      content: utils.richtextWithPrices(
        el.getAttribute(`data-${attribute}content`),
        state?.selected_variant?.price,
        state.selected_variant?.compare_at_price
      ),
      added_content: utils.richtextWithPrices(
        el.getAttribute(`data-${attribute}added-content`),
        state?.selected_variant?.price,
        state.selected_variant?.compare_at_price
      ),
      action: el.getAttribute(`data-${attribute}action`),
      classes: el.getAttribute(`data-${attribute}class`),
      product_modal_handle: el.getAttribute(`data-${attribute}product-modal-handle`),
    };
  };

  const toggleAddon = (value) => {
    if (!_stores?.main_product?.state) {
      return;
    }

    if (value) {
      _stores.main_product.state.addons?.set(state.product_handle, {
        id: state.selected_variant?.id || state.product?.variants?.[0]?.id,
        quantity: 1,
        variant: state.selected_variant || state.product?.variants?.[0],
      });
    } else {
      _stores.main_product.state.addons?.delete(state.product_handle);
    }
  };

  const showConditionally = (condition, bundle) => {
    switch (condition) {
      case "always": {
        return true;
      }
      case "with_subscriptions": {
        return !!state.selected_variant?.selling_plan_allocations?.length;
      }
      case "no_subscriptions": {
        return !state.selected_variant?.selling_plan_allocations?.length;
      }
      case "no_bundle": {
        return !bundle?.items_added;
      }
      case "bundle": {
        return !!bundle?.items_added;
      }
      case "with_variants": {
        return state?.product?.variants?.length > 1;
      }
      case "no_variants": {
        return state?.product?.variants?.length <= 1;
      }
    }
  };

  const getVariantSwatches = (primary_source, fallback_source, variant) => {
    const cssVariables = [];
    switch (primary_source) {
      case "title": {
        cssVariables.push(`--primary-swatch: var(--swatch-${utils.handlelize(variant.title)})`);
        break;
      }
      case "image": {
        const [src, version] = variant?.featured_media?.preview_image?.src.split("?") ?? [];
        if (!src) break;
        cssVariables.push(`--primary-swatch: url(${src}?width=180&height=180&${version}) center center/cover no-repeat`);
        break;
      }
      case "metafield": {
        const color_swatch = variant.metafields.smart.color_swatch;

        if (typeof color_swatch === "string") {
          cssVariables.push(`--primary-swatch: ${color_swatch}`);
          break;
        }
        if (color_swatch) {
          const [src, version] = color_swatch?.preview_image?.src.split("?") ?? [];
          if (!src) break;
          cssVariables.push(`--primary-swatch: url(${src}?width=180&height=180&${version}) center center/cover no-repeat`);
          cssVariables.push(`--primary-swatch: ${color_swatch}`);
        }
        break;
      }
    }
    switch (fallback_source) {
      case "title": {
        cssVariables.push(`--fallback-swatch: var(--swatch-${utils.handlelize(variant.title)})`);
        break;
      }
      case "image": {
        const [src, version] = variant?.featured_media?.preview_image?.src.split("?") ?? [];
        if (!src) break;
        cssVariables.push(`--fallback-swatch: url(${src}?width=180&height=180&${version}) center center/cover no-repeat`);
        break;
      }
      case "metafield": {
        const color_swatch = variant.metafields.smart.color_swatch;

        if (typeof color_swatch === "string") {
          cssVariables.push(`--fallback-swatch: ${color_swatch}`);
          break;
        }
        if (color_swatch) {
          const [src, version] = color_swatch?.preview_image?.src.split("?") ?? [];
          if (!src) break;
          cssVariables.push(`--fallback-swatch: url(${src}?width=180&height=180&${version}) center center/cover no-repeat`);
          cssVariables.push(`--fallback-swatch: ${color_swatch}`);
        }
        break;
      }
    }

    return `${cssVariables?.join(";")};background: var(--primary-swatch, var(--fallback-swatch, ${utils.handlelize(
      variant?.title
    )}))`;
  };

  const getOptionIndex = (blockId) => {
    const optionBlocks = [];

    for (let i = 0; i < (state.product?.options?.length || 0); i++) {
      const option = state.product?.options[i];
      const byNameBlock = option_blocks?.find((block) => {
        const alreadyUsed = optionBlocks.some((b) => b.id === block.block_id);
        if (alreadyUsed || block.option_type !== "by_name") return false;

        if (block.match_exact_word) {
          return block.match_option_titles?.split(",").includes(option);
        }
        return block.match_option_titles
          ?.split(",")
          .map((o) => o.toLowerCase().trim())
          .includes(option.toLowerCase().trim());
      });

      if (byNameBlock) {
        optionBlocks.push({ index: i, id: byNameBlock.block_id });
        continue;
      }

      const byIndexOptions = option_blocks?.find(
        (block) =>
          !optionBlocks.some((b) => b.id === block.block_id) && block.option_type === "by_index" && block.match_option_index === i
      );
      if (byIndexOptions) {
        optionBlocks.push({ index: i, id: byIndexOptions.block_id });
        continue;
      }

      const fallbackOptions = option_blocks?.find(
        (block) =>
          !optionBlocks.some((b) => b.id === block.block_id) &&
          block.option_type === "fallback_options" &&
          block.match_option_index === i
      );
      if (fallbackOptions) {
        optionBlocks.push({ index: i, id: fallbackOptions.block_id });
      }
    }

    return optionBlocks?.find((block) => block.id === blockId)?.index ?? -1;
  };

  const getOptionSwatches = (primary_source, fallback_source, value, index) => {
    const variant = state?.product?.variants?.find((variant) => variant.options[index] === value);

    const cssVariables = [];
    switch (primary_source) {
      case "title": {
        cssVariables.push(`--primary-swatch: var(--swatch-${utils.handlelize(value)})`);
        break;
      }
      case "image": {
        const [src, version] = variant?.featured_media?.preview_image?.src?.split("?") ?? [];
        if (!src) break;
        cssVariables.push(`--primary-swatch: url(${src}?width=180&height=180&${version}) center center/cover no-repeat`);
        break;
      }
      case "metafield": {
        const color_swatch = variant?.metafields?.smart?.color_swatch;

        if (typeof color_swatch === "string") {
          cssVariables.push(`--primary-swatch: ${color_swatch}`);
          break;
        }
        if (color_swatch) {
          const [src, version] = color_swatch?.preview_image?.src?.split("?") ?? [];
          if (!src) break;
          cssVariables.push(`--primary-swatch: url(${src}?width=180&height=180&${version}) center center/cover no-repeat`);
          cssVariables.push(`--primary-swatch: ${color_swatch}`);
        }
        break;
      }
    }
    switch (fallback_source) {
      case "title": {
        cssVariables.push(`--fallback-swatch: var(--swatch-${utils.handlelize(value)})`);
        break;
      }
      case "image": {
        const [src, version] = variant?.featured_media?.preview_image?.src?.split("?") ?? [];
        if (!src) break;
        cssVariables.push(`--fallback-swatch: url(${src}?width=180&height=180&${version}) center center/cover no-repeat`);
        break;
      }
      case "metafield": {
        const color_swatch = variant?.metafields?.smart?.color_swatch;

        if (typeof color_swatch === "string") {
          cssVariables.push(`--fallback-swatch: ${color_swatch}`);
          break;
        }
        if (color_swatch) {
          const [src, version] = color_swatch?.preview_image?.src?.split("?") ?? [];
          if (!src) break;
          cssVariables.push(`--fallback-swatch: url(${src}?width=180&height=180&${version}) center center/cover no-repeat`);
          cssVariables.push(`--fallback-swatch: ${color_swatch}`);
        }
        break;
      }
    }

    return `${cssVariables?.join(";")};background: var(--primary-swatch, var(--fallback-swatch, ${utils.handlelize(value)}))`;
  };

  if (product) {
    setTimeout(() => {
      $el.querySelectorAll("[x-ignore]:not([x-defer])").forEach((child) => {
        if (!document.contains(child)) return;
        utils.initializeIgnoredAlpineTree(child);
      });
    }, 2);
  }

  Alpine.effect(() => {
    const product = state.product;
    const selected_variant = state.selected_variant;

    state.hasVariants = product?.variants?.length > 1 || product?.variants?.[0]?.title !== "Default Title";
    state.hasSubscription = !!selected_variant?.options?.length;

    state.available_quantity =
      selected_variant?.inventory_management === "shopify" && selected_variant?.inventory_policy === "deny"
        ? selected_variant?.inventory_quantity -
          cart?.state?.items?.reduce(
            (acc, line) => (line.variant_id === (selected_variant?.id ?? variantId) ? acc + line.quantity : acc),
            0
          )
        : selected_variant?.preorder && selected_variant?.preorder_quantity
        ? selected_variant?.inventory_quantity +
          selected_variant?.preorder_quantity -
          cart?.state?.items?.reduce(
            (acc, line) => (line.variant_id === (selected_variant?.id ?? variantId) ? acc + line.quantity : acc),
            0
          )
        : 99999;

    state.soldOut = state.available_quantity <= 0;

    state.preorder =
      selected_variant?.preorder &&
      selected_variant?.inventory_quantity -
        cart?.state?.items?.reduce(
          (acc, line) => (line.variant_id === (selected_variant?.id ?? variantId) ? acc + line.quantity : acc),
          0
        ) <
        preorder_threshold;

    state.gallery_media = handleImageSelection(gallerySettings?.filter_images, selected_variant);

    if (!state.gallery_media?.length && state.product?.featured_media) {
      state.gallery_media = [state.product?.featured_media];
    }
  });

  Alpine.effect(() => {
    if (state.selected_variant?.id && state.selected_variant?.id !== state.initial_variant_id) {
      setTimeout(() => {
        $el.querySelectorAll("[x-ignore]:not([x-defer])").forEach((child) => {
          if (!document.contains(child)) return;
          utils.initializeIgnoredAlpineTree(child);
        });
      }, 2);
    }
  });
  Alpine.effect(() => {
    let discounted_price = state.selected_variant?.price;
    const price_adjustment =
      state.selected_selling_plan?.price_adjustments?.[0] ??
      state.selected_variant?.selling_plan_allocations?.[0]?.selling_plan?.price_adjustments?.[0];

    if (price_adjustment?.value_type === "fixed_amount") {
      discounted_price = Math.max(discounted_price - Math.round(+price_adjustment?.value), 0);
    }

    if (price_adjustment?.value_type === "percentage") {
      discounted_price = Math.max(discounted_price - Math.round((+price_adjustment?.value / 100) * discounted_price), 0);
    }

    state.selected_price = discounted_price;
    state.selected_compare_at_price = Math.max(state.selected_variant?.compare_at_price, state.selected_variant?.price);
  });

  initialized = true;

  return {
    p_card: state,
    $el,
    $refs,
    ...utils.spreadGenericCardFunctions(state),
    handleAddToCart,
    handleBackInStockNotification,
    setSelectedVariant,
    setProductOption,
    setSellingPlan,
    getDiscountLabel,
    getVariantSwatches,
    getOptionIndex,
    getOptionSwatches,
    hasAvailableVariant,
    updateProductState,
    showConditionally,
    getCTAButtonProps,
    handleImageSelection,
    scrollToMediaById,
    toggleAddon,
  };
};

const hydrateProductCard = utils.hydrateCard("product");

window._sections["initProductCard"] = initProductCard;
window._sections["hydrateProductCard"] = hydrateProductCard;

})();

// ---- __section--color_wheel.js ----
(function(){
"use strict";
const initColorWheel = ($el) => {
  const blocks = [...$el.querySelectorAll("[data-color-collection]")].map((item) =>
    utils.JSONParse(item.getAttribute("data-color-collection"))
  );

  const defaultBlock = blocks?.[0];

  // Calculate midpoint angle between start and end (handles wrap-around)
  const angleRange =
    defaultBlock?.end_angle !== undefined && defaultBlock?.start_angle !== undefined
      ? (defaultBlock.end_angle - defaultBlock.start_angle + 360) % 360
      : 0;

  const midpointAngle = defaultBlock !== undefined ? (defaultBlock?.start_angle + angleRange / 2) % 360 : 0;

  const rotatedMidpointAngle = (midpointAngle - 90) % 360;
  const radians = (rotatedMidpointAngle * Math.PI) / 180;
  const distanceFromCenterAsPercent = 0.7;
  const defaultXPercent = 0.5 + Math.cos(radians) * distanceFromCenterAsPercent * 0.5;
  const defaultYPercent = 0.5 + Math.sin(radians) * distanceFromCenterAsPercent * 0.5;

  const state = window.Alpine.reactive({
    collectionIndex: 0,
    currentCollection: blocks[0]?.collection?.handle ?? "",
    clickXPercent: defaultXPercent,
    clickYPercent: defaultYPercent,
    dragging: false,
  });

  const startDragging = (e) => {
    state.dragging = true;
    handleDrag(e);
  };

  const stopDragging = () => {
    state.dragging = false;
  };

  const handleDrag = (e) => {
    if (!state.dragging) return;
    selectColor(e);
  };

  document.addEventListener("mousemove", handleDrag);
  document.addEventListener("mouseup", stopDragging);

  const selectColor = (e) => {
    const target = e.target;
    if (!target) return;
    const targetElement = target;
    const boundingRect = targetElement.getBoundingClientRect();

    const relativeX = (e.clientX - boundingRect.left) / boundingRect.width;
    const relativeY = (e.clientY - boundingRect.top) / boundingRect.height;

    const centerX = 0.5;
    const centerY = 0.5;

    const deltaX = relativeX - centerX;
    const deltaY = relativeY - centerY;

    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    angle = (angle + 90) % 360;

    const index = blocks.findIndex((block) => {
      const { start_angle, end_angle } = block;
      if (start_angle < end_angle) {
        return angle >= start_angle && angle < end_angle;
      } else {
        return angle >= start_angle || angle < end_angle;
      }
    });

    state.clickXPercent = relativeX;
    state.clickYPercent = relativeY;
    state.collectionIndex = index !== -1 ? index : state.collectionIndex;
    state.currentCollection = blocks[state.collectionIndex]?.collection?.handle;
  };

  const getDynamicTextWithFormattedPrice = (content) => {
    return (
      content?.replace(/\[([^\]]*)\]/gi, (...matches) => {
        // @ts-ignore
        return matches?.[1]?.split(".").reduce(
          (acc, selector) => {
            if (!selector || acc[0] === undefined || acc[0] === null) {
              if (/price$/gi.test(acc[1]) && typeof acc[0] === "number") {
                return [utils.formatMoney(acc[0]), selector];
              }
              return acc;
            }

            if (acc[0] && selector in acc[0]) {
              if (/price$/gi.test(selector) && typeof acc[0][selector] === "number") {
                return [utils.formatMoney(acc[0][selector]), selector];
              }
              return [acc[0][selector], selector];
            }
            return ["", ""];
          },
          [{ collection: blocks[state.collectionIndex]?.collection ?? {} }, ""]
        )[0];
      }) ?? ""
    );
  };

  return {
    color_wheel: { state, selectColor, startDragging, stopDragging, getDynamicTextWithFormattedPrice },
  };
};

window._sections["initColorWheel"] = initColorWheel;

/* LAST HASH: 5c8a111ce438a0dfc71bf51e1d0a571fb8bd8d94 */
;

})();

// ---- __section--header_navigation_bar.js ----
(function(){
"use strict";
const initNavigationBar = ($el, $refs) => {
  const routerStore = window.Alpine.store("router");
  const modalStore = window.Alpine.store("modal");

  const toggleTransparent = (e, instant = false) => {
    const handleTransition = () => {
      const { transparentTemplates } = $el.dataset;
      const templates = transparentTemplates
        .split(",")
        ?.filter((t) => t)
        ?.map((t) => t.trim()?.split("."));

      const transparent = templates?.some(
        ([prefix, suffix]) =>
          _stores.router?.template?.split(".")?.[0] === prefix &&
          (!suffix || _stores.router?.template?.split(".")?.[1] === suffix)
      );

      document.body.style.setProperty("--navigation-bar-transparent-height", transparent ? `-${$el.clientHeight}px` : `0`);

      if (transparent || (!transparent && $el?.classList?.contains("navigation-bar--transparent"))) {
        const makeTransparent =
          transparent &&
          !_stores.modal.id.includes("megamenu-") &&
          _stores.modal.id !== "search" &&
          !_stores.modal.id.includes("country-selector") &&
          window.scrollY <= 300 &&
          e?.type !== "pointerover";

        $el?.classList?.toggle("navigation-bar--transparent", makeTransparent);
        $refs?.navigation_bar_background_image?.classList?.toggle("!opacity-0", makeTransparent);
      }
    };
    if (instant) {
      handleTransition();
    } else {
      Alpine.nextTick(handleTransition);
    }
  };

  toggleTransparent();

  Alpine.effect(() => {
    if (modalStore?.id || !modalStore?.id) {
      toggleTransparent();
    }
  });

  const showConditionally = (element, settings) => {
    const {
      hide_if_empty,
      hide_if_set_paths,
      required_paths,
      hide_if_set_templates,
      required_templates,
      match_paths,
      match_templates,
    } = settings;

    const paths = match_paths?.split(",").map((path) => path.trim());
    const templates = match_templates?.split(",").map((path) => path.trim());

    let hide = false;

    if (paths?.length) {
      if (hide_if_set_paths && paths.includes(routerStore.pathname)) {
        hide = true;
      }
      if (required_paths && !paths.includes(routerStore.pathname)) {
        hide = true;
      }
    }
    if (templates?.length) {
      if (
        hide_if_set_templates &&
        (templates.includes(routerStore.template) || templates.includes(routerStore.template.split(".")[0]))
      ) {
        hide = true;
      }
      if (
        required_templates &&
        !(templates.includes(routerStore.template) || templates.includes(routerStore.template.split(".")[0]))
      ) {
        hide = true;
      }
    }

    switch (hide_if_empty) {
      case "none":
        break;
      case "section":
        element.closest(`.shopify-section`)?.classList.toggle("!hidden", hide);
        break;
      case "container":
        element
          .closest(`[data-style-id]:not([data-style-id="${element.getAttribute("data-style-id")}"])`)
          ?.classList.toggle("!hidden", hide);
        break;
      case "block":
        element?.classList.toggle("!hidden", hide);
        break;
    }
  };

  return {
    $el,
    $refs,
    showConditionally,
    toggleTransparent,
  };
};

window._sections["initNavigationBar"] = initNavigationBar;

/* LAST HASH: 89d7cea94de62881cf242ea9d7c2adc79b8c52be */
;

})();

// ---- __section--hotspots.js ----
(function(){
"use strict";
const initHotspots = ($el) => {
  const canvasElement = $el.querySelector("[data-hotspot-canvas]");
  const img = $el.querySelector("[data-hotspot-canvas] img");
  const tabs = window.Alpine.store("tabs");

  const state = Alpine.reactive({
    current_id: "",
    scrollingIntoView: "",
  });

  const clamp = (value, minimum, maximum) => {
    return Math.min(maximum, Math.max(minimum, value));
  };

  const parseObjectPosition = (objectPositionString, boxWidth, boxHeight) => {
    const keywordToFraction = { left: 0, top: 0, center: 0.5, right: 1, bottom: 1 };

    const trimmed = (objectPositionString || "").trim();
    const tokens = trimmed.split(/\s+/);

    const rawX = tokens[0] ?? "50%";
    const rawY = tokens[1] ?? "50%";

    const toFraction = (value, axisSize) => {
      const isKeyword = value in keywordToFraction;
      if (isKeyword) return keywordToFraction[value];

      const isPercent = value.endsWith("%");
      if (isPercent) return clamp(parseFloat(value) / 100, 0, 1);

      const isPixels = value.endsWith("px");
      if (isPixels) return clamp(parseFloat(value) / axisSize, 0, 1);

      const numeric = Number(value);
      const isNumeric = Number.isFinite(numeric);
      if (isNumeric) return clamp(numeric / 100, 0, 1);

      return 0.5;
    };

    const fractionX = toFraction(rawX, boxWidth);
    const fractionY = toFraction(rawY, boxHeight);

    return { x: fractionX, y: fractionY };
  };

  const renderImageCanvas = () => {
    const update = () => {
      if (!img?.naturalWidth) return;
      if (!img?.naturalHeight) return;

      const containerRect = canvasElement.getBoundingClientRect();
      const boxWidth = containerRect.width;
      const boxHeight = containerRect.height;

      const computedStyle = getComputedStyle(img);
      const objectFit = computedStyle.objectFit || "fill";
      const position = parseObjectPosition(computedStyle.objectPosition, boxWidth, boxHeight);

      const imageAspectRatio = img.naturalWidth / img.naturalHeight;
      const boxAspectRatio = boxWidth / boxHeight;

      canvasElement.style.setProperty("--img-ar", `${img.naturalWidth} / ${img.naturalHeight}`);

      let leftOffset = 0;
      let topOffset = 0;
      let renderedWidth = boxWidth;
      let renderedHeight = boxHeight;
      let fitMode = "box";

      switch (objectFit) {
        case "cover": {
          const isImageWider = imageAspectRatio > boxAspectRatio;

          if (isImageWider) {
            fitMode = "height";
            renderedHeight = boxHeight;
            renderedWidth = boxHeight * imageAspectRatio;
            const leftoverWidth = boxWidth - renderedWidth;
            leftOffset = leftoverWidth * position.x;
            topOffset = 0;
          }

          if (!isImageWider) {
            fitMode = "width";
            renderedWidth = boxWidth;
            renderedHeight = boxWidth / imageAspectRatio;
            const leftoverHeight = boxHeight - renderedHeight;
            leftOffset = 0;
            topOffset = leftoverHeight * position.y;
          }
          break;
        }

        case "contain": {
          const isImageWider = imageAspectRatio > boxAspectRatio;

          if (isImageWider) {
            fitMode = "width";
            renderedWidth = boxWidth;
            renderedHeight = boxWidth / imageAspectRatio;
            const leftoverHeight = boxHeight - renderedHeight;
            leftOffset = 0;
            topOffset = leftoverHeight * position.y;
          }

          if (!isImageWider) {
            fitMode = "height";
            renderedHeight = boxHeight;
            renderedWidth = boxHeight * imageAspectRatio;
            const leftoverWidth = boxWidth - renderedWidth;
            leftOffset = leftoverWidth * position.x;
            topOffset = 0;
          }
          break;
        }

        case "scale-down": {
          const fitsWithoutScale = img.naturalWidth <= boxWidth && img.naturalHeight <= boxHeight;

          if (fitsWithoutScale) {
            fitMode = "natural";
            leftOffset = 0;
            topOffset = 0;
            renderedWidth = img.naturalWidth;
            renderedHeight = img.naturalHeight;
          }

          if (!fitsWithoutScale) {
            const isImageWider = imageAspectRatio > boxAspectRatio;

            if (isImageWider) {
              fitMode = "width";
              renderedWidth = boxWidth;
              renderedHeight = boxWidth / imageAspectRatio;
              const leftoverHeight = boxHeight - renderedHeight;
              leftOffset = 0;
              topOffset = leftoverHeight * position.y;
            }

            if (!isImageWider) {
              fitMode = "height";
              renderedHeight = boxHeight;
              renderedWidth = boxHeight * imageAspectRatio;
              const leftoverWidth = boxWidth - renderedWidth;
              leftOffset = leftoverWidth * position.x;
              topOffset = 0;
            }
          }
          break;
        }

        case "none": {
          fitMode = "natural";
          leftOffset = 0;
          topOffset = 0;
          renderedWidth = img.naturalWidth;
          renderedHeight = img.naturalHeight;
          break;
        }

        default: {
          fitMode = "box";
          leftOffset = 0;
          topOffset = 0;
          renderedWidth = boxWidth;
          renderedHeight = boxHeight;
          break;
        }
      }

      const offsetXPercent = renderedWidth ? (leftOffset / renderedWidth) * 100 : 0;
      const offsetYPercent = renderedHeight ? (topOffset / renderedHeight) * 100 : 0;

      canvasElement?.classList.toggle("fit-height", fitMode === "height");
      canvasElement.style.setProperty("--offset-x", `${offsetXPercent}%`);
      canvasElement.style.setProperty("--offset-y", `${offsetYPercent}%`);
    };

    if (img && img.complete) update();
    if (img) img.addEventListener("load", update);

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(canvasElement);

    if (img) {
      resizeObserver.observe(img);
      const mutationObserver = new MutationObserver(update);
      mutationObserver.observe(img, { attributes: true, attributeFilter: ["style", "class"] });
    }
  };

  if (canvasElement && img) renderImageCanvas();

  const placeHotspotItem = (hotspotButton, hotspotContent, preferredSide, leftPercent, topPercent) => {
    if (!canvasElement || !hotspotContent || !hotspotButton) return;

    const measureAndPlace = () => {
      hotspotContent.style.zIndex = "12";
      hotspotContent.style.left = "0%";
      hotspotContent.style.width = "auto";
      hotspotContent.style.transform = "translateY(-50%)";

      const canvasRect = canvasElement.getBoundingClientRect();
      const viewportWidth = document.documentElement.clientWidth;

      const baseLeftCanvasPx = (leftPercent / 100) * canvasRect.width;
      const baseLeftViewportPx = canvasRect.left + baseLeftCanvasPx;

      const buttonRect = hotspotButton.getBoundingClientRect();
      const halfButtonPx = buttonRect.width / 2;
      const gapPx = 16;

      const rectWidthPx = hotspotContent.getBoundingClientRect().width;
      const scrollWidthPx = hotspotContent.scrollWidth;
      const naturalWidthPx = Math.max(rectWidthPx, scrollWidthPx);

      const spaceLeftPx = Math.max(0, baseLeftViewportPx);
      const spaceRightPx = Math.max(0, viewportWidth - baseLeftViewportPx);

      const maxLeftFitPx = Math.max(0, spaceLeftPx - halfButtonPx - gapPx);
      const maxRightFitPx = Math.max(0, spaceRightPx - halfButtonPx - gapPx);

      let side = preferredSide;
      const fitsLeft = naturalWidthPx <= maxLeftFitPx;
      const fitsRight = naturalWidthPx <= maxRightFitPx;
      const fitsPreferredLeft = side === "left" && fitsLeft;
      const fitsPreferredRight = side === "right" && fitsRight;

      if (side === "left" && !fitsPreferredLeft) side = "right";
      if (side === "right" && !fitsPreferredRight) side = "left";

      let finalWidthPx = naturalWidthPx;

      const neitherFits = !fitsLeft && !fitsRight;
      if (neitherFits) {
        const moreOnLeft = maxLeftFitPx >= maxRightFitPx;
        if (moreOnLeft) side = "left";
        if (!moreOnLeft) side = "right";
        finalWidthPx = moreOnLeft ? maxLeftFitPx : maxRightFitPx;
      }

      if (side === "left") finalWidthPx = Math.min(finalWidthPx, maxLeftFitPx);
      if (side === "right") finalWidthPx = Math.min(finalWidthPx, maxRightFitPx);

      let targetLeftViewportPx = baseLeftViewportPx;
      if (side === "left") targetLeftViewportPx = baseLeftViewportPx - halfButtonPx - gapPx - finalWidthPx;
      if (side === "right") targetLeftViewportPx = baseLeftViewportPx + halfButtonPx + gapPx;

      const minLeftViewportPx = 0;
      const maxLeftViewportPx = Math.max(0, viewportWidth - finalWidthPx);

      if (targetLeftViewportPx < minLeftViewportPx) targetLeftViewportPx = minLeftViewportPx;
      if (targetLeftViewportPx > maxLeftViewportPx) targetLeftViewportPx = maxLeftViewportPx;

      const offsetPx = targetLeftViewportPx - baseLeftViewportPx;

      hotspotContent.style.left = `calc(${leftPercent}% + ${offsetPx}px)`;
      hotspotContent.style.top = `calc(${topPercent}% + 0px)`;
      hotspotContent.style.width = `${finalWidthPx}px`;
    };

    measureAndPlace();

    if (!hotspotContent.dataset.observing) {
      const resizeObserver = new ResizeObserver(() => measureAndPlace());
      resizeObserver.observe(hotspotContent);
      const images = hotspotContent.querySelectorAll("img");
      images.forEach((img) => {
        if (!img.complete) img.addEventListener("load", () => measureAndPlace(), { once: true });
      });
      hotspotContent.dataset.observing = "1";
    }

    requestAnimationFrame(() => measureAndPlace());
  };

  const initTargetElement = (wrapper, id, target_id, hotspotButton) => {
    requestAnimationFrame(() => {
      const targetElement = document.getElementById(id);

      if (targetElement) {
        hotspotButton.setAttribute("aria-label", targetElement.textContent.trim().slice(0, 80));
        wrapper.appendChild(targetElement?.cloneNode(true));
        wrapper.firstElementChild?.removeAttribute("id");

        const mutationObserver = new MutationObserver((e) => {
          if (!document.contains(targetElement)) {
            mutationObserver.disconnect();
            return;
          }
          if (
            utils.isVisible(targetElement) &&
            targetElement.classList.contains("centered") &&
            state.current_id !== target_id &&
            (!state.scrollingIntoView || state.scrollingIntoView === target_id)
          ) {
            state.current_id = target_id;
          }
        });
        mutationObserver.observe(targetElement, {
          childList: false,
          subtree: false,
          attributes: true,
          attributeFilter: ["class"],
        });

        Alpine.watch(
          () => state.current_id,
          async () => {
            const tabContainer = targetElement.closest("[data-tab-id][data-tab-group]");
            const sectionId = tabContainer?.closest(".shopify-section")?.id;
            const tabId = tabContainer?.getAttribute("data-tab-id");
            const tabGroup = +tabContainer?.getAttribute("data-tab-group");

            if (
              typeof state.current_id === "string" &&
              (!window.matchMedia("(max-width: 768px)").matches || state.scrollingIntoView)
            ) {
              return;
            }
            if (tabContainer) {
              if (state.current_id === target_id && tabs[sectionId].current_tabs[tabGroup] !== tabId) {
                if (state.scrollingIntoView !== target_id) {
                  state.scrollingIntoView = target_id;
                }

                Alpine.nextTick(async () => {
                  requestAnimationFrame(() => {
                    requestAnimationFrame(async () => {
                      targetElement.scrollIntoView({
                        behavior: "instant",
                        inline: "nearest",
                        block: "nearest",
                      });
                      await utils.delay(100);
                      if (state.scrollingIntoView !== "") {
                        state.scrollingIntoView = "";
                      }
                    });
                  });
                });
              }

              Alpine.nextTick(() => {
                if (state.current_id === target_id && tabs[sectionId].current_tabs[tabGroup] !== tabId) {
                  tabs[sectionId].current_tabs[tabGroup] = tabId;
                }
                if (!state.current_id && tabs[sectionId].current_tabs[tabGroup] === tabId) {
                  tabs[sectionId].current_tabs[tabGroup] = tabs[sectionId].tabs[tabGroup].find((tId) => tId !== tabId);
                }
              });

              if (
                state.current_id === target_id &&
                !targetElement.classList.contains("centered") &&
                tabs[sectionId].current_tabs[tabGroup] === tabId
              ) {
                if (state.scrollingIntoView !== target_id) {
                  state.scrollingIntoView = target_id;
                }
                targetElement.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
                await utils.delay(250);
                if (state.scrollingIntoView !== "") {
                  state.scrollingIntoView = "";
                }
              }
            }

            if (!tabContainer) {
              if (state.current_id === target_id && !targetElement.classList.contains("centered")) {
                state.scrollingIntoView = target_id;
                targetElement.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
                await utils.delay(250);
                state.scrollingIntoView = "";
              }
            }
          }
        );
      }
    });
  };

  const setHotspotId = (id = "") => {
    state.current_id = id;
  };

  return {
    hs: state,
    setHotspotId,
    placeHotspotItem,
    initTargetElement,
  };
};

window._sections["initHotspots"] = initHotspots;

/* LAST HASH: fa16a09543b42ec0b3167717436ac22119d077d9 */
;

})();

// ---- __section--main_article.js ----
(function(){
"use strict";
const initMainArticle = ($el) => {
  const state = window.Alpine.reactive({
    loading: false,
    count: $el.querySelector("[data-next-url]")?.children?.length,
    next_url: $el.querySelector("[data-next-url]")?.getAttribute("data-next-url"),
  });

  const loadNextPage = async (
    container = $el.querySelector(`[data-next-url]`),
    paginationContainer = $el.querySelector(`[data-pagination][x-ref="pagination"]`)
  ) => {
    if (!state.next_url || state.loading) return;

    state.loading = true;
    const html = await fetch(state.next_url).then((res) => res.text());

    const newDocument = document.createElement("div");
    newDocument.innerHTML = html;

    const section = newDocument.querySelector(`[data-style-id="${$el.getAttribute("data-style-id")}"]`);

    const newContent = section.querySelector(`[data-next-url][x-ref="${container?.getAttribute("x-ref")}"]`);

    state.next_url = newContent?.getAttribute("data-next-url");

    const newPagination = section.querySelector(`[data-pagination][x-ref="pagination"]`);

    if (newContent) {
      container.append(...newContent.children);
      state.count = container?.children?.length;
    }
    if (paginationContainer && newPagination) {
      paginationContainer.innerHTML = newPagination.innerHTML;
    }
    state.loading = false;
  };

  return {
    main_article: {
      state,
      loadNextPage,
    },
  };
};

window._sections["initMainArticle"] = initMainArticle;

/* LAST HASH: 4a7130a3b520016ca5a4e3530795406345ae0cc3 */
;

})();

// ---- __section--main_blog.js ----
(function(){
"use strict";
const initMainBlog = ($el) => {
  const state = window.Alpine.reactive({
    loading: false,
    count: $el.querySelector("[data-next-url]")?.children?.length,
    next_url: $el.querySelector("[data-next-url]")?.getAttribute("data-next-url"),
  });

  const modalStore = window.Alpine.store("modal");

  const updateTagFilters = async (url) => {
    modalStore.setId("");
    state.loading = true;

    if (!url) {
      url = new URL(`${$el.action?.split("?")[0]}?${new URLSearchParams(new FormData($el)).toString()}`);

      const tags = url.searchParams.getAll("Tags");
      url.search = "";
      url.pathname = tags?.length
        ? `${url.pathname.split("/tagged/")[0]}/tagged/${tags.join("+")}`
        : url.pathname.split("/tagged/")[0];
    }

    $el
      ?.querySelectorAll(
        "[class^=product-card--], [class^=collection-card--], [class^=article-card--], [class^=blog-card--], [class^=page-card--]"
      )
      ?.forEach((card) => {
        card?.classList?.add("button-loading-transparent");
      });

    const content = await fetch(url).then((res) => res.text());
    url?.searchParams?.delete("barba_prefetch");
    barba.history.add(url.toString(), "barba", "replace");
    const newDocument = document.createElement("div");
    newDocument.innerHTML = content;

    const section = newDocument.querySelector(`[data-style-id="${$el.getAttribute("data-style-id")}"]`);

    $el.outerHTML = section.outerHTML;
    state.loading = false;
    state.count = $el.querySelector("[data-next-url]")?.children?.length;

    const header = document.querySelector(".header-sections-container");
    const offsetHeight = Math.max(0, header?.getBoundingClientRect()?.bottom ?? 0);

    utils.scrollToY(150, utils.getElementPosition($el).top - offsetHeight - +getComputedStyle($el).paddingTop.replace("px", ""));
  };

  const debounceUpdates = utils.debounce(updateTagFilters, 750);

  const loadNextPage = async (
    container = $el.querySelector(`[data-next-url]`),
    paginationContainer = $el.querySelector(`[data-pagination][x-ref="pagination"]`)
  ) => {
    if (!state.next_url || state.loading) return;

    state.loading = true;
    const html = await fetch(state.next_url).then((res) => res.text());

    const newDocument = document.createElement("div");
    newDocument.innerHTML = html;

    const section = newDocument.querySelector(`[data-style-id="${$el.getAttribute("data-style-id")}"]`);

    const newContent = section.querySelector(`[data-next-url][x-ref="${container?.getAttribute("x-ref")}"]`);

    state.next_url = newContent?.getAttribute("data-next-url");

    const newPagination = section.querySelector(`[data-pagination][x-ref="pagination"]`);

    if (newContent) {
      container.append(...newContent.children);
      state.count = container?.children?.length;
    }
    if (paginationContainer && newPagination) {
      paginationContainer.innerHTML = newPagination.innerHTML;
    }
    state.loading = false;
  };

  return {
    main_blog: {
      state,
      loadNextPage,
      updateSortAndFilters: updateTagFilters,
      debounceUpdates,
    },
  };
};

window._sections["initMainBlog"] = initMainBlog;

/* LAST HASH: 246d3fc82abfcac29abbf6fc7fdb025999e4b90a */
;

})();

// ---- __section--main_collection.js ----
(function(){
"use strict";
const initMainCollection = ($el, current_sort) => {
  const state = window.Alpine.reactive({
    loading: false,
    count: $el.querySelector("[data-next-url]")?.children?.length,
    sort_by: current_sort,
    next_url: $el.querySelector("[data-next-url]")?.getAttribute("data-next-url"),
  });

  const modalStore = window.Alpine.store("modal");

  Alpine.effect(() => {
    if (state.sort_by !== current_sort) {
      Alpine.nextTick(() => {
        updateSortAndFilters();
      });
    }
  });

  const updateSortAndFilters = async (
    url = new URL(`${$el.action?.split("?")[0]}?${new URLSearchParams(new FormData($el)).toString()}`)
  ) => {
    modalStore.setId("");
    state.loading = true;
    $el
      ?.querySelectorAll(
        "[class^=product-card--], [class^=collection-card--], [class^=article-card--], [class^=blog-card--], [class^=page-card--]"
      )
      ?.forEach((card) => {
        card?.classList?.add("button-loading-transparent");
      });

    const content = await utils.fetchFromCache(url.toString());
    url?.searchParams?.delete("barba_prefetch");
    barba.history.add(url.toString(), "barba", "push");
    const newDocument = document.createElement("div");
    newDocument.innerHTML = content;

    const section = newDocument.querySelector(`[data-style-id="${$el.getAttribute("data-style-id")}"]`);

    section.querySelectorAll("details").forEach((detailsElement) => {
      const title = detailsElement.querySelector("summary").innerText;
      const lastEl = [...$el.querySelectorAll("details")]?.find(
        (oldDetailsElement) => oldDetailsElement.querySelector("summary")?.innerText?.trim() === title?.trim()
      );

      if (lastEl) {
        detailsElement.open = lastEl.open;
        detailsElement.setAttribute("open", lastEl.open ? "open" : "");
      }
    });

    $el.outerHTML = section.outerHTML;
    state.loading = false;
    state.count = $el.querySelector("[data-next-url]")?.children?.length;

    const header = document.querySelector(".header-sections-container");
    const offsetHeight = Math.max(0, header?.getBoundingClientRect()?.bottom ?? 0);

    utils.scrollToY(150, utils.getElementPosition($el).top - offsetHeight - +getComputedStyle($el).paddingTop.replace("px", ""));
  };

  const debounceUpdates = utils.debounce(updateSortAndFilters, 750);

  const loadNextPage = async (
    container = $el?.querySelector(`[data-next-url]`),
    paginationContainer = $el?.querySelector(`[data-pagination][x-ref="pagination"]`)
  ) => {
    if (!state.next_url || state.loading) return;

    state.loading = true;
    const html = await utils.fetchFromCache(state.next_url);

    const newDocument = document.createElement("div");
    newDocument.innerHTML = html;

    const section = newDocument.querySelector(`[data-style-id="${$el.getAttribute("data-style-id")}"]`);

    const newContent = section.querySelector(`[data-next-url][x-ref="${container?.getAttribute("x-ref")}"]`);

    state.next_url = newContent?.getAttribute("data-next-url");

    const newPagination = section.querySelector(`[data-pagination][x-ref="pagination"]`);

    if (newContent) {
      container.append(...newContent.children);
      state.count = container?.children?.length;
    }
    if (paginationContainer && newPagination) {
      paginationContainer.innerHTML = newPagination.innerHTML;
    }
    state.loading = false;
  };

  return {
    main_collection: {
      state,
      loadNextPage,
      updateSortAndFilters,
      debounceUpdates,
    },
  };
};

window._sections["initMainCollection"] = initMainCollection;

/* LAST HASH: 8c03891c53d018b01a33be77fb8fafdb62df6c1b */
;

})();

// ---- __section--main_list_collections.js ----
(function(){
"use strict";
const initMainListCollections = ($el) => {
  const state = window.Alpine.reactive({
    loading: false,
    count: $el.querySelector("[data-next-url]")?.children?.length,
    next_url: $el.querySelector("[data-next-url]")?.getAttribute("data-next-url"),
  });

  const loadNextPage = async (
    container = $el.querySelector(`[data-next-url]`),
    paginationContainer = $el.querySelector(`[data-pagination][x-ref="pagination"]`)
  ) => {
    if (!state.next_url || state.loading) return;

    state.loading = true;
    const html = await fetch(state.next_url).then((res) => res.text());

    const newDocument = document.createElement("div");
    newDocument.innerHTML = html;

    const section = newDocument.querySelector(`[data-style-id="${$el.getAttribute("data-style-id")}"]`);

    const newContent = section.querySelector(`[data-next-url][x-ref="${container?.getAttribute("x-ref")}"]`);

    state.next_url = newContent?.getAttribute("data-next-url");

    const newPagination = section.querySelector(`[data-pagination][x-ref="pagination"]`);

    if (newContent) {
      container.append(...newContent.children);
      state.count = container?.children?.length;
    }
    if (paginationContainer && newPagination) {
      paginationContainer.innerHTML = newPagination.innerHTML;
    }
    state.loading = false;
  };

  return {
    main_list_collections: {
      state,
      loadNextPage,
    },
  };
};

window._sections["initMainListCollections"] = initMainListCollections;

/* LAST HASH: bb3e0d513b3a6201f48bf17c237de89048b57f07 */
;

})();

// ---- __section--main_product.js ----
(function(){
"use strict";
const initMainProduct = ($el, $refs, productHandle, productId, variantId, default_select_selling_plan = false) => {
  let initialized = false;
  const random_id = utils.shortUUID();
  const isProductBar = $el.hasAttribute("data-product-bar");
  const preorder_threshold = +(window.theme_settings.data__product__variant__preorder_threshold ?? 1);
  const cart = window.Alpine.store("cart");

  const gallery = $el.querySelector(`[x-ref="gallery"]`);
  const gallerySettings = utils.JSONParse(gallery?.getAttribute("data-settings"));
  const thumbnails = $el.querySelector(`[x-ref="thumbnails"]`);
  const thumbnailSettings = utils.JSONParse(thumbnails?.getAttribute("data-settings"));

  const quickView = $el.hasAttribute("data-quick-view");

  const isPrimary =
    !isProductBar &&
    new RegExp(`^/(products|collections/[^/]*/products)/${encodeURIComponent(productHandle)}`, "gi").test(
      _stores?.router?.pathname ?? ""
    );

  let product = _products[productHandle] ?? _product.getHtmlProduct(productHandle);

  if (!product && productHandle) {
    _product.getProductData(productHandle, productId, isPrimary ? "high" : "auto").then((res) => {
      updateProductState(res, variantId);
    });
  }

  product ??= _products[productHandle];

  if (product && !product._full_data) {
    _product.getHydratedProductData(productHandle, productId).then((res) => {
      if (state.product?.handle === res.handle) {
        state.product = res;
      }
    });
  }

  if (isPrimary && product) {
    product.selected_variant_id = +(new URL(window.location.href).searchParams.get("variant") || variantId);
  }

  const selected_variant = _product.getSelectedVariant(product, variantId);

  const selling_plan_allocations = selected_variant?.selling_plan_allocations;
  const selected_selling_plan =
    default_select_selling_plan || product?.requires_selling_plan ? selling_plan_allocations?.[0]?.selling_plan : null;

  const selected_or_last_used_or_first_selling_plan = selected_selling_plan ?? selling_plan_allocations?.[0]?.selling_plan;

  const selected_selling_plan_discount_wording = getSellingPlanDiscountWording(selected_selling_plan, selected_variant);
  const selling_plan_discount_wording = getSellingPlanDiscountWording(
    selected_or_last_used_or_first_selling_plan,
    selected_variant,
  );

  let discounted_price = selected_variant?.price;
  const price_adjustment =
    selected_selling_plan?.price_adjustments?.[0] ?? selected_or_last_used_or_first_selling_plan?.price_adjustments?.[0];

  if (price_adjustment?.value_type === "fixed_amount") {
    discounted_price = Math.min(discounted_price - Math.round(+price_adjustment?.value), selected_variant?.price);
  }

  if (price_adjustment?.value_type === "percentage") {
    discounted_price = Math.min(
      discounted_price - Math.round((+price_adjustment?.value / 100) * discounted_price),
      selected_variant?.price
    );
  }

  if (price_adjustment?.value_type === "price") {
    discounted_price = Math.min(+price_adjustment?.value, selected_variant?.price);
  }

  const available_quantity =
    selected_variant?.inventory_management === "shopify" && selected_variant?.inventory_policy === "deny"
      ? selected_variant?.inventory_quantity -
        cart?.state?.items?.reduce((acc, line) => (line.variant_id === selected_variant.id ? acc + line.quantity : acc), 0)
      : selected_variant?.preorder && selected_variant?.preorder_quantity
      ? selected_variant?.inventory_quantity +
        selected_variant?.preorder_quantity -
        cart?.state?.items?.reduce((acc, line) => (line.variant_id === selected_variant.id ? acc + line.quantity : acc), 0)
      : 99999;

  const initialMediaId = +(
    (thumbnails ?? gallery)?.querySelector("[data-media-id]")?.getAttribute("data-media-id") ?? product?.media?.[0]?.id
  );

  const state = Alpine.reactive({
    random_id,
    element: $el,
    count: 0,
    manual_discount: 0,
    isPrimary: isPrimary,
    product_handle: productHandle,
    initial_variant_id: variantId,
    images_cleaned: false,
    thumbnail_images_cleaned: false,
    hydrated: !!product,
    variant_changed: false,
    product: product,
    selected_media_id: initialMediaId,
    previous_selected_media_id: initialMediaId,
    properties: {},
    selected_variant,
    selling_plan_allocations,
    selected_selling_plan,
    last_selected_selling_plan: selected_selling_plan,
    selected_selling_plan_discount_wording,
    selling_plan_discount_wording,
    isAdding: false,
    selected_options: selected_variant?.options ?? [],
    quantity: 1,
    sibling_handle: "",
    hasVariants: product?.variants?.length > 1 || product?.variants?.[0]?.title !== "Default Title",
    hasSubscription: !!selected_variant?.options?.length,
    soldOut: available_quantity <= 0,
    available_quantity,
    preorder:
      selected_variant?.preorder &&
      selected_variant?.inventory_quantity -
        cart?.state?.items?.reduce(
          (acc, line) => (line.variant_id === (selected_variant?.id ?? variantId) ? acc + line.quantity : acc),
          0
        ) <
        preorder_threshold,
    gallery_media: product?.media ?? [],
    thumbnail_media: product?.media ?? [],
    selected_price: discounted_price,
    selected_compare_at_price: Math.max(selected_variant?.compare_at_price, selected_variant?.price),
    show_complementary_products: true,
    upsell_total: 0,
    upsell_compare_at_total: 0,
    dynamic_buy_button: null,
    quantity_limit: available_quantity,
    upsell_items: new Map(),
    scrolling_to_image: false,
    addons: new Map(),
  });

  const handleImageSelection = (
    filter_images,

    variant = state.selected_variant
  ) => {
    switch (filter_images) {
      case "show_all": {
        return state.product?.media;
      }
      case "selected_variant": {
        return state.product?.media?.filter((media) => media.id === variant?.featured_media?.id);
      }
      case "show_all_variants": {
        return state.product?.variants.map((v) => v?.featured_media);
      }
      case "variant_images_by_order": {
        let hide = true;

        return state.product?.media?.filter((media) => {
          if (media.id === variant?.featured_media?.id) {
            hide = false;
          }

          if (state.product?.variants.map((v) => v?.featured_media?.id).includes(media.id)) {
            hide = true;
          }
          return !hide;
        });
      }
      case "variant_images_by_metafield": {
        return [
          ...(state.product?.media?.filter((media) => media.id === variant?.featured_media?.id) ?? []),
          ...(state.selected_variant?.metafields?.smart?.images ?? []),
        ];
      }
      case "variant_images_and_unassigned": {
        return [
          ...(state.product?.media?.filter((media) => media.id === variant?.featured_media?.id) ?? []),
          ...(state.product?.media?.filter(
            (media) => !state.product?.variants.map((v) => v?.featured_media?.id).includes(media.id)
          ) ?? []),
        ];
      }
      case "only_unassigned": {
        return state.product?.media?.filter(
          (media) => !state.product?.variants.map((v) => v?.featured_media?.id).includes(media.id)
        );
      }
      case "first_or_selected_image": {
        return state.product?.media?.filter((media) => media.id === state.selected_media_id);
      }
    }
  };

  const scrollToMediaById = async (mediaId, scrollContainer = gallery?.firstElementChild) => {
    const isHorizontal = () => {
      return !!(
        getComputedStyle(scrollContainer).overflowY === "hidden" ||
        getComputedStyle(scrollContainer).gridAutoFlow === "column" ||
        scrollContainer.scrollWidth > scrollContainer?.clientWidth
      );
    };
    await utils.delay(5);

    const image = scrollContainer?.querySelector(`[data-media-id="${mediaId}"]`);

    if (!image) return;

    if (state.selected_media_id !== mediaId) {
      state.previous_selected_media_id = state.selected_media_id;
    }
    state.selected_media_id = mediaId;
    await utils.delay(1);
    state.scrolling_to_image = true;

    const header = document.querySelector(".header-sections-container");
    const offsetHeight = Math.max(180, header?.getBoundingClientRect()?.bottom ?? 0);
    const imageOffset = utils.getElementPosition(image);

    await utils.delay(20);

    if (utils.isElementScrollable(scrollContainer)) {
      let scrollSnap = false;
      if (["snap-both", "snap-x", "snap-y"].some((c) => scrollContainer?.classList?.contains(c))) {
        scrollContainer?.classList.remove("snap-both", "snap-x", "snap-y");
        scrollSnap = true;
      }
      utils.scrollToXY(200, image.offsetLeft, image.offsetTop, scrollContainer, () => {
        if (scrollSnap) {
          scrollContainer?.classList.add(isHorizontal() ? "snap-x" : "snap-y");
        }
        state.selected_media_id = mediaId;
      });
      return;
    }

    if (scrollContainer.closest("[data-modal-id]")) return;

    utils.scrollToXY(
      200,
      image.offsetLeft,
      imageOffset.top - offsetHeight - +getComputedStyle(scrollContainer).paddingTop.replace("px", ""),
      window,
      () => {
        state.selected_media_id = mediaId;
      }
    );
  };

  const handleAddToCart = async (e, openCartDrawer = true) => {
    const random_id = utils.shortUUID();

    const properties = {};
    const form =
      $el.tagName === "FORM"
        ? $el
        : document.querySelector(`form[data-product-handle="${state.product?.handle ?? productHandle}"]`);
    const giftItemBlockId = $el.closest("[data-gift-with-purchase]")?.getAttribute("data-gift-with-purchase");
    const isHiddenItem = !!$el.closest("[data-hide-in-cart]");

    if (giftItemBlockId) {
      properties["_gift_with_purchase"] = giftItemBlockId;
    }
    if (isHiddenItem) {
      properties["_p_hidden"] = "true";
    }

    if (state.upsell_items.size && [...state.upsell_items.values()]?.some((item) => item.bundle)) {
      properties["_p_id"] = `${random_id}`;
    }

    if (properties?.["__shopify_send_gift_card_to_recipient"] && !utils.isEmail(properties?.["Recipient email"])) {
      utils.validateFormAndToast(form);
      return;
    }

    if (state.selected_variant?.preorder && state.selected_variant?.inventory_quantity < preorder_threshold) {
      properties["Preorder"] = `true`;
      if (state.selected_variant?.preorder_date) {
        properties["Preorder"] = `Shipping ${new Date(state.selected_variant.preorder_date).toLocaleDateString(
          navigator.language,
          {
            month: "short",
            year: "numeric",
          }
        )}`;
      }
    }

    if (form) {
      Object.entries(utils.serializeForm(form))?.forEach(([key, value]) => {
        if (key.includes("properties[") && value) {
          properties[key.replace(/^properties\[(.*)]$/gi, "$1")] = value;
        }
      });
    }

    e?.preventDefault();
    e?.stopPropagation();
    state.isAdding = true;
    const data = await _cart.add({
      items: [
        {
          id: state.selected_variant.id,
          quantity: state.quantity,
          selling_plan: cart.global_subscriptions
            ? state.selling_plan_allocations?.find((plan) => plan.selling_plan?.id === cart.cart_selling_plan_id)?.selling_plan
                ?.id
            : state.selected_selling_plan?.id,
          properties: {
            ...properties,
            ...state.properties,
          },
        },
        ...[...state.upsell_items.values()].map((entry) => ({
          id: entry.id,
          selling_plan: cart.global_subscriptions
            ? state.selling_plan_allocations?.find((plan) => plan.selling_plan?.id === cart.cart_selling_plan_id)?.selling_plan
                ?.id
            : entry.variant?.selling_plan_allocations?.find((plan) => plan.selling_plan?.id === state.selected_selling_plan?.id)
                ?.selling_plan?.id,
          ...(entry?.bundle
            ? {
                parent_id: state.selected_variant.id,
              }
            : {}),
          quantity: state.quantity * entry.quantity,
          properties: {
            ...entry.properties,
            _p_id_link: entry?.bundle ? `${random_id}` : undefined,
            _p_required: entry?.auto_addon ? "true" : undefined,
            _p_fixed_quantity: !entry?.variable_quantity ? "true" : undefined,
            Preorder:
              entry?.variant?.preorder && entry?.variant?.inventory_quantity < preorder_threshold
                ? entry?.variant?.preorder_date
                  ? `Shipping ${new Date(entry?.variant.preorder_date).toLocaleDateString(navigator.language, {
                      month: "short",
                      year: "numeric",
                    })}`
                  : "true"
                : undefined,
          },
        })),
      ],
    });

    state.isAdding = false;

    if (!data.cart_error && openCartDrawer) {
      _stores.modal.setId("modal--cart-drawer");
      _stores.quickView.show = false;
    }
  };

  const handleBackInStockNotification = async (e) => {
    if (state?.selected_variant?.available) return;
    e.preventDefault();
    e.stopPropagation();
    _stores.modal.setId("back_in_stock");
    _stores.backInStockNotification.product = state.product;
    _stores.backInStockNotification.selected_variant = state.selected_variant;
  };

  const setSelectedVariant = (id, scroll_to_variant = true) => {
    state.selected_variant = state.product.variants?.find((variant) => variant.id === id);
    state.selected_options = state.selected_variant?.options;
    state.variant_changed = true;
    state.selling_plan_allocations = state.selected_variant.selling_plan_allocations;

    if (
      state.selected_selling_plan &&
      !state.selling_plan_allocations?.some((plan) => plan?.selling_plan?.id === state.selected_selling_plan?.id)
    ) {
      state.selected_selling_plan =
        state.selling_plan_allocations?.find((plan) => plan.selling_plan.name === state.last_selected_selling_plan?.name)
          ?.selling_plan ??
        state.selling_plan_allocations?.[0]?.selling_plan ??
        null;
      state.last_selected_selling_plan = state.selected_selling_plan;
    }

    if (!state.selling_plan_allocations?.some((plan) => plan?.selling_plan?.id === state.last_selected_selling_plan?.id)) {
      state.last_selected_selling_plan = undefined;
    }

    if (state.product.requires_selling_plan && !state.selected_selling_plan) {
      state.selected_selling_plan =
        state.selling_plan_allocations?.[0]?.selling_plan ?? state.product.selling_plan_groups?.[0]?.selling_plans?.[0];
    }

    const selected_or_last_used_or_first_selling_plan =
      state.last_selected_selling_plan ?? state.selling_plan_allocations?.[0]?.selling_plan;

    state.selected_selling_plan_discount_wording = getSellingPlanDiscountWording(
      state.selected_selling_plan,
      state.selected_variant,
    );
    state.selling_plan_discount_wording = getSellingPlanDiscountWording(
      selected_or_last_used_or_first_selling_plan,
      state.selected_variant,
    );

    if (gallerySettings?.scroll_to_selected_variant_image && state.selected_variant?.featured_media?.id && scroll_to_variant) {
      scrollToMediaById(state.selected_variant?.featured_media?.id);
    }

    _product.lastOptions = {
      ...(_product.lastOptions ?? {}),
      ...(state.product.options_with_values?.reduce((acc, option, index) => {
        acc[utils.handlelize(option?.name)] = state.selected_options[index];
        return acc;
      }, {}) ?? {}),
    };
    setTimeout(() => {
      sessionStorage.setItem("_p_last_options", JSON.stringify(_product.lastOptions));
    });
  };

  const setProductOption = ({ index, value }) => {
    const options = [...state.selected_options];
    options[index] = value;

    setSelectedVariant(
      state.product?.variants?.find((variant) => variant.options.every((option, i) => options[i] === option))?.id ??
        state.product?.variants?.find((variant) => variant.options[index] === value)?.id ??
        state.product?.variants?.find(({ available }) => available)?.id ??
        state.product?.variants?.[0]?.id
    );
  };

  const setSellingPlan = (selling_plan_id) => {
    state.selected_selling_plan = state.selling_plan_allocations.find(
      (allocation) => allocation.selling_plan.id === selling_plan_id
    )?.selling_plan;

    if (state.selected_selling_plan) {
      state.last_selected_selling_plan = state.selected_selling_plan;
    }

    const selected_or_last_used_or_first_selling_plan =
      state.last_selected_selling_plan ?? state.selling_plan_allocations?.[0]?.selling_plan;

    state.selected_selling_plan_discount_wording = getSellingPlanDiscountWording(
      state.selected_selling_plan,
      state.selected_variant,
    );
    state.selling_plan_discount_wording = getSellingPlanDiscountWording(
      selected_or_last_used_or_first_selling_plan,
      state.selected_variant,
    );
  };

  const showMediaGallery = (mediaId) => {
    const mediaElements = [...(gallery?.querySelectorAll("[data-media-id]") ?? [])].map((element) => ({
      element,
      mediaId: +element.getAttribute("data-media-id"),
      media:
        state.product?.media?.find((media) => media.id === +element.getAttribute("data-media-id")) ??
        state.product?.variants
          ?.find((v) => v.metafields?.smart?.images?.some((image) => image.id === +element.getAttribute("data-media-id")))
          ?.metafields?.smart?.images?.find((image) => image.id === +element.getAttribute("data-media-id")),
    }));

    const thumbnailMediaElements = [...(thumbnails?.querySelectorAll("[data-media-id]") ?? [])].map((element) => ({
      element,
      mediaId: +element.getAttribute("data-media-id"),
      media:
        state.product?.media?.find((media) => media.id === +element.getAttribute("data-media-id")) ??
        state.product?.variants
          ?.find((v) => v.metafields?.smart?.images?.some((image) => image.id === +element.getAttribute("data-media-id")))
          ?.metafields?.smart?.images?.find((image) => image.id === +element.getAttribute("data-media-id")),
    }));

    const mediaItems = mediaElements
      ?.filter(
        (item) =>
          (getComputedStyle(item.element)?.display !== "none" ||
            getComputedStyle(thumbnailMediaElements?.find((img) => img.mediaId === item.mediaId)?.element)?.display !== "none") &&
          item.media
      )
      ?.filter((a, i, arr) => arr.findIndex((b) => b.mediaId === a.mediaId) === i)
      ?.map((item) => item.media);

    const index = mediaItems.findIndex((item) => item.id === mediaId);

    _stores.mediaGallery.showGallery({
      media: mediaItems,
      index,
    });
  };

  const getDiscountLabel = (type) => {
    const price = state.selected_variant?.price ?? 0;
    const compare_at_price = state.selected_variant?.compare_at_price ?? 0;

    if (compare_at_price <= price) {
      return "";
    }

    switch (type) {
      case "sale": {
        return "Sale";
      }
      case "percentage": {
        return `${Math.round(((compare_at_price - price) * 100) / compare_at_price)}% off`;
      }
      case "value": {
        return `Save ${utils.formatMoney(
          compare_at_price - price,
          window?.money_format?.replace(/\{(\s*)amount(\s*)}/gi, "{$1amount_no_decimals$2}")
        )}`;
      }
      default: {
        return "";
      }
    }
  };

  const hasAvailableVariant = (index, value) => {
    return state?.product?.variants?.some((variant) => {
      switch (index) {
        case 0: {
          return variant.options[index] === value && variant.available;
        }
        case 1: {
          return variant.options[0] === state?.selected_options[0] && variant.options[index] === value && variant.available;
        }
        case 2: {
          return (
            variant.options[0] === state?.selected_options[0] &&
            variant.options[1] === state?.selected_options[1] &&
            variant.options[index] === value &&
            variant.available
          );
        }
      }
      return false;
    });
  };

  const updateProductState = (product, selectedVariantId, selectedSellingPlanId) => {
    const selected_variant = _product.getSelectedVariant(product, selectedVariantId);

    const selling_plan_allocations = selected_variant?.selling_plan_allocations;

    const selected_selling_plan = selectedSellingPlanId
      ? selling_plan_allocations?.find((plan) => plan.selling_plan.id === selectedSellingPlanId)?.selling_plan
      : default_select_selling_plan
      ? selling_plan_allocations?.[0]?.selling_plan
      : null;

    if (selected_selling_plan) {
      state.last_selected_selling_plan = selected_selling_plan;
    }
    if (
      !selected_variant?.selling_plan_allocations?.some((plan) => plan?.selling_plan?.id === state.last_selected_selling_plan?.id)
    ) {
      state.last_selected_selling_plan = undefined;
    }

    const selected_or_last_used_or_first_selling_plan =
      state.last_selected_selling_plan ?? selling_plan_allocations?.[0]?.selling_plan;

    const selected_selling_plan_discount_wording = getSellingPlanDiscountWording(selected_selling_plan, selected_variant);
    const selling_plan_discount_wording = getSellingPlanDiscountWording(
      selected_or_last_used_or_first_selling_plan,
      selected_variant,
    );

    state.product_handle = product?.handle ?? state.product_handle ?? productHandle;
    state.product = product;

    const initialMediaId = +(
      (thumbnails ?? gallery)?.querySelector("[data-media-id]")?.getAttribute("data-media-id") ?? product?.media?.[0]?.id
    );

    if (state.selected_media_id !== initialMediaId) {
      state.previous_selected_media_id = state.selected_media_id;
    }
    state.selected_media_id = initialMediaId;
    state.properties = {};
    state.selected_variant = selected_variant;
    state.selling_plan_allocations = selling_plan_allocations;
    state.selected_selling_plan = selected_selling_plan;
    state.selected_selling_plan_discount_wording = selected_selling_plan_discount_wording;
    state.selling_plan_discount_wording = selling_plan_discount_wording;
    state.isAdding = false;
    state.selected_options = selected_variant?.options;
    state.quantity = 1;
    state.sibling_handle = "";
    state.gallery_media = product?.media;
    state.hydrated = true;

    setTimeout(
      () => {
        $el.querySelectorAll("[x-ignore]:not([x-defer])").forEach((child) => {
          if (!document.contains(child)) return;
          utils.initializeIgnoredAlpineTree(child);
        });
      },
      initialized ? 2 : 50
    );
  };

  const handleAddAddonsToCart = async () => {
    state.isAdding = true;
    const random_id = utils.shortUUID();

    const data = await _cart.add({
      items: [
        ...[...state.addons.values()].map((entry) => ({
          id: entry.id,
          selling_plan: null,
          quantity: entry.quantity,
          properties: {
            _bundle_id: random_id,
          },
        })),
      ],
    });

    state.isAdding = false;
    if (!data.cart_error) {
      _stores.modal.setId("modal--cart-drawer");
      _stores.quickView.show = false;
    }
  };

  const getCTAButtonProps = (el, preview) => {
    let attribute =
      el.hasAttribute("data-sold-out-action") && state.soldOut
        ? "sold-out-"
        : el.hasAttribute("data-preorder-action") && state.preorder
        ? "preorder-"
        : el.hasAttribute("data-subscription-action") && state.hasSubscription
        ? "subscription-"
        : el.hasAttribute("data-variant-action") && state.hasVariants
        ? "variant-"
        : "";

    if (preview) {
      switch (preview) {
        case "default":
          attribute = "";
          break;
        case "variant":
          attribute = "variant-";
          break;
        case "subscription":
          attribute = "";
          break;
        case "out_of_stock":
          attribute = "sold-out-";
          break;
        default:
          attribute = "";
      }
    }
    el.classList.remove(...el.classList);
    el.classList.add("w-full", ...(el.getAttribute(`data-${attribute}class`).split(" ") ?? []));

    return {
      content: utils.richtextWithPrices(
        el.getAttribute(`data-${attribute}content`),
        state?.selected_variant?.price,
        state.selected_variant?.compare_at_price
      ),
      action: el.getAttribute(`data-${attribute}action`),
      classes: el.getAttribute(`data-${attribute}class`),
      product_modal_handle: el.getAttribute(`data-${attribute}product-modal-handle`),
    };
  };

  const setDynamicPrice = ({
    discount = state.manual_discount,
    selected_variant = state.selected_variant,
    selling_plan = state.selected_selling_plan,
  }) => {
    let discounted_price = selected_variant?.price;
    const price_adjustment = selling_plan?.price_adjustments?.[0];

    if (price_adjustment?.value_type === "fixed_amount") {
      discounted_price = Math.min(discounted_price - Math.round(+price_adjustment?.value), selected_variant?.price);
    }

    if (price_adjustment?.value_type === "percentage") {
      discounted_price = Math.min(
        discounted_price - Math.round((+price_adjustment?.value / 100) * discounted_price),
        selected_variant?.price
      );
    }

    if (price_adjustment?.value_type === "price") {
      discounted_price = Math.min(+price_adjustment?.value, selected_variant?.price);
    }

    if (discount) {
      discounted_price = Math.min(discounted_price - Math.round((discount / 100) * discounted_price), selected_variant?.price);
    }

    let upsell_price_total = 0;
    let upsell_compare_at_price_total = 0;
    let upsell_triggered_quantity_limit = 9999999;

    state.upsell_items.forEach((value) => {
      let upsell_d_price = value?.variant?.price;
      if (state.selected_selling_plan) {
        const upsell_price_adjustment = value?.variant?.selling_plan_allocations?.find(
          (plan) => plan.selling_plan.id === state.selected_selling_plan.id
        )?.selling_plan?.price_adjustments?.[0];

        if (upsell_price_adjustment?.value_type === "fixed_amount") {
          upsell_d_price = Math.min(upsell_d_price - Math.round(+price_adjustment?.value), value?.variant?.price);
        }

        if (upsell_price_adjustment?.value_type === "percentage") {
          upsell_d_price = Math.min(
            upsell_d_price - Math.round((+price_adjustment?.value / 100) * discounted_price),
            value?.variant?.price
          );
        }

        if (upsell_price_adjustment?.value_type === "price") {
          upsell_d_price = Math.min(
            upsell_d_price - Math.round((+price_adjustment?.value / 100) * discounted_price),
            value?.variant?.price
          );
        }
      }

      const upsell_available_quantity =
        value?.variant?.inventory_management === "shopify" && value?.variant?.inventory_policy === "deny"
          ? value?.variant?.inventory_quantity -
            cart?.state?.items?.reduce((acc, line) => (line.variant_id === selected_variant.id ? acc + line.quantity : acc), 0)
          : 999999;

      const maxMultiplier = Math.floor(upsell_available_quantity / value.quantity);

      upsell_triggered_quantity_limit = Math.min(upsell_triggered_quantity_limit, maxMultiplier);

      upsell_price_total += upsell_d_price * value.quantity;
      upsell_compare_at_price_total += Math.max(value?.variant?.compare_at_price, value?.variant?.price) * value.quantity;
    });

    state.quantity = Math.max(1, Math.min(state.quantity, state.available_quantity, upsell_triggered_quantity_limit));
    state.quantity_limit = Math.min(state.available_quantity, upsell_triggered_quantity_limit);

    state.upsell_total = upsell_price_total * state.quantity;
    state.upsell_compare_at_total = upsell_compare_at_price_total * state.quantity;

    state.selected_price = discounted_price;
    state.selected_compare_at_price = Math.max(selected_variant?.compare_at_price, selected_variant?.price);

    if (discount !== state.manual_discount) {
      state.manual_discount = discount;
    }
    if (selling_plan?.id !== state?.selected_selling_plan?.id) {
      setSellingPlan(selling_plan?.id);
    }
    if (selected_variant?.id !== state?.selected_variant?.id) {
      setSelectedVariant(selected_variant?.id);
    }
  };

  const mutationObserver = new MutationObserver((e) => {
    e?.forEach((record) => {
      const nodes = [];

      record?.addedNodes?.forEach((node) => {
        if (node instanceof HTMLInputElement && node?.tagName === "INPUT" && node.name === "selling_plan" && node.value) {
          setSellingPlan(+node.value);
        }
      });
    });
  });
  mutationObserver.observe($el, { childList: true, subtree: true });

  const setSiblingProduct = (handle, quickView) => {
    if (handle === state.product.handle) return;
    _product.lastOptions = {
      ...(_product.lastOptions ?? {}),
      ...(state.product.options_with_values?.reduce((acc, option, index) => {
        acc[utils.handlelize(option?.name)] = state.selected_options[index];
        return acc;
      }, {}) ?? {}),
    };
    setTimeout(() => {
      sessionStorage.setItem("_p_last_options", JSON.stringify(_product.lastOptions));
    });
    if (quickView) {
      _stores.quickView.renderQuickView(handle);
      return;
    }

    barba.go(utils.getSiblingUrl(handle));
  };

  const handlePopState = (e) => {
    const url = new URL(window.location.href);
    const selling_plan_id = +url.searchParams.get("selling_plan");
    const variant_id = +url.searchParams.get("variant");

    if (!variant_id) return;

    if (state.selected_variant?.id !== variant_id) {
      state.selected_variant = state.product?.variants?.find((variant) => variant.id === variant_id) ?? state.selected_variant;
      state.selected_options = state.selected_variant?.options;
    }

    if (selling_plan_id !== state.selected_selling_plan?.id) {
      state.selected_selling_plan =
        state.selling_plan_allocations?.find((plan) => plan.selling_plan.id === selling_plan_id)?.selling_plan ??
        state.selected_selling_plan;
    }
  };

  const styleDynamicBuyButton = (element) => {
    const previewButton = element.querySelector("[data-pre-styled-button]");

    element.style.setProperty("--shopify-accelerated-checkout-button-block-size", getComputedStyle(previewButton)?.height);
    element.style.setProperty(
      "--shopify-accelerated-checkout-button-border-radius",
      getComputedStyle(previewButton)?.borderRadius
    );
    previewButton.remove();
  };

  function getSellingPlanDiscountWording(sellingPlan, selectedVariant) {
    const priceAdjustment = sellingPlan?.price_adjustments?.[0];

    if (!priceAdjustment?.value || !+priceAdjustment.value) {
      return "";
    }

    switch (priceAdjustment.value_type) {
      case "fixed_amount":
        return utils.formatMoney(priceAdjustment.value);

      case "percentage": {
        if (selectedVariant?.compare_at_price > selectedVariant?.price) {
          const percentage =
            1 -
            Math.round(((selectedVariant.compare_at_price - selectedVariant.price) * 100) / selectedVariant.compare_at_price) /
              100;
          const subscriptionPercentage = 1 - priceAdjustment.value / 100;
          const totalDiscount = Math.round(
            (1 - (percentage > 0 ? percentage : 1) * (subscriptionPercentage > 0 ? subscriptionPercentage : 1)) * 100,
          );
          return `${totalDiscount}%`;
        }

        return `${priceAdjustment.value}%`;
      }

      case "price":
        return utils.formatMoney(selectedVariant?.price - priceAdjustment.value);

      default:
        return "";
    }
  }

  if (product) {
    setTimeout(() => {
      $el.querySelectorAll("[x-ignore]:not([x-defer])").forEach((child) => {
        if (!document.contains(child)) return;
        utils.initializeIgnoredAlpineTree(child);
      });
    }, 2);
  }

  if (state.isPrimary) {
    Alpine.store("main_product", {
      state,
      pdp: state,
      ...utils.spreadGenericCardFunctions(state),
      handleAddToCart,
      handleBackInStockNotification,
      styleDynamicBuyButton,
      setSelectedVariant,
      setProductOption,
      setSiblingProduct,
      setSellingPlan,
      scrollToMediaById,
      getDiscountLabel,
      getCTAButtonProps,
      updateProductState,
      setDynamicPrice,
      handleImageSelection,
    });

    const main_product = Alpine.store("main_product");
    Alpine.magic("main_product", () => main_product);
    window._stores["main_product"] = main_product;
  }

  Alpine.effect(() => {
    if (state.selected_variant?.id && state.selected_variant?.id !== state.initial_variant_id) {
      setTimeout(() => {
        $el.querySelectorAll("[x-ignore]:not([x-defer])").forEach((child) => {
          if (!document.contains(child)) return;
          utils.initializeIgnoredAlpineTree(child);
        });
      }, 2);
    }
  });

  Alpine.effect(() => {
    if (!document.contains($el)) return;
    state.isPrimary =
      !isProductBar &&
      new RegExp(`^/(products|collections/[^/]*/products)/${encodeURIComponent(productHandle)}`, "gi").test(
        _stores?.router?.pathname
      );

    if (state?.isPrimary && !window.design_mode) {
      window.onpopstate = handlePopState;

      const url = new URL(window.location.href);
      const selling_plan_id = +url.searchParams.get("selling_plan") || undefined;
      const variant_id = +url.searchParams.get("variant") || undefined;

      const remove = [];
      if (!state.selected_variant?.id) {
        remove.push("variant");
      }
      if (!state.selected_selling_plan?.id) {
        remove.push("selling_plan");
      }

      if (window?.event?.type === "popstate") {
        return;
      }

      // @ts-ignore
      if (!initialized || window?.event?.barba_redirect) {
        if (product?.handle !== state?.product?.handle) {
          state.product = product;
          state.upsell_items = new Map();
        }
        if (variant_id !== state.selected_variant?.id) {
          state.selected_variant = _product.getSelectedVariant(product, variant_id);

          const initialMediaId = +(
            (thumbnails ?? gallery)?.querySelector("[data-media-id]")?.getAttribute("data-media-id") ?? product?.media?.[0]?.id
          );

          if (state.selected_media_id !== initialMediaId) {
            state.previous_selected_media_id = state.selected_media_id;
          }
          state.selected_media_id = initialMediaId;
          state.properties = {};
          state.selling_plan_allocations = selling_plan_allocations;

          let discounted_price = state.selected_variant?.price;
          const price_adjustment = state.selected_selling_plan?.price_adjustments?.[0];

          if (price_adjustment?.value_type === "fixed_amount") {
            discounted_price = Math.min(discounted_price - Math.round(+price_adjustment?.value), state.selected_variant?.price);
          }

          if (price_adjustment?.value_type === "percentage") {
            discounted_price = Math.min(
              discounted_price - Math.round((+price_adjustment?.value / 100) * discounted_price),
              state.selected_variant?.price
            );
          }

          if (price_adjustment?.value_type === "price") {
            discounted_price = Math.min(+price_adjustment?.value, state.selected_variant?.price);
          }

          if (state.manual_discount) {
            discounted_price = Math.min(
              discounted_price - Math.round((state.manual_discount / 100) * discounted_price),
              state.selected_variant?.price
            );
          }

          let upsell_price_total = 0;
          let upsell_compare_at_price_total = 0;
          let upsell_triggered_quantity_limit = 9999999;

          state.upsell_items.forEach((value) => {
            let upsell_d_price = value?.variant?.price;
            if (state.selected_selling_plan) {
              const upsell_price_adjustment = value?.variant?.selling_plan_allocations?.find(
                (plan) => plan.selling_plan.id === state.selected_selling_plan.id
              )?.selling_plan?.price_adjustments?.[0];

              if (upsell_price_adjustment?.value_type === "fixed_amount") {
                upsell_d_price = Math.min(upsell_d_price - Math.round(+price_adjustment?.value), value?.variant?.price);
              }

              if (upsell_price_adjustment?.value_type === "percentage") {
                upsell_d_price = Math.min(
                  upsell_d_price - Math.round((+price_adjustment?.value / 100) * discounted_price),
                  value?.variant?.price
                );
              }

              if (upsell_price_adjustment?.value_type === "price") {
                upsell_d_price = Math.min(+price_adjustment?.value, value?.variant?.price);
              }
            }

            const upsell_available_quantity =
              value?.variant?.inventory_management === "shopify" && value?.variant?.inventory_policy === "deny"
                ? value?.variant?.inventory_quantity -
                  cart?.state?.items?.reduce(
                    (acc, line) => (line.variant_id === (state.selected_variant?.id ?? variantId) ? acc + line.quantity : acc),
                    0
                  )
                : 999999;

            const maxMultiplier = Math.floor(upsell_available_quantity / value.quantity);

            upsell_triggered_quantity_limit = Math.min(upsell_triggered_quantity_limit, maxMultiplier);

            upsell_price_total += upsell_d_price * value.quantity;
            upsell_compare_at_price_total += Math.max(value?.variant?.compare_at_price, value?.variant?.price) * value.quantity;
          });

          state.quantity = Math.max(1, Math.min(state.quantity, state.available_quantity, upsell_triggered_quantity_limit));
          state.quantity_limit = Math.min(state.available_quantity, upsell_triggered_quantity_limit);

          state.upsell_total = upsell_price_total * state.quantity;
          state.upsell_compare_at_total = upsell_compare_at_price_total * state.quantity;

          state.selected_price = discounted_price;
          state.selected_compare_at_price = Math.max(state.selected_variant?.compare_at_price, state.selected_variant?.price);
          state.dynamic_buy_button = null;
          state.selected_options = state.selected_variant?.options;
        }

        if (selling_plan_id !== state.selected_selling_plan?.id) {
          state.selected_selling_plan = state.selling_plan_allocations?.find((plan) => plan.selling_plan_id === selling_plan_id)
            ?.selling_plan;
        }

        return;
      }

      if (selling_plan_id !== state.selected_selling_plan?.id || variant_id !== state.selected_variant?.id) {
        url.searchParams.set("selling_plan", `${state.selected_selling_plan?.id}`);
        url.searchParams.set("variant", `${state.selected_variant?.id}`);
        remove.forEach((key) => {
          url.searchParams.delete(key);
        });

        /* @ts-ignore */
        barba.history.add(url.toString(), "barba", !variant_id ? "replace" : "replace");
      }
    }
  });

  Alpine.effect(() => {
    if (state.dynamic_buy_button) {
      state.dynamic_buy_button.disabled = !state.selected_variant?.available;

      if (!state.dynamic_buy_button?.hasAttribute("data-no-out-of-stock")) {
        state.dynamic_buy_button.classList.toggle("dynamic-buy-button-out-of-stock", !state.selected_variant?.available);
      }
    }
  });

  Alpine.effect(() => {
    if (quickView) {
      Shopify?.PaymentButton?.init();
    }
  });

  Alpine.effect(() => {
    let discounted_price = state.selected_variant?.price;
    const price_adjustment = state.selected_selling_plan?.price_adjustments?.[0];

    const product = state.product;
    const selected_variant = state.selected_variant;

    state.hasVariants = product?.variants?.length > 1 || product?.variants?.[0]?.title !== "Default Title";
    state.hasSubscription = !!selected_variant?.options?.length;

    state.available_quantity =
      selected_variant?.inventory_management === "shopify" && selected_variant?.inventory_policy === "deny"
        ? selected_variant?.inventory_quantity -
          cart?.state?.items?.reduce(
            (acc, line) => (line.variant_id === (selected_variant?.id ?? variantId) ? acc + line.quantity : acc),
            0
          )
        : selected_variant?.preorder && selected_variant?.preorder_quantity
        ? selected_variant?.inventory_quantity +
          selected_variant?.preorder_quantity -
          cart?.state?.items?.reduce(
            (acc, line) => (line.variant_id === (selected_variant?.id ?? variantId) ? acc + line.quantity : acc),
            0
          )
        : 99999;

    state.soldOut = state.available_quantity <= 0;

    state.preorder =
      selected_variant?.preorder &&
      selected_variant?.inventory_quantity -
        cart?.state?.items?.reduce(
          (acc, line) => (line.variant_id === (selected_variant?.id ?? variantId) ? acc + line.quantity : acc),
          0
        ) <
        preorder_threshold;

    state.gallery_media = handleImageSelection(gallerySettings?.filter_images, selected_variant);
    state.thumbnail_media = handleImageSelection(thumbnailSettings?.thumbnail_filter_images, selected_variant);

    if (price_adjustment?.value_type === "fixed_amount") {
      discounted_price = Math.min(discounted_price - Math.round(+price_adjustment?.value), state.selected_variant?.price);
    }

    if (price_adjustment?.value_type === "percentage") {
      discounted_price = Math.min(
        discounted_price - Math.round((+price_adjustment?.value / 100) * discounted_price),
        state.selected_variant?.price
      );
    }

    if (price_adjustment?.value_type === "price") {
      discounted_price = Math.min(+price_adjustment?.value, state.selected_variant?.price);
    }

    if (state.manual_discount) {
      discounted_price = Math.min(
        discounted_price - Math.round((state.manual_discount / 100) * discounted_price),
        state.selected_variant?.price
      );
    }

    let upsell_price_total = 0;
    let upsell_compare_at_price_total = 0;
    let upsell_triggered_quantity_limit = 9999999;

    state.upsell_items.forEach((value) => {
      let upsell_d_price = value?.variant?.price;
      if (state.selected_selling_plan) {
        const upsell_price_adjustment = value?.variant?.selling_plan_allocations?.find(
          (plan) => plan.selling_plan.id === state.selected_selling_plan.id
        )?.selling_plan?.price_adjustments?.[0];

        if (upsell_price_adjustment?.value_type === "fixed_amount") {
          upsell_d_price = Math.min(upsell_d_price - Math.round(+price_adjustment?.value), value?.variant?.price);
        }

        if (upsell_price_adjustment?.value_type === "percentage") {
          upsell_d_price = Math.min(
            upsell_d_price - Math.round((+price_adjustment?.value / 100) * discounted_price),
            value?.variant?.price
          );
        }

        if (upsell_price_adjustment?.value_type === "price") {
          upsell_d_price = Math.min(+price_adjustment?.value, value?.variant?.price);
        }
      }

      const upsell_available_quantity =
        value?.variant?.inventory_management === "shopify" && value?.variant?.inventory_policy === "deny"
          ? value?.variant?.inventory_quantity -
            cart?.state?.items?.reduce((acc, line) => (line.variant_id === selected_variant.id ? acc + line.quantity : acc), 0)
          : value.variant?.preorder && value.variant?.preorder_quantity
          ? value.variant?.inventory_quantity +
            value.variant?.preorder_quantity -
            cart?.state?.items?.reduce((acc, line) => (line.variant_id === value.variant.id ? acc + line.quantity : acc), 0)
          : 99999;

      const maxMultiplier = Math.floor(upsell_available_quantity / value.quantity);

      upsell_triggered_quantity_limit = Math.min(upsell_triggered_quantity_limit, maxMultiplier);

      upsell_price_total += upsell_d_price * value.quantity;
      upsell_compare_at_price_total += Math.max(value?.variant?.compare_at_price, value?.variant?.price) * value.quantity;
    });

    state.quantity = Math.max(1, Math.min(state.quantity, state.available_quantity, upsell_triggered_quantity_limit));
    state.quantity_limit = Math.min(state.available_quantity, upsell_triggered_quantity_limit);

    state.upsell_total = upsell_price_total * state.quantity;
    state.upsell_compare_at_total = upsell_compare_at_price_total * state.quantity;

    state.selected_price = discounted_price;
    state.selected_compare_at_price = Math.max(state.selected_variant?.compare_at_price, state.selected_variant?.price);
  });

  initialized = true;

  return {
    state,
    pdp: state,
    ...utils.spreadGenericCardFunctions(state),
    showMediaGallery,
    handleAddToCart,
    handleBackInStockNotification,
    styleDynamicBuyButton,
    setSelectedVariant,
    setProductOption,
    setSiblingProduct,
    setSellingPlan,
    scrollToMediaById,
    hasAvailableVariant,
    getDiscountLabel,
    getCTAButtonProps,
    updateProductState,
    setDynamicPrice,
    handleImageSelection,
    handleAddAddonsToCart,
  };
};

window._sections["initMainProduct"] = initMainProduct;

})();

// ---- __section--main_search.js ----
(function(){
"use strict";
const initMainSearch = ($el, type, current_sort) => {
  const state = window.Alpine.reactive({
    loading: false,
    types: new Set(type.split(",")),
    count: $el.querySelector("[data-next-url]")?.children?.length,
    sort_by: current_sort,
    next_url: $el.querySelector("[data-next-url]")?.getAttribute("data-next-url"),
  });

  const modalStore = window.Alpine.store("modal");
  const search = window.Alpine.store("search");

  Alpine.effect(() => {
    if (state.sort_by !== current_sort) {
      Alpine.nextTick(() => {
        updateSortAndFilters();
      });
    }
  });

  const updateSortAndFilters = async (
    url = new URL(`${$el.action?.split("?")[0]}?${new URLSearchParams(new FormData($el)).toString()}`)
  ) => {
    modalStore.setId("");
    state.loading = true;
    document
      ?.querySelectorAll(
        "form[data-search-form] :where([class^=product-card--], [class^=collection-card--], [class^=article-card--], [class^=blog-card--], [class^=page-card--])"
      )
      ?.forEach((card) => {
        card?.classList?.add("button-loading-transparent");
      });

    const content = await fetch(url).then((res) => res.text());
    url?.searchParams?.delete("barba_prefetch");
    barba.history.add(url.toString(), "barba", "replace");
    const newDocument = document.createElement("div");
    newDocument.innerHTML = content;

    document.querySelectorAll("form[data-search-form]").forEach((oldForm) => {
      const section = newDocument.querySelector(`[data-style-id="${oldForm.getAttribute("data-style-id")}"]`);
      oldForm.outerHTML = section.outerHTML;
    });

    state.loading = false;
    state.count = $el.querySelector("[data-next-url]")?.children?.length;

    const header = document.querySelector(".header-sections-container");
    const offsetHeight = Math.max(180, header?.getBoundingClientRect()?.bottom ?? 0);

    utils.scrollToY(150, utils.getElementPosition($el).top - offsetHeight - +getComputedStyle($el).paddingTop.replace("px", ""));
  };

  const debounceUpdates = utils.debounce(updateSortAndFilters, 750);

  const loadNextPage = async (
    container = $el.querySelector(`[data-next-url]`),
    paginationContainer = $el.querySelector(`[data-pagination][x-ref="pagination"]`)
  ) => {
    if (!state.next_url || state.loading) return;

    state.loading = true;
    const html = await fetch(state.next_url).then((res) => res.text());

    const newDocument = document.createElement("div");
    newDocument.innerHTML = html;

    const section = newDocument.querySelector(`[data-style-id="${$el.getAttribute("data-style-id")}"]`);

    const newContent = section.querySelector(`[data-next-url][x-ref="${container?.getAttribute("x-ref")}"]`);

    state.next_url = newContent?.getAttribute("data-next-url");

    const newPagination = section.querySelector(`[data-pagination][x-ref="pagination"]`);

    if (newContent) {
      container.append(...newContent.children);
      state.count = container?.children?.length;
    }
    if (paginationContainer && newPagination) {
      paginationContainer.innerHTML = newPagination.innerHTML;
    }
    state.loading = false;
  };

  const showConditionally = (show_conditionally) => {
    if (!show_conditionally) {
      return true;
    }

    switch (show_conditionally) {
      case "always": {
        return true;
      }
      case "no_search_query":
        return !search.query;
      case "with_search_query":
        return !!search.query;
      case "search_empty": {
        return state.count <= 0;
      }
      case "items_found": {
        return state.count > 0;
      }
    }
  };

  return {
    main_search: {
      state,
      loadNextPage,
      updateSortAndFilters,
      debounceUpdates,
      showConditionally,
    },
  };
};

window._sections["initMainSearch"] = initMainSearch;

/* LAST HASH: 15faad281fbe22610e773f7f11b38fc1d8979dc4 */
;

})();

// ---- __section--modal_back_in_stock_notification.js ----
(function(){
"use strict";
const initialStore = {
  product: null,
  selected_variant: null,
  email: "",
  phone_number: "",
  subscribe: true,
  loading: false,
};

const initBackInStock = ($el, klaviyo_company_id, klaviyo_list_id) => {
  window.Alpine.store("backInStockNotification", initialStore);

  const state = window.Alpine.store("backInStockNotification");

  window.Alpine.magic("backInStockNotification", () => state);
  window._stores["backInStockNotification"] = state;

  const submitBackInStockForm = async (e) => {
    state.loading = true;

    fetch(`https://a.klaviyo.com/client/back-in-stock-subscriptions/?company_id=${klaviyo_company_id}`, {
      method: `POST`,
      headers: {
        "Content-Type": "application/json",
        revision: "2025-04-15",
      },
      body: JSON.stringify({
        data: {
          type: "back-in-stock-subscription",
          attributes: {
            profile: {
              data: {
                type: "profile",
                attributes: {
                  ...(state.email ? { email: state.email } : {}),
                  ...(state.phone_number ? { phone_number: utils.normalizePhoneInput(state.phone_number ?? "") } : {}),
                },
              },
            },
            channels: [...(state.email ? ["EMAIL"] : []), ...(state.phone_number ? ["SMS"] : [])],
          },
          relationships: {
            variant: {
              data: {
                type: "catalog-variant",
                id: `$shopify:::$default:::${state?.selected_variant?.id}`,
              },
            },
          },
        },
      }),
    })
      .then(async (res) => {
        if (res.headers.get("content-type") === "application/json") {
          await res.json();
          return res;
        }
        await res.text();
        return res;
      })
      .then((res) => {
        state.loading = false;
        if (res?.status >= 200 && res?.status < 300) {
          _stores.toast.addToast({
            type: "success",
            title: "You will receive an email when this item is back in stock.",
            content: "",
            timestamp: Date.now(),
          });
          _stores.modal.setId("");
          return;
        }

        _stores.toast.addToast({
          type: "error",
          title: "Error",
          // @ts-ignore
          content: res?.errors?.[0]?.detail ?? "Please try again later.",
          timestamp: Date.now(),
        });
      });

    if (state.subscribe && klaviyo_list_id && (state.phone_number || state.email)) {
      fetch(`https://a.klaviyo.com/client/subscriptions?company_id=${klaviyo_company_id}`, {
        method: "POST",
        headers: {
          accept: "application/vnd.api+json",
          revision: "2025-07-15",
          "content-type": "application/vnd.api+json",
        },
        body: JSON.stringify({
          data: {
            type: "subscription",
            attributes: {
              profile: {
                data: {
                  type: "profile",
                  attributes: {
                    subscriptions: {
                      ...(state.email
                        ? {
                            email: {
                              marketing: {
                                consent: "SUBSCRIBED",
                              },
                            },
                          }
                        : {}),
                      ...(state.phone_number
                        ? {
                            sms: {
                              marketing: {
                                consent: "SUBSCRIBED",
                              },
                            },
                          }
                        : {}),
                    },
                    ...(state.email ? { email: state.email } : {}),
                    ...(state.phone_number ? { phone_number: state.phone_number } : {}),
                  },
                },
              },
              custom_source: "Back In Stock",
            },
            relationships: {
              list: {
                data: {
                  type: "list",
                  id: klaviyo_list_id,
                },
              },
            },
          },
        }),
      });
    }
  };

  return {
    back_in_stock: state,
    submitBackInStockForm,
  };
};

window._sections["initBackInStock"] = initBackInStock;

/* LAST HASH: 56f7a2c026ce4d89eab900bf09e1b24fb1233f14 */
;

})();

// ---- __section--modal_search.js ----
(function(){
"use strict";
const initSearchModal = ($el, modalId) => {
  const {
    limit = 10,
    limit_type = "each",
    unavailable_products = "last",
    author = false,
    body = false,
    product_type = true,
    tag = false,
    title = true,
    variants_barcode = false,
    variants_sku = false,
    variants_title = true,
    vendor = true,
  } = utils.JSONParse($el.getAttribute("data-settings") ?? "{}");

  const modal = window.Alpine.store("modal");
  const search = window.Alpine.store("search");

  const searchTypes = [...($el.querySelectorAll("[data-predictive-search-type]") ?? [])]?.map((container) =>
    container.getAttribute("data-predictive-search-type"),
  );

  const initialSuggestions = [...$el.querySelectorAll("[data-search-suggestion]")]?.map((el) => el?.textContent);

  const state = window.Alpine.reactive({
    loading: false,
    fetching: false,
    initialized: false,
    last_query: "",
    query_count: 0,
    product_count: 0,
    collection_count: 0,
    article_count: 0,
    page_count: 0,
    products: [],
    collections: [],
    articles: [],
    pages: [],
    queries: [],
    active_query: initialSuggestions[0] ?? "",
    history_data: utils.JSONParse(
      sessionStorage.getItem(`_platter---cached-search-${limit}-${limit_type}-${searchTypes.join(",")}`) ?? "{}",
    ),
    data_products: new Map(),
    data_collections: new Map(),
    data_articles: new Map(),
    data_pages: new Map(),
    fetching_queries: new Map(),
    suggestions_fetched: false,
  });

  const fetchSearchResults = async (query = "") => {
    if (state.history_data[query]) return;
    try {
      if (state.fetching_queries.has(query)) {
        await state.fetching_queries.get(query);
        return;
      }

      const searchRequest = fetch(
        `${Shopify.routes.root}search/suggest?section_id=data_predictive_search&q=${query}&resources[type]=${searchTypes
          .filter((k) => k !== "query")
          .join(
            ","
          )}&resources[limit_scope]=${limit_type}&resources[limit]=${limit}&resources[options][unavailable_products]=${unavailable_products}&resources[options][fields]=${Object.entries(
          {
            author,
            body,
            product_type,
            tag,
            title,
            "variants.barcode": variants_barcode,
            "variants.sku": variants_sku,
            "variants.title": variants_title,
            vendor,
          }
        )
          .filter(([_, val]) => !!val)
          .map(([key]) => key)
          .join(",")}`
      )
        .then((response) => response.text())
        .then((results) => {
          const div = document.createElement("div");
          div.innerHTML = results;
          return utils.JSONParse(div.querySelector("[data-predictive-search]").innerHTML);
        });

      state.fetching_queries.set(query, searchRequest);

      const search_results = await searchRequest;

      if (!search_results) return;

      state.history_data[query] = {
        product_count: search_results?.product_count ?? 0,
        collection_count: search_results?.collection_count ?? 0,
        article_count: search_results?.article_count ?? 0,
        page_count: search_results?.page_count ?? 0,
        products:
          search_results?.products?.map((entry) => {
            if (!_products[entry.handle]) {
              _product.saveProduct(entry.handle, entry);
            }
            state.data_products.set(entry.handle, entry);
            return [entry.handle, entry.id];
          }) ?? [],
        collections:
          search_results?.collections?.map((entry) => {
            if (!_collections[entry.handle]) {
              _collection.saveCollection(entry.handle, entry);
            }
            state.data_collections.set(entry.handle, entry);
            return entry.handle;
          }) ?? [],
        articles:
          search_results?.articles?.map((entry) => {
            if (!_articles[entry.handle]) {
              _article.saveArticle(entry.handle, entry);
            }
            state.data_articles.set(entry.handle, entry);
            return entry.handle;
          }) ?? [],
        pages:
          search_results?.pages?.map((entry) => {
            if (!_pages[entry.handle]) {
              _page.savePage(entry.handle, entry);
            }
            state.data_pages.set(entry.handle, entry);
            return entry.handle;
          }) ?? [],
      };
      requestIdleCallback(() => {
        sessionStorage.setItem(
          `_platter---cached-search-${limit}-${limit_type}-${searchTypes.join(",")}`,
          JSON.stringify(state.history_data)
        );
      });
    } catch (err) {
      state.fetching_queries.delete(query);
    }
  };

  const debounceSearch = window.Alpine.debounce(async (query = "") => {
    if (state.fetching) return;

    state.fetching = true;

    await fetchSearchResults(query);

    state.fetching = false;
    state.loading = false;
  }, 300);

  const debounceSearchQuery = window.Alpine.debounce(async (query = "") => {
    const suggestions = await fetch(
      `${Shopify.routes.root}search/suggest.json?q=${query}&resources[type]=query&resources[limit_scope]=each`
    ).then((res) => res.json());

    state.queries = [
      {
        text: query,
        styled_text: `<mark>${query}</mark>`,
        url: `/search?q=${query}`,
        manual_input: true,
      },
      ...(suggestions?.resources?.results?.queries ?? []),
    ]?.filter((a, i, arr) => (arr.findIndex((b) => b.text === a.text) === i && !a.manual_input) || i === 0);
    state.active_query = query;
    state.query_count = state.queries.length;
  }, 100);

  const getDynamicText = (content) => {
    return utils.getBracketInputDynamicPluralizedText(content, {
      search: {
        terms: state.active_query,
        query: state.active_query,
        results_count: state.product_count + state.collection_count + state.article_count + state.page_count,
        count: state.product_count + state.collection_count + state.article_count + state.page_count,
        ...state,
      },
    });
  };

  const getDynamicValue = (content) => {
    return utils.getBracketInputDynamicValue(content, {
      search: {
        terms: state.active_query,
        query: state.active_query,
        results_count: state.product_count + state.collection_count + state.article_count + state.page_count,
        count: state.product_count + state.collection_count + state.article_count + state.page_count,
        ...state,
      },
    });
  };

  const getDynamicValueWithFallbacks = (content) => {
    return content.split(",")?.reduce((acc, item) => {
      acc ||= utils.getBracketInputDynamicValue(item.trim(), {
        search: {
          terms: state.active_query,
          query: state.active_query,
          results_count: state.product_count + state.collection_count + state.article_count + state.page_count,
          count: state.product_count + state.collection_count + state.article_count + state.page_count,
          ...state,
        },
      });
      return acc;
    }, "");
  };

  const showConditionally = (show_conditionally) => {
    if (!show_conditionally) {
      return true;
    }
    switch (show_conditionally) {
      case "no_search_query":
        return !search.query;
      case "with_search_query":
        return !!search.query;
      case "always":
        return true;
      case "search_empty":
        return !state.loading && state.product_count + state.collection_count + state.article_count + state.page_count <= 0;
      case "items_found":
        return state.product_count + state.collection_count + state.article_count + state.page_count >= 1;
    }
  };

  Alpine.effect(() => {
    if (!search.query) {
      state.queries = [];
      state.active_query = initialSuggestions[0] ?? "";
    }

    if (search.query && search.query !== state.last_query) {
      state.last_query = search.query;
      state.queries = [
        {
          text: search.query,
          styled_text: `<mark>${search.query}</mark>`,
          url: `/search?q=${search.query}`,
          manual_input: true,
        },
        ...state.queries,
      ]?.filter((a, i, arr) => (arr.findIndex((b) => b.text === a.text) === i && !a.manual_input) || i === 0);
      state.active_query = search.query;

      debounceSearchQuery(search.query);

      if (state.history_data[search.query]) {
        state.fetching = false;
        state.loading = false;
        return;
      }

      state.loading = true;
      debounceSearch(search.query);
    }
  });

  Alpine.effect(async () => {
    if (state.active_query && state.history_data[state.active_query] && state.initialized) {
      state.product_count = state.history_data[state.active_query].product_count ?? 0;
      state.collection_count = state.history_data[state.active_query].collection_count ?? 0;
      state.article_count = state.history_data[state.active_query].article_count ?? 0;
      state.page_count = state.history_data[state.active_query].page_count ?? 0;
      state.products = state.history_data[state.active_query].products.map(([handle]) => state.data_products.get(handle));
      state.collections = state.history_data[state.active_query].collections.map((handle) => state.data_collections.get(handle));
      state.articles = state.history_data[state.active_query].articles.map((handle) => state.data_articles.get(handle));
      state.pages = state.history_data[state.active_query].pages.map((handle) => state.data_pages.get(handle));
    }
    if (state.active_query && !state.history_data[state.active_query]) {
      fetchSearchResults(state.active_query);
    }
  });

  if (Object.keys(state.history_data) && !state.initialized) {
    const handles = Object.values(state.history_data)?.reduce(
      (acc, entry, i, arr) => {
        entry.products.forEach(([handle, id]) => {
          acc.products.set(handle, [handle, id]);
        });
        entry.collections.forEach((handle) => {
          acc.collections.add(handle);
        });
        entry.pages.forEach((handle) => {
          acc.pages.add(handle);
        });
        entry.articles.forEach((handle) => {
          acc.articles.add(handle);
        });
        return acc;
      },
      {
        products: new Map(),
        collections: new Set(),
        pages: new Set(),
        articles: new Set(),
      }
    );

    Promise.allSettled(
      [
        [...handles.products.values()].map(([handle, id]) =>
          _products[handle]
            ? state.data_products.set(handle, _products[handle])
            : _product.getProductData(handle, id).then((data) => state.data_products.set(handle, data))
        ),
        [...handles.collections.keys()].map((handle) =>
          _collections[handle]
            ? state.data_collections.set(handle, _collections[handle])
            : _collection.getCollectionData(handle).then((data) => state.data_collections.set(handle, data))
        ),
        [...handles.pages.keys()].map((handle) =>
          _pages[handle]
            ? state.data_pages.set(handle, _pages[handle])
            : _page.getPageData(handle).then((data) => state.data_pages.set(handle, data))
        ),
        [...handles.articles.keys()].map((handle) =>
          _articles[handle]
            ? state.data_articles.set(handle, _articles[handle])
            : _article.getArticleData(handle).then((data) => state.data_articles.set(handle, data))
        ),
      ].flat()
    ).finally(() => {
      state.initialized = true;
    });
  }

  Alpine.effect(() => {
    if (!state.suggestions_fetched && modalId && (modal.id === modalId || modal.sub_id === modalId)) {
      state.suggestions_fetched = true;
      Promise.allSettled(initialSuggestions.map(fetchSearchResults));
    }
  });

  return {
    search_modal: {
      state,
      showConditionally,
      getDynamicText,
      getDynamicValue,
      getDynamicValueWithFallbacks,
      debounceSearch,
      debounceSearchQuery,
    },
  };
};

window._sections["initSearchModal"] = initSearchModal;

/* LAST HASH: 71faf256a8f9e8ff268f305845c72b36f3e2d5f9 */
;

})();

// ---- _article-data.js ----
(function(){
"use strict";
const _article = {
  getHtmlArticle: (handle) => {
    const article = utils.JSONParse(document.querySelector(`[data-article-data="${handle}"]`)?.innerHTML);

    if (article) {
      _articles[handle] = {
        ...(_articles[handle] ?? {}),
        ...article,
      };
      _article.saveArticle(handle);
      return _articles[handle];
    }
    return null;
  },
  getCachedArticle: async (handle) => {
    const dbKey = `_${window.Shopify.theme.id}-article--${handle}`;
    const article = await idbKeyval.get(dbKey);

    if (article) {
      _articles[handle] = {
        ...(_articles[handle] ?? {}),
        ...article,
      };
      return _articles[handle];
    }

    return null;
  },
  getFetchArticle: async (handle) => {
    try {
      const article = await fetch(`/blogs/${handle}`)
        .then((res) => res.text())
        .then((text) => {
          const html = document.createElement("div");
          html.innerHTML = text;

          return utils.JSONParse(html.querySelector("[data-article-data]")?.innerHTML ?? "{}");
        });

      if (article) {
        _articles[handle] = {
          ...(_articles[handle] ?? {}),
          ...article,
        };
        return _articles[handle];
      }
      return null;
    } catch (err) {
      return null;
    }
  },
  saveArticle: (handle, dataOverride = undefined) => {
    _articles[handle] = {
      ...(_articles[handle] ?? {}),
      ...(dataOverride ?? {}),
    };

    if (_articles[handle]) {
      const dbKey = `_${window.Shopify.theme.id}-article--${handle}`;
      requestIdleCallback(
        async () => {
          await idbKeyval.set(dbKey, _articles[handle]);
        },
        { timeout: 5000 }
      );
      return _articles[handle];
    }
    return null;
  },
  getArticleData: async (handle) => {
    if (!_articles[handle]) {
      _article.getHtmlArticle(handle);
    }
    if (!_articles[handle]) {
      await _article.getCachedArticle(handle);
    }
    if (!_articles[handle]) {
      await _article.getFetchArticle(handle);
    }
    if (!_articles[handle]) {
      return null;
    }
    _article.saveArticle(handle);
    return _articles[handle];
  },
};

window._article = _article;

/* LAST HASH: 19afe50c89fc87a07638f1493ae8c98d28b100e9 */
;

})();

// ---- _collapsible.js ----
(function(){
"use strict";
const initCollapsible = ($el, container, defaultOpen = false) => {
  const state = window.Alpine.reactive({
    open_accordion: defaultOpen,
    opening: false,
    closing: false,
    timeout: null,
    themeEditorControl: false,
  });

  if (container && $el.id) {
    container.setAttribute("aria-controls", $el.id);
  }

  Alpine.effect(() => {
    if (state.open_accordion) {
      container?.removeAttribute("inert");
      container?.setAttribute("aria-expanded", "true");
    }
    if (!state.open_accordion) {
      container?.setAttribute("inert", "true");
      container?.setAttribute("aria-expanded", "false");
    }
  });

  const toggleOpen = async (forceOpen = false, forceClose = false, callback = () => {}) => {
    if (state.themeEditorControl || !container) return;
    clearTimeout(state.timeout);
    if (container.scrollHeight === 0) {
      /* This is oddly required to flush the browsers uncomputed layout effects. */
      document.querySelectorAll("details > div").forEach((el) => el.scrollHeight);
      document.querySelectorAll("details > div").forEach((el) => el.scrollHeight);
    }
    if ((!state.open_accordion || forceOpen) && !forceClose) {
      if (!state.closing) {
        container.style.transitionDuration = `0ms`;
        container.style.paddingTop = "0px";
        container.style.paddingBottom = "0px";
        container.style.maxHeight = `0px`;
        container.style.transitionDuration = ``;
      }
      state.opening = true;
      state.closing = false;
      state.open_accordion = true;

      container.style.maxHeight = `${Math.max(container.scrollHeight + 15, 15)}px`;
      container.style.paddingTop = "";
      container.style.paddingBottom = "";

      state.timeout = setTimeout(() => {
        state.opening = false;
        container.style.maxHeight = `${Math.max(container.scrollHeight, 99999)}px`;
        callback();
      }, 250);
      return;
    }

    if ((state.open_accordion || forceClose) && !forceOpen) {
      if (container.style.maxHeight === `99999px`) {
        container.classList.add("!transition-none");
        container.style.maxHeight = `${Math.max(container.scrollHeight + 15, 15)}px`;
      }
      Alpine.nextTick(() => {
        container.classList.remove("!transition-none");
        container.style.paddingTop = "0px";
        container.style.paddingBottom = "0px";
        container.style.maxHeight = `0px`;
        state.opening = false;
        state.closing = true;
      });
      state.timeout = setTimeout(() => {
        if (state.closing && !state.opening) {
          state.closing = false;
          state.open_accordion = false;
          callback();
        }
      }, 210);
      return;
    }
  };

  const closeSiblingCollapsibles = () => {
    const getClosestElements = ($el, iteration = 25) => {
      const closestElements = $el.parentElement.querySelectorAll("details");
      if (closestElements?.length) {
        return closestElements;
      }
      if (!iteration) {
        return $el.closest(".shopify-section").querySelectorAll("details");
      }
      return getClosestElements($el.parentElement, iteration - 1);
    };

    getClosestElements($el).forEach((el) => {
      if (el === $el) return;
      // @ts-ignore
      el?._x_dataStack?.forEach((proxyState) => {
        if (proxyState?.collapsible?.open_accordion) {
          proxyState?.toggleOpen(false, true);
        }
      });
    });
  };

  if (window.Shopify.designMode) {
    const editor = Alpine.store("editor");

    Alpine.effect(() => {
      const styleId = `${editor.select_section_id}--${editor.select_block_id}`;
      if ($el.getAttribute("data-style-id") === styleId || $el.querySelector(`[data-style-id="${styleId}"]`)) {
        toggleOpen(true);
        state.themeEditorControl = true;
      } else {
        if (state.themeEditorControl) {
          state.themeEditorControl = false;
          toggleOpen(false, true);
        }
      }
    });
  }

  return {
    collapsible: state,
    toggleOpen,
    closeSiblingCollapsibles,
  };
};

window.utils.initCollapsible = initCollapsible;

/* LAST HASH: 7624c61e32ba78f7a0dd91ef0dfbbb8711be29d4 */
;

})();

// ---- _collection-data.js ----
(function(){
"use strict";
const _collection = {
  getHtmlCollection: (handle) => {
    const collection = utils.JSONParse(document.querySelector(`[data-collection-data="${handle}"]`)?.innerHTML);

    if (collection) {
      _collections[handle] = {
        ...(_collections[handle] ?? {}),
        ...collection,
      };
      _collection.saveCollection(handle);
      return _collections[handle];
    }
    return null;
  },
  getCachedCollection: async (handle) => {
    const dbKey = `_${window.Shopify.theme.id}-collection--${handle}`;
    const collection = await idbKeyval.get(dbKey);

    if (collection) {
      _collections[handle] = {
        ...(_collections[handle] ?? {}),
        ...collection,
      };
      return _collections[handle];
    }

    return null;
  },
  getFetchCollection: async (handle) => {
    try {
      const collection = await fetch(`/collections/${handle}`)
        .then((res) => res.text())
        .then((text) => {
          const html = document.createElement("div");
          html.innerHTML = text;

          return utils.JSONParse(html.querySelector("[data-collection-data]")?.innerHTML ?? "{}");
        });

      if (collection) {
        _collections[handle] = {
          ...(_collections[handle] ?? {}),
          ...collection,
        };
        return _collections[handle];
      }
      return null;
    } catch (err) {
      return null;
    }
  },
  saveCollection: (handle, dataOverride = undefined) => {
    _collections[handle] = {
      ...(_collections[handle] ?? {}),
      ...(dataOverride ?? {}),
    };

    if (_collections[handle]) {
      const dbKey = `_${window.Shopify.theme.id}-collection--${handle}`;
      requestIdleCallback(
        async () => {
          await idbKeyval.set(dbKey, _collections[handle]);
        },
        { timeout: 5000 }
      );
      return _collections[handle];
    }
    return null;
  },
  getCollectionData: async (handle) => {
    if (!_collections[handle]) {
      _collection.getHtmlCollection(handle);
    }
    if (!_collections[handle]) {
      await _collection.getCachedCollection(handle);
    }
    if (!_collections[handle]) {
      await _collection.getFetchCollection(handle);
    }
    if (!_collections[handle]) {
      return null;
    }
    _collection.saveCollection(handle);
    return _collections[handle];
  },
};

window._collection = _collection;

/* LAST HASH: 20b230aa9864d274dd140023e8af7be515695ad4 */
;

})();

// ---- _content-slider.js ----
(function(){
"use strict";
const getTransformedComputedStyle = (element) => {
  const style = getComputedStyle(element);

  return {
    ...style,
    paddingLeft: parseFloat(style.paddingLeft?.replace("auto", "0")),
    paddingRight: parseFloat(style.paddingRight?.replace("auto", "0")),
    paddingTop: parseFloat(style.paddingTop?.replace("auto", "0")),
    paddingBottom: parseFloat(style.paddingBottom?.replace("auto", "0")),
    scrollPaddingLeft: parseFloat(style.scrollPaddingLeft?.replace("auto", "0")),
    scrollPaddingRight: parseFloat(style.scrollPaddingRight?.replace("auto", "0")),
    scrollPaddingTop: parseFloat(style.scrollPaddingTop?.replace("auto", "0")),
    scrollPaddingBottom: parseFloat(style.scrollPaddingBottom?.replace("auto", "0")),
    columnGap: parseFloat(style.columnGap?.replace("auto", "0")),
    rowGap: parseFloat(style.rowGap?.replace("auto", "0")),
  };
};
const initContentSlider = (
  $el,
  container,
  speed = 200,
  infiniteScroll = false,
  autoRotate = 0,
  enable_mouse_dragging = false
) => {
  if (!container) {
    container = $el.querySelector('[x-ref="scrollContainer"]') || $el.firstElementChild;
  }
  const isHorizontal = () => {
    return !!(
      getComputedStyle(container).overflowY === "hidden" ||
      getComputedStyle(container).gridAutoFlow === "column" ||
      container.scrollWidth > container?.clientWidth
    );
  };
  const isScrollable = () => container.scrollWidth > container.clientWidth || container.scrollHeight > container.clientHeight;
  const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;
  const shouldInfinite = () => {
    // Accept legacy booleans too
    if (typeof infiniteScroll === "boolean") return infiniteScroll;
    switch (infiniteScroll) {
      case "all":
        return true;
      case "off":
        return false;
      case "desktop":
        return isDesktop();
      case "mobile":
        return !isDesktop();
      default:
        return false;
    }
  };
  const updateSliderHeightFromVisible = () => {
    container.style.setProperty("--slider-height", "0px");
    void container.offsetHeight;

    const trackRect = container.getBoundingClientRect();
    const all = Array.from(container.children);

    const candidates = state.infinite ? all.filter((el) => el.hasAttribute("data-original-node")) : all;

    const visible = candidates.filter((el) => {
      const r = el.getBoundingClientRect();
      return r.right > trackRect.left && r.left < trackRect.right && r.height > 0 && getComputedStyle(el).display !== "none";
    });

    const maxH = visible.reduce((m, el) => Math.max(m, el.getBoundingClientRect().height), 0);
    const finalH = Math.max(maxH, 1);
    container.style.setProperty("--slider-height", `${finalH}px`);
  };

  const random_id = utils.shortUUID();

  const containerStyles = getTransformedComputedStyle(container);
  const horizontal = isHorizontal();

  let breakPoints = [];

  let children = [...container.children]
    .filter((el) => el.tagName !== "STYLE" && el.tagName !== "TEMPLATE")
    .toSorted((a, b) => +getComputedStyle(a).order - +getComputedStyle(b).order);

  let size = children.length;

  const calculateSlideCount = (
    padding = state.horizontal ? state.paddingX : state.paddingY,
    gap = state.gap,
    scrollSpace = container[state.horizontal ? "scrollWidth" : "scrollHeight"],
    clientSpace = container?.[state.horizontal ? "clientWidth" : "clientHeight"]
  ) => {
    const horizontal = isHorizontal();
    const containerStyles = getTransformedComputedStyle(container);

    if (scrollSpace <= clientSpace) {
      return 1;
    }
    breakPoints = [];

    const snapToSlide = container.classList?.contains("snap-to-slide");

    let targetElements = [...container.children]
      ?.slice(
        0,
        Math.ceil(
          container.children?.length /
            +(
              getComputedStyle(container)
                .getPropertyValue(horizontal ? "grid-template-rows" : "grid-template-columns")
                .split(" ").length ?? 1
            )
        ),
      )
      ?.filter(
        (child) =>
          getComputedStyle(child).display !== "none" && (getComputedStyle(child).scrollSnapAlign !== "none" || snapToSlide)
      );

    targetElements = targetElements?.toSorted((a, b) => +getComputedStyle(a).order - +getComputedStyle(b).order);

    if (snapToSlide) {
      const gap = horizontal ? containerStyles.columnGap : containerStyles.rowGap;
      const paddingStart = horizontal ? containerStyles.paddingLeft : containerStyles.paddingTop;
      const newTargetElements = [];
      targetElements.forEach((el) => {
        el.style.scrollSnapAlign = "";
      });
      for (let i = 0; i < Math.ceil((scrollSpace - padding - (targetElements.length - 1) * gap) / (clientSpace - padding)); i++) {
        const targetEl = targetElements.find(
          (el) => el[horizontal ? "offsetLeft" : "offsetTop"] - paddingStart >= i * (clientSpace - padding) + gap * i
        );

        if (targetEl) {
          targetEl.style.scrollSnapAlign = "start";
          newTargetElements.push(targetEl);
        }
      }
      targetElements = newTargetElements;
    }

    if (
      !Math.ceil((scrollSpace - padding) / (clientSpace - padding)) ||
      Math.ceil(Math.round(((scrollSpace - padding) / (clientSpace - padding)) * 100) / 100) === Infinity
    ) {
      return 0;
    }

    const breakPointIndex = [
      ...new Array(Math.ceil(Math.round(((scrollSpace - padding) / (clientSpace - padding)) * 100) / 100)),
    ].reduce((acc, _, index) => {
      breakPoints[index] = (clientSpace - padding) * index + index * gap;
      if (!acc && (clientSpace - padding) * index + index * gap >= scrollSpace - padding) {
        breakPoints[index] = (clientSpace - padding) * index + (index - 1) * gap;
        return index;
      }
      return acc;
    }, 0);

    if (targetElements.length) {
      return targetElements.length;
    }

    return breakPointIndex || Math.ceil(Math.round(((scrollSpace - padding) / (clientSpace - padding)) * 100) / 100);
  };

  const state = window.Alpine.reactive({
    random_id,
    autoRotate,
    container,
    rotateInterval: null,
    rotatePause: false,
    justify: containerStyles.justifyContent,
    current_index: 0,
    infinite: false,
    paddingX: containerStyles.paddingLeft + containerStyles.paddingRight,
    paddingY: containerStyles.paddingTop + containerStyles.paddingBottom,
    gap: (horizontal ? containerStyles.columnGap : containerStyles.rowGap) || 0,
    slide_count: calculateSlideCount(
      containerStyles[horizontal ? "paddingLeft" : "paddingTop"] + containerStyles[horizontal ? "paddingRight" : "paddingBottom"],
      horizontal ? containerStyles.columnGap : containerStyles.rowGap || 0,
      container?.[horizontal ? "scrollWidth" : "scrollHeight"],
      container?.[horizontal ? "clientWidth" : "clientHeight"]
    ),
    block_scroll_events: false,
    horizontal: horizontal,
  });

  const markCenteredChild = (children) => {
    const horizontal = isHorizontal();
    const centerX =
      container?.[horizontal ? "scrollLeft" : "scrollTop"] + container?.[horizontal ? "clientWidth" : "clientHeight"] / 2;
    let closest = null;
    let minDist = Infinity;

    children.forEach((child) => {
      const center = child?.[horizontal ? "offsetLeft" : "offsetTop"] + child?.[horizontal ? "clientWidth" : "clientHeight"] / 2;
      const dist = Math.abs(center - centerX);
      if (dist < minDist) {
        minDist = dist;
        closest = child;
      }
    });

    children.forEach((child) => {
      child.classList.toggle("centered", child === closest);
    });
  };

  const initInfiniteScroll = (index = 0, force = false) => {
    children = [...container.children]
      .filter((el) => el.tagName !== "STYLE" && el.tagName !== "TEMPLATE")
      .toSorted((a, b) => +getComputedStyle(a).order - +getComputedStyle(b).order);
    const containerStyles = getTransformedComputedStyle(container);

    size = children.filter((el) => el.hasAttribute("data-original-node"))?.length || children.length;

    if (!shouldInfinite() && state.infinite) {
      const originals = [...container.children];
      originals.forEach((el) => {
        if (!el.hasAttribute("data-original-node")) {
          el.remove();
        } else {
          el.style.order = "";
        }
      });
      state.infinite = false;
      // Rebuild children list
      children = [...container.children]
        .filter((el) => el.tagName !== "STYLE" && el.tagName !== "TEMPLATE")
        .toSorted((a, b) => +getComputedStyle(a).order - +getComputedStyle(b).order);
    }

    if (shouldInfinite() && (!state.infinite || force)) {
      const visibleSpace = container.getBoundingClientRect()?.[horizontal ? "width" : "height"];
      const gapSize = containerStyles?.[horizontal ? "columnGap" : "rowGap"] || 0;
      const totalContentSpace = [...container.children]
        .filter((el) => el.tagName !== "STYLE" && el.tagName !== "TEMPLATE")
        .reduce(
          (sum, child, index) =>
            sum + child.getBoundingClientRect()?.[horizontal ? "width" : "height"] + (index === 0 ? 0 : gapSize),
          0
        );

      if (totalContentSpace > visibleSpace) {
        state.infinite = true;
        children = [...new Array(size * 2)]
          .map((_, index) => {
            const order_index = index - size;
            const child = children.at(order_index);

            child.style.order = `${order_index}`;
            if (order_index < 0) {
              const newChild = child.cloneNode(true);
              child.setAttribute("data-original-node", "true");
              container.append(newChild);
              return newChild;
            }
            return child;
          })
          ?.sort((a, b) => +a.style.order - +b.style.order);

        if (container[horizontal ? "scrollWidth" : "scrollHeight"] < totalContentSpace) {
          requestAnimationFrame(() => {
            const containerStyles = getTransformedComputedStyle(container);
            const scrollPadding = containerStyles[horizontal ? "scrollPaddingLeft" : "scrollPaddingTop"];

            container[horizontal ? "scrollLeft" : "scrollTop"] =
              children[size + index]?.[horizontal ? "offsetLeft" : "offsetTop"] - scrollPadding;

            children.forEach((child) => {
              child.classList.toggle("scroll-active", +getComputedStyle(child).order === 0);
            });
          });
        } else {
          const scrollPadding = containerStyles[horizontal ? "scrollPaddingLeft" : "scrollPaddingTop"];

          container[horizontal ? "scrollLeft" : "scrollTop"] =
            children[size + index]?.[horizontal ? "offsetLeft" : "offsetTop"] - scrollPadding;
        }
      }

      children.forEach((child) => {
        child.classList.toggle("scroll-active", +getComputedStyle(child).order === 0);
      });
      markCenteredChild(children);
    }

    children.forEach((child, index) => child.setAttribute("data-index", `${index}`));
  };

  initInfiniteScroll();

  const handleInfiniteScroll = (event = undefined, noRepeat = false) => {
    if (state.block_scroll_events || !state.infinite) return;
    const containerStyles = getTransformedComputedStyle(container);

    container.parentElement.style.setProperty("--slider-height", `${container.offsetHeight}px`);
    container.parentElement.style.setProperty(
      "--slider-width",
      `${container?.clientWidth - containerStyles.paddingLeft - containerStyles.paddingRight}px`
    );

    children = [...children];
    const scrollDistance =
      container[state.horizontal ? "scrollLeft" : "scrollTop"] +
      containerStyles[state.horizontal ? "scrollPaddingLeft" : "scrollPaddingTop"];

    const targetIndex = children.findIndex(
      (child) =>
        child[state.horizontal ? "offsetLeft" : "offsetTop"] - 30 < scrollDistance &&
        child?.[state.horizontal ? "offsetLeft" : "offsetTop"] + 30 > scrollDistance
    );

    if (targetIndex === -1) {
      if (!noRepeat) {
        setTimeout(() => {
          handleInfiniteScroll(undefined, true);
        }, 1000);
      }

      return;
    }

    state.block_scroll_events = true;

    children = [...children]
      .map((child, index) => {
        const targetOrder = index - targetIndex;
        child.style.order =
          targetOrder >= -size && targetOrder < size
            ? `${targetOrder}`
            : targetOrder < -size
            ? `${targetOrder + size * 2}`
            : `${targetOrder - size * 2}`;

        return child;
      })
      ?.sort((a, b) => +a.style.order - +b.style.order);

    container[state.horizontal ? "scrollLeft" : "scrollTop"] =
      children[size]?.[state.horizontal ? "offsetLeft" : "offsetTop"] -
      containerStyles[state.horizontal ? "scrollPaddingLeft" : "scrollPaddingTop"];

    Alpine.nextTick(() => {
      state.block_scroll_events = false;
      const children = [...container.children]?.filter(
        (child) => getComputedStyle(child).display !== "none" && getComputedStyle(child).scrollSnapAlign !== "none"
      );

      if (state.infinite && children?.length) {
        const targetIndex = children?.findIndex((child) => +child.style.order === 0);

        state.current_index = targetIndex >= children.length / 2 ? targetIndex - children.length / 2 : targetIndex;

        children.forEach((child, index) => {
          child.classList.toggle("scroll-active", index === targetIndex);
        });
      }
    });
  };

  const handleScroll = () => {
    if (state.block_scroll_events) return;

    if (state.infinite) {
      const containerStyles = getTransformedComputedStyle(container);

      container.parentElement.style.setProperty("--slider-height", `${container.offsetHeight}px`);
      container.parentElement.style.setProperty(
        "--slider-width",
        `${container?.clientWidth - containerStyles.paddingLeft - containerStyles.paddingRight}px`
      );
    }

    const currentIndex = breakPoints.findIndex(
      (num) =>
        container[state.horizontal ? "scrollLeft" : "scrollTop"] >= num - 20 &&
        container[state.horizontal ? "scrollLeft" : "scrollTop"] <= num + 20
    );

    const closest = breakPoints.reduce((acc, num) => {
      return Math.abs(num - container[state.horizontal ? "scrollLeft" : "scrollTop"]) <
        Math.abs(acc - container[state.horizontal ? "scrollLeft" : "scrollTop"])
        ? num
        : acc;
    }, 0);

    const closestIndex = breakPoints.findIndex((num) => closest === num);

    const activeChildren = [...container.children]?.filter(
      (child) => getComputedStyle(child).display !== "none" && getComputedStyle(child).scrollSnapAlign !== "none"
    );

    const sortedActiveChildren = activeChildren?.toSorted((a, b) => +getComputedStyle(a).order - +getComputedStyle(b).order);

    if (state.infinite && sortedActiveChildren?.length) {
      const targetIndex = sortedActiveChildren?.findIndex((child) => +child.style.order === 0);

      /*state.current_index =
        targetIndex >= sortedActiveChildren.length / 2 ? targetIndex - sortedActiveChildren.length / 2 : targetIndex;*/

      sortedActiveChildren.forEach((child, index) => {
        child.classList.toggle("scroll-active", index === targetIndex);
      });

      markCenteredChild(sortedActiveChildren);

      return;
    }

    if (sortedActiveChildren?.length) {
      if (
        container?.[state.horizontal ? "clientWidth" : "clientHeight"] +
          container[state.horizontal ? "scrollLeft" : "scrollTop"] +
          10 >=
        container[state.horizontal ? "scrollWidth" : "scrollHeight"]
      ) {
        state.current_index = sortedActiveChildren.length - 1;
        markCenteredChild(sortedActiveChildren);
        return;
      }

      const style = window.getComputedStyle(container);
      const paddingStart = state.horizontal ? parseFloat(style.paddingLeft) || 0 : parseFloat(style.paddingTop) || 0;

      const scrollPos = container[state.horizontal ? "scrollLeft" : "scrollTop"];
      const triggerPos = scrollPos + paddingStart + 10;

      const targetIndex = sortedActiveChildren.findIndex((child) => {
        const start = child[state.horizontal ? "offsetLeft" : "offsetTop"];
        const end = start + child[state.horizontal ? "clientWidth" : "clientHeight"];
        return start <= triggerPos && end > triggerPos;
      });

      state.current_index = targetIndex === -1 ? state.current_index : targetIndex;

      sortedActiveChildren.forEach((child, index) => {
        child.classList.toggle("scroll-active", index === state.current_index);
      });

      markCenteredChild(sortedActiveChildren);
      return;
    }

    state.current_index = currentIndex !== -1 ? currentIndex : closestIndex !== -1 ? closestIndex : state.current_index;
    markCenteredChild(sortedActiveChildren);
  };

  const handleResize = () => {
    const { paddingLeft, paddingRight, paddingTop, paddingBottom, rowGap, columnGap } = getTransformedComputedStyle(container);
    state.paddingX = paddingLeft + paddingRight;
    state.paddingY = paddingTop + paddingBottom;
    state.horizontal = isHorizontal();
    state.gap = (state.horizontal ? columnGap : rowGap) || 0;
    state.slide_count = calculateSlideCount();
    initInfiniteScroll(state.current_index);
    container.classList.toggle("cursor-grab", enable_mouse_dragging && !state.infinite && isScrollable());

    if (state.justify === "center") {
      container.classList.toggle(
        "!justify-start",
        container[state.horizontal ? "scrollWidth" : "scrollHeight"] >
          container?.[state.horizontal ? "clientWidth" : "clientHeight"]
      );
      handleScroll();
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(updateSliderHeightFromVisible);
    });
  };

  const scrollToIndex = (index, scrollDuration = speed) => {
    if (index === state.current_index) return;
    container.classList.remove("snap-both", "snap-x", "snap-y");
    const containerStyles = getTransformedComputedStyle(container);
    state.block_scroll_events = true;

    const activeChildren = [...container.children]?.filter(
      (child) => getComputedStyle(child).display !== "none" && getComputedStyle(child).scrollSnapAlign !== "none"
    );

    const sortedActiveChildren = activeChildren?.toSorted((a, b) => +getComputedStyle(a).order - +getComputedStyle(b).order);

    if (sortedActiveChildren?.length) {
      const currentIndex = sortedActiveChildren.findIndex((child) => child.classList.contains("scroll-active"));

      if (state.infinite && currentIndex) {
        index = currentIndex - state.current_index + index;
      }

      const target = sortedActiveChildren[index];

      sortedActiveChildren.forEach((child, i) => {
        child.classList.toggle("scroll-active", i === index);
      });

      utils.scrollToXY(
        scrollDuration,
        (target?.offsetLeft ?? 0) - containerStyles.scrollPaddingLeft,
        (target?.offsetTop ?? 0) - containerStyles.scrollPaddingTop,
        container,
        () => {
          container.classList.add(state.horizontal ? "snap-x" : "snap-y");
          state.block_scroll_events = false;
          handleScroll();
          if (state.infinite) {
            handleInfiniteScroll();
          }
        }
      );
      return;
    }

    utils.scrollToXY(
      scrollDuration,
      (container?.clientWidth - state.paddingX) * index + index * state.gap,
      (container?.clientHeight - state.paddingY) * index + index * state.gap,
      container,
      () => {
        container.classList.add(state.horizontal ? "snap-x" : "snap-y");
        state.block_scroll_events = false;
        handleScroll();
      }
    );
  };

  if (state.justify === "center") {
    container.classList.toggle(
      "!justify-start",
      container[state.horizontal ? "scrollWidth" : "scrollHeight"] >
        container?.[state.horizontal ? "clientWidth" : "clientHeight"]
    );

    state.paddingX = containerStyles.paddingLeft + containerStyles.paddingRight;
    state.paddingY = containerStyles.paddingTop + containerStyles.paddingBottom;
    state.horizontal = isHorizontal();
    state.gap = (state.horizontal ? containerStyles.columnGap : containerStyles.rowGap) || 0;
    state.slide_count = calculateSlideCount();
    handleScroll();
  }

  if (autoRotate) {
    Alpine.effect(() => {
      if (!autoRotate) return;

      if (!state.rotateInterval && !state.rotatePause) {
        state.rotateInterval = setInterval(() => {
          if (state.infinite) {
            const target = [...container.children]?.find((child) => +getComputedStyle(child).order === 1);
            if (target) {
              container.classList.remove("snap-both", "snap-x", "snap-y");
              const containerStyles = getTransformedComputedStyle(container);
              state.block_scroll_events = true;

              utils.scrollToXY(
                speed,
                (target?.offsetLeft ?? 0) - containerStyles.scrollPaddingLeft,
                (target?.offsetTop ?? 0) - containerStyles.scrollPaddingTop,
                container,
                () => {
                  container.classList.add(state.horizontal ? "snap-x" : "snap-y");
                  state.block_scroll_events = false;
                  handleScroll();
                  if (state.infinite) {
                    handleInfiniteScroll();
                  }
                }
              );
              return;
            }
          }
          scrollToIndex(state.current_index + 1 >= state.slide_count ? 0 : state.current_index + 1);
        }, autoRotate * 1000);
      }
      if (state.rotateInterval && state.rotatePause) {
        clearInterval(state.rotateInterval);
        state.rotateInterval = null;
      }
    });
  }

  container.classList.add(state.horizontal ? "snap-x" : "snap-y");

  if (enable_mouse_dragging) {
    const enableDragScroll = (container) => {
      let isDragging = false;
      let dragged = false;
      let startX, startY, scrollLeft, scrollTop;

      container.classList.toggle("cursor-grab", enable_mouse_dragging && !state.infinite && isScrollable());

      const deactivateCursor = () => {
        container.classList.remove("cursor-grab");
      };

      const addDraggingCursor = () => {
        document.body.classList.add("dragging");
      };

      const removeDraggingCursor = () => {
        document.body.classList.remove("dragging");
      };

      const smoothSnapToClosestChild = () => {
        const children = Array.from(container.children);
        if (!children.length) return;

        const horizontal = container.scrollWidth > container.clientWidth;

        // padding at the leading edge of the scroll axis
        const style = getComputedStyle(container);
        const padStart = horizontal ? parseFloat(style.paddingLeft) || 0 : parseFloat(style.paddingTop) || 0;

        // current scroll in the same coordinate space
        const scrollPos = horizontal ? container.scrollLeft : container.scrollTop;

        // helper: where this child should align the scroll to (start edge)
        const snapStart = (el) => (horizontal ? el.offsetLeft : el.offsetTop) - padStart;

        // pick the child whose snapStart is closest to current scroll
        let closest = null;
        let minDist = Infinity;
        for (const child of children) {
          const start = snapStart(child);
          const dist = Math.abs(start - scrollPos);
          if (dist < minDist) {
            minDist = dist;
            closest = child;
          }
        }

        if (!closest) return;

        const targetPos = snapStart(closest);

        container.scrollTo({
          [horizontal ? "left" : "top"]: targetPos,
          behavior: "smooth",
        });

        // restore snap after the animation
        setTimeout(() => {
          container.style.scrollSnapType = "";
        }, 400);
      };

      const onMouseDown = (e) => {
        if (state.infinite || document.body.classList.contains("dragging")) return;
        if (!isScrollable()) return;
        isDragging = true;
        dragged = false;
        startX = e.pageX - container.offsetLeft;
        startY = e.pageY - container.offsetTop;
        scrollLeft = container.scrollLeft;
        scrollTop = container.scrollTop;

        addDraggingCursor();
        container.style.scrollSnapType = "none";

        e.preventDefault();
      };

      const onMouseMove = (e) => {
        if (!isDragging) return;
        dragged = true;

        const x = e.pageX - container.offsetLeft;
        const y = e.pageY - container.offsetTop;
        const walkX = (x - startX) * 1.5;
        const walkY = (y - startY) * 2;

        container.scrollLeft = scrollLeft - walkX;
        container.scrollTop = scrollTop - walkY;
      };

      const onMouseUp = () => {
        if (!isDragging) return;
        isDragging = false;
        removeDraggingCursor();

        if (dragged) {
          smoothSnapToClosestChild(); // ⬅️ Added call
        } else {
          container.style.scrollSnapType = "";
        }
      };

      const onClickCapture = (e) => {
        if (dragged) {
          e.stopPropagation();
          e.preventDefault();
          dragged = false;
        }
      };

      container.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mousemove", onMouseMove, true);
      window.addEventListener("mouseup", onMouseUp, true);
      container.addEventListener("click", onClickCapture, true);

      const ro = new ResizeObserver(() => {
        if (isScrollable()) {
          container.classList.toggle("cursor-grab", enable_mouse_dragging && !state.infinite && isScrollable());
        } else {
          deactivateCursor();
        }
      });
      ro.observe(container);

      const mo = new MutationObserver(() => {
        if (isScrollable()) {
          container.classList.toggle("cursor-grab", enable_mouse_dragging && !state.infinite && isScrollable());
        } else {
          deactivateCursor();
        }
      });
      mo.observe(container, { childList: true, subtree: true });
    };

    enableDragScroll(container);
  }

  Alpine.nextTick(() => {
    handleResize();
    handleScroll();
    handleInfiniteScroll();
  });

  const resizeObserver = new ResizeObserver(() => {
    handleResize();
    handleScroll();
    handleInfiniteScroll();
  });

  resizeObserver.observe(container);

  return {
    content_slider: {
      container,
      state,
      handleInfiniteScroll,
      handleScroll,
      handleResize,
      scrollToIndex,
      calculateSlideCount,
      initInfiniteScroll,
    },
  };
};

window.utils.initContentSlider = initContentSlider;

})();

// ---- _development.js ----
(function(){
"use strict";
const initDevelopment = () => {
  window.clearCache = async () => {
    await caches.delete(`platter-modals--${window.theme_settings.development__cache_version}`);
    localStorage.clear();
    sessionStorage.clear();
    await idbKeyval.clear();

    console.log(`await caches.delete("platter-modals--${window.theme_settings.development__cache_version}");`);
    console.log(`localStorage.clear();`);
    console.log(`sessionStorage.clear();`);
    console.log(`await idbKeyval.clear();`);
    console.log("Platter Theme Cache Cleared");
  };
};

initDevelopment();

/* LAST HASH: ed703f38669e62276ca524fb7f2e38af29015c49 */
;

})();

// ---- _page-data.js ----
(function(){
"use strict";
const _page = {
  getHtmlPage: (handle) => {
    const page = utils.JSONParse(document.querySelector(`[data-page-data="${handle}"]`)?.innerHTML);

    if (page) {
      _pages[handle] = {
        ...(_pages[handle] ?? {}),
        ...page,
      };
      _page.savePage(handle);
      return _pages[handle];
    }
    return null;
  },
  getCachedPage: async (handle) => {
    const dbKey = `_${window.Shopify.theme.id}-page--${handle}`;
    const page = await idbKeyval.get(dbKey);

    if (page) {
      _pages[handle] = {
        ...(_pages[handle] ?? {}),
        ...page,
      };
      return _pages[handle];
    }

    return null;
  },
  getFetchPage: async (handle) => {
    try {
      const page = await fetch(`/pages/${handle}`)
        .then((res) => res.text())
        .then((text) => {
          const html = document.createElement("div");
          html.innerHTML = text;

          return utils.JSONParse(html.querySelector("[data-page-data]")?.innerHTML ?? "{}");
        });

      if (page) {
        _pages[handle] = {
          ...(_pages[handle] ?? {}),
          ...page,
        };
        return _pages[handle];
      }
      return null;
    } catch (err) {
      return null;
    }
  },
  savePage: (handle, dataOverride = undefined) => {
    _pages[handle] = {
      ...(_pages[handle] ?? {}),
      ...(dataOverride ?? {}),
    };
    if (_pages[handle]) {
      const dbKey = `_${window.Shopify.theme.id}-page--${handle}`;
      requestIdleCallback(
        async () => {
          await idbKeyval.set(dbKey, _pages[handle]);
        },
        { timeout: 5000 }
      );
      return _pages[handle];
    }
    return null;
  },
  getPageData: async (handle) => {
    if (!_pages[handle]) {
      _page.getHtmlPage(handle);
    }
    if (!_pages[handle]) {
      await _page.getCachedPage(handle);
    }
    if (!_pages[handle]) {
      await _page.getFetchPage(handle);
    }
    if (!_pages[handle]) {
      return null;
    }
    _page.savePage(handle);
    return _pages[handle];
  },
};

window._page = _page;

/* LAST HASH: d1730aeba06510f10aa4a1775f30d76f6c3f360f */
;

})();
