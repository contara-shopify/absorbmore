import type { InitProductCard } from "./__section--card_product_card.js";
export type QuickViewStore = {
    show: boolean;
    loading: boolean;
    handle: string;
    dynamic_popups: HTMLElement[];
    container: HTMLElement;
    show_all_container: HTMLElement;
    loading_container: HTMLElement;
    renderQuickView: (handle: string, $data?: ReturnType<InitProductCard>, bundleButton?: HTMLElement, variantId?: number) => Promise<void>;
};
export declare const initQuickView: () => void;
declare module "alpinejs" {
    interface Magics<T> {
        $quickView: QuickViewStore;
    }
}
