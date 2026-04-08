const initCommentCard = ($el, $refs, commentId) => {
  const random_id = utils.shortUUID();

  const comment =
    _comments[commentId] || utils.JSONParse(document.querySelector(`[data-comment-data="${commentId}"]`)?.innerHTML);

  const state = window.Alpine.reactive({
    random_id,
    hydrated: true,
    ...(comment ?? {}),
    url: comment?.url,
  });

  if (comment) {
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

const hydrateCommentCard = utils.hydrateCard("comment");

window._sections["initCommentCard"] = initCommentCard;
window._sections["hydrateCommentCard"] = hydrateCommentCard;

/* LAST HASH: a1e2e9b98dcc848ed9f8e968779c3f8894e6e40c */
