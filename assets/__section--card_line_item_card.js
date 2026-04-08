const initLineItemCard = ($el, lineItemKey) => {
  const random_id = utils.shortUUID();

  const cart = Alpine.store("cart");

  const lineItem = Shopify.designMode
    ? cart.state.items.find((item) => item.key === lineItemKey) ??
      cart.state.items.find((item) => !!item?.properties?._p_id) ??
      cart.state.items.find((item) => !item?.properties?._p_id_link && !item?.properties?._p_hidden) ??
      cart.state.items[0]
    : cart.state.items.find((item) => item.key === lineItemKey);

  const children = lineItem?.properties?._p_id
    ? cart.state.items
        .filter((child) => child?.properties?._p_id_link === lineItem?.properties?._p_id && child.quantity)
        ?.map((child) => {
          let product = _products[child?.handle];

          if (!product) {
            _product.getProductData(child?.handle, child?.product_id).then((prod) => {
              const index = state.children.findIndex((line) => line.line_item?.key === child?.key);
              if (index !== -1) {
                state.children[index] = {
                  line_item: child,
                  product: prod,
                  variant: prod?.variants?.find((variant) => variant.id === child?.variant_id),
                };
              }
            });
          }
          product ??= _products[child?.handle];

          const variant = product?.variants?.find((variant) => variant.id === child?.variant_id);

          return {
            line_item: child,
            product,
            variant,
          };
        })
    : [];

  let product = _products[lineItem?.handle];

  if (!product) {
    _product.getProductData(lineItem?.handle, lineItem?.product_id).then((prod) => {
      state.product = prod;
      state.variant = prod?.variants?.find((variant) => variant.id === lineItem?.variant_id);
      state.hydrated = true;
    });
  }
  product ??= _products[lineItem?.handle];

  const variant = product?.variants?.find((variant) => variant.id === lineItem?.variant_id);

  const selling_plan = lineItem?.selling_plan_allocation?.selling_plan ?? variant?.selling_plan_allocations?.[0]?.selling_plan;

  const selling_plan_discount_wording = selling_plan?.price_adjustments?.[0]?.value
    ? selling_plan?.price_adjustments?.[0]?.value_type === "fixed_amount"
      ? `${utils.formatMoney(selling_plan?.price_adjustments?.[0]?.value * lineItem.quantity)}`
      : selling_plan?.price_adjustments?.[0]?.value_type === "percentage"
      ? `${selling_plan?.price_adjustments?.[0]?.value}%`
      : ""
    : "";

  const state = window.Alpine.reactive({
    random_id,
    subscriptionIsChanging: false,
    hydrated: !!variant,
    line_item: lineItem,
    initial_quantity: lineItem.quantity,
    product: product,
    variant: variant,
    selling_plan_discount_wording,
    url: lineItem?.url,
    children: [...children],
    price: lineItem?.final_price,
    compare_at_price: Math.max(
      lineItem?.original_price ?? 0,
      variant?.compare_at_price ?? 0,
      lineItem?.selling_plan_allocation?.compare_at_price ?? 0
    ),
    bundle_price:
      lineItem?.final_price +
      (children?.reduce(
        (acc, child) => (acc += child?.line_item?.final_price * (child?.line_item?.quantity / lineItem.quantity) || 0),
        0
      ) || 0),
    bundle_compare_at_price:
      Math.max(
        lineItem?.original_price ?? 0,
        variant?.compare_at_price ?? 0,
        lineItem?.selling_plan_allocation?.compare_at_price ?? 0
      ) +
      (children?.reduce(
        (acc, child) =>
          (acc += Math.max(
            child?.line_item?.original_price * (child?.line_item?.quantity / lineItem.quantity) || 0,
            child?.variant?.compare_at_price * (child?.line_item?.quantity / lineItem.quantity) || 0,
            child?.line_item?.selling_plan_allocation?.compare_at_price * (child?.line_item?.quantity / lineItem.quantity) || 0
          )),
        0
      ) || 0),
    quantity_limit: !children?.length
      ? Math.min(
          variant?.inventory_management === "shopify" && variant?.inventory_policy === "deny"
            ? variant?.inventory_quantity -
                cart.state.items.reduce(
                  (acc, line) => (acc += line.variant_id === variant?.id && line.key !== lineItem.key ? line.quantity : 0),
                  0
                )
            : variant?.preorder && variant?.preorder_quantity
            ? variant?.inventory_quantity +
              variant?.preorder_quantity -
              cart?.state?.items?.reduce((acc, line) => (line.variant_id === variant.id ? acc + line.quantity : acc), 0)
            : 99999
        )
      : Math.min(
          variant?.inventory_management === "shopify" && variant?.inventory_policy === "deny"
            ? variant?.inventory_quantity
            : 9999,
          ...children.map((child) => {
            const quantity_ratio = child.line_item.quantity / lineItem?.quantity;

            return child?.variant?.inventory_management === "shopify" && child?.variant?.inventory_policy === "deny"
              ? Math.floor(
                  (child?.variant?.inventory_quantity -
                    cart.state.items.reduce(
                      (acc, line) =>
                        (acc += line.variant_id === child?.variant?.id && line.key !== child.line_item.key ? line.quantity : 0),
                      0
                    )) /
                    quantity_ratio
                )
              : 9999;
          })
        ),
  });

  const setSubscription = async (selling_plan_id) => {
    state.subscriptionIsChanging = true;
    const p_id = state.line_item?.properties?._p_id;
    const key = state?.line_item?.key;
    const quantity = state?.line_item?.quantity;

    const getUpdateAbleChildren = async (id) => {
      const children = [];
      for (const child of cart.state.items) {
        if (child?.properties?._p_id_link !== id) continue;
        let product = _products[child?.handle];

        if (!product) {
          await _product.getProductData(child?.handle, child?.product_id);
        }
        product ??= _products[child?.handle];

        const variant = product?.variants?.find((variant) => variant.id === child?.variant_id);
        if (
          (!selling_plan_id && child.selling_plan_allocation?.selling_plan?.id) ||
          (variant?.selling_plan_allocations?.some((plan) => plan?.selling_plan?.id === selling_plan_id) &&
            child.selling_plan_allocation?.selling_plan?.id !== selling_plan_id)
        ) {
          children.push({
            line_item: child,
            product,
            variant,
          });
        }
      }
      return children;
    };

    if (p_id) {
      while ((await getUpdateAbleChildren(p_id))?.length) {
        const firstChild = (await getUpdateAbleChildren(p_id))[0];
        await _cart.change({
          id: firstChild.line_item.key,
          selling_plan: +selling_plan_id,
          quantity: firstChild?.line_item.quantity,
        });
      }
      const mainItem = cart.state.items?.find((item) => item?.properties?._p_id === p_id);
      await _cart.change({ id: mainItem.key, selling_plan: +selling_plan_id, quantity: mainItem.quantity });
    }

    if (!p_id) {
      await _cart.change({ id: key, selling_plan: +selling_plan_id, quantity: quantity });
    }

    state.subscriptionIsChanging = false;
  };

  const showConditionally = (condition) => {
    switch (condition) {
      case "no_addon_products":
        return !state.children?.length;
      case "addon_products":
        return !!state.children?.length;
      case "always": {
        return true;
      }
      case "with_subscriptions": {
        return !!state.line_item?.selling_plan_allocation?.selling_plan?.id;
      }
      case "no_subscriptions": {
        return !state.line_item?.selling_plan_allocation?.selling_plan?.id;
      }
      case "with_variants": {
        return state?.product?.variants?.length > 1;
      }
      case "no_variants": {
        return state?.product?.variants?.length <= 1;
      }
    }
  };

  Alpine.effect(() => {
    const lineItem = Shopify.designMode
      ? cart.state.items.find((item) => item.key === lineItemKey) ??
        cart.state.items.find((item) => !!item?.properties?._p_id) ??
        cart.state.items.find((item) => !item?.properties?._p_id_link && !item?.properties?._p_hidden) ??
        cart.state.items[0]
      : cart.state.items.find((item) => item.key === lineItemKey) ?? state.line_item;

    if (!utils.deepEqual(lineItem, state.line_item)) {
      state.line_item = lineItem;
    }
  });

  Alpine.effect(() => {
    const selling_plan =
      state?.line_item?.selling_plan_allocation?.selling_plan ?? state?.variant?.selling_plan_allocations?.[0]?.selling_plan;

    state.selling_plan_discount_wording = selling_plan?.price_adjustments?.[0]?.value
      ? selling_plan?.price_adjustments?.[0]?.value_type === "fixed_amount"
        ? `${utils.formatMoney(selling_plan?.price_adjustments?.[0]?.value * state?.line_item?.quantity)}`
        : selling_plan?.price_adjustments?.[0]?.value_type === "percentage"
        ? `${selling_plan?.price_adjustments?.[0]?.value}%`
        : ""
      : "";
  });

  Alpine.effect(() => {
    if (!state.line_item) return;
    state.children = state?.line_item?.properties?._p_id
      ? cart.state.items
          .filter((child) => child?.properties?._p_id_link === state?.line_item?.properties?._p_id && child.quantity)
          ?.map((child) => {
            let product = _products[child?.handle];

            if (!product) {
              _product.getProductData(child?.handle, child?.product_id).then((prod) => {
                const index = state.children.findIndex((line) => line.line_item?.key === child?.key);
                if (index !== -1) {
                  state.children[index] = {
                    line_item: child,
                    product: prod,
                    variant: prod?.variants?.find((variant) => variant.id === child?.variant_id),
                  };
                }
              });
            }
            product ??= _products[child?.handle];

            const variant = product?.variants?.find((variant) => variant.id === child?.variant_id);

            return {
              line_item: child,
              product,
              variant,
            };
          })
      : [];

    state.price = state.line_item?.final_price;
    state.compare_at_price = Math.max(
      state.line_item?.original_price ?? 0,
      state.variant?.compare_at_price ?? 0,
      state.line_item?.selling_plan_allocation?.compare_at_price ?? 0
    );
    state.bundle_price =
      state.line_item?.final_price +
      (state.children?.reduce(
        (acc, child) => (acc += child?.line_item?.final_price * (child?.line_item?.quantity / state.line_item.quantity) || 0),
        0
      ) || 0);
    state.bundle_compare_at_price =
      Math.max(
        state.line_item?.original_price ?? 0,
        state.variant?.compare_at_price ?? 0,
        state.line_item?.selling_plan_allocation?.compare_at_price ?? 0
      ) +
      (state.children?.reduce(
        (acc, child) =>
          (acc += Math.max(
            child?.line_item?.original_price * (child?.line_item?.quantity / state.line_item.quantity) || 0,
            child?.variant?.compare_at_price * (child?.line_item?.quantity / state.line_item.quantity) || 0,
            child?.line_item?.selling_plan_allocation?.compare_at_price *
              (child?.line_item?.quantity / state.line_item.quantity) || 0
          )),
        0
      ) || 0);

    state.quantity_limit = !state.children?.length
      ? Math.min(
          state.variant?.inventory_management === "shopify" && state.variant?.inventory_policy === "deny"
            ? state.variant?.inventory_quantity -
                cart.state.items.reduce(
                  (acc, line) =>
                    (acc += line.variant_id === state.variant?.id && line.key !== state?.line_item?.key ? line.quantity : 0),
                  0
                )
            : state.variant?.preorder && state.variant?.preorder_quantity
            ? state.variant?.inventory_quantity +
              state.variant?.preorder_quantity -
              cart?.state?.items?.reduce((acc, line) => (line.variant_id === state.variant.id ? acc + line.quantity : acc), 0)
            : 99999
        )
      : Math.min(
          state.variant?.inventory_management === "shopify" && state.variant?.inventory_policy === "deny"
            ? state.variant?.inventory_quantity
            : 9999,
          ...state.children.map((child) => {
            const quantity_ratio = child.line_item.quantity / state.line_item?.quantity;

            return child?.variant?.inventory_management === "shopify" && child?.variant?.inventory_policy === "deny"
              ? Math.floor(
                  (child?.variant?.inventory_quantity -
                    cart.state.items.reduce(
                      (acc, line) =>
                        (acc += line.variant_id === child?.variant?.id && line.key !== child.line_item.key ? line.quantity : 0),
                      0
                    )) /
                    quantity_ratio
                )
              : 9999;
          })
        );
  });

  return {
    line_card: state,
    $el,
    ...utils.spreadGenericCardFunctions(state),
    showConditionally,
    setSubscription,
  };
};

const hydrateLineItemCard = utils.hydrateCard("line-item");

window._sections["initLineItemCard"] = initLineItemCard;
window._sections["hydrateLineItemCard"] = hydrateLineItemCard;

/* LAST HASH: 0a9766402b69ef6269e054fdf1450cc2571ec99e */
