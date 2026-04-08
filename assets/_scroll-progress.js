export const initScrollProgress = () => {
  window.Alpine.store("scrollProgress", {
    progress: new Map(),
    observers: new Map(),
    registerSection: () => {},
  });

  const state = window.Alpine.store("scrollProgress");

  state.registerSection = (sectionEl) => {
    if (!sectionEl || state.observers.has(sectionEl)) return;

    let ticking = false;

    const updateProgress = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const rect = sectionEl.getBoundingClientRect();
          let progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
          progress = Math.min(Math.max(progress, 0), 1);
          state.progress.set(sectionEl, progress);
          ticking = false;
        });
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            window.addEventListener("scroll", updateProgress, { passive: true });
            updateProgress();
          } else {
            window.removeEventListener("scroll", updateProgress);
          }
        });
      },
      { threshold: [0, 1] }
    );

    observer.observe(sectionEl);
    state.observers.set(sectionEl, observer);

    const rect = sectionEl.getBoundingClientRect();
    const isVisible = rect.bottom >= 0 && rect.top <= window.innerHeight;
    if (isVisible) {
      window.addEventListener("scroll", updateProgress, { passive: true });
      updateProgress();
    } else {
      updateProgress();
    }
  };

  window.addEventListener("pageshow", () => {
    requestAnimationFrame(() => {
      for (const [el] of state.progress) {
        const rect = el.getBoundingClientRect();
        let progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        progress = Math.min(Math.max(progress, 0), 1);
        state.progress.set(el, progress);
      }
    });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      requestAnimationFrame(() => {
        for (const [el] of state.progress) {
          const rect = el.getBoundingClientRect();
          let progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
          progress = Math.min(Math.max(progress, 0), 1);
          state.progress.set(el, progress);
        }
      });
    }
  });

  window.Alpine.magic("scrollProgress", () => state);
  window._stores["scrollProgress"] = state;
};

document.addEventListener("alpine:init", initScrollProgress);

/* LAST HASH: 03888ba9d902ea8f3be497270d59f06a18d7f976 */
