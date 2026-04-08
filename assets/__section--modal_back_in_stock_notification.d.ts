import type { _Product_hydrated, _Variant_hydrated } from "./_types.js";
declare const initialStore: {
    product: _Product_hydrated | null;
    selected_variant: _Variant_hydrated | null;
    email: string;
    phone_number: string;
    subscribe: boolean;
    loading: boolean;
};
declare module "alpinejs" {
    interface Magics<T> {
        $backInStockNotification: typeof initialStore;
    }
}
declare const initBackInStock: ($el: HTMLElement, klaviyo_company_id: string, klaviyo_list_id: string) => {
    back_in_stock: {
        product: _Product_hydrated | null;
        selected_variant: _Variant_hydrated | null;
        email: string;
        phone_number: string;
        subscribe: boolean;
        loading: boolean;
    };
    submitBackInStockForm: (e: SubmitEvent) => Promise<void>;
};
export type InitBackInStock = typeof initBackInStock;
export {};
