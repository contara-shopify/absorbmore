import type { BundleDynamicRichtextBlock } from "./_blocks.js";
import type { _Product_hydrated } from "./_types.js";
declare const initBundle: ($el: HTMLElement) => {
    bundle: any;
    bundle_targets: any[];
    bundle_target_objects: any;
    incentive_targets: any[];
    section_settings: any;
    bundle_type: any;
    addToBundle: ({ product, variant, price, }: {
        variant: _Product_hydrated["variants"][number];
        product: _Product_hydrated;
        price?: number;
    }) => void;
    removeFromBundle: ({ product, variant, }: {
        variant: _Product_hydrated["variants"][number];
        product: _Product_hydrated;
    }) => void;
    updateBundleById: (bundle_id?: string) => void;
    handleAddToCart: (action: "add_to_cart" | "checkout") => Promise<void>;
    getDynamicValue: (content: string) => any;
    getDynamicValueWithFallbacks: (content: string) => string;
    getDynamicText: (content: string) => any;
    showConditionally: (show_conditionally: BundleDynamicRichtextBlock["settings"]["show_conditionally"]) => boolean;
};
export type InitBundle = typeof initBundle;
export {};
