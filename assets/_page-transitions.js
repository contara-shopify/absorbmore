const startTime = Date.now();

let initialized = false;
let firstRender = true;

export const initPageTransitions = () => {
  if (initialized) return;
  const rootContainer = document.querySelector("[data-content-root]");

  const scrollToTarget = () => {
    if (window.location.hash) {
      const target = document?.querySelector(window.location.hash);
      if (!target) return;

      if (
        utils.isElementScrollable(target.parentElement) &&
        utils.isVisible(target.parentElement) &&
        utils.isInViewport(target)
      ) {
        if (target.parentElement.scrollWidth > target.parentElement.offsetWidth) {
          utils.scrollToXY(260, target.offsetLeft, target.parentElement?.scrollTop, target.parentElement);
        }
        if (target.parentElement.scrollHeight > target.parentElement.offsetHeight) {
          utils.scrollToXY(260, target.parentElement?.scrollLeft, target.offsetTop, target.parentElement);
        }

        return;
      }

      const targetPosition =
        utils.getElementPosition(target)?.top -
        Math.max(70, document.querySelector(".header-sections-container")?.getBoundingClientRect()?.bottom ?? 0);

      utils.scrollToY(70 + Math.abs(Math.round((window.scrollY - targetPosition) / 15)), targetPosition);
    }
  };

  window.Alpine.store("router", {
    pathname: rootContainer.getAttribute("data-pathname"),
    template: rootContainer.getAttribute("data-template"),
    search: window.location.search,
    hash: window.location.hash,
    setValue(key, value) {
      this[key] = value;
    },
  });

  const routerStore = window.Alpine.store("router");

  window.Alpine.magic("router", () => routerStore);
  window._stores["router"] = routerStore;

  if (window.design_mode || !window.page_transitions_enabled) {
    // @ts-ignore
    barba.go = (href) => {
      if (typeof href === "string" && window.location.href !== href) {
        window.location.href = href;
      }
    };
    barba.prefetch = () => {};
  }

  barba.use(barbaPrefetch, {
    root: document.body,
    timeout: 4000,
    /* @ts-ignore */
    limit: 0,
  });

  /*
   barba.prefetch = (href) => {
    return barba.prefetch(href);
  };
*/

  const handleRouteCaching = (url) => {
    if (typeof idbKeyval !== "undefined" && !window.design_mode) {
      requestIdleCallback(
        async () => {
          const parsedUrl = utils.getShopifyCacheUrl(url);
          if (!barba.cache.get(parsedUrl)) return;

          const fetchResults = await barba.cache.get(parsedUrl).request.then((res) => ({ data: res }));

          const div = document.createElement("div");
          div.innerHTML = fetchResults?.data?.html;
          const productData = div.querySelectorAll(`[data-product-data]`);

          productData?.forEach(async (scriptElement) => {
            const product = utils.JSONParse(scriptElement.innerHTML);
            if (product?.handle) {
              const dbKey = `_${window.Shopify.theme.id}-product--${product.handle}--${window.theme_settings.development__cache_version}`;
              _products[product.handle] = {
                _recommendations_loaded_at: 0,
                related_products: [],
                complementary_products: [],
                ...(_products[product.handle] ?? ((await idbKeyval.get(dbKey)) || {})),
                ...(product?._full_data ? product : _products[product.handle]?._full_data ? _products[product.handle] : product),
                _updated_at: Date.now(),
              };
              await idbKeyval.set(dbKey, _products[product.handle]);
              if (_products[product.handle]?._full_data) {
                sessionStorage.setItem(dbKey, "1");
              }
            }
          });

          await idbKeyval.set(`barba-prefetch---${startTime}-//-${parsedUrl}`, fetchResults);
        },
        { timeout: 3000 }
      );
    }
  };

  document.addEventListener("barba:prefetch:fulfilled", async (e) => {
    handleRouteCaching(e.detail.url?.replace(/(\/collections\/[^/]*\/)/gi, "/"));
  });

  if (typeof idbKeyval !== "undefined" && window.theme_settings && !window.design_mode) {
    idbKeyval
      .keys()
      .then(async (res) => {
        res.forEach(async (key) => {
          if (key.includes("/account")) {
            idbKeyval.del(key);
            return;
          }
          const [timestamp, cacheKey] = key.replace("barba-prefetch---", "").split("-//-");

          if (cacheKey && +timestamp > Date.now() - 1000 * 60 * 10) {
            barba.cache.set(
              cacheKey,
              idbKeyval.get(key).then((res) => res.data),
              "prefetch"
            );
          } else if (cacheKey && +timestamp > 0) {
            idbKeyval.del(key);
          }
        });
        await utils.delay(100);
        barba.timeout = window.origin.includes("127.0.0.1") ? 30000 : 4000;
      })
      .catch(async (err) => {
        await utils.delay(100);
        barba.timeout = window.origin.includes("127.0.0.1") ? 30000 : 4000;
      });
  }

  const transitionOverlay = document.querySelector("[data-transition-overlay]");
  barba.init({
    prefetchIgnore: [
      "/challenge",
      "/gift_cards",
      "/search",
      "/account/logout",
      "/account/logout/:any",
      "/customer_identity",
      "/customer_identity/:any",
      "/apps",
      "/apps/:any",
      ...(window.page_transitions_ignore ?? []),
    ].filter(Boolean),
    cacheIgnore: [
      "/challenge",
      "/gift_cards",
      "/search",
      "/account/logout",
      "/account/logout/:any",
      "/customer_identity",
      "/customer_identity/:any",
      "/apps",
      "/apps/:any",
      ...(window.page_transitions_ignore ?? []),
    ].filter(Boolean),
    debug: false,
    /* @ts-ignore */
    cacheFirstPage: true,
    timeout: window.origin.includes("127.0.0.1") ? 30000 : 4000, // default is 2000ms,
    transitions: [
      {
        name: "opacity-transition",
        leave: (data) => {
          transitionOverlay?.classList.add("active", "out-active");
          transitionOverlay?.parentElement?.classList.add("active", "out-active");
        },
        enter: (data) => {
          const handleTransitionend = () => {
            transitionOverlay?.classList.remove("out-active");
            transitionOverlay?.parentElement?.classList.remove("out-active");
            transitionOverlay?.removeEventListener("transitionend", handleTransitionend);
          };
          transitionOverlay?.classList.remove("active");
          transitionOverlay?.parentElement?.classList.remove("active");
          transitionOverlay?.addEventListener("transitionend", handleTransitionend);

          const scrollToTopWithStickyCompensation = () => {
            requestAnimationFrame(() => {
              window.scrollTo({ top: 0, behavior: "auto" });

              requestAnimationFrame(() => {
                const header = document.querySelector("[data-header-section]");
                const offset = header?.getBoundingClientRect().bottom ?? 0;

                window.scrollBy({
                  top: -offset,
                  behavior: "auto",
                });

                const topSentinel = document.createElement("div");
                topSentinel.style.position = "absolute";
                topSentinel.style.top = "0";
                topSentinel.style.width = "1px";
                topSentinel.style.height = "1px";
                document.body.prepend(topSentinel);

                const observer = new IntersectionObserver(
                  ([entry]) => {
                    if (!entry.isIntersecting) {
                      window.scrollBy({ top: -offset, behavior: "auto" });
                    }
                    observer.disconnect();
                    topSentinel.remove();
                  },
                  {
                    threshold: 0.01,
                  }
                );

                observer.observe(topSentinel);
              });
            });
          };
          scrollToTopWithStickyCompensation();
        },
      },
    ],
    views: [
      {
        beforeLeave: (data) => {
          console.debug("beforeLeave", data);
          window._stores?.modal?.setId("");
          window._stores?.modal?.setSubId("");
          // window.Alpine?.destroyTree?.(data.current.container);
        },
        namespace: "tmp",
        afterLeave(data) {
          console.debug("afterLeave", data);

          routerStore.setValue("pathname", window.location.pathname);
          routerStore.setValue("search", window.location.search);
          if (!data?.next?.container) {
            return;
          }
          routerStore.setValue("template", data?.next?.container?.getAttribute("data-template"));
        },
        beforeEnter: (data) => {
          console.debug("beforeEnter", data);
          data?.next?.container?.querySelectorAll("[x-defer-active]").forEach((el) => el.removeAttribute("x-defer-active"));
        },
        afterEnter: (data) => {
          console.debug("afterEnter", data);

          // window.Alpine?.stopObservingMutations?.();
          // window.Alpine?.deferMutations?.();

          data?.current?.container?.remove();
          window._stores["quickView"].show = false;
          window._stores?.modal?.setId("");
          window._stores?.modal?.setSubId("");

          const productDataContainer = data.next.container?.querySelector("[data-product-data-init]");

          if (productDataContainer) {
            const newScriptTag = document.createElement("script");
            newScriptTag.innerHTML = productDataContainer.innerText;
            newScriptTag.setAttribute("data-product-data-init", "");

            document.head.appendChild(newScriptTag);
          }

          // requestAnimationFrame(() => {
          //   requestAnimationFrame(() => {
          //     window.Alpine?.flushAndStopDeferringMutations?.();
          //     window.Alpine?.startObservingMutations?.();
          //   });
          // });

          if (data?.next?.container && !firstRender) {
            utils.delay(60).then(() => {
              // window.Alpine?.stopObservingMutations?.();
              // window.Alpine?.deferMutations?.();

              scrollToTarget();

              const html = document.createElement("html");
              html.innerHTML = data.next?.html;

              html.querySelectorAll(".shopify-block.shopify-app-block").forEach((element) => {
                const currentElement = document.getElementById(element.id);
                currentElement.parentNode.replaceChild(element, currentElement);
              });

              const contentScripts = html.querySelectorAll("[data-content-root] script[src]");

              html.querySelectorAll(":not([data-content-root]) script[src]").forEach((scriptElement) => {
                const existingScript =
                  document.head.querySelector(`script[src*="${scriptElement.src.split("?")[0]?.split("/").at(-1)}"]`) ||
                  [...contentScripts].includes(scriptElement);

                if (!existingScript) {
                  const newScriptTag = document.createElement("script");
                  scriptElement.getAttributeNames().forEach((name) => {
                    newScriptTag.setAttribute(name, scriptElement.getAttribute(name));
                    if (name === "src") {
                      newScriptTag.setAttribute(
                        name,
                        scriptElement.src?.includes("?")
                          ? `${scriptElement?.src}&v_id=${Date.now()}`
                          : `${scriptElement?.src}?v_id=${Date.now()}`
                      );
                    }
                  });
                  document.head.appendChild(newScriptTag);
                  // console.log(barba.cache, "barba.cache", scriptElement.src);
                }
              });

              document
                .querySelectorAll("[data-content-root] script:not(script[src],[data-product-data],[type='application/json'])")
                .forEach((scriptElement) => {
                  const newScriptTag = document.createElement("script");
                  newScriptTag.innerHTML = scriptElement.innerHTML;
                  scriptElement.getAttributeNames().forEach((name) => {
                    newScriptTag.setAttribute(name, scriptElement.getAttribute(name));
                    if (name === "src") {
                      newScriptTag.setAttribute(
                        name,
                        scriptElement.src?.includes("?")
                          ? `${scriptElement?.src}&v_id=${Date.now()}`
                          : `${scriptElement?.src}?v_id=${Date.now()}`
                      );
                    }
                  });
                  scriptElement.parentNode.replaceChild(newScriptTag, scriptElement);
                });

              document.querySelectorAll("[data-content-root] script[src]").forEach((scriptElement) => {
                const newScriptTag = document.createElement("script");
                scriptElement.getAttributeNames().forEach((name) => {
                  newScriptTag.setAttribute(name, scriptElement.getAttribute(name));
                  if (name === "src") {
                    newScriptTag.setAttribute(
                      name,
                      scriptElement.src?.includes("?")
                        ? `${scriptElement?.src}&v_id=${Date.now()}`
                        : `${scriptElement?.src}?v_id=${Date.now()}`
                    );
                  }
                });

                scriptElement.parentNode.replaceChild(newScriptTag, scriptElement);
              });

              // window.Alpine?.initTree?.(data.next.container);
              //
              // window.Alpine?.flushAndStopDeferringMutations?.();
              // window.Alpine?.startObservingMutations?.();
            });
          }

          // if (data?.next?.container && firstRender) {
          //   window.Alpine?.initTree?.(data.next.container);
          // }

          if (!firstRender) {
            requestIdleCallback(
              () => {
                document.dispatchEvent(new Event("DOMContentLoaded"));
                window.dispatchEvent(new Event("DOMContentLoaded"));
                document.dispatchEvent(new CustomEvent("pageFullyLoaded", {}));
                Shopify?.PaymentButton?.init();
                window?.okeWidgetApi?.initAllWidgets();
                window?.yotpoWidgetsContainer?.initWidgets();
                window?.loyaltylion?.ui?.refresh();

                setTimeout(() => {
                  window?.okeWidgetApi?.initAllWidgets();
                }, 1000);

                setTimeout(() => {
                  window?.okeWidgetApi?.initAllWidgets();
                }, 3000);
              },
              { timeout: 5000 }
            );
          }

          firstRender = false;
        },
      },
    ],
  });
  [...(barba.cache.keys() ?? [])].forEach((key) => {
    if (key.includes("/account")) {
      barba.cache.delete(key);
    }
  });

  handleRouteCaching(window.location.origin + window.location.pathname);
  barba.timeout = 1;

  initialized = true;
};

document.addEventListener("alpine:init", initPageTransitions);

/* LAST HASH: c79f74702bb6e19229906a62b1dbcbf49da293fb */
