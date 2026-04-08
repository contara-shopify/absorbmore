export type TabStore = Record<string, {
    tabs: string[][];
    current_tabs: string[];
}>;
export declare const initTabsStore: () => void;
export declare const initTabs: ($el: HTMLElement) => {
    tabs: string[][];
    current_tabs: string[];
};
export type InitTabs = typeof initTabs;
