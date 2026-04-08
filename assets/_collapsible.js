export const initCollapsible = ($el, container, defaultOpen = false) => {
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
