export const initTooltip = () => {
  const container = document.querySelector("[data-tooltip-container]");
  window.Alpine.store("tooltip", {
    tooltips: new Map(),
    async addTooltip(element, content, position = "top") {
      const currentTooltip = this.tooltips.get(element);
      if (!currentTooltip) {
        const parents = utils.findAllScrollableParents(element);
        const tooltipElement = document.createElement("div");
        tooltipElement.innerHTML = content;
        const abortController = new AbortController();
        const handleUpdateCoordinates = () => {
          const { top, left, right, width, height, bottom } = element.getBoundingClientRect();
          tooltipElement.classList.add("active");
          if (position === "top") {
            tooltipElement.style.top = `${top}px`;
            tooltipElement.style.left = `${left + width / 2}px`;
          }
          if (position === "bottom") {
            tooltipElement.style.top = `${bottom}px`;
            tooltipElement.style.left = `${left + width / 2}px`;
          }
          if (position === "left") {
            tooltipElement.style.top = `${top + height / 2}px`;
            tooltipElement.style.left = `${left}px`;
          }
          if (position === "right") {
            tooltipElement.style.top = `${top + height / 2}px`;
            tooltipElement.style.left = `${right}px`;
          }
        };

        this.tooltips.set(element, {
          tooltip: tooltipElement,
          timeout: null,
          handleUpdateCoordinates,
          scrollParents: parents,
          abortController,
        });
        container.appendChild(tooltipElement);
        tooltipElement.classList.add("tooltip", `tooltip--${position}`);
        await utils.delay(1);

        handleUpdateCoordinates();

        parents.forEach((parent) => {
          parent.addEventListener("scroll", handleUpdateCoordinates, { signal: abortController.signal });
        });
      }
      if (currentTooltip) {
        clearTimeout(currentTooltip.timeout);
        currentTooltip.timeout = null;
      }
    },
    async removeTooltip(element) {
      const currentTooltip = this.tooltips.get(element);

      if (currentTooltip) {
        currentTooltip.abortController?.abort?.();
        const tooltip = currentTooltip.tooltip;
        currentTooltip.timeout = setTimeout(async () => {
          tooltip.classList.remove("active");
          this.tooltips.delete(element);
          tooltip.ontransitionend = (event) => {
            tooltip.remove();
          };
        }, 50);
      }
    },
  });
  const tooltipStore = window.Alpine.store("tooltip");
  window.Alpine.magic("tooltip", () => tooltipStore);
  window._stores["tooltip"] = tooltipStore;
};

document.addEventListener("alpine:init", initTooltip);

/* LAST HASH: b1d11d03c43cf1897d8178e21d530bcd6b829efe */
