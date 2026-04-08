export type TextareaFunctions = typeof _textarea;
export declare const _textarea: {
    init: (label: HTMLLabelElement, { maxRows }: {
        maxRows: number | null;
    }) => {
        textarea: any;
        resizeTextarea: () => void;
    };
};
