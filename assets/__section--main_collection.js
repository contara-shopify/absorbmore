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
