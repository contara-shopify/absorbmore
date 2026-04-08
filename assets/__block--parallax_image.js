const initParallax = ($el) => {
  window._stores.scrollProgress.registerSection($el.closest(`.shopify-section`));

  const calculateParallax = (progress = 0, breakpoints) => {
    const points = breakpoints
      .split(",")
      .map((pair) => {
        const [p, v] = pair.trim().split(":").map(Number);
        return { progress: p, value: v };
      })
      .sort((a, b) => a.progress - b.progress);

    // Find two nearest points around current progress
    let start = points[0],
      end = points[points.length - 1];
    for (let i = 0; i < points.length - 1; i++) {
      if (progress >= points[i].progress && progress <= points[i + 1].progress) {
        start = points[i];
        end = points[i + 1];
        break;
      }
    }

    // Linear interpolation between start and end points
    const range = end.progress - start.progress;
    const factor = range === 0 ? 0 : (progress - start.progress) / range;
    const interpolated = start.value + (end.value - start.value) * factor;

    return interpolated;
  };

  return { calculateParallax };
};

window._sections["initParallax"] = initParallax;

/* LAST HASH: 5951c1481d290529ab1c8faca333dda321420c3d */
