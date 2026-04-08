declare const initMainCollection: ($el: HTMLFormElement, current_sort: string) => {
    main_collection: {
        state: any;
        loadNextPage: (container?: HTMLElement, paginationContainer?: Element) => Promise<void>;
        updateSortAndFilters: (url?: URL) => Promise<void>;
        debounceUpdates: any;
    };
};
export type InitMainCollection = typeof initMainCollection;
export {};
