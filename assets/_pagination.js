export const initPagination = () => {};

export const _pagination = {
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
