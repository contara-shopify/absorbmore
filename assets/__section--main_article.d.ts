declare const initMainArticle: ($el: HTMLFormElement) => {
    main_article: {
        state: any;
        loadNextPage: (container?: HTMLElement, paginationContainer?: Element) => Promise<void>;
    };
};
export type InitMainArticle = typeof initMainArticle;
export {};
