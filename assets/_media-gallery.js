export const initMediaGallery = () => {
  const modalStore = Alpine.store("modal");

  window.Alpine.store("mediaGallery", {
    media: _products[Object.keys(_products)[0]]?.media ?? [],
    videos: [],
    index: 0,
    scrollIndex: 0,
    showGallery({ media = [], index = 0 }) {
      this.media = media;
      this.index = index;
      this.scrollIndex = index;

      modalStore.setId("media-gallery--vertical-gallery");
    },
    showVideoGallery(element, siblings) {
      const index = siblings.indexOf(element);

      this.videos = siblings.map((el) => {
        const video = utils.JSONParse(el.getAttribute("data-ugc-video") || el.getAttribute("data-video-product-card"));
        const products = utils.JSONParse(el.getAttribute("data-ugc-products") ?? "[]");
        const autoplay = el.hasAttribute("data-autoplay");
        const muted = el.hasAttribute("data-muted");
        const loop = el.hasAttribute("data-loop");
        const controls = el.hasAttribute("data-controls");

        return {
          video:
            typeof video === "string"
              ? {
                  alt: el.textContent,
                  media_type: "external_video",
                  preview_image: null,
                  external_id: new URL(video)?.pathname.split(/[/?#]/gi)?.[1],
                  src: video,
                  host: video?.toLowerCase()?.includes("vimeo") ? "vimeo" : "youtube",
                }
              : video,
          products,
          autoplay,
          muted,
          loop,
          controls,
        };
      });
      this.index = index;
      this.scrollIndex = index;

      modalStore.setId("media-gallery--video-product-gallery");
    },
  });

  const mediaGalleryStore = window.Alpine.store("mediaGallery");
  Alpine.effect(() => {
    if (!modalStore?.id && mediaGalleryStore.media.length) {
      mediaGalleryStore.media = [];
    }
    if (!modalStore?.id && mediaGalleryStore.videos.length) {
      mediaGalleryStore.videos = [];
    }
  });
  window.Alpine.magic("mediaGallery", () => mediaGalleryStore);
  window._stores["mediaGallery"] = mediaGalleryStore;
};

document.addEventListener("alpine:init", initMediaGallery);

/* LAST HASH: d9b6b141f30f14911a02f0e5abf8f1e54aed208c */
