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
