export const _page = {
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
