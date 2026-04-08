declare const initProductCard: ($el: HTMLElement, $refs: Record<string, HTMLElement>, productHandle: string, productId: number, variantId?: number, default_select_selling_plan?: boolean) => any;
declare const hydrateProductCard: any;
export type InitProductCard = typeof initProductCard;
export type HydrateProductCard = typeof hydrateProductCard;
export {};
