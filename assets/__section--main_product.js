const initMainProduct = ($el, $refs, productHandle, productId, variantId, default_select_selling_plan = false) => {
  let initialized = false;
  const random_id = utils.shortUUID();
  const isProductBar = $el.hasAttribute("data-product-bar");
  const preorder_threshold = +(window.theme_settings.data__product__variant__preorder_threshold ?? 1);
  const cart = window.Alpine.store("cart");

  const gallery = $el.querySelector(`[x-ref="gallery"]`);
  const gallerySettings = utils.JSONParse(gallery?.getAttribute("data-settings"));
  const thumbnails = $el.querySelector(`[x-ref="thumbnails"]`);
  const thumbnailSettings = utils.JSONParse(thumbnails?.getAttribute("data-settings"));

  const quickView = $el.hasAttribute("data-quick-view");

  const isPrimary =
    !isProductBar &&
    new RegExp(`^/(products|collections/[^/]*/products)/${encodeURIComponent(productHandle)}`, "gi").test(
      _stores?.router?.pathname ?? ""
    );
  const urlSearchParams = new URL(window.location.href).searchParams;
  const initialVariantId = +(urlSearchParams?.get("variant") || variantId);
  const initialSellingPlanId = +(urlSearchParams?.get("selling_plan") || 0) || undefined;
  const isSameId = (a, b) => a != null && b != null && String(a) === String(b);
  const initialDiscountConfig = window.ctrDiscountDisplay?.parseConfig($el.getAttribute("data-ctr-discount-config"));

  let product = _products[productHandle] ?? _product.getHtmlProduct(productHandle);

  if (!product && productHandle) {
    _product.getProductData(productHandle, productId, isPrimary ? "high" : "auto").then((res) => {
      updateProductState(res, initialVariantId, initialSellingPlanId);
    });
  }

  product ??= _products[productHandle];

  if (product && !product._full_data) {
    _product.getHydratedProductData(productHandle, productId).then((res) => {
      if (state.product?.handle === res.handle) {
        state.product = res;
      }
    });
  }

  if (isPrimary && product) {
    product.selected_variant_id = initialVariantId;
  }

  const selected_variant = _product.getSelectedVariant(product, initialVariantId);

  const selling_plan_allocations = selected_variant?.selling_plan_allocations;
  const selected_selling_plan =
    initialSellingPlanId
      ? selling_plan_allocations?.find((plan) => isSameId(plan?.selling_plan?.id, initialSellingPlanId))?.selling_plan
      : default_select_selling_plan || product?.requires_selling_plan
      ? selling_plan_allocations?.[0]?.selling_plan
      : null;

  const selected_or_last_used_or_first_selling_plan = selected_selling_plan ?? selling_plan_allocations?.[0]?.selling_plan;

  const selected_selling_plan_discount_wording = getSellingPlanDiscountWording(
    selected_selling_plan,
    selected_variant,
    product,
    initialDiscountConfig
  );
  const selling_plan_discount_wording = getSellingPlanDiscountWording(
    selected_or_last_used_or_first_selling_plan,
    selected_variant,
    product,
    initialDiscountConfig
  );

  let discounted_price = selected_variant?.price;
  const price_adjustment =
    selected_selling_plan?.price_adjustments?.[0] ?? selected_or_last_used_or_first_selling_plan?.price_adjustments?.[0];

  if (price_adjustment?.value_type === "fixed_amount") {
    discounted_price = Math.min(discounted_price - Math.round(+price_adjustment?.value), selected_variant?.price);
  }

  if (price_adjustment?.value_type === "percentage") {
    discounted_price = Math.min(
      discounted_price - Math.round((+price_adjustment?.value / 100) * discounted_price),
      selected_variant?.price
    );
  }

  if (price_adjustment?.value_type === "price") {
    discounted_price = Math.min(+price_adjustment?.value, selected_variant?.price);
  }

  const available_quantity =
    selected_variant?.inventory_management === "shopify" && selected_variant?.inventory_policy === "deny"
      ? selected_variant?.inventory_quantity -
        cart?.state?.items?.reduce((acc, line) => (line.variant_id === selected_variant.id ? acc + line.quantity : acc), 0)
      : selected_variant?.preorder && selected_variant?.preorder_quantity
      ? selected_variant?.inventory_quantity +
        selected_variant?.preorder_quantity -
        cart?.state?.items?.reduce((acc, line) => (line.variant_id === selected_variant.id ? acc + line.quantity : acc), 0)
      : 99999;

  const initialMediaId = +(
    (thumbnails ?? gallery)?.querySelector("[data-media-id]")?.getAttribute("data-media-id") ?? product?.media?.[0]?.id
  );

  const state = Alpine.reactive({
    random_id,
    element: $el,
    count: 0,
    manual_discount: 0,
    isPrimary: isPrimary,
    product_handle: productHandle,
    initial_variant_id: initialVariantId,
    images_cleaned: false,
    thumbnail_images_cleaned: false,
    hydrated: !!product,
    variant_changed: false,
    product: product,
    selected_media_id: initialMediaId,
    previous_selected_media_id: initialMediaId,
    properties: {},
    selected_variant,
    selling_plan_allocations,
    selected_selling_plan,
    last_selected_selling_plan: selected_selling_plan,
    selected_selling_plan_discount_wording,
    selling_plan_discount_wording,
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
        cart?.state?.items?.reduce(
          (acc, line) => (line.variant_id === (selected_variant?.id ?? variantId) ? acc + line.quantity : acc),
          0
        ) <
        preorder_threshold,
    gallery_media: product?.media ?? [],
    thumbnail_media: product?.media ?? [],
    selected_price: discounted_price,
    selected_compare_at_price: Math.max(selected_variant?.compare_at_price, selected_variant?.price),
    show_complementary_products: true,
    upsell_total: 0,
    upsell_compare_at_total: 0,
    dynamic_buy_button: null,
    quantity_limit: available_quantity,
    upsell_items: new Map(),
    scrolling_to_image: false,
    addons: new Map(),
    ctr_discount_config:
      initialDiscountConfig ?? window.ctrDiscountDisplay?.parseConfig(product?.metafields?.custom?.ctr_discount_config),
  });

  const handleImageSelection = (
    filter_images,

    variant = state.selected_variant
  ) => {
    switch (filter_images) {
      case "show_all": {
        return state.product?.media;
      }
      case "selected_variant": {
        return state.product?.media?.filter((media) => media.id === variant?.featured_media?.id);
      }
      case "show_all_variants": {
        return state.product?.variants.map((v) => v?.featured_media);
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

  const scrollToMediaById = async (mediaId, scrollContainer = gallery?.firstElementChild) => {
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

    if (state.selected_media_id !== mediaId) {
      state.previous_selected_media_id = state.selected_media_id;
    }
    state.selected_media_id = mediaId;
    await utils.delay(1);
    state.scrolling_to_image = true;

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
    const form =
      $el.tagName === "FORM"
        ? $el
        : document.querySelector(`form[data-product-handle="${state.product?.handle ?? productHandle}"]`);
    const giftItemBlockId = $el.closest("[data-gift-with-purchase]")?.getAttribute("data-gift-with-purchase");
    const isHiddenItem = !!$el.closest("[data-hide-in-cart]");

    if (giftItemBlockId) {
      properties["_gift_with_purchase"] = giftItemBlockId;
    }
    if (isHiddenItem) {
      properties["_p_hidden"] = "true";
    }

    if (state.upsell_items.size && [...state.upsell_items.values()]?.some((item) => item.bundle)) {
      properties["_p_id"] = `${random_id}`;
    }

    if (properties?.["__shopify_send_gift_card_to_recipient"] && !utils.isEmail(properties?.["Recipient email"])) {
      utils.validateFormAndToast(form);
      return;
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
            ? state.selling_plan_allocations?.find((plan) => plan.selling_plan?.id === cart.cart_selling_plan_id)?.selling_plan
                ?.id
            : state.selected_selling_plan?.id,
          properties: {
            ...properties,
            ...state.properties,
          },
        },
        ...[...state.upsell_items.values()].map((entry) => ({
          id: entry.id,
          selling_plan: cart.global_subscriptions
            ? state.selling_plan_allocations?.find((plan) => plan.selling_plan?.id === cart.cart_selling_plan_id)?.selling_plan
                ?.id
            : entry.variant?.selling_plan_allocations?.find((plan) => plan.selling_plan?.id === state.selected_selling_plan?.id)
                ?.selling_plan?.id,
          ...(entry?.bundle
            ? {
                parent_id: state.selected_variant.id,
              }
            : {}),
          quantity: state.quantity * entry.quantity,
          properties: {
            ...entry.properties,
            _p_id_link: entry?.bundle ? `${random_id}` : undefined,
            _p_required: entry?.auto_addon ? "true" : undefined,
            _p_fixed_quantity: !entry?.variable_quantity ? "true" : undefined,
            Preorder:
              entry?.variant?.preorder && entry?.variant?.inventory_quantity < preorder_threshold
                ? entry?.variant?.preorder_date
                  ? `Shipping ${new Date(entry?.variant.preorder_date).toLocaleDateString(navigator.language, {
                      month: "short",
                      year: "numeric",
                    })}`
                  : "true"
                : undefined,
          },
        })),
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

  const setSelectedVariant = (id, scroll_to_variant = true) => {
    state.selected_variant = state.product.variants?.find((variant) => variant.id === id);
    state.selected_options = state.selected_variant?.options;
    state.variant_changed = true;
    state.selling_plan_allocations = state.selected_variant.selling_plan_allocations;

    if (
      state.selected_selling_plan &&
      !state.selling_plan_allocations?.some((plan) =>
        isSameId(plan?.selling_plan?.id, state.selected_selling_plan?.id)
      )
    ) {
      state.selected_selling_plan =
        state.selling_plan_allocations?.find((plan) =>
          isSameId(plan?.selling_plan?.id, state.last_selected_selling_plan?.id)
        )?.selling_plan ??
        state.selling_plan_allocations?.find((plan) => plan.selling_plan.name === state.last_selected_selling_plan?.name)
          ?.selling_plan ??
        state.selling_plan_allocations?.[0]?.selling_plan ??
        null;
      state.last_selected_selling_plan = state.selected_selling_plan;
    }

    if (
      !state.selling_plan_allocations?.some((plan) =>
        isSameId(plan?.selling_plan?.id, state.last_selected_selling_plan?.id)
      )
    ) {
      state.last_selected_selling_plan = undefined;
    }

    if (state.product.requires_selling_plan && !state.selected_selling_plan) {
      state.selected_selling_plan =
        state.selling_plan_allocations?.[0]?.selling_plan ?? state.product.selling_plan_groups?.[0]?.selling_plans?.[0];
    }

    const selected_or_last_used_or_first_selling_plan =
      state.last_selected_selling_plan ?? state.selling_plan_allocations?.[0]?.selling_plan;

    state.selected_selling_plan_discount_wording = getSellingPlanDiscountWording(
      state.selected_selling_plan,
      state.selected_variant,
      state.product,
      state.ctr_discount_config
    );
    state.selling_plan_discount_wording = getSellingPlanDiscountWording(
      selected_or_last_used_or_first_selling_plan,
      state.selected_variant,
      state.product,
      state.ctr_discount_config
    );

    if (gallerySettings?.scroll_to_selected_variant_image && state.selected_variant?.featured_media?.id && scroll_to_variant) {
      scrollToMediaById(state.selected_variant?.featured_media?.id);
    }

    _product.lastOptions = {
      ...(_product.lastOptions ?? {}),
      ...(state.product.options_with_values?.reduce((acc, option, index) => {
        acc[utils.handlelize(option?.name)] = state.selected_options[index];
        return acc;
      }, {}) ?? {}),
    };
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

    const selected_or_last_used_or_first_selling_plan =
      state.last_selected_selling_plan ?? state.selling_plan_allocations?.[0]?.selling_plan;

    state.selected_selling_plan_discount_wording = getSellingPlanDiscountWording(
      state.selected_selling_plan,
      state.selected_variant,
      state.product,
      state.ctr_discount_config
    );
    state.selling_plan_discount_wording = getSellingPlanDiscountWording(
      selected_or_last_used_or_first_selling_plan,
      state.selected_variant,
      state.product,
      state.ctr_discount_config
    );
  };

  const showMediaGallery = (mediaId) => {
    const mediaElements = [...(gallery?.querySelectorAll("[data-media-id]") ?? [])].map((element) => ({
      element,
      mediaId: +element.getAttribute("data-media-id"),
      media:
        state.product?.media?.find((media) => media.id === +element.getAttribute("data-media-id")) ??
        state.product?.variants
          ?.find((v) => v.metafields?.smart?.images?.some((image) => image.id === +element.getAttribute("data-media-id")))
          ?.metafields?.smart?.images?.find((image) => image.id === +element.getAttribute("data-media-id")),
    }));

    const thumbnailMediaElements = [...(thumbnails?.querySelectorAll("[data-media-id]") ?? [])].map((element) => ({
      element,
      mediaId: +element.getAttribute("data-media-id"),
      media:
        state.product?.media?.find((media) => media.id === +element.getAttribute("data-media-id")) ??
        state.product?.variants
          ?.find((v) => v.metafields?.smart?.images?.some((image) => image.id === +element.getAttribute("data-media-id")))
          ?.metafields?.smart?.images?.find((image) => image.id === +element.getAttribute("data-media-id")),
    }));

    const mediaItems = mediaElements
      ?.filter(
        (item) =>
          (getComputedStyle(item.element)?.display !== "none" ||
            getComputedStyle(thumbnailMediaElements?.find((img) => img.mediaId === item.mediaId)?.element)?.display !== "none") &&
          item.media
      )
      ?.filter((a, i, arr) => arr.findIndex((b) => b.mediaId === a.mediaId) === i)
      ?.map((item) => item.media);

    const index = mediaItems.findIndex((item) => item.id === mediaId);

    _stores.mediaGallery.showGallery({
      media: mediaItems,
      index,
    });
  };

  const getDiscountLabel = (type) => {
    const price = state.selected_variant?.price ?? 0;
    const compare_at_price = state.selected_variant?.compare_at_price ?? 0;

    if (compare_at_price <= price) {
      return "";
    }

    switch (type) {
      case "sale": {
        return "Sale";
      }
      case "percentage": {
        return `${Math.round(((compare_at_price - price) * 100) / compare_at_price)}% off`;
      }
      case "value": {
        return `Save ${utils.formatMoney(
          compare_at_price - price,
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

    if (selected_selling_plan) {
      state.last_selected_selling_plan = selected_selling_plan;
    }
    if (
      !selected_variant?.selling_plan_allocations?.some((plan) =>
        isSameId(plan?.selling_plan?.id, state.last_selected_selling_plan?.id)
      )
    ) {
      state.last_selected_selling_plan = undefined;
    }

    const selected_or_last_used_or_first_selling_plan =
      state.last_selected_selling_plan ?? selling_plan_allocations?.[0]?.selling_plan;

    const selected_selling_plan_discount_wording = getSellingPlanDiscountWording(
      selected_selling_plan,
      selected_variant,
      product,
      state.ctr_discount_config
    );
    const selling_plan_discount_wording = getSellingPlanDiscountWording(
      selected_or_last_used_or_first_selling_plan,
      selected_variant,
      product,
      state.ctr_discount_config
    );

    state.product_handle = product?.handle ?? state.product_handle ?? productHandle;
    state.product = product;
    state.ctr_discount_config =
      window.ctrDiscountDisplay?.parseConfig(product?.metafields?.custom?.ctr_discount_config) ?? state.ctr_discount_config;

    const initialMediaId = +(
      (thumbnails ?? gallery)?.querySelector("[data-media-id]")?.getAttribute("data-media-id") ?? product?.media?.[0]?.id
    );

    if (state.selected_media_id !== initialMediaId) {
      state.previous_selected_media_id = state.selected_media_id;
    }
    state.selected_media_id = initialMediaId;
    state.properties = {};
    state.selected_variant = selected_variant;
    state.selling_plan_allocations = selling_plan_allocations;
    state.selected_selling_plan = selected_selling_plan;
    state.selected_selling_plan_discount_wording = selected_selling_plan_discount_wording;
    state.selling_plan_discount_wording = selling_plan_discount_wording;
    state.isAdding = false;
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

  const handleAddAddonsToCart = async () => {
    state.isAdding = true;
    const random_id = utils.shortUUID();
    const mainProduct = Alpine.store("main_product");
    const currentState = state ?? mainProduct?.state;
    const addonEntries = [...(currentState.addons?.values() ?? [])];
    const form = state?.element;
    const addonsBlock = form?.querySelector?.("[data-addon-product-target]")?.closest?.("[data-addons-default-subscription]");
    const useSubscription = addonsBlock?.getAttribute?.("data-addons-default-subscription") === "true";
    const selected_plan = useSubscription
      ? (mainProduct?.state?.selected_selling_plan ?? mainProduct?.pdp?.selected_selling_plan ?? currentState.selected_selling_plan)
      : null;
    const selected_plan_id = selected_plan?.id != null ? +selected_plan.id : null;
    const selected_plan_name = selected_plan?.name;

    const allocForVariant = (variant, useSubscription) => {
      if (!useSubscription) return null;
      const allocations = variant?.selling_plan_allocations;
      const first = allocations?.[0]?.selling_plan;
      return first?.id != null ? +first.id : null;
    };

    const itemsToSend = addonEntries.map((entry) => {
      const variant = entry.variant;
      const plan_id = allocForVariant(variant, selected_plan_id != null || selected_plan_name);

      return {
        id: entry.id,
        quantity: entry.quantity,
        selling_plan: plan_id ?? null,
        properties: { _bundle_id: random_id },
      };
    });

    const data = await _cart.add({
      items: itemsToSend,
    });

    state.isAdding = false;
    if (!data.cart_error) {
      _stores.modal.setId("modal--cart-drawer");
      _stores.quickView.show = false;
    }
  };

  const getCTAButtonProps = (el, preview) => {
    let attribute =
      el.hasAttribute("data-sold-out-action") && state.soldOut
        ? "sold-out-"
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
      action: el.getAttribute(`data-${attribute}action`),
      classes: el.getAttribute(`data-${attribute}class`),
      product_modal_handle: el.getAttribute(`data-${attribute}product-modal-handle`),
    };
  };

  const setDynamicPrice = ({
    discount = state.manual_discount,
    selected_variant = state.selected_variant,
    selling_plan = state.selected_selling_plan,
  }) => {
    let discounted_price = selected_variant?.price;
    const price_adjustment = selling_plan?.price_adjustments?.[0];

    if (price_adjustment?.value_type === "fixed_amount") {
      discounted_price = Math.min(discounted_price - Math.round(+price_adjustment?.value), selected_variant?.price);
    }

    if (price_adjustment?.value_type === "percentage") {
      discounted_price = Math.min(
        discounted_price - Math.round((+price_adjustment?.value / 100) * discounted_price),
        selected_variant?.price
      );
    }

    if (price_adjustment?.value_type === "price") {
      discounted_price = Math.min(+price_adjustment?.value, selected_variant?.price);
    }

    if (discount) {
      discounted_price = Math.min(discounted_price - Math.round((discount / 100) * discounted_price), selected_variant?.price);
    }

    let upsell_price_total = 0;
    let upsell_compare_at_price_total = 0;
    let upsell_triggered_quantity_limit = 9999999;

    state.upsell_items.forEach((value) => {
      let upsell_d_price = value?.variant?.price;
      if (state.selected_selling_plan) {
        const upsell_price_adjustment = value?.variant?.selling_plan_allocations?.find(
          (plan) => plan.selling_plan.id === state.selected_selling_plan.id
        )?.selling_plan?.price_adjustments?.[0];

        if (upsell_price_adjustment?.value_type === "fixed_amount") {
          upsell_d_price = Math.min(upsell_d_price - Math.round(+price_adjustment?.value), value?.variant?.price);
        }

        if (upsell_price_adjustment?.value_type === "percentage") {
          upsell_d_price = Math.min(
            upsell_d_price - Math.round((+price_adjustment?.value / 100) * discounted_price),
            value?.variant?.price
          );
        }

        if (upsell_price_adjustment?.value_type === "price") {
          upsell_d_price = Math.min(
            upsell_d_price - Math.round((+price_adjustment?.value / 100) * discounted_price),
            value?.variant?.price
          );
        }
      }

      const upsell_available_quantity =
        value?.variant?.inventory_management === "shopify" && value?.variant?.inventory_policy === "deny"
          ? value?.variant?.inventory_quantity -
            cart?.state?.items?.reduce((acc, line) => (line.variant_id === selected_variant.id ? acc + line.quantity : acc), 0)
          : 999999;

      const maxMultiplier = Math.floor(upsell_available_quantity / value.quantity);

      upsell_triggered_quantity_limit = Math.min(upsell_triggered_quantity_limit, maxMultiplier);

      upsell_price_total += upsell_d_price * value.quantity;
      upsell_compare_at_price_total += Math.max(value?.variant?.compare_at_price, value?.variant?.price) * value.quantity;
    });

    state.quantity = Math.max(1, Math.min(state.quantity, state.available_quantity, upsell_triggered_quantity_limit));
    state.quantity_limit = Math.min(state.available_quantity, upsell_triggered_quantity_limit);

    state.upsell_total = upsell_price_total * state.quantity;
    state.upsell_compare_at_total = upsell_compare_at_price_total * state.quantity;

    window.ctrDiscountDisplay?.applySelectedPrices(state, discounted_price);

    if (discount !== state.manual_discount) {
      state.manual_discount = discount;
    }
    if (selling_plan?.id !== state?.selected_selling_plan?.id) {
      setSellingPlan(selling_plan?.id);
    }
    if (selected_variant?.id !== state?.selected_variant?.id) {
      setSelectedVariant(selected_variant?.id);
    }
  };

  const mutationObserver = new MutationObserver((e) => {
    e?.forEach((record) => {
      const nodes = [];

      record?.addedNodes?.forEach((node) => {
        if (node instanceof HTMLInputElement && node?.tagName === "INPUT" && node.name === "selling_plan" && node.value) {
          setSellingPlan(+node.value);
        }
      });
    });
  });
  mutationObserver.observe($el, { childList: true, subtree: true });

  const setSiblingProduct = (handle, quickView) => {
    if (handle === state.product.handle) return;
    _product.lastOptions = {
      ...(_product.lastOptions ?? {}),
      ...(state.product.options_with_values?.reduce((acc, option, index) => {
        acc[utils.handlelize(option?.name)] = state.selected_options[index];
        return acc;
      }, {}) ?? {}),
    };
    setTimeout(() => {
      sessionStorage.setItem("_p_last_options", JSON.stringify(_product.lastOptions));
    });
    if (quickView) {
      _stores.quickView.renderQuickView(handle);
      return;
    }

    barba.go(utils.getSiblingUrl(handle));
  };

  const handlePopState = (e) => {
    const url = new URL(window.location.href);
    const selling_plan_id = +url.searchParams.get("selling_plan");
    const variant_id = +url.searchParams.get("variant");

    if (!variant_id) return;

    if (state.selected_variant?.id !== variant_id) {
      state.selected_variant = state.product?.variants?.find((variant) => variant.id === variant_id) ?? state.selected_variant;
      state.selected_options = state.selected_variant?.options;
    }

    if (selling_plan_id !== state.selected_selling_plan?.id) {
      state.selected_selling_plan =
        state.selling_plan_allocations?.find((plan) => isSameId(plan?.selling_plan?.id, selling_plan_id))?.selling_plan ??
        state.selected_selling_plan;
    }
  };

  const styleDynamicBuyButton = (element) => {
    const previewButton = element.querySelector("[data-pre-styled-button]");

    element.style.setProperty("--shopify-accelerated-checkout-button-block-size", getComputedStyle(previewButton)?.height);
    element.style.setProperty(
      "--shopify-accelerated-checkout-button-border-radius",
      getComputedStyle(previewButton)?.borderRadius
    );
    previewButton.remove();
  };

  function getSellingPlanDiscountWording(sellingPlan, selectedVariant, productRef = product, configOverride) {
    const config = configOverride ?? window.ctrDiscountDisplay?.parseConfig(productRef?.metafields?.custom?.ctr_discount_config);

    if (sellingPlan?.id && config?.[String(sellingPlan.id)] != null) {
      return `${config[String(sellingPlan.id)]}%`;
    }

    const priceAdjustment = sellingPlan?.price_adjustments?.[0];

    if (!priceAdjustment?.value || !+priceAdjustment.value) {
      return "";
    }

    switch (priceAdjustment.value_type) {
      case "fixed_amount":
        return utils.formatMoney(priceAdjustment.value);

      case "percentage": {
        if (selectedVariant?.compare_at_price > selectedVariant?.price) {
          const percentage =
            1 -
            Math.round(((selectedVariant.compare_at_price - selectedVariant.price) * 100) / selectedVariant.compare_at_price) /
              100;
          const subscriptionPercentage = 1 - priceAdjustment.value / 100;
          const totalDiscount = Math.round(
            (1 - (percentage > 0 ? percentage : 1) * (subscriptionPercentage > 0 ? subscriptionPercentage : 1)) * 100,
          );
          return `${totalDiscount}%`;
        }

        return `${priceAdjustment.value}%`;
      }

      case "price":
        return utils.formatMoney(selectedVariant?.price - priceAdjustment.value);

      default:
        return "";
    }
  }

  if (product) {
    setTimeout(() => {
      $el.querySelectorAll("[x-ignore]:not([x-defer])").forEach((child) => {
        if (!document.contains(child)) return;
        utils.initializeIgnoredAlpineTree(child);
      });
    }, 2);
  }

  if (state.isPrimary) {
    Alpine.store("main_product", {
      state,
      pdp: state,
      ...utils.spreadGenericCardFunctions(state),
      handleAddToCart,
      handleBackInStockNotification,
      styleDynamicBuyButton,
      setSelectedVariant,
      setProductOption,
      setSiblingProduct,
      setSellingPlan,
      scrollToMediaById,
      getDiscountLabel,
      getCTAButtonProps,
      updateProductState,
      setDynamicPrice,
      handleImageSelection,
    });

    const main_product = Alpine.store("main_product");
    Alpine.magic("main_product", () => main_product);
    window._stores["main_product"] = main_product;
  }

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
    if (!document.contains($el)) return;
    state.isPrimary =
      !isProductBar &&
      new RegExp(`^/(products|collections/[^/]*/products)/${encodeURIComponent(productHandle)}`, "gi").test(
        _stores?.router?.pathname
      );

    if (state?.isPrimary && !window.design_mode) {
      window.onpopstate = handlePopState;

      const url = new URL(window.location.href);
      const selling_plan_id = +url.searchParams.get("selling_plan") || undefined;
      const variant_id = +url.searchParams.get("variant") || undefined;

      const remove = [];
      if (!state.selected_variant?.id) {
        remove.push("variant");
      }
      if (!state.selected_selling_plan?.id) {
        remove.push("selling_plan");
      }

      if (window?.event?.type === "popstate") {
        return;
      }

      // @ts-ignore
      if (!initialized || window?.event?.barba_redirect) {
        if (product?.handle !== state?.product?.handle) {
          state.product = product;
          state.upsell_items = new Map();
        }
        if (variant_id !== state.selected_variant?.id) {
          state.selected_variant = _product.getSelectedVariant(product, variant_id);

          const initialMediaId = +(
            (thumbnails ?? gallery)?.querySelector("[data-media-id]")?.getAttribute("data-media-id") ?? product?.media?.[0]?.id
          );

          if (state.selected_media_id !== initialMediaId) {
            state.previous_selected_media_id = state.selected_media_id;
          }
          state.selected_media_id = initialMediaId;
          state.properties = {};
          state.selling_plan_allocations = selling_plan_allocations;

          let discounted_price = state.selected_variant?.price;
          const price_adjustment = state.selected_selling_plan?.price_adjustments?.[0];

          if (price_adjustment?.value_type === "fixed_amount") {
            discounted_price = Math.min(discounted_price - Math.round(+price_adjustment?.value), state.selected_variant?.price);
          }

          if (price_adjustment?.value_type === "percentage") {
            discounted_price = Math.min(
              discounted_price - Math.round((+price_adjustment?.value / 100) * discounted_price),
              state.selected_variant?.price
            );
          }

          if (price_adjustment?.value_type === "price") {
            discounted_price = Math.min(+price_adjustment?.value, state.selected_variant?.price);
          }

          if (state.manual_discount) {
            discounted_price = Math.min(
              discounted_price - Math.round((state.manual_discount / 100) * discounted_price),
              state.selected_variant?.price
            );
          }

          let upsell_price_total = 0;
          let upsell_compare_at_price_total = 0;
          let upsell_triggered_quantity_limit = 9999999;

          state.upsell_items.forEach((value) => {
            let upsell_d_price = value?.variant?.price;
            if (state.selected_selling_plan) {
              const upsell_price_adjustment = value?.variant?.selling_plan_allocations?.find(
                (plan) => plan.selling_plan.id === state.selected_selling_plan.id
              )?.selling_plan?.price_adjustments?.[0];

              if (upsell_price_adjustment?.value_type === "fixed_amount") {
                upsell_d_price = Math.min(upsell_d_price - Math.round(+price_adjustment?.value), value?.variant?.price);
              }

              if (upsell_price_adjustment?.value_type === "percentage") {
                upsell_d_price = Math.min(
                  upsell_d_price - Math.round((+price_adjustment?.value / 100) * discounted_price),
                  value?.variant?.price
                );
              }

              if (upsell_price_adjustment?.value_type === "price") {
                upsell_d_price = Math.min(+price_adjustment?.value, value?.variant?.price);
              }
            }

            const upsell_available_quantity =
              value?.variant?.inventory_management === "shopify" && value?.variant?.inventory_policy === "deny"
                ? value?.variant?.inventory_quantity -
                  cart?.state?.items?.reduce(
                    (acc, line) => (line.variant_id === (state.selected_variant?.id ?? variantId) ? acc + line.quantity : acc),
                    0
                  )
                : 999999;

            const maxMultiplier = Math.floor(upsell_available_quantity / value.quantity);

            upsell_triggered_quantity_limit = Math.min(upsell_triggered_quantity_limit, maxMultiplier);

            upsell_price_total += upsell_d_price * value.quantity;
            upsell_compare_at_price_total += Math.max(value?.variant?.compare_at_price, value?.variant?.price) * value.quantity;
          });

          state.quantity = Math.max(1, Math.min(state.quantity, state.available_quantity, upsell_triggered_quantity_limit));
          state.quantity_limit = Math.min(state.available_quantity, upsell_triggered_quantity_limit);

          state.upsell_total = upsell_price_total * state.quantity;
          state.upsell_compare_at_total = upsell_compare_at_price_total * state.quantity;

          window.ctrDiscountDisplay?.applySelectedPrices(state, discounted_price);
          state.dynamic_buy_button = null;
          state.selected_options = state.selected_variant?.options;
        }

        if (selling_plan_id !== state.selected_selling_plan?.id) {
          state.selected_selling_plan = state.selling_plan_allocations?.find(
            (plan) => isSameId(plan?.selling_plan?.id, selling_plan_id)
          )?.selling_plan;
        }

        return;
      }

      if (selling_plan_id !== state.selected_selling_plan?.id || variant_id !== state.selected_variant?.id) {
        url.searchParams.set("selling_plan", `${state.selected_selling_plan?.id}`);
        url.searchParams.set("variant", `${state.selected_variant?.id}`);
        remove.forEach((key) => {
          url.searchParams.delete(key);
        });

        /* @ts-ignore */
        barba.history.add(url.toString(), "barba", !variant_id ? "replace" : "replace");
      }
    }
  });

  Alpine.effect(() => {
    if (state.dynamic_buy_button) {
      state.dynamic_buy_button.disabled = !state.selected_variant?.available;

      if (!state.dynamic_buy_button?.hasAttribute("data-no-out-of-stock")) {
        state.dynamic_buy_button.classList.toggle("dynamic-buy-button-out-of-stock", !state.selected_variant?.available);
      }
    }
  });

  Alpine.effect(() => {
    if (quickView) {
      Shopify?.PaymentButton?.init();
    }
  });

  Alpine.effect(() => {
    let discounted_price = state.selected_variant?.price;
    const price_adjustment = state.selected_selling_plan?.price_adjustments?.[0];

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
    state.thumbnail_media = handleImageSelection(thumbnailSettings?.thumbnail_filter_images, selected_variant);

    if (price_adjustment?.value_type === "fixed_amount") {
      discounted_price = Math.min(discounted_price - Math.round(+price_adjustment?.value), state.selected_variant?.price);
    }

    if (price_adjustment?.value_type === "percentage") {
      discounted_price = Math.min(
        discounted_price - Math.round((+price_adjustment?.value / 100) * discounted_price),
        state.selected_variant?.price
      );
    }

    if (price_adjustment?.value_type === "price") {
      discounted_price = Math.min(+price_adjustment?.value, state.selected_variant?.price);
    }

    if (state.manual_discount) {
      discounted_price = Math.min(
        discounted_price - Math.round((state.manual_discount / 100) * discounted_price),
        state.selected_variant?.price
      );
    }

    let upsell_price_total = 0;
    let upsell_compare_at_price_total = 0;
    let upsell_triggered_quantity_limit = 9999999;

    state.upsell_items.forEach((value) => {
      let upsell_d_price = value?.variant?.price;
      if (state.selected_selling_plan) {
        const upsell_price_adjustment = value?.variant?.selling_plan_allocations?.find(
          (plan) => plan.selling_plan.id === state.selected_selling_plan.id
        )?.selling_plan?.price_adjustments?.[0];

        if (upsell_price_adjustment?.value_type === "fixed_amount") {
          upsell_d_price = Math.min(upsell_d_price - Math.round(+price_adjustment?.value), value?.variant?.price);
        }

        if (upsell_price_adjustment?.value_type === "percentage") {
          upsell_d_price = Math.min(
            upsell_d_price - Math.round((+price_adjustment?.value / 100) * discounted_price),
            value?.variant?.price
          );
        }

        if (upsell_price_adjustment?.value_type === "price") {
          upsell_d_price = Math.min(+price_adjustment?.value, value?.variant?.price);
        }
      }

      const upsell_available_quantity =
        value?.variant?.inventory_management === "shopify" && value?.variant?.inventory_policy === "deny"
          ? value?.variant?.inventory_quantity -
            cart?.state?.items?.reduce((acc, line) => (line.variant_id === selected_variant.id ? acc + line.quantity : acc), 0)
          : value.variant?.preorder && value.variant?.preorder_quantity
          ? value.variant?.inventory_quantity +
            value.variant?.preorder_quantity -
            cart?.state?.items?.reduce((acc, line) => (line.variant_id === value.variant.id ? acc + line.quantity : acc), 0)
          : 99999;

      const maxMultiplier = Math.floor(upsell_available_quantity / value.quantity);

      upsell_triggered_quantity_limit = Math.min(upsell_triggered_quantity_limit, maxMultiplier);

      upsell_price_total += upsell_d_price * value.quantity;
      upsell_compare_at_price_total += Math.max(value?.variant?.compare_at_price, value?.variant?.price) * value.quantity;
    });

    state.quantity = Math.max(1, Math.min(state.quantity, state.available_quantity, upsell_triggered_quantity_limit));
    state.quantity_limit = Math.min(state.available_quantity, upsell_triggered_quantity_limit);

    state.upsell_total = upsell_price_total * state.quantity;
    state.upsell_compare_at_total = upsell_compare_at_price_total * state.quantity;

    window.ctrDiscountDisplay?.applySelectedPrices(state, discounted_price);
  });

  initialized = true;

  return {
    state,
    pdp: state,
    ...utils.spreadGenericCardFunctions(state),
    showMediaGallery,
    handleAddToCart,
    handleBackInStockNotification,
    styleDynamicBuyButton,
    setSelectedVariant,
    setProductOption,
    setSiblingProduct,
    setSellingPlan,
    scrollToMediaById,
    hasAvailableVariant,
    getDiscountLabel,
    getCTAButtonProps,
    updateProductState,
    setDynamicPrice,
    handleImageSelection,
    handleAddAddonsToCart,
  };
};

window._sections["initMainProduct"] = initMainProduct;