export const _article = {
  getHtmlArticle: (handle) => {
    const article = utils.JSONParse(document.querySelector(`[data-article-data="${handle}"]`)?.innerHTML);

    if (article) {
      _articles[handle] = {
        ...(_articles[handle] ?? {}),
        ...article,
      };
      _article.saveArticle(handle);
      return _articles[handle];
    }
    return null;
  },
  getCachedArticle: async (handle) => {
    const dbKey = `_${window.Shopify.theme.id}-article--${handle}`;
    const article = await idbKeyval.get(dbKey);

    if (article) {
      _articles[handle] = {
        ...(_articles[handle] ?? {}),
        ...article,
      };
      return _articles[handle];
    }

    return null;
  },
  getFetchArticle: async (handle) => {
    try {
      const article = await fetch(`/blogs/${handle}`)
        .then((res) => res.text())
        .then((text) => {
          const html = document.createElement("div");
          html.innerHTML = text;

          return utils.JSONParse(html.querySelector("[data-article-data]")?.innerHTML ?? "{}");
        });

      if (article) {
        _articles[handle] = {
          ...(_articles[handle] ?? {}),
          ...article,
        };
        return _articles[handle];
      }
      return null;
    } catch (err) {
      return null;
    }
  },
  saveArticle: (handle, dataOverride = undefined) => {
    _articles[handle] = {
      ...(_articles[handle] ?? {}),
      ...(dataOverride ?? {}),
    };

    if (_articles[handle]) {
      const dbKey = `_${window.Shopify.theme.id}-article--${handle}`;
      requestIdleCallback(
        async () => {
          await idbKeyval.set(dbKey, _articles[handle]);
        },
        { timeout: 5000 }
      );
      return _articles[handle];
    }
    return null;
  },
  getArticleData: async (handle) => {
    if (!_articles[handle]) {
      _article.getHtmlArticle(handle);
    }
    if (!_articles[handle]) {
      await _article.getCachedArticle(handle);
    }
    if (!_articles[handle]) {
      await _article.getFetchArticle(handle);
    }
    if (!_articles[handle]) {
      return null;
    }
    _article.saveArticle(handle);
    return _articles[handle];
  },
};

window._article = _article;

/* LAST HASH: 19afe50c89fc87a07638f1493ae8c98d28b100e9 */
