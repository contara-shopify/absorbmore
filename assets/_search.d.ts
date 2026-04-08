export type SearchStore = {
    query: string;
};
export declare const initSearch: () => void;
declare module "alpinejs" {
    interface Magics<T> {
        $search: SearchStore;
    }
}
