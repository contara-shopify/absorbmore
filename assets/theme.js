var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// assets/polyfills.ts
var supported = typeof window === "undefined" ? true : "onscrollend" in window;
if (!supported) {
  let observe = function(proto, method, handler) {
    const native = proto[method];
    proto[method] = function() {
      const args = Array.prototype.slice.apply(arguments, [0]);
      native.apply(this, args);
      args.unshift(native);
      handler.apply(this, args);
    };
  }, onAddListener = function(originalFn, type, handler, options) {
    if (type != "scroll" && type != "scrollend") return;
    const scrollport = this;
    let data = observed.get(scrollport);
    if (data === void 0) {
      let timeout = 0;
      data = {
        scrollListener: /* @__PURE__ */ __name((evt) => {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            if (pointers.size) {
              setTimeout(data.scrollListener, 180);
            } else {
              if (scrollport) {
                scrollport.dispatchEvent(scrollendEvent);
              }
              timeout = 0;
            }
          }, 180);
        }, "scrollListener"),
        listeners: 0
        // Count of number of listeners.
      };
      originalFn.apply(scrollport, ["scroll", data.scrollListener]);
      observed.set(scrollport, data);
    }
    data.listeners++;
  }, onRemoveListener = function(originalFn, type, handler) {
    if (type != "scroll" && type != "scrollend") return;
    const scrollport = this;
    const data = observed.get(scrollport);
    if (data === void 0) return;
    data[type]--;
    if (--data.listeners > 0) return;
    originalFn.apply(scrollport, ["scroll", data.scrollListener]);
    observed.delete(scrollport);
  };
  observe2 = observe, onAddListener2 = onAddListener, onRemoveListener2 = onRemoveListener;
  __name(observe, "observe");
  __name(onAddListener, "onAddListener");
  __name(onRemoveListener, "onRemoveListener");
  const scrollendEvent = new Event("scrollend");
  const pointers = /* @__PURE__ */ new Set();
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
  const observed = /* @__PURE__ */ new WeakMap();
  observe(Element.prototype, "addEventListener", onAddListener);
  observe(window, "addEventListener", onAddListener);
  observe(document, "addEventListener", onAddListener);
  observe(Element.prototype, "removeEventListener", onRemoveListener);
  observe(window, "removeEventListener", onRemoveListener);
  observe(document, "removeEventListener", onRemoveListener);
}
var observe2;
var onAddListener2;
var onRemoveListener2;

// assets/layout-effects.ts
var initLayoutEffects = /* @__PURE__ */ __name((bodyElement, headerElement) => {
  var _a2;
  const htmlElement = document.documentElement;
  const isHideOnScrollEnabled = !!((_a2 = window == null ? void 0 : window.theme_settings) == null ? void 0 : _a2.layout__header_hide_on_scroll);
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
  __name(setViewportHeightUnit, "setViewportHeightUnit");
  function applyOffsetForCurrentVisibility() {
    const isHidden = htmlElement.classList.contains("header-hidden");
    if (isHidden) {
      bodyElement.style.setProperty("--header-height-offset", "0px");
    }
    if (!isHidden) {
      bodyElement.style.setProperty("--header-height-offset", `${lastFullyVisibleOffsetPixels}px`);
    }
  }
  __name(applyOffsetForCurrentVisibility, "applyOffsetForCurrentVisibility");
  function measureHeader() {
    var _a3;
    const rectangle = headerElement.getBoundingClientRect();
    headerHeightPixels = (_a3 = rectangle == null ? void 0 : rectangle.height) != null ? _a3 : 0;
    bodyElement.style.setProperty("--header-height", `${headerHeightPixels}px`);
    const isHidden = htmlElement.classList.contains("header-hidden");
    if (!isHidden) {
      const bottom = Math.max(headerElement.getBoundingClientRect().bottom, 0);
      lastFullyVisibleOffsetPixels = Math.min(bottom, headerHeightPixels);
    }
    applyOffsetForCurrentVisibility();
  }
  __name(measureHeader, "measureHeader");
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
  __name(updateHeaderVisibilityByScroll, "updateHeaderVisibilityByScroll");
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
  __name(updateScrollClasses, "updateScrollClasses");
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY;
      updateScrollClasses(currentScrollY, deltaY);
      updateHeaderVisibilityByScroll(currentScrollY, deltaY);
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
  __name(onScroll, "onScroll");
  function onResize() {
    setViewportHeightUnit();
    measureHeader();
  }
  __name(onResize, "onResize");
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
}, "initLayoutEffects");
window._sections["initLayoutEffects"] = initLayoutEffects;

// assets/video-player.ts
var initVideoPlayer = /* @__PURE__ */ __name(($el) => {
  const video = $el.querySelector("video");
  const state = Alpine.reactive({
    playing: !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2),
    started: video.currentTime > 0,
    ended: video.ended,
    player: void 0,
    currentTime: video.currentTime | 0,
    duration: isFinite(video.duration) ? video.duration : 0,
    buffered: 0,
    seeking: false
  });
  const playVideo = /* @__PURE__ */ __name(() => video.play(), "playVideo");
  const pauseVideo = /* @__PURE__ */ __name(() => video.pause(), "pauseVideo");
  const seek = /* @__PURE__ */ __name((t) => {
    const time = Number(t) || 0;
    video.currentTime = time;
    state.currentTime = time;
  }, "seek");
  const nudge = /* @__PURE__ */ __name((delta) => {
    const time = Math.min(Math.max((video.currentTime || 0) + delta, 0), state.duration || 0);
    video.currentTime = time;
    state.currentTime = time;
  }, "nudge");
  const formatTime = /* @__PURE__ */ __name((s) => {
    if (!Number.isFinite(s)) return "0:00";
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  }, "formatTime");
  const updateBuffered = /* @__PURE__ */ __name(() => {
    try {
      let end = 0;
      for (let i = 0; i < video.buffered.length; i++) end = Math.max(end, video.buffered.end(i));
      state.buffered = Math.min(end, video.duration || 0);
    } catch {
      state.buffered = 0;
    }
  }, "updateBuffered");
  const startSeek = /* @__PURE__ */ __name((e) => {
    var _a2, _b;
    state.seeking = true;
    (_b = (_a2 = e.currentTarget) == null ? void 0 : _a2.setPointerCapture) == null ? void 0 : _b.call(_a2, e.pointerId);
    _seekFromEvent(e);
  }, "startSeek");
  const moveSeek = /* @__PURE__ */ __name((e) => {
    _seekFromEvent(e);
  }, "moveSeek");
  const endSeek = /* @__PURE__ */ __name((e) => {
    var _a2, _b;
    state.seeking = false;
    (_b = (_a2 = e == null ? void 0 : e.currentTarget) == null ? void 0 : _a2.releasePointerCapture) == null ? void 0 : _b.call(_a2, e.pointerId);
  }, "endSeek");
  const _seekFromEvent = /* @__PURE__ */ __name((e) => {
    var _a2;
    const rect = (_a2 = e == null ? void 0 : e.currentTarget) == null ? void 0 : _a2.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const ratio = rect.width ? x / rect.width : 0;
    seek(ratio * (state.duration || 0));
  }, "_seekFromEvent");
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
    _seekFromEvent
  };
}, "initVideoPlayer");
window._sections["initVideoPlayer"] = initVideoPlayer;

// assets/tabs.ts
var createEnsureNoHiddenTabs = /* @__PURE__ */ __name(({ rootElement, tabsStore, cooldownInMilliseconds = 200 }) => {
  let isInCooldownPeriod = false;
  const runCoreCheck = /* @__PURE__ */ __name(async () => {
    var _a2, _b;
    for (let i = 0; i < tabsStore[rootElement.id].current_tabs.length; i++) {
      const nodes = [...rootElement.querySelectorAll(`[data-tab-group="${i}"][data-tab-id]`)];
      if (!nodes.length) return;
      const currentId = (_a2 = tabsStore[rootElement.id].current_tabs) == null ? void 0 : _a2[i];
      const currentElement = nodes.find((el) => el.getAttribute("data-tab-id") === currentId);
      const isCurrentVisible = currentElement ? utils.isVisible(currentElement) : false;
      if (isCurrentVisible) return;
      for (const node of nodes) {
        if (node === currentElement) continue;
        tabsStore[rootElement.id].current_tabs[i] = (_b = node == null ? void 0 : node.getAttribute("data-tab-id")) != null ? _b : "";
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
  }, "runCoreCheck");
  const runAfterLayoutHasSettled = /* @__PURE__ */ __name(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        void runCoreCheck();
      });
    });
  }, "runAfterLayoutHasSettled");
  return () => {
    if (isInCooldownPeriod) return;
    isInCooldownPeriod = true;
    runAfterLayoutHasSettled();
    window.setTimeout(() => {
      isInCooldownPeriod = false;
    }, cooldownInMilliseconds);
  };
}, "createEnsureNoHiddenTabs");
var initTabsStore = /* @__PURE__ */ __name(() => {
  window.Alpine.store("tabs", {});
  const tabs = window.Alpine.store("tabs");
  window.Alpine.magic("tabs", () => tabs);
  window._stores["tabs"] = tabs;
}, "initTabsStore");
var initTabs = /* @__PURE__ */ __name(($el) => {
  var _a2;
  const raw_tabs = utils.JSONParse((_a2 = $el.getAttribute("data-tabs")) != null ? _a2 : "[]");
  const tabs = window.Alpine.store("tabs");
  tabs[$el.id] = {
    tabs: raw_tabs == null ? void 0 : raw_tabs.map((t) => t == null ? void 0 : t.split("|%S%|")),
    current_tabs: raw_tabs == null ? void 0 : raw_tabs.map((t) => {
      var _a3, _b;
      return (_b = (_a3 = t == null ? void 0 : t.split("|%S%|")) == null ? void 0 : _a3[0]) != null ? _b : "";
    })
  };
  const ensureNoHiddenTabs = createEnsureNoHiddenTabs({
    rootElement: $el,
    tabsStore: tabs,
    cooldownInMilliseconds: 200
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
}, "initTabs");
window._sections["initTabs"] = initTabs;

// assets/collapsible.ts
var initCollapsible = /* @__PURE__ */ __name(($el, container, defaultOpen = false) => {
  const state = window.Alpine.reactive({
    open_accordion: defaultOpen,
    opening: false,
    closing: false,
    timeout: null,
    themeEditorControl: false
  });
  if (container && $el.id) {
    container.setAttribute("aria-controls", $el.id);
  }
  Alpine.effect(() => {
    if (state.open_accordion) {
      container == null ? void 0 : container.removeAttribute("inert");
      container == null ? void 0 : container.setAttribute("aria-expanded", "true");
    }
    if (!state.open_accordion) {
      container == null ? void 0 : container.setAttribute("inert", "true");
      container == null ? void 0 : container.setAttribute("aria-expanded", "false");
    }
  });
  const toggleOpen = /* @__PURE__ */ __name(async (forceOpen = false, forceClose = false, callback = () => {
  }) => {
    if (state.themeEditorControl || !container) return;
    clearTimeout(state.timeout);
    if (container.scrollHeight === 0) {
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
  }, "toggleOpen");
  const closeSiblingCollapsibles = /* @__PURE__ */ __name(() => {
    const getClosestElements = /* @__PURE__ */ __name(($el2, iteration = 15) => {
      const closestElements = $el2.parentElement.querySelectorAll("details");
      if (closestElements == null ? void 0 : closestElements.length) {
        return closestElements;
      }
      if (!iteration) {
        return $el2.closest(".shopify-section").querySelectorAll("details");
      }
      return getClosestElements($el2.parentElement, iteration - 1);
    }, "getClosestElements");
    getClosestElements($el).forEach((el) => {
      var _a2;
      if (el === $el) return;
      (_a2 = el == null ? void 0 : el._x_dataStack) == null ? void 0 : _a2.forEach((proxyState) => {
        var _a3;
        if ((_a3 = proxyState == null ? void 0 : proxyState.collapsible) == null ? void 0 : _a3.open_accordion) {
          proxyState == null ? void 0 : proxyState.toggleOpen(false, true);
        }
      });
    });
  }, "closeSiblingCollapsibles");
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
    closeSiblingCollapsibles
  };
}, "initCollapsible");

// assets/content-slider.ts
var getTransformedComputedStyle = /* @__PURE__ */ __name((element) => {
  var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  const style = getComputedStyle(element);
  return {
    ...style,
    paddingLeft: parseFloat((_a2 = style.paddingLeft) == null ? void 0 : _a2.replace("auto", "0")),
    paddingRight: parseFloat((_b = style.paddingRight) == null ? void 0 : _b.replace("auto", "0")),
    paddingTop: parseFloat((_c = style.paddingTop) == null ? void 0 : _c.replace("auto", "0")),
    paddingBottom: parseFloat((_d = style.paddingBottom) == null ? void 0 : _d.replace("auto", "0")),
    scrollPaddingLeft: parseFloat((_e = style.scrollPaddingLeft) == null ? void 0 : _e.replace("auto", "0")),
    scrollPaddingRight: parseFloat((_f = style.scrollPaddingRight) == null ? void 0 : _f.replace("auto", "0")),
    scrollPaddingTop: parseFloat((_g = style.scrollPaddingTop) == null ? void 0 : _g.replace("auto", "0")),
    scrollPaddingBottom: parseFloat((_h = style.scrollPaddingBottom) == null ? void 0 : _h.replace("auto", "0")),
    columnGap: parseFloat((_i = style.columnGap) == null ? void 0 : _i.replace("auto", "0")),
    rowGap: parseFloat((_j = style.rowGap) == null ? void 0 : _j.replace("auto", "0"))
  };
}, "getTransformedComputedStyle");
var initContentSlider = /* @__PURE__ */ __name(($el, container, speed = 200, infiniteScroll = false, autoRotate = 0, enable_mouse_dragging = false) => {
  const isHorizontal = /* @__PURE__ */ __name(() => {
    return !!(getComputedStyle(container).overflowY === "hidden" || getComputedStyle(container).gridAutoFlow === "column" || container.scrollWidth > (container == null ? void 0 : container.clientWidth));
  }, "isHorizontal");
  const isScrollable = /* @__PURE__ */ __name(() => container.scrollWidth > container.clientWidth || container.scrollHeight > container.clientHeight, "isScrollable");
  const isDesktop = /* @__PURE__ */ __name(() => window.matchMedia("(min-width: 768px)").matches, "isDesktop");
  const shouldInfinite = /* @__PURE__ */ __name(() => {
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
  }, "shouldInfinite");
  const updateSliderHeightFromVisible = /* @__PURE__ */ __name(() => {
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
  }, "updateSliderHeightFromVisible");
  const random_id = utils.shortUUID();
  const containerStyles = getTransformedComputedStyle(container);
  const horizontal = isHorizontal();
  let breakPoints = [];
  let children = [...container.children].filter((el) => el.tagName !== "STYLE" && el.tagName !== "TEMPLATE").toSorted((a, b) => +getComputedStyle(a).order - +getComputedStyle(b).order);
  let size = children.length;
  const calculateSlideCount = /* @__PURE__ */ __name((padding = state.horizontal ? state.paddingX : state.paddingY, gap = state.gap, scrollSpace = container[state.horizontal ? "scrollWidth" : "scrollHeight"], clientSpace = container == null ? void 0 : container[state.horizontal ? "clientWidth" : "clientHeight"]) => {
    var _a2, _b, _c, _d, _e;
    const horizontal2 = isHorizontal();
    const containerStyles2 = getTransformedComputedStyle(container);
    if (scrollSpace <= clientSpace) {
      return 1;
    }
    breakPoints = [];
    const snapToSlide = (_a2 = container.classList) == null ? void 0 : _a2.contains("snap-to-slide");
    let targetElements = (_e = (_d = [...container.children]) == null ? void 0 : _d.slice(
      0,
      Math.ceil(
        ((_b = container.children) == null ? void 0 : _b.length) / +((_c = getComputedStyle(container).getPropertyValue(horizontal2 ? "grid-template-rows" : "grid-template-columns").split(" ").length) != null ? _c : 1)
      )
    )) == null ? void 0 : _e.filter(
      (child) => getComputedStyle(child).display !== "none" && (getComputedStyle(child).scrollSnapAlign !== "none" || snapToSlide)
    );
    targetElements = targetElements == null ? void 0 : targetElements.toSorted((a, b) => +getComputedStyle(a).order - +getComputedStyle(b).order);
    if (snapToSlide) {
      const gap2 = horizontal2 ? containerStyles2.columnGap : containerStyles2.rowGap;
      const paddingStart = horizontal2 ? containerStyles2.paddingLeft : containerStyles2.paddingTop;
      const newTargetElements = [];
      targetElements.forEach((el) => {
        el.style.scrollSnapAlign = "";
      });
      for (let i = 0; i < Math.ceil((scrollSpace - padding - (targetElements.length - 1) * gap2) / (clientSpace - padding)); i++) {
        const targetEl = targetElements.find(
          (el) => el[horizontal2 ? "offsetLeft" : "offsetTop"] - paddingStart >= i * (clientSpace - padding) + gap2 * i
        );
        if (targetEl) {
          targetEl.style.scrollSnapAlign = "start";
          newTargetElements.push(targetEl);
        }
      }
      targetElements = newTargetElements;
    }
    if (!Math.ceil((scrollSpace - padding) / (clientSpace - padding)) || Math.ceil(Math.round((scrollSpace - padding) / (clientSpace - padding) * 100) / 100) === Infinity) {
      return 0;
    }
    const breakPointIndex = [
      ...new Array(Math.ceil(Math.round((scrollSpace - padding) / (clientSpace - padding) * 100) / 100))
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
    return breakPointIndex || Math.ceil(Math.round((scrollSpace - padding) / (clientSpace - padding) * 100) / 100);
  }, "calculateSlideCount");
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
      container == null ? void 0 : container[horizontal ? "scrollWidth" : "scrollHeight"],
      container == null ? void 0 : container[horizontal ? "clientWidth" : "clientHeight"]
    ),
    block_scroll_events: false,
    horizontal
  });
  const markCenteredChild = /* @__PURE__ */ __name((children2) => {
    const horizontal2 = isHorizontal();
    const centerX = (container == null ? void 0 : container[horizontal2 ? "scrollLeft" : "scrollTop"]) + (container == null ? void 0 : container[horizontal2 ? "clientWidth" : "clientHeight"]) / 2;
    let closest = null;
    let minDist = Infinity;
    children2.forEach((child) => {
      const center = (child == null ? void 0 : child[horizontal2 ? "offsetLeft" : "offsetTop"]) + (child == null ? void 0 : child[horizontal2 ? "clientWidth" : "clientHeight"]) / 2;
      const dist = Math.abs(center - centerX);
      if (dist < minDist) {
        minDist = dist;
        closest = child;
      }
    });
    children2.forEach((child) => {
      child.classList.toggle("centered", child === closest);
    });
  }, "markCenteredChild");
  const initInfiniteScroll = /* @__PURE__ */ __name((index = 0, force = false) => {
    var _a2, _b, _c, _d;
    children = [...container.children].filter((el) => el.tagName !== "STYLE" && el.tagName !== "TEMPLATE").toSorted((a, b) => +getComputedStyle(a).order - +getComputedStyle(b).order);
    const containerStyles2 = getTransformedComputedStyle(container);
    size = ((_a2 = children.filter((el) => el.hasAttribute("data-original-node"))) == null ? void 0 : _a2.length) || children.length;
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
      children = [...container.children].filter((el) => el.tagName !== "STYLE" && el.tagName !== "TEMPLATE").toSorted((a, b) => +getComputedStyle(a).order - +getComputedStyle(b).order);
    }
    if (shouldInfinite() && (!state.infinite || force)) {
      const visibleSpace = (_b = container.getBoundingClientRect()) == null ? void 0 : _b[horizontal ? "width" : "height"];
      const gapSize = (containerStyles2 == null ? void 0 : containerStyles2[horizontal ? "columnGap" : "rowGap"]) || 0;
      const totalContentSpace = [...container.children].filter((el) => el.tagName !== "STYLE" && el.tagName !== "TEMPLATE").reduce(
        (sum, child, index2) => {
          var _a3;
          return sum + ((_a3 = child.getBoundingClientRect()) == null ? void 0 : _a3[horizontal ? "width" : "height"]) + (index2 === 0 ? 0 : gapSize);
        },
        0
      );
      if (totalContentSpace > visibleSpace) {
        state.infinite = true;
        children = (_c = [...new Array(size * 2)].map((_, index2) => {
          const order_index = index2 - size;
          const child = children.at(order_index);
          child.style.order = `${order_index}`;
          if (order_index < 0) {
            const newChild = child.cloneNode(true);
            child.setAttribute("data-original-node", "true");
            container.append(newChild);
            return newChild;
          }
          return child;
        })) == null ? void 0 : _c.sort((a, b) => +a.style.order - +b.style.order);
        if (container[horizontal ? "scrollWidth" : "scrollHeight"] < totalContentSpace) {
          requestAnimationFrame(() => {
            var _a3;
            const containerStyles3 = getTransformedComputedStyle(container);
            const scrollPadding = containerStyles3[horizontal ? "scrollPaddingLeft" : "scrollPaddingTop"];
            container[horizontal ? "scrollLeft" : "scrollTop"] = ((_a3 = children[size + index]) == null ? void 0 : _a3[horizontal ? "offsetLeft" : "offsetTop"]) - scrollPadding;
            children.forEach((child) => {
              child.classList.toggle("scroll-active", +getComputedStyle(child).order === 0);
            });
          });
        } else {
          const scrollPadding = containerStyles2[horizontal ? "scrollPaddingLeft" : "scrollPaddingTop"];
          container[horizontal ? "scrollLeft" : "scrollTop"] = ((_d = children[size + index]) == null ? void 0 : _d[horizontal ? "offsetLeft" : "offsetTop"]) - scrollPadding;
        }
      }
      children.forEach((child) => {
        child.classList.toggle("scroll-active", +getComputedStyle(child).order === 0);
      });
      markCenteredChild(children);
    }
    children.forEach((child, index2) => child.setAttribute("data-index", `${index2}`));
  }, "initInfiniteScroll");
  initInfiniteScroll();
  const handleInfiniteScroll = /* @__PURE__ */ __name((event = void 0, noRepeat = false) => {
    var _a2, _b;
    if (state.block_scroll_events || !state.infinite) return;
    const containerStyles2 = getTransformedComputedStyle(container);
    container.parentElement.style.setProperty("--slider-height", `${container.offsetHeight}px`);
    container.parentElement.style.setProperty(
      "--slider-width",
      `${(container == null ? void 0 : container.clientWidth) - containerStyles2.paddingLeft - containerStyles2.paddingRight}px`
    );
    children = [...children];
    const scrollDistance = container[state.horizontal ? "scrollLeft" : "scrollTop"] + containerStyles2[state.horizontal ? "scrollPaddingLeft" : "scrollPaddingTop"];
    const targetIndex = children.findIndex(
      (child) => child[state.horizontal ? "offsetLeft" : "offsetTop"] - 30 < scrollDistance && (child == null ? void 0 : child[state.horizontal ? "offsetLeft" : "offsetTop"]) + 30 > scrollDistance
    );
    if (targetIndex === -1) {
      if (!noRepeat) {
        setTimeout(() => {
          handleInfiniteScroll(void 0, true);
        }, 1e3);
      }
      return;
    }
    state.block_scroll_events = true;
    children = (_a2 = [...children].map((child, index) => {
      const targetOrder = index - targetIndex;
      child.style.order = targetOrder >= -size && targetOrder < size ? `${targetOrder}` : targetOrder < -size ? `${targetOrder + size * 2}` : `${targetOrder - size * 2}`;
      return child;
    })) == null ? void 0 : _a2.sort((a, b) => +a.style.order - +b.style.order);
    container[state.horizontal ? "scrollLeft" : "scrollTop"] = ((_b = children[size]) == null ? void 0 : _b[state.horizontal ? "offsetLeft" : "offsetTop"]) - containerStyles2[state.horizontal ? "scrollPaddingLeft" : "scrollPaddingTop"];
    Alpine.nextTick(() => {
      var _a3;
      state.block_scroll_events = false;
      const children2 = (_a3 = [...container.children]) == null ? void 0 : _a3.filter(
        (child) => getComputedStyle(child).display !== "none" && getComputedStyle(child).scrollSnapAlign !== "none"
      );
      if (state.infinite && (children2 == null ? void 0 : children2.length)) {
        const targetIndex2 = children2 == null ? void 0 : children2.findIndex((child) => +child.style.order === 0);
        state.current_index = targetIndex2 >= children2.length / 2 ? targetIndex2 - children2.length / 2 : targetIndex2;
        children2.forEach((child, index) => {
          child.classList.toggle("scroll-active", index === targetIndex2);
        });
      }
    });
  }, "handleInfiniteScroll");
  const handleScroll = /* @__PURE__ */ __name(() => {
    var _a2;
    if (state.block_scroll_events) return;
    if (state.infinite) {
      const containerStyles2 = getTransformedComputedStyle(container);
      container.parentElement.style.setProperty("--slider-height", `${container.offsetHeight}px`);
      container.parentElement.style.setProperty(
        "--slider-width",
        `${(container == null ? void 0 : container.clientWidth) - containerStyles2.paddingLeft - containerStyles2.paddingRight}px`
      );
    }
    const currentIndex = breakPoints.findIndex(
      (num) => container[state.horizontal ? "scrollLeft" : "scrollTop"] >= num - 20 && container[state.horizontal ? "scrollLeft" : "scrollTop"] <= num + 20
    );
    const closest = breakPoints.reduce((acc, num) => {
      return Math.abs(num - container[state.horizontal ? "scrollLeft" : "scrollTop"]) < Math.abs(acc - container[state.horizontal ? "scrollLeft" : "scrollTop"]) ? num : acc;
    }, 0);
    const closestIndex = breakPoints.findIndex((num) => closest === num);
    const activeChildren = (_a2 = [...container.children]) == null ? void 0 : _a2.filter(
      (child) => getComputedStyle(child).display !== "none" && getComputedStyle(child).scrollSnapAlign !== "none"
    );
    const sortedActiveChildren = activeChildren == null ? void 0 : activeChildren.toSorted((a, b) => +getComputedStyle(a).order - +getComputedStyle(b).order);
    if (state.infinite && (sortedActiveChildren == null ? void 0 : sortedActiveChildren.length)) {
      const targetIndex = sortedActiveChildren == null ? void 0 : sortedActiveChildren.findIndex((child) => +child.style.order === 0);
      sortedActiveChildren.forEach((child, index) => {
        child.classList.toggle("scroll-active", index === targetIndex);
      });
      markCenteredChild(sortedActiveChildren);
      return;
    }
    if (sortedActiveChildren == null ? void 0 : sortedActiveChildren.length) {
      if ((container == null ? void 0 : container[state.horizontal ? "clientWidth" : "clientHeight"]) + container[state.horizontal ? "scrollLeft" : "scrollTop"] + 10 >= container[state.horizontal ? "scrollWidth" : "scrollHeight"]) {
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
  }, "handleScroll");
  const handleResize = /* @__PURE__ */ __name(() => {
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
        container[state.horizontal ? "scrollWidth" : "scrollHeight"] > (container == null ? void 0 : container[state.horizontal ? "clientWidth" : "clientHeight"])
      );
      handleScroll();
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(updateSliderHeightFromVisible);
    });
  }, "handleResize");
  const scrollToIndex = /* @__PURE__ */ __name((index, scrollDuration = speed) => {
    var _a2, _b, _c;
    if (index === state.current_index) return;
    container.classList.remove("snap-both", "snap-x", "snap-y");
    const containerStyles2 = getTransformedComputedStyle(container);
    state.block_scroll_events = true;
    const activeChildren = (_a2 = [...container.children]) == null ? void 0 : _a2.filter(
      (child) => getComputedStyle(child).display !== "none" && getComputedStyle(child).scrollSnapAlign !== "none"
    );
    const sortedActiveChildren = activeChildren == null ? void 0 : activeChildren.toSorted((a, b) => +getComputedStyle(a).order - +getComputedStyle(b).order);
    if (sortedActiveChildren == null ? void 0 : sortedActiveChildren.length) {
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
        ((_b = target == null ? void 0 : target.offsetLeft) != null ? _b : 0) - containerStyles2.scrollPaddingLeft,
        ((_c = target == null ? void 0 : target.offsetTop) != null ? _c : 0) - containerStyles2.scrollPaddingTop,
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
      ((container == null ? void 0 : container.clientWidth) - state.paddingX) * index + index * state.gap,
      ((container == null ? void 0 : container.clientHeight) - state.paddingY) * index + index * state.gap,
      container,
      () => {
        container.classList.add(state.horizontal ? "snap-x" : "snap-y");
        state.block_scroll_events = false;
        handleScroll();
      }
    );
  }, "scrollToIndex");
  if (state.justify === "center") {
    container.classList.toggle(
      "!justify-start",
      container[state.horizontal ? "scrollWidth" : "scrollHeight"] > (container == null ? void 0 : container[state.horizontal ? "clientWidth" : "clientHeight"])
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
          var _a2, _b, _c;
          if (state.infinite) {
            const target = (_a2 = [...container.children]) == null ? void 0 : _a2.find((child) => +getComputedStyle(child).order === 1);
            if (target) {
              container.classList.remove("snap-both", "snap-x", "snap-y");
              const containerStyles2 = getTransformedComputedStyle(container);
              state.block_scroll_events = true;
              utils.scrollToXY(
                speed,
                ((_b = target == null ? void 0 : target.offsetLeft) != null ? _b : 0) - containerStyles2.scrollPaddingLeft,
                ((_c = target == null ? void 0 : target.offsetTop) != null ? _c : 0) - containerStyles2.scrollPaddingTop,
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
        }, autoRotate * 1e3);
      }
      if (state.rotateInterval && state.rotatePause) {
        clearInterval(state.rotateInterval);
        state.rotateInterval = null;
      }
    });
  }
  container.classList.add(state.horizontal ? "snap-x" : "snap-y");
  if (enable_mouse_dragging) {
    const enableDragScroll = /* @__PURE__ */ __name((container2) => {
      let isDragging = false;
      let dragged = false;
      let startX, startY, scrollLeft, scrollTop;
      container2.classList.toggle("cursor-grab", enable_mouse_dragging && !state.infinite && isScrollable());
      const deactivateCursor = /* @__PURE__ */ __name(() => {
        container2.classList.remove("cursor-grab");
      }, "deactivateCursor");
      const addDraggingCursor = /* @__PURE__ */ __name(() => {
        document.body.classList.add("dragging");
      }, "addDraggingCursor");
      const removeDraggingCursor = /* @__PURE__ */ __name(() => {
        document.body.classList.remove("dragging");
      }, "removeDraggingCursor");
      const smoothSnapToClosestChild = /* @__PURE__ */ __name(() => {
        const children2 = Array.from(container2.children);
        if (!children2.length) return;
        const horizontal2 = container2.scrollWidth > container2.clientWidth;
        const style = getComputedStyle(container2);
        const padStart = horizontal2 ? parseFloat(style.paddingLeft) || 0 : parseFloat(style.paddingTop) || 0;
        const scrollPos = horizontal2 ? container2.scrollLeft : container2.scrollTop;
        const snapStart = /* @__PURE__ */ __name((el) => (horizontal2 ? el.offsetLeft : el.offsetTop) - padStart, "snapStart");
        let closest = null;
        let minDist = Infinity;
        for (const child of children2) {
          const start = snapStart(child);
          const dist = Math.abs(start - scrollPos);
          if (dist < minDist) {
            minDist = dist;
            closest = child;
          }
        }
        if (!closest) return;
        const targetPos = snapStart(closest);
        container2.scrollTo({
          [horizontal2 ? "left" : "top"]: targetPos,
          behavior: "smooth"
        });
        setTimeout(() => {
          container2.style.scrollSnapType = "";
        }, 400);
      }, "smoothSnapToClosestChild");
      const onMouseDown = /* @__PURE__ */ __name((e) => {
        if (state.infinite || document.body.classList.contains("dragging")) return;
        if (!isScrollable()) return;
        isDragging = true;
        dragged = false;
        startX = e.pageX - container2.offsetLeft;
        startY = e.pageY - container2.offsetTop;
        scrollLeft = container2.scrollLeft;
        scrollTop = container2.scrollTop;
        addDraggingCursor();
        container2.style.scrollSnapType = "none";
        e.preventDefault();
      }, "onMouseDown");
      const onMouseMove = /* @__PURE__ */ __name((e) => {
        if (!isDragging) return;
        dragged = true;
        const x = e.pageX - container2.offsetLeft;
        const y = e.pageY - container2.offsetTop;
        const walkX = (x - startX) * 1.5;
        const walkY = (y - startY) * 2;
        container2.scrollLeft = scrollLeft - walkX;
        container2.scrollTop = scrollTop - walkY;
      }, "onMouseMove");
      const onMouseUp = /* @__PURE__ */ __name(() => {
        if (!isDragging) return;
        isDragging = false;
        removeDraggingCursor();
        if (dragged) {
          smoothSnapToClosestChild();
        } else {
          container2.style.scrollSnapType = "";
        }
      }, "onMouseUp");
      const onClickCapture = /* @__PURE__ */ __name((e) => {
        if (dragged) {
          e.stopPropagation();
          e.preventDefault();
          dragged = false;
        }
      }, "onClickCapture");
      container2.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mousemove", onMouseMove, true);
      window.addEventListener("mouseup", onMouseUp, true);
      container2.addEventListener("click", onClickCapture, true);
      const ro = new ResizeObserver(() => {
        if (isScrollable()) {
          container2.classList.toggle("cursor-grab", enable_mouse_dragging && !state.infinite && isScrollable());
        } else {
          deactivateCursor();
        }
      });
      ro.observe(container2);
      const mo = new MutationObserver(() => {
        if (isScrollable()) {
          container2.classList.toggle("cursor-grab", enable_mouse_dragging && !state.infinite && isScrollable());
        } else {
          deactivateCursor();
        }
      });
      mo.observe(container2, { childList: true, subtree: true });
    }, "enableDragScroll");
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
      initInfiniteScroll
    }
  };
}, "initContentSlider");

