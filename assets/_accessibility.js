export const initAccessibility = () => {
  document.querySelectorAll(`[role="button"], [role="link"], [data-icon-handle]`).forEach((element) => {
    element.onkeydown = (event) => {
      if (element.role !== "link" && element.role !== "button") {
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        event.stopPropagation();
        element.dispatchEvent(new Event("click"));
      }
    };
  });
};

initAccessibility();

/* LAST HASH: 34b4514faa88a66700515c462682e1b73284bb72 */
