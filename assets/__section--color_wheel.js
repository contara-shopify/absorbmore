const initColorWheel = ($el) => {
  const blocks = [...$el.querySelectorAll("[data-color-collection]")].map((item) =>
    utils.JSONParse(item.getAttribute("data-color-collection"))
  );

  const defaultBlock = blocks?.[0];

  // Calculate midpoint angle between start and end (handles wrap-around)
  const angleRange =
    defaultBlock?.end_angle !== undefined && defaultBlock?.start_angle !== undefined
      ? (defaultBlock.end_angle - defaultBlock.start_angle + 360) % 360
      : 0;

  const midpointAngle = defaultBlock !== undefined ? (defaultBlock?.start_angle + angleRange / 2) % 360 : 0;

  const rotatedMidpointAngle = (midpointAngle - 90) % 360;
  const radians = (rotatedMidpointAngle * Math.PI) / 180;
  const distanceFromCenterAsPercent = 0.7;
  const defaultXPercent = 0.5 + Math.cos(radians) * distanceFromCenterAsPercent * 0.5;
  const defaultYPercent = 0.5 + Math.sin(radians) * distanceFromCenterAsPercent * 0.5;

  const state = window.Alpine.reactive({
    collectionIndex: 0,
    currentCollection: blocks[0]?.collection?.handle ?? "",
    clickXPercent: defaultXPercent,
    clickYPercent: defaultYPercent,
    dragging: false,
  });

  const startDragging = (e) => {
    state.dragging = true;
    handleDrag(e);
  };

  const stopDragging = () => {
    state.dragging = false;
  };

  const handleDrag = (e) => {
    if (!state.dragging) return;
    selectColor(e);
  };

  document.addEventListener("mousemove", handleDrag);
  document.addEventListener("mouseup", stopDragging);

  const selectColor = (e) => {
    const target = e.target;
    if (!target) return;
    const targetElement = target;
    const boundingRect = targetElement.getBoundingClientRect();

    const relativeX = (e.clientX - boundingRect.left) / boundingRect.width;
    const relativeY = (e.clientY - boundingRect.top) / boundingRect.height;

    const centerX = 0.5;
    const centerY = 0.5;

    const deltaX = relativeX - centerX;
    const deltaY = relativeY - centerY;

    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    angle = (angle + 90) % 360;

    const index = blocks.findIndex((block) => {
      const { start_angle, end_angle } = block;
      if (start_angle < end_angle) {
        return angle >= start_angle && angle < end_angle;
      } else {
        return angle >= start_angle || angle < end_angle;
      }
    });

    state.clickXPercent = relativeX;
    state.clickYPercent = relativeY;
    state.collectionIndex = index !== -1 ? index : state.collectionIndex;
    state.currentCollection = blocks[state.collectionIndex]?.collection?.handle;
  };

  const getDynamicTextWithFormattedPrice = (content) => {
    return (
      content?.replace(/\[([^\]]*)\]/gi, (...matches) => {
        // @ts-ignore
        return matches?.[1]?.split(".").reduce(
          (acc, selector) => {
            if (!selector || acc[0] === undefined || acc[0] === null) {
              if (/price$/gi.test(acc[1]) && typeof acc[0] === "number") {
                return [utils.formatMoney(acc[0]), selector];
              }
              return acc;
            }

            if (acc[0] && selector in acc[0]) {
              if (/price$/gi.test(selector) && typeof acc[0][selector] === "number") {
                return [utils.formatMoney(acc[0][selector]), selector];
              }
              return [acc[0][selector], selector];
            }
            return ["", ""];
          },
          [{ collection: blocks[state.collectionIndex]?.collection ?? {} }, ""]
        )[0];
      }) ?? ""
    );
  };

  return {
    color_wheel: { state, selectColor, startDragging, stopDragging, getDynamicTextWithFormattedPrice },
  };
};

window._sections["initColorWheel"] = initColorWheel;

/* LAST HASH: 5c8a111ce438a0dfc71bf51e1d0a571fb8bd8d94 */
