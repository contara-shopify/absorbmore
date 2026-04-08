export type CollectionFunctions = typeof _collection;
export declare const _collection: {
    getHtmlCollection: (handle: any) => any;
    getCachedCollection: (handle: any) => Promise<any>;
    getFetchCollection: (handle: string) => Promise<any>;
    saveCollection: (handle: any, dataOverride?: any) => any;
    getCollectionData: (handle: string) => Promise<any>;
};
