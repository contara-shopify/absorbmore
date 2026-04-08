declare const initMainProduct: ($el: HTMLFormElement, $refs: Record<string, HTMLElement>, productHandle: string, productId: number, variantId?: number, default_select_selling_plan?: boolean) => any;
export type InitMainProduct = typeof initMainProduct;
export type MainProductStore = ReturnType<typeof initMainProduct>;
export {};
