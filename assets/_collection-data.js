export const _collection = {
  getHtmlCollection: (handle) => {
    const collection = utils.JSONParse(document.querySelector(`[data-collection-data="${handle}"]`)?.innerHTML);

    if (collection) {
      _collections[handle] = {
        ...(_collections[handle] ?? {}),
        ...collection,
      };
      _collection.saveCollection(handle);
      return _collections[handle];
    }
    return null;
  },
  getCachedCollection: async (handle) => {
    const dbKey = `_${window.Shopify.theme.id}-collection--${handle}`;
    const collection = await idbKeyval.get(dbKey);

    if (collection) {
      _collections[handle] = {
        ...(_collections[handle] ?? {}),
        ...collection,
      };
      return _collections[handle];
    }

    return null;
  },
  getFetchCollection: async (handle) => {
    try {
      const collection = await fetch(`/collections/${handle}`)
        .then((res) => res.text())
        .then((text) => {
          const html = document.createElement("div");
          html.innerHTML = text;

          return utils.JSONParse(html.querySelector("[data-collection-data]")?.innerHTML ?? "{}");
        });

      if (collection) {
        _collections[handle] = {
          ...(_collections[handle] ?? {}),
          ...collection,
        };
        return _collections[handle];
      }
      return null;
    } catch (err) {
      return null;
    }
  },
  saveCollection: (handle, dataOverride = undefined) => {
    _collections[handle] = {
      ...(_collections[handle] ?? {}),
      ...(dataOverride ?? {}),
    };

    if (_collections[handle]) {
      const dbKey = `_${window.Shopify.theme.id}-collection--${handle}`;
      requestIdleCallback(
        async () => {
          await idbKeyval.set(dbKey, _collections[handle]);
        },
        { timeout: 5000 }
      );
      return _collections[handle];
    }
    return null;
  },
  getCollectionData: async (handle) => {
    if (!_collections[handle]) {
      _collection.getHtmlCollection(handle);
    }
    if (!_collections[handle]) {
      await _collection.getCachedCollection(handle);
    }
    if (!_collections[handle]) {
      await _collection.getFetchCollection(handle);
    }
    if (!_collections[handle]) {
      return null;
    }
    _collection.saveCollection(handle);
    return _collections[handle];
  },
};

window._collection = _collection;

/* LAST HASH: 20b230aa9864d274dd140023e8af7be515695ad4 */
