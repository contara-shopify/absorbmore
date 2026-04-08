export declare const initPagination: () => void;
export declare const _pagination: {
    init: (paginationContainer: HTMLElement, container?: HTMLElement) => {
        paginateToUrl: (url: string) => Promise<void>;
    };
};
export type Pagination = typeof _pagination;
