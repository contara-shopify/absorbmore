const getTransformedComputedStyle = (element) => {
  const style = getComputedStyle(element);

  return {
    ...style,
    paddingLeft: parseFloat(style.paddingLeft?.replace("auto", "0")),
    paddingRight: parseFloat(style.paddingRight?.replace("auto", "0")),
    paddingTop: parseFloat(style.paddingTop?.replace("auto", "0")),
    paddingBottom: parseFloat(style.paddingBottom?.replace("auto", "0")),
    scrollPaddingLeft: parseFloat(style.scrollPaddingLeft?.replace("auto", "0")),
    scrollPaddingRight: parseFloat(style.scrollPaddingRight?.replace("auto", "0")),
    scrollPaddingTop: parseFloat(style.scrollPaddingTop?.replace("auto", "0")),
    scrollPaddingBottom: parseFloat(style.scrollPaddingBottom?.replace("auto", "0")),
    columnGap: parseFloat(style.columnGap?.replace("auto", "0")),
    rowGap: parseFloat(style.rowGap?.replace("auto", "0")),
  };
};

export const initContentSlider = (
  $el,
  container,
  speed = 200,
  infiniteScroll = false,
  autoRotate = 0,
  enable_mouse_dragging = false
) => {
  if (!container) {
    container = $el.querySelector('[x-ref="scrollContainer"]') || $el.firstElementChild;
  }
  const isHorizontal = () => {
    return !!(
      getComputedStyle(container).overflowY === "hidden" ||
      getComputedStyle(container).gridAutoFlow === "column" ||
      container.scrollWidth > container?.clientWidth
    );
  };
  const isScrollable = () => container.scrollWidth > container.clientWidth || container.scrollHeight > container.clientHeight;
  const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;
  const shouldInfinite = () => {
    // Accept legacy booleans too
    if (typeof infiniteScroll === "boolean") return infiniteScroll;
    switch (infiniteScroll) {
      case "all":
        return true;
      case "off":
        return false;
      case "desktop":
        return isDesktop();
      case "mobile":
        return !isDesktop();
      default:
        return false;
    }
  };
  const updateSliderHeightFromVisible = () => {
    container.style.setProperty("--slider-height", "0px");
    void container.offsetHeight;

    const trackRect = container.getBoundingClientRect();
    const all = Array.from(container.children);

    const candidates = state.infinite ? all.filter((el) => el.hasAttribute("data-original-node")) : all;

    const visible = candidates.filter((el) => {
      const r = el.getBoundingClientRect();
      return r.right > trackRect.left && r.left < trackRect.right && r.height > 0 && getComputedStyle(el).display !== "none";
    });

    const maxH = visible.reduce((m, el) => Math.max(m, el.getBoundingClientRect().height), 0);
    const finalH = Math.max(maxH, 1);
    container.style.setProperty("--slider-height", `${finalH}px`);
  };

  const random_id = utils.shortUUID();

  const containerStyles = getTransformedComputedStyle(container);
  const horizontal = isHorizontal();

  let breakPoints = [];

  let children = [...container.children]
    .filter((el) => el.tagName !== "STYLE" && el.tagName !== "TEMPLATE")
    .toSorted((a, b) => +getComputedStyle(a).order - +getComputedStyle(b).order);

  let size = children.length;

  const calculateSlideCount = (
    padding = state.horizontal ? state.paddingX : state.paddingY,
    gap = state.gap,
    scrollSpace = container[state.horizontal ? "scrollWidth" : "scrollHeight"],
    clientSpace = container?.[state.horizontal ? "clientWidth" : "clientHeight"]
  ) => {
    const horizontal = isHorizontal();
    const containerStyles = getTransformedComputedStyle(container);

    if (scrollSpace <= clientSpace) {
      return 1;
    }
    breakPoints = [];

    const snapToSlide = container.classList?.contains("snap-to-slide");

    let targetElements = [...container.children]
      ?.slice(
        0,
        Math.ceil(
          container.children?.length /
            +(
              getComputedStyle(container)
                .getPropertyValue(horizontal ? "grid-template-rows" : "grid-template-columns")
                .split(" ").length ?? 1
            )
        ),
      )
      ?.filter(
        (child) =>
          getComputedStyle(child).display !== "none" && (getComputedStyle(child).scrollSnapAlign !== "none" || snapToSlide)
      );

    targetElements = targetElements?.toSorted((a, b) => +getComputedStyle(a).order - +getComputedStyle(b).order);

    if (snapToSlide) {
      const gap = horizontal ? containerStyles.columnGap : containerStyles.rowGap;
      const paddingStart = horizontal ? containerStyles.paddingLeft : containerStyles.paddingTop;
      const newTargetElements = [];
      targetElements.forEach((el) => {
        el.style.scrollSnapAlign = "";
      });
      for (let i = 0; i < Math.ceil((scrollSpace - padding - (targetElements.length - 1) * gap) / (clientSpace - padding)); i++) {
        const targetEl = targetElements.find(
          (el) => el[horizontal ? "offsetLeft" : "offsetTop"] - paddingStart >= i * (clientSpace - padding) + gap * i
        );

        if (targetEl) {
          targetEl.style.scrollSnapAlign = "start";
          newTargetElements.push(targetEl);
        }
      }
      targetElements = newTargetElements;
    }

    if (
      !Math.ceil((scrollSpace - padding) / (clientSpace - padding)) ||
      Math.ceil(Math.round(((scrollSpace - padding) / (clientSpace - padding)) * 100) / 100) === Infinity
    ) {
      return 0;
    }

    const breakPointIndex = [
      ...new Array(Math.ceil(Math.round(((scrollSpace - padding) / (clientSpace - padding)) * 100) / 100)),
    ].reduce((acc, _, index) => {
      breakPoints[index] = (clientSpace - padding) * index + index * gap;
      if (!acc && (clientSpace - padding) * index + index * gap >= scrollSpace - padding) {
        breakPoints[index] = (clientSpace - padding) * index + (index - 1) * gap;
        return index;
      }
      return acc;
    }, 0);

    if (targetElements.length) {
      return targetElements.length;
    }

    return breakPointIndex || Math.ceil(Math.round(((scrollSpace - padding) / (clientSpace - padding)) * 100) / 100);
  };

  const state = window.Alpine.reactive({
    random_id,
    autoRotate,
    container,
    rotateInterval: null,
    rotatePause: false,
    justify: containerStyles.justifyContent,
    current_index: 0,
    infinite: false,
    paddingX: containerStyles.paddingLeft + containerStyles.paddingRight,
    paddingY: containerStyles.paddingTop + containerStyles.paddingBottom,
    gap: (horizontal ? containerStyles.columnGap : containerStyles.rowGap) || 0,
    slide_count: calculateSlideCount(
      containerStyles[horizontal ? "paddingLeft" : "paddingTop"] + containerStyles[horizontal ? "paddingRight" : "paddingBottom"],
      horizontal ? containerStyles.columnGap : containerStyles.rowGap || 0,
      container?.[horizontal ? "scrollWidth" : "scrollHeight"],
      container?.[horizontal ? "clientWidth" : "clientHeight"]
    ),
    block_scroll_events: false,
    horizontal: horizontal,
  });

  const markCenteredChild = (children) => {
    const horizontal = isHorizontal();
    const centerX =
      container?.[horizontal ? "scrollLeft" : "scrollTop"] + container?.[horizontal ? "clientWidth" : "clientHeight"] / 2;
    let closest = null;
    let minDist = Infinity;

    children.forEach((child) => {
      const center = child?.[horizontal ? "offsetLeft" : "offsetTop"] + child?.[horizontal ? "clientWidth" : "clientHeight"] / 2;
      const dist = Math.abs(center - centerX);
      if (dist < minDist) {
        minDist = dist;
        closest = child;
      }
    });

    children.forEach((child) => {
      child.classList.toggle("centered", child === closest);
    });
  };

  const initInfiniteScroll = (index = 0, force = false) => {
    children = [...container.children]
      .filter((el) => el.tagName !== "STYLE" && el.tagName !== "TEMPLATE")
      .toSorted((a, b) => +getComputedStyle(a).order - +getComputedStyle(b).order);
    const containerStyles = getTransformedComputedStyle(container);

    size = children.filter((el) => el.hasAttribute("data-original-node"))?.length || children.length;

    if (!shouldInfinite() && state.infinite) {
      const originals = [...container.children];
      originals.forEach((el) => {
        if (!el.hasAttribute("data-original-node")) {
          el.remove();
        } else {
          el.style.order = "";
        }
      });
      state.infinite = false;
      // Rebuild children list
      children = [...container.children]
        .filter((el) => el.tagName !== "STYLE" && el.tagName !== "TEMPLATE")
        .toSorted((a, b) => +getComputedStyle(a).order - +getComputedStyle(b).order);
    }

    if (shouldInfinite() && (!state.infinite || force)) {
      const visibleSpace = container.getBoundingClientRect()?.[horizontal ? "width" : "height"];
      const gapSize = containerStyles?.[horizontal ? "columnGap" : "rowGap"] || 0;
      const totalContentSpace = [...container.children]
        .filter((el) => el.tagName !== "STYLE" && el.tagName !== "TEMPLATE")
        .reduce(
          (sum, child, index) =>
            sum + child.getBoundingClientRect()?.[horizontal ? "width" : "height"] + (index === 0 ? 0 : gapSize),
          0
        );

      if (totalContentSpace > visibleSpace) {
        state.infinite = true;
        children = [...new Array(size * 2)]
          .map((_, index) => {
            const order_index = index - size;
            const child = children.at(order_index);

            child.style.order = `${order_index}`;
            if (order_index < 0) {
              const newChild = child.cloneNode(true);
              child.setAttribute("data-original-node", "true");
              container.append(newChild);
              return newChild;
            }
            return child;
          })
          ?.sort((a, b) => +a.style.order - +b.style.order);

        if (container[horizontal ? "scrollWidth" : "scrollHeight"] < totalContentSpace) {
          requestAnimationFrame(() => {
            const containerStyles = getTransformedComputedStyle(container);
            const scrollPadding = containerStyles[horizontal ? "scrollPaddingLeft" : "scrollPaddingTop"];

            container[horizontal ? "scrollLeft" : "scrollTop"] =
              children[size + index]?.[horizontal ? "offsetLeft" : "offsetTop"] - scrollPadding;

            children.forEach((child) => {
              child.classList.toggle("scroll-active", +getComputedStyle(child).order === 0);
            });
          });
        } else {
          const scrollPadding = containerStyles[horizontal ? "scrollPaddingLeft" : "scrollPaddingTop"];

          container[horizontal ? "scrollLeft" : "scrollTop"] =
            children[size + index]?.[horizontal ? "offsetLeft" : "offsetTop"] - scrollPadding;
        }
      }

      children.forEach((child) => {
        child.classList.toggle("scroll-active", +getComputedStyle(child).order === 0);
      });
      markCenteredChild(children);
    }

    children.forEach((child, index) => child.setAttribute("data-index", `${index}`));
  };

  initInfiniteScroll();

  const handleInfiniteScroll = (event = undefined, noRepeat = false) => {
    if (state.block_scroll_events || !state.infinite) return;
    const containerStyles = getTransformedComputedStyle(container);

    container.parentElement.style.setProperty("--slider-height", `${container.offsetHeight}px`);
    container.parentElement.style.setProperty(
      "--slider-width",
      `${container?.clientWidth - containerStyles.paddingLeft - containerStyles.paddingRight}px`
    );

    children = [...children];
    const scrollDistance =
      container[state.horizontal ? "scrollLeft" : "scrollTop"] +
      containerStyles[state.horizontal ? "scrollPaddingLeft" : "scrollPaddingTop"];

    const targetIndex = children.findIndex(
      (child) =>
        child[state.horizontal ? "offsetLeft" : "offsetTop"] - 30 < scrollDistance &&
        child?.[state.horizontal ? "offsetLeft" : "offsetTop"] + 30 > scrollDistance
    );

    if (targetIndex === -1) {
      if (!noRepeat) {
        setTimeout(() => {
          handleInfiniteScroll(undefined, true);
        }, 1000);
      }

      return;
    }

    state.block_scroll_events = true;

    children = [...children]
      .map((child, index) => {
        const targetOrder = index - targetIndex;
        child.style.order =
          targetOrder >= -size && targetOrder < size
            ? `${targetOrder}`
            : targetOrder < -size
            ? `${targetOrder + size * 2}`
            : `${targetOrder - size * 2}`;

        return child;
      })
      ?.sort((a, b) => +a.style.order - +b.style.order);

    container[state.horizontal ? "scrollLeft" : "scrollTop"] =
      children[size]?.[state.horizontal ? "offsetLeft" : "offsetTop"] -
      containerStyles[state.horizontal ? "scrollPaddingLeft" : "scrollPaddingTop"];

    Alpine.nextTick(() => {
      state.block_scroll_events = false;
      const children = [...container.children]?.filter(
        (child) => getComputedStyle(child).display !== "none" && getComputedStyle(child).scrollSnapAlign !== "none"
      );

      if (state.infinite && children?.length) {
        const targetIndex = children?.findIndex((child) => +child.style.order === 0);

        state.current_index = targetIndex >= children.length / 2 ? targetIndex - children.length / 2 : targetIndex;

        children.forEach((child, index) => {
          child.classList.toggle("scroll-active", index === targetIndex);
        });
      }
    });
  };

  const handleScroll = () => {
    if (state.block_scroll_events) return;

    if (state.infinite) {
      const containerStyles = getTransformedComputedStyle(container);

      container.parentElement.style.setProperty("--slider-height", `${container.offsetHeight}px`);
      container.parentElement.style.setProperty(
        "--slider-width",
        `${container?.clientWidth - containerStyles.paddingLeft - containerStyles.paddingRight}px`
      );
    }

    const currentIndex = breakPoints.findIndex(
      (num) =>
        container[state.horizontal ? "scrollLeft" : "scrollTop"] >= num - 20 &&
        container[state.horizontal ? "scrollLeft" : "scrollTop"] <= num + 20
    );

    const closest = breakPoints.reduce((acc, num) => {
      return Math.abs(num - container[state.horizontal ? "scrollLeft" : "scrollTop"]) <
        Math.abs(acc - container[state.horizontal ? "scrollLeft" : "scrollTop"])
        ? num
        : acc;
    }, 0);

    const closestIndex = breakPoints.findIndex((num) => closest === num);

    const activeChildren = [...container.children]?.filter(
      (child) => getComputedStyle(child).display !== "none" && getComputedStyle(child).scrollSnapAlign !== "none"
    );

    const sortedActiveChildren = activeChildren?.toSorted((a, b) => +getComputedStyle(a).order - +getComputedStyle(b).order);

    if (state.infinite && sortedActiveChildren?.length) {
      const targetIndex = sortedActiveChildren?.findIndex((child) => +child.style.order === 0);

      /*state.current_index =
        targetIndex >= sortedActiveChildren.length / 2 ? targetIndex - sortedActiveChildren.length / 2 : targetIndex;*/

      sortedActiveChildren.forEach((child, index) => {
        child.classList.toggle("scroll-active", index === targetIndex);
      });

      markCenteredChild(sortedActiveChildren);

      return;
    }

    if (sortedActiveChildren?.length) {
      if (
        container?.[state.horizontal ? "clientWidth" : "clientHeight"] +
          container[state.horizontal ? "scrollLeft" : "scrollTop"] +
          10 >=
        container[state.horizontal ? "scrollWidth" : "scrollHeight"]
      ) {
        state.current_index = sortedActiveChildren.length - 1;
        markCenteredChild(sortedActiveChildren);
        return;
      }

      const style = window.getComputedStyle(container);
      const paddingStart = state.horizontal ? parseFloat(style.paddingLeft) || 0 : parseFloat(style.paddingTop) || 0;

      const scrollPos = container[state.horizontal ? "scrollLeft" : "scrollTop"];
      const triggerPos = scrollPos + paddingStart + 10;

      const targetIndex = sortedActiveChildren.findIndex((child) => {
        const start = child[state.horizontal ? "offsetLeft" : "offsetTop"];
        const end = start + child[state.horizontal ? "clientWidth" : "clientHeight"];
        return start <= triggerPos && end > triggerPos;
      });

      state.current_index = targetIndex === -1 ? state.current_index : targetIndex;

      sortedActiveChildren.forEach((child, index) => {
        child.classList.toggle("scroll-active", index === state.current_index);
      });

      markCenteredChild(sortedActiveChildren);
      return;
    }

    state.current_index = currentIndex !== -1 ? currentIndex : closestIndex !== -1 ? closestIndex : state.current_index;
    markCenteredChild(sortedActiveChildren);
  };

  const handleResize = () => {
    const { paddingLeft, paddingRight, paddingTop, paddingBottom, rowGap, columnGap } = getTransformedComputedStyle(container);
    state.paddingX = paddingLeft + paddingRight;
    state.paddingY = paddingTop + paddingBottom;
    state.horizontal = isHorizontal();
    state.gap = (state.horizontal ? columnGap : rowGap) || 0;
    state.slide_count = calculateSlideCount();
    initInfiniteScroll(state.current_index);
    container.classList.toggle("cursor-grab", enable_mouse_dragging && !state.infinite && isScrollable());

    if (state.justify === "center") {
      container.classList.toggle(
        "!justify-start",
        container[state.horizontal ? "scrollWidth" : "scrollHeight"] >
          container?.[state.horizontal ? "clientWidth" : "clientHeight"]
      );
      handleScroll();
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(updateSliderHeightFromVisible);
    });
  };

  const scrollToIndex = (index, scrollDuration = speed) => {
    if (index === state.current_index) return;
    container.classList.remove("snap-both", "snap-x", "snap-y");
    const containerStyles = getTransformedComputedStyle(container);
    state.block_scroll_events = true;

    const activeChildren = [...container.children]?.filter(
      (child) => getComputedStyle(child).display !== "none" && getComputedStyle(child).scrollSnapAlign !== "none"
    );

    const sortedActiveChildren = activeChildren?.toSorted((a, b) => +getComputedStyle(a).order - +getComputedStyle(b).order);

    if (sortedActiveChildren?.length) {
      const currentIndex = sortedActiveChildren.findIndex((child) => child.classList.contains("scroll-active"));

      if (state.infinite && currentIndex) {
        index = currentIndex - state.current_index + index;
      }

      const target = sortedActiveChildren[index];

      sortedActiveChildren.forEach((child, i) => {
        child.classList.toggle("scroll-active", i === index);
      });

      utils.scrollToXY(
        scrollDuration,
        (target?.offsetLeft ?? 0) - containerStyles.scrollPaddingLeft,
        (target?.offsetTop ?? 0) - containerStyles.scrollPaddingTop,
        container,
        () => {
          container.classList.add(state.horizontal ? "snap-x" : "snap-y");
          state.block_scroll_events = false;
          handleScroll();
          if (state.infinite) {
            handleInfiniteScroll();
          }
        }
      );
      return;
    }

    utils.scrollToXY(
      scrollDuration,
      (container?.clientWidth - state.paddingX) * index + index * state.gap,
      (container?.clientHeight - state.paddingY) * index + index * state.gap,
      container,
      () => {
        container.classList.add(state.horizontal ? "snap-x" : "snap-y");
        state.block_scroll_events = false;
        handleScroll();
      }
    );
  };

  if (state.justify === "center") {
    container.classList.toggle(
      "!justify-start",
      container[state.horizontal ? "scrollWidth" : "scrollHeight"] >
        container?.[state.horizontal ? "clientWidth" : "clientHeight"]
    );

    state.paddingX = containerStyles.paddingLeft + containerStyles.paddingRight;
    state.paddingY = containerStyles.paddingTop + containerStyles.paddingBottom;
    state.horizontal = isHorizontal();
    state.gap = (state.horizontal ? containerStyles.columnGap : containerStyles.rowGap) || 0;
    state.slide_count = calculateSlideCount();
    handleScroll();
  }

  if (autoRotate) {
    Alpine.effect(() => {
      if (!autoRotate) return;

      if (!state.rotateInterval && !state.rotatePause) {
        state.rotateInterval = setInterval(() => {
          if (state.infinite) {
            const target = [...container.children]?.find((child) => +getComputedStyle(child).order === 1);
            if (target) {
              container.classList.remove("snap-both", "snap-x", "snap-y");
              const containerStyles = getTransformedComputedStyle(container);
              state.block_scroll_events = true;

              utils.scrollToXY(
                speed,
                (target?.offsetLeft ?? 0) - containerStyles.scrollPaddingLeft,
                (target?.offsetTop ?? 0) - containerStyles.scrollPaddingTop,
                container,
                () => {
                  container.classList.add(state.horizontal ? "snap-x" : "snap-y");
                  state.block_scroll_events = false;
                  handleScroll();
                  if (state.infinite) {
                    handleInfiniteScroll();
                  }
                }
              );
              return;
            }
          }
          scrollToIndex(state.current_index + 1 >= state.slide_count ? 0 : state.current_index + 1);
        }, autoRotate * 1000);
      }
      if (state.rotateInterval && state.rotatePause) {
        clearInterval(state.rotateInterval);
        state.rotateInterval = null;
      }
    });
  }

  container.classList.add(state.horizontal ? "snap-x" : "snap-y");

  if (enable_mouse_dragging) {
    const enableDragScroll = (container) => {
      let isDragging = false;
      let dragged = false;
      let startX, startY, scrollLeft, scrollTop;

      container.classList.toggle("cursor-grab", enable_mouse_dragging && !state.infinite && isScrollable());

      const deactivateCursor = () => {
        container.classList.remove("cursor-grab");
      };

      const addDraggingCursor = () => {
        document.body.classList.add("dragging");
      };

      const removeDraggingCursor = () => {
        document.body.classList.remove("dragging");
      };

      const smoothSnapToClosestChild = () => {
        const children = Array.from(container.children);
        if (!children.length) return;

        const horizontal = container.scrollWidth > container.clientWidth;

        // padding at the leading edge of the scroll axis
        const style = getComputedStyle(container);
        const padStart = horizontal ? parseFloat(style.paddingLeft) || 0 : parseFloat(style.paddingTop) || 0;

        // current scroll in the same coordinate space
        const scrollPos = horizontal ? container.scrollLeft : container.scrollTop;

        // helper: where this child should align the scroll to (start edge)
        const snapStart = (el) => (horizontal ? el.offsetLeft : el.offsetTop) - padStart;

        // pick the child whose snapStart is closest to current scroll
        let closest = null;
        let minDist = Infinity;
        for (const child of children) {
          const start = snapStart(child);
          const dist = Math.abs(start - scrollPos);
          if (dist < minDist) {
            minDist = dist;
            closest = child;
          }
        }

        if (!closest) return;

        const targetPos = snapStart(closest);

        container.scrollTo({
          [horizontal ? "left" : "top"]: targetPos,
          behavior: "smooth",
        });

        // restore snap after the animation
        setTimeout(() => {
          container.style.scrollSnapType = "";
        }, 400);
      };

      const onMouseDown = (e) => {
        if (state.infinite || document.body.classList.contains("dragging")) return;
        if (!isScrollable()) return;
        isDragging = true;
        dragged = false;
        startX = e.pageX - container.offsetLeft;
        startY = e.pageY - container.offsetTop;
        scrollLeft = container.scrollLeft;
        scrollTop = container.scrollTop;

        addDraggingCursor();
        container.style.scrollSnapType = "none";

        e.preventDefault();
      };

      const onMouseMove = (e) => {
        if (!isDragging) return;
        dragged = true;

        const x = e.pageX - container.offsetLeft;
        const y = e.pageY - container.offsetTop;
        const walkX = (x - startX) * 1.5;
        const walkY = (y - startY) * 2;

        container.scrollLeft = scrollLeft - walkX;
        container.scrollTop = scrollTop - walkY;
      };

      const onMouseUp = () => {
        if (!isDragging) return;
        isDragging = false;
        removeDraggingCursor();

        if (dragged) {
          smoothSnapToClosestChild(); // ⬅️ Added call
        } else {
          container.style.scrollSnapType = "";
        }
      };

      const onClickCapture = (e) => {
        if (dragged) {
          e.stopPropagation();
          e.preventDefault();
          dragged = false;
        }
      };

      container.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mousemove", onMouseMove, true);
      window.addEventListener("mouseup", onMouseUp, true);
      container.addEventListener("click", onClickCapture, true);

      const ro = new ResizeObserver(() => {
        if (isScrollable()) {
          container.classList.toggle("cursor-grab", enable_mouse_dragging && !state.infinite && isScrollable());
        } else {
          deactivateCursor();
        }
      });
      ro.observe(container);

      const mo = new MutationObserver(() => {
        if (isScrollable()) {
          container.classList.toggle("cursor-grab", enable_mouse_dragging && !state.infinite && isScrollable());
        } else {
          deactivateCursor();
        }
      });
      mo.observe(container, { childList: true, subtree: true });
    };

    enableDragScroll(container);
  }

  Alpine.nextTick(() => {
    handleResize();
    handleScroll();
    handleInfiniteScroll();
  });

  const resizeObserver = new ResizeObserver(() => {
    handleResize();
    handleScroll();
    handleInfiniteScroll();
  });

  resizeObserver.observe(container);

  return {
    content_slider: {
      container,
      state,
      handleInfiniteScroll,
      handleScroll,
      handleResize,
      scrollToIndex,
      calculateSlideCount,
      initInfiniteScroll,
    },
  };
};

window.utils.initContentSlider = initContentSlider;

/* LAST HASH: 51e5ed52257dd24dc5f54cda2cecaf87b53c8a44 */
