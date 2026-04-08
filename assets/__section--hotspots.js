const initHotspots = ($el) => {
  const canvasElement = $el.querySelector("[data-hotspot-canvas]");
  const img = $el.querySelector("[data-hotspot-canvas] img");
  const tabs = window.Alpine.store("tabs");

  const state = Alpine.reactive({
    current_id: "",
    scrollingIntoView: "",
  });

  const clamp = (value, minimum, maximum) => {
    return Math.min(maximum, Math.max(minimum, value));
  };

  const parseObjectPosition = (objectPositionString, boxWidth, boxHeight) => {
    const keywordToFraction = { left: 0, top: 0, center: 0.5, right: 1, bottom: 1 };

    const trimmed = (objectPositionString || "").trim();
    const tokens = trimmed.split(/\s+/);

    const rawX = tokens[0] ?? "50%";
    const rawY = tokens[1] ?? "50%";

    const toFraction = (value, axisSize) => {
      const isKeyword = value in keywordToFraction;
      if (isKeyword) return keywordToFraction[value];

      const isPercent = value.endsWith("%");
      if (isPercent) return clamp(parseFloat(value) / 100, 0, 1);

      const isPixels = value.endsWith("px");
      if (isPixels) return clamp(parseFloat(value) / axisSize, 0, 1);

      const numeric = Number(value);
      const isNumeric = Number.isFinite(numeric);
      if (isNumeric) return clamp(numeric / 100, 0, 1);

      return 0.5;
    };

    const fractionX = toFraction(rawX, boxWidth);
    const fractionY = toFraction(rawY, boxHeight);

    return { x: fractionX, y: fractionY };
  };

  const renderImageCanvas = () => {
    const update = () => {
      if (!img?.naturalWidth) return;
      if (!img?.naturalHeight) return;

      const containerRect = canvasElement.getBoundingClientRect();
      const boxWidth = containerRect.width;
      const boxHeight = containerRect.height;

      const computedStyle = getComputedStyle(img);
      const objectFit = computedStyle.objectFit || "fill";
      const position = parseObjectPosition(computedStyle.objectPosition, boxWidth, boxHeight);

      const imageAspectRatio = img.naturalWidth / img.naturalHeight;
      const boxAspectRatio = boxWidth / boxHeight;

      canvasElement.style.setProperty("--img-ar", `${img.naturalWidth} / ${img.naturalHeight}`);

      let leftOffset = 0;
      let topOffset = 0;
      let renderedWidth = boxWidth;
      let renderedHeight = boxHeight;
      let fitMode = "box";

      switch (objectFit) {
        case "cover": {
          const isImageWider = imageAspectRatio > boxAspectRatio;

          if (isImageWider) {
            fitMode = "height";
            renderedHeight = boxHeight;
            renderedWidth = boxHeight * imageAspectRatio;
            const leftoverWidth = boxWidth - renderedWidth;
            leftOffset = leftoverWidth * position.x;
            topOffset = 0;
          }

          if (!isImageWider) {
            fitMode = "width";
            renderedWidth = boxWidth;
            renderedHeight = boxWidth / imageAspectRatio;
            const leftoverHeight = boxHeight - renderedHeight;
            leftOffset = 0;
            topOffset = leftoverHeight * position.y;
          }
          break;
        }

        case "contain": {
          const isImageWider = imageAspectRatio > boxAspectRatio;

          if (isImageWider) {
            fitMode = "width";
            renderedWidth = boxWidth;
            renderedHeight = boxWidth / imageAspectRatio;
            const leftoverHeight = boxHeight - renderedHeight;
            leftOffset = 0;
            topOffset = leftoverHeight * position.y;
          }

          if (!isImageWider) {
            fitMode = "height";
            renderedHeight = boxHeight;
            renderedWidth = boxHeight * imageAspectRatio;
            const leftoverWidth = boxWidth - renderedWidth;
            leftOffset = leftoverWidth * position.x;
            topOffset = 0;
          }
          break;
        }

        case "scale-down": {
          const fitsWithoutScale = img.naturalWidth <= boxWidth && img.naturalHeight <= boxHeight;

          if (fitsWithoutScale) {
            fitMode = "natural";
            leftOffset = 0;
            topOffset = 0;
            renderedWidth = img.naturalWidth;
            renderedHeight = img.naturalHeight;
          }

          if (!fitsWithoutScale) {
            const isImageWider = imageAspectRatio > boxAspectRatio;

            if (isImageWider) {
              fitMode = "width";
              renderedWidth = boxWidth;
              renderedHeight = boxWidth / imageAspectRatio;
              const leftoverHeight = boxHeight - renderedHeight;
              leftOffset = 0;
              topOffset = leftoverHeight * position.y;
            }

            if (!isImageWider) {
              fitMode = "height";
              renderedHeight = boxHeight;
              renderedWidth = boxHeight * imageAspectRatio;
              const leftoverWidth = boxWidth - renderedWidth;
              leftOffset = leftoverWidth * position.x;
              topOffset = 0;
            }
          }
          break;
        }

        case "none": {
          fitMode = "natural";
          leftOffset = 0;
          topOffset = 0;
          renderedWidth = img.naturalWidth;
          renderedHeight = img.naturalHeight;
          break;
        }

        default: {
          fitMode = "box";
          leftOffset = 0;
          topOffset = 0;
          renderedWidth = boxWidth;
          renderedHeight = boxHeight;
          break;
        }
      }

      const offsetXPercent = renderedWidth ? (leftOffset / renderedWidth) * 100 : 0;
      const offsetYPercent = renderedHeight ? (topOffset / renderedHeight) * 100 : 0;

      canvasElement?.classList.toggle("fit-height", fitMode === "height");
      canvasElement.style.setProperty("--offset-x", `${offsetXPercent}%`);
      canvasElement.style.setProperty("--offset-y", `${offsetYPercent}%`);
    };

    if (img && img.complete) update();
    if (img) img.addEventListener("load", update);

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(canvasElement);

    if (img) {
      resizeObserver.observe(img);
      const mutationObserver = new MutationObserver(update);
      mutationObserver.observe(img, { attributes: true, attributeFilter: ["style", "class"] });
    }
  };

  if (canvasElement && img) renderImageCanvas();

  const placeHotspotItem = (hotspotButton, hotspotContent, preferredSide, leftPercent, topPercent) => {
    if (!canvasElement || !hotspotContent || !hotspotButton) return;

    const measureAndPlace = () => {
      hotspotContent.style.zIndex = "12";
      hotspotContent.style.left = "0%";
      hotspotContent.style.width = "auto";
      hotspotContent.style.transform = "translateY(-50%)";

      const canvasRect = canvasElement.getBoundingClientRect();
      const viewportWidth = document.documentElement.clientWidth;

      const baseLeftCanvasPx = (leftPercent / 100) * canvasRect.width;
      const baseLeftViewportPx = canvasRect.left + baseLeftCanvasPx;

      const buttonRect = hotspotButton.getBoundingClientRect();
      const halfButtonPx = buttonRect.width / 2;
      const gapPx = 16;

      const rectWidthPx = hotspotContent.getBoundingClientRect().width;
      const scrollWidthPx = hotspotContent.scrollWidth;
      const naturalWidthPx = Math.max(rectWidthPx, scrollWidthPx);

      const spaceLeftPx = Math.max(0, baseLeftViewportPx);
      const spaceRightPx = Math.max(0, viewportWidth - baseLeftViewportPx);

      const maxLeftFitPx = Math.max(0, spaceLeftPx - halfButtonPx - gapPx);
      const maxRightFitPx = Math.max(0, spaceRightPx - halfButtonPx - gapPx);

      let side = preferredSide;
      const fitsLeft = naturalWidthPx <= maxLeftFitPx;
      const fitsRight = naturalWidthPx <= maxRightFitPx;
      const fitsPreferredLeft = side === "left" && fitsLeft;
      const fitsPreferredRight = side === "right" && fitsRight;

      if (side === "left" && !fitsPreferredLeft) side = "right";
      if (side === "right" && !fitsPreferredRight) side = "left";

      let finalWidthPx = naturalWidthPx;

      const neitherFits = !fitsLeft && !fitsRight;
      if (neitherFits) {
        const moreOnLeft = maxLeftFitPx >= maxRightFitPx;
        if (moreOnLeft) side = "left";
        if (!moreOnLeft) side = "right";
        finalWidthPx = moreOnLeft ? maxLeftFitPx : maxRightFitPx;
      }

      if (side === "left") finalWidthPx = Math.min(finalWidthPx, maxLeftFitPx);
      if (side === "right") finalWidthPx = Math.min(finalWidthPx, maxRightFitPx);

      let targetLeftViewportPx = baseLeftViewportPx;
      if (side === "left") targetLeftViewportPx = baseLeftViewportPx - halfButtonPx - gapPx - finalWidthPx;
      if (side === "right") targetLeftViewportPx = baseLeftViewportPx + halfButtonPx + gapPx;

      const minLeftViewportPx = 0;
      const maxLeftViewportPx = Math.max(0, viewportWidth - finalWidthPx);

      if (targetLeftViewportPx < minLeftViewportPx) targetLeftViewportPx = minLeftViewportPx;
      if (targetLeftViewportPx > maxLeftViewportPx) targetLeftViewportPx = maxLeftViewportPx;

      const offsetPx = targetLeftViewportPx - baseLeftViewportPx;

      hotspotContent.style.left = `calc(${leftPercent}% + ${offsetPx}px)`;
      hotspotContent.style.top = `calc(${topPercent}% + 0px)`;
      hotspotContent.style.width = `${finalWidthPx}px`;
    };

    measureAndPlace();

    if (!hotspotContent.dataset.observing) {
      const resizeObserver = new ResizeObserver(() => measureAndPlace());
      resizeObserver.observe(hotspotContent);
      const images = hotspotContent.querySelectorAll("img");
      images.forEach((img) => {
        if (!img.complete) img.addEventListener("load", () => measureAndPlace(), { once: true });
      });
      hotspotContent.dataset.observing = "1";
    }

    requestAnimationFrame(() => measureAndPlace());
  };

  const initTargetElement = (wrapper, id, target_id, hotspotButton) => {
    requestAnimationFrame(() => {
      const targetElement = document.getElementById(id);

      if (targetElement) {
        hotspotButton.setAttribute("aria-label", targetElement.textContent.trim().slice(0, 80));
        wrapper.appendChild(targetElement?.cloneNode(true));
        wrapper.firstElementChild?.removeAttribute("id");

        const mutationObserver = new MutationObserver((e) => {
          if (!document.contains(targetElement)) {
            mutationObserver.disconnect();
            return;
          }
          if (
            utils.isVisible(targetElement) &&
            targetElement.classList.contains("centered") &&
            state.current_id !== target_id &&
            (!state.scrollingIntoView || state.scrollingIntoView === target_id)
          ) {
            state.current_id = target_id;
          }
        });
        mutationObserver.observe(targetElement, {
          childList: false,
          subtree: false,
          attributes: true,
          attributeFilter: ["class"],
        });

        Alpine.watch(
          () => state.current_id,
          async () => {
            const tabContainer = targetElement.closest("[data-tab-id][data-tab-group]");
            const sectionId = tabContainer?.closest(".shopify-section")?.id;
            const tabId = tabContainer?.getAttribute("data-tab-id");
            const tabGroup = +tabContainer?.getAttribute("data-tab-group");

            if (
              typeof state.current_id === "string" &&
              (!window.matchMedia("(max-width: 768px)").matches || state.scrollingIntoView)
            ) {
              return;
            }
            if (tabContainer) {
              if (state.current_id === target_id && tabs[sectionId].current_tabs[tabGroup] !== tabId) {
                if (state.scrollingIntoView !== target_id) {
                  state.scrollingIntoView = target_id;
                }

                Alpine.nextTick(async () => {
                  requestAnimationFrame(() => {
                    requestAnimationFrame(async () => {
                      targetElement.scrollIntoView({
                        behavior: "instant",
                        inline: "nearest",
                        block: "nearest",
                      });
                      await utils.delay(100);
                      if (state.scrollingIntoView !== "") {
                        state.scrollingIntoView = "";
                      }
                    });
                  });
                });
              }

              Alpine.nextTick(() => {
                if (state.current_id === target_id && tabs[sectionId].current_tabs[tabGroup] !== tabId) {
                  tabs[sectionId].current_tabs[tabGroup] = tabId;
                }
                if (!state.current_id && tabs[sectionId].current_tabs[tabGroup] === tabId) {
                  tabs[sectionId].current_tabs[tabGroup] = tabs[sectionId].tabs[tabGroup].find((tId) => tId !== tabId);
                }
              });

              if (
                state.current_id === target_id &&
                !targetElement.classList.contains("centered") &&
                tabs[sectionId].current_tabs[tabGroup] === tabId
              ) {
                if (state.scrollingIntoView !== target_id) {
                  state.scrollingIntoView = target_id;
                }
                targetElement.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
                await utils.delay(250);
                if (state.scrollingIntoView !== "") {
                  state.scrollingIntoView = "";
                }
              }
            }

            if (!tabContainer) {
              if (state.current_id === target_id && !targetElement.classList.contains("centered")) {
                state.scrollingIntoView = target_id;
                targetElement.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
                await utils.delay(250);
                state.scrollingIntoView = "";
              }
            }
          }
        );
      }
    });
  };

  const setHotspotId = (id = "") => {
    state.current_id = id;
  };

  return {
    hs: state,
    setHotspotId,
    placeHotspotItem,
    initTargetElement,
  };
};

window._sections["initHotspots"] = initHotspots;

/* LAST HASH: fa16a09543b42ec0b3167717436ac22119d077d9 */
