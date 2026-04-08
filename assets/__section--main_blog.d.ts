declare const initMainBlog: ($el: HTMLFormElement) => {
    main_blog: {
        state: any;
        loadNextPage: (container?: HTMLElement, paginationContainer?: Element) => Promise<void>;
        updateSortAndFilters: (url: any) => Promise<void>;
        debounceUpdates: any;
    };
};
export type InitMainBlog = typeof initMainBlog;
export {};
