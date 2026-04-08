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
