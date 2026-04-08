import type { ModalSearchContainerBlock } from "./_blocks.js";
declare const initSearchModal: ($el: HTMLElement, modalId: any) => {
    search_modal: {
        state: any;
        showConditionally: (show_conditionally: ModalSearchContainerBlock["settings"]["show_search_conditionally"]) => boolean;
        getDynamicText: (content: string) => any;
        getDynamicValue: (content: string) => any;
        getDynamicValueWithFallbacks: (content: string) => string;
        debounceSearch: any;
        debounceSearchQuery: any;
    };
};
export type InitSearchModal = typeof initSearchModal;
export {};
