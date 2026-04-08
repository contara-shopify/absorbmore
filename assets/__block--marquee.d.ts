declare const initMarqueeBar: ($el: HTMLElement, duration: number) => {
    handleMarqueeResize: () => void;
};
export type InitMarqueeBar = typeof initMarqueeBar;
export {};