// assets/utils.ts
var JSONParse = /* @__PURE__ */ __name((object, origin = "") => {
  if (object === void 0) {
    return null;
  }
  try {
    return JSON.parse(object);
  } catch (err) {
    return null;
  }
}, "JSONParse");
var getImageSrcSet = /* @__PURE__ */ __name((src, maxWidth) => {
  var _a2, _b;
  if (!src || typeof src !== "string") {
    return "";
  }
  if (src == null ? void 0 : src.includes("?")) {
    return (_a2 = [96, 180, 256, 384, 460, 640, 960, 1200, 1440, 1920, 3840].map((number, index, arr) => {
      if (maxWidth && arr[index - 1] > maxWidth) {
        return null;
      }
      return `${src}&width=${number} ${number}w`;
    })) == null ? void 0 : _a2.filter((d) => !!d).join(",");
  }
  return (_b = [96, 180, 256, 384, 460, 640, 960, 1200, 1440, 1920, 3840].map((number, index, arr) => {
    if (maxWidth && arr[index - 1] > maxWidth) {
      return null;
    }
    return `${src}?width=${number} ${number}w`;
  })) == null ? void 0 : _b.filter((d) => !!d).join(",");
}, "getImageSrcSet");
var getReviewStarGradients = /* @__PURE__ */ __name((rating, position) => {
  return `url(#star-rating-${rating < position - 1 ? 0 : rating < position && rating > position - 1 ? Math.floor((rating - (position - 1)) * 100 / 25) * 25 : 100})`;
}, "getReviewStarGradients");
var pushSearchParams = /* @__PURE__ */ __name(({
  update = {},
  remove = [],
  title
}) => {
  const url = new URL(window.location.href);
  Object.entries(update).forEach(([key, value]) => {
    url.searchParams.set(key, `${value}`);
  });
  remove.forEach((key) => {
    url.searchParams.delete(key);
  });
  window.history.pushState(null, null, url);
}, "pushSearchParams");
var replaceSearchParams = /* @__PURE__ */ __name(({
  update = {},
  remove = [],
  title
}) => {
  const url = new URL(window.location.href);
  Object.entries(update).forEach(([key, value]) => {
    url.searchParams.set(key, `${value}`);
  });
  remove.forEach((key) => {
    url.searchParams.delete(key);
  });
  window.history.replaceState(null, null, url);
}, "replaceSearchParams");
var getSiblingUrl = /* @__PURE__ */ __name((handle) => {
  const url = new URL(window.location.href);
  url.pathname = /\/collections\/[^/]\/products\//gi.test(url.pathname) ? url.pathname.replace(/\/products\/[^?]*/gi, `/products/${handle}`) : `/products/${handle}`;
  url.searchParams.delete("variant");
  url.searchParams.delete("selling_plan");
  return url.toString();
}, "getSiblingUrl");
var pushUrlTarget = /* @__PURE__ */ __name((id) => {
  const url = new URL(window.location.href);
  url.hash = id;
  window.history.replaceState(null, null, url);
}, "pushUrlTarget");
var checkDomain = /* @__PURE__ */ __name(function(url) {
  if (url && (url == null ? void 0 : url.indexOf("//")) === 0) {
    url = location.protocol + url;
  }
  return url.toLowerCase().replace(/([a-z])?:\/\//, "$1").split("/")[0];
}, "checkDomain");
var isExternalURL = /* @__PURE__ */ __name(function(url) {
  if (!url || typeof url !== "string") {
    return false;
  }
  return ((url == null ? void 0 : url.indexOf(":")) > -1 || (url == null ? void 0 : url.indexOf("//")) > -1) && checkDomain(location.href) !== checkDomain(url);
}, "isExternalURL");
var transpileRichtextMetafield = /* @__PURE__ */ __name((schema) => {
  function convertSchemaToHtml(schema2) {
    let html = ``;
    if (!Array.isArray(schema2) && schema2.type === "root") {
      html += convertSchemaToHtml(schema2.children);
    }
    if (Array.isArray(schema2)) {
      schema2 == null ? void 0 : schema2.forEach((el) => {
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
  __name(convertSchemaToHtml, "convertSchemaToHtml");
  function buildParagraph(el) {
    if (el == null ? void 0 : el.children) {
      return `<p>${convertSchemaToHtml(el == null ? void 0 : el.children)}</p>`;
    }
    return "";
  }
  __name(buildParagraph, "buildParagraph");
  function buildHeading(el) {
    if (el == null ? void 0 : el.children) {
      return `<h${el == null ? void 0 : el.level}>${convertSchemaToHtml(el == null ? void 0 : el.children)}</h${el == null ? void 0 : el.level}>`;
    }
    return "";
  }
  __name(buildHeading, "buildHeading");
  function buildList(el) {
    if (el == null ? void 0 : el.children) {
      if ((el == null ? void 0 : el.listType) === "ordered") {
        return `<ol>${convertSchemaToHtml(el == null ? void 0 : el.children)}</ol>`;
      } else {
        return `<ul>${convertSchemaToHtml(el == null ? void 0 : el.children)}</ul>`;
      }
    }
    return "";
  }
  __name(buildList, "buildList");
  function buildListItem(el) {
    if (el == null ? void 0 : el.children) {
      return `<li>${convertSchemaToHtml(el == null ? void 0 : el.children)}</li>`;
    }
    return "";
  }
  __name(buildListItem, "buildListItem");
  function buildLink(el) {
    return `<a href="${el == null ? void 0 : el.url}" title="${el == null ? void 0 : el.title}" target="${el == null ? void 0 : el.target}">${convertSchemaToHtml(el == null ? void 0 : el.children)}</a>`;
  }
  __name(buildLink, "buildLink");
  function buildText(el) {
    if (el == null ? void 0 : el.bold) {
      return `<strong>${el == null ? void 0 : el.value}</strong>`;
    }
    if (el == null ? void 0 : el.italic) {
      return `<em>${el == null ? void 0 : el.value}</em>`;
    }
    return el == null ? void 0 : el.value;
  }
  __name(buildText, "buildText");
  return convertSchemaToHtml(schema);
}, "transpileRichtextMetafield");
var clsx = /* @__PURE__ */ __name((...props) => {
  let i = 0;
  let tmp;
  let str = "";
  const len = props.length;
  for (; i < len; i++) {
    if (tmp = props[i]) {
      if (typeof tmp === "string") {
        str += (str && " ") + tmp;
      }
    }
  }
  return str;
}, "clsx");
var shortUUID = /* @__PURE__ */ __name(() => {
  let firstPart = Math.random() * 46656 | 0;
  let secondPart = Math.random() * 46656 | 0;
  firstPart = `000${firstPart.toString(36)}`.slice(-3);
  secondPart = `000${secondPart.toString(36)}`.slice(-3);
  return firstPart + secondPart;
}, "shortUUID");
var isEmail = /* @__PURE__ */ __name((str) => {
  if (!str) return false;
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(str);
}, "isEmail");
var formatMoney = /* @__PURE__ */ __name((cents, money_format = window.money_format, no_rounding = true) => {
  var _a2, _b;
  if (money_format == null ? void 0 : money_format.includes("store_default")) {
    money_format = window.money_format;
  }
  if (cents === null || cents === void 0) return "";
  if (typeof cents === "string") {
    cents = cents.replace(/[^\d]/g, "");
    cents = parseInt(cents, 10);
  }
  const formatRegex = /{{\s*(\w+)\s*}}/;
  const formatKey = (_a2 = money_format == null ? void 0 : money_format.match(formatRegex)) == null ? void 0 : _a2[1];
  const formatNumber = /* @__PURE__ */ __name((value, decimals = 2, thousandsSep = ",", decimalSep = ".") => {
    if (isNaN(value)) return "0";
    const fixed = (value / 100).toFixed(decimals);
    const [intPart, decPart] = fixed.split(".");
    const intWithSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
    return decimals > 0 ? `${intWithSep}${decimalSep}${decPart}` : intWithSep;
  }, "formatNumber");
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
      formatted = formatNumber(cents, 2, "\xA0", ",");
      break;
    case "amount_with_period_and_space_separator":
      formatted = formatNumber(cents, 2, " ", ".");
      break;
    case "amount_no_decimals_with_comma_separator":
      formatted = formatNumber(cents, 0, ".", ",");
      break;
    case "amount_no_decimals_with_space_separator":
      formatted = formatNumber(cents, 0, "\xA0", ",");
      break;
    case "amount_with_apostrophe_separator":
      formatted = formatNumber(cents, 2, "'", ".");
      break;
    default:
      return formatNumber(cents, 2);
  }
  return (_b = money_format == null ? void 0 : money_format.replace(formatRegex, formatted)) != null ? _b : formatted;
}, "formatMoney");
window["formatMoney"] = formatMoney;
var roundToIndex = /* @__PURE__ */ __name(function(x, index = 0) {
  const power = Math.pow(10, -index);
  return Math.round(x * power) / power;
}, "roundToIndex");
var easeInOutQuad = /* @__PURE__ */ __name(({ currentTime, start, change, duration }) => {
  let newCurrentTime = currentTime;
  newCurrentTime /= duration / 2;
  if (newCurrentTime < 1) {
    return change / 2 * newCurrentTime * newCurrentTime + start;
  }
  newCurrentTime -= 1;
  return -change / 2 * (newCurrentTime * (newCurrentTime - 2) - 1) + start;
}, "easeInOutQuad");
var scrollToY = /* @__PURE__ */ __name((duration, to, container = window, callback = () => {
}) => {
  const start = container instanceof HTMLElement ? container.scrollTop : container.scrollY;
  const change = to - start;
  const startDate = (/* @__PURE__ */ new Date()).getTime();
  const animateScroll = /* @__PURE__ */ __name(() => {
    const currentDate = (/* @__PURE__ */ new Date()).getTime();
    const currentTime = currentDate - startDate;
    container.scrollTo(
      0,
      easeInOutQuad({
        currentTime,
        start,
        change,
        duration
      })
    );
    if (currentTime < duration) {
      requestAnimationFrame(animateScroll);
    } else {
      container.scrollTo(0, to);
      callback();
    }
  }, "animateScroll");
  animateScroll();
}, "scrollToY");
var scrollToX = /* @__PURE__ */ __name((duration, to, container = window, callback = () => {
}) => {
  const start = container instanceof HTMLElement ? container.scrollLeft : container.scrollX;
  const change = to - start;
  const startDate = (/* @__PURE__ */ new Date()).getTime();
  const animateScroll = /* @__PURE__ */ __name(() => {
    const currentDate = (/* @__PURE__ */ new Date()).getTime();
    const currentTime = currentDate - startDate;
    container.scrollTo(
      easeInOutQuad({
        currentTime,
        start,
        change,
        duration
      }),
      0
    );
    if (currentTime < duration) {
      requestAnimationFrame(animateScroll);
    } else {
      container.scrollTo(to, 0);
      callback();
    }
  }, "animateScroll");
  animateScroll();
}, "scrollToX");
var scrollToXY = /* @__PURE__ */ __name((duration, x, y, container = window, callback = () => {
}) => {
  const startX = container instanceof HTMLElement ? container.scrollLeft : container.scrollX;
  const startY = container instanceof HTMLElement ? container.scrollTop : container.scrollY;
  const changeX = x - startX;
  const changeY = y - startY;
  const startDate = Date.now();
  const animateScroll = /* @__PURE__ */ __name(() => {
    const currentDate = Date.now();
    const currentTime = currentDate - startDate;
    container.scrollTo(
      easeInOutQuad({
        currentTime,
        start: startX,
        change: changeX,
        duration
      }),
      easeInOutQuad({
        currentTime,
        start: startY,
        change: changeY,
        duration
      })
    );
    if (currentTime < duration) {
      requestAnimationFrame(animateScroll);
    } else {
      container.scrollTo(x, y);
      callback();
    }
  }, "animateScroll");
  animateScroll();
}, "scrollToXY");
var isElementScrollable = /* @__PURE__ */ __name((element) => {
  if (!element) return false;
  const { overflowX, overflowY } = getComputedStyle(element);
  const isScrollableX = element.scrollWidth > element.clientWidth && overflowX !== "visible";
  const isScrollableY = element.scrollHeight > element.clientHeight && overflowY !== "visible";
  return isScrollableX || isScrollableY;
}, "isElementScrollable");
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
__name(getElementPosition, "getElementPosition");
var getElementOffset = /* @__PURE__ */ __name((el) => {
  const rect = el.getBoundingClientRect(), scrollLeft = window.pageXOffset || document.documentElement.scrollLeft, scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
}, "getElementOffset");
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
__name(delay, "delay");
var debounce = /* @__PURE__ */ __name((callback, wait = 1) => {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, wait);
  };
}, "debounce");
var findAllScrollableParents = /* @__PURE__ */ __name((element) => {
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
  if (document.scrollingElement) {
    scrollableParents.push(document.scrollingElement);
  }
  scrollableParents.push(window);
  return scrollableParents;
}, "findAllScrollableParents");
var findCurrentlyAllScrollableParents = /* @__PURE__ */ __name((element) => {
  const scrollableParents = [];
  let parent = element.parentElement;
  while (parent) {
    const style2 = window.getComputedStyle(parent);
    const overflowY2 = style2.getPropertyValue("overflow-y");
    if ((overflowY2 === "auto" || overflowY2 === "scroll") && parent.scrollHeight > parent.clientHeight) {
      scrollableParents.push(parent);
    }
    parent = parent.parentElement;
  }
  parent = document.scrollingElement;
  const style = window.getComputedStyle(document.scrollingElement);
  const overflowY = style == null ? void 0 : style.getPropertyValue("overflow-y");
  if ((overflowY === "auto" || overflowY === "scroll") && parent.scrollHeight > parent.clientHeight) {
    scrollableParents.push(document.scrollingElement);
  }
  return scrollableParents;
}, "findCurrentlyAllScrollableParents");
var handlelize = /* @__PURE__ */ __name((str) => {
  str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/([^\w]+|\s+)/g, "-").replace(/--+/g, "-").replace(/(^-+|-+$)/g, "").toLowerCase();
  return str;
}, "handlelize");
var serializeForm = /* @__PURE__ */ __name((formElement) => {
  const obj = {};
  const formData = new FormData(formElement);
  for (const key of formData.keys()) {
    obj[key] = formData.get(key);
  }
  return obj;
}, "serializeForm");
var deepEqual = /* @__PURE__ */ __name((a, b) => {
  if (a === b) return true;
  if (a && b && typeof a === "object" && typeof b === "object") {
    if (a.constructor !== b.constructor) return false;
    let length, i, keys;
    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0; ) if (!deepEqual(a[i], b[i])) return false;
      return true;
    }
    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
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
  return a !== a && b !== b;
}, "deepEqual");
window.clsx = clsx;
var isVisible = /* @__PURE__ */ __name((elem, isParent = false) => {
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
}, "isVisible");
var isInViewport = /* @__PURE__ */ __name((element) => {
  const { y } = element.getBoundingClientRect();
  if (y > window.innerHeight || y < 0) {
    return false;
  }
  return true;
}, "isInViewport");
var isElementVisiblyOnTop = /* @__PURE__ */ __name((element) => {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const topElement = document.elementFromPoint(centerX, centerY);
  return element === topElement || element.contains(topElement);
}, "isElementVisiblyOnTop");
var isElementFullyVisible = /* @__PURE__ */ __name((el) => isInViewport(el) && isElementVisiblyOnTop(el), "isElementFullyVisible");
var unwrapNestedBlocksSimple = /* @__PURE__ */ __name((html) => {
  var _a2;
  if (typeof html !== "string") {
    return html;
  }
  return (_a2 = html == null ? void 0 : html.replace(
    /<(?<outer>p|h[1-6])[^>]*>\s*<(?<inner>\k<outer>)[^>]*>((?:.|\n)*?)<\/\k<inner>>\s*<\/\k<outer>>/gi,
    "<$<inner>>$3</$<inner>>"
  )) != null ? _a2 : "";
}, "unwrapNestedBlocksSimple");
var applyInlinePluralization = /* @__PURE__ */ __name((content) => {
  let replaced = content;
  replaced = replaced.replace(/(\d+)\s+([a-zA-Z]+)\{([^{}|]+)(?:\|([^{}|]+))?\}/g, (_, number, base, singular, plural) => {
    const count = parseInt(number, 10);
    return plural === void 0 ? `${number} ${base}${count === 1 ? "" : singular}` : `${number} ${count === 1 ? base + singular : base + plural}`;
  });
  replaced = replaced.replace(/([a-zA-Z]+)\{([^{}|]+)(?:\|([^{}|]+))?\}/g, (match, base, singular, plural, offset) => {
    const upToMatch = replaced.slice(0, offset);
    const matchNumber = upToMatch.match(/(\d+)(?!.*\d)/);
    const count = matchNumber ? parseInt(matchNumber[1], 10) : 1;
    return plural === void 0 ? `${base}${count === 1 ? "" : singular}` : `${count === 1 ? base + singular : base + plural}`;
  });
  return replaced;
}, "applyInlinePluralization");
var getBracketInputDynamicPluralizedText = /* @__PURE__ */ __name((content, object = {}) => {
  var _a2;
  let returnValue = "";
  returnValue = (_a2 = content == null ? void 0 : content.replace(/\[([^\]]*)\]/gi, (...matches) => {
    var _a3, _b, _c, _d;
    if (!matches[1]) {
      return "";
    }
    if (/^icon\./gi.test(matches[1])) {
      return matches[0];
    }
    let result = (
      // @ts-ignore
      (_d = (_c = (_b = (_a3 = matches == null ? void 0 : matches[1]) == null ? void 0 : _a3.split(".")) == null ? void 0 : _b.reduce(
        (acc, selector, index, arr) => {
          var _a4;
          if (!selector || acc[0] === void 0 || acc[0] === null) {
            if (/price$/gi.test(acc[1]) && typeof acc[0] === "number") {
              return [utils2.formatMoney(acc[0]), selector];
            }
            if (/_at$/gi.test(acc[1]) && Date.parse(acc[0])) {
              return [new Date(acc[0]).toLocaleDateString(), selector];
            }
            if (typeof acc[0] === "string" && acc[0].includes("\xAE")) {
              return [acc[0].replace(/®/gi, `<sup style="font-size: 0.7em;">\xAE</sup>`), selector];
            }
            if (Array.isArray(acc[0]) && acc[0].every((val) => typeof val === "string" || typeof val === "number")) {
              return [acc[0].join(", "), selector];
            }
            return acc;
          }
          if (acc[0] && typeof acc[0] === "object" && selector in acc[0]) {
            if (/price$/gi.test(selector) && typeof acc[0][selector] === "number") {
              return [utils2.formatMoney(acc[0][selector]), selector];
            }
            if (/_at$/gi.test(selector) && Date.parse(acc[0][selector])) {
              if (arr[index + 1]) {
                return [(_a4 = window.dayjs(acc[0][selector])) == null ? void 0 : _a4.format(arr[index + 1]), selector];
              }
              return [new Date(acc[0][selector]).toLocaleDateString(), selector];
            }
            if (typeof acc[0][selector] === "string" && acc[0][selector].includes("\xAE")) {
              return [acc[0][selector].replace(/®/gi, `<sup style="font-size: 0.7em;">\xAE</sup>`), selector];
            }
            if (index === arr.length - 1) {
              if (Array.isArray(acc[0][selector]) && acc[0][selector].every((val) => typeof val === "string" || typeof val === "number")) {
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
      )) == null ? void 0 : _c[0]) != null ? _d : ""
    );
    if (typeof result === "string" && (result == null ? void 0 : result.includes("Default Title"))) {
      result = result == null ? void 0 : result.replace("Default Title", "");
    }
    return result;
  })) != null ? _a2 : "";
  return unwrapNestedBlocksSimple(applyInlinePluralization(returnValue != null ? returnValue : ""));
}, "getBracketInputDynamicPluralizedText");
var getBracketInputDynamicValue = /* @__PURE__ */ __name((content, object = {}) => {
  let returnValue = null;
  if (!content || typeof content !== "string") {
    return null;
  }
  content == null ? void 0 : content.replace(/\[([^\]]*)\]/gi, (...matches) => {
    var _a2, _b, _c;
    if (!matches[1]) {
      return returnValue;
    }
    returnValue = (_c = (_b = (_a2 = matches == null ? void 0 : matches[1]) == null ? void 0 : _a2.split(".")) == null ? void 0 : _b.reduce(
      (acc, selector) => {
        if (!selector || acc[0] === void 0 || acc[0] === null) {
          if (/price$/gi.test(acc[1]) && typeof acc[0] === "number") {
            return [utils2.formatMoney(acc[0]), selector];
          }
          if (/_at$/gi.test(acc[1]) && Date.parse(acc[0])) {
            return [new Date(acc[0]).toLocaleDateString(), selector];
          }
          if (typeof acc[0] === "string" && acc[0].includes("\xAE")) {
            return [acc[0].replace(/®/gi, `<sup style="font-size: 0.7em;">\xAE</sup>`), selector];
          }
          return acc;
        }
        if (acc[0] && selector in acc[0]) {
          if (/price$/gi.test(selector) && typeof acc[0][selector] === "number") {
            return [utils2.formatMoney(acc[0][selector]), selector];
          }
          if (/_at$/gi.test(selector) && Date.parse(acc[0][selector])) {
            return [new Date(acc[0][selector]).toLocaleDateString(), selector];
          }
          if (typeof acc[0][selector] === "string" && acc[0][selector].includes("\xAE")) {
            return [acc[0][selector].replace(/®/gi, `<sup style="font-size: 0.7em;">\xAE</sup>`), selector];
          }
          return [acc[0][selector], selector];
        }
        return ["", ""];
      },
      [object, ""]
    )) == null ? void 0 : _c[0];
    return "";
  });
  return unwrapNestedBlocksSimple(returnValue != null ? returnValue : "");
}, "getBracketInputDynamicValue");
function unescape(htmlStr) {
  htmlStr = htmlStr.replace(/&lt;/g, "<");
  htmlStr = htmlStr.replace(/&gt;/g, ">");
  htmlStr = htmlStr.replace(/&quot;/g, '"');
  htmlStr = htmlStr.replace(/&#39;/g, "'");
  htmlStr = htmlStr.replace(/&amp;/g, "&");
  return htmlStr;
}
__name(unescape, "unescape");
function setUniformHeightById(id) {
  const elements = document.querySelectorAll(`[data-style-id="${id}"]`);
  if (elements.length === 0) {
    return;
  }
  let maxHeight = 0;
  elements.forEach((element) => {
    element.style.height = "auto";
    const elementHeight = element.offsetHeight;
    if (elementHeight > maxHeight) {
      maxHeight = elementHeight;
    }
  });
  elements.forEach((element) => {
    element.style.height = `${maxHeight}px`;
  });
}
__name(setUniformHeightById, "setUniformHeightById");
var setCookie = /* @__PURE__ */ __name((cookieName, cookieValue, cookieMinutes = 60 * 24) => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }
  const d = /* @__PURE__ */ new Date();
  d.setTime(d.getTime() + cookieMinutes * 60 * 1e3);
  const expires = d.toUTCString();
  document.cookie = `${cookieName}=${cookieValue};expires=${expires};path=/;SameSite=Strict;`;
  return true;
}, "setCookie");
var getCookie = /* @__PURE__ */ __name((cookieName) => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }
  const name = `${cookieName}=`;
  const cookieArray = document.cookie.split(";");
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return false;
}, "getCookie");
var checkCookie = /* @__PURE__ */ __name((cookieName) => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }
  return !!cookieName && document.cookie.includes(`${cookieName}=`);
}, "checkCookie");
var removeCookie = /* @__PURE__ */ __name((cookieName) => {
  setCookie(cookieName, "", -1);
}, "removeCookie");
var focusSelectorString = `:not(.placeholder) a[href]:not(:where([disabled],[tabindex="-1"])),
              :not(.placeholder) button:not(:where([disabled],[tabindex="-1"])),
              :not(.placeholder) textarea:not(:where([disabled],[tabindex="-1"])),
              :not(.placeholder) input[type="text"]:not(:where([disabled],[tabindex="-1"])),
              :not(.placeholder) input[type="radio"]:not(:where([disabled],[tabindex="-1"])),
              :not(.placeholder) input[type="checkbox"]:not(:where([disabled],[tabindex="-1"])),
              :not(.placeholder) select:not(:where([disabled],[tabindex="-1"])),
              :not(.placeholder, [tabindex="-1"]) [tabindex]:not(:where([disabled],[tabindex="-1"])`;
