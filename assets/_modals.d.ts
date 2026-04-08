import type { _Product_hydrated } from "./_types.js";
import type { InitProductCard } from "./__section--card_product_card.js";
export type ModalStore = {
    id: string;
    sub_id: string;
    loaded: boolean;
    hoverTrigger: boolean;
    setId: (id: string, hover?: boolean, productHandle?: string, productId?: number, selectedVariantId?: number) => void;
    setSubId: (id: string, hover?: boolean) => void;
    product?: _Product_hydrated;
    variant_id?: number;
    updateOriginalCard?: ReturnType<InitProductCard>["updateProductState"] | null;
};
export declare const initModals: () => void;
declare module "alpinejs" {
    interface Magics<T> {
        $modal: ModalStore;
    }
}
