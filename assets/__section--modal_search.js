const initSearchModal = ($el, modalId) => {
  const {
    limit = 10,
    limit_type = "each",
    unavailable_products = "last",
    author = false,
    body = false,
    product_type = true,
    tag = false,
    title = true,
    variants_barcode = false,
    variants_sku = false,
    variants_title = true,
    vendor = true,
  } = utils.JSONParse($el.getAttribute("data-settings") ?? "{}");

  const modal = window.Alpine.store("modal");
  const search = window.Alpine.store("search");

  const searchTypes = [...($el.querySelectorAll("[data-predictive-search-type]") ?? [])]?.map((container) =>
    container.getAttribute("data-predictive-search-type"),
  );

  const initialSuggestions = [...$el.querySelectorAll("[data-search-suggestion]")]?.map((el) => el?.textContent);

  const state = window.Alpine.reactive({
    loading: false,
    fetching: false,
    initialized: false,
    last_query: "",
    query_count: 0,
    product_count: 0,
    collection_count: 0,
    article_count: 0,
    page_count: 0,
    products: [],
    collections: [],
    articles: [],
    pages: [],
    queries: [],
    active_query: initialSuggestions[0] ?? "",
    history_data: utils.JSONParse(
      sessionStorage.getItem(`_platter---cached-search-${limit}-${limit_type}-${searchTypes.join(",")}`) ?? "{}",
    ),
    data_products: new Map(),
    data_collections: new Map(),
    data_articles: new Map(),
    data_pages: new Map(),
    fetching_queries: new Map(),
    suggestions_fetched: false,
  });

  const fetchSearchResults = async (query = "") => {
    if (state.history_data[query]) return;
    try {
      if (state.fetching_queries.has(query)) {
        await state.fetching_queries.get(query);
        return;
      }

      const searchRequest = fetch(
        `${Shopify.routes.root}search/suggest?section_id=data_predictive_search&q=${query}&resources[type]=${searchTypes
          .filter((k) => k !== "query")
          .join(
            ","
          )}&resources[limit_scope]=${limit_type}&resources[limit]=${limit}&resources[options][unavailable_products]=${unavailable_products}&resources[options][fields]=${Object.entries(
          {
            author,
            body,
            product_type,
            tag,
            title,
            "variants.barcode": variants_barcode,
            "variants.sku": variants_sku,
            "variants.title": variants_title,
            vendor,
          }
        )
          .filter(([_, val]) => !!val)
          .map(([key]) => key)
          .join(",")}`
      )
        .then((response) => response.text())
        .then((results) => {
          const div = document.createElement("div");
          div.innerHTML = results;
          return utils.JSONParse(div.querySelector("[data-predictive-search]").innerHTML);
        });

      state.fetching_queries.set(query, searchRequest);

      const search_results = await searchRequest;

      if (!search_results) return;

      state.history_data[query] = {
        product_count: search_results?.product_count ?? 0,
        collection_count: search_results?.collection_count ?? 0,
        article_count: search_results?.article_count ?? 0,
        page_count: search_results?.page_count ?? 0,
        products:
          search_results?.products?.map((entry) => {
            if (!_products[entry.handle]) {
              _product.saveProduct(entry.handle, entry);
            }
            state.data_products.set(entry.handle, entry);
            return [entry.handle, entry.id];
          }) ?? [],
        collections:
          search_results?.collections?.map((entry) => {
            if (!_collections[entry.handle]) {
              _collection.saveCollection(entry.handle, entry);
            }
            state.data_collections.set(entry.handle, entry);
            return entry.handle;
          }) ?? [],
        articles:
          search_results?.articles?.map((entry) => {
            if (!_articles[entry.handle]) {
              _article.saveArticle(entry.handle, entry);
            }
            state.data_articles.set(entry.handle, entry);
            return entry.handle;
          }) ?? [],
        pages:
          search_results?.pages?.map((entry) => {
            if (!_pages[entry.handle]) {
              _page.savePage(entry.handle, entry);
            }
            state.data_pages.set(entry.handle, entry);
            return entry.handle;
          }) ?? [],
      };
      requestIdleCallback(() => {
        sessionStorage.setItem(
          `_platter---cached-search-${limit}-${limit_type}-${searchTypes.join(",")}`,
          JSON.stringify(state.history_data)
        );
      });
    } catch (err) {
      state.fetching_queries.delete(query);
    }
  };

  const debounceSearch = window.Alpine.debounce(async (query = "") => {
    if (state.fetching) return;

    state.fetching = true;

    await fetchSearchResults(query);

    state.fetching = false;
    state.loading = false;
  }, 300);

  const debounceSearchQuery = window.Alpine.debounce(async (query = "") => {
    const suggestions = await fetch(
      `${Shopify.routes.root}search/suggest.json?q=${query}&resources[type]=query&resources[limit_scope]=each`
    ).then((res) => res.json());

    state.queries = [
      {
        text: query,
        styled_text: `<mark>${query}</mark>`,
        url: `/search?q=${query}`,
        manual_input: true,
      },
      ...(suggestions?.resources?.results?.queries ?? []),
    ]?.filter((a, i, arr) => (arr.findIndex((b) => b.text === a.text) === i && !a.manual_input) || i === 0);
    state.active_query = query;
    state.query_count = state.queries.length;
  }, 100);

  const getDynamicText = (content) => {
    return utils.getBracketInputDynamicPluralizedText(content, {
      search: {
        terms: state.active_query,
        query: state.active_query,
        results_count: state.product_count + state.collection_count + state.article_count + state.page_count,
        count: state.product_count + state.collection_count + state.article_count + state.page_count,
        ...state,
      },
    });
  };

  const getDynamicValue = (content) => {
    return utils.getBracketInputDynamicValue(content, {
      search: {
        terms: state.active_query,
        query: state.active_query,
        results_count: state.product_count + state.collection_count + state.article_count + state.page_count,
        count: state.product_count + state.collection_count + state.article_count + state.page_count,
        ...state,
      },
    });
  };

  const getDynamicValueWithFallbacks = (content) => {
    return content.split(",")?.reduce((acc, item) => {
      acc ||= utils.getBracketInputDynamicValue(item.trim(), {
        search: {
          terms: state.active_query,
          query: state.active_query,
          results_count: state.product_count + state.collection_count + state.article_count + state.page_count,
          count: state.product_count + state.collection_count + state.article_count + state.page_count,
          ...state,
        },
      });
      return acc;
    }, "");
  };

  const showConditionally = (show_conditionally) => {
    if (!show_conditionally) {
      return true;
    }
    switch (show_conditionally) {
      case "no_search_query":
        return !search.query;
      case "with_search_query":
        return !!search.query;
      case "always":
        return true;
      case "search_empty":
        return !state.loading && state.product_count + state.collection_count + state.article_count + state.page_count <= 0;
      case "items_found":
        return state.product_count + state.collection_count + state.article_count + state.page_count >= 1;
    }
  };

  Alpine.effect(() => {
    if (!search.query) {
      state.queries = [];
      state.active_query = initialSuggestions[0] ?? "";
    }

    if (search.query && search.query !== state.last_query) {
      state.last_query = search.query;
      state.queries = [
        {
          text: search.query,
          styled_text: `<mark>${search.query}</mark>`,
          url: `/search?q=${search.query}`,
          manual_input: true,
        },
        ...state.queries,
      ]?.filter((a, i, arr) => (arr.findIndex((b) => b.text === a.text) === i && !a.manual_input) || i === 0);
      state.active_query = search.query;

      debounceSearchQuery(search.query);

      if (state.history_data[search.query]) {
        state.fetching = false;
        state.loading = false;
        return;
      }

      state.loading = true;
      debounceSearch(search.query);
    }
  });

  Alpine.effect(async () => {
    if (state.active_query && state.history_data[state.active_query] && state.initialized) {
      state.product_count = state.history_data[state.active_query].product_count ?? 0;
      state.collection_count = state.history_data[state.active_query].collection_count ?? 0;
      state.article_count = state.history_data[state.active_query].article_count ?? 0;
      state.page_count = state.history_data[state.active_query].page_count ?? 0;
      state.products = state.history_data[state.active_query].products.map(([handle]) => state.data_products.get(handle));
      state.collections = state.history_data[state.active_query].collections.map((handle) => state.data_collections.get(handle));
      state.articles = state.history_data[state.active_query].articles.map((handle) => state.data_articles.get(handle));
      state.pages = state.history_data[state.active_query].pages.map((handle) => state.data_pages.get(handle));
    }
    if (state.active_query && !state.history_data[state.active_query]) {
      fetchSearchResults(state.active_query);
    }
  });

  if (Object.keys(state.history_data) && !state.initialized) {
    const handles = Object.values(state.history_data)?.reduce(
      (acc, entry, i, arr) => {
        entry.products.forEach(([handle, id]) => {
          acc.products.set(handle, [handle, id]);
        });
        entry.collections.forEach((handle) => {
          acc.collections.add(handle);
        });
        entry.pages.forEach((handle) => {
          acc.pages.add(handle);
        });
        entry.articles.forEach((handle) => {
          acc.articles.add(handle);
        });
        return acc;
      },
      {
        products: new Map(),
        collections: new Set(),
        pages: new Set(),
        articles: new Set(),
      }
    );

    Promise.allSettled(
      [
        [...handles.products.values()].map(([handle, id]) =>
          _products[handle]
            ? state.data_products.set(handle, _products[handle])
            : _product.getProductData(handle, id).then((data) => state.data_products.set(handle, data))
        ),
        [...handles.collections.keys()].map((handle) =>
          _collections[handle]
            ? state.data_collections.set(handle, _collections[handle])
            : _collection.getCollectionData(handle).then((data) => state.data_collections.set(handle, data))
        ),
        [...handles.pages.keys()].map((handle) =>
          _pages[handle]
            ? state.data_pages.set(handle, _pages[handle])
            : _page.getPageData(handle).then((data) => state.data_pages.set(handle, data))
        ),
        [...handles.articles.keys()].map((handle) =>
          _articles[handle]
            ? state.data_articles.set(handle, _articles[handle])
            : _article.getArticleData(handle).then((data) => state.data_articles.set(handle, data))
        ),
      ].flat()
    ).finally(() => {
      state.initialized = true;
    });
  }

  Alpine.effect(() => {
    if (!state.suggestions_fetched && modalId && (modal.id === modalId || modal.sub_id === modalId)) {
      state.suggestions_fetched = true;
      Promise.allSettled(initialSuggestions.map(fetchSearchResults));
    }
  });

  return {
    search_modal: {
      state,
      showConditionally,
      getDynamicText,
      getDynamicValue,
      getDynamicValueWithFallbacks,
      debounceSearch,
      debounceSearchQuery,
    },
  };
};

window._sections["initSearchModal"] = initSearchModal;

/* LAST HASH: 71faf256a8f9e8ff268f305845c72b36f3e2d5f9 */
