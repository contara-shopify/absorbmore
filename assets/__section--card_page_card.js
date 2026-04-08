const initPageCard = ($el, $refs, pageHandle) => {
  const random_id = utils.shortUUID();

  const page = _pages[pageHandle] || utils.JSONParse(document.querySelector(`[data-page-data="${pageHandle}"]`)?.innerHTML);

  const state = window.Alpine.reactive({
    random_id,
    hydrated: true,
    ...(page ?? {}),
    url: page?.url ?? `/pages/${page?.handle}`,
  });

  if (page) {
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

const hydratePageCard = utils.hydrateCard("page");

window._sections["initPageCard"] = initPageCard;
window._sections["hydratePageCard"] = hydratePageCard;

/* LAST HASH: ca3774d7873255c92cf8b804c954c9f9c62e447d */
