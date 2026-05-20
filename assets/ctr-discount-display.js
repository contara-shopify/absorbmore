/**
 * Display-only subscription pricing for Skio + Discount Kit compatibility.
 * Source of truth:
 * - state.ctr_discount_config (from Liquid-injected data attribute), fallback to
 * - product metafield custom.ctr_discount_config
 */
(function () {
  const parseConfig = (metafieldValue) => {
    if (metafieldValue == null || metafieldValue === "") return null;

    let data = metafieldValue;
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch {
        return null;
      }
    }

    if (!Array.isArray(data)) return null;

    const map = {};
    data.forEach((entry) => {
      const id = entry?.selling_plan_id ?? entry?.selling_planId;
      const percent = Number(entry?.display_percent);
      if (id != null && Number.isFinite(percent)) {
        map[String(id)] = percent;
      }
    });

    return Object.keys(map).length ? map : null;
  };

  const isSameId = (a, b) => a != null && b != null && String(a) === String(b);

  const getSkioPercentFromAllocation = (allocation, variant) => {
    const plan = allocation?.selling_plan;
    const adj = plan?.price_adjustments?.[0];
    const compareAt = Math.max(variant?.compare_at_price ?? 0, variant?.price ?? 0);

    if (adj?.value_type === "percentage" && adj?.value != null && +adj.value) {
      return Math.abs(Number(adj.value));
    }

    const perDelivery = allocation?.per_delivery_price;
    if (perDelivery != null && compareAt > 0) {
      return Math.round((1 - Number(perDelivery) / compareAt) * 100);
    }

    if (compareAt > (variant?.price ?? 0)) {
      return Math.round(((compareAt - variant.price) * 100) / compareAt);
    }

    return null;
  };

  const getDisplayPercent = (planId, config, allocation, variant) => {
    const key = String(planId);
    if (config?.[key] != null) return config[key];
    const skio = getSkioPercentFromAllocation(allocation, variant);
    return skio ?? 0;
  };

  const getDisplayPriceCents = (compareAtCents, displayPercent) => {
    const compareAt = Math.max(0, Number(compareAtCents) || 0);
    const percent = Math.min(100, Math.max(0, Number(displayPercent) || 0));
    return Math.round(compareAt * (1 - percent / 100));
  };

  const resolveSubscriptionDisplay = (planId, config, allocation, variant, compareAtCents) => {
    const compareAt = Math.max(0, Number(compareAtCents) || 0);
    const percent = getDisplayPercent(planId, config, allocation, variant);
    const price = getDisplayPriceCents(compareAt, percent);
    return { percent, price, compareAt };
  };

  const getStateConfig = (state) =>
    state?.ctr_discount_config ?? parseConfig(state?.product?.metafields?.custom?.ctr_discount_config);

  const applySelectedPrices = (state, fallbackDiscountedPrice) => {
    if (!state) return;

    const selectedVariant = state.selected_variant;
    const selectedPlanId = state.selected_selling_plan?.id;
    const compareAt = Math.max(selectedVariant?.compare_at_price ?? 0, selectedVariant?.price ?? 0);

    if (!selectedPlanId) {
      state.selected_price = fallbackDiscountedPrice;
      state.selected_compare_at_price = compareAt;
      return;
    }

    const config = getStateConfig(state);
    const allocation = state.selling_plan_allocations?.find((a) => isSameId(a?.selling_plan?.id, selectedPlanId));
    const resolved = resolveSubscriptionDisplay(selectedPlanId, config, allocation, selectedVariant, compareAt);

    state.selected_price = resolved?.price ?? fallbackDiscountedPrice;
    state.selected_compare_at_price = compareAt;
  };

  const formatFrequencyTitle = (name, planId, config, allocation, variant) => {
    if (!name) return "";
    const key = String(planId);
    if (config?.[key] == null) return name;
    const percent = getDisplayPercent(planId, config, allocation, variant);
    if (percent > 0) return `${name} - ${percent}% OFF`;
    return name;
  };

  window.ctrDiscountDisplay = {
    parseConfig,
    getDisplayPercent,
    getDisplayPriceCents,
    resolveSubscriptionDisplay,
    applySelectedPrices,
    formatFrequencyTitle,
  };
})();
/**
 * Display-only subscription pricing for Skio + Discount Kit compatibility.
 * Uses product metafield custom.ctr_discount_config when available.
 */
