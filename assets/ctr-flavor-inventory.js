(function () {
  'use strict';

  /**
   * Read custom.sold_out / custom.low_stock from variant JSON.
   * Metafields are the single source of truth — not Shopify inventory.
   */
  function readMetafieldBool(variant, key) {
    if (!variant) return false;
    if (variant[key] === true || variant[key] === 'true') return true;
    if (variant[key] === false || variant[key] === 'false' || variant[key] === 0 || variant[key] === '') {
      return false;
    }
    var custom = variant.metafields && variant.metafields.custom;
    if (!custom) return false;
    var val = custom[key];
    if (val == null || val === false || val === 'false' || val === 0 || val === '') return false;
    if (typeof val === 'object' && val !== null && 'value' in val) {
      return val.value === true || val.value === 'true';
    }
    return val === true || val === 'true';
  }

  /**
   * @returns {{ available: boolean, soldOut: boolean, lowStock: boolean }}
   */
  function getVariantState(variant) {
    var soldOut = readMetafieldBool(variant, 'sold_out');
    var lowStock = !soldOut && readMetafieldBool(variant, 'low_stock');
    return {
      available: !soldOut,
      soldOut: soldOut,
      lowStock: lowStock
    };
  }

  function resolveVariant(variantMap, flavor, format) {
    if (!variantMap || !flavor) return null;
    if (format) {
      return variantMap[format + '|' + flavor] || null;
    }
    return variantMap[flavor] || null;
  }

  function getFlavorState(opts) {
    var variant = resolveVariant(opts.variantMap, opts.flavor, opts.format);
    return getVariantState(variant);
  }

  function normalizeOptionValue(val) {
    if (val == null) return '';
    if (typeof val === 'object' && val.name != null) return String(val.name);
    return String(val);
  }

  function resolveVariantForOptionValue(variants, optionIndex, value, selectedOptions) {
    if (!variants || !variants.length || optionIndex < 0) return null;
    var normalizedValue = normalizeOptionValue(value);
    var selected = (selectedOptions || []).map(normalizeOptionValue);

    return (
      variants.find(function (v) {
        if (!v.options || !v.options.length) return false;
        if (normalizeOptionValue(v.options[optionIndex]) !== normalizedValue) return false;
        return v.options.every(function (opt, i) {
          if (i === optionIndex) return true;
          if (i >= selected.length) return true;
          var selectedValue = selected[i];
          if (!selectedValue) return true;
          return normalizeOptionValue(opt) === selectedValue;
        });
      }) || null
    );
  }

  function getOptionState(opts) {
    var variant = resolveVariantForOptionValue(
      opts.variants,
      opts.optionIndex,
      opts.value,
      opts.selectedOptions
    );
    return getVariantState(variant);
  }

  /**
   * Shared availability methods for ctr-pbv2 + ctr-stack-subscribe Alpine factories.
   */
  function createInventoryMethods(config) {
    var variantMap = config.variantMap || {};
    var getFormat = config.getFormat || function () { return null; };
    var getSelectedFlavor = config.getSelectedFlavor || function () { return null; };

    return {
      _getFlavorState: function (flavor, format) {
        return getFlavorState({
          variantMap: variantMap,
          flavor: flavor,
          format: format != null ? format : getFormat.call(this)
        });
      },

      isFlavorSoldOut: function (flavor, format) {
        return this._getFlavorState(flavor, format).soldOut;
      },

      showSoldOutBadge: function (flavor, format) {
        return this.isFlavorSoldOut(flavor, format);
      },

      isFlavorLowStock: function (flavor, format) {
        if (this.isFlavorSoldOut(flavor, format)) return false;
        return this._getFlavorState(flavor, format).lowStock;
      },

      isSelectedFlavorLowStock: function () {
        var flavor = getSelectedFlavor.call(this);
        return flavor ? this.isFlavorLowStock(flavor) : false;
      },

      isSelectedFlavorSoldOut: function () {
        var flavor = getSelectedFlavor.call(this);
        return flavor ? this.isFlavorSoldOut(flavor) : false;
      }
    };
  }

  window.ctrFlavorInventory = {
    readMetafieldBool: readMetafieldBool,
    getVariantState: getVariantState,
    getFlavorState: getFlavorState,
    getOptionState: getOptionState,
    getVariantInventoryState: getVariantState,
    getFlavorInventoryState: getFlavorState,
    getOptionInventoryState: getOptionState,
    resolveVariant: resolveVariant,
    resolveVariantForOptionValue: resolveVariantForOptionValue,
    createInventoryMethods: createInventoryMethods
  };
})();
