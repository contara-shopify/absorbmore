export type ScrollProgressStore = {
    progress: Map<HTMLElement, number>;
    observers: Map<HTMLElement, IntersectionObserver>;
    registerSection: (section: HTMLElement) => void;
};
export declare const initScrollProgress: () => void;
declare module "alpinejs" {
    interface Magics<T> {
        $scrollProgress: ScrollProgressStore;
    }
}
