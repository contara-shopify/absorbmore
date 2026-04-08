export type ArticleFunctions = typeof _article;
export declare const _article: {
    getHtmlArticle: (handle: any) => any;
    getCachedArticle: (handle: any) => Promise<any>;
    getFetchArticle: (handle: string) => Promise<any>;
    saveArticle: (handle: any, dataOverride?: any) => any;
    getArticleData: (handle: string) => Promise<any>;
};