var getHeaderHeight = /* @__PURE__ */ __name(() => {
  var _a2;
  return Math.max(utils2.roundToIndex((_a2 = document.querySelector("[data-navigation-bar]")) == null ? void 0 : _a2.getBoundingClientRect().bottom, -2), 0);
}, "getHeaderHeight");
var initYouTube = /* @__PURE__ */ __name(async () => {
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
}, "initYouTube");
var simulateAnchorTag = /* @__PURE__ */ __name(($el) => {
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
}, "simulateAnchorTag");
var preloadImage = /* @__PURE__ */ __name((src) => {
  if (!src) return true;
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}, "preloadImage");
var applyStyles = /* @__PURE__ */ __name((el, styles) => {
  Object.entries(styles).forEach(([key, value]) => {
    el.style[key] = value;
  });
}, "applyStyles");
var richtextWithPrices = /* @__PURE__ */ __name((content, price = 0, compare_at_price = 0) => {
  var _a2, _b, _c, _d, _e, _f;
  if (!content) return content != null ? content : "";
  return (_f = (_e = (_d = (_b = content == null ? void 0 : content.replace(
    "[price|no-decimals]",
    utils2.formatMoney(price, (_a2 = window == null ? void 0 : window.money_format) == null ? void 0 : _a2.replace(/\{(\s*)amount(\s*)}/gi, "{$1amount_no_decimals$2}"))
  )) == null ? void 0 : _b.replace("[price]", utils2.formatMoney(price))) == null ? void 0 : _d.replace(
    "[compare_at_price|no-decimals]",
    compare_at_price > price ? `<span style='text-decoration: line-through; opacity: 0.5;'>${utils2.formatMoney(
      compare_at_price,
      (_c = window == null ? void 0 : window.money_format) == null ? void 0 : _c.replace(/\{(\s*)amount(\s*)}/gi, "{$1amount_no_decimals$2}")
    )}</span>` : ""
  )) == null ? void 0 : _e.replace(
    "[compare_at_price]",
    compare_at_price > price ? `<span style='text-decoration: line-through; opacity: 0.5;'>${utils2.formatMoney(compare_at_price)}</span>` : ""
  )) != null ? _f : "";
}, "richtextWithPrices");
var validateFormAndToast = /* @__PURE__ */ __name((formEl) => {
  const inputs = formEl.querySelectorAll("input, textarea, select");
  let firstInvalid = null;
  for (const input of inputs) {
    input.setCustomValidity("");
    if (input.disabled) continue;
    const value = input.value.trim();
    const label = input.getAttribute("aria-label") || input.name || "This field";
    if (input.hasAttribute("required") && !value) {
      _stores.toast.addToast({
        type: "error",
        target: "generic",
        title: "We've encountered a problem.",
        content: `${label} is required.`,
        timestamp: Date.now()
      });
      input.setCustomValidity("Required");
      firstInvalid = firstInvalid || input;
      continue;
    }
    if ((input.type === "email" || input.getAttribute("data-type") === "email") && value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      _stores.toast.addToast({
        type: "error",
        target: "generic",
        title: "We've encountered a problem.",
        content: `${label} must be a valid email address.`,
        timestamp: Date.now()
      });
      input.setCustomValidity("Invalid");
      firstInvalid = firstInvalid || input;
    }
  }
  if (firstInvalid) {
    firstInvalid.reportValidity();
    firstInvalid.scrollIntoView({ behavior: "instant", block: "start" });
    setTimeout(() => {
      window.scrollBy({ top: -230, behavior: "instant" });
    }, 10);
    firstInvalid.focus();
    return false;
  }
  return true;
}, "validateFormAndToast");
var normalizePhoneInput = /* @__PURE__ */ __name((input) => {
  var _a2, _b;
  return (_b = (_a2 = input == null ? void 0 : input.replace(/[^\d+]/g, "")) == null ? void 0 : _a2.replace(/^00/, "+")) == null ? void 0 : _b.replace(/^0+/, "");
}, "normalizePhoneInput");
var getShopifyCacheUrl = /* @__PURE__ */ __name((href) => {
  var _a2, _b, _c, _d, _e, _f;
  try {
    const url = new URL(href);
    const searchParams = [];
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
    if (sortedSearchParams == null ? void 0 : sortedSearchParams.length) {
      return `${(_b = (_a2 = href == null ? void 0 : href.split(/[?#&]/gi)) == null ? void 0 : _a2[0]) == null ? void 0 : _b.replace(/(\/collections\/[^/]*\/)/gi, "/")}?${sortedSearchParams.join("&")}`;
    }
    return (_d = (_c = href == null ? void 0 : href.split(/[?#&]/gi)) == null ? void 0 : _c[0]) == null ? void 0 : _d.replace(/(\/collections\/[^/]*\/)/gi, "/");
  } catch (err) {
    return (_f = (_e = href == null ? void 0 : href.split(/[?#&]/gi)) == null ? void 0 : _e[0]) == null ? void 0 : _f.replace(/(\/collections\/[^/]*\/)/gi, "/");
  }
}, "getShopifyCacheUrl");
var fetchFromCache = /* @__PURE__ */ __name(async (urlString, options = {}) => {
  var _a2;
  if (!urlString.includes(window.location.origin)) {
    urlString = window.location.origin + urlString;
  }
  const url = new URL(urlString);
  const cacheUrl = getShopifyCacheUrl(urlString);
  const cachePath = url.toString().replace(window.location.origin, "");
  let cache = barba.cache.get(cacheUrl);
  if (!(cache == null ? void 0 : cache.request)) {
    const keys = await idbKeyval.keys();
    const key = keys.find((key2) => key2.includes(cacheUrl));
    if (key) {
      cache = barba.cache.set(cacheUrl, (_a2 = idbKeyval.get(key)) == null ? void 0 : _a2.then((res) => res == null ? void 0 : res.data), "prefetch");
    }
  }
  if (!(cache == null ? void 0 : cache.request)) {
    const data = fetch(urlString, { cache: "force-cache", ...options }).then((res) => res.text()).then((html2) => ({
      html: html2,
      url: { hash: void 0, href: cacheUrl, path: cachePath }
    }));
    cache = barba.cache.set(cacheUrl, data, "prefetch");
    document.dispatchEvent(new CustomEvent("barba:prefetch:fulfilled", { detail: { url: cacheUrl } }));
  }
  let request = await (cache == null ? void 0 : cache.request);
  let html = request == null ? void 0 : request.html;
  if (!html) {
    const data = fetch(urlString, { cache: "force-cache", ...options }).then((res) => res.text()).then((html2) => ({
      html: html2,
      url: { hash: void 0, href: cacheUrl, path: cachePath }
    }));
    cache = barba.cache.set(cacheUrl, data, "prefetch");
    request = await (cache == null ? void 0 : cache.request);
    html = request == null ? void 0 : request.html;
    document.dispatchEvent(new CustomEvent("barba:prefetch:fulfilled", { detail: { url: cacheUrl } }));
  }
  return html;
}, "fetchFromCache");
var utils2 = {
  normalizePhoneInput,
  initCollapsible,
  initContentSlider,
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
  getElementPosition,
  applyInlinePluralization,
  getBracketInputDynamicPluralizedText,
  getBracketInputDynamicValue,
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
  isElementFullyVisible
};
var utils_default = utils2;

// assets/css-autoprefixer.ts
var initCSSAutoPrefixer = /* @__PURE__ */ __name((forceCheck = false) => {
  const needsAutoprefixing = /* @__PURE__ */ __name(() => {
    const testElem = document.createElement("div");
    testElem.style.userSelect = "none";
    testElem.style.backdropFilter = "blur(10px)";
    testElem.style.appearance = "none";
    testElem.style.clipPath = "circle(50%)";
    return testElem.style.userSelect !== "none" || testElem.style.backdropFilter !== "blur(10px)" || testElem.style.appearance !== "none" || testElem.style.clipPath !== "circle(50%)";
  }, "needsAutoprefixing");
  const isOldBrowser = /* @__PURE__ */ __name(() => {
    if (forceCheck) {
      return true;
    }
    const ua = navigator.userAgent;
    const isOldiOS = /iP(hone|od|ad)/.test(ua) && /Version\/(12|13|14).*Safari/.test(ua);
    const isOldSamsung = /SamsungBrowser\/([0-9]+)/.test(ua) && parseInt(ua.match(/SamsungBrowser\/([0-9]+)/)[1], 10) < 15;
    const isOldAndroid = /Android/.test(ua) && (/Chrome\/([0-9]+)/.test(ua) && parseInt(ua.match(/Chrome\/([0-9]+)/)[1], 10) < 90 || /Firefox\/([0-9]+)/.test(ua) && parseInt(ua.match(/Firefox\/([0-9]+)/)[1], 10) < 85 || /wv/.test(ua));
    return isOldiOS || isOldSamsung || isOldAndroid || needsAutoprefixing();
  }, "isOldBrowser");
  const loadAutoprefixerForOldBrowsers = /* @__PURE__ */ __name(async () => {
    if (!isOldBrowser()) {
      return;
    }
    try {
      const postcss = (await import("https://jspm.dev/postcss@8.1.10")).default;
      const autoprefixer = (await import("https://jspm.dev/autoprefixer@10.0.2")).default;
      const processStylesWithAutoprefixer = /* @__PURE__ */ __name(async () => {
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
                  "Firefox <= 85"
                ]
              })
            ]).process(css, { from: void 0 });
            if (forceCheck) {
              console.log(`CSS style element check Completed`);
              continue;
            }
            styleTag.textContent = result.css;
          } catch (err) {
            console.error("\u274C CSS Validation - Autoprefixer Error:", styleTag, err, { css });
          }
        }
      }, "processStylesWithAutoprefixer");
      processStylesWithAutoprefixer();
    } catch (error) {
      console.error("\u274C Failed to load PostCSS or Autoprefixer:", error);
    }
  }, "loadAutoprefixerForOldBrowsers");
  loadAutoprefixerForOldBrowsers();
}, "initCSSAutoPrefixer");
window.initCSSAutoPrefixer = initCSSAutoPrefixer;

// assets/scroll-progress.ts
var initScrollProgress = /* @__PURE__ */ __name(() => {
  window.Alpine.store("scrollProgress", {
    progress: /* @__PURE__ */ new Map(),
    observers: /* @__PURE__ */ new Map(),
    registerSection: /* @__PURE__ */ __name(() => {
    }, "registerSection")
  });
  const state = window.Alpine.store("scrollProgress");
  state.registerSection = (sectionEl) => {
    if (!sectionEl || state.observers.has(sectionEl)) return;
    let ticking = false;
    const updateProgress = /* @__PURE__ */ __name(() => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const rect2 = sectionEl.getBoundingClientRect();
          let progress = (window.innerHeight - rect2.top) / (window.innerHeight + rect2.height);
          progress = Math.min(Math.max(progress, 0), 1);
          state.progress.set(sectionEl, progress);
          ticking = false;
        });
      }
    }, "updateProgress");
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
    const isVisible2 = rect.bottom >= 0 && rect.top <= window.innerHeight;
    if (isVisible2) {
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
}, "initScrollProgress");

