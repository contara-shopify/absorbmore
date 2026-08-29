(function () {
  /**
   * CTR Purchase Box V2
   * Product has 2 options: Format (Bag/Sticks) + Flavor (Mango/Raspberry)
   * Tiers are custom (defined in section settings):
   *   tier1 = 1 bag, tier2 = 2 bags, tier3 = 3 bags, buyone = 1 bag no selling plan
   * Each tier has its own sellingPlanId from settings.
   * bagFlavors[] tracks per-bag flavor selection.
   */
  function ctrPbv2Factory(sectionId) {
    var dataTag = document.getElementById('ctr-pbv2-data-' + sectionId);
    if (!dataTag) return {};

    var DATA = JSON.parse(dataTag.textContent);

    var FORMAT_OPTIONS = DATA.formatOptions || [];
    var FLAVOR_OPTIONS = DATA.flavorOptions || [];
    var VARIANT_MAP    = DATA.variantMap || {};
    var TIERS          = DATA.tiers || [];       // [{id,bagCount,label,badge,price,comparePrice,sellingPlanId,perks}]
    var SWATCH_COLORS  = DATA.swatchColors || {};
    var INVENTORY_LABELS = DATA.inventoryLabels || {};

    /* Build tier lookup by id */
    var TIER_BY_ID = {};
    TIERS.forEach(function(t) { TIER_BY_ID[t.id] = t; });

    var inventoryMethods = (window.ctrFlavorInventory && window.ctrFlavorInventory.createInventoryMethods)
      ? window.ctrFlavorInventory.createInventoryMethods({
          variantMap: VARIANT_MAP,
          getFormat: function() { return this.selectedFormat; },
          getSelectedFlavor: function() { return this.bagFlavors[0] || FLAVOR_OPTIONS[0] || ''; }
        })
      : {};

    function flavorAvailable(format, flavor) {
      if (window.ctrFlavorInventory && window.ctrFlavorInventory.getFlavorState) {
        return window.ctrFlavorInventory.getFlavorState({
          variantMap: VARIANT_MAP,
          flavor: flavor,
          format: format
        }).available;
      }
      return !!VARIANT_MAP[format + '|' + flavor];
    }

    function firstInStockFlavor(format) {
      return FLAVOR_OPTIONS.find(function(f) {
        return flavorAvailable(format, f);
      }) || FLAVOR_OPTIONS[0] || '';
    }

    var initialFormat = FORMAT_OPTIONS[0] || '';
    var initialFlavor = firstInStockFlavor(initialFormat);

    return Object.assign(inventoryMethods, {
      /* ---- state ---- */
      selectedTier:   TIERS[0] ? TIERS[0].id : 'tier1',
      selectedFormat: initialFormat,
      bagFlavors:     [initialFlavor, initialFlavor, initialFlavor],
      buyOnceQty:     1,
      isAdding:       false,
      isAddingUpsell: false,
      galleryIndex:   0,
      mobileStickyVisible: false,
      giftModalOpen:  false,
      upsellFlavors:  {},

      /* ---- exposed consts ---- */
      FORMAT_OPTIONS,
      FLAVOR_OPTIONS,
      VARIANT_MAP,
      TIERS,
      SWATCH_COLORS,
      inventoryLabels: INVENTORY_LABELS,

      /* ---- computed ---- */
      get currentTier() {
        return TIER_BY_ID[this.selectedTier] || null;
      },

      get currentTierPrice() {
        if (this.selectedTier === 'buyone') return '';
        return this.getTierPrice(this.selectedTier);
      },

      get currentTierComparePrice() {
        if (this.selectedTier === 'buyone') return '';
        return this.getTierComparePrice(this.selectedTier);
      },

      /** CTA button price — for buyone uses variant price × qty, otherwise tier price */
      get ctaPrice() {
        if (this.selectedTier === 'buyone') {
          var flavor = this.bagFlavors[0] || FLAVOR_OPTIONS[0];
          var v = this.getVariant(this.selectedFormat, flavor);
          if (!v) return '';
          return this.formatMoney(v.price * this.buyOnceQty);
        }
        if (this.selectedTier === 'tier0') return '$30';
        return this.currentTierPrice;
      },

      get ctaComparePrice() {
        if (this.selectedTier === 'buyone') {
          var flavor = this.bagFlavors[0] || FLAVOR_OPTIONS[0];
          var v = this.getVariant(this.selectedFormat, flavor);
          if (!v || !v.compareAtPrice || v.compareAtPrice <= v.price) return '';
          return this.formatMoney(v.compareAtPrice * this.buyOnceQty);
        }
        if (this.selectedTier === 'tier0') return '$40';
        return this.currentTierComparePrice;
      },

      /** Total price for a tier — custom if enabled, else from selling plan */
      getTierPrice(tierId) {
        var tier = TIER_BY_ID[tierId];
        if (!tier) return '';
        if (tier.useCustomPrice && tier.price) return tier.price;
        return this._calcTierTotal(tier, 'price');
      },

      getTierComparePrice(tierId) {
        var tier = TIER_BY_ID[tierId];
        if (!tier) return '';
        if (tier.useCustomPrice && tier.comparePrice) return tier.comparePrice;
        return this._calcTierTotal(tier, 'compareAt');
      },

      /** Badge text — custom if enabled, else auto-calculate discount % from selling plan */
      getTierBadge(tierId) {
        var tier = TIER_BY_ID[tierId];
        if (!tier) return '';
        if (tier.useCustomBadge && tier.badge) return tier.badge;
        // Auto-calculate: get discount % from first bag's selling plan
        if (!tier.sellingPlanId) return tier.badge || '';
        var flavor = this.bagFlavors[0] || FLAVOR_OPTIONS[0];
        var variant = this.getVariant(this.selectedFormat, flavor);
        if (!variant || !variant.sellingPlans) return tier.badge || '';
        var sp = variant.sellingPlans[String(tier.sellingPlanId)];
        if (!sp || !sp.compareAt || !sp.price || sp.compareAt === 0) return tier.badge || '';
        var pct = Math.round((1 - sp.price / sp.compareAt) * 100);
        return pct > 0 ? pct + '% OFF' : (tier.badge || '');
      },

      /** Buy Once price — current variant price (no selling plan) */
      getBuyOncePrice() {
        var flavor = this.bagFlavors[0] || FLAVOR_OPTIONS[0];
        var v = this.getVariant(this.selectedFormat, flavor);
        if (!v) return '';
        return this.formatMoney(v.price);
      },

      getBuyOnceComparePrice() {
        var flavor = this.bagFlavors[0] || FLAVOR_OPTIONS[0];
        var v = this.getVariant(this.selectedFormat, flavor);
        if (!v || !v.compareAtPrice || v.compareAtPrice <= v.price) return '';
        return this.formatMoney(v.compareAtPrice);
      },

      /** Sum selling plan prices for all bags in a tier using current bagFlavors */
      _calcTierTotal(tier, field) {
        var cents = this._calcTierTotalCents(tier, field);
        return cents !== null ? this.formatMoney(cents) : '';
      },

      /** Returns raw cents total (or null if unavailable) */
      _calcTierTotalCents(tier, field) {
        if (!tier.sellingPlanId) return null;
        var total = 0;
        for (var i = 0; i < tier.bagCount; i++) {
          var flavor = this.bagFlavors[i] || this.bagFlavors[0] || FLAVOR_OPTIONS[0];
          var variant = this.getVariant(this.selectedFormat, flavor);
          if (!variant || !variant.sellingPlans) return null;
          var sp = variant.sellingPlans[String(tier.sellingPlanId)];
          if (!sp) return null;
          total += sp[field] || 0;
        }
        return total;
      },

      /** Price per month = total / bagCount */
      getTierPricePerMonth(tierId) {
        var tier = TIER_BY_ID[tierId];
        if (!tier || !tier.bagCount) return '';
        var cents = this._calcTierTotalCents(tier, 'price');
        if (cents === null) return '';
        return this.formatMoney(Math.round(cents / tier.bagCount));
      },

      /** Total price label: strikethrough compare + actual total */
      getTierTotalLabel(tierId) {
        var tier = TIER_BY_ID[tierId];
        if (!tier) return '';
        var price = this._calcTierTotalCents(tier, 'price');
        if (price === null) return '';
        return this.formatMoney(price) + ' total';
      },

      getTierCompareTotalLabel(tierId) {
        var tier = TIER_BY_ID[tierId];
        if (!tier) return '';
        var compare = this._calcTierTotalCents(tier, 'compareAt');
        if (compare === null) return '';
        return this.formatMoney(compare);
      },

      get currentAvailable() {
        var flavor = this.bagFlavors[0] || FLAVOR_OPTIONS[0];
        if (typeof this.isFlavorSoldOut === 'function') {
          return !this.isFlavorSoldOut(flavor, this.selectedFormat);
        }
        var v = this.getVariant(this.selectedFormat, flavor);
        return v ? v.available : false;
      },

      /* ---- helpers ---- */
      getVariant(format, flavor) {
        return VARIANT_MAP[format + '|' + flavor] || null;
      },

      isVariantAvailable(format, flavor) {
        if (typeof this.isFlavorSoldOut === 'function') {
          return !this.isFlavorSoldOut(flavor, format);
        }
        var v = this.getVariant(format, flavor);
        return v ? v.available : false;
      },

      swatchColor(flavor) {
        return SWATCH_COLORS[(flavor || '').toLowerCase()] || 'transparent';
      },

      formatMoney(cents) {
        if (typeof window.utils?.formatMoney === 'function') {
          return window.utils.formatMoney(cents);
        }
        return '$' + (cents / 100).toFixed(2).replace(/\.00$/, '');
      },

      /* ---- actions ---- */
      selectTier(tierId) {
        this.selectedTier = tierId;
      },

      selectFormat(format) {
        this.selectedFormat = format;
        // Reset to tier1 if leaving Sticks while on the Sticks-only 2-Week tier
        if (format !== 'Sticks' && this.selectedTier === 'tier0') {
          this.selectedTier = TIERS[0] ? TIERS[0].id : 'tier1';
        }
        var firstAvailable = firstInStockFlavor(format);
        // Keep current flavor if available for this format, else use first available
        this.bagFlavors = this.bagFlavors.map(function(f) {
          return flavorAvailable(format, f) ? f : firstAvailable;
        });
      },

      setBagFlavor(bagIndex, flavor) {
        if (this.isFlavorSoldOut && this.isFlavorSoldOut(flavor, this.selectedFormat)) return;
        var next = this.bagFlavors.slice();
        next[bagIndex] = flavor;
        this.bagFlavors = next;
      },

      adjustQty(delta) {
        this.buyOnceQty = Math.max(1, this.buyOnceQty + delta);
      },

      scrollThumbs(dir) {
        var el = this.$refs.thumbsTrack;
        if (el) el.scrollBy({ top: dir * 80, behavior: 'smooth' });
      },

      /* ---- Gallery ---- */
      onMobileGalleryScroll(el) {
        var slides = el.querySelectorAll('.ctr-pbv2__gallery-mobile-slide');
        if (!slides.length) return;
        var slideWidth = slides[0].offsetWidth + 12;
        var index = Math.min(Math.round(el.scrollLeft / slideWidth), slides.length - 1);
        if (index !== this.galleryIndex) this.galleryIndex = index;
      },

      scrollMobileGallery(index) {
        var el = this.$refs.mobileGallery;
        if (!el) return;
        var slides = el.querySelectorAll('.ctr-pbv2__gallery-mobile-slide');
        if (!slides[index]) return;
        el.scrollTo({ left: slides[index].offsetLeft - 20, behavior: 'smooth' });
        this.galleryIndex = index;
      },

      /* ---- Add to Cart ---- */
      async addToCart() {
        if (this.isAdding) return;

        var items = [];

        if (this.selectedTier === 'buyone') {
          var flavor = this.bagFlavors[0] || FLAVOR_OPTIONS[0];
          var v = this.getVariant(this.selectedFormat, flavor);
          if (!v) return;
          items.push({ id: v.id, quantity: this.buyOnceQty });
        } else if (this.selectedTier === 'tier0') {
          /* Sticks-only 2-Week / 14-stick subscription. Fixed variant + plan.
             Not marked _stack_group: 'restore-bundle' so the retier script
             doesn't try to re-tier it alongside 28-serving bags/sticks. */
          items.push({
            id: 51513897812257,
            quantity: 1,
            selling_plan: 690941395233
          });
        } else {
          var tier = this.currentTier;
          if (!tier) return;
          for (var i = 0; i < tier.bagCount; i++) {
            var bagFlavor = this.bagFlavors[i] || this.bagFlavors[0] || FLAVOR_OPTIONS[0];
            var variant = this.getVariant(this.selectedFormat, bagFlavor);
            if (!variant) continue;
            var item = { id: variant.id, quantity: 1, properties: { _stack_group: 'restore-bundle' } };
            if (tier.sellingPlanId) item.selling_plan = tier.sellingPlanId;
            items.push(item);
          }
        }

        if (!items.length) return;
        this.isAdding = true;

        try {
          if (typeof window._cart?.add === 'function') {
            var data = await window._cart.add({ items });
            if (!data?.cart_error && typeof window._stores?.modal?.setId === 'function') {
              window._stores.modal.setId('modal--cart-drawer');
            }
          } else {
            var response = await fetch('/cart/add.js', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
              body: JSON.stringify({ items })
            });
            if (!response.ok) throw new Error('Cart error');
            document.dispatchEvent(new CustomEvent('cart:refresh'));
            var drawer = document.querySelector('[data-cart-drawer], cart-drawer, #CartDrawer');
            if (drawer?.open) drawer.open();
            else if (typeof window.theme?.openCartDrawer === 'function') window.theme.openCartDrawer();
            else window.location.href = '/cart';
          }
        } catch (err) {
          console.error('[ctr-pbv2] Cart add failed:', err);
        } finally {
          this.isAdding = false;
        }
      },

      /* ---- Upsell ---- */
      getUpsellData(blockId) {
        var tag = document.getElementById('ctr-pbv2-upsell-' + blockId);
        if (!tag) return { flavorOptions: [], variantMap: {} };
        try { return JSON.parse(tag.textContent); } catch(e) { return { flavorOptions: [], variantMap: {} }; }
      },

      getUpsellVariant(blockId, defaultFlavor) {
        var data = this.getUpsellData(blockId);
        var flavor = this.upsellFlavors[blockId] || defaultFlavor || (data.flavorOptions || [])[0] || '';
        return (data.variantMap || {})[flavor] || null;
      },

      async addUpsellToCart(blockId, defaultFlavor) {
        if (this.isAddingUpsell) return;
        var mainVariant = this.getVariant(this.selectedFormat, this.bagFlavors[0] || FLAVOR_OPTIONS[0]);
        var upsellVariant = this.getUpsellVariant(blockId, defaultFlavor);
        if (!mainVariant || !upsellVariant) return;

        this.isAddingUpsell = true;
        try {
          /* Add main product (1 bag, tier1 selling plan or no plan) */
          var tier = this.currentTier;
          var mainItem = { id: mainVariant.id, quantity: 1 };
          if (tier && tier.sellingPlanId && this.selectedTier !== 'buyone') {
            mainItem.selling_plan = tier.sellingPlanId;
          }
          var items = [mainItem, { id: upsellVariant.id, quantity: 1 }];

          if (typeof window._cart?.add === 'function') {
            var data = await window._cart.add({ items });
            if (!data?.cart_error && typeof window._stores?.modal?.setId === 'function') {
              window._stores.modal.setId('modal--cart-drawer');
            }
          } else {
            var response = await fetch('/cart/add.js', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
              body: JSON.stringify({ items })
            });
            if (!response.ok) throw new Error('Cart error');
            document.dispatchEvent(new CustomEvent('cart:refresh'));
            var drawer = document.querySelector('[data-cart-drawer], cart-drawer, #CartDrawer');
            if (drawer?.open) drawer.open();
            else if (typeof window.theme?.openCartDrawer === 'function') window.theme.openCartDrawer();
            else window.location.href = '/cart';
          }
        } catch (err) {
          console.error('[ctr-pbv2] Upsell cart add failed:', err);
        } finally {
          this.isAddingUpsell = false;
        }
      },

      /* ---- Mobile sticky observer ---- */
      init() {
        this._ensureInStockFlavors();

        if (
          !window.matchMedia('(max-width: 767px)').matches ||
          !('IntersectionObserver' in window) ||
          !this.$refs.primaryCta
        ) return;

        var observer = new IntersectionObserver(
          ([entry]) => { this.mobileStickyVisible = !entry.isIntersecting; },
          { threshold: 0.2 }
        );
        observer.observe(this.$refs.primaryCta);
      },

      _ensureInStockFlavors() {
        var firstAvailable = firstInStockFlavor(this.selectedFormat);
        this.bagFlavors = this.bagFlavors.map(function(f) {
          return flavorAvailable(this.selectedFormat, f) ? f : firstAvailable;
        }.bind(this));
      }
    });
  }

  window.ctrPbv2Factory = ctrPbv2Factory;

  /* Re-init any inert ctr-pbv2 sections.
     After a Barba (Smart theme) page transition, Alpine may walk the new
     section before this script has finished loading; the x-data expression
     fails (ctrPbv2Factory undefined) and the scope becomes empty {}. Detect
     that and replace the section with a clone so Alpine re-walks it fresh. */
  function rebootInertSections() {
    if (!window.Alpine) return;
    document.querySelectorAll('[x-data*="ctrPbv2Factory"]').forEach(function (sec) {
      var stack = sec._x_dataStack;
      var hasMethods = !!(stack && stack[0] && typeof stack[0].selectFormat === 'function');
      if (hasMethods) return;
      var m = sec.getAttribute('x-data').match(/'([^']+)'/);
      if (!m || !document.getElementById('ctr-pbv2-data-' + m[1])) return;
      try {
        var clone = sec.cloneNode(true);
        sec.parentNode.replaceChild(clone, sec);
        if (typeof window.Alpine.initTree === 'function') {
          window.Alpine.initTree(clone);
        }
      } catch (e) {
        console.error('[ctr-pbv2] reboot failed', e);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', rebootInertSections);
  } else {
    /* Defer one tick so Alpine has a chance to walk first */
    setTimeout(rebootInertSections, 0);
  }

  /* Also reboot after Barba transitions */
  document.addEventListener('barba:afterEnter', function () {
    setTimeout(rebootInertSections, 0);
  });
})();