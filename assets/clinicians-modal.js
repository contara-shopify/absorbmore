(function () {
  'use strict';

  if (window.__cliniciansModalInit) return;
  window.__cliniciansModalInit = true;

  var FOCUSABLE = [
    'a[href]',
    'area[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    'audio[controls]',
    'video[controls]',
    'iframe',
    '[contenteditable]:not([contenteditable="false"])'
  ].join(',');

  var instances = new Map();

  function CliniciansModal(root) {
    this.root = root;
    this.sectionId = root.getAttribute('data-section-id');
    this.triggerClass = root.getAttribute('data-trigger-class') || 'clinicians';
    this.triggerSelector = (root.getAttribute('data-trigger-selector') || '').trim();
    this.closeOnOverlay = root.getAttribute('data-close-on-overlay') === 'true';
    this.openOnSelect = root.getAttribute('data-open-on-select') === 'true';
    this.dialog = root.querySelector('.clinicians-modal__dialog');
    this.overlay = root.querySelector('[data-clinicians-modal-overlay]');
    this.lastTrigger = null;
    this.isOpen = false;

    this._onKeydown = this._onKeydown.bind(this);
    this._onOverlayClick = this._onOverlayClick.bind(this);
    this._onCloseClick = this._onCloseClick.bind(this);

    if (this.overlay) this.overlay.addEventListener('click', this._onOverlayClick);
    root.addEventListener('click', this._onCloseClick);
  }

  CliniciansModal.prototype.matches = function (el) {
    return el && typeof el.closest === 'function' && el.closest('.' + this.triggerClass);
  };

  CliniciansModal.prototype.open = function (trigger) {
    if (this.isOpen) return;
    this.isOpen = true;
    this.lastTrigger = trigger || document.activeElement;
    this.root.hidden = false;
    void this.root.offsetWidth;
    this.root.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('clinicians-modal-open');
    document.body.classList.add('clinicians-modal-open');
    document.addEventListener('keydown', this._onKeydown);

    var focusables = this._focusables();
    var first = focusables[0] || this.dialog;
    if (first) {
      try { first.focus({ preventScroll: true }); } catch (e) { first.focus(); }
    }
  };

  CliniciansModal.prototype.close = function () {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.root.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', this._onKeydown);

    var anyOpen = false;
    instances.forEach(function (inst) { if (inst.isOpen) anyOpen = true; });
    if (!anyOpen) {
      document.documentElement.classList.remove('clinicians-modal-open');
      document.body.classList.remove('clinicians-modal-open');
    }

    var trigger = this.lastTrigger;
    this.lastTrigger = null;
    var self = this;
    setTimeout(function () { if (!self.isOpen) self.root.hidden = true; }, 240);

    if (trigger && typeof trigger.focus === 'function') {
      try { trigger.focus({ preventScroll: true }); } catch (e) { trigger.focus(); }
    }
  };

  CliniciansModal.prototype.destroy = function () {
    document.removeEventListener('keydown', this._onKeydown);
    if (this.overlay) this.overlay.removeEventListener('click', this._onOverlayClick);
    this.root.removeEventListener('click', this._onCloseClick);
  };

  CliniciansModal.prototype._focusables = function () {
    return Array.prototype.slice.call(this.root.querySelectorAll(FOCUSABLE))
      .filter(function (el) { return el.offsetParent !== null || el === document.activeElement; });
  };

  CliniciansModal.prototype._onKeydown = function (e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
      e.preventDefault();
      this.close();
      return;
    }
    if (e.key === 'Tab' || e.keyCode === 9) {
      var focusables = this._focusables();
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  CliniciansModal.prototype._onOverlayClick = function () {
    if (this.closeOnOverlay) this.close();
  };

  CliniciansModal.prototype._onCloseClick = function (e) {
    var target = e.target;
    if (!target || typeof target.closest !== 'function') return;

    var closeBtn = target.closest('[data-clinicians-modal-close]');
    if (closeBtn && this.root.contains(closeBtn)) {
      this.close();
      return;
    }

    var accBtn = target.closest('[data-clinicians-modal-accordion]');
    if (accBtn && this.root.contains(accBtn)) {
      var expanded = accBtn.getAttribute('aria-expanded') === 'true';
      accBtn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      var panel = document.getElementById(accBtn.getAttribute('aria-controls'));
      if (panel) {
        if (expanded) {
          panel.setAttribute('hidden', '');
        } else {
          panel.removeAttribute('hidden');
        }
      }
    }
  };

  function register(root) {
    if (!root || instances.has(root)) return;
    instances.set(root, new CliniciansModal(root));
  }

  function unregister(root) {
    var inst = instances.get(root);
    if (!inst) return;
    inst.close();
    inst.destroy();
    instances.delete(root);
  }

  function registerAll(scope) {
    var nodes = (scope || document).querySelectorAll('[data-clinicians-modal]');
    nodes.forEach(function (n) { register(n); });
  }

  function findTrigger(target) {
    if (!target || typeof target.closest !== 'function') return null;
    if (target.closest('[data-clinicians-modal]')) return null;
    var match = null;
    instances.forEach(function (inst) {
      if (match) return;
      var selectors = ['.' + inst.triggerClass];
      if (inst.triggerSelector) selectors.push(inst.triggerSelector);
      var combined = selectors.join(',');
      var hit;
      try { hit = target.closest(combined); } catch (err) { hit = target.closest('.' + inst.triggerClass); }
      if (hit) match = { instance: inst, element: hit };
    });
    return match;
  }

  // Delegated trigger — works for any current or future `.<triggerClass>` element.
  document.addEventListener('click', function (e) {
    var match = findTrigger(e.target);
    if (!match) return;
    if (match.element.tagName === 'A') e.preventDefault();
    match.instance.open(match.element);
  }, false);

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
    var match = findTrigger(e.target);
    if (!match) return;
    var tag = match.element.tagName;
    if (tag === 'BUTTON' || tag === 'A' || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    e.preventDefault();
    match.instance.open(match.element);
  }, false);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { registerAll(); });
  } else {
    registerAll();
  }

  document.addEventListener('modalsLoaded', function () { registerAll(); });

  document.addEventListener('shopify:section:load', function (e) {
    registerAll(e.target);
  });

  document.addEventListener('shopify:section:unload', function (e) {
    var nodes = e.target.querySelectorAll('[data-clinicians-modal]');
    nodes.forEach(function (n) { unregister(n); });
  });

  document.addEventListener('shopify:section:select', function (e) {
    var node = e.target.querySelector('[data-clinicians-modal]');
    if (!node) return;
    var inst = instances.get(node);
    if (inst && inst.openOnSelect) inst.open(null);
  });

  document.addEventListener('shopify:section:deselect', function (e) {
    var node = e.target.querySelector('[data-clinicians-modal]');
    if (!node) return;
    var inst = instances.get(node);
    if (inst) inst.close();
  });

  document.addEventListener('shopify:block:select', function (e) {
    var node = e.target.closest && e.target.closest('[data-clinicians-modal]');
    if (!node) return;
    var inst = instances.get(node);
    if (inst && !inst.isOpen) inst.open(null);
  });
})();
