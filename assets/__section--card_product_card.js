const initProductCard = (
  $el,
  $refs,
  productHandle,
  productId,
  variantId,
  default_select_selling_plan = false,
  show_subscription_price = false
) => {
  let initialized = false;
  const isSameId = (a, b) => a != null && b != null && String(a) === String(b);
  const initialDiscountConfig = window.ctrDiscountDisplay?.parseConfig($el.getAttribute("data-ctr-discount-config"));
  const random_id = utils.shortUUID();
  const addon_target = $el
    .closest(".shopify-section")
    ?.querySelector(`form[data-product-handle="${$el.getAttribute("data-addon-product-target")}"]`);

  const addon_auto_add = $el.hasAttribute("data-addon-auto-add");
  const addon_bundle_in_cart = $el.hasAttribute("data-addon-cart-bundle");
  const preorder_threshold = +(window.theme_settings.data__product__variant__preorder_threshold ?? 1);

  const cart = window.Alpine.store("cart");

  const gallery = $el.querySelector(`[data-product-card-gallery]`);
  const gallerySettings = utils.JSONParse(gallery?.getAttribute("data-settings"));

  const option_blocks = [
    ...($el.querySelectorAll("[data-options-block]")?.length
      ? $el.querySelectorAll("[data-options-block]")
      : $el.querySelector("template")?.content?.querySelectorAll("[data-options-block]") ?? []),
  ].map((block) => utils.JSONParse(block.getAttribute("data-options-block")));

  let product = _products[productHandle] ?? _product.getHtmlProduct(productHandle);

  if (!product && productHandle) {
    _product.getProductData(productHandle, productId).then((res) => {
      updateProductState(res, variantId);
    });
  }

  product ??= _products[productHandle];

  const selected_variant = _product.getSelectedVariant(product, variantId);

  const parseJson = (value) => {
    if (typeof value !== "string") return value;
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  };

  const normalizeSellingPlanId = (id) => {
    if (id == null || id === "") return null;
    const match = `${id}`.match(/(\d{10,})/);
    return match ? match[1] : `${id}`;
  };

  const getSelectedAllocation = (variant, selling_plan) => {
    if (!variant?.selling_plan_allocations?.length) return null;
    if (selling_plan?.id) {
      return (
        variant.selling_plan_allocations.find((allocation) => allocation?.selling_plan?.id === selling_plan.id) ??
        variant.selling_plan_allocations[0]
      );
    }
    return variant.selling_plan_allocations[0];
  };

  const getVariantSubscriptionMetafieldPrice = (variant) => {
    const raw =
      variant?.metafields?.custom?.choose_supply_variant_price?.value ??
      variant?.metafields?.custom?.choose_supply_variant_price;
    const value = Number(raw);
    return Number.isFinite(value) && value > 0 ? value : null;
  };

  const walkMetafieldDiscountEntries = (variant, product, visitor) => {
    const queue = [variant?.metafields, product?.metafields];
    const visited = new WeakSet();

    while (queue.length) {
      const current = parseJson(queue.shift());
      if (!current || typeof current !== "object") continue;

      if (Array.isArray(current)) {
        for (const entryRaw of current) {
          const entry = parseJson(entryRaw);
          if (!entry || typeof entry !== "object") continue;

          const planId = entry.selling_plan_id ?? entry.sellingPlanId ?? entry.plan_id ?? entry.id;
          const displayPercent = Number(entry.display_percent ?? entry.displayPercent ?? entry.percent);
          if (Number.isFinite(displayPercent) && displayPercent > 0) {
            visitor({ planId, displayPercent });
          }

          if (entry.value !== undefined && entry.value !== null) {
            queue.push(entry.value);
          }
        }
        continue;
      }

      if (visited.has(current)) continue;
      visited.add(current);
      Object.values(current).forEach((value) => {
        if (value !== undefined && value !== null) {
          queue.push(value);
        }
      });
    }
  };

  const resolvePlanDisplayPercent = (variant, product, sellingPlanId) => {
    const targetPlanId = normalizeSellingPlanId(sellingPlanId);
    if (!targetPlanId) return null;

    let matched = null;
    walkMetafieldDiscountEntries(variant, product, ({ planId, displayPercent }) => {
      if (normalizeSellingPlanId(planId) === targetPlanId) {
        matched = displayPercent;
      }
    });

    return matched;
  };

  const resolveMaxDisplayPercent = (variant, product) => {
    let maxPercent = null;
    walkMetafieldDiscountEntries(variant, product, ({ displayPercent }) => {
      if (maxPercent == null || displayPercent > maxPercent) {
        maxPercent = displayPercent;
      }
    });
    return maxPercent;
  };

  const getEffectiveSellingPlan = (variant, product, selectedSellingPlan) => {
    if (selectedSellingPlan?.id) return selectedSellingPlan;
    return variant?.selling_plan_allocations?.[0]?.selling_plan ?? null;
  };

  const getAllocationAdjustedPrice = (variant, selling_plan, basePrice) => {
    let discounted_price = basePrice ?? variant?.price ?? 0;
    const selected_allocation = getSelectedAllocation(variant, selling_plan);
    const price_adjustment = selling_plan?.price_adjustments?.[0] ?? selected_allocation?.selling_plan?.price_adjustments?.[0];

    if (price_adjustment?.value_type === "fixed_amount") {
      discounted_price = Math.max(discounted_price - Math.round(+price_adjustment?.value), 0);
    }

    if (price_adjustment?.value_type === "percentage") {
      discounted_price = Math.max(discounted_price - Math.round((+price_adjustment?.value / 100) * discounted_price), 0);
    }

    if (selected_allocation?.price > 0) {
      discounted_price = Math.min(discounted_price, selected_allocation.price);
    }

    return discounted_price;
  };

  const resolveCardPricing = (variant, product, selling_plan) => {
    const oneTimePrice = variant?.price ?? 0;
    const oneTimeCompareAt = Math.max(variant?.compare_at_price ?? 0, oneTimePrice);
    const hasAllocations = !!variant?.selling_plan_allocations?.length;

    if (!hasAllocations) {
      const effectiveDiscountPercent =
        oneTimeCompareAt > oneTimePrice ? Math.round(((oneTimeCompareAt - oneTimePrice) * 100) / oneTimeCompareAt) : 0;

      return {
        effectivePrice: oneTimePrice,
        effectiveCompareAt: oneTimeCompareAt,
        effectiveDiscountPercent,
        isSubscription: false,
      };
    }

    const effectivePlan = getEffectiveSellingPlan(variant, product, selling_plan);
    const selected_allocation = getSelectedAllocation(variant, effectivePlan);
    const planId = selected_allocation?.selling_plan?.id ?? effectivePlan?.id;
    const effectiveCompareAt = Math.max(
      selected_allocation?.compare_at_price ?? 0,
      variant?.compare_at_price ?? 0,
      variant?.price ?? 0
    );
    const metafieldPrice = getVariantSubscriptionMetafieldPrice(variant);
    const displayPercent =
      resolvePlanDisplayPercent(variant, product, planId) ?? resolveMaxDisplayPercent(variant, product);

    let effectivePrice = oneTimePrice;
    let effectiveDiscountPercent = 0;

    if (displayPercent && effectiveCompareAt > 0) {
      effectivePrice = Math.max(effectiveCompareAt - Math.round((displayPercent / 100) * effectiveCompareAt), 0);
      effectiveDiscountPercent = displayPercent;
    } else {
      effectivePrice = getAllocationAdjustedPrice(variant, effectivePlan, oneTimePrice);
      if (effectiveCompareAt > effectivePrice) {
        effectiveDiscountPercent = Math.round(((effectiveCompareAt - effectivePrice) * 100) / effectiveCompareAt);
      }
    }

    if (metafieldPrice && metafieldPrice < effectivePrice) {
      effectivePrice = metafieldPrice;
      if (effectiveCompareAt > metafieldPrice) {
        effectiveDiscountPercent = Math.round(((effectiveCompareAt - metafieldPrice) * 100) / effectiveCompareAt);
      }
    }

    return {
      effectivePrice,
      effectiveCompareAt,
      effectiveDiscountPercent,
      isSubscription: true,
    };
  };

  const applyResolvedPricing = () => {
    const pricing = resolveCardPricing(state.selected_variant, state.product, state.selected_selling_plan);
    state.selected_price = pricing.effectivePrice;
    state.selected_compare_at_price = pricing.effectiveCompareAt;
    state.effective_discount_percent = pricing.effectiveDiscountPercent;
    state.show_subscription_price = show_subscription_price;
    state.selling_plan_discount_wording = getSellingPlanDiscountWording(
      state.selected_variant,
      getEffectiveSellingPlan(state.selected_variant, state.product, state.selected_selling_plan),
      state.product,
      pricing.effectiveDiscountPercent
    );
  };

  const getSellingPlanDiscountWording = (variant, selling_plan, product, effectiveDiscountPercent = null) => {
    if (effectiveDiscountPercent > 0) {
      return `${effectiveDiscountPercent}%`;
    }

    const value = Number(selling_plan?.price_adjustments?.[0]?.value);
    const type = selling_plan?.price_adjustments?.[0]?.value_type;
    if (value && type === "fixed_amount") {
      return `${utils.formatMoney(value)}`;
    }
    if (value && type === "percentage") {
      return `${value}%`;
    }

    const selected_allocation = getSelectedAllocation(variant, selling_plan);
    const display_percent = resolvePlanDisplayPercent(
      variant,
      product,
      selected_allocation?.selling_plan?.id ?? selling_plan?.id
    );
    if (display_percent) return `${display_percent}%`;

    const max_display_percent = resolveMaxDisplayPercent(variant, product);
    if (max_display_percent) return `${max_display_percent}%`;

    return "";
  };

  const selling_plan_allocations = selected_variant?.selling_plan_allocations;
  const selected_selling_plan =
    default_select_selling_plan || product?.requires_selling_plan ? selling_plan_allocations?.[0]?.selling_plan : null;
  const initialPricing = resolveCardPricing(selected_variant, product, selected_selling_plan);

  const available_quantity =
    selected_variant?.inventory_management === "shopify" && selected_variant?.inventory_policy === "deny"
      ? selected_variant?.inventory_quantity -
        cart?.state?.items?.reduce((acc, line) => (line.variant_id === selected_variant.id ? acc + line.quantity : acc), 0)
      : selected_variant?.preorder && selected_variant?.preorder_quantity
      ? selected_variant?.inventory_quantity +
        selected_variant?.preorder_quantity -
        cart?.state?.items?.reduce((acc, line) => (line.variant_id === selected_variant.id ? acc + line.quantity : acc), 0)
      : 99999;

  const state = Alpine.reactive({
    random_id,
    addon_target,
    addon_auto_add,
    addon_bundle_in_cart,
    product_handle: productHandle,
    initial_variant_id: variantId,
    images_cleaned: false,
    hydrated: !!product,
    variant_changed: false,
    product: product,
    selected_media_id: product?.media?.[0]?.id,
    previous_selected_media_id: product?.media?.[0]?.id,
    properties: {},
    selected_variant,
    selling_plan_allocations,
    selected_selling_plan,
    last_selected_selling_plan: selected_selling_plan,
    selling_plan_discount_wording: getSellingPlanDiscountWording(
      selected_variant,
      selected_selling_plan,
      product,
      initialPricing.effectiveDiscountPercent
    ),
    effective_discount_percent: initialPricing.effectiveDiscountPercent,
    show_subscription_price,
    isAdding: false,
    selected_options: selected_variant?.options ?? [],
    quantity: 1,
    sibling_handle: "",
    hasVariants: product?.variants?.length > 1 || product?.variants?.[0]?.title !== "Default Title",
    hasSubscription: !!selected_variant?.options?.length,
    soldOut: available_quantity <= 0,
    available_quantity,
    preorder:
      selected_variant?.preorder &&
      selected_variant?.inventory_quantity -
        cart?.state?.items?.reduce((acc, line) => (line.variant_id === selected_variant.id ? acc + line.quantity : acc), 0) <
        preorder_threshold,
    gallery_media: product?.media ?? [],
    selected_price: initialPricing.effectivePrice,
    selected_compare_at_price: initialPricing.effectiveCompareAt,
    ctr_discount_config:
      initialDiscountConfig ?? window.ctrDiscountDisplay?.parseConfig(product?.metafields?.custom?.ctr_discount_config),
  });

  if (product && !product._full_data) {
    _product.getHydratedProductData(productHandle, productId).then((res) => {
      if (state.product?.handle === res.handle) {
        state.product = res;
        state.selected_variant = _product.getSelectedVariant(state.product, state.selected_variant?.id ?? variantId);
        state.selling_plan_allocations = state.selected_variant?.selling_plan_allocations;

        if (
          state.selected_selling_plan &&
          !state.selling_plan_allocations?.some((allocation) => allocation?.selling_plan?.id === state.selected_selling_plan?.id)
        ) {
          state.selected_selling_plan = state.selling_plan_allocations?.[0]?.selling_plan ?? null;
        }

        applyResolvedPricing();
      }
    });
  }

  const handleImageSelection = (filter_images, variant = state.selected_variant) => {
    switch (filter_images) {
      case "show_all": {
        return state.product?.media;
      }
      case "selected_variant": {
        return state.product?.media?.filter((media) => media.id === variant?.featured_media?.id);
      }
      case "variant_images_by_order": {
        let hide = true;

        return state.product?.media?.filter((media) => {
          if (media.id === variant?.featured_media?.id) {
            hide = false;
          }

          if (state.product?.variants.map((v) => v?.featured_media?.id).includes(media.id)) {
            hide = true;
          }
          return !hide;
        });
      }
      case "variant_images_by_metafield": {
        return [
          ...(state.product?.media?.filter((media) => media.id === variant?.featured_media?.id) ?? []),
          ...(state.selected_variant?.metafields?.smart?.images ?? []),
        ];
      }
      case "variant_images_and_unassigned": {
        return [
          ...(state.product?.media?.filter((media) => media.id === variant?.featured_media?.id) ?? []),
          ...(state.product?.media?.filter(
            (media) => !state.product?.variants.map((v) => v?.featured_media?.id).includes(media.id)
          ) ?? []),
        ];
      }
      case "only_unassigned": {
        return state.product?.media?.filter(
          (media) => !state.product?.variants.map((v) => v?.featured_media?.id).includes(media.id)
        );
      }
      case "first_or_selected_image": {
        return state.product?.media?.filter((media) => media.id === state.selected_media_id);
      }
    }
  };

  const scrollToMediaById = async (mediaId, scrollContainer) => {
    const isHorizontal = () => {
      return !!(
        getComputedStyle(scrollContainer).overflowY === "hidden" ||
        getComputedStyle(scrollContainer).gridAutoFlow === "column" ||
        scrollContainer.scrollWidth > scrollContainer?.clientWidth
      );
    };
    await utils.delay(5);

    const image = scrollContainer?.querySelector(`[data-media-id="${mediaId}"]`);

    if (!image) return;
    await utils.delay(5);
    const header = document.querySelector(".header-sections-container");
    const offsetHeight = Math.max(180, header?.getBoundingClientRect()?.bottom ?? 0);
    const imageOffset = utils.getElementPosition(image);

    await utils.delay(20);

    if (utils.isElementScrollable(scrollContainer)) {
      let scrollSnap = false;
      if (["snap-both", "snap-x", "snap-y"].some((c) => scrollContainer?.classList?.contains(c))) {
        scrollContainer?.classList.remove("snap-both", "snap-x", "snap-y");
        scrollSnap = true;
      }
      utils.scrollToXY(200, image.offsetLeft, image.offsetTop, scrollContainer, () => {
        if (scrollSnap) {
          scrollContainer?.classList.add(isHorizontal() ? "snap-x" : "snap-y");
        }
        state.selected_media_id = mediaId;
      });
      return;
    }

    if (scrollContainer.closest("[data-modal-id]")) return;

    utils.scrollToXY(
      200,
      image.offsetLeft,
      imageOffset.top - offsetHeight - +getComputedStyle(scrollContainer).paddingTop.replace("px", ""),
      window,
      () => {
        state.selected_media_id = mediaId;
      }
    );
  };

  const handleAddToCart = async (e, openCartDrawer = true) => {
    const random_id = utils.shortUUID();

    const properties = {};
    const form = $el.querySelector("form");
    const giftItemBlockId = $el.closest("[data-gift-with-purchase]")?.getAttribute("data-gift-with-purchase");
    const isHiddenItem = !!$el.closest("[data-hide-in-cart]");

    if (giftItemBlockId) {
      properties["_gift_with_purchase"] = giftItemBlockId;
    }
    if (isHiddenItem) {
      properties["_p_hidden"] = "true";
    }

    if (state.selected_variant?.preorder && state.selected_variant?.inventory_quantity < preorder_threshold) {
      properties["Preorder"] = `true`;
      if (state.selected_variant?.preorder_date) {
        properties["Preorder"] = `Shipping ${new Date(state.selected_variant.preorder_date).toLocaleDateString(
          navigator.language,
          {
            month: "short",
            year: "numeric",
          }
        )}`;
      }
    }

    if (form) {
      Object.entries(utils.serializeForm(form))?.forEach(([key, value]) => {
        if (key.includes("properties[") && value) {
          properties[key.replace(/^properties\[(.*)]$/gi, "$1")] = value;
        }
      });
    }

    e?.preventDefault();
    e?.stopPropagation();
    state.isAdding = true;
    const data = await _cart.add({
      items: [
        {
          id: state.selected_variant.id,
          quantity: state.quantity,
          selling_plan: cart.global_subscriptions
            ? state.selected_variant?.selling_plan_allocations?.find(
                (plan) => plan.selling_plan?.id === cart.cart_selling_plan_id
              )?.selling_plan?.id
            : state.selected_selling_plan?.id,
          properties: {
            ...properties,
            ...state.properties,
          },
        },
      ],
    });

    state.isAdding = false;

    if (!data.cart_error && openCartDrawer) {
      _stores.modal.setId("modal--cart-drawer");
      _stores.quickView.show = false;
    }
  };

  const handleBackInStockNotification = async (e) => {
    if (state?.selected_variant?.available) return;
    e.preventDefault();
    e.stopPropagation();
    _stores.modal.setId("back_in_stock");
    _stores.backInStockNotification.product = state.product;
    _stores.backInStockNotification.selected_variant = state.selected_variant;
  };

  const setSelectedVariant = (id) => {
    state.selected_variant = state.product.variants?.find((variant) => variant.id === id);
    state.selected_options = state.selected_variant?.options;
    state.variant_changed = true;

    if (
      state.selected_selling_plan &&
      !state.selected_variant?.selling_plan_allocations?.some(
        (plan) => plan?.selling_plan?.id === state.selected_selling_plan?.id
      )
    ) {
      state.selected_selling_plan = state.selected_variant?.selling_plan_allocations?.[0]?.selling_plan ?? null;
    }

    if (state.product.requires_selling_plan && !state.selected_selling_plan) {
      state.selected_selling_plan =
        state.selected_variant?.selling_plan_allocations?.[0]?.selling_plan ??
        state.product.selling_plan_groups?.[0]?.selling_plans?.[0];
    }

    if (gallerySettings?.scroll_to_selected_variant_image && state.selected_variant?.featured_media?.id) {
      scrollToMediaById(state.selected_variant?.featured_media?.id);
    }
    _product.lastOptions = {
      ...(_product.lastOptions ?? {}),
      ...(state.product.options_with_values?.reduce((acc, option, index) => {
        acc[utils.handlelize(option?.name)] = state.selected_options[index];
        return acc;
      }, {}) ?? {}),
    };
    applyResolvedPricing();

    setTimeout(() => {
      sessionStorage.setItem("_p_last_options", JSON.stringify(_product.lastOptions));
    });
  };

  const setProductOption = ({ index, value }) => {
    const options = [...state.selected_options];
    options[index] = value;

    setSelectedVariant(
      state.product?.variants?.find((variant) => variant.options.every((option, i) => options[i] === option))?.id ??
        state.product?.variants?.find((variant) => variant.options[index] === value)?.id ??
        state.product?.variants?.find(({ available }) => available)?.id ??
        state.product?.variants?.[0]?.id
    );
  };

  const setSellingPlan = (selling_plan_id) => {
    state.selected_selling_plan = state.selling_plan_allocations.find(
      (allocation) => isSameId(allocation?.selling_plan?.id, selling_plan_id)
    )?.selling_plan;

    if (state.selected_selling_plan) {
      state.last_selected_selling_plan = state.selected_selling_plan;
    }

    applyResolvedPricing();
  };

  const getDiscountLabel = (type, useSubscriptionPrice = show_subscription_price) => {
    const price = state.selected_variant?.price ?? 0;
    const compare_at_price = useSubscriptionPrice
      ? state.selected_compare_at_price ?? 0
      : state.selected_variant?.compare_at_price ?? 0;
    const subscription_price = state.selected_price ?? 0;
    const display_price = useSubscriptionPrice ? subscription_price : price;

    if (compare_at_price <= display_price) {
      return "";
    }

    switch (type) {
      case "sale": {
        return "Sale";
      }
      case "percentage": {
        if (useSubscriptionPrice && state.effective_discount_percent > 0) {
          return `${state.effective_discount_percent}% off`;
        }
        const final_percentage = Math.round(((compare_at_price - display_price) * 100) / compare_at_price);
        return final_percentage > 0 ? `${final_percentage}% off` : "";
      }
      case "value": {
        const discount_value = Math.max(compare_at_price - display_price, 0);
        return `Save ${utils.formatMoney(
          discount_value,
          window?.money_format?.replace(/\{(\s*)amount(\s*)}/gi, "{$1amount_no_decimals$2}")
        )}`;
      }
      default: {
        return "";
      }
    }
  };

  const hasAvailableVariant = (index, value) => {
    return state?.product?.variants?.some((variant) => {
      if (variant.metafields.custom.hide_on_frontend) {
        return false;
      }
      switch (index) {
        case 0: {
          return variant.options[index] === value && variant.available;
        }
        case 1: {
          return variant.options[0] === state?.selected_options[0] && variant.options[index] === value && variant.available;
        }
        case 2: {
          return (
            variant.options[0] === state?.selected_options[0] &&
            variant.options[1] === state?.selected_options[1] &&
            variant.options[index] === value &&
            variant.available
          );
        }
      }
      return false;
    });
  };

  const updateProductState = (product, selectedVariantId, selectedSellingPlanId) => {
    const selected_variant = _product.getSelectedVariant(product, selectedVariantId);

    const selling_plan_allocations = selected_variant?.selling_plan_allocations;
    const selected_selling_plan = selectedSellingPlanId
      ? selling_plan_allocations?.find((plan) => isSameId(plan?.selling_plan?.id, selectedSellingPlanId))?.selling_plan
      : default_select_selling_plan
      ? selling_plan_allocations?.[0]?.selling_plan
      : null;
    state.product_handle = product?.handle ?? state.product_handle ?? productHandle;
    state.product = product;
    state.ctr_discount_config =
      window.ctrDiscountDisplay?.parseConfig(product?.metafields?.custom?.ctr_discount_config) ?? state.ctr_discount_config;
    if (state.selected_media_id !== product?.media?.[0]?.id) {
      state.previous_selected_media_id = state.selected_media_id;
    }
    state.selected_media_id = product?.media?.[0]?.id;
    state.properties = {};
    state.selected_variant = selected_variant;
    state.selling_plan_allocations = selling_plan_allocations;
    state.selected_selling_plan = selected_selling_plan;
    state.isAdding = false;
    applyResolvedPricing();
    state.selected_options = selected_variant?.options;
    state.quantity = 1;
    state.sibling_handle = "";
    state.gallery_media = product?.media;
    state.hydrated = true;

    setTimeout(
      () => {
        $el.querySelectorAll("[x-ignore]:not([x-defer])").forEach((child) => {
          if (!document.contains(child)) return;
          utils.initializeIgnoredAlpineTree(child);
        });
      },
      initialized ? 2 : 50
    );
  };

  const getCTAButtonProps = (el, preview) => {
    let attribute =
      el.hasAttribute("data-sold-out-action") && state.soldOut
        ? "sold-out-"
        : el.closest("[data-bundle-section]") && el.hasAttribute("data-bundle-action")
        ? "bundle-"
        : el.hasAttribute("data-pdp-action") && addon_target
        ? "pdp-"
        : el.hasAttribute("data-preorder-action") && state.preorder
        ? "preorder-"
        : el.hasAttribute("data-subscription-action") && state.hasSubscription
        ? "subscription-"
        : el.hasAttribute("data-variant-action") && state.hasVariants
        ? "variant-"
        : "";

    if (preview) {
      switch (preview) {
        case "default":
          attribute = "";
          break;
        case "variant":
          attribute = "variant-";
          break;
        case "subscription":
          attribute = "";
          break;
        case "bundle":
          attribute = "bundle-";
          break;
        case "bundle_added":
          attribute = "bundle-";
          break;
        case "in_pdp":
          attribute = "pdp-";
          break;
        case "in_pdp_added":
          attribute = "pdp-";
          break;
        case "out_of_stock":
          attribute = "sold-out-";
          break;
        default:
          attribute = "";
      }
    }
    el.classList.remove(...el.classList);
    el.classList.add("w-full", ...(el.getAttribute(`data-${attribute}class`).split(" ") ?? []));

    return {
      content: utils.richtextWithPrices(
        el.getAttribute(`data-${attribute}content`),
        state?.selected_variant?.price,
        state.selected_variant?.compare_at_price
      ),
      added_content: utils.richtextWithPrices(
        el.getAttribute(`data-${attribute}added-content`),
        state?.selected_variant?.price,
        state.selected_variant?.compare_at_price
      ),
      action: el.getAttribute(`data-${attribute}action`),
      classes: el.getAttribute(`data-${attribute}class`),
      product_modal_handle: el.getAttribute(`data-${attribute}product-modal-handle`),
    };
  };

  const toggleAddon = (value) => {
    if (!_stores?.main_product?.state) {
      return;
    }

    if (value) {
      _stores.main_product.state.addons?.set(state.product_handle, {
        id: state.selected_variant?.id || state.product?.variants?.[0]?.id,
        quantity: 1,
        variant: state.selected_variant || state.product?.variants?.[0],
      });
    } else {
      _stores.main_product.state.addons?.delete(state.product_handle);
    }
  };

  const showConditionally = (condition, bundle) => {
    switch (condition) {
      case "always": {
        return true;
      }
      case "with_subscriptions": {
        return !!state.selected_variant?.selling_plan_allocations?.length;
      }
      case "no_subscriptions": {
        return !state.selected_variant?.selling_plan_allocations?.length;
      }
      case "no_bundle": {
        return !bundle?.items_added;
      }
      case "bundle": {
        return !!bundle?.items_added;
      }
      case "with_variants": {
        return state?.product?.variants?.length > 1;
      }
      case "no_variants": {
        return state?.product?.variants?.length <= 1;
      }
    }
  };

  const getVariantSwatches = (primary_source, fallback_source, variant) => {
    const cssVariables = [];
    switch (primary_source) {
      case "title": {
        cssVariables.push(`--primary-swatch: var(--swatch-${utils.handlelize(variant.title)})`);
        break;
      }
      case "image": {
        const [src, version] = variant?.featured_media?.preview_image?.src.split("?") ?? [];
        if (!src) break;
        cssVariables.push(`--primary-swatch: url(${src}?width=180&height=180&${version}) center center/cover no-repeat`);
        break;
      }
      case "metafield": {
        const color_swatch = variant.metafields.smart.color_swatch;

        if (typeof color_swatch === "string") {
          cssVariables.push(`--primary-swatch: ${color_swatch}`);
          break;
        }
        if (color_swatch) {
          const [src, version] = color_swatch?.preview_image?.src.split("?") ?? [];
          if (!src) break;
          cssVariables.push(`--primary-swatch: url(${src}?width=180&height=180&${version}) center center/cover no-repeat`);
          cssVariables.push(`--primary-swatch: ${color_swatch}`);
        }
        break;
      }
    }
    switch (fallback_source) {
      case "title": {
        cssVariables.push(`--fallback-swatch: var(--swatch-${utils.handlelize(variant.title)})`);
        break;
      }
      case "image": {
        const [src, version] = variant?.featured_media?.preview_image?.src.split("?") ?? [];
        if (!src) break;
        cssVariables.push(`--fallback-swatch: url(${src}?width=180&height=180&${version}) center center/cover no-repeat`);
        break;
      }
      case "metafield": {
        const color_swatch = variant.metafields.smart.color_swatch;

        if (typeof color_swatch === "string") {
          cssVariables.push(`--fallback-swatch: ${color_swatch}`);
          break;
        }
        if (color_swatch) {
          const [src, version] = color_swatch?.preview_image?.src.split("?") ?? [];
          if (!src) break;
          cssVariables.push(`--fallback-swatch: url(${src}?width=180&height=180&${version}) center center/cover no-repeat`);
          cssVariables.push(`--fallback-swatch: ${color_swatch}`);
        }
        break;
      }
    }

    return `${cssVariables?.join(";")};background: var(--primary-swatch, var(--fallback-swatch, ${utils.handlelize(
      variant?.title
    )}))`;
  };

  const getOptionIndex = (blockId) => {
    const optionBlocks = [];

    for (let i = 0; i < (state.product?.options?.length || 0); i++) {
      const option = state.product?.options[i];
      const byNameBlock = option_blocks?.find((block) => {
        const alreadyUsed = optionBlocks.some((b) => b.id === block.block_id);
        if (alreadyUsed || block.option_type !== "by_name") return false;

        if (block.match_exact_word) {
          return block.match_option_titles?.split(",").includes(option);
        }
        return block.match_option_titles
          ?.split(",")
          .map((o) => o.toLowerCase().trim())
          .includes(option.toLowerCase().trim());
      });

      if (byNameBlock) {
        optionBlocks.push({ index: i, id: byNameBlock.block_id });
        continue;
      }

      const byIndexOptions = option_blocks?.find(
        (block) =>
          !optionBlocks.some((b) => b.id === block.block_id) && block.option_type === "by_index" && block.match_option_index === i
      );
      if (byIndexOptions) {
        optionBlocks.push({ index: i, id: byIndexOptions.block_id });
        continue;
      }

      const fallbackOptions = option_blocks?.find(
        (block) =>
          !optionBlocks.some((b) => b.id === block.block_id) &&
          block.option_type === "fallback_options" &&
          block.match_option_index === i
      );
      if (fallbackOptions) {
        optionBlocks.push({ index: i, id: fallbackOptions.block_id });
      }
    }

    return optionBlocks?.find((block) => block.id === blockId)?.index ?? -1;
  };

  const getOptionSwatches = (primary_source, fallback_source, value, index) => {
    const variant = state?.product?.variants?.find((variant) => variant.options[index] === value);

    const cssVariables = [];
    switch (primary_source) {
      case "title": {
        cssVariables.push(`--primary-swatch: var(--swatch-${utils.handlelize(value)})`);
        break;
      }
      case "image": {
        const [src, version] = variant?.featured_media?.preview_image?.src?.split("?") ?? [];
        if (!src) break;
        cssVariables.push(`--primary-swatch: url(${src}?width=180&height=180&${version}) center center/cover no-repeat`);
        break;
      }
      case "metafield": {
        const color_swatch = variant?.metafields?.smart?.color_swatch;

        if (typeof color_swatch === "string") {
          cssVariables.push(`--primary-swatch: ${color_swatch}`);
          break;
        }
        if (color_swatch) {
          const [src, version] = color_swatch?.preview_image?.src?.split("?") ?? [];
          if (!src) break;
          cssVariables.push(`--primary-swatch: url(${src}?width=180&height=180&${version}) center center/cover no-repeat`);
          cssVariables.push(`--primary-swatch: ${color_swatch}`);
        }
        break;
      }
    }
    switch (fallback_source) {
      case "title": {
        cssVariables.push(`--fallback-swatch: var(--swatch-${utils.handlelize(value)})`);
        break;
      }
      case "image": {
        const [src, version] = variant?.featured_media?.preview_image?.src?.split("?") ?? [];
        if (!src) break;
        cssVariables.push(`--fallback-swatch: url(${src}?width=180&height=180&${version}) center center/cover no-repeat`);
        break;
      }
      case "metafield": {
        const color_swatch = variant?.metafields?.smart?.color_swatch;

        if (typeof color_swatch === "string") {
          cssVariables.push(`--fallback-swatch: ${color_swatch}`);
          break;
        }
        if (color_swatch) {
          const [src, version] = color_swatch?.preview_image?.src?.split("?") ?? [];
          if (!src) break;
          cssVariables.push(`--fallback-swatch: url(${src}?width=180&height=180&${version}) center center/cover no-repeat`);
          cssVariables.push(`--fallback-swatch: ${color_swatch}`);
        }
        break;
      }
    }

    return `${cssVariables?.join(";")};background: var(--primary-swatch, var(--fallback-swatch, ${utils.handlelize(value)}))`;
  };

  if (product) {
    setTimeout(() => {
      $el.querySelectorAll("[x-ignore]:not([x-defer])").forEach((child) => {
        if (!document.contains(child)) return;
        utils.initializeIgnoredAlpineTree(child);
      });
    }, 2);
  }

  Alpine.effect(() => {
    const product = state.product;
    const selected_variant = state.selected_variant;

    state.hasVariants = product?.variants?.length > 1 || product?.variants?.[0]?.title !== "Default Title";
    state.hasSubscription = !!selected_variant?.options?.length;

    state.available_quantity =
      selected_variant?.inventory_management === "shopify" && selected_variant?.inventory_policy === "deny"
        ? selected_variant?.inventory_quantity -
          cart?.state?.items?.reduce(
            (acc, line) => (line.variant_id === (selected_variant?.id ?? variantId) ? acc + line.quantity : acc),
            0
          )
        : selected_variant?.preorder && selected_variant?.preorder_quantity
        ? selected_variant?.inventory_quantity +
          selected_variant?.preorder_quantity -
          cart?.state?.items?.reduce(
            (acc, line) => (line.variant_id === (selected_variant?.id ?? variantId) ? acc + line.quantity : acc),
            0
          )
        : 99999;

    state.soldOut = state.available_quantity <= 0;

    state.preorder =
      selected_variant?.preorder &&
      selected_variant?.inventory_quantity -
        cart?.state?.items?.reduce(
          (acc, line) => (line.variant_id === (selected_variant?.id ?? variantId) ? acc + line.quantity : acc),
          0
        ) <
        preorder_threshold;

    state.gallery_media = handleImageSelection(gallerySettings?.filter_images, selected_variant);

    if (!state.gallery_media?.length && state.product?.featured_media) {
      state.gallery_media = [state.product?.featured_media];
    }
  });

  Alpine.effect(() => {
    if (state.selected_variant?.id && state.selected_variant?.id !== state.initial_variant_id) {
      setTimeout(() => {
        $el.querySelectorAll("[x-ignore]:not([x-defer])").forEach((child) => {
          if (!document.contains(child)) return;
          utils.initializeIgnoredAlpineTree(child);
        });
      }, 2);
    }
  });
  Alpine.effect(() => {
    state.selected_variant;
    state.selected_selling_plan;
    state.product;
    applyResolvedPricing();
  });

  initialized = true;

  return {
    p_card: state,
    $el,
    $refs,
    ...utils.spreadGenericCardFunctions(state),
    handleAddToCart,
    handleBackInStockNotification,
    setSelectedVariant,
    setProductOption,
    setSellingPlan,
    getDiscountLabel,
    getVariantSwatches,
    getOptionIndex,
    getOptionSwatches,
    hasAvailableVariant,
    updateProductState,
    showConditionally,
    getCTAButtonProps,
    handleImageSelection,
    scrollToMediaById,
    toggleAddon,
  };
};

const hydrateProductCard = utils.hydrateCard("product");

window._sections["initProductCard"] = initProductCard;
window._sections["hydrateProductCard"] = hydrateProductCard;
