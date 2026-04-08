export type RouterStore = {
    template: string;
    hash: string;
    pathname: string;
    search: string;
    setValue: (key: keyof RouterStore, value: string | boolean) => void;
};
declare module "alpinejs" {
    interface Magics<T> {
        $router: RouterStore;
    }
}
export declare const initPageTransitions: () => void;