(function () {
  const parseConfig = (metafieldValue) => {
    if (metafieldValue == null || metafieldValue === "") return null;

    let data = metafieldValue;
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch {
        return null;
      }
    }

    if (!Array.isArray(data)) return null;

    const map = {};
    data.forEach((entry) => {
      const id = entry?.selling_plan_id ?? entry?.selling_planId;
      const percent = Number(entry?.display_percent);
      if (id != null && Number.isFinite(percent)) {
        map[String(id)] = percent;
      }
    });

    return Object.keys(map).length ? map : null;
  };

  const getSkioPercentFromAllocation = (allocation, variant) => {
    const plan = allocation?.selling_plan;
    const adj = plan?.price_adjustments?.[0];
    const compareAt = Math.max(variant?.compare_at_price ?? 0, variant?.price ?? 0);

    if (adj?.value_type === "percentage" && adj?.value != null && +adj.value) {
      return Math.abs(Number(adj.value));
    }

    const perDelivery = allocation?.per_delivery_price;
    if (perDelivery != null && compareAt > 0) {
      return Math.round((1 - Number(perDelivery) / compareAt) * 100);
    }

    if (compareAt > (variant?.price ?? 0)) {
      return Math.round(((compareAt - variant.price) * 100) / compareAt);
    }

    return null;
  };

  const getDisplayPercent = (planId, config, allocation, variant) => {
    const key = String(planId);
    if (config?.[key] != null) return config[key];
    const skio = getSkioPercentFromAllocation(allocation, variant);
    return skio ?? 0;
  };

  const getDisplayPriceCents = (compareAtCents, displayPercent) => {
    const compareAt = Math.max(0, Number(compareAtCents) || 0);
    const percent = Math.min(100, Math.max(0, Number(displayPercent) || 0));
    return Math.round(compareAt * (1 - percent / 100));
  };

  const resolveSubscriptionDisplay = (planId, config, allocation, variant, compareAtCents) => {
    const compareAt = Math.max(0, Number(compareAtCents) || 0);
    const percent = getDisplayPercent(planId, config, allocation, variant);
    const price = getDisplayPriceCents(compareAt, percent);
    return { percent, price, compareAt };
  };

  const applySelectedPrices = (state, fallbackDiscountedPrice) => {
    if (!state) return;

    const selectedVariant = state.selected_variant;
    const selectedPlanId = state.selected_selling_plan?.id;
    const compareAt = Math.max(selectedVariant?.compare_at_price ?? 0, selectedVariant?.price ?? 0);

    if (!selectedPlanId) {
      state.selected_price = fallbackDiscountedPrice;
      state.selected_compare_at_price = compareAt;
      return;
    }

    const config = parseConfig(state?.product?.metafields?.custom?.ctr_discount_config);
    const allocation = state.selling_plan_allocations?.find((a) => a?.selling_plan?.id === selectedPlanId);
    const resolved = resolveSubscriptionDisplay(selectedPlanId, config, allocation, selectedVariant, compareAt);

    state.selected_price = resolved?.price ?? fallbackDiscountedPrice;
    state.selected_compare_at_price = compareAt;
  };

  const formatFrequencyTitle = (name, planId, config, allocation, variant) => {
    if (!name) return "";
    const key = String(planId);
    if (config?.[key] == null) return name;
    const percent = getDisplayPercent(planId, config, allocation, variant);
    if (percent > 0) return `${name} - ${percent}% OFF`;
    return name;
  };

  window.ctrDiscountDisplay = {
    parseConfig,
    getDisplayPercent,
    getDisplayPriceCents,
    resolveSubscriptionDisplay,
    applySelectedPrices,
    formatFrequencyTitle,
  };
})();
/**
 * Display-only subscription pricing for Skio + Discount Kit combined discounts.
 * Configure per product via custom.ctr_discount_config metafield (JSON).
 */
