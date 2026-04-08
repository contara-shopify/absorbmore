import type { HeaderNavigationBarDynamicDisplayContainerBlock } from "./_blocks.js";
declare const initNavigationBar: ($el: HTMLElement, $refs: {
    navigation_bar_background_image: HTMLElement;
}) => {
    $el: HTMLElement;
    $refs: {
        navigation_bar_background_image: HTMLElement;
    };
    showConditionally: (element: HTMLElement, settings: HeaderNavigationBarDynamicDisplayContainerBlock["settings"]) => void;
    toggleTransparent: (e?: Event, instant?: boolean) => void;
};
export type InitNavigationBar = typeof initNavigationBar;
export {};
