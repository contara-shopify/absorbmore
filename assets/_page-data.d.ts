export type PageFunctions = typeof _page;
export declare const _page: {
    getHtmlPage: (handle: any) => any;
    getCachedPage: (handle: any) => Promise<any>;
    getFetchPage: (handle: string) => Promise<any>;
    savePage: (handle: any, dataOverride?: any) => any;
    getPageData: (handle: string) => Promise<any>;
};
