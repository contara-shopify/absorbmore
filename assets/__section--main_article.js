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