// assets/search.ts
var initSearch = /* @__PURE__ */ __name(() => {
  var _a2;
  const query = (_a2 = new URL(window.location.href).searchParams.get("q")) != null ? _a2 : "";
  window.Alpine.store("search", {
    query
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
}, "initSearch");

// assets/textarea.ts
var initTextarea = /* @__PURE__ */ __name(() => {
}, "initTextarea");
var _textarea = {
  init: /* @__PURE__ */ __name((label, { maxRows = null }) => {
    const state = Alpine.reactive({
      active: false,
      paddingLeft: ""
    });
    const textarea = label.querySelector("textarea");
    state.active = !!(textarea == null ? void 0 : textarea.value) && !!(label == null ? void 0 : label.textContent);
    state.paddingLeft = getComputedStyle(textarea).paddingLeft;
    Alpine.nextTick(() => resizeTextarea());
    const resizeTextarea = /* @__PURE__ */ __name(() => {
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
    }, "resizeTextarea");
    return {
      textarea: state,
      resizeTextarea
    };
  }, "init")
};
window._textarea = _textarea;

// assets/accessibility.ts
var initAccessibility = /* @__PURE__ */ __name(() => {
  document.querySelectorAll(`[role="button"], [role="link"], [data-icon-handle]`).forEach((element) => {
    element.onkeydown = (event) => {
      if (element.role !== "link" && element.role !== "button") {
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        console.log({ event });
        event.preventDefault();
        event.stopPropagation();
        element.dispatchEvent(new Event("click"));
      }
    };
  });
}, "initAccessibility");

// assets/cart.ts
var initCart = /* @__PURE__ */ __name(() => {
  var _a2, _b, _c, _d, _e, _f, _g;
  const initial_selling_plan = (_d = (_c = (_b = (_a2 = window._cart_data) == null ? void 0 : _a2.items) == null ? void 0 : _b.find((item) => {
    var _a3, _b2;
    return (_b2 = (_a3 = item == null ? void 0 : item.selling_plan_allocation) == null ? void 0 : _a3.selling_plan) == null ? void 0 : _b2.id;
  })) == null ? void 0 : _c.selling_plan_allocation) == null ? void 0 : _d.selling_plan;
  window.Alpine.store("cart", {
    history: [structuredClone(window._cart_data)],
    state: {
      ...window._cart_data,
      items: (_g = (_f = (_e = window._cart_data) == null ? void 0 : _e.items) == null ? void 0 : _f.filter((item) => item.quantity).map((item, index) => ({ ...item, index }))) != null ? _g : []
    },
    upsell_products: [],
    gift_products: {},
    _gift_with_purchase_disable_auto_add: utils.JSONParse(
      sessionStorage.getItem("_gift_with_purchase_disable_auto_add") || "[]"
    ),
    loading: false,
    isChanging: false,
    debounce_updates: {},
    possible_selling_plans: [],
    cart_selling_plan_id: initial_selling_plan == null ? void 0 : initial_selling_plan.id,
    cart_selling_plan_name: initial_selling_plan == null ? void 0 : initial_selling_plan.name,
    cart_selling_plan_discount_wording: "",
    isSubscriptionChanging: false,
    global_subscriptions: false,
    bundle: {
      parent: null,
      child: null,
      added: false
    }
  });
  const cart = window.Alpine.store("cart");
  window.Alpine.magic("cart", () => cart);
  window._stores["cart"] = cart;
  window._cart_data = cart.state;
  const get = /* @__PURE__ */ __name(async (productAdded = false) => {
    var _a3, _b2, _c2, _d2, _e2, _f2, _g2, _h, _i;
    const data = await fetch("/cart/update.js", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ sections: "data_cart_json" })
    }).then((res) => res.json()).catch((e) => {
      _stores.toast.addToast({
        type: "error",
        target: "cart",
        title: "Cart Error",
        content: e.statusMessage
      });
      cart.isChanging = false;
      return window._stores["cart"].state;
    });
    if ("status" in data) {
      _stores.toast.addToast({
        type: "error",
        target: "cart",
        title: data.message,
        content: data.description
      });
      cart.isChanging = false;
      return window._stores["cart"].state;
    }
    const item_components = (_e2 = utils.JSONParse(
      (_d2 = (_c2 = (_b2 = (_a3 = data.sections) == null ? void 0 : _a3.data_cart_json) == null ? void 0 : _b2.replace(/<div id="shopify-section-data_cart_json" class="shopify-section"[^>]*>/gi, "")) == null ? void 0 : _c2.replace(/<\/div>[\s\n]*$/gi, "")) != null ? _d2 : "[]"
    )) != null ? _e2 : [];
    setTimeout(async () => {
      var _a4, _b3, _c3;
      if ((_b3 = (_a4 = data == null ? void 0 : data.items) == null ? void 0 : _a4.filter((item) => !item.quantity)) == null ? void 0 : _b3.length) {
        const removeItems = (_c3 = data == null ? void 0 : data.items) == null ? void 0 : _c3.filter((item) => !item.quantity);
        for (let i = 0; i < (removeItems == null ? void 0 : removeItems.length); i++) {
          const item = removeItems[i];
          const update2 = await change({ id: item.key, quantity: 0 });
        }
        await get();
      }
    }, 0);
    const newCartData = {
      ...data,
      items: (_g2 = (_f2 = data == null ? void 0 : data.items) == null ? void 0 : _f2.filter((item) => item.quantity).map((item, index) => ({
        ...item,
        index,
        item_components: item_components[index]
      }))) != null ? _g2 : [],
      item_count: (_i = (_h = data.items) == null ? void 0 : _h.filter((item) => {
        var _a4, _b3;
        return !((_a4 = item == null ? void 0 : item.properties) == null ? void 0 : _a4._p_id_link) && !((_b3 = item == null ? void 0 : item.properties) == null ? void 0 : _b3._p_hidden);
      })) == null ? void 0 : _i.reduce((acc, item) => acc += item.quantity, 0)
    };
    if ((newCartData == null ? void 0 : newCartData.item_count) === 0) {
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
  }, "get");
  get();
  const add = /* @__PURE__ */ __name(async (cartItems) => {
    cart.isChanging = true;
    const data = await fetch("/cart/add.js", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(cartItems)
    }).then((res) => res.json()).catch(async (e) => {
      _stores.toast.addToast({
        type: "error",
        target: "cart",
        title: "Cart Error",
        content: e.statusMessage
      });
      return {
        ...await get(),
        cart_error: true
      };
    });
    if ("status" in data) {
      _stores.toast.addToast({
        type: "error",
        target: "cart",
        title: data.message === data.description ? "Cart Error" : data.message,
        content: data.description
      });
      return {
        ...await get(),
        cart_error: true
      };
    }
    return await get(true);
  }, "add");
  const update = /* @__PURE__ */ __name(async (updates) => {
    var _a3, _b2, _c2, _d2, _e2, _f2, _g2, _h, _i;
    cart.isChanging = true;
    const data = await fetch("/cart/update.js", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...updates, sections: "data_cart_json" })
    }).then((res) => res.json()).catch(async (e) => {
      _stores.toast.addToast({
        type: "error",
        target: "cart",
        title: "Cart Error",
        content: e.statusMessage
      });
      return await get();
    });
    if ("status" in data) {
      _stores.toast.addToast({
        type: "error",
        target: "cart",
        title: data.message,
        content: data.description
      });
      return await get();
    }
    if ((_a3 = data == null ? void 0 : data.discount_codes) == null ? void 0 : _a3.length) {
      let update2 = false;
      data.discount_codes = data.discount_codes.filter((code) => {
        if (code.applicable) return true;
        update2 = true;
        _stores.toast.addToast({
          type: "error",
          target: "cart",
          title: "Discount code is not applicable",
          content: `The discount code: "${code.code}" is not applicable to this cart. Please try a different code.`
        });
        return false;
      });
      if (update2) {
        _cart.update({ discount: data.discount_codes.map((d) => d.code).join(",") });
      }
    }
    const item_components = utils.JSONParse(
      (_e2 = (_d2 = (_c2 = (_b2 = data.sections) == null ? void 0 : _b2.data_cart_json) == null ? void 0 : _c2.replace(/<div id="shopify-section-data_cart_json" class="shopify-section"[^>]*>/gi, "")) == null ? void 0 : _d2.replace(/<\/div>[\s\n]*$/gi, "")) != null ? _e2 : "[]"
    );
    const newCartData = {
      ...data,
      items: (_g2 = (_f2 = data == null ? void 0 : data.items) == null ? void 0 : _f2.filter((item) => item.quantity).map((item, index) => ({
        ...item,
        index,
        item_components: item_components[index]
      }))) != null ? _g2 : [],
      item_count: (_i = (_h = data.items) == null ? void 0 : _h.filter((item) => {
        var _a4, _b3;
        return !((_a4 = item == null ? void 0 : item.properties) == null ? void 0 : _a4._p_id_link) && !((_b3 = item == null ? void 0 : item.properties) == null ? void 0 : _b3._p_hidden);
      })) == null ? void 0 : _i.reduce((acc, item) => acc += item.quantity, 0)
    };
    if ((newCartData == null ? void 0 : newCartData.item_count) === 0) {
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
  }, "update");
  const change = /* @__PURE__ */ __name(async (cartItem) => {
    var _a3, _b2, _c2, _d2, _e2, _f2, _g2, _h;
    cart.isChanging = true;
    const data = await fetch("/cart/change.js", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...cartItem, sections: "data_cart_json" })
    }).then((res) => res.json()).catch(async (e) => {
      _stores.toast.addToast({
        type: "error",
        target: "cart",
        title: "Cart Error",
        content: e.statusMessage
      });
      return await get();
    });
    if ("status" in data) {
      _stores.toast.addToast({
        type: "error",
        target: "cart",
        title: data.message,
        content: data.description
      });
      return await get();
    }
    const item_components = utils.JSONParse(
      (_d2 = (_c2 = (_b2 = (_a3 = data.sections) == null ? void 0 : _a3.data_cart_json) == null ? void 0 : _b2.replace(/<div id="shopify-section-data_cart_json" class="shopify-section"[^>]*>/gi, "")) == null ? void 0 : _c2.replace(/<\/div>[\s\n]*$/gi, "")) != null ? _d2 : "[]"
    );
    const { items_added, items_removed, ...cart_data } = data;
    const newCartData = {
      ...cart_data,
      items: (_f2 = (_e2 = cart_data == null ? void 0 : cart_data.items) == null ? void 0 : _e2.filter((item) => item.quantity).map((item, index) => ({
        ...item,
        index,
        item_components: item_components[index]
      }))) != null ? _f2 : [],
      item_count: (_h = (_g2 = data.items) == null ? void 0 : _g2.filter((item) => {
        var _a4, _b3;
        return !((_a4 = item == null ? void 0 : item.properties) == null ? void 0 : _a4._p_id_link) && !((_b3 = item == null ? void 0 : item.properties) == null ? void 0 : _b3._p_hidden);
      })) == null ? void 0 : _h.reduce((acc, item) => acc += item.quantity, 0)
    };
    if ((newCartData == null ? void 0 : newCartData.item_count) === 0) {
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
  }, "change");
  const clear = /* @__PURE__ */ __name(async () => {
    const data = await fetch("/cart/clear.js", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }).then((res) => res.json()).catch(async (e) => {
      _stores.toast.addToast({
        type: "error",
        target: "cart",
        title: "Cart Error",
        content: e.statusMessage
      });
      return await get();
    });
    if ("status" in data) {
      _stores.toast.addToast({
        type: "error",
        target: "cart",
        title: data.message,
        content: data.description
      });
      return await get();
    }
    const newCartData = {
      ...data,
      items: [],
      item_count: 0
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
  }, "clear");
  const showConditionally = /* @__PURE__ */ __name((show_conditionally) => {
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
  }, "showConditionally");
  const updateLineItemQuantity = /* @__PURE__ */ __name((quantity, index) => {
    var _a3, _b2, _c2, _d2, _e2, _f2;
    if (!cart.state.items[index] || ((_a3 = cart.state.items[index]) == null ? void 0 : _a3.quantity) === quantity || cart.state.items.length !== ((_b2 = _stores.cart) == null ? void 0 : _b2.history[0].items.length)) {
      return;
    }
    const old_quantity = cart.state.items[index].quantity;
    const quantity_difference = Math.max(0, quantity) - cart.state.items[index].quantity;
    cart.state.items[index].quantity = Math.max(0, quantity);
    const p_id = (_d2 = (_c2 = cart.state.items[index]) == null ? void 0 : _c2.properties) == null ? void 0 : _d2._p_id;
    if (p_id) {
      cart.state.items.forEach((child, childIndex) => {
        var _a4;
        if (((_a4 = child == null ? void 0 : child.properties) == null ? void 0 : _a4._p_id_link) !== p_id) return;
        const quantity_ratio = child.quantity / old_quantity;
        cart.state.items[childIndex].quantity = Math.max(0, child.quantity + quantity_difference * quantity_ratio);
      });
    }
    cart.state.item_count = (_f2 = (_e2 = cart.state.items) == null ? void 0 : _e2.filter((item) => {
      var _a4, _b3;
      return !((_a4 = item == null ? void 0 : item.properties) == null ? void 0 : _a4._p_id_link) && !((_b3 = item == null ? void 0 : item.properties) == null ? void 0 : _b3._p_hidden);
    })) == null ? void 0 : _f2.reduce((acc, item) => acc += item.quantity, 0);
    cart.state.total_price = cart.state.items.reduce((acc, item) => acc += item.price * item.quantity, 0);
    cart.debounce_updates = cart.state.items.reduce((acc, item) => {
      acc[`${item.key}`] = item.quantity;
      return acc;
    }, {});
  }, "updateLineItemQuantity");
  const renderGiftProducts = /* @__PURE__ */ __name(async ($el, {
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
    hide_in_cart
  }) => {
    var _a3, _b2, _c2, _d2, _e2, _f2, _g2, _h, _i, _j, _k;
    const products = utils.JSONParse($el.getAttribute("data-gift-products"));
    const preorder_threshold = +((_a3 = window.theme_settings.data__product__variant__preorder_threshold) != null ? _a3 : 1);
    handleResize();
    setTimeout(() => {
      handleResize();
    }, 50);
    const received_quantity = (_c2 = (_b2 = cart == null ? void 0 : cart.state) == null ? void 0 : _b2.items) == null ? void 0 : _c2.reduce(
      (acc, lineItem) => {
        var _a4;
        return ((_a4 = lineItem == null ? void 0 : lineItem.properties) == null ? void 0 : _a4["_gift_with_purchase"]) === `${block_id}` ? acc += lineItem.quantity : acc;
      },
      0
    );
    const received_value = (_e2 = (_d2 = cart == null ? void 0 : cart.state) == null ? void 0 : _d2.items) == null ? void 0 : _e2.reduce(
      (acc, lineItem) => {
        var _a4;
        return ((_a4 = lineItem == null ? void 0 : lineItem.properties) == null ? void 0 : _a4["_gift_with_purchase"]) === `${block_id}` ? acc += lineItem.final_line_price : acc;
      },
      0
    );
    target = target_type === "item_count" ? target + received_quantity : target + received_value;
    const controlProducts = cart.state[target_type] >= target && received_quantity < receives_quantity ? (_f2 = products == null ? void 0 : products.filter((prod) => allow_duplicates || !cart.state.items.some((item) => item.product_id === prod.id))) == null ? void 0 : _f2.filter((a, i, arr) => arr.findIndex((b) => b.id === a.id) === i) : [];
    if (auto_remove_from_cart && cart.state[target_type] < target) {
      (_h = (_g2 = cart == null ? void 0 : cart.state) == null ? void 0 : _g2.items) == null ? void 0 : _h.forEach((lineItem) => {
        if (lineItem.quantity && lineItem.properties["_gift_with_purchase"] === `${block_id}`) {
          _cart.updateLineItemQuantity(0, lineItem.index);
        }
      });
      cart.gift_products[block_id] = [];
      return;
    }
    if (auto_add_to_cart && (controlProducts == null ? void 0 : controlProducts.length)) {
      const getControlItems = /* @__PURE__ */ __name(() => {
        var _a4, _b3;
        let addedQuantity = (_b3 = (_a4 = cart == null ? void 0 : cart.state) == null ? void 0 : _a4.items) == null ? void 0 : _b3.reduce(
          (acc, lineItem) => {
            var _a5;
            return ((_a5 = lineItem == null ? void 0 : lineItem.properties) == null ? void 0 : _a5["_gift_with_purchase"]) === `${block_id}` ? acc += lineItem.quantity : acc;
          },
          0
        );
        return controlProducts.filter((p) => !p.variants.some((v) => cart._gift_with_purchase_disable_auto_add.includes(v.id))).map((p) => p.variants.find((v) => v.available)).map((variant) => {
          var _a5, _b4, _c3;
          if (!allow_duplicates && cart.state.items.some((item) => item.variant_id === variant.id) || addedQuantity >= receives_quantity) {
            return null;
          }
          const properties = {
            _gift_with_purchase: `${block_id}`,
            _gift_with_purchase_auto_add: "true",
            ...hide_in_cart ? { _p_hidden: "true" } : {}
          };
          if ((variant == null ? void 0 : variant.preorder) && (variant == null ? void 0 : variant.inventory_quantity) < preorder_threshold) {
            properties["Preorder"] = `true`;
            if (variant == null ? void 0 : variant.preorder_date) {
              properties["Preorder"] = `Shipping ${new Date(variant.preorder_date).toLocaleDateString(navigator.language, {
                month: "short",
                year: "numeric"
              })}`;
            }
          }
          let addQuantity = 1;
          if (!allow_duplicates) {
            addedQuantity += 1;
          } else {
            addQuantity = Math.min(
              (variant == null ? void 0 : variant.inventory_management) === "shopify" && (variant == null ? void 0 : variant.inventory_policy) === "deny" ? variant == null ? void 0 : variant.inventory_quantity : 9999,
              receives_quantity - addedQuantity
            );
            addedQuantity += addQuantity;
          }
          return {
            id: variant.id,
            quantity: addQuantity,
            selling_plan: cart.global_subscriptions ? (_c3 = (_b4 = (_a5 = variant == null ? void 0 : variant.selling_plan_allocations) == null ? void 0 : _a5.find((plan) => {
              var _a6;
              return ((_a6 = plan.selling_plan) == null ? void 0 : _a6.id) === cart.cart_selling_plan_id;
            })) == null ? void 0 : _b4.selling_plan) == null ? void 0 : _c3.id : void 0,
            properties: {
              ...properties
            }
          };
        }).filter(Boolean);
      }, "getControlItems");
      const controlItems = getControlItems();
      if (!(controlItems == null ? void 0 : controlItems.length)) {
        cart.gift_products[block_id] = [];
        return;
      }
      if (cart.loading || cart.isChanging || cart.isSubscriptionChanging || ((_i = Object.keys(cart.debounce_updates)) == null ? void 0 : _i.length)) {
        await new Promise((resolve, reject) => {
          const start = performance.now();
          const isBusy = /* @__PURE__ */ __name(() => cart.loading || cart.isChanging || cart.isSubscriptionChanging || Object.keys(cart.debounce_updates || {}).length > 0, "isBusy");
          const check = /* @__PURE__ */ __name(() => {
            const now = performance.now();
            if (!isBusy()) {
              clearInterval(tid);
              resolve(true);
              return;
            }
            if (now - start >= 5e3) {
              clearInterval(tid);
              reject(new Error("Timed out waiting for cart to become idle"));
            }
          }, "check");
          const tid = setInterval(check, 32);
          check();
        });
      }
      const addItems = getControlItems();
      if (addItems == null ? void 0 : addItems.length) {
        await _cart.add({
          items: addItems
        });
      }
      cart.gift_products[block_id] = [];
      return;
    }
    switch (hide_if_empty) {
      case "none":
        break;
      case "section":
        (_j = $el.closest(`.shopify-section`)) == null ? void 0 : _j.classList.toggle("!hidden", (controlProducts == null ? void 0 : controlProducts.length) === 0);
        break;
      case "container":
        (_k = $el.closest(`[data-style-id]:not([data-style-id="${$el.getAttribute("data-style-id")}"])`)) == null ? void 0 : _k.classList.toggle("!hidden", (controlProducts == null ? void 0 : controlProducts.length) === 0);
        break;
      case "block":
        $el == null ? void 0 : $el.classList.toggle("!hidden", (controlProducts == null ? void 0 : controlProducts.length) === 0);
        break;
    }
    cart.gift_products[block_id] = controlProducts;
    const renderProducts = controlProducts == null ? void 0 : controlProducts.filter(
      (prod, index) => {
        var _a4, _b3;
        return prod.handle !== ((_b3 = (_a4 = $el.children) == null ? void 0 : _a4[index]) == null ? void 0 : _b3.getAttribute("data-product-handle"));
      }
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
      var _a4;
      const node = (_a4 = document.querySelector(`[data-product-card='${product_card_class}']`)) == null ? void 0 : _a4.cloneNode(true);
      if (node) {
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
  }, "renderGiftProducts");
  const getDynamicTextWithFormattedPrice = /* @__PURE__ */ __name((content) => {
    var _a3;
    return (_a3 = content == null ? void 0 : content.replace(/\[([^\]]*)\]/gi, (...matches) => {
      var _a4;
      return (_a4 = matches == null ? void 0 : matches[1]) == null ? void 0 : _a4.split(".").reduce(
        (acc, selector) => {
          if (!selector || acc[0] === void 0 || acc[0] === null) {
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
    })) != null ? _a3 : "";
  }, "getDynamicTextWithFormattedPrice");
  const getBundleLineItem = /* @__PURE__ */ __name(async () => {
    var _a3, _b2, _c2, _d2, _e2;
    const itemsWithProductData = await Promise.all(
      (_a3 = cart.state.items) == null ? void 0 : _a3.map(async (lineItem) => {
        var _a4, _b3;
        const product = (_a4 = _products[lineItem == null ? void 0 : lineItem.handle]) != null ? _a4 : await _product.getProductData(lineItem == null ? void 0 : lineItem.handle, lineItem == null ? void 0 : lineItem.product_id);
        return {
          line_item: lineItem,
          product,
          variant: (_b3 = product == null ? void 0 : product.variants) == null ? void 0 : _b3.find((variant) => variant.id === (lineItem == null ? void 0 : lineItem.variant_id))
        };
      })
    );
    const item = itemsWithProductData.find((item2) => {
      var _a4, _b3, _c3;
      return (_c3 = (_b3 = (_a4 = item2 == null ? void 0 : item2.product) == null ? void 0 : _a4.metafields) == null ? void 0 : _b3.smart) == null ? void 0 : _c3.bundle_parent;
    });
    const bundleParent = (_e2 = (_d2 = (_c2 = (_b2 = item == null ? void 0 : item.product) == null ? void 0 : _b2.metafields) == null ? void 0 : _c2.smart) == null ? void 0 : _d2.bundle_parent) == null ? void 0 : _e2[0];
    if (item && bundleParent) {
      cart.bundle.parent = bundleParent;
      cart.bundle.child = item;
    }
  }, "getBundleLineItem");
  const getBundleParentDynamicTextWithFormattedPrice = /* @__PURE__ */ __name((content, product) => {
    return utils.getBracketInputDynamicPluralizedText(content, product);
  }, "getBundleParentDynamicTextWithFormattedPrice");
  const upgradeLineItemToBundle = /* @__PURE__ */ __name(async () => {
    var _a3;
    if (cart.loading || cart.isChanging || !cart.bundle.parent || !cart.bundle.child || cart.bundle.added) {
      return;
    }
    cart.loading = true;
    cart.isChanging = true;
    try {
      _cart.updateLineItemQuantity(0, cart.bundle.child.line_item.index);
      _cart.add({
        items: [
          {
            id: cart.bundle.parent.selected_variant_id || ((_a3 = cart.bundle.parent.variants[0]) == null ? void 0 : _a3.id),
            quantity: 1,
            selling_plan: null
          }
        ]
      });
      cart.bundle.added = true;
    } catch (e) {
      _stores.toast.addToast({
        type: "error",
        target: "cart",
        title: "Cart Error",
        content: e.statusMessage
      });
    } finally {
      cart.isChanging = false;
      cart.loading = false;
    }
  }, "upgradeLineItemToBundle");
  const debounceCartUpdates = window.Alpine.debounce(async () => {
    var _a3, _b2;
    const b = (_a3 = cart.history[0]) == null ? void 0 : _a3.items.reduce((acc, item) => {
      acc[`${item.key}`] = item.quantity;
      return acc;
    }, {});
    if (!utils.deepEqual(b, cart.debounce_updates) && Object.keys((_b2 = cart.debounce_updates) != null ? _b2 : {}).length) {
      cart.loading = true;
      const new_gift_with_purchase_disable_auto_add = [
        .../* @__PURE__ */ new Set([
          ...cart._gift_with_purchase_disable_auto_add,
          ...cart.state.items.map(
            (item) => item.properties._gift_with_purchase_auto_add && cart.debounce_updates[item.key] <= 0 ? item.variant_id : null
          ).filter(Boolean)
        ])
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
  const ensureCartCookies = /* @__PURE__ */ __name(() => {
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
        fetch("/cart/update.js", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ updates: {}, attributes: {}, token: storedToken })
        });
      }
      if (!storedToken && newCartToken) {
        sessionStorage.setItem("_shopify_stable_cart_token", newCartToken);
      }
    }, 3e3);
  }, "ensureCartCookies");
  ensureCartCookies();
  window.Alpine.effect(() => {
    var _a3, _b2;
    cart.state.item_count = (_b2 = (_a3 = cart.state.items) == null ? void 0 : _a3.filter((item) => {
      var _a4, _b3;
      return !((_a4 = item == null ? void 0 : item.properties) == null ? void 0 : _a4._p_id_link) && !((_b3 = item == null ? void 0 : item.properties) == null ? void 0 : _b3._p_hidden);
    })) == null ? void 0 : _b2.reduce((acc, item) => acc += item.quantity, 0);
    window._cart_data = cart.state;
  });
  window.Alpine.effect(() => {
    var _a3, _b2, _c2;
    cart.state.original_pre_selling_plan_total_price = (_a3 = cart.state.items) == null ? void 0 : _a3.reduce((acc, item) => {
      var _a4, _b3;
      acc += item.quantity * ((_b3 = (_a4 = item == null ? void 0 : item.selling_plan_allocation) == null ? void 0 : _a4.compare_at_price) != null ? _b3 : item == null ? void 0 : item.original_price);
      return acc;
    }, 0);
    cart.state.selling_plan_discount_applications = (_c2 = (_b2 = cart.state) == null ? void 0 : _b2.items) == null ? void 0 : _c2.reduce((acc, item) => {
      var _a4, _b3, _c3, _d2, _e2, _f2, _g2, _h;
      if (!((_b3 = (_a4 = item == null ? void 0 : item.selling_plan_allocation) == null ? void 0 : _a4.selling_plan) == null ? void 0 : _b3.name)) {
        return acc;
      }
      const index = acc.findIndex((selling_plan) => {
        var _a5, _b4;
        return selling_plan.name === ((_b4 = (_a5 = item == null ? void 0 : item.selling_plan_allocation) == null ? void 0 : _a5.selling_plan) == null ? void 0 : _b4.name);
      });
      if (index !== -1) {
        acc[index].value += (((_c3 = item == null ? void 0 : item.selling_plan_allocation) == null ? void 0 : _c3.compare_at_price) - ((_d2 = item == null ? void 0 : item.selling_plan_allocation) == null ? void 0 : _d2.price)) * (item == null ? void 0 : item.quantity);
        return acc;
      }
      acc.push({
        name: (_f2 = (_e2 = item == null ? void 0 : item.selling_plan_allocation) == null ? void 0 : _e2.selling_plan) == null ? void 0 : _f2.name,
        value: (((_g2 = item == null ? void 0 : item.selling_plan_allocation) == null ? void 0 : _g2.compare_at_price) - ((_h = item == null ? void 0 : item.selling_plan_allocation) == null ? void 0 : _h.price)) * (item == null ? void 0 : item.quantity)
      });
      return acc;
    }, []);
  });
  window.Alpine.effect(() => {
    var _a3, _b2;
    if ((_b2 = Object.keys((_a3 = cart.debounce_updates) != null ? _a3 : {})) == null ? void 0 : _b2.length) {
      debounceCartUpdates();
    }
  });
  Alpine.effect(() => {
    var _a3;
    (_a3 = cart.state.items) == null ? void 0 : _a3.forEach((a, i, arr) => {
      var _a4;
      if (((_a4 = a == null ? void 0 : a.properties) == null ? void 0 : _a4._p_id_link) && !arr.find((b) => {
        var _a5;
        return (_a5 = b.properties) == null ? void 0 : _a5._p_id;
      })) {
        updateLineItemQuantity(0, i);
      }
    });
  });
  Alpine.effect(async () => {
    var _a3, _b2, _c2, _d2, _e2, _f2, _g2, _h, _i, _j, _k;
    if (cart.loading || cart.isChanging) return;
    const itemsWithProductData = await Promise.all(
      (_a3 = cart.state.items) == null ? void 0 : _a3.map(async (lineItem) => {
        var _a4, _b3;
        const product = (_a4 = _products[lineItem == null ? void 0 : lineItem.handle]) != null ? _a4 : await _product.getProductData(lineItem == null ? void 0 : lineItem.handle, lineItem == null ? void 0 : lineItem.product_id);
        return {
          line_item: lineItem,
          product,
          variant: (_b3 = product == null ? void 0 : product.variants) == null ? void 0 : _b3.find((variant) => variant.id === (lineItem == null ? void 0 : lineItem.variant_id))
        };
      })
    );
    const possible_selling_plans = /* @__PURE__ */ new Map();
    itemsWithProductData.forEach((item) => {
      var _a4, _b3;
      (_b3 = (_a4 = item.variant) == null ? void 0 : _a4.selling_plan_allocations) == null ? void 0 : _b3.forEach((selling_plan2) => {
        possible_selling_plans.set(selling_plan2.selling_plan.id, selling_plan2.selling_plan);
      });
    });
    cart.possible_selling_plans = [...possible_selling_plans.values()];
    cart.cart_selling_plan_discount_wording = "";
    const selling_plan = (_c2 = cart.possible_selling_plans.find((plan) => plan.id === cart.cart_selling_plan_id)) != null ? _c2 : (_b2 = cart.possible_selling_plans) == null ? void 0 : _b2[0];
    cart.cart_selling_plan_discount_wording = ((_e2 = (_d2 = selling_plan == null ? void 0 : selling_plan.price_adjustments) == null ? void 0 : _d2[0]) == null ? void 0 : _e2.value) ? ((_g2 = (_f2 = selling_plan == null ? void 0 : selling_plan.price_adjustments) == null ? void 0 : _f2[0]) == null ? void 0 : _g2.value_type) === "fixed_amount" ? `${utils.formatMoney(
      itemsWithProductData.reduce((acc, entry) => {
        var _a4, _b3, _c3;
        const plan = (_a4 = entry.variant.selling_plan_allocations) == null ? void 0 : _a4.find(
          (allocation) => {
            var _a5;
            return ((_a5 = allocation.selling_plan) == null ? void 0 : _a5.id) === selling_plan.id;
          }
        );
        if (plan) {
          acc += ((_c3 = (_b3 = plan.selling_plan.price_adjustments) == null ? void 0 : _b3[0]) == null ? void 0 : _c3.value) * entry.line_item.quantity;
        }
        return acc;
      }, 0)
    )}` : ((_i = (_h = selling_plan == null ? void 0 : selling_plan.price_adjustments) == null ? void 0 : _h[0]) == null ? void 0 : _i.value_type) === "percentage" ? `${(_k = (_j = selling_plan == null ? void 0 : selling_plan.price_adjustments) == null ? void 0 : _j[0]) == null ? void 0 : _k.value}%` : "" : "";
  });
  Alpine.effect(() => {
    var _a3, _b2, _c2, _d2;
    if (cart.global_subscriptions && !cart.isSubscriptionChanging) {
      const initial_selling_plan2 = (_d2 = (_c2 = (_b2 = (_a3 = cart.state) == null ? void 0 : _a3.items) == null ? void 0 : _b2.find((item) => {
        var _a4, _b3;
        return (_b3 = (_a4 = item == null ? void 0 : item.selling_plan_allocation) == null ? void 0 : _a4.selling_plan) == null ? void 0 : _b3.id;
      })) == null ? void 0 : _c2.selling_plan_allocation) == null ? void 0 : _d2.selling_plan;
      cart.cart_selling_plan_id = initial_selling_plan2 == null ? void 0 : initial_selling_plan2.id;
      cart.cart_selling_plan_name = initial_selling_plan2 == null ? void 0 : initial_selling_plan2.name;
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
        items: updatedCart.items
      };
      window._learnq.push(["track", "Added to Cart", cartData]);
    }
  });
  const initDynamicLineItemCards = /* @__PURE__ */ __name(($el, {
    line_item_card_class,
    hide_if_empty,
    order_offset = 1,
    section_id,
    block_id,
    handleResize = /* @__PURE__ */ __name(() => {
    }, "handleResize"),
    addon_id,
    filter_keys,
    filter_keys_include
  }) => {
    const container = $el.parentElement;
    const cart2 = window.Alpine.store("cart");
    const modal = window.Alpine.store("modal");
    const editor = window.Alpine.store("editor");
    const renderDynamicLineItemCards = /* @__PURE__ */ __name(async () => {
      var _a3, _b2, _c2, _d2;
      handleResize();
      setTimeout(() => handleResize, 50);
      let items = addon_id ? (_a3 = cart2.state.items) == null ? void 0 : _a3.filter((item) => {
        var _a4;
        return ((_a4 = item == null ? void 0 : item.properties) == null ? void 0 : _a4._p_id_link) === addon_id && item.quantity;
      }) : (_b2 = cart2.state.items) == null ? void 0 : _b2.filter((item) => {
        var _a4, _b3;
        return !((_a4 = item == null ? void 0 : item.properties) == null ? void 0 : _a4._p_id_link) && !((_b3 = item == null ? void 0 : item.properties) == null ? void 0 : _b3._p_hidden) && item.quantity;
      });
      if (filter_keys == null ? void 0 : filter_keys.trim()) {
        const filter_keys_arr = filter_keys.split(",").map((key) => key.trim());
        items = items.filter((item) => !Object.keys(item == null ? void 0 : item.properties).some((key) => filter_keys_arr.includes(key.trim())));
      }
      if (filter_keys_include == null ? void 0 : filter_keys_include.trim()) {
        const filter_keys_arr = filter_keys_include.split(",").map((key) => key.trim());
        items = items.filter((item) => Object.keys(item == null ? void 0 : item.properties).some((key) => filter_keys_arr.includes(key.trim())));
      }
      switch (hide_if_empty) {
        case "none":
          break;
        case "section":
          (_c2 = container.closest(`.shopify-section`)) == null ? void 0 : _c2.classList.toggle("!hidden", (items == null ? void 0 : items.length) === 0);
          break;
        case "container":
          (_d2 = container.closest(`[data-style-id]:not([data-style-id="${container.getAttribute("data-style-id")}"])`)) == null ? void 0 : _d2.classList.toggle("!hidden", (items == null ? void 0 : items.length) === 0);
          break;
        case "block":
          break;
      }
      const existingItems = container.querySelectorAll(`[data-render-index*="${block_id}--"]`);
      const controlProducts = items == null ? void 0 : items.filter(
        (lineItem, index) => !container.querySelector(`[data-render-index="${block_id}--${index}"][data-line-item-key="${lineItem.key}"]`)
      );
      if (!controlProducts.length && existingItems.length === (items == null ? void 0 : items.length)) {
        return;
      }
      existingItems.forEach((el) => el.remove());
      items == null ? void 0 : items.forEach((lineItem, i, arr) => {
        var _a4;
        const node = (_a4 = document.querySelector(`[data-line-item-card='${line_item_card_class}']`)) == null ? void 0 : _a4.cloneNode(true);
        if (node) {
          const div = document.createElement("div");
          div.setAttribute("data-line-item-key", lineItem.key);
          div.setAttribute("data-style-id", `${section_id}--${block_id}`);
          div.setAttribute("data-render-index", `${block_id}--${i}`);
          div.setAttribute("class", `shrink-0 max-w-full w-full order-[--order]`);
          div.style.setProperty("--order", `${(i + order_offset) * 10}`);
          node.removeAttribute(`data-line-item-card`);
          node.setAttribute("data-line-item-key", lineItem.key);
          node.querySelectorAll("[data-loop-item], [data-x-if], style").forEach((el) => el.remove());
          node.classList.add("card-loading");
          div.appendChild(node);
          container.appendChild(div);
        }
      });
      handleResize();
    }, "renderDynamicLineItemCards");
    renderDynamicLineItemCards();
    Alpine.effect(() => {
      const show = !container.closest("[data-dynamic-modals]") || (editor == null ? void 0 : editor.select_section_id) === section_id || modal.id === "modal--cart-drawer";
      if ((cart2.state.total_price || cart2.state.item_count || cart2.state.item_count <= 0) && show) {
        renderDynamicLineItemCards();
      }
    });
  }, "initDynamicLineItemCards");
  const setSubscription = /* @__PURE__ */ __name(async (selling_plan_id) => {
    var _a3, _b2, _c2, _d2, _e2, _f2;
    cart.isSubscriptionChanging = true;
    cart.cart_selling_plan_id = +selling_plan_id;
    cart.cart_selling_plan_name = (_b2 = (_a3 = cart.possible_selling_plans) == null ? void 0 : _a3.find((plan) => +plan.id === +selling_plan_id)) == null ? void 0 : _b2.name;
    const itemsWithProductData = await Promise.all(
      (_c2 = cart.state.items) == null ? void 0 : _c2.map(async (lineItem) => {
        var _a4, _b3;
        const product = (_a4 = _products[lineItem == null ? void 0 : lineItem.handle]) != null ? _a4 : await _product.getProductData(lineItem == null ? void 0 : lineItem.handle, lineItem == null ? void 0 : lineItem.product_id);
        return {
          line_item: {
            ...lineItem
          },
          product,
          variant: (_b3 = product == null ? void 0 : product.variants) == null ? void 0 : _b3.find((variant) => variant.id === (lineItem == null ? void 0 : lineItem.variant_id))
        };
      })
    );
    const changeProducts = itemsWithProductData == null ? void 0 : itemsWithProductData.filter(
      (item) => {
        var _a4, _b3, _c3, _d3, _e3;
        return ((_b3 = (_a4 = item.variant) == null ? void 0 : _a4.selling_plan_allocations) == null ? void 0 : _b3.length) && +((_e3 = (_d3 = (_c3 = item.line_item) == null ? void 0 : _c3.selling_plan_allocation) == null ? void 0 : _d3.selling_plan) == null ? void 0 : _e3.id) !== +selling_plan_id;
      }
    );
    let items = cart.state.items;
    if ((changeProducts == null ? void 0 : changeProducts.length) <= 2) {
      for (const item of changeProducts) {
        const lineItem = (_d2 = items.find((lineItem2) => lineItem2.key === item.line_item.key)) != null ? _d2 : items.find(
          (lineItem2) => lineItem2.id === item.line_item.id && lineItem2.quantity === item.line_item.quantity && utils.deepEqual(lineItem2.properties, item.line_item.properties)
        );
        if (!lineItem) continue;
        cart.isChanging = true;
        const result = await fetch("/cart/change.js", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id: lineItem == null ? void 0 : lineItem.key,
            quantity: lineItem == null ? void 0 : lineItem.quantity,
            selling_plan: +selling_plan_id
          })
        }).then((res) => res.json()).catch(async (e) => {
          _stores.toast.addToast({
            type: "error",
            target: "cart",
            title: "Cart Error",
            content: e.statusMessage
          });
          return await get();
        });
        items = (_f2 = result == null ? void 0 : result.items) != null ? _f2 : (_e2 = cart == null ? void 0 : cart.state) == null ? void 0 : _e2.items;
      }
      await _cart.get();
    }
    if ((changeProducts == null ? void 0 : changeProducts.length) > 2) {
      await fetch("/cart/clear.js", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      });
      await add({
        items: itemsWithProductData == null ? void 0 : itemsWithProductData.toReversed().map((item) => {
          var _a4, _b3, _c3, _d3, _e3, _f3, _g2, _h, _i;
          return {
            id: item.line_item.variant_id,
            quantity: item.line_item.quantity,
            properties: (_a4 = item.line_item.properties) != null ? _a4 : {},
            selling_plan: ((_c3 = (_b3 = item.variant) == null ? void 0 : _b3.selling_plan_allocations) == null ? void 0 : _c3.length) && +((_f3 = (_e3 = (_d3 = item.line_item) == null ? void 0 : _d3.selling_plan_allocation) == null ? void 0 : _e3.selling_plan) == null ? void 0 : _f3.id) !== +selling_plan_id ? selling_plan_id || void 0 : ((_i = (_h = (_g2 = item.line_item) == null ? void 0 : _g2.selling_plan_allocation) == null ? void 0 : _h.selling_plan) == null ? void 0 : _i.id) || void 0
          };
        }),
        attributes: cart == null ? void 0 : cart.state.attributes
      });
    }
    cart.isSubscriptionChanging = false;
  }, "setSubscription");
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
    upgradeLineItemToBundle
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
    upgradeLineItemToBundle
  };
}, "initCart");

