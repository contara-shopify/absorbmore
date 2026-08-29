(function () {
  'use strict';

  if (window.__glpFlavorPickerInit) return;
  window.__glpFlavorPickerInit = true;

  var FLAVOR_DOT = { mango: 'mango', 'mango lemonade': 'mango', raspberry: 'raspberry' };
  var FLAVOR_LABEL = { 'mango lemonade': 'Mango' };
  var DEFAULT_FLAVOR = 'Raspberry';

  function dotClass(f) {
    var k = (f || '').toLowerCase();
    return FLAVOR_DOT[k] || 'default';
  }

  function displayLabel(f) {
    var k = (f || '').toLowerCase();
    return FLAVOR_LABEL[k] || f;
  }

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function getMainProductForm() {
    return document.querySelector('.shopify-product-form[data-section-type="main_product"]');
  }

  function getInventoryLabels() {
    var form = getMainProductForm();
    if (!form) return {};
    try {
      var raw = form.getAttribute('data-inventory-labels');
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function getVariantById(vid) {
    var form = getMainProductForm();
    if (!form || !window.Alpine) return null;
    try {
      var pdp = window.Alpine.$data(form).pdp;
      if (!pdp || !pdp.product || !pdp.product.variants) return null;
      return pdp.product.variants.find(function (v) {
        return String(v.id) === String(vid);
      }) || null;
    } catch (e) {
      return null;
    }
  }

  function updatePillBadges(attempt) {
    attempt = attempt || 0;
    var labels = getInventoryLabels();
    var inv = window.ctrFlavorInventory;
    if (!inv) {
      if (attempt < 25) setTimeout(function () { updatePillBadges(attempt + 1); }, 150);
      return;
    }

    var pills = document.querySelectorAll('[data-component-choose-plan] .glp-flavor-pill');

    Array.prototype.forEach.call(pills, function (pill) {
      var vid = pill.getAttribute('data-glp-variant-id');
      pill.querySelectorAll('.ctr-pbv2__flavor-badge').forEach(function (badge) {
        badge.remove();
      });

      if (!vid) return;

      var variant = getVariantById(vid);
      var state = inv.getVariantState(variant);
      var showSoldOut = state.soldOut;
      var showLowStock = !showSoldOut && state.lowStock;

      pill.classList.toggle('is-sold-out', !!showSoldOut);
      pill.disabled = !!showSoldOut;

      if (showSoldOut) {
        var soldBadge = document.createElement('span');
        soldBadge.className = 'ctr-pbv2__flavor-badge ctr-pbv2__flavor-badge--sold-out';
        soldBadge.textContent = labels.soldOutPill || 'Sold Out';
        pill.appendChild(soldBadge);
      } else if (showLowStock) {
        var lowBadge = document.createElement('span');
        lowBadge.className = 'ctr-pbv2__flavor-badge';
        lowBadge.textContent = labels.lowStockPill || 'Low Stock';
        pill.appendChild(lowBadge);
      }
    });
  }

  function init(attempt) {
    attempt = attempt || 0;
    var root = document.querySelector('[data-component-choose-plan]');
    var lis = root && root.querySelectorAll('ul.product-choose-supply-variants > li');
    if (!root || !lis || !lis.length) {
      if (attempt < 30) setTimeout(function () { init(attempt + 1); }, 200);
      return;
    }

    var rows = [];
    var seen = {};
    var option2Values = [];

    Array.prototype.forEach.call(lis, function (li) {
      var input = li.querySelector('input[type=radio]');
      var label = li.querySelector('label');
      var title = (label && label.getAttribute('aria-label')) || '';
      var parts = title.split(' / ');
      var opt1 = (parts[0] || title).trim();
      var opt2 = (parts[1] || '').trim();
      var vid = input ? input.value : '';
      rows.push({ li: li, label: label, option1: opt1, option2: opt2, variantId: vid });
      if (!seen[opt1]) {
        seen[opt1] = true;
        li.setAttribute('data-glp-primary', '1');
      } else {
        li.setAttribute('data-glp-dupe', '1');
      }
      if (opt2 && option2Values.indexOf(opt2) === -1) option2Values.push(opt2);
    });

    if (option2Values.length < 2) return;

    var variantMap = {};
    rows.forEach(function (r) {
      if (!variantMap[r.option1]) variantMap[r.option1] = {};
      variantMap[r.option1][r.option2] = r.variantId;
    });

    rows.forEach(function (r) {
      if (r.li.getAttribute('data-glp-primary') !== '1') return;
      var titleEl = r.li.querySelector('.product-choose-plan__title');
      if (titleEl) titleEl.textContent = r.option1;

      var body = r.li.querySelector('.product-choose-plan__body');
      if (!body || body.querySelector('.glp-flavor-picker')) return;

      var picker = document.createElement('div');
      picker.className = 'glp-flavor-picker';

      var lbl = document.createElement('p');
      lbl.className = 'glp-flavor-picker__label';
      lbl.textContent = 'Select Flavor for Restore';
      picker.appendChild(lbl);

      var pillsWrap = document.createElement('div');
      pillsWrap.className = 'glp-flavor-picker__pills';

      option2Values.forEach(function (flavor) {
        var variantId = variantMap[r.option1] && variantMap[r.option1][flavor];
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'glp-flavor-pill';
        btn.setAttribute('data-glp-flavor', flavor);
        btn.setAttribute('data-glp-variant-id', variantId || '');
        btn.setAttribute('aria-pressed', 'false');

        var dot = document.createElement('span');
        dot.className = 'glp-flavor-pill__dot glp-flavor-pill__dot--' + dotClass(flavor);
        btn.appendChild(dot);
        btn.appendChild(document.createTextNode(displayLabel(flavor)));

        btn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          if (btn.disabled) return;
          if (variantId) selectVariantById(variantId);
        });
        pillsWrap.appendChild(btn);
      });

      picker.appendChild(pillsWrap);
      body.appendChild(picker);
    });

    function findRowByVid(vid) {
      for (var i = 0; i < rows.length; i++) {
        if (String(rows[i].variantId) === String(vid)) return rows[i];
      }
      return null;
    }

    function getSelectedRow() {
      var inp = root.querySelector('input[type=radio]:checked');
      return inp ? findRowByVid(inp.value) : null;
    }

    function getSellingPlanInput() {
      return document.querySelector('input[name="selling_plan"]');
    }

    function getCurrentPlanId() {
      var inp = getSellingPlanInput();
      return inp ? (inp.value || '').trim() : '';
    }

    function getSubscribeToggle() {
      return document.querySelector('[data-style-id*="subscribe_toggle_card"]');
    }

    var subscribeIntent = false;
    var userTurnedOff = false;

    function refreshSubscribeIntent() {
      if (getCurrentPlanId()) {
        subscribeIntent = true;
        userTurnedOff = false;
      }
    }

    function watchUserToggle() {
      var toggle = getSubscribeToggle();
      if (!toggle || toggle.__glpWatched) return;
      toggle.__glpWatched = true;
      toggle.addEventListener(
        'click',
        function () {
          setTimeout(function () {
            if (getCurrentPlanId()) {
              subscribeIntent = true;
              userTurnedOff = false;
            } else {
              userTurnedOff = true;
            }
          }, 20);
        },
        true
      );
    }

    function restoreSubscribeIfNeeded(tries) {
      tries = tries || 0;
      if (tries > 8) return;
      if (userTurnedOff || !subscribeIntent) return;
      if (getCurrentPlanId()) return;
      var toggle = getSubscribeToggle();
      if (!toggle || toggle.offsetParent === null) {
        setTimeout(function () { restoreSubscribeIfNeeded(tries + 1); }, 80);
        return;
      }
      try {
        toggle.click();
      } catch (e) {}
      setTimeout(function () {
        if (!getCurrentPlanId()) restoreSubscribeIfNeeded(tries + 1);
      }, 80);
    }

    var PREFERRED_PLAN_ID = 691192922401;
    var initialPlanId = null;

    function captureInitialPlanId() {
      var cur = getCurrentPlanId();
      if (cur && !initialPlanId) initialPlanId = cur;
    }

    function setSellingPlanDirect(planId) {
      var toggle = getSubscribeToggle();
      if (!toggle || !window.Alpine) return false;
      try {
        var d = window.Alpine.$data(toggle);
        if (d && typeof d.setSellingPlan === 'function') {
          d.setSellingPlan(Number(planId));
          return true;
        }
      } catch (e) {}
      return false;
    }

    function restoreSubscribeDirect(tries) {
      tries = tries || 0;
      if (tries > 10) return;
      if (userTurnedOff || !subscribeIntent) return;
      if (getCurrentPlanId()) return;
      var planId = initialPlanId || PREFERRED_PLAN_ID;
      var ok = setSellingPlanDirect(planId);
      if (!ok) {
        setTimeout(function () { restoreSubscribeDirect(tries + 1); }, 80);
        return;
      }
      setTimeout(function () {
        if (!getCurrentPlanId()) restoreSubscribeDirect(tries + 1);
      }, 80);
    }

    function selectVariantById(vid) {
      var r = findRowByVid(vid);
      if (!r) return;
      var input = r.li.querySelector('input[type=radio]');
      if (!input) return;
      if (input.checked) {
        syncAll();
        return;
      }
      refreshSubscribeIntent();
      var rowLabel = r.li.querySelector('label');
      if (rowLabel) {
        rowLabel.click();
      } else {
        input.checked = true;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
      setTimeout(function () {
        restoreSubscribeDirect(0);
        restoreSubscribeIfNeeded(0);
      }, 60);
    }

    function syncPills() {
      var sel = getSelectedRow();
      var flavor = sel ? sel.option2 : '';
      var pills = root.querySelectorAll('.glp-flavor-pill');
      Array.prototype.forEach.call(pills, function (p) {
        var want = p.getAttribute('data-glp-flavor') === flavor ? 'true' : 'false';
        if (p.getAttribute('aria-pressed') !== want) p.setAttribute('aria-pressed', want);
      });
    }

    function syncActiveRows() {
      var sel = getSelectedRow();
      if (!sel) return;
      rows.forEach(function (r) {
        if (r.li.getAttribute('data-glp-primary') !== '1') return;
        var should = r.option1 === sel.option1;
        var has = r.li.classList.contains('glp-active');
        if (should && !has) r.li.classList.add('glp-active');
        else if (!should && has) r.li.classList.remove('glp-active');
      });
    }

    function syncAll() {
      syncPills();
      syncActiveRows();
      updatePillBadges();
    }

    root.addEventListener(
      'change',
      function (e) {
        var t = e.target;
        if (!t || t.type !== 'radio') return;
        setTimeout(syncAll, 0);
        setTimeout(function () { restoreSubscribeIfNeeded(0); }, 40);
      },
      true
    );

    refreshSubscribeIntent();
    captureInitialPlanId();
    watchUserToggle();
    setTimeout(function () {
      refreshSubscribeIntent();
      captureInitialPlanId();
      watchUserToggle();
    }, 400);
    setTimeout(function () {
      refreshSubscribeIntent();
      captureInitialPlanId();
      watchUserToggle();
    }, 1500);

    var initialSel = getSelectedRow();
    if (!initialSel || initialSel.option2 !== DEFAULT_FLAVOR) {
      var opt1 = initialSel ? initialSel.option1 : rows[0].option1;
      var targetId = variantMap[opt1] && variantMap[opt1][DEFAULT_FLAVOR];
      if (targetId) selectVariantById(targetId);
    }

    setTimeout(syncAll, 100);
    setTimeout(syncAll, 600);
    setTimeout(updatePillBadges, 1200);
  }

  ready(function () {
    requestAnimationFrame(function () { init(0); });
    document.addEventListener('ctr-inventory:refresh', function () {
      updatePillBadges();
    });
    if (window.theme_settings?.ctr_inventory_barba_fix === true) {
      document.addEventListener('pageFullyLoaded', function () {
        requestAnimationFrame(function () { init(0); });
      });
    }
  });
})();
