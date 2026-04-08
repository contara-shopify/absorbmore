export const initModals = () => {
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
