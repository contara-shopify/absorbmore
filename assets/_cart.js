export const initCart = () => {
  const initial_selling_plan = window._cart_data?.items?.find((item) => item?.selling_plan_allocation?.selling_plan?.id)
    ?.selling_plan_allocation?.selling_plan;

  window.Alpine.store("cart", {
    history: [structuredClone(window._cart_data)],
    state: {
      ...window._cart_data,
      items: window._cart_data?.items?.filter((item) => item.quantity).map((item, index) => ({ ...item, index })) ?? [],
    },
    upsell_products: [],
    gift_products: {},
    _gift_with_purchase_disable_auto_add: utils.JSONParse(sessionStorage.getItem("_gift_with_purchase_disable_auto_add") || "[]"),
    loading: false,
    isChanging: false,
    debounce_updates: {},
    possible_selling_plans: [],
    cart_selling_plan_id: initial_selling_plan?.id,
    cart_selling_plan_name: initial_selling_plan?.name,
    cart_selling_plan_discount_wording: "",
    isSubscriptionChanging: false,
    global_subscriptions: false,
    bundle: {
      parent: null,
      child: null,
      added: false,
    },
  });

  const cart = window.Alpine.store("cart");
  window.Alpine.magic("cart", () => cart);
  window._stores["cart"] = cart;
  window._cart_data = cart.state;

  const use_native_bundles = window.theme_settings.data__cart__enable_shopify_bundle_display;
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "smart-theme": "true",
  };

  const get = async (productAdded = false) => {
    const data = await fetch(use_native_bundles ? "/cart/update.js?smart_theme=true" : "/cart.js?smart_theme=true", {
      method: use_native_bundles ? "POST" : "GET",
      headers,
      body: use_native_bundles ? JSON.stringify({ sections: "data_cart_json" }) : undefined,
    })
      .then((res) => res.json())
      .catch((e) => {
        _stores.toast.addToast({
          type: "error",
          target: "cart",
          title: "Cart Error",
          content: e.statusMessage,
        });
        cart.isChanging = false;
        return window._stores["cart"].state;
      });

    if ("status" in data) {
      _stores.toast.addToast({
        type: "error",
        target: "cart",
        title: data.message,
        content: data.description,
      });
      cart.isChanging = false;
      return window._stores["cart"].state;
    }

    const item_components = utils.JSONParse(data.sections?.data_cart_json?.split("||%!SPLIT%!||")?.[1] ?? "[]") ?? [];

    setTimeout(async () => {
      if (data?.items?.filter((item) => !item.quantity)?.length) {
        const removeItems = data?.items?.filter((item) => !item.quantity);
        for (let i = 0; i < removeItems?.length; i++) {
          const item = removeItems[i];
          const update = await change({ id: item.key, quantity: 0 });
        }
        await get();
      }
    }, 0);

    const newCartData = {
      ...data,
      items:
        data?.items
          ?.filter((item) => item.quantity)
          .map((item, index) => ({
            ...item,
            index,
            item_components: item_components[index],
          })) ?? [],
      item_count: data.items
        ?.filter((item) => !item?.properties?._p_id_link && !item?.properties?._p_hidden)
        ?.reduce((acc, item) => (acc += item.quantity), 0),
    };

    if (newCartData?.item_count === 0) {
      cart._gift_with_purchase_disable_auto_add = [];
      sessionStorage.setItem("_gift_with_purchase_disable_auto_add", JSON.stringify([]));
    }
    cart.history.unshift(structuredClone(newCartData));
    cart.state = newCartData;
    if (cart.history.length > 5) {
      cart.history.pop();
    }
    cart.isChanging = false;
    if (productAdded) {
      document.dispatchEvent(new CustomEvent("productAddedToCart", { detail: newCartData }));
    }
    return newCartData;
  };

  const add = async (cartItems) => {
    cart.isChanging = true;
    const data = await fetch("/cart/add.js?smart_theme=true", {
      method: "POST",
      headers,
      body: JSON.stringify({ ...cartItems, sections: use_native_bundles ? "data_cart_json" : undefined }),
    })
      .then((res) => res.json())
      .catch(async (e) => {
        _stores.toast.addToast({
          type: "error",
          target: "cart",
          title: "Cart Error",
          content: e.statusMessage,
        });
        return {
          ...(await get()),
          cart_error: true,
        };
      });

    if ("status" in data) {
      _stores.toast.addToast({
        type: "error",
        target: "cart",
        title: data.message === data.description ? "Cart Error" : data.message,
        content: data.description,
      });
      return {
        ...(await get()),
        cart_error: true,
      };
    }

    get();

    const item_components = utils.JSONParse(data.sections?.data_cart_json?.split("||%!SPLIT%!||")?.[1] ?? "[]") ?? [];

    const items = [
      ...(data?.items ?? []),
      ...(cart.state?.items?.filter((item) => !data?.items?.some((newItem) => newItem.key === item.key)) ?? []),
    ]
      ?.filter((item) => item.quantity)
      .map((item, index) => ({
        ...item,
        index,
        item_components: item_components[index],
      }));

    const newCartData = {
      ...cart.state,
      items,
      item_count: items
        ?.filter((item) => !item?.properties?._p_id_link && !item?.properties?._p_hidden)
        ?.reduce((acc, item) => (acc += item.quantity), 0),
      original_total_price: items.reduce((acc, item) => acc + (item.original_line_price ?? 0), 0),
      items_subtotal_price: items.reduce((acc, item) => acc + (item.final_line_price ?? 0), 0),
      total_discount: items.reduce((acc, item) => acc + (item.line_level_total_discount ?? 0), 0),
      total_price: items.reduce((acc, item) => acc + (item.final_line_price ?? 0), 0),
      total_weight: items.reduce((acc, item) => acc + (item.grams ?? 0) * item.quantity, 0),
      requires_shipping: items.some((item) => item.requires_shipping),
    };

    cart.state = newCartData;
    cart.isChanging = false;

    document.dispatchEvent(new CustomEvent("productAddedToCart", { detail: newCartData }));

    return newCartData;
  };

  const update = async (updates) => {
    cart.isChanging = true;
    const data = await fetch("/cart/update.js?smart_theme=true", {
      method: "POST",
      headers,
      body: JSON.stringify({ ...updates, sections: use_native_bundles ? "data_cart_json" : undefined }),
    })
      .then((res) => res.json())
      .catch(async (e) => {
        _stores.toast.addToast({
          type: "error",
          target: "cart",
          title: "Cart Error",
          content: e.statusMessage,
        });

        return await get();
      });

    if ("status" in data) {
      _stores.toast.addToast({
        type: "error",
        target: "cart",
        title: data.message,
        content: data.description,
      });
      return await get();
    }

    if (data?.discount_codes?.length) {
      let update = false;
      data.discount_codes = data.discount_codes.filter((code) => {
        if (code.applicable) return true;
        update = true;
        _stores.toast.addToast({
          type: "error",
          target: "cart",
          title: "Discount code is not applicable",
          content: `The discount code: "${code.code}" is not applicable to this cart. Please try a different code.`,
        });

        return false;
      });

      if (update) {
        _cart.update({ discount: data.discount_codes.map((d) => d.code).join(",") });
      }
    }

    const item_components = utils.JSONParse(data.sections?.data_cart_json?.split("||%!SPLIT%!||")?.[1] ?? "[]");

    const newCartData = {
      ...data,
      items:
        data?.items
          ?.filter((item) => item.quantity)
          .map((item, index) => ({
            ...item,
            index,
            item_components: item_components[index],
          })) ?? [],
      item_count: data.items
        ?.filter((item) => !item?.properties?._p_id_link && !item?.properties?._p_hidden)
        ?.reduce((acc, item) => (acc += item.quantity), 0),
    };
    if (newCartData?.item_count === 0) {
      cart._gift_with_purchase_disable_auto_add = [];
      sessionStorage.setItem("_gift_with_purchase_disable_auto_add", JSON.stringify([]));
    }
    cart.history.unshift(structuredClone(newCartData));
    cart.state = newCartData;
    if (cart.history.length > 5) {
      cart.history.pop();
    }
    cart.isChanging = false;
    return newCartData;
  };

  const change = async (cartItem) => {
    cart.isChanging = true;
    const data = await fetch("/cart/change.js?smart_theme=true", {
      method: "POST",
      headers,
      body: JSON.stringify({ ...cartItem, sections: use_native_bundles ? "data_cart_json" : undefined }),
    })
      .then((res) => res.json())
      .catch(async (e) => {
        _stores.toast.addToast({
          type: "error",
          target: "cart",
          title: "Cart Error",
          content: e.statusMessage,
        });
        return await get();
      });

    if ("status" in data) {
      _stores.toast.addToast({
        type: "error",
        target: "cart",
        title: data.message,
        content: data.description,
      });
      return await get();
    }

    const item_components = utils.JSONParse(data.sections?.data_cart_json?.split("||%!SPLIT%!||")?.[1] ?? "[]");

    const { items_added, items_removed, ...cart_data } = data;

    const newCartData = {
      ...cart_data,
      items:
        cart_data?.items
          ?.filter((item) => item.quantity)
          .map((item, index) => ({
            ...item,
            index,
            item_components: item_components[index],
          })) ?? [],
      item_count: data.items
        ?.filter((item) => !item?.properties?._p_id_link && !item?.properties?._p_hidden)
        ?.reduce((acc, item) => (acc += item.quantity), 0),
    };
    if (newCartData?.item_count === 0) {
      cart._gift_with_purchase_disable_auto_add = [];
      sessionStorage.setItem("_gift_with_purchase_disable_auto_add", JSON.stringify([]));
    }
    cart.history.unshift(structuredClone(newCartData));
    cart.state = newCartData;
    if (cart.history.length > 5) {
      cart.history.pop();
    }
    cart.isChanging = false;
    return newCartData;
  };

  const clear = async () => {
    const data = await fetch("/cart/clear.js?smart_theme=true", {
      method: "POST",
      headers,
    })
      .then((res) => res.json())
      .catch(async (e) => {
        _stores.toast.addToast({
          type: "error",
          target: "cart",
          title: "Cart Error",
          content: e.statusMessage,
        });
        return await get();
      });

    if ("status" in data) {
      _stores.toast.addToast({
        type: "error",
        target: "cart",
        title: data.message,
        content: data.description,
      });
      return await get();
    }

    const newCartData = {
      ...data,
      items: [],
      item_count: 0,
    };
    cart._gift_with_purchase_disable_auto_add = [];
    sessionStorage.setItem("_gift_with_purchase_disable_auto_add", JSON.stringify([]));

    cart.history.unshift(structuredClone(newCartData));
    cart.state = newCartData;
    if (cart.history.length > 5) {
      cart.history.pop();
    }
    cart.isChanging = false;
    return newCartData;
  };

  const showConditionally = (show_conditionally) => {
    if (!show_conditionally) {
      return true;
    }

    switch (show_conditionally) {
      case "always": {
        return true;
      }
      case "cart_empty": {
        return !cart.state.item_count;
      }
      case "items_added": {
        return !!cart.state.item_count;
      }
    }
  };

  const updateLineItemQuantity = (quantity, index) => {
    if (
      !cart.state.items[index] ||
      cart.state.items[index]?.quantity === quantity ||
      cart.state.items.length !== _stores.cart?.history[0].items.length
    ) {
      return;
    }

    const old_quantity = cart.state.items[index].quantity;
    const quantity_difference = Math.max(0, quantity) - cart.state.items[index].quantity;

    cart.state.items[index].quantity = Math.max(0, quantity);

    const p_id = cart.state.items[index]?.properties?._p_id;

    if (p_id) {
      cart.state.items.forEach((child, childIndex) => {
        if (child?.properties?._p_id_link !== p_id) return;
        const quantity_ratio = child.quantity / old_quantity;
        cart.state.items[childIndex].quantity = Math.max(0, child.quantity + quantity_difference * quantity_ratio);
      });
    }

    cart.state.item_count = cart.state.items
      ?.filter((item) => !item?.properties?._p_id_link && !item?.properties?._p_hidden)
      ?.reduce((acc, item) => (acc += item.quantity), 0);

    cart.state.total_price = cart.state.items.reduce((acc, item) => (acc += item.price * item.quantity), 0);
    cart.debounce_updates = cart.state.items.reduce((acc, item) => {
      acc[`${item.key}`] = item.quantity;
      return acc;
    }, {});
  };

  const renderGiftProducts = async (
    $el,
    {
      target_type,
      target,
      receives_quantity,
      allow_duplicates,
      product_card_class,
      hide_if_empty,
      handleResize,
      block_id,
      auto_add_to_cart,
      auto_remove_from_cart,
      hide_in_cart,
    }
  ) => {
    const products = utils.JSONParse($el.getAttribute("data-gift-products"));
    const preorder_threshold = +(window.theme_settings.data__product__variant__preorder_threshold ?? 1);

    handleResize();
    setTimeout(() => {
      handleResize();
    }, 50);

    let sourceNode = document.querySelector(`[data-product-card='${product_card_class}']`);

    if (!sourceNode && !window.modalsLoaded) {
      await new Promise((resolve) => {
        document.addEventListener(
          "modalsLoaded",
          () => {
            sourceNode = document.querySelector(`[data-product-card='${product_card_class}']`);
            resolve(true);
          },
          { once: true }
        );
      });
    }

    const received_quantity = cart?.state?.items?.reduce(
      (acc, lineItem) => (lineItem?.properties?.["_gift_with_purchase"] === `${block_id}` ? (acc += lineItem.quantity) : acc),
      0
    );
    const received_value = cart?.state?.items?.reduce(
      (acc, lineItem) =>
        lineItem?.properties?.["_gift_with_purchase"] === `${block_id}` ? (acc += lineItem.final_line_price) : acc,
      0
    );

    target = target_type === "item_count" ? target + received_quantity : target + received_value;

    const controlProducts =
      cart.state[target_type] >= target && received_quantity < receives_quantity
        ? products
            ?.filter((prod) => allow_duplicates || !cart.state.items.some((item) => item.product_id === prod.id))
            ?.filter((a, i, arr) => arr.findIndex((b) => b.id === a.id) === i)
        : [];

    if (auto_remove_from_cart && cart.state[target_type] < target) {
      cart?.state?.items?.forEach((lineItem) => {
        if (lineItem.quantity && lineItem.properties["_gift_with_purchase"] === `${block_id}`) {
          _cart.updateLineItemQuantity(0, lineItem.index);
        }
      });
      cart.gift_products[block_id] = [];
      return;
    }

    if (auto_add_to_cart && controlProducts?.length) {
      const getControlItems = () => {
        let addedQuantity = cart?.state?.items?.reduce(
          (acc, lineItem) => (lineItem?.properties?.["_gift_with_purchase"] === `${block_id}` ? (acc += lineItem.quantity) : acc),
          0
        );

        return controlProducts
          .filter((p) => !p.variants.some((v) => cart._gift_with_purchase_disable_auto_add.includes(v.id)))
          .map((p) => p.variants.find((v) => v.available))
          .map((variant) => {
            if (
              (!allow_duplicates && cart.state.items.some((item) => item.variant_id === variant.id)) ||
              addedQuantity >= receives_quantity
            ) {
              return null;
            }
            const properties = {
              _gift_with_purchase: `${block_id}`,
              _gift_with_purchase_auto_add: "true",
              ...(hide_in_cart ? { _p_hidden: "true" } : {}),
            };

            if (variant?.preorder && variant?.inventory_quantity < preorder_threshold) {
              properties["Preorder"] = `true`;
              if (variant?.preorder_date) {
                properties["Preorder"] = `Shipping ${new Date(variant.preorder_date).toLocaleDateString(navigator.language, {
                  month: "short",
                  year: "numeric",
                })}`;
              }
            }

            let addQuantity = 1;
            if (!allow_duplicates) {
              addedQuantity += 1;
            } else {
              addQuantity = Math.min(
                variant?.inventory_management === "shopify" && variant?.inventory_policy === "deny"
                  ? variant?.inventory_quantity
                  : 9999,
                receives_quantity - addedQuantity
              );
              addedQuantity += addQuantity;
            }

            return {
              id: variant.id,
              quantity: addQuantity,
              selling_plan: cart.global_subscriptions
                ? variant?.selling_plan_allocations?.find((plan) => plan.selling_plan?.id === cart.cart_selling_plan_id)
                    ?.selling_plan?.id
                : undefined,
              properties: {
                ...properties,
              },
            };
          })
          .filter(Boolean);
      };

      const controlItems = getControlItems();

      if (!controlItems?.length) {
        cart.gift_products[block_id] = [];
        return;
      }

      if (cart.loading || cart.isChanging || cart.isSubscriptionChanging || Object.keys(cart.debounce_updates)?.length) {
        await new Promise((resolve, reject) => {
          const start = performance.now();
          const isBusy = () =>
            cart.loading || cart.isChanging || cart.isSubscriptionChanging || Object.keys(cart.debounce_updates || {}).length > 0;

          const check = () => {
            const now = performance.now();

            if (!isBusy()) {
              clearInterval(tid);
              resolve(true);
              return;
            }

            if (now - start >= 5000) {
              clearInterval(tid);
              reject(new Error("Timed out waiting for cart to become idle"));
            }
          };

          const tid = setInterval(check, 32);
          check();
        });
      }

      const addItems = getControlItems();

      if (addItems?.length) {
        await _cart.add({
          items: addItems,
        });
      }

      cart.gift_products[block_id] = [];
      return;
    }

    switch (hide_if_empty) {
      case "none":
        break;
      case "section":
        $el.closest(`.shopify-section`)?.classList.toggle("!hidden", controlProducts?.length === 0);
        break;
      case "container":
        $el
          .closest(`[data-style-id]:not([data-style-id="${$el.getAttribute("data-style-id")}"])`)
          ?.classList.toggle("!hidden", controlProducts?.length === 0);
        break;
      case "block":
        $el?.classList.toggle("!hidden", controlProducts?.length === 0);
        break;
    }

    cart.gift_products[block_id] = controlProducts;

    const renderProducts = controlProducts?.filter(
      (prod, index) => prod.handle !== $el.children?.[index]?.getAttribute("data-product-handle")
    );

    if (!renderProducts.length) {
      return;
    }

    const nonProductElements = $el.querySelectorAll(":scope > :not([data-product-handle])");

    $el.innerHTML = "";
    nonProductElements.forEach((el) => {
      $el.appendChild(el);
    });

    controlProducts.forEach((prod, i, arr) => {
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
        div.setAttribute("class", `shrink-0 max-w-full w-full h-full order-[--order]`);
        div.style.setProperty("--order", `${(i + 1) * 10}`);
        node.removeAttribute(`data-product-card`);
        node.setAttribute("data-product-handle", prod.handle);
        node.setAttribute("data-product-id", `${prod.id}`);
        node.setAttribute("data-gift-with-purchase", `${block_id}`);
        if (hide_in_cart) {
          node.setAttribute("data-hide-in-cart", `true`);
        }
        node.classList.add("card-loading");
        node.querySelectorAll("[data-loop-item], [data-x-if], style").forEach((el) => {
          el.remove();
        });
        div.appendChild(node);
        $el.appendChild(div);
      }
    });
  };

  const getDynamicTextWithFormattedPrice = (content) => {
    return (
      content?.replace(/\[([^\]]*)\]/gi, (...matches) => {
        // @ts-ignore
        return matches?.[1]?.split(".").reduce(
          (acc, selector) => {
            if (!selector || acc[0] === undefined || acc[0] === null) {
              if (/price$/gi.test(acc[1]) && typeof acc[0] === "number") {
                return [utils.formatMoney(acc[0]), selector];
              }
              return acc;
            }

            if (acc[0] && selector in acc[0]) {
              if (/price$/gi.test(selector) && typeof acc[0][selector] === "number") {
                return [utils.formatMoney(acc[0][selector]), selector];
              }
              return [acc[0][selector], selector];
            }
            return ["", ""];
          },
          [{ cart: cart.state }, ""]
        )[0];
      }) ?? ""
    );
  };

  const getBundleLineItem = async () => {
    const itemsWithProductData = await Promise.all(
      cart.state.items?.map(async (lineItem) => {
        const product = _products[lineItem?.handle] ?? (await _product.getProductData(lineItem?.handle, lineItem?.product_id));

        return {
          line_item: lineItem,
          product: product,
          variant: product?.variants?.find((variant) => variant.id === lineItem?.variant_id),
        };
      })
    );
    const item = itemsWithProductData.find((item) => item?.product?.metafields?.smart?.bundle_parent);
    const bundleParent = item?.product?.metafields?.smart?.bundle_parent?.[0];
    if (item && bundleParent) {
      cart.bundle.parent = bundleParent;
      cart.bundle.child = item;
    }
  };

  const getBundleParentDynamicTextWithFormattedPrice = (content, product) => {
    return utils.getBracketInputDynamicPluralizedText(content, product);
  };

  const upgradeLineItemToBundle = async () => {
    if (cart.loading || cart.isChanging || !cart.bundle.parent || !cart.bundle.child || cart.bundle.added) {
      return;
    }

    cart.loading = true;
    cart.isChanging = true;
    try {
      const key = cart.bundle.child.line_item.key;

      await fetch("/cart/change.js?smart_theme=true", {
        method: "POST",
        headers,
        body: JSON.stringify({ id: key, quantity: 0 }),
      }).then((res) => res.json());

      await _cart.add({
        items: [
          {
            id: cart.bundle.parent.selected_variant_id || cart.bundle.parent.variants[0]?.id,
            quantity: 1,
            selling_plan: null,
          },
        ],
      });

      /* NB: State will have updated by this point */
      const cartItemIndex = cart.state.items.findIndex((item) => item.key === key);

      if (cartItemIndex !== -1) {
        cart.state.items[cartItemIndex].quantity = 0;
      }

      cart.bundle.added = true;
    } catch (e) {
      _stores.toast.addToast({
        type: "error",
        target: "cart",
        title: "Cart Error",
        content: e.statusMessage,
      });
    } finally {
      cart.isChanging = false;
      cart.loading = false;
    }
  };

  const debounceCartUpdates = window.Alpine.debounce(async () => {
    const b = cart.history[0]?.items.reduce((acc, item) => {
      acc[`${item.key}`] = item.quantity;
      return acc;
    }, {});
    if (!utils.deepEqual(b, cart.debounce_updates) && Object.keys(cart.debounce_updates ?? {}).length) {
      cart.loading = true;

      const new_gift_with_purchase_disable_auto_add = [
        ...new Set([
          ...cart._gift_with_purchase_disable_auto_add,
          ...cart.state.items
            .map((item) =>
              item.properties._gift_with_purchase_auto_add && cart.debounce_updates[item.key] <= 0 ? item.variant_id : null
            )
            .filter(Boolean),
        ]),
      ];

      if (!utils.deepEqual(cart._gift_with_purchase_disable_auto_add, new_gift_with_purchase_disable_auto_add)) {
        cart._gift_with_purchase_disable_auto_add = new_gift_with_purchase_disable_auto_add;
        sessionStorage.setItem("_gift_with_purchase_disable_auto_add", JSON.stringify(new_gift_with_purchase_disable_auto_add));
      }

      await update({ updates: cart.debounce_updates });

      cart.debounce_updates = {};
      cart.loading = false;
    }
    cart.loading = false;
  }, 650);

  const ensureCartCookies = () => {
    const currentToken = utils.getCookie("cart");

    if (currentToken) {
      sessionStorage.setItem("_shopify_stable_cart_token", currentToken);
    }

    setInterval(async () => {
      const testCookie = utils.getCookie("_shopify_test");
      const newCartToken = utils.getCookie("cart");
      const storedToken = sessionStorage.getItem("_shopify_stable_cart_token");

      if (testCookie === "1") {
        console.warn("[Cart Restorer] Detected _shopify_test=1 (CLI dev mode)");
      }

      if (storedToken && newCartToken && newCartToken !== storedToken) {
        utils.setCookie("cart", storedToken);

        fetch("/cart/update.js?smart_theme=true", {
          method: "POST",
          headers,
          body: JSON.stringify({ updates: {}, attributes: {}, token: storedToken }),
        });
      }

      // Update sessionStorage if cart was just created
      if (!storedToken && newCartToken) {
        sessionStorage.setItem("_shopify_stable_cart_token", newCartToken);
      }
    }, 3000);
  };

  ensureCartCookies();

  window.Alpine.effect(() => {
    cart.state.item_count = cart.state.items
      ?.filter((item) => !item?.properties?._p_id_link && !item?.properties?._p_hidden)
      ?.reduce((acc, item) => (acc += item.quantity), 0);
    window._cart_data = cart.state;
  });

  window.Alpine.effect(async () => {
    if (cart.loading || cart.isChanging) return;

    const itemsWithProductData = await Promise.all(
      cart.state.items?.map(async (lineItem) => {
        const product = _products[lineItem?.handle] ?? (await _product.getProductData(lineItem?.handle, lineItem?.product_id));
        const variant = product?.variants?.find((v) => v.id === lineItem?.variant_id);

        return {
          line_item: lineItem,
          variant,
        };
      })
    );

    cart.state.original_pre_selling_plan_total_price = itemsWithProductData.reduce((acc, item) => {
      const compare_at = Math.max(
        item.line_item?.original_price ?? 0,
        item.variant?.compare_at_price ?? 0,
        item.line_item?.selling_plan_allocation?.compare_at_price ?? 0
      );
      return acc + compare_at * item.line_item.quantity;
    }, 0);
    cart.state.selling_plan_discount_applications = cart.state?.items?.reduce((acc, item) => {
      if (!item?.selling_plan_allocation?.selling_plan?.name) {
        return acc;
      }
      const index = acc.findIndex((selling_plan) => selling_plan.name === item?.selling_plan_allocation?.selling_plan?.name);

      if (index !== -1) {
        acc[index].value +=
          (item?.selling_plan_allocation?.compare_at_price - item?.selling_plan_allocation?.price) * item?.quantity;
        return acc;
      }

      acc.push({
        name: item?.selling_plan_allocation?.selling_plan?.name,
        value: (item?.selling_plan_allocation?.compare_at_price - item?.selling_plan_allocation?.price) * item?.quantity,
      });

      return acc;
    }, []);
  });

  window.Alpine.effect(() => {
    if (Object.keys(cart.debounce_updates ?? {})?.length) {
      debounceCartUpdates();
    }
  });

  Alpine.effect(() => {
    cart.state.items?.forEach((a, i, arr) => {
      if (a?.properties?._p_id_link && !arr.find((b) => b.properties?._p_id)) {
        updateLineItemQuantity(0, i);
      }
    });
  });

  Alpine.effect(async () => {
    if (cart.loading || cart.isChanging) return;

    const itemsWithProductData = await Promise.all(
      cart.state.items?.map(async (lineItem) => {
        const product = _products[lineItem?.handle] ?? (await _product.getProductData(lineItem?.handle, lineItem?.product_id));

        return {
          line_item: lineItem,
          product: product,
          variant: product?.variants?.find((variant) => variant.id === lineItem?.variant_id),
        };
      })
    );
    const possible_selling_plans = new Map();

    itemsWithProductData.forEach((item) => {
      item.variant?.selling_plan_allocations?.forEach((selling_plan) => {
        possible_selling_plans.set(selling_plan.selling_plan.id, selling_plan.selling_plan);
      });
    });

    cart.possible_selling_plans = [...possible_selling_plans.values()];
    cart.cart_selling_plan_discount_wording = "";

    const selling_plan =
      cart.possible_selling_plans.find((plan) => plan.id === cart.cart_selling_plan_id) ?? cart.possible_selling_plans?.[0];

    cart.cart_selling_plan_discount_wording = selling_plan?.price_adjustments?.[0]?.value
      ? selling_plan?.price_adjustments?.[0]?.value_type === "fixed_amount"
        ? `${utils.formatMoney(
            itemsWithProductData.reduce((acc, entry) => {
              const plan = entry.variant.selling_plan_allocations?.find(
                (allocation) => allocation.selling_plan?.id === selling_plan.id
              );
              if (plan) {
                acc += plan.selling_plan.price_adjustments?.[0]?.value * entry.line_item.quantity;
              }
              return acc;
            }, 0)
          )}`
        : selling_plan?.price_adjustments?.[0]?.value_type === "percentage"
        ? `${selling_plan?.price_adjustments?.[0]?.value}%`
        : ""
      : "";
  });

  Alpine.effect(() => {
    if (cart.global_subscriptions && !cart.isSubscriptionChanging) {
      const initial_selling_plan = cart.state?.items?.find((item) => item?.selling_plan_allocation?.selling_plan?.id)
        ?.selling_plan_allocation?.selling_plan;
      cart.cart_selling_plan_id = initial_selling_plan?.id;
      cart.cart_selling_plan_name = initial_selling_plan?.name;
    }
  });

  Alpine.effect(() => {
    cart.bundle.parent = null;
    cart.bundle.child = null;
    cart.bundle.added = false;
    if (cart.state.items.length > 0) {
      getBundleLineItem();
    }
  });

  document.addEventListener("productAddedToCart", async (event) => {
    const updatedCart = cart.state;
    if (typeof window._learnq !== "undefined") {
      const cartData = {
        total_price: updatedCart.total_price / 100,
        $value: updatedCart.total_price / 100,
        total_discount: updatedCart.total_discount,
        original_total_price: updatedCart.original_total_price / 100,
        items: updatedCart.items,
      };

      window._learnq.push(["track", "Added to Cart", cartData]);
    }
  });

  const initDynamicLineItemCards = (
    $el,
    {
      line_item_card_class,
      hide_if_empty,
      order_offset = 1,
      section_id,
      block_id,
      handleResize = () => {},
      addon_id,
      filter_keys,
      filter_keys_include,
    }
  ) => {
    const container = $el.parentElement;

    const cart = window.Alpine.store("cart");
    const modal = window.Alpine.store("modal");
    const editor = window.Alpine.store("editor");

    const renderDynamicLineItemCards = async () => {
      handleResize();
      setTimeout(() => handleResize, 50);

      let sourceNode = document.querySelector(`[data-line-item-card='${line_item_card_class}']`);

      if (!sourceNode && !window.modalsLoaded) {
        await new Promise((resolve) => {
          document.addEventListener(
            "modalsLoaded",
            () => {
              sourceNode = document.querySelector(`[data-line-item-card='${line_item_card_class}']`);
              resolve(true);
            },
            { once: true }
          );
        });
      }

      let items = addon_id
        ? cart.state.items?.filter((item) => item?.properties?._p_id_link === addon_id && item.quantity)
        : cart.state.items?.filter((item) => !item?.properties?._p_id_link && !item?.properties?._p_hidden && item.quantity);

      if (filter_keys?.trim()) {
        const filter_keys_arr = filter_keys.split(",").map((key) => key.trim());
        items = items.filter((item) => !Object.keys(item?.properties).some((key) => filter_keys_arr.includes(key.trim())));
      }
      if (filter_keys_include?.trim()) {
        const filter_keys_arr = filter_keys_include.split(",").map((key) => key.trim());
        items = items.filter((item) => Object.keys(item?.properties).some((key) => filter_keys_arr.includes(key.trim())));
      }

      switch (hide_if_empty) {
        case "none":
          break;
        case "section":
          container.closest(`.shopify-section`)?.classList.toggle("!hidden", items?.length === 0);
          break;
        case "container":
          container
            .closest(`[data-style-id]:not([data-style-id="${container.getAttribute("data-style-id")}"])`)
            ?.classList.toggle("!hidden", items?.length === 0);
          break;
        case "block":
          break;
      }

      const existingItems = [...container.querySelectorAll(`[data-render-index*="${block_id}--"]`)].filter((el) => {
        if (items.some((lineItem) => el.getAttribute("data-line-item-id") === lineItem.key && lineItem.quantity)) return true;
        el.remove();
        return false;
      });

      items?.forEach((lineItem, i, arr) => {
        const existingItem = existingItems.find((el) => el.getAttribute("data-line-item-id") === lineItem.key);
        if (existingItem) {
          existingItem.setAttribute("data-render-index", `${block_id}--${i}`);
          existingItem.style.setProperty("--order", `${(i + order_offset) * 10}`);
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
          div.setAttribute("data-line-item-id", lineItem.key);
          div.setAttribute("data-style-id", `${section_id}--${block_id}`);
          div.setAttribute("data-render-index", `${block_id}--${i}`);
          div.setAttribute("class", `shrink-0 max-w-full w-full order-[--order]`);
          div.style.setProperty("--order", `${(i + order_offset) * 10}`);
          node.removeAttribute(`data-line-item-card`);
          node.setAttribute("data-line-item-id", lineItem.key);
          node.querySelectorAll("[data-loop-item], [data-x-if], style").forEach((el) => el.remove());
          node.classList.add("card-loading");
          div.appendChild(node);
          container.appendChild(div);
        }
      });

      handleResize();
    };

    renderDynamicLineItemCards();

    Alpine.effect(() => {
      const show =
        !container.closest("[data-dynamic-modals]") ||
        editor?.select_section_id === section_id ||
        modal.id === "modal--cart-drawer";

      if ((cart.state.total_price || cart.state.item_count || cart.state.item_count <= 0) && show) {
        renderDynamicLineItemCards();
      }
    });
  };

  const setSubscription = async (selling_plan_id) => {
    cart.isSubscriptionChanging = true;
    cart.cart_selling_plan_id = +selling_plan_id;
    cart.cart_selling_plan_name = cart.possible_selling_plans?.find((plan) => +plan.id === +selling_plan_id)?.name;

    const itemsWithProductData = await Promise.all(
      cart.state.items?.map(async (lineItem) => {
        const product = _products[lineItem?.handle] ?? (await _product.getProductData(lineItem?.handle, lineItem?.product_id));

        return {
          line_item: {
            ...lineItem,
          },
          product: product,
          variant: product?.variants?.find((variant) => variant.id === lineItem?.variant_id),
        };
      })
    );

    const changeProducts = itemsWithProductData?.filter(
      (item) =>
        item.variant?.selling_plan_allocations?.length &&
        +item.line_item?.selling_plan_allocation?.selling_plan?.id !== +selling_plan_id
    );

    let items = cart.state.items;

    if (changeProducts?.length && changeProducts?.length <= 2) {
      for (const item of changeProducts) {
        const lineItem =
          items.find((lineItem) => lineItem.key === item.line_item.key) ??
          items.find(
            (lineItem) =>
              lineItem.id === item.line_item.id &&
              lineItem.quantity === item.line_item.quantity &&
              utils.deepEqual(lineItem.properties, item.line_item.properties)
          );

        if (!lineItem) continue;
        cart.isChanging = true;

        const result = await fetch("/cart/change.js?smart_theme=true", {
          method: "POST",
          headers,
          body: JSON.stringify({
            id: lineItem?.key,
            quantity: lineItem?.quantity,
            selling_plan: +selling_plan_id,
          }),
        })
          .then((res) => res.json())
          .catch(async (e) => {
            _stores.toast.addToast({
              type: "error",
              target: "cart",
              title: "Cart Error",
              content: e.statusMessage,
            });
            return await get();
          });

        items = result?.items ?? cart?.state?.items;
      }

      requestIdleCallback(() => {
        _cart.get();
      });
    }

    if (changeProducts?.length > 2) {
      await fetch("/cart/clear.js?smart_theme=true", {
        method: "POST",
        headers,
      });

      await add({
        items: itemsWithProductData?.toReversed().map((item) => ({
          id: item.line_item.variant_id,
          quantity: item.line_item.quantity,
          properties: item.line_item.properties ?? {},
          selling_plan:
            item.variant?.selling_plan_allocations?.length &&
            +item.line_item?.selling_plan_allocation?.selling_plan?.id !== +selling_plan_id
              ? selling_plan_id || undefined
              : item.line_item?.selling_plan_allocation?.selling_plan?.id || undefined,
        })),
        attributes: cart?.state.attributes,
      });
    }
    cart.isSubscriptionChanging = false;
  };

  window._cart = {
    add,
    get,
    update,
    change,
    clear,
    showConditionally,
    updateLineItemQuantity,
    getDynamicTextWithFormattedPrice,
    renderGiftProducts,
    initDynamicLineItemCards,
    setSubscription,
    getBundleParentDynamicTextWithFormattedPrice,
    upgradeLineItemToBundle,
  };

  return {
    add,
    get,
    update,
    change,
    clear,
    showConditionally,
    updateLineItemQuantity,
    getDynamicTextWithFormattedPrice,
    renderGiftProducts,
    initDynamicLineItemCards,
    setSubscription,
    getBundleParentDynamicTextWithFormattedPrice,
    upgradeLineItemToBundle,
  };
};

document.addEventListener("alpine:init", initCart);
