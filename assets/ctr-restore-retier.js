/**
 * ctr-restore-retier.js
 *
 * Watches the cart for changes to Restore bundle bags (identified by
 * _stack_group === 'restore-bundle' line item property) and automatically
 * re-assigns the Skio selling plan that matches the new total bag count.
 *
 * Tier map (source of truth — update plan IDs here if Skio plans change):
 *   1 bag  → gid/690941591841  1 Month  / every 30 days / 25% off
 *   2 bags → gid/690941559073  2 Months / every 60 days / 30% off
 *   3+bags → gid/690975899937  3 Months / every 90 days / 35% off
 *
 * Scope: only lines with properties._stack_group === 'restore-bundle'
 * are counted or modified. All other cart lines are untouched.
 */
(function () {
  'use strict';

  /* ── Tier map ──────────────────────────────────────────────────── */
  /* Plan IDs must exist in the variant's selling_plan_allocations or
     /cart/change.js will 422 and the Smart theme will hard-reload. */
  var TIER_MAP = [
    { minQty: 3, planId: 690975899937, label: '3-Month / 35% plan', cadence: 'ships every 90 days' },
    { minQty: 2, planId: 690941559073, label: '2-Month / 30% plan', cadence: 'ships every 60 days' },
    { minQty: 1, planId: 690941395233, label: '1-Month / 25% plan', cadence: 'ships every 30 days' },
  ];

  var STACK_GROUP_KEY = '_stack_group';
  var STACK_GROUP_VAL = 'restore-bundle';
  var DEBOUNCE_MS     = 400;

  /* ── Helpers ────────────────────────────────────────────────────── */
  function isBundleBag(item) {
    return (
      item.quantity > 0 &&
      item.selling_plan_allocation &&        // subscription only — exclude buy-once
      item.properties &&
      item.properties[STACK_GROUP_KEY] === STACK_GROUP_VAL
    );
  }

  function resolveTier(totalQty) {
    for (var i = 0; i < TIER_MAP.length; i++) {
      if (totalQty >= TIER_MAP[i].minQty) return TIER_MAP[i];
    }
    return null;
  }

  /* ── CSS (injected once) ────────────────────────────────────────── */
  (function injectStyles() {
    if (document.getElementById('ctr-retier-styles')) return;
    var s = document.createElement('style');
    s.id = 'ctr-retier-styles';
    s.textContent = [
      '.ctr-retier-loading {',
      '  position: relative;',
      '  pointer-events: none;',
      '}',
      '.ctr-retier-loading::after {',
      '  content: "";',
      '  position: absolute;',
      '  inset: 0;',
      '  background: rgba(255,255,255,0.55);',
      '  backdrop-filter: blur(2px);',
      '  -webkit-backdrop-filter: blur(2px);',
      '  border-radius: inherit;',
      '  z-index: 10;',
      '}',
      '.ctr-retier-loading::before {',
      '  content: "";',
      '  position: absolute;',
      '  top: 50%;',
      '  left: 50%;',
      '  width: 20px;',
      '  height: 20px;',
      '  margin: -10px 0 0 -10px;',
      '  border: 2px solid #d5d1c9;',
      '  border-top-color: #1a1a1a;',
      '  border-radius: 50%;',
      '  animation: ctr-retier-spin 0.7s linear infinite;',
      '  z-index: 11;',
      '}',
      '@keyframes ctr-retier-spin {',
      '  to { transform: rotate(360deg); }',
      '}',
    ].join('\n');
    document.head.appendChild(s);
  })();

  /* ── Loading state helpers ──────────────────────────────────────── */
  function setLinesLoading(keys, loading) {
    keys.forEach(function (key) {
      var el = document.querySelector('[data-line-item-id="' + key + '"]');
      if (!el) return;
      if (loading) {
        el.classList.add('ctr-retier-loading');
      } else {
        el.classList.remove('ctr-retier-loading');
      }
    });
  }

  /* ── Core retier logic ──────────────────────────────────────────── */
  var _timer    = null;
  var _running  = false;
  var _rerun    = false;

  function scheduleRetier() {
    if (_running) {
      _rerun = true;
      return;
    }
    clearTimeout(_timer);
    _timer = setTimeout(runRetier, DEBOUNCE_MS);
  }

  async function runRetier() {
    if (_running) { _rerun = true; return; }
    _running = true;
    try {
      await doRetier();
    } finally {
      _running = false;
      if (_rerun) {
        _rerun = false;
        scheduleRetier();
      }
    }
  }

  async function doRetier() {
    var cartState = window._stores?.cart?.state;
    if (!cartState || !Array.isArray(cartState.items)) return;

    var bundleLines = cartState.items.filter(isBundleBag);
    if (!bundleLines.length) return;

    var totalQty = bundleLines.reduce(function (sum, item) { return sum + item.quantity; }, 0);
    var tier = resolveTier(totalQty);
    if (!tier) return;

    /* Check if all bundle lines already have the correct plan */
    var allCorrect = bundleLines.every(function (item) {
      return item.selling_plan_allocation?.selling_plan?.id === tier.planId;
    });
    if (allCorrect) return;

    /* Track previous tier for notification */
    var prevTierLabel = bundleLines[0]?.selling_plan_allocation?.selling_plan?.name || '';

    /* Show loading state on bundle lines */
    var bundleKeys = bundleLines.map(function (l) { return l.key; });
    setLinesLoading(bundleKeys, true);

    /* Re-assign selling plan on every bundle line that needs it */
    var changed = false;
    for (var i = 0; i < bundleLines.length; i++) {
      var line = bundleLines[i];
      if (line.selling_plan_allocation?.selling_plan?.id === tier.planId) continue;

      try {
        var resp = await fetch('/cart/change.js?smart_theme=true', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            id: line.key,
            quantity: line.quantity,
            selling_plan: tier.planId,
          }),
        });
        if (!resp.ok) {
          /* Plan not valid for this variant or another cart error.
             Bail out completely so we don't loop or trigger the theme's
             cart-error reload behavior. */
          console.warn('[ctr-retier] /cart/change.js returned', resp.status, '— aborting');
          setLinesLoading(bundleKeys, false);
          return;
        }
        changed = true;
      } catch (e) {
        console.error('[ctr-retier] Failed to update line', line.key, e);
        setLinesLoading(bundleKeys, false);
        return;
      }
    }

    if (!changed) {
      setLinesLoading(bundleKeys, false);
      return;
    }

    /* Refresh cart state. The cart store will replace state.items, which
       will re-fire Alpine.effect; the _running guard absorbs that. */
    if (typeof window._cart?.get === 'function') {
      try { await window._cart.get(); } catch (e) {}
    }

    /* Remove loading after state refresh so the new plan/cadence is
       rendered before the spinner disappears (no flash of stale row). */
    setLinesLoading(bundleKeys, false);

    /* Suppress one more retier wakeup caused by our own state refresh */
    _rerun = false;

    /* Show notice */
    showRetierNotice(tier, prevTierLabel);
  }

  /* ── Notification ────────────────────────────────────────────────── */
  function showRetierNotice(tier, _prevLabel) {
    /* Try theme toast if available */
    if (typeof window._stores?.toast?.addToast === 'function') {
      window._stores.toast.addToast({
        type: 'info',
        target: 'cart',
        title: 'Subscription updated',
        content: 'Updated to ' + tier.label + ', ' + tier.cadence + '.',
        duration: 5000,
      });
      return;
    }

    /* Fallback: inject a small banner inside the cart drawer */
    var drawer = document.querySelector('[data-cart-drawer], #CartDrawer, .cart-drawer');
    if (!drawer) return;

    var existing = drawer.querySelector('.ctr-retier-notice');
    if (existing) existing.remove();

    var el = document.createElement('div');
    el.className = 'ctr-retier-notice';
    el.style.cssText = [
      'padding:10px 16px',
      'margin:8px 16px',
      'background:#f0ede7',
      'border-radius:6px',
      'font-size:13px',
      'line-height:1.4',
      'color:#1a1a1a',
    ].join(';');
    el.textContent = 'Updated to ' + tier.label + ', ' + tier.cadence + '.';
    drawer.insertAdjacentElement('afterbegin', el);

    setTimeout(function () { el.remove(); }, 6000);
  }

  /* ── Event wiring ────────────────────────────────────────────────── */
  document.addEventListener('cart:updated', scheduleRetier);
  document.addEventListener('cart:refresh', scheduleRetier);

  /* Alpine effect — fires whenever cart.state.items changes */
  function wireAlpineEffect() {
    if (!window.Alpine || !window._stores?.cart) return;
    window.Alpine.effect(function () {
      var items = window._stores.cart.state?.items;
      if (items) scheduleRetier();
    });
  }

  if (window.Alpine) {
    wireAlpineEffect();
  } else {
    document.addEventListener('alpine:init', wireAlpineEffect);
    document.addEventListener('alpine:initialized', wireAlpineEffect);
  }
})();
