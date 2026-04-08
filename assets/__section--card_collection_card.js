const initCollectionCard = ($el, $refs, collectionHandle) => {
  const random_id = utils.shortUUID();

  const collection =
    _collections[collectionHandle] ||
    utils.JSONParse(document.querySelector(`[data-collection-data="${collectionHandle}"]`)?.innerHTML);

  const state = window.Alpine.reactive({
    random_id,
    hydrated: true,
    ...(collection ?? {}),
    url: collection?.url ?? `/collection/${collection?.handle}`,
  });

  if (collection) {
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

const hydrateCollectionCard = utils.hydrateCard("collection");

window._sections["initCollectionCard"] = initCollectionCard;
window._sections["hydrateCollectionCard"] = hydrateCollectionCard;

/* LAST HASH: 96047c7a7a61a338c6a84f6d0c7aa0948047b4ae */
