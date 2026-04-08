const initCountDownTimer = function (
  $el,
  {
    type,
    end_date,
    end_time,
    timezone,
    duration_offset_hours,
    auto_refresh_hours,
    content,
    timer_expired_message,
    hide_if_expired,
    block_id,
  }
) {
  const state = window.Alpine.reactive({
    content: "",
    expired: false,
    interval: null,
    remaining: -1,
    target: Date.now(),
  });

  const tick = () => {
    const now = Date.now();
    const distance = state.target - now;

    if (distance <= 0) {
      // Auto-refresh for date-based mode
      if (type === "date" && auto_refresh_hours > 0) {
        const next = new Date(state.target + auto_refresh_hours * 3_600_000);
        if (next > new Date()) {
          state.target = next.getTime();
          return;
        }
      }

      clearInterval(state.interval);
      state.expired = true;
      state.content = timer_expired_message;
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    state.content = content
      .replace("[days]", String(days).padStart(2, "0"))
      .replace("[hours]", String(hours).padStart(2, "0"))
      .replace("[minutes]", String(minutes).padStart(2, "0"))
      .replace("[seconds]", String(seconds).padStart(2, "0"));
  };

  if (type === "date") {
    const offsetHours = timezone === "user" ? -(new Date().getTimezoneOffset() / 60) : parseFloat(timezone);

    const baseTarget = new Date(`${end_date}T${end_time}`);
    const baseTimestamp = baseTarget.getTime() - offsetHours * 3_600_000;

    let finalTarget = new Date(baseTimestamp);

    const now = Date.now();
    if (auto_refresh_hours > 0 && finalTarget.getTime() < now) {
      const interval = auto_refresh_hours * 3_600_000;
      const missed = Math.floor((now - finalTarget.getTime()) / interval) + 1;
      finalTarget = new Date(finalTarget.getTime() + missed * interval);
    }

    state.target = finalTarget.getTime();
  }

  if (type === "duration_offset") {
    const now = new Date();
    const cookieKey = `_countdown_${block_id}_${type}`;
    const stored = localStorage.getItem(cookieKey);
    const durationMs = duration_offset_hours * 3_600_000;
    const refreshMs = auto_refresh_hours * 3_600_000;

    let start = stored ? new Date(stored) : now;
    let target = new Date(start.getTime() + durationMs);

    if (stored && auto_refresh_hours > 0 && now > target) {
      const nextStart = new Date(target.getTime() + refreshMs);
      if (now > nextStart) {
        start = now;
        localStorage.setItem(cookieKey, start.toISOString());
        target = new Date(start.getTime() + durationMs);
      }
    }

    if (!stored) {
      localStorage.setItem(cookieKey, start.toISOString());
    }

    state.target = target.getTime();
  }

  state.interval = setInterval(() => tick(), 1000);
  tick();

  Alpine.effect(() => {
    if (state.expired) {
      switch (hide_if_expired) {
        case "section":
          $el.closest(".shopify-section")?.classList.add("!hidden");
          break;
        case "container":
          $el.closest(`[data-style-id]:not([data-style-id="${$el.getAttribute("data-style-id")}"])`)?.classList.add("!hidden");
          break;
        case "block":
          $el.classList.add("!hidden");
          break;
        case "none":
        default:
          break;
      }
    }
  });

  return {
    countdown: state,
  };
};

window._sections["initCountDownTimer"] = initCountDownTimer;

/* LAST HASH: c5e0675433287932972a006b6709a229e6db05f0 */
