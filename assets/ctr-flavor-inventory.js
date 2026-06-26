(function () {
  'use strict';

  function cartQtyForVariant(variantId, cartItems) {
    if (!variantId || !cartItems || !cartItems.length) return 0;
    return cartItems.reduce(function (acc, line) {
      return line.variant_id === variantId ? acc + line.quantity : acc;
    }, 0);
  }

  /**
   * Cart-adjusted quantity for a variant.
   * Respects Shopify inventory_management + inventory_policy.
   */
  function getAvailableQuantity(variant, cartItems) {
    if (!variant) return 0;
    var inCart = cartQtyForVariant(variant.id, cartItems);
    if (variant.inventory_management === 'shopify' && variant.inventory_policy === 'deny') {
      return (variant.inventory_quantity || 0) - inCart;
    }
    return 99999;
  }

  /**
   * Resolve a flavor key from variantMap (format|flavor or flavor-only).
   */
  function resolveVariant(variantMap, flavor, format) {
    if (!variantMap || !flavor) return null;
    if (format) {
      return variantMap[format + '|' + flavor] || null;
    }
    return variantMap[flavor] || null;
  }

  function normalizeFlavorName(name) {
    return String(name == null ? '' : name).trim().toLowerCase();
  }

  /**
   * Case-insensitive membership check for a flavor against a list of flavor names.
   */
  function flavorInList(flavor, list) {
    if (!flavor || !list || !list.length) return false;
    var target = normalizeFlavorName(flavor);
    for (var i = 0; i < list.length; i++) {
      if (normalizeFlavorName(list[i]) === target) return true;
    }
    return false;
  }

  /**
   * @returns {{ available: boolean, soldOut: boolean, lowStock: boolean, quantity: number }}
   */
  function getFlavorInventoryState(opts) {
    var inventorySettings = opts.inventorySettings || {};

    // Manual mode: merchant chooses which flavors read as sold out / low stock,
    // independent of real Shopify inventory. Sold-out flavors are also treated as
    // unavailable so purchase + auto-selection stay consistent with the badge.
    if (inventorySettings.mode === 'manual') {
      var manualSoldOut = flavorInList(opts.flavor, inventorySettings.manualSoldOutFlavors);
      var manualLowStock = !manualSoldOut && flavorInList(opts.flavor, inventorySettings.manualLowStockFlavors);
      return {
        available: !manualSoldOut,
        soldOut: manualSoldOut,
        lowStock: manualLowStock,
        quantity: manualSoldOut ? 0 : 99999
      };
    }

    var variantMap = opts.variantMap || {};
    var flavor = opts.flavor;
    var format = opts.format;
    var cartItems = opts.cartItems || [];
    var threshold = opts.threshold != null
      ? Number(opts.threshold)
      : (inventorySettings.threshold != null ? Number(inventorySettings.threshold) : 10);

    var variant = resolveVariant(variantMap, flavor, format);
    var quantity = getAvailableQuantity(variant, cartItems);

    return {
      available: quantity > 0,
      soldOut: quantity <= 0,
      lowStock: quantity > 0 && quantity < threshold,
      quantity: quantity
    };
  }

  /**
   * Shared inventory methods for ctr-pbv2 + ctr-stack-subscribe Alpine factories.
   */
  function createInventoryMethods(config) {
    var variantMap = config.variantMap || {};
    var inventorySettings = config.inventorySettings || {};
    var getFormat = config.getFormat || function () { return null; };
    var getSelectedFlavor = config.getSelectedFlavor || function () { return null; };

    return {
      inventorySettings: inventorySettings,
      cartTick: 0,

      getCartItems: function () {
        var store = window.Alpine && window.Alpine.store('cart');
        return (store && store.state && store.state.items) || window._cart_data?.items || [];
      },

      _getFlavorState: function (flavor, format) {
        void this.cartTick;
        return getFlavorInventoryState({
          variantMap: variantMap,
          flavor: flavor,
          format: format != null ? format : getFormat.call(this),
          cartItems: this.getCartItems(),
          threshold: inventorySettings.threshold,
          inventorySettings: inventorySettings
        });
      },

      _lowStockBadgesEnabled: function () {
        return inventorySettings.enableLowStock !== false;
      },

      getFlavorQuantity: function (flavor, format) {
        return this._getFlavorState(flavor, format).quantity;
      },

      isFlavorSoldOut: function (flavor, format) {
        return this._getFlavorState(flavor, format).soldOut;
      },

      showSoldOutBadge: function (flavor, format) {
        if (inventorySettings.enableSoldOutBadges === false) return false;
        if (inventorySettings.testForceSoldOut) return true;
        return this.isFlavorSoldOut(flavor, format);
      },

      isFlavorLowStock: function (flavor, format) {
        if (!this._lowStockBadgesEnabled()) return false;
        if (inventorySettings.testForceSoldOut) return false;
        if (inventorySettings.testForceLowStock) return true;
        if (this.isFlavorSoldOut(flavor, format)) return false;
        var state = this._getFlavorState(flavor, format);
        return state.lowStock;
      },

      isSelectedFlavorLowStock: function () {
        if (!this._lowStockBadgesEnabled()) return false;
        if (!inventorySettings.enableGalleryBadge) return false;
        if (inventorySettings.testForceSoldOut) return false;
        if (inventorySettings.testForceLowStock) return true;
        var flavor = getSelectedFlavor.call(this);
        return flavor ? this.isFlavorLowStock(flavor) : false;
      },

      _bindCartRefresh: function () {
        var self = this;
        if (this._cartRefreshBound) return;
        this._cartRefreshBound = true;
        this._onCartRefresh = function () { self.cartTick++; };
        document.addEventListener('productAddedToCart', this._onCartRefresh);
        document.addEventListener('cart:refresh', this._onCartRefresh);
      }
    };
  }

  function getVariantInventoryState(variant, cartItems, threshold) {
    var quantity = getAvailableQuantity(variant, cartItems);
    var t = threshold != null ? Number(threshold) : 10;
    return {
      available: quantity > 0,
      soldOut: quantity <= 0,
      lowStock: quantity > 0 && quantity < t,
      quantity: quantity
    };
  }

  function resolveVariantForOptionValue(variants, optionIndex, value, selectedOptions) {
    if (!variants || !variants.length) return null;
    var options = (selectedOptions || []).slice();
    if (optionIndex >= 0) options[optionIndex] = value;
    return variants.find(function (v) {
      return v.options && v.options.every(function (opt, i) { return options[i] === opt; });
    }) || variants.find(function (v) {
      return v.options && v.options[optionIndex] === value;
    }) || null;
  }

  function getOptionInventoryState(opts) {
    var variant = resolveVariantForOptionValue(
      opts.variants,
      opts.optionIndex,
      opts.value,
      opts.selectedOptions
    );
    return getVariantInventoryState(variant, opts.cartItems, opts.threshold);
  }

  window.ctrFlavorInventory = {
    cartQtyForVariant: cartQtyForVariant,
    getAvailableQuantity: getAvailableQuantity,
    getFlavorInventoryState: getFlavorInventoryState,
    getVariantInventoryState: getVariantInventoryState,
    getOptionInventoryState: getOptionInventoryState,
    resolveVariant: resolveVariant,
    resolveVariantForOptionValue: resolveVariantForOptionValue,
    createInventoryMethods: createInventoryMethods
  };
})();
