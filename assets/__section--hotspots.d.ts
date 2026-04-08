import type { HotspotsHotspotBlock } from "./_blocks.js";
declare const initHotspots: ($el: HTMLElement) => {
    hs: any;
    setHotspotId: (id?: string) => void;
    placeHotspotItem: (hotspotButton: HTMLButtonElement, hotspotContent: HTMLElement, preferredSide: HotspotsHotspotBlock["settings"]["preferred_content_alignment"], leftPercent: number, topPercent: number) => void;
    initTargetElement: (wrapper: HTMLElement, id: string, target_id: string, hotspotButton: HTMLButtonElement) => void;
};
export type InitHotspots = typeof initHotspots;
export {};
