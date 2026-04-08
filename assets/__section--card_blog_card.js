const initBlogCard = ($el, $refs, blogHandle) => {
  const random_id = utils.shortUUID();

  const blog = _blogs[blogHandle] || utils.JSONParse(document.querySelector(`[data-blog-data="${blogHandle}"]`)?.innerHTML);

  const state = window.Alpine.reactive({
    random_id,
    hydrated: true,
    ...(blog ?? {}),
    url: blog?.url ?? `/blogs/${blog?.handle}`,
  });

  if (blog) {
    setTimeout(() => {
      $el.querySelectorAll("[x-ignore]:not([x-defer])").forEach((child) => {
        if (!document.contains(child)) return;
        utils.initializeIgnoredAlpineTree(child);
      });
    }, 2);
  }

  return {
    card: state,
    $el,
    ...utils.spreadGenericCardFunctions(state),
  };
};

const hydrateBlogCard = utils.hydrateCard("blog");

window._sections["initBlogCard"] = initBlogCard;
window._sections["hydrateBlogCard"] = hydrateBlogCard;

/* LAST HASH: 1049c4046eff98760882d66182cdc862d449d120 */
