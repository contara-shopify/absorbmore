/**
 * Display-only subscription pricing for Skio + Discount Kit compatibility.
 * Source of truth:
 * - state.ctr_discount_config (from Liquid-injected data attribute), fallback to
 * - product metafield custom.ctr_discount_config
 */
(function () {
  const warnedConfigPlans = new Set();

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

    if (!Array.isArray(data) && data && typeof data === "object") {
      if (Array.isArray(data.value)) {
        data = data.value;
      } else if (typeof data.value === "string") {
        try {
          const parsed = JSON.parse(data.value);
          data = Array.isArray(parsed) ? parsed : data;
        } catch {
          // Ignore and keep current data for graceful fallback.
        }
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

  const getConfiguredPercent = (planId, config) => {
    if (planId == null || !config) return null;
    const value = config[String(planId)];
    const percent = Number(value);
    return Number.isFinite(percent) ? percent : null;
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
    const configuredPercent = getConfiguredPercent(planId, config);
    if (configuredPercent != null) return configuredPercent;
    const skio = getSkioPercentFromAllocation(allocation, variant);
    return skio ?? 0;
  };

  const getDisplayPriceCents = (compareAtCents, displayPercent) => {
    const compareAt = Math.max(0, Number(compareAtCents) || 0);
    const percent = Math.min(100, Math.max(0, Number(displayPercent) || 0));
    return Math.round(compareAt * (1 - percent / 100));
  };

  const resolveSubscriptionDisplay = (planId, config, allocation, variant, compareAtCents, fallbackPriceCents) => {
    const compareAt = Math.max(0, Number(compareAtCents) || 0);
    const configuredPercent = getConfiguredPercent(planId, config);
    const perDeliveryPrice = Number(allocation?.per_delivery_price);
    const fallbackPrice = Number(fallbackPriceCents);
    const skioPrice = Number.isFinite(perDeliveryPrice)
      ? perDeliveryPrice
      : Number.isFinite(fallbackPrice)
        ? fallbackPrice
        : Number(variant?.price) || 0;

    if (configuredPercent != null) {
      return {
        percent: configuredPercent,
        price: getDisplayPriceCents(compareAt, configuredPercent),
        compareAt,
        source: "metafield",
      };
    }

    if (config && planId != null) {
      const key = String(planId);
      if (!warnedConfigPlans.has(key)) {
        warnedConfigPlans.add(key);
        console.warn(
          `[ctr-discount-display] Missing custom.ctr_discount_config entry for selling_plan_id=${key}. Falling back to Skio display values.`,
        );
      }
    }

    return {
      percent: getDisplayPercent(planId, null, allocation, variant),
      price: skioPrice,
      compareAt,
      source: "skio",
    };
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
    const resolved = resolveSubscriptionDisplay(
      selectedPlanId,
      config,
      allocation,
      selectedVariant,
      compareAt,
      fallbackDiscountedPrice,
    );

    state.selected_price = resolved?.price ?? fallbackDiscountedPrice;
    state.selected_compare_at_price = compareAt;
  };

  const formatFrequencyTitle = (name, planId, config, allocation, variant) => {
    if (!name) return "";
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
