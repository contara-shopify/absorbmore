export declare const initVideoPlayer: ($el: any) => {
    videoPlayer: any;
    videoEl: any;
    playVideo: () => any;
    pauseVideo: () => any;
    seek: (t: any) => void;
    nudge: (delta: any) => void;
    formatTime: (s: any) => string;
    updateBuffered: () => void;
    startSeek: (e: any) => void;
    moveSeek: (e: any) => void;
    endSeek: (e: any) => void;
    _seekFromEvent: (e: any) => void;
};
export type InitVideoPlayer = typeof initVideoPlayer;
