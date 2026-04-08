export type ToastStore = {
    toasts: {
        type: "plain" | "info" | "success" | "warning" | "error";
        target: "generic" | "cart";
        timestamp: number;
        title: string;
        content?: string;
        icon?: string;
        hide: number;
    }[];
    paused: boolean;
    interval: NodeJS.Timeout;
    addToast: (toast: Partial<ToastStore["toasts"][number]> & Pick<ToastStore["toasts"][number], "title">) => void;
    pauseRemoval: () => void;
    continueRemoval: () => void;
    removeAllToasts: () => void;
    removeToast: (timestamp: number) => void;
};
export declare const initToast: () => void;
declare module "alpinejs" {
    interface Magics<T> {
        $toast: ToastStore;
    }
}
