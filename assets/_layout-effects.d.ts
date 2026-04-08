declare const initLayoutEffects: (bodyElement: HTMLElement, headerElement: HTMLElement) => {
    measure: () => void;
};
export type InitLayoutEffects = typeof initLayoutEffects;
export {};
