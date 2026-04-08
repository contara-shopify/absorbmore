export const initVideoPlayer = ($el) => {
  const video = $el.querySelector("video");

  const state = Alpine.reactive({
    playing: !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2),
    started: video.currentTime > 0,
    ended: video.ended,
    player: undefined,
    currentTime: video.currentTime | 0,
    duration: isFinite(video.duration) ? video.duration : 0,
    buffered: 0,
    seeking: false,
  });

  const playVideo = () => video.play();
  const pauseVideo = () => video.pause();

  const seek = (t) => {
    const time = Number(t) || 0;
    video.currentTime = time;
    state.currentTime = time;
  };

  const nudge = (delta) => {
    const time = Math.min(Math.max((video.currentTime || 0) + delta, 0), state.duration || 0);
    video.currentTime = time;
    state.currentTime = time;
  };

  const formatTime = (s) => {
    if (!Number.isFinite(s)) return "0:00";
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${sec}`;
  };

  const updateBuffered = () => {
    try {
      let end = 0;
      for (let i = 0; i < video.buffered.length; i++) end = Math.max(end, video.buffered.end(i));
      state.buffered = Math.min(end, video.duration || 0);
    } catch {
      state.buffered = 0;
    }
  };

  const startSeek = (e) => {
    state.seeking = true;
    e.currentTarget?.setPointerCapture?.(e.pointerId);
    _seekFromEvent(e);
  };
  const moveSeek = (e) => {
    _seekFromEvent(e);
  };
  const endSeek = (e) => {
    state.seeking = false;
    e?.currentTarget?.releasePointerCapture?.(e.pointerId);
  };
  const _seekFromEvent = (e) => {
    const rect = e?.currentTarget?.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const ratio = rect.width ? x / rect.width : 0;
    seek(ratio * (state.duration || 0));
  };

  return {
    videoPlayer: state,
    videoEl: video,
    playVideo,
    pauseVideo,
    seek,
    nudge,
    formatTime,
    updateBuffered,
    startSeek,
    moveSeek,
    endSeek,
    _seekFromEvent,
  };
};

window._sections["initVideoPlayer"] = initVideoPlayer;

/* LAST HASH: fd26d6ebd702493700be852de0a2df194f999c1f */
