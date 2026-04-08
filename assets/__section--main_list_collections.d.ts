declare const initMainListCollections: ($el: HTMLFormElement) => {
    main_list_collections: {
        state: any;
        loadNextPage: (container?: HTMLElement, paginationContainer?: Element) => Promise<void>;
    };
};
export type InitMainListCollections = typeof initMainListCollections;
export {};
