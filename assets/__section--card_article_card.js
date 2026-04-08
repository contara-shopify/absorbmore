const initArticleCard = ($el, $refs, articleHandle) => {
  const random_id = utils.shortUUID();

  const article =
    _articles[articleHandle] || utils.JSONParse(document.querySelector(`[data-article-data="${articleHandle}"]`)?.innerHTML);

  const state = window.Alpine.reactive({
    random_id,
    hydrated: true,
    ...(article ?? {}),
    url: article?.url ?? `/blogs/${article?.handle}`,
  });

  if (article) {
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

const hydrateArticleCard = utils.hydrateCard("article");

window._sections["initArticleCard"] = initArticleCard;
window._sections["hydrateArticleCard"] = hydrateArticleCard;

/* LAST HASH: a89dcb7ce15bc3e230264e628bb4fc8e54900684 */
