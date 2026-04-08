import type { InitContentSlider } from "./_content-slider.js";
export type ScrollbarFunctions = typeof _scrollbar;
export declare const _scrollbar: {
    init: (bar: HTMLElement, thumb: HTMLButtonElement, scroll_speed?: number) => {
        handleScrollBarClick: (e: PointerEvent, content_slider?: ReturnType<InitContentSlider>["content_slider"]) => void;
        handleScrollThumbPointerDown: (e: PointerEvent, content_slider?: ReturnType<InitContentSlider>["content_slider"]) => void;
        handlePrevClick: (e: PointerEvent, content_slider?: ReturnType<InitContentSlider>["content_slider"]) => void;
        handleNextClick: (e: PointerEvent, content_slider?: ReturnType<InitContentSlider>["content_slider"]) => void;
        scrollbar: any;
        containerRef: any;
    };
    initScrollPagination: ($el: HTMLElement) => {
        containerRef: any;
        content_slider: any;
    };
};
