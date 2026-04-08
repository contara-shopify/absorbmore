export type TooltipStore = {
    tooltips: Map<HTMLElement, {
        tooltip: HTMLElement;
        timout: NodeJS.Timeout;
        handleUpdates: () => void;
        scrollParents: (HTMLElement | Window)[];
        signal: AbortController;
    }>;
    addTooltip: (element: HTMLElement, content: string, position: "top" | "bottom" | "left" | "right") => void;
    removeTooltip: (element: HTMLElement) => void;
};
export declare const initTooltip: () => void;
declare module "alpinejs" {
    interface Magics<T> {
        $tooltip: TooltipStore;
    }
}
