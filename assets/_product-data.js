export const _product = {
  getHtmlProduct: (handle) => {
    const product = utils.JSONParse(
      document.querySelector(`[data-primary-product-data="${handle}"]`)?.innerHTML ??
        document.querySelector(`[data-product-data="${handle}"]`)?.innerHTML
    );

    if (product) {
      _products[handle] = {
        _recommendations_loaded_at: 0,
        complementary_products: [],
        related_products: [],
        ...(_products[handle] ?? {}),
        ...(product?._full_data ? product : _products[handle]?._full_data ? _products[handle] : product),
        _updated_at: Date.now(),
      };
      if (!_products[handle]?._full_data) {
        const dbKey = `_${window.Shopify.theme.id}-product--${handle}`;

        idbKeyval.get(dbKey).then((dbProduct) => {
          if (dbProduct?._full_data) {
            _products[handle] = {
              ...(_products[handle] ?? {}),
              ...dbProduct,
              _updated_at: Date.now(),
            };
            _product.saveProduct(handle);
          }
        });
      }
      _product.saveProduct(handle);

      return _products[handle];
    }
    return null;
  },
  getCachedProduct: async (handle) => {
    const dbKey = `_${window.Shopify.theme.id}-product--${handle}`;

    try {
      if (!window._cached_products.has(handle)) {
        window._cached_products.set(
          handle,
          idbKeyval.get(dbKey).then((product) => {
            if (!product) return null;

            _products[handle] = {
              ...(_products[handle] ?? {}),
              ...(product?._full_data ? product : _products[handle]?._full_data ? _products[handle] : product),
            };

            if (product && (product._updated_at ?? 0) < Date.now() - 1000 * 60 * 15) {
              _product.getFetchProduct(handle, product.id, "low");
            }
            return _products[handle];
          })
        );
      }

      return await window._cached_products.get(handle);
    } catch (err) {
      return null;
    }
  },
  getFetchProduct: async (handle, productId, priority = "auto") => {
    if (!productId) return null;

    try {
      if (!window._fetch_products.has(handle)) {
        window._fetch_products.set(
          handle,
          fetch(
            `/recommendations/products?product_id=${productId}&limit=10&section_id=data_product_json&intent=related&with_product_data=true`,
            { priority: priority }
          )
            .then((res) => {
              if (res.status === 404) {
                window._recent_products = window._recent_products.filter((recent_product) => recent_product[0] !== handle) ?? [];
                localStorage?.setItem("_recent_products_storage", JSON.stringify(window._recent_products));
                return null;
              }
              return res.text();
            })
            .then((text) => {
              const html = document.createElement("div");
              html.innerHTML = text;

              const product = utils.JSONParse(html.querySelector("[data-product-data]")?.innerHTML ?? "{}");
              product.related_products = utils.JSONParse(html.querySelector("[data-product-recommendations]")?.innerHTML ?? "[]");

              requestIdleCallback(
                async () => {
                  [...(product.related_products ?? [])]
                    .filter((a, i, arr) => arr.findIndex((b) => a.handle === b.handle) === i)
                    .map(async (product) => {
                      const dbKey = `_${window.Shopify.theme.id}-product--${product.handle}--${window.theme_settings.development__cache_version}`;
                      _products[product.handle] = {
                        _recommendations_loaded_at: 0,
                        related_products: [],
                        complementary_products: [],
                        ...(_products[product.handle] ?? ((await idbKeyval.get(dbKey)) || {})),
                        ...(product?._full_data
                          ? product
                          : _products[product.handle]?._full_data
                          ? _products[product.handle]
                          : product),
                        _updated_at: Date.now(),
                      };
                      idbKeyval.set(dbKey, _products[product.handle]);
                      if (_products[product.handle]?._full_data) {
                        sessionStorage.setItem(dbKey, "1");
                      }
                    });
                },
                { timeout: 5000 }
              );

              product._recommendations_loaded_at = Date.now();
              return product;
            })
        );
      }

      const product = await window._fetch_products.get(handle);

      if (product) {
        _products[handle] = {
          complementary_products: [],
          ...(_products[handle] ?? {}),
          ...(product?._full_data ? product : _products[handle]?._full_data ? _products[handle] : product),
          _recommendations_loaded_at: product._recommendations_loaded_at,
          related_products: product.related_products,
          _updated_at: Date.now(),
        };
        _product.saveProduct(handle);
        return _products[handle];
      }
      return null;
    } catch (err) {
      return null;
    }
  },
  saveProduct: (handle, dataOverride = undefined) => {
    _products[handle] = {
      ...(_products[handle] ?? {}),
      ...(dataOverride ?? {}),
    };

    const product = _products[handle];
    if (!product) return null;

    const dbKey = `_${window.Shopify.theme.id}-product--${handle}`;

    const nextSeq = (window._save_product_sequence.get(handle) ?? 0) + 1;
    window._save_product_sequence.set(handle, nextSeq);

    if (window._save_product_schedule.has(handle)) {
      return product;
    }

    window._save_product_schedule.add(handle);

    requestIdleCallback(
      async () => {
        try {
          // eslint-disable-next-line no-constant-condition
          while (true) {
            const sequence_before = window._save_product_sequence.get(handle) ?? 0;
            const latest = _products[handle];
            await idbKeyval.set(dbKey, latest);

            const sequence_after = window._save_product_sequence.get(handle) ?? 0;
            if (sequence_after === sequence_before) {
              break;
            }
          }
        } finally {
          window._save_product_schedule.delete(handle);
        }
      },
      { timeout: 5000 }
    );

    return product;
  },
  getHydratedProductData: async (handle, productId, priority = "auto") => {
    if (!_products[handle]?.handle || (_products[handle]?._recommendations_loaded_at ?? 0) < Date.now() - 1000 * 60 * 30) {
      _product.getHtmlProduct(handle);
    }
    if (!_products[handle]?.handle || (_products[handle]?._recommendations_loaded_at ?? 0) < Date.now() - 1000 * 60 * 30) {
      await _product.getCachedProduct(handle);
    }
    if (!_products[handle]?.handle || (_products[handle]?._recommendations_loaded_at ?? 0) < Date.now() - 1000 * 60 * 30) {
      await _product.getFetchProduct(handle, productId || _products[handle]?.id, priority);
    }
    if (!_products[handle]?.handle || (_products[handle]?._recommendations_loaded_at ?? 0) < Date.now() - 1000 * 60 * 30) {
      return null;
    }

    return _products[handle];
  },
  getProductData: async (handle, productId, priority = "auto") => {
    if (!_products[handle]?.handle) {
      _product.getHtmlProduct(handle);
      // console.warn("html", _products[handle]);
    }
    if (!_products[handle]?.handle) {
      await _product.getCachedProduct(handle);
      // console.warn("cache", _products[handle]);
    }
    if (!_products[handle]?.handle) {
      await _product.getFetchProduct(handle, productId, priority);
      // console.warn("fetch", _products[handle]);
    }
    if (!_products[handle]?.handle) {
      return null;
    }
    return _products[handle];
  },
  initDynamicProductCards: async (
    $el,
    {
      targeting_type,
      target_product_handle,
      target_product_id,
      primary_source,
      fallback_source,
      product_class,
      desktop_display_limit = 50,
      mobile_display_limit = 50,
      addon_products,
      addon_auto_add,
      addon_bundle_in_cart,
      addon_target_product,
      hide_if_empty,
      handleResize = () => {},
      order_offset = 1,
      section_id,
      filter_by_type = "",
      hide_out_of_stock = false,
      block_id,
    }
  ) => {
    const container = $el.parentElement;

    const limit = Math.max(desktop_display_limit, mobile_display_limit);

    const product =
      utils.JSONParse(document.querySelector(`[data-product-data="${target_product_handle}"]`)?.innerHTML) ??
      (await _product.getHydratedProductData(target_product_handle, target_product_id));

    const fallback_products_source = utils.JSONParse($el.getAttribute(`data-fallback-products`) ?? "[]");

    let sourceNode = document.querySelector(`[data-product-card='${product_class}']`);

    if (!sourceNode && !window.modalsLoaded) {
      await new Promise((resolve) => {
        document.addEventListener(
          "modalsLoaded",
          () => {
            sourceNode = document.querySelector(`[data-product-card='${product_class}']`);
            resolve(true);
          },
          { once: true }
        );
      });
    }

    const cart = window.Alpine.store("cart");
    const modal = window.Alpine.store("modal");
    const editor = window.Alpine.store("editor");

    const state = window.Alpine.reactive({
      product: product,
    });

    const renderDynamicProductCards = async () => {
      handleResize();
      setTimeout(handleResize, 50);

      const lineItemProducts = /^cart_/gi.test(targeting_type)
        ? await Promise.all(cart.state.items?.map((item) => _product.getHydratedProductData(item.handle, item.product_id)))
        : [];

      const recentlyViewedProducts = /^recently_viewed_/gi.test(targeting_type)
        ? await Promise.all(_recent_products?.map(([handle, product_id]) => _product.getHydratedProductData(handle, product_id)))
        : [];

      const products = [];
      const complementary_products = [];
      const related_products = [];

      switch (targeting_type) {
        case "product": {
          state.product?.complementary_products?.forEach((item) => {
            if (hide_out_of_stock && !item.available) return;
            if (item?.metafields?.seo?.hidden) return;
            if (item.id !== state.product?.id) {
              complementary_products.push(item);
            }
          });
          state.product?.related_products?.forEach((item) => {
            if (hide_out_of_stock && !item.available) return;
            if (item.id !== state.product?.id) {
              related_products.push(item);
            }
          });
          break;
        }
        case "recently_viewed_ai": {
          const expensive = [...recentlyViewedProducts].sort((a, b) => b.price - a.price).slice(0, 3);
          const recent = recentlyViewedProducts.slice(0, 2).sort((a, b) => b.price - a.price);

          [...recent, ...expensive]?.forEach((product, parentIndex) => {
            product?.complementary_products?.forEach((item, i) => {
              if (hide_out_of_stock && !item.available) return;
              if (item?.metafields?.seo?.hidden) return;
              if (i >= 2 || (i >= 1 && parentIndex >= 2)) {
                return;
              }
              complementary_products.push(item);
            });
            product?.related_products?.forEach((item, i) => {
              if (hide_out_of_stock && !item.available) return;
              if (item?.metafields?.seo?.hidden) return;
              if (i >= 2 || (i >= 1 && parentIndex >= 2)) {
                return;
              }
              related_products.push(item);
            });
          });
          break;
        }
        case "recently_viewed_most_expensive": {
          [...recentlyViewedProducts]
            .sort((a, b) => b.price - a.price)
            ?.forEach((product, parentIndex) => {
              product?.complementary_products?.forEach((item, i) => {
                if (hide_out_of_stock && !item.available) return;
                if (item?.metafields?.seo?.hidden) return;
                if (i >= 2 || (i >= 1 && parentIndex >= 2)) {
                  return;
                }
                complementary_products.push(item);
              });
              product?.related_products?.forEach((item, i) => {
                if (hide_out_of_stock && !item.available) return;
                if (item?.metafields?.seo?.hidden) return;
                if (i >= 2 || (i >= 1 && parentIndex >= 2)) {
                  return;
                }
                related_products.push(item);
              });
            });
          break;
        }
        case "recently_viewed_least_expensive": {
          [...recentlyViewedProducts]
            .sort((a, b) => a.price - b.price)
            ?.forEach((product, parentIndex) => {
              product?.complementary_products?.forEach((item, i) => {
                if (hide_out_of_stock && !item.available) return;
                if (item?.metafields?.seo?.hidden) return;
                if (i >= 2 || (i >= 1 && parentIndex >= 2)) {
                  return;
                }
                complementary_products.push(item);
              });
              product?.related_products?.forEach((item, i) => {
                if (hide_out_of_stock && !item.available) return;
                if (item?.metafields?.seo?.hidden) return;
                if (i >= 2 || (i >= 1 && parentIndex >= 2)) {
                  return;
                }
                related_products.push(item);
              });
            });
          break;
        }
        case "cart_ai": {
          const expensive = [...cart.state.items].sort((a, b) => b.final_price - a.final_price).slice(0, 3);
          const recent = cart.state.items.slice(0, 2).sort((a, b) => b.final_price - a.final_price);

          [...recent, ...expensive]?.forEach((line, parentIndex) => {
            const product = lineItemProducts.find((p) => p.handle === line.handle);

            product?.complementary_products?.forEach((item, i) => {
              if (hide_out_of_stock && !item.available) return;
              if (item?.metafields?.seo?.hidden) return;
              if (i >= 2 || (i >= 1 && parentIndex >= 2)) {
                return;
              }
              complementary_products.push(item);
            });
            product?.related_products?.forEach((item, i) => {
              if (hide_out_of_stock && !item.available) return;
              if (item?.metafields?.seo?.hidden) return;
              if (i >= 2 || (i >= 1 && parentIndex >= 2)) {
                return;
              }
              related_products.push(item);
            });
          });
          break;
        }
        case "cart_most_expensive": {
          [...cart.state.items]
            .sort((a, b) => b.final_price - a.final_price)
            ?.forEach((line, parentIndex) => {
              const product = lineItemProducts.find((p) => p.handle === line.handle);

              product?.complementary_products?.forEach((item, i) => {
                if (hide_out_of_stock && !item.available) return;
                if (item?.metafields?.seo?.hidden) return;
                if (i >= 2 || (i >= 1 && parentIndex >= 2)) {
                  return;
                }
                complementary_products.push(item);
              });
              product?.related_products?.forEach((item, i) => {
                if (hide_out_of_stock && !item.available) return;
                if (item?.metafields?.seo?.hidden) return;
                if (i >= 2 || (i >= 1 && parentIndex >= 2)) {
                  return;
                }
                related_products.push(item);
              });
            });
          break;
        }
        case "cart_least_expensive": {
          [...cart.state.items]
            .sort((a, b) => a.final_price - b.final_price)
            ?.forEach((line, parentIndex) => {
              const product = lineItemProducts.find((p) => p.handle === line.handle);

              product?.complementary_products?.forEach((item, i) => {
                if (hide_out_of_stock && !item.available) return;
                if (item?.metafields?.seo?.hidden) return;
                if (i >= 2 || (i >= 1 && parentIndex >= 2)) {
                  return;
                }
                complementary_products.push(item);
              });
              product?.related_products?.forEach((item, i) => {
                if (hide_out_of_stock && !item.available) return;
                if (item?.metafields?.seo?.hidden) return;
                if (i >= 2 || (i >= 1 && parentIndex >= 2)) {
                  return;
                }
                related_products.push(item);
              });
            });
          break;
        }
        case "cart_recently_added": {
          cart.state.items?.forEach((line, parentIndex) => {
            const product = lineItemProducts.find((p) => p.handle === line.handle);

            product?.complementary_products?.forEach((item, i) => {
              if (hide_out_of_stock && !item.available) return;
              if (item?.metafields?.seo?.hidden) return;
              if (i >= 2 || (i >= 1 && parentIndex >= 2)) {
                return;
              }
              complementary_products.push(item);
            });
            product?.related_products?.forEach((item, i) => {
              if (hide_out_of_stock && !item.available) return;
              if (item?.metafields?.seo?.hidden) return;
              if (i >= 2 || (i >= 1 && parentIndex >= 2)) {
                return;
              }
              related_products.push(item);
            });
          });
          break;
        }
      }

      switch (primary_source) {
        case "complementary": {
          complementary_products?.forEach((prod) => products.push(prod));
          break;
        }
        case "related": {
          related_products?.forEach((prod) => products.push(prod));
          break;
        }
        case "recently_viewed": {
          const recent_products = await Promise.all(
            (window?._recent_products ?? [])?.map(([handle, product_id]) => _product.getHydratedProductData(handle, product_id))
          );
          recent_products?.forEach((prod) => products.push({ ...prod, recommendation_params: undefined }));
          break;
        }
        case "manual": {
          const fallback_products = await Promise.all(
            fallback_products_source?.map(([handle, product_id]) => _product.getHydratedProductData(handle, product_id))
          );
          fallback_products?.forEach((prod) => products.push({ ...prod, recommendation_params: undefined }));
          break;
        }
      }

      switch (fallback_source) {
        case "complementary": {
          complementary_products?.forEach((prod) => products.push(prod));
          break;
        }
        case "related": {
          related_products?.forEach((prod) => products.push(prod));
          break;
        }
        case "recently_viewed": {
          const recent_products = await Promise.all(
            (window?._recent_products ?? []).map(([handle, product_id]) => _product.getHydratedProductData(handle, product_id))
          );
          recent_products?.forEach((prod) => products.push({ ...prod, recommendation_params: undefined }));
          break;
        }
        case "manual": {
          const fallback_products = await Promise.all(
            fallback_products_source?.map(([handle, product_id]) => _product.getHydratedProductData(handle, product_id))
          );
          fallback_products?.forEach((prod) => products.push({ ...prod, recommendation_params: undefined }));
          break;
        }
      }

      const renderProducts =
        products
          ?.filter((prod) => {
            if (targeting_type === "product") {
              if (!prod || prod.id === state?.product?.id) return false;
            }
            if (/^cart_/gi.test(targeting_type)) {
              if (cart.state.items.some((item) => item.product_id === prod?.id)) return false;
            }
            if (/^recently_viewed_/gi.test(targeting_type)) {
              if (_recent_products.some(([handle, id]) => id === prod?.id)) return false;
            }
            if (filter_by_type) {
              if (prod.type.toLowerCase().trim() !== filter_by_type) return false;
            }
            if (hide_out_of_stock && !prod.available) {
              return false;
            }
            if (prod?.metafields?.seo?.hidden) return false;
            return true;
          })
          ?.filter((a, i, arr) => arr.findIndex((b) => b.id === a.id) === i) ?? [];

      switch (hide_if_empty) {
        case "none": {
          if (renderProducts?.length === 0 && fallback_products_source.length) {
            const fallback_products = await Promise.all(
              fallback_products_source?.map(([handle, product_id]) => _product.getHydratedProductData(handle, product_id))
            );

            const validFallbackProducts =
              fallback_products
                ?.filter((prod) => {
                  if (targeting_type === "product") {
                    if (!prod || prod.id === state?.product?.id) return false;
                  }
                  if (/^cart_/gi.test(targeting_type)) {
                    if (cart.state.items.some((item) => item.product_id === prod?.id)) return false;
                  }
                  if (/^recently_viewed_/gi.test(targeting_type)) {
                    if (_recent_products.some(([handle, id]) => id === prod?.id)) return false;
                  }
                  if (filter_by_type) {
                    if (prod.type.toLowerCase().trim() !== filter_by_type) return false;
                  }
                  if (hide_out_of_stock && !prod.available) {
                    return false;
                  }
                  if (prod?.metafields?.seo?.hidden) return false;
                  return true;
                })
                ?.filter((a, i, arr) => arr.findIndex((b) => b.id === a.id) === i) ?? [];

            validFallbackProducts.forEach((prod) => renderProducts.push(prod));
          }
          break;
        }
        case "section": {
          container.closest(`.shopify-section`)?.style?.setProperty?.("display", "block");
          container.closest(`.shopify-section`)?.classList.toggle("!hidden", renderProducts?.length === 0);
          break;
        }
        case "container": {
          container?.classList.toggle("!hidden", renderProducts?.length === 0);
          break;
        }
        case "block": {
          break;
        }
      }

      const existingItems = [...container.querySelectorAll(`[data-render-index*="${block_id}--"]`)].filter((el) => {
        if (renderProducts.slice(0, limit).some((prod) => el.getAttribute("data-product-handle") === prod.handle)) return true;
        el.remove();
        return false;
      });

      renderProducts.slice(0, limit).forEach((prod, i, arr) => {
        if (!_products[prod.handle]) {
          _products[prod.handle] = prod;
        }

        const existingItem = existingItems.find((el) => el.getAttribute("data-product-handle") === prod.handle);
        if (existingItem) {
          existingItem.setAttribute("data-render-index", `${block_id}--${i}`);
          existingItem.style.setProperty("--order", `${(i + order_offset) * 10}`);
          if (prod.recommendation_params) {
            existingItem.setAttribute("data-recommendation-params", prod.recommendation_params);
          }
          return;
        }

        const node = sourceNode?.cloneNode(true);

        if (node) {
          node.querySelectorAll("[data-x-ignore]").forEach((el) => {
            el.setAttribute("x-ignore", "");
          });
          node.querySelectorAll("[x-defer-active]").forEach((el) => {
            el.removeAttribute("x-defer-active");
          });
          node.removeAttribute("x-defer-active");

          node.setAttribute("x-ignore", "");

          const div = document.createElement("div");
          div.setAttribute("data-product-handle", prod.handle);
          div.setAttribute("data-style-id", `${section_id}--${block_id}`);
          div.setAttribute("data-render-index", `${block_id}--${i}`);

          div.setAttribute(
            "class",
            `shrink-0 max-w-full w-full order-[--order] ${
              i > desktop_display_limit ? "mobile-only" : i > mobile_display_limit ? "desktop-tablet-only" : ""
            }`
          );
          div.style.setProperty("--order", `${(i + order_offset) * 10}`);
          node.removeAttribute(`data-product-card`);
          node.setAttribute("data-product-handle", prod.handle);
          node.setAttribute("data-product-id", `${prod.id}`);
          node.setAttribute("data-variant-id", `${prod.variants?.[0]?.id}`);
          node.classList.add("card-loading");
          if (prod.recommendation_params) {
            node.setAttribute("data-recommendation-params", prod.recommendation_params);
          }
          if (addon_products) {
            node.setAttribute("data-addon-product-target", addon_target_product);
            if (addon_auto_add) {
              node.setAttribute("data-addon-auto-add", "");
            }
            if (addon_bundle_in_cart) {
              node.setAttribute("data-addon-cart-bundle", "");
            }
          }
          node.querySelectorAll("[data-loop-item], [data-x-if], style").forEach((el) => el.remove());
          div.appendChild(node);
          container.appendChild(div);
        }
      });
      handleResize();
    };

    renderDynamicProductCards();

    if (targeting_type === "product" && (primary_source === "related" || fallback_source === "related")) {
      Alpine.effect(() => {
        if (state.product?._recommendations_loaded_at || state.product?.complementary_products?.length) {
          renderDynamicProductCards();
        }
      });
    }

    if (/^cart_/gi.test(targeting_type)) {
      Alpine.effect(() => {
        const show =
          !container.closest("[data-dynamic-modals]") ||
          editor?.select_section_id === section_id ||
          modal.id === "modal--cart-drawer";

        if ((cart.state.total_price || cart.state.item_count || cart.state.item_count <= 0) && show) {
          renderDynamicProductCards();
        }
      });
    }

    _product.getHydratedProductData(product?.handle, product?.id).then((res) => {
      state.product = state.product?.handle === res?.handle ? res : state.product;
    });
  },
  getSelectedVariant: (product, variantId) => {
    const {
      variants = [],
      selected_variant_id,
      selected_or_first_available_variant_id,
      options_with_values = [],
    } = product ?? {};

    const matchLastOptions = (v, depth) =>
      options_with_values
        .slice(0, depth)
        .every((option, i) => _product.lastOptions[option?.name?.toLowerCase()] === v.options[i]);

    const matchSomeLastOptions = (v) =>
      options_with_values.some((option, i) => _product.lastOptions[option?.name?.toLowerCase()] === v.options[i]);

    const strategies = [
      (v) => v.id === variantId,
      (v) => v.id && v.available && !v.preorder && matchLastOptions(v, options_with_values.length),
      (v) => v.id && v.available && !v.preorder && matchLastOptions(v, options_with_values.length - 1),
      (v) => v.id && v.available && !v.preorder && matchLastOptions(v, options_with_values.length - 2),
      (v) => v.id && v.available && !v.preorder && matchSomeLastOptions(v),
      (v) => v.id === selected_variant_id && v.available && !v.preorder,
      (v) => v.id === selected_or_first_available_variant_id && v.available && !v.preorder,
      (v) => v.id && v.available && !v.preorder,
      (v) => v.id && v.available && matchLastOptions(v, options_with_values.length),
      (v) => v.id && v.available && matchLastOptions(v, options_with_values.length - 1),
      (v) => v.id && v.available && matchLastOptions(v, options_with_values.length - 2),
      (v) => v.id && v.available && matchSomeLastOptions(v),
      (v) => v.id === selected_variant_id && v.available,
      (v) => v.id === selected_or_first_available_variant_id && v.available,
      (v) => v.id && v.available,
    ];

    return strategies.map((fn) => variants.find(fn)).find(Boolean) || variants[0];
  },
  lastOptions: utils.JSONParse(sessionStorage.getItem("_p_last_options") || "{}") ?? {},
};

window._product = _product;
