import type { _Media_liquid } from "./_shopify.js";
export type MediaGalleryStore = {
    video_gallery_show: boolean;
    media: _Media_liquid[];
    videos: {
        video: Extract<_Media_liquid, {
            media_type: "external_video" | "video";
        }>;
        products: [string, number][];
        autoplay?: boolean;
        muted?: boolean;
        loop?: boolean;
        controls?: boolean;
    }[];
    index: number;
    showGallery: (input: {
        media: _Media_liquid[];
        index: number;
    }) => void;
    showVideoGallery: (element: HTMLElement, siblings: HTMLElement[]) => void;
};
export declare const initMediaGallery: () => void;
declare module "alpinejs" {
    interface Magics<T> {
        $mediaGallery: MediaGalleryStore;
    }
}
