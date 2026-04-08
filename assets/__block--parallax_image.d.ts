declare const initParallax: ($el: HTMLElement) => {
    calculateParallax: (progress: number, breakpoints: any) => any;
};
export type InitParallax = typeof initParallax;
export {};
