declare const initColorWheel: ($el: HTMLElement) => {
    color_wheel: {
        state: any;
        selectColor: (e: MouseEvent) => void;
        startDragging: (e: MouseEvent) => void;
        stopDragging: () => void;
        getDynamicTextWithFormattedPrice: (content: string) => string;
    };
};
export type InitColorWheel = typeof initColorWheel;
export {};