(function () {
  const parseConfig = (metafieldValue) => {
    if (metafieldValue == null || metafieldValue === "") return null;

    let data = metafieldValue;
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch {
        return null;
      }
    }

    if (!Array.isArray(data)) return null;

    const map = {};
    data.forEach((entry) => {
      const id = entry?.selling_plan_id ?? entry?.selling_planId;
      const percent = Number(entry?.display_percent);
      if (id != null && !Number.isNaN(percent)) {
        map[String(id)] = percent;
      }
    });

    return Object.keys(map).length ? map : null;
  };

  const getSkioPercentFromAllocation = (allocation, variant) => {
    const plan = allocation?.selling_plan;
    const adj = plan?.price_adjustments?.[0];
    const compareAt = Math.max(variant?.compare_at_price ?? 0, variant?.price ?? 0);

    if (adj?.value_type === "percentage" && adj?.value != null && +adj.value) {
      return Math.abs(Number(adj.value));
    }

    const perDelivery = allocation?.per_delivery_price;
    if (perDelivery != null && compareAt > 0) {
      return Math.round((1 - Number(perDelivery) / compareAt) * 100);
    }

    if (compareAt > (variant?.price ?? 0)) {
      return Math.round(((compareAt - variant.price) * 100) / compareAt);
    }

    return null;
  };

  const hasMetafieldPercent = (planId, config) => config != null && config[String(planId)] != null;

  const getDisplayPercent = (planId, config, allocation, variant) => {
    const key = String(planId);
    if (config?.[key] != null) return config[key];
    const skio = getSkioPercentFromAllocation(allocation, variant);
    return skio ?? 0;
  };

  const getDisplayPriceCents = (compareAtCents, displayPercent) => {
    const compareAt = Math.max(0, Number(compareAtCents) || 0);
    const percent = Math.min(100, Math.max(0, Number(displayPercent) || 0));
    return Math.round(compareAt * (1 - percent / 100));
  };

  const formatSaveBadge = (percent, style = "save") => {
    const p = Math.round(Number(percent) || 0);
    if (!p) return "";
    return style === "off" ? `${p}% OFF` : `Save ${p}%`;
  };

  const formatFrequencyTitle = (name, planId, config, allocation, variant) => {
    if (!name) return "";
    if (!hasMetafieldPercent(planId, config)) return name;
    const percent = getDisplayPercent(planId, config, allocation, variant);
    if (percent > 0) return `${name} — ${percent}% OFF`;
    return name;
  };

  const warnMismatch = (planId, displayPercent, skioPercent) => {
    if (skioPercent == null || displayPercent == null) return;
    if (Math.abs(displayPercent - skioPercent) > 1) {
      console.warn(
        `[ctr-discount-display] selling_plan ${planId}: display_percent (${displayPercent}%) differs from Skio-only (${skioPercent}%). Verify metafield and Discount Kit config.`,
      );
    }
  };

  const resolveSubscriptionDisplay = ({
    product,
    selectedVariant,
    selectedSellingPlan,
    sellingPlanAllocations,
  }) => {
    if (!selectedSellingPlan?.id) return null;

    const config = parseConfig(product?.metafields?.custom?.ctr_discount_config);
    const planId = selectedSellingPlan.id;
    const allocation = sellingPlanAllocations?.find((a) => a.selling_plan?.id === planId);
    const compareAt = Math.max(selectedVariant?.compare_at_price ?? 0, selectedVariant?.price ?? 0);

    if (!hasMetafieldPercent(planId, config)) return null;

    const displayPercent = config[String(planId)];
    const skioPercent = getSkioPercentFromAllocation(allocation, selectedVariant);
    warnMismatch(planId, displayPercent, skioPercent);

    return {
      useMetafield: true,
      compareAtPrice: compareAt,
      displayPrice: getDisplayPriceCents(compareAt, displayPercent),
      displayPercent,
    };
  };

  const applySelectedPrices = (state, skioDiscountedPrice) => {
    const ctrDisplay = resolveSubscriptionDisplay({
      product: state.product,
      selectedVariant: state.selected_variant,
      selectedSellingPlan: state.selected_selling_plan,
      sellingPlanAllocations: state.selling_plan_allocations,
    });

    if (ctrDisplay?.useMetafield) {
      state.selected_compare_at_price = ctrDisplay.compareAtPrice;
      state.selected_price = ctrDisplay.displayPrice;
      return true;
    }

    state.selected_price = skioDiscountedPrice;
    state.selected_compare_at_price = Math.max(
      state.selected_variant?.compare_at_price ?? 0,
      state.selected_variant?.price ?? 0,
    );
    return false;
  };

  window.ctrDiscountDisplay = {
    parseConfig,
    hasMetafieldPercent,
    getDisplayPercent,
    getDisplayPriceCents,
    getSkioPercentFromAllocation,
    formatSaveBadge,
    formatFrequencyTitle,
    warnMismatch,
    resolveSubscriptionDisplay,
    applySelectedPrices,
  };
})();
