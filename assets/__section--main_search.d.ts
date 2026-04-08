import type { MainSearchEmptyStateBlock } from "./_blocks.js";
declare const initMainSearch: ($el: HTMLFormElement, type: string, current_sort: string) => {
    main_search: {
        state: any;
        loadNextPage: (container?: HTMLElement, paginationContainer?: Element) => Promise<void>;
        updateSortAndFilters: (url?: URL) => Promise<void>;
        debounceUpdates: any;
        showConditionally: (show_conditionally: MainSearchEmptyStateBlock["settings"]["show_search_conditionally"]) => boolean;
    };
};
export type InitMainSearch = typeof initMainSearch;
export {};
