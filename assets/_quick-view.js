export const initQuickView = () => {
  window.Alpine.store("quickView", {
    show: false,
    loading: false,
    handle: "",
    dynamic_popups: [],
    container: document.querySelector("[data-quick-view-container]"),
    show_all_container: document.querySelector("[data-quick-view-show-more]"),
    loading_container: document.querySelector("[data-quick-view-loading]"),

    async renderQuickView(handle, $data, bundleButton, variantId) {
      requestAnimationFrame(async () => {
        requestAnimationFrame(async () => {
          const container = this.container;
          this.handle = handle;
          this.show = true;

          this.loading_container?.classList?.remove("opacity-0", "pointer-events-none");
          if (!handle || !container) return;

          container.parentElement?.querySelectorAll?.("style")?.forEach((style) => {
            style.remove();
          });

          const html = await utils.fetchFromCache(`${window.location.origin}/products/${handle}`);

          const div = document.createElement("div");

          div.innerHTML = html;
          const productData = div.querySelector(`[data-product-data="${handle}"]`);
          div.querySelectorAll("[data-popup]").forEach((popup) => {
            document.body.appendChild(popup);
            this.dynamic_popups.push(popup);
          });
          const form = div.querySelector(`[data-content-root] [data-section-type="main_product"]`);
          const section = div.querySelector(`[data-content-root] [data-section-type="main_product"]`)?.parentElement;

          if (!form || !section) {
            return;
          }

          section?.classList.add("!h-full", "!overflow-hidden");
          form.classList.add(
            "max-lg:!max-h-full",
            "max-lg:!overflow-y-auto",
            "scrollbar-none",
            "!h-full",
            "!py-8",
            "lg:!overflow-hidden"
          );

          form.querySelectorAll(":scope > [data-style-id]")?.forEach((childContainer) => {
            childContainer.classList.add("lg:!max-h-full", "lg:!overflow-y-auto", "scrollbar-none");
            childContainer?.style?.setProperty("position", "relative", "important");
            childContainer?.style?.setProperty("top", "unset", "important");
            childContainer?.style?.setProperty("height", "unset", "important");
            childContainer?.style?.setProperty("max-height", "unset", "important");
            if (childContainer.querySelector("[data-main-product-images]")) {
              childContainer?.classList.add("@container");
            }
          });

          section?.parentElement?.querySelectorAll("style")?.forEach((style) => {
            container.parentElement.prepend(style);
          });
          const sideContent = form?.querySelector('[x-ref="content"]');
          sideContent?.classList.add("max-h-full", "overflow-y-auto");

          form?.setAttribute("data-quick-view", "true");
          form?.classList?.remove(
            "px-container-xs",
            "px-container-sm",
            "px-container-md",
            "px-container-lg",
            "px-container-fullwidth"
          );
          form?.classList?.add("px-container-gutter");

          this.loading_container?.classList?.add("opacity-0", "pointer-events-none");
          container.innerHTML = (productData ? productData?.outerHTML : "") + section?.outerHTML;

          const stateElement = container.querySelector('[data-section-type="main_product"]');

          if ($data && bundleButton && stateElement) {
            stateElement
              .querySelectorAll('[data-block-type="quantity_selector"], [data-block-type="complementary_products"]')
              .forEach((el) => {
                el.remove();
              });

            stateElement.querySelectorAll(`[data-block-type="add_to_cart_button"]`).forEach((element) => {
              const clonedBundleButton = bundleButton.cloneNode(true);
              element.innerHTML = "";
              element.appendChild(clonedBundleButton);
            });

            Alpine.nextTick(() => {
              stateElement?._x_dataStack?.forEach((proxyState) => {
                if (proxyState?.card && proxyState?.bundle && proxyState?.state) {
                  proxyState.card = proxyState.state;
                  proxyState.bundle = $data.bundle;
                }
              });
            });
          }

          if (variantId) {
            Alpine.nextTick(() => {
              stateElement?._x_dataStack?.forEach((proxyState) => {
                if (proxyState?.state && proxyState.setSelectedVariant) {
                  proxyState.setSelectedVariant(+variantId);
                }
              });
            });
          }

          if (this.show_all_container) {
            this.show_all_container.innerHTML = `<button type="button" class="plain-link" @click="$quickView.show = false; barba.go('${window.location.origin}/products/${handle}')">Full details</a>`;
          }
        });
      });
    },
  });

  const quickViewStore = window.Alpine.store("quickView");

  const handleKeydown = (e) => {
    if (e.key === "Escape") {
      quickViewStore.show = false;
    }
  };

  window.Alpine.effect(() => {
    document.body.classList.toggle("!overflow-hidden", quickViewStore.show);

    if (quickViewStore.show) {
      document.addEventListener("keydown", handleKeydown);
    }
    if (!quickViewStore.show) {
      document.removeEventListener("keydown", handleKeydown);
      quickViewStore.dynamic_popups?.forEach((element) => {
        element.remove();
      });
      quickViewStore.dynamic_popups = [];
    }
  });
  window.Alpine.magic("quickView", () => quickViewStore);
  window._stores["quickView"] = quickViewStore;
};

document.addEventListener("alpine:init", initQuickView);

/* LAST HASH: f7f17bd5db8b4d1fff189ee88a48bdd1d54c722c */