// assets/media-gallery.ts
var initMediaGallery = /* @__PURE__ */ __name(() => {
  var _a2, _b;
  const modalStore = Alpine.store("modal");
  window.Alpine.store("mediaGallery", {
    media: (_b = (_a2 = _products[Object.keys(_products)[0]]) == null ? void 0 : _a2.media) != null ? _b : [],
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
        var _a3, _b2, _c, _d;
        const video = utils.JSONParse(el.getAttribute("data-ugc-video") || el.getAttribute("data-video-product-card"));
        const products = utils.JSONParse((_a3 = el.getAttribute("data-ugc-products")) != null ? _a3 : "[]");
        const autoplay = el.hasAttribute("data-autoplay");
        const muted = el.hasAttribute("data-muted");
        const loop = el.hasAttribute("data-loop");
        const controls = el.hasAttribute("data-controls");
        return {
          video: typeof video === "string" ? {
            alt: el.textContent,
            media_type: "external_video",
            preview_image: null,
            external_id: (_c = (_b2 = new URL(video)) == null ? void 0 : _b2.pathname.split(/[/?#]/gi)) == null ? void 0 : _c[1],
            src: video,
            host: ((_d = video == null ? void 0 : video.toLowerCase()) == null ? void 0 : _d.includes("vimeo")) ? "vimeo" : "youtube"
          } : video,
          products,
          autoplay,
          muted,
          loop,
          controls
        };
      });
      this.index = index;
      this.scrollIndex = index;
      modalStore.setId("media-gallery--video-product-gallery");
    }
  });
  const mediaGalleryStore = window.Alpine.store("mediaGallery");
  Alpine.effect(() => {
    if (!modalStore.id && mediaGalleryStore.media.length) {
      mediaGalleryStore.media = [];
    }
    if (!modalStore.id && mediaGalleryStore.videos.length) {
      mediaGalleryStore.videos = [];
    }
  });
  window.Alpine.magic("mediaGallery", () => mediaGalleryStore);
  window._stores["mediaGallery"] = mediaGalleryStore;
}, "initMediaGallery");

