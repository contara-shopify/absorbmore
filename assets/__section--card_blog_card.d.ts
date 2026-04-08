declare const initBlogCard: ($el: HTMLElement, $refs: Record<string, HTMLElement>, blogHandle: string) => any;
declare const hydrateBlogCard: any;
export type InitBlogCard = typeof initBlogCard;
export type HydrateBlogCard = typeof hydrateBlogCard;
export {};
