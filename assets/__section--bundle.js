const initBundle = ($el) => {
  const random_id = utils.shortUUID();
  const preorder_threshold = +(window.theme_settings.data__product__variant__preorder_threshold ?? 1);

  const bundle_products = [...$el.querySelectorAll("[data-product-handle][data-product-id]")]?.map((element) => ({
    element,
    ..._product.getHtmlProduct(element.getAttribute("data-product-handle")),
  }));

  const section_settings = utils.JSONParse($el.getAttribute("data-section-settings"));

  const select_settings = utils.JSONParse($el.querySelector("[data-select-settings]")?.getAttribute("data-select-settings"));

  const select_type = select_settings?.type ?? "auto";

  const bundle_targets = [...($el.querySelectorAll("[data-bundle-target]") ?? [])].map((el) =>
    utils.JSONParse(el.getAttribute("data-bundle-target")),
  );

  const initial_bundle_target_id = bundle_targets?.[0]?.id;
  const initial_target = {
    ...bundle_targets?.[0],
  };

  bundle_targets?.sort((a, b) => a.settings?.target - b?.settings?.target);

  const bundle_target_objects = bundle_targets?.reduce((acc, item, i) => {
    acc[item.id] = item.settings;
    return acc;
  }, {});

  const incentive_targets = [...($el.querySelectorAll("[data-bundle-incentive-target]") ?? [])].map((el) =>
    utils.JSONParse(el.getAttribute("data-bundle-incentive-target")),
  );

  const bundle_type = section_settings.bundle_target_type;

  const addToBundle = ({ product, variant, price }) => {
    if (variant?.inventory_management && variant?.inventory_policy !== "continue") {
      const quantity_added = state.items_added.reduce((acc, item) => {
        if (item?.variant?.id === variant.id) {
          acc += 1;
        }
        return acc;
      }, 0);

      if (variant.inventory_quantity - quantity_added < 1) {
        _stores.toast.addToast({
          type: "error",
          title: "Not enough inventory",
          content: "It looks like you already added the item and the inventory limit has been reached.",
        });
        return;
      }
    }

    if (section_settings.restrict_bundle_quantity === "hard_limit") {
      if (state?.[bundle_type] < state.bundle_target?.target) {
        state.items_added.push({ product, variant, price_override: price });
      }
      return;
    }

    if (section_settings.restrict_bundle_quantity === "upgrade_limit") {
      const lastBundleTarget = [...bundle_targets].sort((a, b) => a?.settings?.target - b?.settings?.target)?.at(-1);
      if (state?.[bundle_type] < lastBundleTarget?.settings?.target) {
        state.items_added.push({ product, variant, price_override: price });
      } else {
        _stores.toast.addToast({
          type: "warning",
          title: "Your Bundle is already complete!",
        });
        return;
      }
    }

    if (section_settings.restrict_bundle_quantity === "no_limit") {
      state.items_added.push({ product, variant, price_override: price });
    }

    updateBundleById();
  };

  const removeFromBundle = ({ product, variant }) => {
    const index = state.items_added?.findLastIndex((item) => item?.variant?.id === variant?.id && item.product.id === product.id);
    state.items_added.splice(index, 1);
  };

  const state = window.Alpine.reactive({
    items_added: [],
    bundle_target_titles: [],
    bundle_target_id: initial_bundle_target_id,
    total_price: 0,
    discounted_price: 0,
    current_wording: "",
    difference_wording: "",
    target_wording: "",
    final_price: 0,
    before_discounts_price: 0,
    target_discount_wording: "",
    active_target_discount_wording: "",
    discount_wording: "",
    active_discount_wording: "",
    item_count: 0,
    target_difference: "",
    bundle_target: initial_target?.settings,
    achieved_bundle_target: null,
    incentive_target: incentive_targets?.[0],
    isAdding: false,
    items_added_to_cart: false,
    show_mobile_details: false,
    addToBundle: addToBundle,
    removeFromBundle: removeFromBundle,
    item_added_summary: [],
  });

  const getTargetTitles = () => {
    return bundle_targets?.map((item) => {
      const lowestPrice = Math.min(...bundle_products.map((product) => product.price_min));
      const highestPrice = Math.max(...bundle_products.map((product) => product.price_max ?? product.price));
      const priceVaries = (state?.final_price || lowestPrice) !== (state?.total_price || highestPrice);

      return item.label?.trim()
        ? `<span class="flex gap-2 w-full items-center">${utils.unescape(
            item.label
              ?.replace(
                "[price]",
                `<span>${utils.formatMoney(
                  state?.final_price ||
                    (lowestPrice -
                      ((item?.settings?.discount_percentage ?? 0) / 100) * lowestPrice -
                      (item?.settings?.discount_amount ?? 0)) *
                      (section_settings?.bundle_target_type === "item_count" ? item.settings?.target : 1)
                )}</span>`,
              )
              .replace(
                "[compare_at_price]",
                `<span class="opacity-50 line-through">${utils.formatMoney(
                  state?.total_price ||
                    lowestPrice * (section_settings?.bundle_target_type === "item_count" ? item.settings?.target : 1)
                )}</span>`,
              ),
          )}</span>`
        : `<span class="flex items-center gap-2">
       ${
         section_settings?.bundle_target_type === "total_price" && item.settings?.target
           ? `<span>Spend ${utils.formatMoney(item.settings?.target)}</span>`
           : ""
       }
       ${
         section_settings?.bundle_target_type === "item_count"
           ? `<span>${item.settings?.target} ${item.settings?.target === 1 ? "item" : "items"}</span>`
           : ""
       }
       ${
         item?.settings?.discount_percentage > 0 && select_settings?.discount_label?.trim()
           ? `<span class="${select_settings?.discount_label}">${item?.settings?.discount_percentage}% off</span>`
           : ""
       }
       ${
         item?.settings?.discount_amount > 0 && select_settings?.discount_label?.trim()
           ? `<span class="${select_settings?.discount_label}">${utils.formatMoney(
               item?.settings?.discount_percentage
             )} off</span>`
           : ""
       }
       ${
         select_settings?.price_content
           ? `<span class="flex-1 flex justify-end gap-2">
           ${select_settings?.price_content
             ?.replace(
               "[price]",
               `<span>${utils.formatMoney(
                 state?.final_price ||
                   (lowestPrice -
                     ((item?.settings?.discount_percentage ?? 0) / 100) * lowestPrice -
                     (item?.settings?.discount_amount ?? 0)) *
                     (section_settings?.bundle_target_type === "item_count" ? item.settings?.target : 1)
               )}</span>`,
             )
             .replace(
               "[compare_at_price]",
               priceVaries
                 ? `<span class="opacity-50 line-through">${utils.formatMoney(
                     state?.total_price ||
                       lowestPrice * (section_settings?.bundle_target_type === "item_count" ? item.settings?.target : 1)
                   )}</span>`
                 : ""
             )}`
           : ""
       }
      </span>`
            ?.replace(/\n/gi, "")
            .trim();
    });
  };

  state.bundle_target_titles = getTargetTitles();

  window.Alpine.effect(() => {
    state.item_count = state.items_added?.length;
    state.total_price = state.items_added.reduce((acc, item) => (acc += item?.price_override ?? item.variant?.price), 0);

    state.achieved_bundle_target = [...bundle_targets]
      .sort((a, b) => b.settings?.target - a?.settings?.target)
      ?.find((bundle) => bundle.settings.target <= state?.[bundle_type])?.settings;

    if (select_type === "auto") {
      state.bundle_target = [...bundle_targets]
        .sort((a, b) => a.settings?.target - a?.settings?.target)
        .find((bundle) => bundle.settings.target > state?.[bundle_type])?.settings;
    }

    state.discounted_price =
      state.total_price -
      (state.achieved_bundle_target?.discount_amount ?? 0) -
      state.total_price * ((state?.achieved_bundle_target?.discount_percentage ?? 0) / 100);

    state.before_discounts_price = state.total_price;

    state.final_price = state.discounted_price;

    state.target_difference =
      bundle_type === "item_count"
        ? state.bundle_target?.target - state.item_count > 0
          ? `${state.bundle_target?.target - state.item_count}`
          : ""
        : state.bundle_target?.target - state.total_price
        ? `${utils.formatMoney(state.bundle_target?.target - state.item_count)}`
        : "";

    state.target_wording =
      bundle_type === "item_count" ? `${state.bundle_target?.target}` : utils.formatMoney(state.bundle_target?.target);

    state.current_wording = bundle_type === "item_count" ? `${state.item_count}` : utils.formatMoney(state.total_price);

    state.difference_wording =
      bundle_type === "item_count"
        ? `${state.bundle_target?.target - state.item_count}`
        : utils.formatMoney(state.bundle_target?.target - state.total_price);

    state.target_discount_wording = state.bundle_target?.discount_amount
      ? `Save ${utils.formatMoney(state.bundle_target?.discount_amount)}`
      : state?.bundle_target?.discount_percentage
      ? `${state?.bundle_target?.discount_percentage}% off`
      : "";

    state.discount_wording = `${utils.roundToIndex((1 - state.final_price / state.total_price) * 100, 0)}% off`;

    state.active_target_discount_wording = state.total_price > state.final_price ? state.target_discount_wording : "";

    state.active_discount_wording = state.total_price > state.final_price ? state.discount_wording : "";

    state.item_added_summary = state?.items_added?.reduce((acc, item) => {
      const addedIndex = acc.findIndex((item2) => item?.variant?.id === item2?.variant?.id);
      if (addedIndex !== -1 && item.price_override === acc[addedIndex]["price_override"]) {
        acc[addedIndex]["quantity"] += 1;
      } else {
        acc.push({
          quantity: 1,
          price: item.variant?.price,
          compare_at_price: item.variant?.compare_at_price,
          ...item,
        });
      }
      return acc;
    }, []);

    state.bundle_target_titles = getTargetTitles();
  });

  const updateBundleById = (bundle_id = state.bundle_target_id) => {
    state.bundle_target_id = bundle_id;
    if (state.bundle_target_id || state.items_added?.length) {
      state.bundle_target = bundle_targets.find((target) => {
        if (bundle_type === "item_count") {
          return target.id === state.bundle_target_id && target.settings.target >= state.items_added?.length;
        } else {
          return target.id === state.bundle_target_id;
        }
      })?.settings;

      if (!state.bundle_target && bundle_targets?.length) {
        const bundle_target =
          [...bundle_targets]
            .sort((a, b) => a.settings.target - b.settings.target)
            .find((target) => {
              if (bundle_type === "item_count") {
                return target.settings.target >= state.items_added?.length;
              } else {
                return true;
              }
            }) ?? [...bundle_targets].sort((a, b) => b.settings.target - a.settings.target)?.[0];

        state.bundle_target = bundle_target?.settings;
        state.bundle_target_id = bundle_target?.id;
      }
    }
  };

  const handleAddToCart = async (action) => {
    try {
      state.isAdding = true;
      const data = await _cart.add({
        items: state.items_added?.map((item) => {
          return {
            id: item?.variant?.id,
            properties: {
              _bundle_id: random_id,
              Bundle: state.achieved_bundle_target?.label,
              Preorder:
                item?.variant?.preorder && item?.variant?.inventory_quantity < preorder_threshold
                  ? item?.variant?.preorder_date
                    ? `Shipping ${new Date(item?.variant.preorder_date).toLocaleDateString(navigator.language, {
                        month: "short",
                        year: "numeric",
                      })}`
                    : "true"
                  : undefined,
            },
            quantity: 1,
          };
        }),
      });
      if (data.cart_error) {
        state.isAdding = false;
        return;
      }

      if (action === "add_to_cart") {
        _stores.modal.setId("modal--cart-drawer");
      }

      if (action === "checkout") {
        document.querySelector('[data-cart-drawer-checkout-form] button[name="checkout"]')?.click();

        state.isAdding = false;
        state.items_added_to_cart = true;
        await utils.delay(3500);
        state.items_added_to_cart = false;
        return;
      }

      state.items_added = [];
      state.bundle_target_id = bundle_targets?.[0]?.id;
      state.total_price = 0;
      state.discounted_price = 0;
      state.final_price = 0;
      state.discount_wording = "";
      state.item_count = 0;
      state.target_difference = "";
      state.bundle_target = bundle_targets?.[0]?.settings;
      state.achieved_bundle_target = null;
      state.incentive_target = incentive_targets?.[0];
      state.isAdding = false;
      state.show_mobile_details = false;
      state.items_added_to_cart = true;
      await utils.delay(3500);
      state.items_added_to_cart = false;
    } catch (error) {
      /*console.log(error);*/
    }
  };

  const getDynamicText = (content) => {
    return utils.getBracketInputDynamicPluralizedText(content, state);
  };

  const getDynamicValue = (content) => {
    return utils.getBracketInputDynamicValue(content, state);
  };

  const getDynamicValueWithFallbacks = (content) => {
    return content.split(",")?.reduce((acc, item) => {
      acc ||= utils.getBracketInputDynamicValue(item.trim(), state);
      return acc;
    }, "");
  };

  const showConditionally = (show_conditionally) => {
    switch (show_conditionally) {
      case "always": {
        return true;
      }
      case "active_discount": {
        return !!state.active_discount_wording;
      }
      case "no_active_discount": {
        return !state.active_discount_wording;
      }
      case "target_reached": {
        return !state.target_difference;
      }
      case "target_not_reached": {
        return !!state.target_difference;
      }
    }
  };

  return {
    bundle: state,
    bundle_targets,
    bundle_target_objects,
    incentive_targets,
    section_settings,
    bundle_type,
    addToBundle,
    removeFromBundle,
    updateBundleById,
    handleAddToCart,
    getDynamicValue,
    getDynamicValueWithFallbacks,
    getDynamicText,
    showConditionally,
  };
};

// export type BundleState = ReturnType<InitBundle>["bundle"];

window._sections["initBundle"] = initBundle;

/* LAST HASH: 747f12e1b129d70566a8fc60e6e5b99139673198 */
