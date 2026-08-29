(function () {
  'use strict';

  function ctrStackSubscribeFactory(sectionId) {
    var dataTag = document.getElementById('ctr-ss-data-' + sectionId);
    if (!dataTag) return {};

    var DATA = JSON.parse(dataTag.textContent);
    var FLAVOR_OPTIONS = DATA.flavorOptions || [];
    var VARIANT_MAP    = DATA.variantMap    || {};
    var PLANS          = DATA.plans         || [];
    var SWATCH_COLORS  = DATA.swatchColors  || {};
    var INVENTORY_LABELS = DATA.inventoryLabels || {};

    var PLAN_BY_ID = {};
    PLANS.forEach(function(p) { PLAN_BY_ID[p.id] = p; });

    var inventoryMethods = (window.ctrFlavorInventory && window.ctrFlavorInventory.createInventoryMethods)
      ? window.ctrFlavorInventory.createInventoryMethods({
          variantMap: VARIANT_MAP,
          getFormat: function() { return null; },
          getSelectedFlavor: function() { return this.selectedFlavor; }
        })
      : {};

    function flavorAvailable(flavor) {
      if (window.ctrFlavorInventory && window.ctrFlavorInventory.getFlavorState) {
        return window.ctrFlavorInventory.getFlavorState({
          variantMap: VARIANT_MAP,
          flavor: flavor
        }).available;
      }
      return !!(VARIANT_MAP[flavor]);
    }

    function firstInStockFlavor() {
      return FLAVOR_OPTIONS.find(function(f) {
        return flavorAvailable(f);
      }) || FLAVOR_OPTIONS[0] || '';
    }

    /* Find first plan actually available for the initial variant */
    var _initFlavor  = firstInStockFlavor();
    var _initVariant = VARIANT_MAP[_initFlavor];
    var _initPlan    = PLANS.find(function(p) {
      return _initVariant && _initVariant.sellingPlans && _initVariant.sellingPlans[String(p.id)] !== undefined;
    }) || PLANS[0] || null;

    return Object.assign(inventoryMethods, {
      subscribeMode:  true,
      selectedFlavor: _initFlavor,
      selectedPlanId: _initPlan ? _initPlan.id : '',
      buyOnceQty:     1,
      isAdding:       false,
      isAddingUpsell: false,
      galleryIndex:   0,
      mobileStickyVisible: false,
      giftModalOpen:  false,
      upsellFlavors:  {},

      FLAVOR_OPTIONS,
      VARIANT_MAP,
      PLANS,
      SWATCH_COLORS,
      inventoryLabels: INVENTORY_LABELS,

      get currentVariant() {
        return VARIANT_MAP[this.selectedFlavor] || null;
      },

      get currentPlan() {
        return PLAN_BY_ID[this.selectedPlanId] || null;
      },

      /** Only plans that exist in the selected variant's selling_plan_allocations */
      get availablePlans() {
        var v = this.currentVariant;
        if (!v || !v.sellingPlans) return PLANS;
        var self = this;
        return PLANS.filter(function(p) {
          return v.sellingPlans[String(p.id)] !== undefined;
        });
      },

      get currentPrice() {
        if (!this.subscribeMode) return '';
        return this.getPlanPrice();
      },

      get currentComparePrice() {
        if (!this.subscribeMode) return '';
        return this.getPlanComparePrice();
      },

      get currentAvailable() {
        if (typeof this.isFlavorSoldOut === 'function') {
          return !this.isFlavorSoldOut(this.selectedFlavor);
        }
        var v = this.currentVariant;
        return v ? v.available : false;
      },

      getPlanPrice() {
        var v = this.currentVariant;
        if (!v || !v.sellingPlans) return '';
        var sp = v.sellingPlans[String(this.selectedPlanId)];
        if (!sp) return '';
        return this.formatMoney(sp.price);
      },

      getPlanComparePrice() {
        var v = this.currentVariant;
        if (!v || !v.sellingPlans) return '';
        var sp = v.sellingPlans[String(this.selectedPlanId)];
        if (!sp || !sp.compareAt || sp.compareAt === sp.price) return '';
        return this.formatMoney(sp.compareAt);
      },

      getBuyOncePrice() {
        var v = this.currentVariant;
        if (!v) return '';
        return this.formatMoney(v.price);
      },

      getPlanBadge() {
        var v = this.currentVariant;
        if (!v || !v.sellingPlans) return '';
        var sp = v.sellingPlans[String(this.selectedPlanId)];
        if (!sp || !sp.compareAt || !sp.price || sp.compareAt === 0) return '';
        var pct = Math.round((1 - sp.price / sp.compareAt) * 100);
        return pct > 0 ? 'SAVE ' + pct + '%' : '';
      },

      isFlavorAvailable(flavor) {
        if (typeof this.isFlavorSoldOut === 'function') {
          return !this.isFlavorSoldOut(flavor);
        }
        var v = VARIANT_MAP[flavor];
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

      selectFlavor(flavor) {
        if (typeof this.isFlavorSoldOut === 'function' && this.isFlavorSoldOut(flavor)) return;
        this.selectedFlavor = flavor;
        // If current plan is not available for the new variant, pick first available
        var v = VARIANT_MAP[flavor];
        if (v && v.sellingPlans && v.sellingPlans[String(this.selectedPlanId)] === undefined) {
          var first = PLANS.find(function(p) { return v.sellingPlans[String(p.id)] !== undefined; });
          if (first) this.selectedPlanId = first.id;
        }
      },

      adjustQty(delta) {
        this.buyOnceQty = Math.max(1, this.buyOnceQty + delta);
      },

      scrollThumbs(dir) {
        var el = this.$refs.thumbsTrack;
        if (el) el.scrollBy({ top: dir * 80, behavior: 'smooth' });
      },

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

      async addToCart() {
        if (this.isAdding) return;
        var v = this.currentVariant;
        if (!v) return;

        var item;
        if (this.subscribeMode) {
          item = { id: v.id, quantity: 1 };
          if (this.selectedPlanId) item.selling_plan = this.selectedPlanId;
        } else {
          item = { id: v.id, quantity: this.buyOnceQty };
        }

        this.isAdding = true;
        try {
          if (typeof window._cart?.add === 'function') {
            var data = await window._cart.add({ items: [item] });
            if (!data?.cart_error && typeof window._stores?.modal?.setId === 'function') {
              window._stores.modal.setId('modal--cart-drawer');
            }
          } else {
            var response = await fetch('/cart/add.js', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
              body: JSON.stringify({ items: [item] })
            });
            if (!response.ok) throw new Error('Cart error');
            document.dispatchEvent(new CustomEvent('cart:refresh'));
            var drawer = document.querySelector('[data-cart-drawer], cart-drawer, #CartDrawer');
            if (drawer?.open) drawer.open();
            else if (typeof window.theme?.openCartDrawer === 'function') window.theme.openCartDrawer();
            else window.location.href = '/cart';
          }
        } catch (err) {
          console.error('[ctr-ss] Cart add failed:', err);
        } finally {
          this.isAdding = false;
        }
      },

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
        var mainVariant = this.currentVariant;
        var upsellVariant = this.getUpsellVariant(blockId, defaultFlavor);
        if (!mainVariant || !upsellVariant) return;

        this.isAddingUpsell = true;
        try {
          var mainItem = { id: mainVariant.id, quantity: 1 };
          if (this.subscribeMode && this.selectedPlanId) {
            mainItem.selling_plan = this.selectedPlanId;
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
          }
        } catch (err) {
          console.error('[ctr-ss] Upsell cart add failed:', err);
        } finally {
          this.isAddingUpsell = false;
        }
      },

      init() {
        if (typeof this.isFlavorSoldOut === 'function' && this.isFlavorSoldOut(this.selectedFlavor)) {
          this.selectedFlavor = firstInStockFlavor();
        }

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
      }
    });
  }

  window.ctrStackSubscribeFactory = ctrStackSubscribeFactory;

  /* Register with Alpine so x-data can find it even if Alpine initialised first */
  function registerWithAlpine() {
    if (window.Alpine) {
      window.Alpine.data('ctrStackSubscribeFactory', ctrStackSubscribeFactory);
    }
  }
  if (window.Alpine) {
    registerWithAlpine();
  } else {
    document.addEventListener('alpine:init', registerWithAlpine);
  }

  /* Re-init any inert ctr-stack-subscribe sections.
     After a Barba (Smart theme) page transition, Alpine may walk the new
     section before this script has finished loading; the x-data expression
     fails (ctrStackSubscribeFactory undefined) and the scope becomes empty {}.
     Detect that and replace the section with a clone so Alpine re-walks it. */
  function rebootInertSections() {
    if (!window.Alpine) return;
    document.querySelectorAll('[x-data*="ctrStackSubscribeFactory"]').forEach(function (sec) {
      var stack = sec._x_dataStack;
      var hasMethods = !!(stack && stack[0] && typeof stack[0].addToCart === 'function');
      if (hasMethods) return;
      var m = sec.getAttribute('x-data').match(/'([^']+)'/);
      if (!m || !document.getElementById('ctr-ss-data-' + m[1])) return;
      try {
        var clone = sec.cloneNode(true);
        sec.parentNode.replaceChild(clone, sec);
        if (typeof window.Alpine.initTree === 'function') {
          window.Alpine.initTree(clone);
        }
      } catch (e) {
        console.error('[ctr-ss] reboot failed', e);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', rebootInertSections);
  } else {
    setTimeout(rebootInertSections, 0);
  }

  /* Also reboot after Barba transitions */
  document.addEventListener('barba:afterEnter', function () {
    setTimeout(rebootInertSections, 0);
  });
})();