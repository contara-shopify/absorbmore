declare const initPageCard: ($el: HTMLElement, $refs: Record<string, HTMLElement>, pageHandle: string) => any;
declare const hydratePageCard: any;
export type InitPageCard = typeof initPageCard;
export type HydratePageCard = typeof hydratePageCard;
export {};
