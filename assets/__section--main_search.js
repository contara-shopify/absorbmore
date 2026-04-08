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
