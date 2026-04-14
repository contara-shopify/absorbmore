import type { RichtextSchema } from "./_shopify.js";
declare function getElementPosition(element: HTMLElement): {
    top: number;
    left: number;
};
declare function delay(ms: number): Promise<unknown>;
declare function unescape(htmlStr: any): any;
declare function setUniformHeightById(id: string): void;
declare const utils: {
    hasAlpine: Promise<unknown>;
    initializeIgnoredAlpineTree: (el: HTMLElement) => void;
    normalizePhoneInput: (input: any) => any;
    initYouTube: () => Promise<void>;
    simulateAnchorTag: ($el: HTMLElement) => void;
    clsx: (...props: any[]) => string;
    getImageSrcSet: (src: string, maxWidth?: 96 | 180 | 256 | 384 | 460 | 640 | 1200 | 1920 | 3840 | number) => string;
    JSONParse: <T = unknown>(object: any, origin?: string) => T;
    getSiblingUrl: (handle: string) => string;
    getHeaderHeight: () => number;
    unescape: typeof unescape;
    getShopifyCacheUrl: (href: string) => string;
    validateFormAndToast: (formEl: HTMLFormElement) => boolean;
    richtextWithPrices: (content: string, price?: number, compare_at_price?: number) => string;
    applyStyles: (el: HTMLElement, styles: HTMLElement["style"]) => void;
    preloadImage: (src: any) => true | Promise<unknown>;
    setCookie: (cookieName: string, cookieValue: string, cookieMinutes?: number) => boolean;
    getCookie: (cookieName: string) => string | false;
    checkCookie: (cookieName: string) => boolean;
    removeCookie: (cookieName: string) => void;
    isVisible: (elem: HTMLElement, isParent?: boolean) => boolean;
    isInViewport: (element: any) => boolean;
    getReviewStarGradients: (rating: number, position: 1 | 2 | 3 | 4 | 5) => string;
    transpileRichtextMetafield: (schema: RichtextSchema) => string;
    handlelize: (str: any) => any;
    delay: typeof delay;
    debounce: (callback: any, wait?: number) => (...args: any[]) => void;
    scrollToY: (duration: number, to: number, container?: HTMLElement | Window, callback?: () => void) => void;
    scrollToX: (duration: number, to: number, container?: HTMLElement | Window, callback?: () => void) => void;
    scrollToXY: (duration: number, x: number, y: number, container?: HTMLElement | Window, callback?: () => void) => void;
    isElementScrollable: (element: Element) => boolean;
    checkDomain: (url: string) => string;
    isExternalURL: (url: string) => boolean;
    getElementPosition: typeof getElementPosition;
    applyInlinePluralization: (content: string) => string;
    getBracketInputDynamicPluralizedText: (content: string, object?: {}) => string;
    getBracketInputDynamicValue: (content: string, object?: {}) => string;
    spreadGenericCardFunctions: (state: any) => {
        getDynamicValue: (content: string) => string;
        getDynamicValueWithFallbacks: (content: string) => string;
        getDynamicText: (content: string) => string;
        getContentLabels: (key: string) => any[];
    };
    deepEqual: (a: any, b: any) => boolean;
    getElementOffset: (el: HTMLElement) => {
        top: number;
        left: number;
    };
    shortUUID: () => string;
    serializeForm: (formElement: HTMLFormElement) => {
        [T: string]: string[];
    };
    roundToIndex: (x: number, index?: number) => number;
    formatMoney: (cents: number | string, money_format?: any, no_rounding?: boolean) => string;
    findAllScrollableParents: (element: HTMLElement) => (HTMLElement | Window)[];
    findCurrentlyAllScrollableParents: (element: HTMLElement) => (HTMLElement | Window)[];
    isEmail: (str: string | undefined | null) => boolean;
    pushSearchParams: ({ update, remove, title, }: {
        update?: {
            [T: string]: string | number;
        };
        remove?: string[];
        title?: string;
    }) => void;
    replaceSearchParams: ({ update, remove, title, }: {
        update?: {
            [T: string]: string | number;
        };
        remove?: string[];
        title?: string;
    }) => void;
    pushUrlTarget: (id: string) => void;
    setUniformHeightById: typeof setUniformHeightById;
    fetchFromCache: (urlString: string, options?: RequestInit) => Promise<string>;
    focusSelectorString: string;
    isElementVisiblyOnTop: (element: any) => any;
    isElementFullyVisible: (el: any) => any;
    initContentSlider: InitContentSlider;
    initCollapsible: InitCollapsible;
    barbaPrefetchTargetPage: (element: HTMLElement, url: string, delayMs?: number) => void;
    hideIfEmpty: (element: HTMLElement, hide_if_empty: "none" | "section" | "container" | "block", isEmpty?: boolean) => void;
    hydrateCardContent: ($el: HTMLElement, cardType: string) => void;
    hydrateCard: (cardType: string) => ($el: HTMLElement) => void;
    hydrateImages: (show: boolean, element: Element) => void;
    truncateChildren: (element: HTMLElement, container: HTMLElement) => number;
};
export default utils;
export type Utils = typeof utils;
