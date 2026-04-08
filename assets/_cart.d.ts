import type { InitContentSlider } from "./_content-slider.js";
import type { MainCartGiftWithPurchaseBlock } from "./_blocks.js";
import type { _Selling_plan_liquid } from "./_shopify.js";
import type { _Product_hydrated, _Variant_hydrated, CartJson, LineItem } from "./types.js";
export type CartStore = {
    state: CartJson;
    theme_editor_adding: boolean;
    loading: boolean;
    isChanging: boolean;
    isSubscriptionChanging: boolean;
    debounce_updates: {
        [T: string]: number;
    };
    history: CartJson[];
    upsell_products: _Product_hydrated[];
    gift_products: {
        [block_id: string]: _Product_hydrated[];
    };
    _gift_with_purchase_disable_auto_add: number[];
    possible_selling_plans: _Selling_plan_liquid[];
    cart_selling_plan_id?: number;
    cart_selling_plan_name?: string;
    cart_selling_plan_discount_wording: string;
    global_subscriptions: boolean;
    bundle: {
        parent: _Product_hydrated;
        child: {
            line_item: LineItem;
            product: _Product_hydrated;
            variant: _Variant_hydrated;
        };
        added: boolean;
    };
};
export type CartActions = ReturnType<typeof initCart>;
export declare const initCart: () => {
    add: (cartItems: {
        items: {
            id: number | string;
            quantity: number;
            properties?: {
                [T: string]: string;
            };
            selling_plan?: number;
        }[];
        attributes?: {
            [T: string]: string;
        };
    }) => Promise<CartJson & {
        cart_error?: boolean;
    }>;
    get: (productAdded?: boolean) => Promise<CartJson>;
    update: (updates: {
        updates?: {
            [T: string | number]: number;
        } | number[];
        discount?: string;
        attributes?: {
            [T: string]: string;
        };
    }) => Promise<CartJson>;
    change: (cartItem: {
        id: number | string;
        quantity: number;
        properties?: {
            [T: string]: string;
        };
        selling_plan?: number;
    } | {
        line: number;
        quantity: number;
        properties?: {
            [T: string]: string;
        };
        selling_plan?: number;
    }) => Promise<CartJson>;
    clear: () => Promise<CartJson>;
    showConditionally: (show_conditionally: "always" | "cart_empty" | "items_added" | undefined) => boolean;
    updateLineItemQuantity: (quantity: number, index: number) => void;
    getDynamicTextWithFormattedPrice: (content: string) => string;
    renderGiftProducts: ($el: HTMLElement, { target_type, target, receives_quantity, allow_duplicates, product_card_class, hide_if_empty, handleResize, block_id, auto_add_to_cart, auto_remove_from_cart, hide_in_cart, }: {
        target_type: MainCartGiftWithPurchaseBlock["settings"]["target_type"];
        target: MainCartGiftWithPurchaseBlock["settings"]["target"];
        receives_quantity: MainCartGiftWithPurchaseBlock["settings"]["receives_quantity"];
        allow_duplicates: MainCartGiftWithPurchaseBlock["settings"]["allow_duplicates"];
        product_card_class: MainCartGiftWithPurchaseBlock["settings"]["product_card_class"];
        hide_if_empty: "none" | "section" | "container" | "block";
        handleResize: ReturnType<InitContentSlider>["content_slider"]["handleResize"];
        block_id: string;
        auto_add_to_cart: boolean;
        auto_remove_from_cart: boolean;
        hide_in_cart: boolean;
    }) => Promise<void>;
    initDynamicLineItemCards: ($el: HTMLElement, { line_item_card_class, hide_if_empty, order_offset, section_id, block_id, handleResize, addon_id, filter_keys, filter_keys_include, }: {
        line_item_card_class: string;
        hide_if_empty: "none" | "section" | "container" | "block";
        order_offset?: number;
        section_id: string;
        block_id: string;
        handleResize: ReturnType<InitContentSlider>["content_slider"]["handleResize"];
        addon_id?: string;
        filter_keys?: string;
        filter_keys_include?: string;
    }) => void;
    setSubscription: (selling_plan_id: number | null) => Promise<void>;
    getBundleParentDynamicTextWithFormattedPrice: (content: string, product: any) => any;
    upgradeLineItemToBundle: () => Promise<void>;
};
declare module "alpinejs" {
    interface Magics<T> {
        $cart: CartStore;
    }
}
