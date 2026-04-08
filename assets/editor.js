var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// assets/editor.ts
document.addEventListener("theme:editor:init", () => {
  const styleHiddenElement = /* @__PURE__ */ __name((el, type, element, block_type) => {
    var _a;
    const styleId = element.getAttribute("data-style-id");
    if (element.querySelector(`[data-hide-empty-for-id="${styleId}"]`)) {
      return;
    }
    if (((_a = getComputedStyle(element)) == null ? void 0 : _a.position) === "static") {
      element.style.position = "relative";
    }
    element.style.outline = "4px solid #10c6c6";
    element.style.outlineOffset = "-4px";
    const div = document.createElement("div");
    div.setAttribute("data-shopify-editor-block", el.getAttribute("data-shopify-editor-block"));
    div.innerHTML = type === "block" ? `Empty Block Hidden` : `${type} Hidden - Empty Source: ${block_type}`;
    div.classList.add("hide-dynamically-display");
    div.setAttribute("data-hide-empty-for-id", styleId);
    element.appendChild(div);
  }, "styleHiddenElement");
  const shopifyEvents = [
    "shopify:inspector:activate",
    "shopify:inspector:deactivate",
    "shopify:section:load",
    "shopify:section:unload",
    "shopify:section:select",
    "shopify:section:deselect",
    "shopify:section:reorder",
    "shopify:block:select",
    "shopify:block:deselect"
  ];
  shopifyEvents.forEach((eventType) => {
    document.addEventListener(eventType, (event) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i;
      if (event == null ? void 0 : event.detail) {
      }
      document.querySelectorAll(`[data-hide-if-empty-block]`).forEach((el) => {
        const block_type = el.getAttribute("data-block-type");
        styleHiddenElement(el, "block", el, block_type);
      });
      document.querySelectorAll(`[data-hide-if-empty-container]`).forEach((el) => {
        const block_type = el.getAttribute("data-block-type");
        const element = el.closest(`[data-style-id]:not([data-style-id="${el.getAttribute("data-style-id")}"])`);
        styleHiddenElement(el, "container", element, block_type);
      });
      document.querySelectorAll(`[data-hide-if-empty-section]`).forEach((el) => {
        const block_type = el.getAttribute("data-block-type");
        const element = el.closest(`.shopify-section`);
        styleHiddenElement(el, "section", element, block_type);
      });
      const action = event.type.replace(/shopify:(section|block):/gi, "");
      const editor = window.Alpine.store("editor");
      const resetEditor = {
        load_section_id: "",
        unload_section_id: "",
        reorder_section_id: "",
        deselect_block_id: "",
        deselect_section_id: ""
      };
      const resetEditorFn = /* @__PURE__ */ __name(() => {
        editor.load_section_id = "";
        editor.unload_section_id = "";
        editor.reorder_section_id = "";
        editor.deselect_block_id = "";
        editor.deselect_section_id = "";
      }, "resetEditorFn");
      switch (event.type) {
        case "shopify:section:load": {
          if (event.target instanceof HTMLElement) {
            const sectionElement = event.target.closest("[data-shopify-editor-section]");
            const tab_blocks = [[], [], []];
            sectionElement.setAttribute("x-data", "{ ..._sections.initTabs($el) }");
            sectionElement.querySelectorAll("tab-content-group").forEach((group) => {
              var _a2;
              const label = group.nextElementSibling;
              const group_index = +group.textContent.trim();
              const label_text = label.textContent;
              (_a2 = tab_blocks[group_index]) != null ? _a2 : tab_blocks[group_index] = [];
              tab_blocks[group_index].push(label_text);
              label.remove();
              group.remove();
            });
            sectionElement.querySelectorAll("tab-navigation").forEach((navigation) => {
              var _a2, _b2;
              const label = navigation.querySelector("tab-label");
              const label_content = label.textContent;
              const label_richtext = navigation.querySelector("tab-label-richtext");
              const label_richtext_content = label_richtext.textContent;
              const tab_group = navigation.querySelector("tab-group");
              const tab_group_index = +tab_group.textContent;
              const button_class = navigation.querySelector("tab-button-class");
              const button_class_content = button_class.textContent;
              const hover_trigger = navigation.querySelector("tab-hover-trigger");
              const hover_trigger_content = hover_trigger.textContent;
              const buttons_placeholder = navigation.querySelector("tab-navigation-buttons-placeholder");
              buttons_placeholder.parentElement.innerHTML = (_b2 = (_a2 = tab_blocks[tab_group_index]) == null ? void 0 : _a2.map((tab_label) => {
                const transformedLabel = label_content == null ? void 0 : label_content.replaceAll("[label]", tab_label);
                const transformedRichtextLabel = label_richtext_content == null ? void 0 : label_richtext_content.replaceAll("[label]", tab_label);
                return `<button type="button"
                            @click="current_tabs[${tab_group_index}] = '${transformedLabel}'"
                            @pointerover="if ($el.getAttribute('data-tab-hover-trigger') === 'true') { current_tabs[${tab_group_index}] = '${transformedLabel}' }"
                            data-tab-hover-trigger="${hover_trigger_content}"
                            class="shrink-0 ${button_class_content}"
                            :class="current_tabs[${tab_group_index}] === '${transformedLabel}' ? 'active' : ''">${transformedRichtextLabel}</button>`;
              })) == null ? void 0 : _b2.join("");
              label.remove();
              label_richtext.remove();
              tab_group.remove();
              button_class.remove();
              hover_trigger.remove();
            });
            sectionElement.setAttribute("data-tabs", JSON.stringify(tab_blocks.map((group) => group.join("|%S%|"))));
            document.querySelectorAll("style").forEach((el) => {
              var _a2, _b2;
              if (sectionElement.contains(el)) {
                sectionElement == null ? void 0 : sectionElement.prepend(el);
                return;
              }
              if ((_a2 = el.innerHTML) == null ? void 0 : _a2.includes(event.detail.sectionId)) {
                el.innerHTML = (_b2 = el.innerHTML) == null ? void 0 : _b2.replaceAll(event.detail.sectionId, "overwritten-css-elements-not-in-use");
              }
            });
            window.Shopify.editor = {
              ...(_a = window.Shopify.editor) != null ? _a : {},
              ...resetEditor,
              load_section_id: event.detail.sectionId
            };
            resetEditorFn();
            editor.load_section_id = event.detail.sectionId;
            document.dispatchEvent(new CustomEvent(`editor-${action}--${event.detail.sectionId}`));
            document.dispatchEvent(new CustomEvent(`editor_load`));
          }
          break;
        }
        case "shopify:section:unload": {
          if (event.target instanceof HTMLElement) {
            const sectionElement = event.target.closest("[data-shopify-editor-section]");
            window.Shopify.editor = {
              ...(_b = window.Shopify.editor) != null ? _b : {},
              ...resetEditor,
              unload_section_id: event.detail.sectionId
            };
            resetEditorFn();
            editor.unload_section_id = event.detail.sectionId;
            document.dispatchEvent(new CustomEvent(`editor-${action}--${event.detail.sectionId}`));
            document.dispatchEvent(new CustomEvent(`editor_unload`));
          }
          break;
        }
        case "shopify:section:select":
          window.Shopify.editor = {
            ...(_c = window.Shopify.editor) != null ? _c : {},
            ...resetEditor,
            select_section_id: event.detail.sectionId
          };
          resetEditorFn();
          editor.select_block_id = "";
          editor.load_section_id = event.detail.load ? event.detail.sectionId : "";
          editor.select_section_id = event.detail.sectionId;
          document.dispatchEvent(new CustomEvent(`editor-${action}--${event.detail.sectionId}`));
          break;
        case "shopify:section:deselect":
          window.Shopify.editor = {
            ...(_d = window.Shopify.editor) != null ? _d : {},
            ...resetEditor,
            select_section_id: "",
            select_block_id: "",
            deselect_section_id: event.detail.sectionId
          };
          resetEditorFn();
          editor.select_section_id = "";
          editor.select_block_id = "";
          editor.deselect_section_id = event.detail.sectionId;
          document.dispatchEvent(new CustomEvent(`editor-${action}--${event.detail.sectionId}`));
          break;
        case "shopify:section:reorder":
          window.Shopify.editor = {
            ...(_e = window.Shopify.editor) != null ? _e : {},
            ...resetEditor,
            reorder_section_id: event.detail.sectionId
          };
          resetEditorFn();
          editor.reorder_section_id = event.detail.sectionId;
          document.dispatchEvent(new CustomEvent(`editor-${action}--${event.detail.sectionId}`));
          break;
        case "shopify:block:select":
          window.Shopify.editor = {
            ...(_f = window.Shopify.editor) != null ? _f : {},
            ...resetEditor,
            select_block_id: event.detail.blockId
          };
          resetEditorFn();
          editor.load_section_id = event.detail.load ? event.detail.sectionId : "";
          editor.select_block_id = event.detail.blockId;
          document.dispatchEvent(new CustomEvent(`editor-${action}--${event.detail.blockId}`));
          break;
        case "shopify:block:deselect":
          window.Shopify.editor = {
            ...(_g = window.Shopify.editor) != null ? _g : {},
            ...resetEditor,
            select_block_id: "",
            deselect_block_id: event.detail.blockId
          };
          resetEditorFn();
          editor.select_block_id = "";
          editor.deselect_block_id = event.detail.blockId;
          document.dispatchEvent(new CustomEvent(`editor-${action}--${event.detail.blockId}`));
          break;
        case "shopify:inspector:activate":
          window.Shopify.editor = {
            ...(_h = window.Shopify.editor) != null ? _h : {},
            ...resetEditor,
            inspector: true
          };
          resetEditorFn();
          editor.inspector = true;
          break;
        case "shopify:inspector:deactivate":
          window.Shopify.editor = {
            ...(_i = window.Shopify.editor) != null ? _i : {},
            ...resetEditor,
            inspector: false
          };
          editor.inspector = false;
          break;
      }
    });
  });
  document.querySelectorAll(`[data-hide-if-empty-block]`).forEach((el) => {
    const block_type = el.getAttribute("data-block-type");
    styleHiddenElement(el, "block", el, block_type);
  });
  document.querySelectorAll(`[data-hide-if-empty-container]`).forEach((el) => {
    const block_type = el.getAttribute("data-block-type");
    const element = el.closest(`[data-style-id]:not([data-style-id="${el.getAttribute("data-style-id")}"])`);
    styleHiddenElement(el, "container", element, block_type);
  });
  document.querySelectorAll(`[data-hide-if-empty-section]`).forEach((el) => {
    const block_type = el.getAttribute("data-block-type");
    const element = el.closest(`.shopify-section`);
    styleHiddenElement(el, "section", element, block_type);
  });
});
var messageHandler = /* @__PURE__ */ __name((e) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
  if (((_a = e == null ? void 0 : e.data) == null ? void 0 : _a.type) === "StorefrontMessage::SelectElement" && ((_c = (_b = e == null ? void 0 : e.data) == null ? void 0 : _b.payload) == null ? void 0 : _c.blockDomId) && ((_e = (_d = e == null ? void 0 : e.data) == null ? void 0 : _d.payload) == null ? void 0 : _e.sectionGid)) {
    const editor = window.Alpine.store("editor");
    const resetEditor = {
      load_section_id: "",
      unload_section_id: "",
      reorder_section_id: "",
      deselect_block_id: "",
      deselect_section_id: ""
    };
    window.Shopify.editor = {
      ...(_f = window.Shopify.editor) != null ? _f : {},
      ...resetEditor,
      select_block_id: (_h = (_g = e == null ? void 0 : e.data) == null ? void 0 : _g.payload) == null ? void 0 : _h.blockDomId
    };
    editor.select_block_id = (_j = (_i = e == null ? void 0 : e.data) == null ? void 0 : _i.payload) == null ? void 0 : _j.blockDomId;
    const htmlElement = document.querySelector(`[data-style-id*="${(_l = (_k = e == null ? void 0 : e.data) == null ? void 0 : _k.payload) == null ? void 0 : _l.blockDomId}"]`);
    if (htmlElement) {
      const [_, sectionId, blockId] = (_n = (_m = htmlElement == null ? void 0 : htmlElement.getAttribute("data-style-id")) == null ? void 0 : _m.match(/^(.*?)--([^-]*)$/i)) != null ? _n : [];
      if (!blockId) {
        return;
      }
      window.Shopify.editor = {
        ...(_o = window.Shopify.editor) != null ? _o : {},
        ...resetEditor,
        select_section_id: sectionId,
        select_block_id: blockId
      };
      editor.select_block_id = blockId;
      editor.select_section_id = sectionId;
    }
    window.removeEventListener("message", messageHandler);
  }
}, "messageHandler");
window.addEventListener("message", messageHandler);
