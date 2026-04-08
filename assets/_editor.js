document.addEventListener("theme:editor:init", () => {
  const styleHiddenElement = (el, type, element, block_type) => {
    const styleId = element.getAttribute("data-style-id");
    if (element.querySelector(`[data-hide-empty-for-id="${styleId}"]`)) {
      return;
    }

    if (getComputedStyle(element)?.position === "static") {
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
  };

  const shopifyEvents = [
    "shopify:inspector:activate",
    "shopify:inspector:deactivate",
    "shopify:section:load",
    "shopify:section:unload",
    "shopify:section:select",
    "shopify:section:deselect",
    "shopify:section:reorder",
    "shopify:block:select",
    "shopify:block:deselect",
  ];

  shopifyEvents.forEach((eventType) => {
    document.addEventListener(eventType, (event) => {
      if (event?.detail) {
        // console.log(event.type, event.detail.blockId, event.detail);
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
        deselect_section_id: "",
      };

      const resetEditorFn = () => {
        editor.load_section_id = "";
        editor.unload_section_id = "";
        editor.reorder_section_id = "";
        editor.deselect_block_id = "";
        editor.deselect_section_id = "";
      };

      switch (event.type) {
        case "shopify:section:load": {
          if (event.target instanceof HTMLElement) {
            const sectionElement = event.target.closest("[data-shopify-editor-section]");

            const tab_blocks = [[], [], []];

            sectionElement.setAttribute("x-data", "{ ..._sections.initTabs($el) }");

            sectionElement.querySelectorAll("tab-content-group").forEach((group) => {
              const label = group.nextElementSibling;
              const group_index = +group.textContent.trim();
              const label_text = label.textContent;
              tab_blocks[group_index] ??= [];
              tab_blocks[group_index].push(label_text);
              label.remove();
              group.remove();
            });

            sectionElement.querySelectorAll("tab-navigation").forEach((navigation) => {
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

              buttons_placeholder.parentElement.innerHTML = tab_blocks[tab_group_index]
                ?.map((tab_label) => {
                  const transformedLabel = label_content?.replaceAll("[label]", tab_label);
                  const transformedRichtextLabel = label_richtext_content?.replaceAll("[label]", tab_label);
                  return `<button type="button"
                            @click="current_tabs[${tab_group_index}] = '${transformedLabel}'"
                            @pointerover="if ($el.getAttribute('data-tab-hover-trigger') === 'true') { current_tabs[${tab_group_index}] = '${transformedLabel}' }"
                            data-tab-hover-trigger="${hover_trigger_content}"
                            class="shrink-0 ${button_class_content}"
                            :class="current_tabs[${tab_group_index}] === '${transformedLabel}' ? 'active' : ''">${transformedRichtextLabel}</button>`;
                })
                ?.join("");

              label.remove();
              label_richtext.remove();
              tab_group.remove();
              button_class.remove();
              hover_trigger.remove();
            });

            sectionElement.setAttribute("data-tabs", JSON.stringify(tab_blocks.map((group) => group.join("|%S%|"))));

            /* This is important as we are parsing all styles on the Server Side into a single block, but the Theme editor loads in duplicates. */
            document.querySelectorAll("style").forEach((el) => {
              if (sectionElement.contains(el)) {
                sectionElement?.prepend(el);
                return;
              }
              if (el.innerHTML?.includes(event.detail.sectionId)) {
                el.innerHTML = el.innerHTML?.replaceAll(event.detail.sectionId, "overwritten-css-elements-not-in-use");
              }
            });

            window.Shopify.editor = {
              ...(window.Shopify.editor ?? {}),
              ...resetEditor,
              load_section_id: event.detail.sectionId,
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
              ...(window.Shopify.editor ?? {}),
              ...resetEditor,
              unload_section_id: event.detail.sectionId,
            };
            resetEditorFn();
            editor.unload_section_id = event.detail.sectionId;
            // window.Alpine.destroyTree(sectionElement);
            document.dispatchEvent(new CustomEvent(`editor-${action}--${event.detail.sectionId}`));
            document.dispatchEvent(new CustomEvent(`editor_unload`));
          }
          break;
        }
        case "shopify:section:select":
          window.Shopify.editor = {
            ...(window.Shopify.editor ?? {}),
            ...resetEditor,
            select_section_id: event.detail.sectionId,
          };
          resetEditorFn();
          editor.select_block_id = "";
          editor.load_section_id = event.detail.load ? event.detail.sectionId : "";
          editor.select_section_id = event.detail.sectionId;
          document.dispatchEvent(new CustomEvent(`editor-${action}--${event.detail.sectionId}`));
          break;
        case "shopify:section:deselect":
          window.Shopify.editor = {
            ...(window.Shopify.editor ?? {}),
            ...resetEditor,
            select_section_id: "",
            select_block_id: "",
            deselect_section_id: event.detail.sectionId,
          };
          resetEditorFn();
          editor.select_section_id = "";
          editor.select_block_id = "";
          editor.deselect_section_id = event.detail.sectionId;
          document.dispatchEvent(new CustomEvent(`editor-${action}--${event.detail.sectionId}`));
          break;
        case "shopify:section:reorder":
          window.Shopify.editor = {
            ...(window.Shopify.editor ?? {}),
            ...resetEditor,
            reorder_section_id: event.detail.sectionId,
          };
          resetEditorFn();
          editor.reorder_section_id = event.detail.sectionId;
          document.dispatchEvent(new CustomEvent(`editor-${action}--${event.detail.sectionId}`));
          break;
        case "shopify:block:select":
          window.Shopify.editor = {
            ...(window.Shopify.editor ?? {}),
            ...resetEditor,
            select_block_id: event.detail.blockId,
          };
          resetEditorFn();
          editor.load_section_id = event.detail.load ? event.detail.sectionId : "";
          editor.select_block_id = event.detail.blockId;
          document.dispatchEvent(new CustomEvent(`editor-${action}--${event.detail.blockId}`));
          break;
        case "shopify:block:deselect":
          window.Shopify.editor = {
            ...(window.Shopify.editor ?? {}),
            ...resetEditor,
            select_block_id: "",
            deselect_block_id: event.detail.blockId,
          };
          resetEditorFn();
          editor.select_block_id = "";
          editor.deselect_block_id = event.detail.blockId;
          document.dispatchEvent(new CustomEvent(`editor-${action}--${event.detail.blockId}`));
          break;
        case "shopify:inspector:activate":
          window.Shopify.editor = {
            ...(window.Shopify.editor ?? {}),
            ...resetEditor,
            inspector: true,
          };
          resetEditorFn();
          editor.inspector = true;
          break;
        case "shopify:inspector:deactivate":
          window.Shopify.editor = {
            ...(window.Shopify.editor ?? {}),
            ...resetEditor,
            inspector: false,
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

const messageHandler = (e) => {
  if (e?.data?.type === "StorefrontMessage::SelectElement" && e?.data?.payload?.blockDomId && e?.data?.payload?.sectionGid) {
    const editor = window.Alpine.store("editor");
    const resetEditor = {
      load_section_id: "",
      unload_section_id: "",
      reorder_section_id: "",
      deselect_block_id: "",
      deselect_section_id: "",
    };

    window.Shopify.editor = {
      ...(window.Shopify.editor ?? {}),
      ...resetEditor,
      select_block_id: e?.data?.payload?.blockDomId,
    };

    editor.select_block_id = e?.data?.payload?.blockDomId;

    const htmlElement = document.querySelector(`[data-style-id*="${e?.data?.payload?.blockDomId}"]`);

    if (htmlElement) {
      const [_, sectionId, blockId] = htmlElement?.getAttribute("data-style-id")?.match(/^(.*?)--([^-]*)$/i) ?? [];

      if (!blockId) {
        return;
      }

      window.Shopify.editor = {
        ...(window.Shopify.editor ?? {}),
        ...resetEditor,
        select_section_id: sectionId,
        select_block_id: blockId,
      };

      editor.select_block_id = blockId;
      editor.select_section_id = sectionId;
    }

    window.removeEventListener("message", messageHandler);
  }
};
window.addEventListener("message", messageHandler);

/* LAST HASH: e56f99ecf433f50f4f8ee0b4edfec90a6b757a34 */
