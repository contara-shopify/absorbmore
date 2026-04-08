export const initTheme = () => {
  window.Alpine.store("editor", {
    load_section_id: "",
    unload_section_id: "",
    select_section_id: "",
    reorder_section_id: "",
    select_block_id: "",
    inspector: false,
    setValue(key, value) {
      this[key] = value;
    },
  });
  const editor = window.Alpine.store("editor");
  window.Alpine.magic("editor", () => editor);
  if (window.design_mode) {
    document.dispatchEvent(new CustomEvent("theme:editor:init"));
  }
  document.dispatchEvent(new CustomEvent("theme:init"));
  console.log("theme:init", performance.now());
};

document.addEventListener("alpine:init", initTheme);

/* LAST HASH: e43fe954326010349381dc737d464c85902728ad */
