export declare const initContentSlider: ($el: HTMLElement, container: HTMLElement, speed?: number, infiniteScroll?: boolean | "all" | "off" | "desktop" | "mobile", autoRotate?: number, enable_mouse_dragging?: boolean) => {
    content_slider: {
        container: HTMLElement;
        state: any;
        handleInfiniteScroll: (event?: Event, noRepeat?: boolean) => void;
        handleScroll: () => void;
        handleResize: () => void;
        scrollToIndex: (index: number, scrollDuration?: number) => void;
        calculateSlideCount: any;
        initInfiniteScroll: (index?: number, force?: boolean) => void;
    };
};
export type InitContentSlider = typeof initContentSlider;
