const initMarqueeBar = ($el, duration) => {
  const handleMarqueeResize = () => {
    if ($el.children[0]?.children.length) {
      const initialChildren = [...$el.children[0].children];
      const initialChildren2 = [...$el.children[1].children];

      while ($el.children[0].clientWidth < $el.clientWidth) {
        initialChildren.forEach((child) => {
          const newChild = child.cloneNode(true);
          newChild.setAttribute("aria-hidden", "true");
          newChild.removeAttribute("data-shopify-editor-block");
          newChild.querySelectorAll("[data-shopify-editor-block]").forEach((element) => {
            element.removeAttribute("data-shopify-editor-block");
          });
          $el.children[0].appendChild(newChild);
        });
        initialChildren2.forEach((child) => {
          const newChild = child.cloneNode(true);
          newChild.removeAttribute("data-shopify-editor-block");
          newChild.querySelectorAll("[data-shopify-editor-block]").forEach((element) => {
            element.removeAttribute("data-shopify-editor-block");
          });
          $el.children[1].appendChild(newChild);
        });
      }

      $el.style.setProperty("--animate-duration", `${duration}`);
    }
  };

  return {
    handleMarqueeResize,
  };
};

window._sections["initMarqueeBar"] = initMarqueeBar;

/* LAST HASH: 8db23d8eb443219635909e0aa0008955e3caac9c */