// assets/modals.ts
var initModals = /* @__PURE__ */ __name(() => {
  var _a2, _b, _c;
  const modalsContainer = document.querySelector("[data-dynamic-modals]");
  window.Alpine.store("modal", {
    id: "",
    submenu_handle: "",
    loaded: !!(modalsContainer == null ? void 0 : modalsContainer.children.length) || window.modalsLoaded,
    hoverTrigger: false,
    product: _products[Object.keys(_products)[0]],
    variant_id: (_c = (_b = (_a2 = _products[Object.keys(_products)[0]]) == null ? void 0 : _a2.variants) == null ? void 0 : _b[0]) == null ? void 0 : _c.id,
    setId(value, hover = false, productHandle, productId, selectedVariantId, updateOriginalCard) {
      var _a3, _b2, _c2, _d;
      this.id = value;
      this.hoverTrigger = hover;
      if (productHandle && productId) {
        this.product = _products[productHandle];
        this.variant_id = selectedVariantId || ((_c2 = (_b2 = (_a3 = this.product) == null ? void 0 : _a3.variants) == null ? void 0 : _b2[0]) == null ? void 0 : _c2.id);
        this.updateOriginalCard = updateOriginalCard || null;
        (_d = _product.getHydratedProductData(productHandle, productId)) == null ? void 0 : _d.then((res) => {
          this.product = res;
        });
      }
    },
    setSubId(value, hover = false) {
      this.sub_id = value;
    }
  });
  const modalStore = window.Alpine.store("modal");
  window.Alpine.magic("modal", () => modalStore);
  window._stores["modal"] = modalStore;
  const handleKeydown = /* @__PURE__ */ __name((e) => {
    if (e.key === "Escape") {
      modalStore.setId("");
      modalStore.setSubId("");
    }
  }, "handleKeydown");
  let placeholder = null;
  const ensurePlaceholder = /* @__PURE__ */ __name((header) => {
    var _a3;
    if (!placeholder) {
      placeholder = document.createElement("div");
      placeholder.style.width = "100%";
      placeholder.style.visibility = "hidden";
      placeholder.style.pointerEvents = "none";
      (_a3 = header.parentElement) == null ? void 0 : _a3.insertBefore(placeholder, header);
    }
    placeholder.style.height = `${header.offsetHeight}px`;
  }, "ensurePlaceholder");
  const removePlaceholder = /* @__PURE__ */ __name((header) => {
    if (placeholder == null ? void 0 : placeholder.parentElement) {
      placeholder.parentElement.removeChild(placeholder);
    }
    placeholder = null;
  }, "removePlaceholder");
  const lockHeader = /* @__PURE__ */ __name((header) => {
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
  }, "lockHeader");
  const unlockHeader = /* @__PURE__ */ __name((header) => {
    if (!document.body.classList.contains("header-locked")) return;
    document.body.classList.remove("header-locked");
    header.style.transition = "top 200ms ease";
    header.style.top = getComputedStyle(header).top;
    const cleanup = /* @__PURE__ */ __name(() => {
      header.style.position = "";
      header.style.top = "";
      header.style.left = "";
      header.style.width = "";
      header.style.zIndex = "";
      header.style.transition = "";
      removePlaceholder(header);
      header.removeEventListener("transitionend", cleanup);
    }, "cleanup");
    header.addEventListener("transitionend", cleanup);
  }, "unlockHeader");
  window.Alpine.effect(() => {
    const blockScroll = (modalStore == null ? void 0 : modalStore.id) && (!/^megamenu--/gi.test(modalStore == null ? void 0 : modalStore.id) || window.innerWidth < 768) && ((modalStore == null ? void 0 : modalStore.id) !== "search" || window.innerWidth < 768) && (modalStore == null ? void 0 : modalStore.id) !== "account_menu";
    document.body.classList.toggle("!overflow-clip", blockScroll);
    document.body.classList.toggle("pr-[--scrollbar-width]", blockScroll);
    document.documentElement.classList.toggle("!overflow-clip", blockScroll);
    const header = document.querySelector("[data-header-section]");
    if (header) {
      const freezeHeader = (modalStore == null ? void 0 : modalStore.id) && !blockScroll && // only for modals that don't block scroll
      /^megamenu--/gi.test(modalStore == null ? void 0 : modalStore.id) && window.innerWidth >= 768;
      if (freezeHeader) {
        lockHeader(header);
      } else {
        unlockHeader(header);
      }
    }
    if (modalStore == null ? void 0 : modalStore.id) {
      document.addEventListener("keydown", handleKeydown);
    }
    if (!(modalStore == null ? void 0 : modalStore.id)) {
      document.removeEventListener("keydown", handleKeydown);
    }
  });
  const initEvents = /* @__PURE__ */ __name(() => {
    document.querySelectorAll(
      '[href*="#modal--"]:not([data-megamenu-initialized]), [href*="#popup--"]:not([data-megamenu-initialized]), [href*="#drawer--"]:not([data-megamenu-initialized]), [href*="#megamenu--"]:not([data-megamenu-initialized]), [data-megamenu-handle]:not([data-megamenu-initialized])'
    ).forEach((link) => {
      var _a3, _b2, _c2, _d, _e, _f, _g, _h, _i, _j, _k;
      const handle = (_d = link.getAttribute("data-megamenu-handle") || ((_c2 = (_b2 = (_a3 = link.href) == null ? void 0 : _a3.replace(/.*?#/gi, "")) == null ? void 0 : _b2.split("?")) == null ? void 0 : _c2[0])) != null ? _d : "";
      const sub_handle = (_e = link.getAttribute("data-megamenu-submenu-handle")) != null ? _e : "";
      const hasActualLink = ((_k = (_j = (_i = (_h = (_g = (_f = link.href) == null ? void 0 : _f.replace(window.location.origin, "")) == null ? void 0 : _g.replace(window.location.pathname, "")) == null ? void 0 : _h.replace(window.location.search, "")) == null ? void 0 : _i.split("#")) == null ? void 0 : _j[0]) == null ? void 0 : _k.length) > 1;
      const target = document.querySelector(`[data-megamenu="${handle}"]`);
      const submenu_target = target == null ? void 0 : target.querySelector(`[data-megamenu-submenu="${sub_handle}"]`);
      if (handle.includes("megamenu--") && (!target || sub_handle && !submenu_target)) {
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
      const handleFocusKeydown = /* @__PURE__ */ __name((e) => {
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
      }, "handleFocusKeydown");
      link.onfocus = (e) => {
        link.addEventListener("keydown", handleFocusKeydown);
      };
      link.onblur = (e) => {
        link.removeEventListener("keydown", handleFocusKeydown);
      };
    });
  }, "initEvents");
  const editor = window.Alpine.store("editor");
  window.Alpine.effect(() => {
    if (editor == null ? void 0 : editor.load_section_id) {
      initEvents();
    }
  });
  let hoverTimeout;
  const exitHover = /* @__PURE__ */ __name((e) => {
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
      var _a3, _b2, _c2, _d, _e, _f, _g;
      const modal = document.querySelector(`[data-megamenu="${modalStore.id}"] [x-trap\\.noautofocus="show"]`);
      const effectBlocker = document.querySelector(`[data-megamenu-effect-block="${modalStore.id}"]`);
      const selectPopup = document.querySelector(`[x-show="show_popover"]`);
      const trigger = document.querySelector(`[href="#${modalStore.id}"]`);
      if ([...(_b2 = (_a3 = e.target) == null ? void 0 : _a3.children) != null ? _b2 : []].some((child) => child === trigger) || ((_c2 = e.target) == null ? void 0 : _c2.closest(`[href="#${modalStore.id}"]`)) || ((_d = e.target) == null ? void 0 : _d.closest(`[data-megamenu-effect-block*="megamenu--"]`)) || ((_e = e.target) == null ? void 0 : _e.closest(`[data-megamenu="${modalStore.id}"] [x-trap\\.noautofocus="show"]`)) || ((_f = e.target) == null ? void 0 : _f.closest(`[x-show="show_popover"]`)) || ((_g = e.target) == null ? void 0 : _g.closest(`[data-style-id="section_group__megamenu"]`)) || e.target === modal || e.target === effectBlocker || e.target === trigger || e.target === selectPopup) {
        return;
      }
      modalStore.id = "";
      modalStore.hoverTrigger = false;
    }, 100);
  }, "exitHover");
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
    e == null ? void 0 : e.forEach((record) => {
      var _a3;
      const nodes = [];
      if (((_a3 = record == null ? void 0 : record.addedNodes) == null ? void 0 : _a3.length) && (record == null ? void 0 : record.target) instanceof Element) {
        debouncedInitEvents();
      }
    });
  });
  mutationObserver.observe(document.body, { childList: true, subtree: true });
  initEvents();
}, "initModals");

// assets/page-transitions.ts
var startTime = Date.now();
var initialized = false;
var firstRender = true;
var initPageTransitions = /* @__PURE__ */ __name(() => {
  var _a2, _b, _c;
  if (initialized) return;
  const rootContainer = document.querySelector("[data-content-root]");
  const scrollToTarget = /* @__PURE__ */ __name(() => {
    var _a3, _b2, _c2, _d, _e, _f;
    if (window.location.hash) {
      const target = document == null ? void 0 : document.querySelector(window.location.hash);
      if (!target) return;
      if (utils.isElementScrollable(target.parentElement) && utils.isVisible(target.parentElement) && utils.isInViewport(target)) {
        if (target.parentElement.scrollWidth > target.parentElement.offsetWidth) {
          utils.scrollToXY(260, target.offsetLeft, (_a3 = target.parentElement) == null ? void 0 : _a3.scrollTop, target.parentElement);
        }
        if (target.parentElement.scrollHeight > target.parentElement.offsetHeight) {
          utils.scrollToXY(260, (_b2 = target.parentElement) == null ? void 0 : _b2.scrollLeft, target.offsetTop, target.parentElement);
        }
        return;
      }
      const targetPosition = ((_c2 = utils.getElementPosition(target)) == null ? void 0 : _c2.top) - Math.max(70, (_f = (_e = (_d = document.querySelector(".header-sections-container")) == null ? void 0 : _d.getBoundingClientRect()) == null ? void 0 : _e.bottom) != null ? _f : 0);
      utils.scrollToY(70 + Math.abs(Math.round((window.scrollY - targetPosition) / 15)), targetPosition);
    }
  }, "scrollToTarget");
  window.Alpine.store("router", {
    pathname: rootContainer.getAttribute("data-pathname"),
    template: rootContainer.getAttribute("data-template"),
    search: window.location.search,
    hash: window.location.hash,
    setValue(key, value) {
      this[key] = value;
    }
  });
  const routerStore = window.Alpine.store("router");
  window.Alpine.magic("router", () => routerStore);
  window._stores["router"] = routerStore;
  if (window.design_mode || !window.page_transitions_enabled) {
    barba.go = (href) => {
      if (typeof href === "string" && window.location.href !== href) {
        window.location.href = href;
      }
    };
    barba.prefetch = () => {
    };
  }
  barba.use(barbaPrefetch, {
    root: document.body,
    timeout: 4e3,
    /* @ts-ignore */
    limit: 0
  });
  const handleRouteCaching = /* @__PURE__ */ __name((url) => {
    if (typeof idbKeyval !== "undefined" && !window.design_mode) {
      requestIdleCallback(
        async () => {
          var _a3;
          const parsedUrl = utils.getShopifyCacheUrl(url);
          if (!barba.cache.get(parsedUrl)) return;
          const fetchResults = await barba.cache.get(parsedUrl).request.then((res) => ({ data: res }));
          const div = document.createElement("div");
          div.innerHTML = (_a3 = fetchResults == null ? void 0 : fetchResults.data) == null ? void 0 : _a3.html;
          const productData = div.querySelectorAll(`[data-product-data]`);
          productData == null ? void 0 : productData.forEach(async (scriptElement) => {
            var _a4, _b2;
            const product = utils.JSONParse(scriptElement.innerHTML);
            if (product == null ? void 0 : product.handle) {
              const dbKey = `_${window.Shopify.theme.id}-product--${product.handle}`;
              _products[product.handle] = {
                _recommendations_loaded_at: 0,
                related_products: [],
                complementary_products: [],
                ...(_a4 = _products[product.handle]) != null ? _a4 : await idbKeyval.get(dbKey) || {},
                ...(product == null ? void 0 : product._full_data) ? product : ((_b2 = _products[product.handle]) == null ? void 0 : _b2._full_data) ? _products[product.handle] : product,
                _updated_at: Date.now()
              };
              await idbKeyval.set(dbKey, _products[product.handle]);
            }
          });
          await idbKeyval.set(`barba-prefetch---${startTime}-//-${parsedUrl}`, fetchResults);
        },
        { timeout: 3e3 }
      );
    }
  }, "handleRouteCaching");
  document.addEventListener("barba:prefetch:fulfilled", async (e) => {
    var _a3;
    handleRouteCaching((_a3 = e.detail.url) == null ? void 0 : _a3.replace(/(\/collections\/[^/]*\/)/gi, "/"));
  });
  if (typeof idbKeyval !== "undefined" && window.theme_settings && !window.design_mode) {
    idbKeyval.keys().then(async (res) => {
      res.forEach(async (key) => {
        if (key.includes("/account")) {
          idbKeyval.del(key);
          return;
        }
        const [timestamp, cacheKey] = key.replace("barba-prefetch---", "").split("-//-");
        if (cacheKey && +timestamp > Date.now() - 1e3 * 60 * 10) {
          barba.cache.set(
            cacheKey,
            idbKeyval.get(key).then((res2) => res2.data),
            "prefetch"
          );
        } else if (cacheKey && +timestamp > 0) {
          idbKeyval.del(key);
        }
      });
      await delay(100);
      barba.timeout = window.origin.includes("127.0.0.1") ? 3e4 : 4e3;
    }).catch(async (err) => {
      await delay(100);
      barba.timeout = window.origin.includes("127.0.0.1") ? 3e4 : 4e3;
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
      ...(_a2 = window.page_transitions_ignore) != null ? _a2 : []
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
      ...(_b = window.page_transitions_ignore) != null ? _b : []
    ].filter(Boolean),
    debug: true,
    /* @ts-ignore */
    cacheFirstPage: true,
    timeout: window.origin.includes("127.0.0.1") ? 3e4 : 4e3,
    // default is 2000ms,
    transitions: [
      {
        name: "opacity-transition",
        leave: /* @__PURE__ */ __name((data) => {
          var _a3;
          transitionOverlay == null ? void 0 : transitionOverlay.classList.add("active", "out-active");
          (_a3 = transitionOverlay == null ? void 0 : transitionOverlay.parentElement) == null ? void 0 : _a3.classList.add("active", "out-active");
        }, "leave"),
        enter: /* @__PURE__ */ __name((data) => {
          var _a3;
          const handleTransitionend = /* @__PURE__ */ __name(() => {
            var _a4;
            transitionOverlay == null ? void 0 : transitionOverlay.classList.remove("out-active");
            (_a4 = transitionOverlay == null ? void 0 : transitionOverlay.parentElement) == null ? void 0 : _a4.classList.remove("out-active");
            transitionOverlay == null ? void 0 : transitionOverlay.removeEventListener("transitionend", handleTransitionend);
          }, "handleTransitionend");
          transitionOverlay == null ? void 0 : transitionOverlay.classList.remove("active");
          (_a3 = transitionOverlay == null ? void 0 : transitionOverlay.parentElement) == null ? void 0 : _a3.classList.remove("active");
          transitionOverlay == null ? void 0 : transitionOverlay.addEventListener("transitionend", handleTransitionend);
          const scrollToTopWithStickyCompensation = /* @__PURE__ */ __name(() => {
            requestAnimationFrame(() => {
              window.scrollTo({ top: 0, behavior: "auto" });
              requestAnimationFrame(() => {
                var _a4;
                const header = document.querySelector("[data-header-section]");
                const offset = (_a4 = header == null ? void 0 : header.getBoundingClientRect().bottom) != null ? _a4 : 0;
                window.scrollBy({
                  top: -offset,
                  behavior: "auto"
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
                    threshold: 0.01
                  }
                );
                observer.observe(topSentinel);
              });
            });
          }, "scrollToTopWithStickyCompensation");
          scrollToTopWithStickyCompensation();
        }, "enter")
      }
    ],
    views: [
      {
        beforeLeave: /* @__PURE__ */ __name((data) => {
          var _a3, _b2, _c2, _d;
          console.debug("beforeLeave", data);
          (_b2 = (_a3 = window._stores) == null ? void 0 : _a3.modal) == null ? void 0 : _b2.setId("");
          (_d = (_c2 = window._stores) == null ? void 0 : _c2.modal) == null ? void 0 : _d.setSubId("");
        }, "beforeLeave"),
        namespace: "tmp",
        afterLeave(data) {
          var _a3, _b2, _c2;
          console.debug("afterLeave", data);
          routerStore.setValue("pathname", window.location.pathname);
          routerStore.setValue("search", window.location.search);
          if (!((_a3 = data == null ? void 0 : data.next) == null ? void 0 : _a3.container)) {
            return;
          }
          routerStore.setValue("template", (_c2 = (_b2 = data == null ? void 0 : data.next) == null ? void 0 : _b2.container) == null ? void 0 : _c2.getAttribute("data-template"));
        },
        beforeEnter: /* @__PURE__ */ __name((data) => {
          console.debug("beforeEnter", data);
        }, "beforeEnter"),
        afterEnter: /* @__PURE__ */ __name((data) => {
          var _a3, _b2, _c2, _d, _e, _f, _g, _h;
          console.debug("afterEnter", data);
          (_b2 = (_a3 = data == null ? void 0 : data.current) == null ? void 0 : _a3.container) == null ? void 0 : _b2.remove();
          window._stores["quickView"].show = false;
          (_d = (_c2 = window._stores) == null ? void 0 : _c2.modal) == null ? void 0 : _d.setId("");
          (_f = (_e = window._stores) == null ? void 0 : _e.modal) == null ? void 0 : _f.setSubId("");
          const productDataContainer = (_g = data.next.container) == null ? void 0 : _g.querySelector("[data-product-data-init]");
          if (productDataContainer) {
            const newScriptTag = document.createElement("script");
            newScriptTag.innerHTML = productDataContainer.innerText;
            newScriptTag.setAttribute("data-product-data-init", "");
            document.head.appendChild(newScriptTag);
          }
          if (((_h = data == null ? void 0 : data.next) == null ? void 0 : _h.container) && !firstRender) {
            utils.delay(60).then(() => {
              var _a4;
              scrollToTarget();
              const html = document.createElement("html");
              html.innerHTML = (_a4 = data.next) == null ? void 0 : _a4.html;
              html.querySelectorAll(".shopify-block.shopify-app-block").forEach((element) => {
                const currentElement = document.getElementById(element.id);
                currentElement.parentNode.replaceChild(element, currentElement);
              });
              const contentScripts = html.querySelectorAll("[data-content-root] script[src]");
              html.querySelectorAll(":not([data-content-root]) script[src]").forEach((scriptElement) => {
                var _a5;
                const existingScript = document.head.querySelector(`script[src*="${(_a5 = scriptElement.src.split("?")[0]) == null ? void 0 : _a5.split("/").at(-1)}"]`) || [...contentScripts].includes(scriptElement);
                if (!existingScript) {
                  const newScriptTag = document.createElement("script");
                  scriptElement.getAttributeNames().forEach((name) => {
                    var _a6;
                    newScriptTag.setAttribute(name, scriptElement.getAttribute(name));
                    if (name === "src") {
                      newScriptTag.setAttribute(
                        name,
                        ((_a6 = scriptElement.src) == null ? void 0 : _a6.includes("?")) ? `${scriptElement == null ? void 0 : scriptElement.src}&v_id=${Date.now()}` : `${scriptElement == null ? void 0 : scriptElement.src}?v_id=${Date.now()}`
                      );
                    }
                  });
                  document.head.appendChild(newScriptTag);
                }
              });
              document.querySelectorAll(
                "[data-content-root] script:not(script[src],[data-product-data],[type='application/json'])"
              ).forEach((scriptElement) => {
                const newScriptTag = document.createElement("script");
                newScriptTag.innerHTML = scriptElement.innerHTML;
                scriptElement.getAttributeNames().forEach((name) => {
                  var _a5;
                  newScriptTag.setAttribute(name, scriptElement.getAttribute(name));
                  if (name === "src") {
                    newScriptTag.setAttribute(
                      name,
                      ((_a5 = scriptElement.src) == null ? void 0 : _a5.includes("?")) ? `${scriptElement == null ? void 0 : scriptElement.src}&v_id=${Date.now()}` : `${scriptElement == null ? void 0 : scriptElement.src}?v_id=${Date.now()}`
                    );
                  }
                });
                scriptElement.parentNode.replaceChild(newScriptTag, scriptElement);
              });
              document.querySelectorAll("[data-content-root] script[src]").forEach((scriptElement) => {
                const newScriptTag = document.createElement("script");
                scriptElement.getAttributeNames().forEach((name) => {
                  var _a5;
                  newScriptTag.setAttribute(name, scriptElement.getAttribute(name));
                  if (name === "src") {
                    newScriptTag.setAttribute(
                      name,
                      ((_a5 = scriptElement.src) == null ? void 0 : _a5.includes("?")) ? `${scriptElement == null ? void 0 : scriptElement.src}&v_id=${Date.now()}` : `${scriptElement == null ? void 0 : scriptElement.src}?v_id=${Date.now()}`
                    );
                  }
                });
                scriptElement.parentNode.replaceChild(newScriptTag, scriptElement);
              });
            });
          }
          if (!firstRender) {
            requestIdleCallback(
              () => {
                var _a4, _b3, _c3, _d2, _e2;
                document.dispatchEvent(new Event("DOMContentLoaded"));
                window.dispatchEvent(new Event("DOMContentLoaded"));
                document.dispatchEvent(new CustomEvent("pageFullyLoaded", {}));
                (_a4 = Shopify == null ? void 0 : Shopify.PaymentButton) == null ? void 0 : _a4.init();
                (_b3 = window == null ? void 0 : window.okeWidgetApi) == null ? void 0 : _b3.initAllWidgets();
                (_c3 = window == null ? void 0 : window.yotpoWidgetsContainer) == null ? void 0 : _c3.initWidgets();
                (_e2 = (_d2 = window == null ? void 0 : window.loyaltylion) == null ? void 0 : _d2.ui) == null ? void 0 : _e2.refresh();
                setTimeout(() => {
                  var _a5;
                  (_a5 = window == null ? void 0 : window.okeWidgetApi) == null ? void 0 : _a5.initAllWidgets();
                }, 1e3);
                setTimeout(() => {
                  var _a5;
                  (_a5 = window == null ? void 0 : window.okeWidgetApi) == null ? void 0 : _a5.initAllWidgets();
                }, 3e3);
              },
              { timeout: 5e3 }
            );
          }
          firstRender = false;
        }, "afterEnter")
      }
    ]
  });
  [...(_c = barba.cache.keys()) != null ? _c : []].forEach((key) => {
    if (key.includes("/account")) {
      barba.cache.delete(key);
    }
  });
  handleRouteCaching(window.location.origin + window.location.pathname);
  barba.timeout = 1;
  initialized = true;
}, "initPageTransitions");

// assets/pagination.ts
var initPagination = /* @__PURE__ */ __name(() => {
}, "initPagination");
var _pagination = {
  init: /* @__PURE__ */ __name((paginationContainer, container) => {
    const paginateToUrl = /* @__PURE__ */ __name(async (url) => {
      var _a2;
      if (!container) {
        return;
      }
      try {
        (_a2 = container == null ? void 0 : container.querySelectorAll(
          "[class^=product-card--], [class^=collection-card--], [class^=article-card--], [class^=blog-card--], [class^=page-card--]"
        )) == null ? void 0 : _a2.forEach((card) => {
          var _a3;
          (_a3 = card == null ? void 0 : card.classList) == null ? void 0 : _a3.add("button-loading-transparent");
        });
        if (!url.includes(window.location.origin)) {
          url = `${window.location.origin}${url}`;
        }
        const html = await utils.fetchFromCache(url);
        const newDocument = new DOMParser().parseFromString(html, "text/html");
        const newContent = newDocument.querySelector(`[data-next-url][x-ref="${container == null ? void 0 : container.getAttribute("x-ref")}"]`);
        const newPagination = newDocument.querySelector(`[data-pagination][x-ref="pagination"]`);
        if (newContent) {
          container.innerHTML = newContent.innerHTML;
        }
        if (newPagination) {
          paginationContainer.innerHTML = newPagination.innerHTML;
        }
        window.scrollTo({
          top: (container == null ? void 0 : container.getBoundingClientRect().y) + window.scrollY - 260,
          behavior: "smooth"
        });
        barba.history.add(url.toString(), "barba", "push");
      } catch (error) {
        console.error("Error loading new page:", error);
      }
    }, "paginateToUrl");
    return {
      paginateToUrl
    };
  }, "init")
};
window._pagination = _pagination;

// assets/product-data.ts
var _a;
var _product2 = {
  getHtmlProduct: /* @__PURE__ */ __name((handle) => {
    var _a2, _b, _c, _d, _e, _f;
    const product = JSONParse(
      (_c = (_a2 = document.querySelector(`[data-primary-product-data="${handle}"]`)) == null ? void 0 : _a2.innerHTML) != null ? _c : (_b = document.querySelector(`[data-product-data="${handle}"]`)) == null ? void 0 : _b.innerHTML
    );
    if (product) {
      _products[handle] = {
        _recommendations_loaded_at: 0,
        complementary_products: [],
        related_products: [],
        ...(_d = _products[handle]) != null ? _d : {},
        ...(product == null ? void 0 : product._full_data) ? product : ((_e = _products[handle]) == null ? void 0 : _e._full_data) ? _products[handle] : product,
        _updated_at: Date.now()
      };
      if (!((_f = _products[handle]) == null ? void 0 : _f._full_data)) {
        const dbKey = `_${window.Shopify.theme.id}-product--${handle}`;
        idbKeyval.get(dbKey).then((dbProduct) => {
          var _a3;
          if (dbProduct == null ? void 0 : dbProduct._full_data) {
            _products[handle] = {
              ...(_a3 = _products[handle]) != null ? _a3 : {},
              ...dbProduct,
              _updated_at: Date.now()
            };
            _product2.saveProduct(handle);
          }
        });
      }
      _product2.saveProduct(handle);
      return _products[handle];
    }
    return null;
  }, "getHtmlProduct"),
  getCachedProduct: /* @__PURE__ */ __name(async (handle) => {
    var _a2, _b, _c;
    const dbKey = `_${window.Shopify.theme.id}-product--${handle}`;
    const product = await idbKeyval.get(dbKey);
    if (product && ((_a2 = product._updated_at) != null ? _a2 : 0) > Date.now() - 1e3 * 60 * 30) {
      _products[handle] = {
        ...(_b = _products[handle]) != null ? _b : {},
        ...(product == null ? void 0 : product._full_data) ? product : ((_c = _products[handle]) == null ? void 0 : _c._full_data) ? _products[handle] : product
      };
      return _products[handle];
    }
    return null;
  }, "getCachedProduct"),
  getFetchProduct: /* @__PURE__ */ __name(async (handle, productId) => {
    var _a2, _b;
    if (!productId) return null;
    try {
      if (!window._fetch_products.has(handle)) {
        window._fetch_products.set(
          handle,
          fetch(
            `/recommendations/products?product_id=${productId}&limit=10&section_id=data_product_json&intent=related&with_product_data=true`
          ).then((res) => res.text()).then((text) => {
            var _a3, _b2, _c, _d;
            const html = document.createElement("div");
            html.innerHTML = text;
            const product2 = JSONParse((_b2 = (_a3 = html.querySelector("[data-product-data]")) == null ? void 0 : _a3.innerHTML) != null ? _b2 : "{}");
            product2.related_products = JSONParse(
              (_d = (_c = html.querySelector("[data-product-recommendations]")) == null ? void 0 : _c.innerHTML) != null ? _d : "[]"
            );
            requestIdleCallback(
              async () => {
                var _a4;
                [...(_a4 = product2.related_products) != null ? _a4 : []].filter((a, i, arr) => arr.findIndex((b) => a.handle === b.handle) === i).map(async (product3) => {
                  var _a5, _b3;
                  const dbKey = `_${window.Shopify.theme.id}-product--${product3.handle}`;
                  _products[product3.handle] = {
                    _recommendations_loaded_at: 0,
                    related_products: [],
                    complementary_products: [],
                    ...(_a5 = _products[product3.handle]) != null ? _a5 : await idbKeyval.get(dbKey) || {},
                    ...(product3 == null ? void 0 : product3._full_data) ? product3 : ((_b3 = _products[product3.handle]) == null ? void 0 : _b3._full_data) ? _products[product3.handle] : product3,
                    _updated_at: Date.now()
                  };
                  idbKeyval.set(dbKey, _products[product3.handle]);
                });
              },
              { timeout: 5e3 }
            );
            product2._recommendations_loaded_at = Date.now();
            return product2;
          })
        );
      }
      const product = await window._fetch_products.get(handle);
      if (product) {
        _products[handle] = {
          complementary_products: [],
          ...(_a2 = _products[handle]) != null ? _a2 : {},
          ...(product == null ? void 0 : product._full_data) ? product : ((_b = _products[handle]) == null ? void 0 : _b._full_data) ? _products[handle] : product,
          _recommendations_loaded_at: product._recommendations_loaded_at,
          related_products: product.related_products,
          _updated_at: Date.now()
        };
        _product2.saveProduct(handle);
        return _products[handle];
      }
      return null;
    } catch (err) {
      return null;
    }
  }, "getFetchProduct"),
  saveProduct: /* @__PURE__ */ __name((handle, dataOverride = void 0) => {
    var _a2, _b;
    _products[handle] = {
      ...(_a2 = _products[handle]) != null ? _a2 : {},
      ...dataOverride != null ? dataOverride : {}
    };
    const product = _products[handle];
    if (!product) return null;
    const dbKey = `_${window.Shopify.theme.id}-product--${handle}`;
    const nextSeq = ((_b = window._save_product_sequence.get(handle)) != null ? _b : 0) + 1;
    window._save_product_sequence.set(handle, nextSeq);
    if (window._save_product_schedule.has(handle)) {
      return product;
    }
    window._save_product_schedule.add(handle);
    requestIdleCallback(
      async () => {
        var _a3, _b2;
        try {
          while (true) {
            const sequence_before = (_a3 = window._save_product_sequence.get(handle)) != null ? _a3 : 0;
            const latest = _products[handle];
            await idbKeyval.set(dbKey, latest);
            const sequence_after = (_b2 = window._save_product_sequence.get(handle)) != null ? _b2 : 0;
            if (sequence_after === sequence_before) {
              break;
            }
          }
        } finally {
          window._save_product_schedule.delete(handle);
        }
      },
      { timeout: 5e3 }
    );
    return product;
  }, "saveProduct"),
  getHydratedProductData: /* @__PURE__ */ __name(async (handle, productId) => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i;
    if (!_products[handle] || ((_b = (_a2 = _products[handle]) == null ? void 0 : _a2._recommendations_loaded_at) != null ? _b : 0) < Date.now() - 1e3 * 60 * 30) {
      _product2.getHtmlProduct(handle);
    }
    if (!_products[handle] || ((_d = (_c = _products[handle]) == null ? void 0 : _c._recommendations_loaded_at) != null ? _d : 0) < Date.now() - 1e3 * 60 * 30) {
      await _product2.getCachedProduct(handle);
    }
    if (!_products[handle] || ((_f = (_e = _products[handle]) == null ? void 0 : _e._recommendations_loaded_at) != null ? _f : 0) < Date.now() - 1e3 * 60 * 30) {
      await _product2.getFetchProduct(handle, productId || ((_g = _products[handle]) == null ? void 0 : _g.id));
    }
    if (!_products[handle] || ((_i = (_h = _products[handle]) == null ? void 0 : _h._recommendations_loaded_at) != null ? _i : 0) < Date.now() - 1e3 * 60 * 30) {
      return null;
    }
    return _products[handle];
  }, "getHydratedProductData"),
  getProductData: /* @__PURE__ */ __name(async (handle, productId) => {
    if (!_products[handle]) {
      _product2.getHtmlProduct(handle);
    }
    if (!_products[handle]) {
      await _product2.getCachedProduct(handle);
    }
    if (!_products[handle]) {
      await _product2.getFetchProduct(handle, productId);
    }
    if (!_products[handle]) {
      return null;
    }
    return _products[handle];
  }, "getProductData"),
  initDynamicProductCards: /* @__PURE__ */ __name(($el, {
    targeting_type,
    target_product_handle,
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
    handleResize = /* @__PURE__ */ __name(() => {
    }, "handleResize"),
    order_offset = 1,
    section_id,
    filter_by_type = "",
    hide_out_of_stock = false,
    block_id
  }) => {
    var _a2, _b;
    const container = $el.parentElement;
    const fallback_products = (_a2 = JSONParse($el.getAttribute(`data-fallback-products`))) != null ? _a2 : [];
    const limit = Math.max(desktop_display_limit, mobile_display_limit);
    const product = JSONParse((_b = document.querySelector(`[data-product-data="${target_product_handle}"]`)) == null ? void 0 : _b.innerHTML);
    const cart = window.Alpine.store("cart");
    const modal = window.Alpine.store("modal");
    const editor = window.Alpine.store("editor");
    const state = window.Alpine.reactive({
      product
    });
    const renderDynamicProductCards = /* @__PURE__ */ __name(async () => {
      var _a3, _b2, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w;
      handleResize();
      setTimeout(handleResize, 50);
      const lineItemProducts = /^cart_/gi.test(targeting_type) ? await Promise.all((_a3 = cart.state.items) == null ? void 0 : _a3.map((item) => _product2.getHydratedProductData(item.handle, item.product_id))) : [];
      const recentlyViewedProducts = /^recently_viewed_/gi.test(targeting_type) ? await Promise.all(_recent_products == null ? void 0 : _recent_products.map(([handle, product_id]) => _product2.getHydratedProductData(handle, product_id))) : [];
      const products = [];
      const complementary_products = [];
      const related_products = [];
      switch (targeting_type) {
        case "product": {
          (_c = (_b2 = state.product) == null ? void 0 : _b2.complementary_products) == null ? void 0 : _c.forEach((item) => {
            var _a4;
            if (hide_out_of_stock && !item.available) return;
            if (item.id !== ((_a4 = state.product) == null ? void 0 : _a4.id)) {
              complementary_products.push(item);
            }
          });
          (_e = (_d = state.product) == null ? void 0 : _d.related_products) == null ? void 0 : _e.forEach((item) => {
            var _a4;
            if (hide_out_of_stock && !item.available) return;
            if (item.id !== ((_a4 = state.product) == null ? void 0 : _a4.id)) {
              related_products.push(item);
            }
          });
          break;
        }
        case "recently_viewed_ai": {
          const expensive = [...recentlyViewedProducts].sort((a, b) => b.price - a.price).slice(0, 3);
          const recent = recentlyViewedProducts.slice(0, 2).sort((a, b) => b.price - a.price);
          (_f = [...recent, ...expensive]) == null ? void 0 : _f.forEach((product2, parentIndex) => {
            var _a4, _b3;
            (_a4 = product2 == null ? void 0 : product2.complementary_products) == null ? void 0 : _a4.forEach((item, i) => {
              if (hide_out_of_stock && !item.available) return;
              if (i >= 2 || i >= 1 && parentIndex >= 2) {
                return;
              }
              complementary_products.push(item);
            });
            (_b3 = product2 == null ? void 0 : product2.related_products) == null ? void 0 : _b3.forEach((item, i) => {
              if (hide_out_of_stock && !item.available) return;
              if (i >= 2 || i >= 1 && parentIndex >= 2) {
                return;
              }
              related_products.push(item);
            });
          });
          break;
        }
        case "recently_viewed_most_expensive": {
          (_g = [...recentlyViewedProducts].sort((a, b) => b.price - a.price)) == null ? void 0 : _g.forEach((product2, parentIndex) => {
            var _a4, _b3;
            (_a4 = product2 == null ? void 0 : product2.complementary_products) == null ? void 0 : _a4.forEach((item, i) => {
              if (hide_out_of_stock && !item.available) return;
              if (i >= 2 || i >= 1 && parentIndex >= 2) {
                return;
              }
              complementary_products.push(item);
            });
            (_b3 = product2 == null ? void 0 : product2.related_products) == null ? void 0 : _b3.forEach((item, i) => {
              if (hide_out_of_stock && !item.available) return;
              if (i >= 2 || i >= 1 && parentIndex >= 2) {
                return;
              }
              related_products.push(item);
            });
          });
          break;
        }
        case "recently_viewed_least_expensive": {
          (_h = [...recentlyViewedProducts].sort((a, b) => a.price - b.price)) == null ? void 0 : _h.forEach((product2, parentIndex) => {
            var _a4, _b3;
            (_a4 = product2 == null ? void 0 : product2.complementary_products) == null ? void 0 : _a4.forEach((item, i) => {
              if (hide_out_of_stock && !item.available) return;
              if (i >= 2 || i >= 1 && parentIndex >= 2) {
                return;
              }
              complementary_products.push(item);
            });
            (_b3 = product2 == null ? void 0 : product2.related_products) == null ? void 0 : _b3.forEach((item, i) => {
              if (hide_out_of_stock && !item.available) return;
              if (i >= 2 || i >= 1 && parentIndex >= 2) {
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
          (_i = [...recent, ...expensive]) == null ? void 0 : _i.forEach((line, parentIndex) => {
            var _a4, _b3;
            const product2 = lineItemProducts.find((p) => p.handle === line.handle);
            (_a4 = product2 == null ? void 0 : product2.complementary_products) == null ? void 0 : _a4.forEach((item, i) => {
              if (hide_out_of_stock && !item.available) return;
              if (i >= 2 || i >= 1 && parentIndex >= 2) {
                return;
              }
              complementary_products.push(item);
            });
            (_b3 = product2 == null ? void 0 : product2.related_products) == null ? void 0 : _b3.forEach((item, i) => {
              if (hide_out_of_stock && !item.available) return;
              if (i >= 2 || i >= 1 && parentIndex >= 2) {
                return;
              }
              related_products.push(item);
            });
          });
          break;
        }
        case "cart_most_expensive": {
          (_j = [...cart.state.items].sort((a, b) => b.final_price - a.final_price)) == null ? void 0 : _j.forEach((line, parentIndex) => {
            var _a4, _b3;
            const product2 = lineItemProducts.find((p) => p.handle === line.handle);
            (_a4 = product2 == null ? void 0 : product2.complementary_products) == null ? void 0 : _a4.forEach((item, i) => {
              if (hide_out_of_stock && !item.available) return;
              if (i >= 2 || i >= 1 && parentIndex >= 2) {
                return;
              }
              complementary_products.push(item);
            });
            (_b3 = product2 == null ? void 0 : product2.related_products) == null ? void 0 : _b3.forEach((item, i) => {
              if (hide_out_of_stock && !item.available) return;
              if (i >= 2 || i >= 1 && parentIndex >= 2) {
                return;
              }
              related_products.push(item);
            });
          });
          break;
        }
        case "cart_least_expensive": {
          (_k = [...cart.state.items].sort((a, b) => a.final_price - b.final_price)) == null ? void 0 : _k.forEach((line, parentIndex) => {
            var _a4, _b3;
            const product2 = lineItemProducts.find((p) => p.handle === line.handle);
            (_a4 = product2 == null ? void 0 : product2.complementary_products) == null ? void 0 : _a4.forEach((item, i) => {
              if (hide_out_of_stock && !item.available) return;
              if (i >= 2 || i >= 1 && parentIndex >= 2) {
                return;
              }
              complementary_products.push(item);
            });
            (_b3 = product2 == null ? void 0 : product2.related_products) == null ? void 0 : _b3.forEach((item, i) => {
              if (hide_out_of_stock && !item.available) return;
              if (i >= 2 || i >= 1 && parentIndex >= 2) {
                return;
              }
              related_products.push(item);
            });
          });
          break;
        }
        case "cart_recently_added": {
          (_l = cart.state.items) == null ? void 0 : _l.forEach((line, parentIndex) => {
            var _a4, _b3;
            const product2 = lineItemProducts.find((p) => p.handle === line.handle);
            (_a4 = product2 == null ? void 0 : product2.complementary_products) == null ? void 0 : _a4.forEach((item, i) => {
              if (hide_out_of_stock && !item.available) return;
              if (i >= 2 || i >= 1 && parentIndex >= 2) {
                return;
              }
              complementary_products.push(item);
            });
            (_b3 = product2 == null ? void 0 : product2.related_products) == null ? void 0 : _b3.forEach((item, i) => {
              if (hide_out_of_stock && !item.available) return;
              if (i >= 2 || i >= 1 && parentIndex >= 2) {
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
          complementary_products == null ? void 0 : complementary_products.forEach((prod) => products.push(prod));
          break;
        }
        case "related": {
          related_products == null ? void 0 : related_products.forEach((prod) => products.push(prod));
          break;
        }
        case "recently_viewed": {
          const recent_products = await Promise.all(
            (_n = (_m = window == null ? void 0 : window._recent_products) != null ? _m : []) == null ? void 0 : _n.map(([handle, product_id]) => _product2.getHydratedProductData(handle, product_id))
          );
          recent_products == null ? void 0 : recent_products.forEach((prod) => products.push(prod));
          break;
        }
        case "manual": {
          fallback_products == null ? void 0 : fallback_products.forEach((prod) => products.push(prod));
          break;
        }
      }
      switch (fallback_source) {
        case "complementary": {
          complementary_products == null ? void 0 : complementary_products.forEach((prod) => products.push(prod));
          break;
        }
        case "related": {
          related_products == null ? void 0 : related_products.forEach((prod) => products.push(prod));
          break;
        }
        case "recently_viewed": {
          const recent_products = await Promise.all(
            ((_o = window == null ? void 0 : window._recent_products) != null ? _o : []).map(([handle, product_id]) => _product2.getHydratedProductData(handle, product_id))
          );
          recent_products == null ? void 0 : recent_products.forEach((prod) => products.push(prod));
          break;
        }
        case "manual": {
          fallback_products == null ? void 0 : fallback_products.forEach((prod) => products.push(prod));
          break;
        }
      }
      const renderProducts = (_q = (_p = products == null ? void 0 : products.filter((prod) => {
        var _a4;
        if (targeting_type === "product") {
          if (!prod || prod.id === ((_a4 = state == null ? void 0 : state.product) == null ? void 0 : _a4.id)) return false;
        }
        if (/^cart_/gi.test(targeting_type)) {
          if (cart.state.items.some((item) => item.product_id === (prod == null ? void 0 : prod.id))) return false;
        }
        if (/^recently_viewed_/gi.test(targeting_type)) {
          if (_recent_products.some(([handle, id]) => id === (prod == null ? void 0 : prod.id))) return false;
        }
        if (filter_by_type) {
          if (prod.type.toLowerCase().trim() !== filter_by_type) return false;
        }
        if (hide_out_of_stock && !prod.available) {
          return false;
        }
        return true;
      })) == null ? void 0 : _p.filter((a, i, arr) => arr.findIndex((b) => b.id === a.id) === i)) != null ? _q : [];
      const validFallbackProducts = (_s = (_r = fallback_products == null ? void 0 : fallback_products.filter((prod) => {
        var _a4;
        if (targeting_type === "product") {
          if (!prod || prod.id === ((_a4 = state == null ? void 0 : state.product) == null ? void 0 : _a4.id)) return false;
        }
        if (/^cart_/gi.test(targeting_type)) {
          if (cart.state.items.some((item) => item.product_id === (prod == null ? void 0 : prod.id))) return false;
        }
        if (/^recently_viewed_/gi.test(targeting_type)) {
          if (_recent_products.some(([handle, id]) => id === (prod == null ? void 0 : prod.id))) return false;
        }
        if (filter_by_type) {
          if (prod.type.toLowerCase().trim() !== filter_by_type) return false;
        }
        if (hide_out_of_stock && !prod.available) {
          return false;
        }
        return true;
      })) == null ? void 0 : _r.filter((a, i, arr) => arr.findIndex((b) => b.id === a.id) === i)) != null ? _s : [];
      switch (hide_if_empty) {
        case "none": {
          if ((renderProducts == null ? void 0 : renderProducts.length) === 0 && (validFallbackProducts == null ? void 0 : validFallbackProducts.length)) {
            validFallbackProducts.forEach((prod) => renderProducts.push(prod));
          }
          break;
        }
        case "section": {
          (_v = (_u = (_t = container.closest(`.shopify-section`)) == null ? void 0 : _t.style) == null ? void 0 : _u.setProperty) == null ? void 0 : _v.call(_u, "display", "block");
          (_w = container.closest(`.shopify-section`)) == null ? void 0 : _w.classList.toggle("!hidden", (renderProducts == null ? void 0 : renderProducts.length) === 0);
          break;
        }
        case "container": {
          container == null ? void 0 : container.classList.toggle("!hidden", (renderProducts == null ? void 0 : renderProducts.length) === 0);
          break;
        }
        case "block": {
          break;
        }
      }
      const existingItems = container.querySelectorAll(`[data-render-index*="${block_id}--"]`);
      const controlProducts = renderProducts == null ? void 0 : renderProducts.filter(
        (prod, index) => !container.querySelector(`[data-render-index="${block_id}--${index}"][data-product-handle="${prod.handle}"]`)
      );
      if (!controlProducts.length && existingItems.length === (renderProducts == null ? void 0 : renderProducts.length)) {
        return;
      }
      existingItems.forEach((el) => el.remove());
      renderProducts.slice(0, limit).forEach((prod, i, arr) => {
        var _a4;
        const node = (_a4 = document.querySelector(`[data-product-card='${product_class}']`)) == null ? void 0 : _a4.cloneNode(true);
        if (node) {
          const div = document.createElement("div");
          div.setAttribute("data-product-handle", prod.handle);
          div.setAttribute("data-style-id", `${section_id}--${block_id}`);
          div.setAttribute("data-render-index", `${block_id}--${i}`);
          div.setAttribute(
            "class",
            `shrink-0 max-w-full w-full order-[--order] ${i > desktop_display_limit ? "mobile-only" : i > mobile_display_limit ? "desktop-tablet-only" : ""}`
          );
          div.style.setProperty("--order", `${(i + order_offset) * 10}`);
          node.removeAttribute(`data-product-card`);
          node.setAttribute("data-product-handle", prod.handle);
          node.setAttribute("data-product-id", `${prod.id}`);
          node.classList.add("card-loading");
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
    }, "renderDynamicProductCards");
    renderDynamicProductCards();
    if (targeting_type === "product" && (primary_source === "related" || fallback_source === "related")) {
      Alpine.effect(() => {
        var _a3, _b2, _c;
        if (((_a3 = state.product) == null ? void 0 : _a3._recommendations_loaded_at) || ((_c = (_b2 = state.product) == null ? void 0 : _b2.complementary_products) == null ? void 0 : _c.length)) {
          renderDynamicProductCards();
        }
      });
    }
    if (/^cart_/gi.test(targeting_type)) {
      Alpine.effect(() => {
        const show = !container.closest("[data-dynamic-modals]") || (editor == null ? void 0 : editor.select_section_id) === section_id || modal.id === "modal--cart-drawer";
        if ((cart.state.total_price || cart.state.item_count || cart.state.item_count <= 0) && show) {
          renderDynamicProductCards();
        }
      });
    }
    _product2.getHydratedProductData(product == null ? void 0 : product.handle, product == null ? void 0 : product.id).then((res) => {
      var _a3;
      state.product = ((_a3 = state.product) == null ? void 0 : _a3.handle) === (res == null ? void 0 : res.handle) ? res : state.product;
    });
  }, "initDynamicProductCards"),
  getSelectedVariant: /* @__PURE__ */ __name((product, variantId) => {
    const {
      variants = [],
      selected_variant_id,
      selected_or_first_available_variant_id,
      options_with_values = []
    } = product != null ? product : {};
    const matchDepth = /* @__PURE__ */ __name((v, depth) => options_with_values.slice(0, depth).every((option, i) => {
      var _a2;
      return _product2.lastOptions[(_a2 = option == null ? void 0 : option.name) == null ? void 0 : _a2.toLowerCase()] === v.options[i];
    }), "matchDepth");
    const matchSome = /* @__PURE__ */ __name((v) => options_with_values.some((option, i) => {
      var _a2;
      return _product2.lastOptions[(_a2 = option == null ? void 0 : option.name) == null ? void 0 : _a2.toLowerCase()] === v.options[i];
    }), "matchSome");
    const strategies = [
      (v) => v.id === variantId,
      (v) => v.id && v.available && !v.preorder && matchDepth(v, options_with_values.length),
      (v) => v.id && v.available && !v.preorder && matchDepth(v, options_with_values.length - 1),
      (v) => v.id && v.available && !v.preorder && matchDepth(v, options_with_values.length - 2),
      (v) => v.id && v.available && !v.preorder && matchSome(v),
      (v) => v.id === selected_variant_id && v.available && !v.preorder,
      (v) => v.id === selected_or_first_available_variant_id && v.available && !v.preorder,
      (v) => v.id && v.available && !v.preorder,
      (v) => v.id && v.available && matchDepth(v, options_with_values.length),
      (v) => v.id && v.available && matchDepth(v, options_with_values.length - 1),
      (v) => v.id && v.available && matchDepth(v, options_with_values.length - 2),
      (v) => v.id && v.available && matchSome(v),
      (v) => v.id === selected_variant_id && v.available,
      (v) => v.id === selected_or_first_available_variant_id && v.available,
      (v) => v.id && v.available
    ];
    return strategies.map((fn) => variants.find(fn)).find(Boolean) || variants[0];
  }, "getSelectedVariant"),
  lastOptions: (_a = JSONParse(sessionStorage.getItem("_p_last_options") || "{}")) != null ? _a : {}
};
window._product = _product2;
var initProductData = /* @__PURE__ */ __name(() => {
}, "initProductData");

// assets/quick-view.ts
var initQuickView = /* @__PURE__ */ __name(() => {
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
          var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
          const container = this.container;
          this.handle = handle;
          this.show = true;
          (_b = (_a2 = this.loading_container) == null ? void 0 : _a2.classList) == null ? void 0 : _b.remove("opacity-0", "pointer-events-none");
          if (!handle || !container) return;
          (_e = (_d = (_c = container.parentElement) == null ? void 0 : _c.querySelectorAll) == null ? void 0 : _d.call(_c, "style")) == null ? void 0 : _e.forEach((style) => {
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
          const section = (_f = div.querySelector(`[data-content-root] [data-section-type="main_product"]`)) == null ? void 0 : _f.parentElement;
          if (!form || !section) {
            return;
          }
          section == null ? void 0 : section.classList.add("!h-full", "!overflow-hidden");
          form.classList.add(
            "max-lg:!max-h-full",
            "max-lg:!overflow-y-auto",
            "scrollbar-none",
            "!h-full",
            "!py-8",
            "lg:!overflow-hidden"
          );
          (_g = form.querySelectorAll(":scope > [data-style-id]")) == null ? void 0 : _g.forEach((childContainer) => {
            var _a3, _b2, _c2, _d2;
            childContainer.classList.add("lg:!max-h-full", "lg:!overflow-y-auto", "scrollbar-none");
            (_a3 = childContainer == null ? void 0 : childContainer.style) == null ? void 0 : _a3.setProperty("position", "relative", "important");
            (_b2 = childContainer == null ? void 0 : childContainer.style) == null ? void 0 : _b2.setProperty("top", "unset", "important");
            (_c2 = childContainer == null ? void 0 : childContainer.style) == null ? void 0 : _c2.setProperty("height", "unset", "important");
            (_d2 = childContainer == null ? void 0 : childContainer.style) == null ? void 0 : _d2.setProperty("max-height", "unset", "important");
            if (childContainer.querySelector("[data-main-product-images]")) {
              childContainer == null ? void 0 : childContainer.classList.add("@container");
            }
          });
          (_i = (_h = section == null ? void 0 : section.parentElement) == null ? void 0 : _h.querySelectorAll("style")) == null ? void 0 : _i.forEach((style) => {
            container.parentElement.prepend(style);
          });
          const sideContent = form == null ? void 0 : form.querySelector('[x-ref="content"]');
          sideContent == null ? void 0 : sideContent.classList.add("max-h-full", "overflow-y-auto");
          form == null ? void 0 : form.setAttribute("data-quick-view", "true");
          (_j = form == null ? void 0 : form.classList) == null ? void 0 : _j.remove(
            "px-container-xs",
            "px-container-sm",
            "px-container-md",
            "px-container-lg",
            "px-container-fullwidth"
          );
          (_k = form == null ? void 0 : form.classList) == null ? void 0 : _k.add("px-container-gutter");
          (_m = (_l = this.loading_container) == null ? void 0 : _l.classList) == null ? void 0 : _m.add("opacity-0", "pointer-events-none");
          container.innerHTML = productData.outerHTML + (section == null ? void 0 : section.outerHTML);
          const stateElement = container.querySelector('[data-section-type="main_product"]');
          if ($data && bundleButton && stateElement) {
            stateElement.querySelectorAll('[data-block-type="quantity_selector"], [data-block-type="complementary_products"]').forEach((el) => {
              el.remove();
            });
            stateElement.querySelectorAll(`[data-block-type="add_to_cart_button"]`).forEach((element) => {
              const clonedBundleButton = bundleButton.cloneNode(true);
              element.innerHTML = "";
              element.appendChild(clonedBundleButton);
            });
            Alpine.nextTick(() => {
              var _a3;
              (_a3 = stateElement == null ? void 0 : stateElement._x_dataStack) == null ? void 0 : _a3.forEach((proxyState) => {
                if ((proxyState == null ? void 0 : proxyState.card) && (proxyState == null ? void 0 : proxyState.bundle) && (proxyState == null ? void 0 : proxyState.state)) {
                  proxyState.card = proxyState.state;
                  proxyState.bundle = $data.bundle;
                }
              });
            });
          }
          if (variantId) {
            Alpine.nextTick(() => {
              var _a3;
              (_a3 = stateElement == null ? void 0 : stateElement._x_dataStack) == null ? void 0 : _a3.forEach((proxyState) => {
                if ((proxyState == null ? void 0 : proxyState.state) && proxyState.setSelectedVariant) {
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
    }
  });
  const quickViewStore = window.Alpine.store("quickView");
  const handleKeydown = /* @__PURE__ */ __name((e) => {
    if (e.key === "Escape") {
      quickViewStore.show = false;
    }
  }, "handleKeydown");
  window.Alpine.effect(() => {
    var _a2;
    document.body.classList.toggle("!overflow-hidden", quickViewStore.show);
    if (quickViewStore.show) {
      document.addEventListener("keydown", handleKeydown);
    }
    if (!quickViewStore.show) {
      document.removeEventListener("keydown", handleKeydown);
      (_a2 = quickViewStore.dynamic_popups) == null ? void 0 : _a2.forEach((element) => {
        element.remove();
      });
      quickViewStore.dynamic_popups = [];
    }
  });
  window.Alpine.magic("quickView", () => quickViewStore);
  window._stores["quickView"] = quickViewStore;
}, "initQuickView");

// assets/scrollbar.ts
var initScrollBar = /* @__PURE__ */ __name(() => {
}, "initScrollBar");
var _scrollbar = {
  init: /* @__PURE__ */ __name((bar, thumb, container, scroll_speed = 150) => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    const findScrollContainer = /* @__PURE__ */ __name((element) => {
      var _a3;
      return ((_a3 = element == null ? void 0 : element.parentElement) == null ? void 0 : _a3.querySelector('[x-ref="scrollContainer"]')) || findScrollContainer(element.parentElement);
    }, "findScrollContainer");
    if (bar && !container) {
      container = findScrollContainer(bar);
    }
    const isHorizontal = /* @__PURE__ */ __name(() => {
      return !!(getComputedStyle(container).overflowY === "hidden" || getComputedStyle(container).gridAutoFlow === "column" || container.scrollWidth > (container == null ? void 0 : container.clientWidth));
    }, "isHorizontal");
    const horizontal = isHorizontal();
    const state = window.Alpine.reactive({
      horizontal,
      current_index: Math.max(
        1,
        horizontal ? Math.min(
          (_b = [...(_a2 = container == null ? void 0 : container.children) != null ? _a2 : []]) == null ? void 0 : _b.filter(
            (child) => getComputedStyle(child).display !== "none" && getComputedStyle(child).scrollSnapAlign !== "none"
          ).length,
          ((_d = [...(_c = container == null ? void 0 : container.children) != null ? _c : []]) == null ? void 0 : _d.filter(
            (child) => getComputedStyle(child).display !== "none" && getComputedStyle(child).scrollSnapAlign !== "none"
          ).findIndex((child) => {
            const center = (container == null ? void 0 : container.clientWidth) / 2 + (container == null ? void 0 : container.scrollLeft);
            const start = (container == null ? void 0 : container.scrollLeft) + +getComputedStyle(container).scrollPaddingLeft.replace("px", "").replace("auto", "0");
            if ((container == null ? void 0 : container.children.length) > Math.round((container == null ? void 0 : container.scrollWidth) / (container == null ? void 0 : container.clientWidth) * 100) / 100) {
              return child.offsetLeft - 5 <= start && child.offsetLeft + child.clientWidth > start;
            }
            return child.offsetLeft < center && child.offsetLeft + child.clientWidth > center;
          })) + 1
        ) : Math.min(
          (_f = [...(_e = container == null ? void 0 : container.children) != null ? _e : []]) == null ? void 0 : _f.filter(
            (child) => getComputedStyle(child).display !== "none" && getComputedStyle(child).scrollSnapAlign !== "none"
          ).length,
          ((_h = [...(_g = container == null ? void 0 : container.children) != null ? _g : []]) == null ? void 0 : _h.filter(
            (child) => getComputedStyle(child).display !== "none" && getComputedStyle(child).scrollSnapAlign !== "none"
          ).findIndex((child) => {
            const center = (container == null ? void 0 : container.clientHeight) / 2 + (container == null ? void 0 : container.scrollTop);
            const start = (container == null ? void 0 : container.scrollTop) + +getComputedStyle(container).scrollPaddingTop.replace("px", "").replace("auto", "0");
            if ((container == null ? void 0 : container.children.length) > Math.round((container == null ? void 0 : container.scrollHeight) / (container == null ? void 0 : container.clientHeight) * 100) / 100) {
              return child.offsetTop - 5 <= start && child.offsetTop + child.clientHeight > start;
            }
            return child.offsetTop < center && child.offsetLeft + child.clientHeight > center;
          })) + 1
        )
      ),
      pages: (_j = [...(_i = container == null ? void 0 : container.children) != null ? _i : []]) == null ? void 0 : _j.filter(
        (child) => getComputedStyle(child).display !== "none" && getComputedStyle(child).scrollSnapAlign !== "none"
      ).length,
      width: (container == null ? void 0 : container.clientWidth) / (container == null ? void 0 : container.scrollWidth) * 100,
      height: (container == null ? void 0 : container.clientHeight) / (container == null ? void 0 : container.scrollHeight) * 100,
      left: (container == null ? void 0 : container.scrollLeft) / (container == null ? void 0 : container.scrollWidth) * bar.clientWidth / bar.clientWidth,
      top: (container == null ? void 0 : container.scrollTop) / (container == null ? void 0 : container.scrollHeight) * bar.clientHeight / bar.clientHeight,
      manual_scroll: false,
      no_next_page: horizontal ? (container == null ? void 0 : container.scrollLeft) + (container == null ? void 0 : container.clientWidth) + 25 >= (container == null ? void 0 : container.scrollWidth) : (container == null ? void 0 : container.scrollTop) + (container == null ? void 0 : container.clientHeight) + 25 >= (container == null ? void 0 : container.scrollHeight)
    });
    const calculatePosition = /* @__PURE__ */ __name(() => {
      var _a3;
      state.horizontal = isHorizontal();
      const children = [...(_a3 = container == null ? void 0 : container.children) != null ? _a3 : []].filter((el) => el.tagName !== "STYLE").filter((child) => getComputedStyle(child).display !== "none" && getComputedStyle(child).scrollSnapAlign !== "none").toSorted((a, b) => +getComputedStyle(a).order - +getComputedStyle(b).order);
      if (state.horizontal) {
        state.current_index = Math.max(
          1,
          Math.min(
            children.length,
            (children == null ? void 0 : children.findIndex((child, i, arr) => {
              const center = (container == null ? void 0 : container.clientWidth) / 2 + (container == null ? void 0 : container.scrollLeft);
              const start = (container == null ? void 0 : container.scrollLeft) + parseFloat(getComputedStyle(container).scrollPaddingLeft.replace("auto", "0"));
              if (arr.length > Math.round((container == null ? void 0 : container.scrollWidth) / (container == null ? void 0 : container.clientWidth) * 100) / 100) {
                return child.offsetLeft - 5 <= start && child.offsetLeft + child.clientWidth > start;
              }
              return child.offsetLeft < center && child.offsetLeft + child.clientWidth > center;
            })) + 1 || children.length
          )
        );
      }
      if (!state.horizontal) {
        state.current_index = Math.max(
          1,
          Math.min(
            children.length,
            (children == null ? void 0 : children.findIndex((child, i, arr) => {
              const center = (container == null ? void 0 : container.clientHeight) / 2 + (container == null ? void 0 : container.scrollTop);
              const start = (container == null ? void 0 : container.scrollTop) + parseFloat(getComputedStyle(container).scrollPaddingTop.replace("auto", "0"));
              if (arr.length > Math.round((container == null ? void 0 : container.scrollHeight) / (container == null ? void 0 : container.clientHeight) * 100) / 100) {
                return child.offsetTop - 5 <= start && child.offsetTop + child.clientHeight > start;
              }
              return child.offsetTop < center && child.offsetTop + child.clientHeight > center;
            })) + 1 || children.length
          )
        );
      }
      state.pages = children == null ? void 0 : children.filter((child) => getComputedStyle(child).display !== "none").length;
      state.width = (container == null ? void 0 : container.clientWidth) / (container == null ? void 0 : container.scrollWidth);
      state.height = (container == null ? void 0 : container.clientHeight) / (container == null ? void 0 : container.scrollHeight);
      state.left = (container == null ? void 0 : container.scrollLeft) / (container == null ? void 0 : container.scrollWidth) * bar.clientWidth / bar.clientWidth;
      state.top = (container == null ? void 0 : container.scrollTop) / (container == null ? void 0 : container.scrollHeight) * bar.clientHeight / bar.clientHeight;
      state.no_next_page = state.current_index === state.pages || (state.horizontal ? (container == null ? void 0 : container.scrollLeft) + (container == null ? void 0 : container.clientWidth) + 25 >= (container == null ? void 0 : container.scrollWidth) : (container == null ? void 0 : container.scrollTop) + (container == null ? void 0 : container.clientHeight) + 25 >= (container == null ? void 0 : container.scrollHeight));
    }, "calculatePosition");
    const handleScrollBarClick = /* @__PURE__ */ __name((e, content_slider) => {
      if (state.horizontal) {
        const percentage = (e.clientX - bar.getBoundingClientRect().left) / bar.clientWidth - state.width / 2 * bar.clientWidth / bar.clientWidth;
        if (content_slider == null ? void 0 : content_slider.state) {
          content_slider.state.block_scroll_events = true;
        }
        container == null ? void 0 : container.scrollTo({
          left: percentage * (container == null ? void 0 : container.scrollWidth),
          behavior: "instant"
        });
      }
      if (!state.horizontal) {
        const percentage = (e.clientY - bar.getBoundingClientRect().top) / bar.scrollHeight - state.height / 2 * bar.scrollHeight / bar.scrollHeight;
        if (content_slider == null ? void 0 : content_slider.state) {
          content_slider.state.block_scroll_events = true;
        }
        container == null ? void 0 : container.scrollTo({
          top: percentage * (container == null ? void 0 : container.scrollHeight),
          behavior: "instant"
        });
      }
      if (content_slider == null ? void 0 : content_slider.state) {
        content_slider.state.block_scroll_events = false;
      }
      calculatePosition();
    }, "handleScrollBarClick");
    const handleScrollThumbPointerDown = /* @__PURE__ */ __name((e, content_slider) => {
      if (!container) return;
      container.style.scrollSnapType = "none";
      if (state.horizontal) {
        const startX = e.clientX;
        const startLeft = state.left * bar.clientWidth;
        document.body.classList.add("[&_*]:!cursor-grabbing");
        thumb.classList.add("active");
        if (content_slider == null ? void 0 : content_slider.state) {
          content_slider.state.block_scroll_events = true;
        }
        const handleDocumentPointerMove = /* @__PURE__ */ __name((e2) => {
          const percentage = Math.max(0, Math.min(1, (startLeft + e2.clientX - startX) / bar.clientWidth));
          container == null ? void 0 : container.scrollTo({
            left: percentage * (container == null ? void 0 : container.scrollWidth),
            behavior: "instant"
          });
          calculatePosition();
        }, "handleDocumentPointerMove");
        const handleDocumentPointerUp = /* @__PURE__ */ __name((e2) => {
          removeEventListeners();
        }, "handleDocumentPointerUp");
        const removeEventListeners = /* @__PURE__ */ __name(() => {
          document.body.classList.remove("[&_*]:!cursor-grabbing");
          thumb.classList.remove("active");
          container.style.scrollSnapType = "";
          document.removeEventListener("pointermove", handleDocumentPointerMove);
          document.removeEventListener("pointerup", handleDocumentPointerUp);
          if (content_slider == null ? void 0 : content_slider.state) {
            content_slider.state.block_scroll_events = false;
          }
        }, "removeEventListeners");
        document.addEventListener("pointermove", handleDocumentPointerMove);
        document.addEventListener("pointerup", handleDocumentPointerUp);
      }
      if (!state.horizontal) {
        const startY = e.clientY;
        const startTop = state.top * bar.scrollHeight;
        document.body.classList.add("[&_*]:!cursor-grabbing");
        thumb.classList.add("active");
        if (content_slider == null ? void 0 : content_slider.state) {
          content_slider.state.block_scroll_events = true;
        }
        const handleDocumentPointerMove = /* @__PURE__ */ __name((e2) => {
          const percentage = Math.max(0, Math.min(1, (startTop + e2.clientY - startY) / bar.scrollHeight));
          container == null ? void 0 : container.scrollTo({
            top: percentage * (container == null ? void 0 : container.scrollHeight),
            behavior: "instant"
          });
          calculatePosition();
        }, "handleDocumentPointerMove");
        const handleDocumentPointerUp = /* @__PURE__ */ __name((e2) => {
          removeEventListeners();
        }, "handleDocumentPointerUp");
        const removeEventListeners = /* @__PURE__ */ __name(() => {
          document.body.classList.remove("[&_*]:!cursor-grabbing");
          thumb.classList.remove("active");
          container.style.scrollSnapType = "";
          document.removeEventListener("pointermove", handleDocumentPointerMove);
          document.removeEventListener("pointerup", handleDocumentPointerUp);
          if (content_slider == null ? void 0 : content_slider.state) {
            content_slider.state.block_scroll_events = false;
          }
        }, "removeEventListeners");
        document.addEventListener("pointermove", handleDocumentPointerMove);
        document.addEventListener("pointerup", handleDocumentPointerUp);
      }
    }, "handleScrollThumbPointerDown");
    const handlePrevClick = /* @__PURE__ */ __name((e, content_slider) => {
      var _a3, _b2, _c2, _d2, _e2, _f2;
      if (!container) return;
      container.style.scrollSnapType = "none";
      if (content_slider == null ? void 0 : content_slider.state) {
        content_slider.state.block_scroll_events = true;
      }
      const activeChildren = (_b2 = [...(_a3 = container == null ? void 0 : container.children) != null ? _a3 : []]) == null ? void 0 : _b2.filter(
        (child) => getComputedStyle(child).display !== "none" && getComputedStyle(child).scrollSnapAlign !== "none" && child.tagName !== "STYLE"
      );
      const index = Math.max(0, state.current_index - 2 < 0 ? (activeChildren == null ? void 0 : activeChildren.length) - 1 : state.current_index - 2);
      const sortedActiveChildren = activeChildren == null ? void 0 : activeChildren.toSorted((a, b) => +getComputedStyle(a).order - +getComputedStyle(b).order);
      sortedActiveChildren.forEach((child, i) => {
        child.classList.toggle("scroll-active", i === index);
      });
      if (state.horizontal) {
        utils.scrollToX(
          scroll_speed,
          ((_d2 = (_c2 = sortedActiveChildren[index]) == null ? void 0 : _c2.offsetLeft) != null ? _d2 : 0) - +getComputedStyle(container).scrollPaddingLeft.replace("px", "").replace("auto", "0"),
          container,
          () => {
            container.style.scrollSnapType = "";
            calculatePosition();
            if (content_slider == null ? void 0 : content_slider.state) {
              content_slider.state.block_scroll_events = false;
              content_slider == null ? void 0 : content_slider.handleScroll();
              content_slider == null ? void 0 : content_slider.handleInfiniteScroll();
            }
          }
        );
      }
      if (!state.horizontal) {
        utils.scrollToY(
          scroll_speed,
          ((_f2 = (_e2 = sortedActiveChildren[index]) == null ? void 0 : _e2.offsetTop) != null ? _f2 : 0) - +getComputedStyle(container).scrollPaddingTop.replace("px", "").replace("auto", "0"),
          container,
          () => {
            container.style.scrollSnapType = "";
            calculatePosition();
            if (content_slider == null ? void 0 : content_slider.state) {
              content_slider.state.block_scroll_events = false;
              content_slider == null ? void 0 : content_slider.handleScroll();
              content_slider == null ? void 0 : content_slider.handleInfiniteScroll();
            }
          }
        );
      }
    }, "handlePrevClick");
    const handleNextClick = /* @__PURE__ */ __name((e, content_slider) => {
      var _a3, _b2, _c2, _d2, _e2;
      if (!container) return;
      container.style.scrollSnapType = "none";
      if (content_slider == null ? void 0 : content_slider.state) {
        content_slider.state.block_scroll_events = true;
      }
      const activeChildren = (_b2 = [...(_a3 = container == null ? void 0 : container.children) != null ? _a3 : []]) == null ? void 0 : _b2.filter(
        (child) => getComputedStyle(child).display !== "none" && getComputedStyle(child).scrollSnapAlign !== "none" && child.tagName !== "STYLE"
      );
      const sortedActiveChildren = activeChildren == null ? void 0 : activeChildren.toSorted((a, b) => +getComputedStyle(a).order - +getComputedStyle(b).order);
      let found = false;
      const target = (_c2 = sortedActiveChildren.find((el) => {
        if (found) {
          el.classList.add("scroll-active");
          return true;
        }
        if (el.classList.contains("scroll-active")) {
          el.classList.remove("scroll-active");
          found = true;
        }
        return false;
      })) != null ? _c2 : sortedActiveChildren[1];
      if (state.horizontal) {
        utils.scrollToX(
          scroll_speed,
          ((_d2 = target == null ? void 0 : target.offsetLeft) != null ? _d2 : 0) - +getComputedStyle(container).scrollPaddingLeft.replace("px", "").replace("auto", "0"),
          container,
          () => {
            container.style.scrollSnapType = "";
            calculatePosition();
            if (content_slider == null ? void 0 : content_slider.state) {
              content_slider.state.block_scroll_events = false;
              content_slider == null ? void 0 : content_slider.handleScroll();
              content_slider == null ? void 0 : content_slider.handleInfiniteScroll();
            }
          }
        );
      }
      if (!state.horizontal) {
        utils.scrollToY(
          scroll_speed,
          ((_e2 = target == null ? void 0 : target.offsetTop) != null ? _e2 : 0) - +getComputedStyle(container).scrollPaddingTop.replace("px", "").replace("auto", "0"),
          container,
          () => {
            container.style.scrollSnapType = "";
            calculatePosition();
            if (content_slider == null ? void 0 : content_slider.state) {
              content_slider.state.block_scroll_events = false;
              content_slider == null ? void 0 : content_slider.handleScroll();
              content_slider == null ? void 0 : content_slider.handleInfiniteScroll();
            }
          }
        );
      }
    }, "handleNextClick");
    container == null ? void 0 : container.addEventListener("scroll", (e) => {
      calculatePosition();
    });
    const mutationObserver = new MutationObserver((e) => {
      calculatePosition();
    });
    mutationObserver.observe(container, {
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"]
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
      containerRef: container
    };
  }, "init"),
  initScrollPagination: /* @__PURE__ */ __name(($el, container) => {
    var _a2, _b, _c;
    const findScrollContainer = /* @__PURE__ */ __name((element) => {
      var _a3;
      return ((_a3 = element == null ? void 0 : element.parentElement) == null ? void 0 : _a3.querySelector('[x-ref="scrollContainer"]')) || findScrollContainer(element.parentElement);
    }, "findScrollContainer");
    if ($el && !container) {
      container = findScrollContainer($el);
    }
    const content_slider = (_c = (_b = (_a2 = container == null ? void 0 : container.closest('[x-data*="initContentSlider"]')) == null ? void 0 : _a2._x_dataStack) == null ? void 0 : _b.find((state) => state["content_slider"])) == null ? void 0 : _c.content_slider;
    return {
      containerRef: container,
      content_slider: content_slider != null ? content_slider : {}
    };
  }, "initScrollPagination")
};
window._scrollbar = _scrollbar;

// assets/smooth-scroll.ts
var initSmoothScroll = /* @__PURE__ */ __name(() => {
  const elements = /* @__PURE__ */ new Set();
  const scrollToElementByTargetId = /* @__PURE__ */ __name((id) => {
    var _a2, _b, _c, _d, _e, _f;
    let target = document.getElementById(id);
    if (!target) {
      return;
    }
    if (utils.isElementScrollable(target.parentElement) && utils.isVisible(target.parentElement) && utils.isInViewport(target)) {
      if (target.parentElement.scrollWidth > target.parentElement.offsetWidth) {
        utils.scrollToXY(260, target.offsetLeft, (_a2 = target.parentElement) == null ? void 0 : _a2.scrollTop, target.parentElement);
      }
      if (target.parentElement.scrollHeight > target.parentElement.offsetHeight) {
        utils.scrollToXY(260, (_b = target.parentElement) == null ? void 0 : _b.scrollLeft, target.offsetTop, target.parentElement);
      }
      return;
    }
    if (target.hasAttribute("data-tab-id")) {
      target = target.closest(".shopify-section");
    }
    const targetPosition = ((_c = utils.getElementPosition(target)) == null ? void 0 : _c.top) - Math.max(70, (_f = (_e = (_d = document.querySelector(".header-sections-container")) == null ? void 0 : _d.getBoundingClientRect()) == null ? void 0 : _e.bottom) != null ? _f : 0);
    utils.scrollToY(70 + Math.min(Math.abs(Math.round((window.scrollY - targetPosition) / 15)), 500), targetPosition);
  }, "scrollToElementByTargetId");
  const initEvents = /* @__PURE__ */ __name((target = document) => {
    const links = target.querySelectorAll(
      `:where([href*="#"],[data-href*="#"]):not([href*="#modal--"], [href*="#popup--"], [href*="#drawer--"], use)`
    );
    links.forEach((link) => {
      var _a2, _b, _c, _d;
      const href = (_a2 = link.href) != null ? _a2 : link.getAttribute("data-href");
      if (typeof href !== "string") return;
      if (elements.has(link)) return;
      elements.add(link);
      if (utils.isExternalURL(href)) return;
      const id = (_d = (_c = (_b = href == null ? void 0 : href.split("#")) == null ? void 0 : _b.at(1)) == null ? void 0 : _c.split(/[?&]/)) == null ? void 0 : _d.at(0);
      const target2 = document.getElementById(id);
      if (!target2) return;
      link.addEventListener(
        "click",
        (e) => {
          e.stopPropagation();
          scrollToElementByTargetId(id);
        },
        { capture: true }
      );
    });
  }, "initEvents");
  const mutationObserver = new MutationObserver((e) => {
    e == null ? void 0 : e.forEach((record) => {
      var _a2;
      const nodes = [];
      if (((_a2 = record == null ? void 0 : record.addedNodes) == null ? void 0 : _a2.length) && (record == null ? void 0 : record.target) instanceof Element) {
        initEvents(record.target);
      }
    });
  });
  mutationObserver.observe(document.body, { childList: true, subtree: true });
  if (window.location.hash) {
    scrollToElementByTargetId(window.location.hash.replace(/#/gi, ""));
  }
  initEvents();
}, "initSmoothScroll");

// assets/toast.ts
var initToast = /* @__PURE__ */ __name(() => {
  window.Alpine.store("toast", {
    toasts: [],
    paused: false,
    interval: null,
    addToast: /* @__PURE__ */ __name(function({ type = "plain", target = "generic", timestamp = Date.now(), title, content, icon, hide = 0 }) {
      const defaultIcon = {
        plain: "bolt",
        warning: "warning-triangle",
        error: "error-circle",
        info: "info-circle",
        success: "check-circle"
      }[type];
      this.toasts.push({
        type,
        target,
        timestamp,
        title,
        content,
        icon: icon || defaultIcon,
        hide
      });
      this.toasts = this.toasts.filter((a, i, arr) => arr.findIndex((b) => a.title === b.title && a.content === b.content) === i);
    }, "addToast"),
    removeAllToasts: /* @__PURE__ */ __name(function() {
      this.toasts = [];
    }, "removeAllToasts"),
    pauseRemoval: /* @__PURE__ */ __name(function() {
      this.paused = true;
      clearInterval(this.interval);
      this.interval = null;
    }, "pauseRemoval"),
    continueRemoval: /* @__PURE__ */ __name(function() {
      this.paused = false;
    }, "continueRemoval")
  });
  const toastStore = window.Alpine.store("toast");
  window.Alpine.magic("toast", () => toastStore);
  window.Alpine.effect(() => {
    if (toastStore.toasts.length && !toastStore.interval && !toastStore.paused) {
      toastStore.interval = setInterval(() => {
        const checkTimestamp = Date.now() - 4e3;
        toastStore.toasts = toastStore.toasts.map((toast) => ({
          ...toast,
          hide: toast.timestamp < checkTimestamp ? Date.now() : 0
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
}, "initToast");

// assets/tooltip.ts
var initTooltip = /* @__PURE__ */ __name(() => {
  const container = document.querySelector("[data-tooltip-container]");
  window.Alpine.store("tooltip", {
    tooltips: /* @__PURE__ */ new Map(),
    async addTooltip(element, content, position = "top") {
      const currentTooltip = this.tooltips.get(element);
      if (!currentTooltip) {
        const parents = utils.findAllScrollableParents(element);
        const tooltipElement = document.createElement("div");
        tooltipElement.innerHTML = content;
        const handleUpdateCoordinates = /* @__PURE__ */ __name(() => {
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
        }, "handleUpdateCoordinates");
        this.tooltips.set(element, {
          tooltip: tooltipElement,
          timeout: null,
          handleUpdateCoordinates,
          scrollParents: parents
        });
        container.appendChild(tooltipElement);
        tooltipElement.classList.add("tooltip", `tooltip--${position}`);
        await utils.delay(1);
        handleUpdateCoordinates();
        parents.forEach((parent) => {
          parent.addEventListener("scroll", handleUpdateCoordinates);
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
        const tooltip = currentTooltip.tooltip;
        currentTooltip.timeout = setTimeout(async () => {
          tooltip.classList.remove("active");
          this.tooltips.delete(element);
          tooltip.ontransitionend = (event) => {
            tooltip.remove();
          };
        }, 50);
      }
    }
  });
  const tooltipStore = window.Alpine.store("tooltip");
  window.Alpine.magic("tooltip", () => tooltipStore);
  window._stores["tooltip"] = tooltipStore;
}, "initTooltip");

// assets/theme.ts
window.utils = utils_default;
document.dispatchEvent(new CustomEvent("theme:utils:loaded"));
(() => {
  window.onerror = function(...args) {
    return (args == null ? void 0 : args[0]) === "Script error.";
  };
  window.onunhandledrejection = function(event) {
    console.warn("\u{1F6A8} Unhandled Promise Rejection:", event.reason);
  };
  const origConsoleWarn = console.warn;
  window.console.warn = function(...args) {
    var _a2;
    if ((_a2 = args == null ? void 0 : args[0]) == null ? void 0 : _a2.includes("Alpine Expression Error")) {
      const [message, ...rest] = args;
      console.error(
        `%cAlpine JS Error:%c 

${message == null ? void 0 : message.replaceAll("\n\n", "\n")}
`,
        "color: red; font-size: 17px; font-weight: 600;",
        "font-weight: 600; font-size: 14px;",
        ...rest
      );
      return;
    }
    return origConsoleWarn.apply(this, args);
  };
})();
var initTheme = /* @__PURE__ */ __name(() => {
  window.Alpine.store("editor", {
    load_section_id: "",
    unload_section_id: "",
    select_section_id: "",
    reorder_section_id: "",
    select_block_id: "",
    inspector: false,
    setValue(key, value) {
      this[key] = value;
    }
  });
  const editor = window.Alpine.store("editor");
  window.Alpine.magic("editor", () => editor);
  initTabsStore();
  initModals();
  initAccessibility();
  initQuickView();
  initCart();
  initProductData();
  initScrollBar();
  initTextarea();
  initTooltip();
  initToast();
  initSearch();
  initMediaGallery();
  initSmoothScroll();
  initPageTransitions();
  initPagination();
  initScrollProgress();
  initCSSAutoPrefixer();
  if (window.design_mode) {
    document.dispatchEvent(new CustomEvent("theme:editor:init"));
  }
  document.dispatchEvent(new CustomEvent("theme:init"));
}, "initTheme");
document.addEventListener("alpine:init", initTheme);
export {
  initTheme
};
