export const initSmoothScroll = () => {
  const elements = new Set();

  const scrollToElementByTargetId = (id) => {
    let target = document.getElementById(id);
    if (!target) {
      return;
    }

    if (utils.isElementScrollable(target.parentElement) && utils.isVisible(target.parentElement) && utils.isInViewport(target)) {
      if (target.parentElement.scrollWidth > target.parentElement.offsetWidth) {
        utils.scrollToXY(260, target.offsetLeft, target.parentElement?.scrollTop, target.parentElement);
      }
      if (target.parentElement.scrollHeight > target.parentElement.offsetHeight) {
        utils.scrollToXY(260, target.parentElement?.scrollLeft, target.offsetTop, target.parentElement);
      }
      return;
    }

    if (target.hasAttribute("data-tab-id")) {
      target = target.closest(".shopify-section");
    }

    const targetPosition =
      utils.getElementPosition(target)?.top -
      Math.max(70, document.querySelector(".header-sections-container")?.getBoundingClientRect()?.bottom ?? 0);

    utils.scrollToY(70 + Math.min(Math.abs(Math.round((window.scrollY - targetPosition) / 15)), 500), targetPosition);
  };

  const initEvents = (target = document) => {
    const links = target.querySelectorAll(
      `:where([href*="#"],[data-href*="#"]):not([href*="#modal--"], [href*="#popup--"], [href*="#drawer--"], use)`
    );

    links.forEach((link) => {
      const href = link.href ?? link.getAttribute("data-href");

      if (typeof href !== "string") return;
      if (elements.has(link)) return;
      elements.add(link);
      if (utils.isExternalURL(href)) return;

      const id = href?.split("#")?.at(1)?.split(/[?&]/)?.at(0);
      const target = document.getElementById(id);

      if (!target) return;

      link.addEventListener(
        "click",
        (e) => {
          e.stopPropagation();
          scrollToElementByTargetId(id);
        },
        { capture: true }
      );
    });
  };

  const mutationObserver = new MutationObserver((e) => {
    e?.forEach((record) => {
      const nodes = [];

      if (record?.addedNodes?.length && record?.target instanceof Element) {
        initEvents(record.target);
      }
    });
  });
  mutationObserver.observe(document.body, { childList: true, subtree: true });

  if (window.location.hash) {
    scrollToElementByTargetId(window.location.hash.replace(/#/gi, ""));
  }

  initEvents();
};

document.addEventListener("alpine:init", initSmoothScroll);

/* LAST HASH: a0041974a6dee70e0a9314ae36b665602dbcb395 */
