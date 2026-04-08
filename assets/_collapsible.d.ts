export declare const initCollapsible: ($el: HTMLDetailsElement, container: HTMLElement, defaultOpen?: boolean) => {
    collapsible: any;
    toggleOpen: (forceOpen?: boolean, forceClose?: boolean, callback?: () => void) => Promise<void>;
    closeSiblingCollapsibles: () => void;
};
export type InitCollapsible = typeof initCollapsible;
