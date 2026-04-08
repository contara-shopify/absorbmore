export const _scrollbar = {
  init: (bar, thumb, scroll_speed = 150) => {
    const findScrollContainer = (element) => {
      return (
        (element?.parentElement?.querySelector('[x-ref="scrollContainer"]') || findScrollContainer(element.parentElement)) ??
        container
      );
    };

    const container = findScrollContainer(bar);

    const isHorizontal = () => {
      return !!(
        getComputedStyle(container).overflowY === "hidden" ||
        getComputedStyle(container).gridAutoFlow === "column" ||
        container.scrollWidth > container?.clientWidth
      );
    };

    const horizontal = isHorizontal();
    const state = window.Alpine.reactive({
      horizontal: horizontal,
      current_index: Math.max(
        1,
        horizontal
          ? Math.min(
              [...(container?.children ?? [])]?.filter(
                (child) => getComputedStyle(child).display !== "none" && getComputedStyle(child).scrollSnapAlign !== "none"
              ).length,
              [...(container?.children ?? [])]
                ?.filter(
                  (child) => getComputedStyle(child).display !== "none" && getComputedStyle(child).scrollSnapAlign !== "none"
                )
                .findIndex((child) => {
                  const center = container?.clientWidth / 2 + container?.scrollLeft;
                  const start =
                    container?.scrollLeft + +getComputedStyle(container).scrollPaddingLeft.replace("px", "").replace("auto", "0");

                  if (container?.children.length > Math.round((container?.scrollWidth / container?.clientWidth) * 100) / 100) {
                    return child.offsetLeft - 5 <= start && child.offsetLeft + child.clientWidth > start;
                  }
                  return child.offsetLeft < center && child.offsetLeft + child.clientWidth > center;
                }) + 1
            )
          : Math.min(
              [...(container?.children ?? [])]?.filter(
                (child) => getComputedStyle(child).display !== "none" && getComputedStyle(child).scrollSnapAlign !== "none"
              ).length,
              [...(container?.children ?? [])]
                ?.filter(
                  (child) => getComputedStyle(child).display !== "none" && getComputedStyle(child).scrollSnapAlign !== "none"
                )
                .findIndex((child) => {
                  const center = container?.clientHeight / 2 + container?.scrollTop;
                  const start =
                    container?.scrollTop + +getComputedStyle(container).scrollPaddingTop.replace("px", "").replace("auto", "0");

                  if (container?.children.length > Math.round((container?.scrollHeight / container?.clientHeight) * 100) / 100) {
                    return child.offsetTop - 5 <= start && child.offsetTop + child.clientHeight > start;
                  }
                  return child.offsetTop < center && child.offsetLeft + child.clientHeight > center;
                }) + 1
            ),
      ),
      pages: [...(container?.children ?? [])]?.filter(
        (child) => getComputedStyle(child).display !== "none" && getComputedStyle(child).scrollSnapAlign !== "none"
      ).length,
      width: (container?.clientWidth / container?.scrollWidth) * 100,
      height: (container?.clientHeight / container?.scrollHeight) * 100,
      left: ((container?.scrollLeft / container?.scrollWidth) * bar.clientWidth) / bar.clientWidth,
      top: ((container?.scrollTop / container?.scrollHeight) * bar.clientHeight) / bar.clientHeight,
      manual_scroll: false,
      no_next_page: horizontal
        ? container?.scrollLeft + container?.clientWidth + 25 >= container?.scrollWidth
        : container?.scrollTop + container?.clientHeight + 25 >= container?.scrollHeight,
    });

    const calculatePosition = () => {
      state.horizontal = isHorizontal();
      const children = [...(container?.children ?? [])]
        .filter((el) => el.tagName !== "STYLE")
        .filter((child) => getComputedStyle(child).display !== "none" && getComputedStyle(child).scrollSnapAlign !== "none")
        .toSorted((a, b) => +getComputedStyle(a).order - +getComputedStyle(b).order);

      if (state.horizontal) {
        state.current_index = Math.max(
          1,
          Math.min(
            children.length,
            children?.findIndex((child, i, arr) => {
              const center = container?.clientWidth / 2 + container?.scrollLeft;

              const start =
                container?.scrollLeft + parseFloat(getComputedStyle(container).scrollPaddingLeft.replace("auto", "0"));

              if (arr.length > Math.round((container?.scrollWidth / container?.clientWidth) * 100) / 100) {
                return child.offsetLeft - 5 <= start && child.offsetLeft + child.clientWidth > start;
              }
              return child.offsetLeft < center && child.offsetLeft + child.clientWidth > center;
            }) + 1 || children.length
          ),
        );
      }

      if (!state.horizontal) {
        state.current_index = Math.max(
          1,
          Math.min(
            children.length,
            children?.findIndex((child, i, arr) => {
              const center = container?.clientHeight / 2 + container?.scrollTop;

              const start = container?.scrollTop + parseFloat(getComputedStyle(container).scrollPaddingTop.replace("auto", "0"));

              if (arr.length > Math.round((container?.scrollHeight / container?.clientHeight) * 100) / 100) {
                return child.offsetTop - 5 <= start && child.offsetTop + child.clientHeight > start;
              }
              return child.offsetTop < center && child.offsetTop + child.clientHeight > center;
            }) + 1 || children.length
          ),
        );
      }

      state.pages = children?.filter((child) => getComputedStyle(child).display !== "none").length;
      state.width = container?.clientWidth / container?.scrollWidth;
      state.height = container?.clientHeight / container?.scrollHeight;
      state.left = ((container?.scrollLeft / container?.scrollWidth) * bar.clientWidth) / bar.clientWidth;
      state.top = ((container?.scrollTop / container?.scrollHeight) * bar.clientHeight) / bar.clientHeight;
      state.no_next_page =
        state.current_index === state.pages ||
        (state.horizontal
          ? container?.scrollLeft + container?.clientWidth + 25 >= container?.scrollWidth
          : container?.scrollTop + container?.clientHeight + 25 >= container?.scrollHeight);
    };

    const handleScrollBarClick = (e, content_slider) => {
      if (state.horizontal) {
        const percentage =
          (e.clientX - bar.getBoundingClientRect().left) / bar.clientWidth -
          ((state.width / 2) * bar.clientWidth) / bar.clientWidth;
        if (content_slider?.state) {
          content_slider.state.block_scroll_events = true;
        }
        container?.scrollTo({
          left: percentage * container?.scrollWidth,
          behavior: "instant",
        });
      }
      if (!state.horizontal) {
        const percentage =
          (e.clientY - bar.getBoundingClientRect().top) / bar.scrollHeight -
          ((state.height / 2) * bar.scrollHeight) / bar.scrollHeight;
        if (content_slider?.state) {
          content_slider.state.block_scroll_events = true;
        }
        container?.scrollTo({
          top: percentage * container?.scrollHeight,
          behavior: "instant",
        });
      }

      if (content_slider?.state) {
        content_slider.state.block_scroll_events = false;
      }

      calculatePosition();
    };

    const handleScrollThumbPointerDown = (e, content_slider) => {
      if (!container) return;
      container.style.scrollSnapType = "none";
      if (state.horizontal) {
        const startX = e.clientX;
        const startLeft = state.left * bar.clientWidth;
        document.body.classList.add("[&_*]:!cursor-grabbing");
        thumb.classList.add("active");
        if (content_slider?.state) {
          content_slider.state.block_scroll_events = true;
        }
        const handleDocumentPointerMove = (e) => {
          const percentage = Math.max(0, Math.min(1, (startLeft + e.clientX - startX) / bar.clientWidth));

          container?.scrollTo({
            left: percentage * container?.scrollWidth,
            behavior: "instant",
          });
          calculatePosition();
        };
        const handleDocumentPointerUp = (e) => {
          removeEventListeners();
        };

        const removeEventListeners = () => {
          document.body.classList.remove("[&_*]:!cursor-grabbing");
          thumb.classList.remove("active");
          container.style.scrollSnapType = "";
          document.removeEventListener("pointermove", handleDocumentPointerMove);
          document.removeEventListener("pointerup", handleDocumentPointerUp);
          if (content_slider?.state) {
            content_slider.state.block_scroll_events = false;
          }
        };

        document.addEventListener("pointermove", handleDocumentPointerMove);
        document.addEventListener("pointerup", handleDocumentPointerUp);
      }

      if (!state.horizontal) {
        const startY = e.clientY;
        const startTop = state.top * bar.scrollHeight;
        document.body.classList.add("[&_*]:!cursor-grabbing");
        thumb.classList.add("active");
        if (content_slider?.state) {
          content_slider.state.block_scroll_events = true;
        }
        const handleDocumentPointerMove = (e) => {
          const percentage = Math.max(0, Math.min(1, (startTop + e.clientY - startY) / bar.scrollHeight));

          container?.scrollTo({
            top: percentage * container?.scrollHeight,
            behavior: "instant",
          });
          calculatePosition();
        };
        const handleDocumentPointerUp = (e) => {
          removeEventListeners();
        };

        const removeEventListeners = () => {
          document.body.classList.remove("[&_*]:!cursor-grabbing");
          thumb.classList.remove("active");
          container.style.scrollSnapType = "";
          document.removeEventListener("pointermove", handleDocumentPointerMove);
          document.removeEventListener("pointerup", handleDocumentPointerUp);
          if (content_slider?.state) {
            content_slider.state.block_scroll_events = false;
          }
        };

        document.addEventListener("pointermove", handleDocumentPointerMove);
        document.addEventListener("pointerup", handleDocumentPointerUp);
      }
    };

    const handlePrevClick = (e, content_slider) => {
      if (!container) return;
      container.style.scrollSnapType = "none";
      if (content_slider?.state) {
        content_slider.state.block_scroll_events = true;
      }

      const activeChildren = [...(container?.children ?? [])]?.filter(
        (child) =>
          getComputedStyle(child).display !== "none" &&
          getComputedStyle(child).scrollSnapAlign !== "none" &&
          child.tagName !== "STYLE"
      );

      const index = Math.max(0, state.current_index - 2 < 0 ? activeChildren?.length - 1 : state.current_index - 2);

      const sortedActiveChildren = activeChildren?.toSorted((a, b) => +getComputedStyle(a).order - +getComputedStyle(b).order);

      sortedActiveChildren.forEach((child, i) => {
        child.classList.toggle("scroll-active", i === index);
      });

      if (state.horizontal) {
        utils.scrollToX(
          scroll_speed,
          (sortedActiveChildren[index]?.offsetLeft ?? 0) -
            +getComputedStyle(container).scrollPaddingLeft.replace("px", "").replace("auto", "0"),
          container,
          () => {
            container.style.scrollSnapType = "";
            calculatePosition();
            if (content_slider?.state) {
              content_slider.state.block_scroll_events = false;
              content_slider?.handleScroll();
              content_slider?.handleInfiniteScroll();
            }
          }
        );
      }
      if (!state.horizontal) {
        utils.scrollToY(
          scroll_speed,
          (sortedActiveChildren[index]?.offsetTop ?? 0) -
            +getComputedStyle(container).scrollPaddingTop.replace("px", "").replace("auto", "0"),
          container,
          () => {
            container.style.scrollSnapType = "";
            calculatePosition();
            if (content_slider?.state) {
              content_slider.state.block_scroll_events = false;
              content_slider?.handleScroll();
              content_slider?.handleInfiniteScroll();
            }
          }
        );
      }
    };

    const handleNextClick = (e, content_slider) => {
      if (!container) return;
      container.style.scrollSnapType = "none";
      if (content_slider?.state) {
        content_slider.state.block_scroll_events = true;
      }
      const activeChildren = [...(container?.children ?? [])]?.filter(
        (child) =>
          getComputedStyle(child).display !== "none" &&
          getComputedStyle(child).scrollSnapAlign !== "none" &&
          child.tagName !== "STYLE"
      );

      const sortedActiveChildren = activeChildren?.toSorted((a, b) => +getComputedStyle(a).order - +getComputedStyle(b).order);

      let found = false;
      const target =
        sortedActiveChildren.find((el) => {
          if (found) {
            el.classList.add("scroll-active");
            return true;
          }
          if (el.classList.contains("scroll-active")) {
            el.classList.remove("scroll-active");
            found = true;
          }
          return false;
        }) ?? sortedActiveChildren[1];

      if (state.horizontal) {
        utils.scrollToX(
          scroll_speed,
          (target?.offsetLeft ?? 0) - +getComputedStyle(container).scrollPaddingLeft.replace("px", "").replace("auto", "0"),
          container,
          () => {
            container.style.scrollSnapType = "";
            calculatePosition();
            if (content_slider?.state) {
              content_slider.state.block_scroll_events = false;
              content_slider?.handleScroll();
              content_slider?.handleInfiniteScroll();
            }
          }
        );
      }
      if (!state.horizontal) {
        utils.scrollToY(
          scroll_speed,
          (target?.offsetTop ?? 0) - +getComputedStyle(container).scrollPaddingTop.replace("px", "").replace("auto", "0"),
          container,
          () => {
            container.style.scrollSnapType = "";
            calculatePosition();
            if (content_slider?.state) {
              content_slider.state.block_scroll_events = false;
              content_slider?.handleScroll();
              content_slider?.handleInfiniteScroll();
            }
          }
        );
      }
    };

    container?.addEventListener("scroll", (e) => {
      calculatePosition();
    });

    const mutationObserver = new MutationObserver((e) => {
      calculatePosition();
    });

    mutationObserver.observe(container, {
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    const resizeObserver = new ResizeObserver((e) => {
      calculatePosition();
    });

    resizeObserver.observe(container, { box: "content-box" });

    calculatePosition();

    return {
      handleScrollBarClick,
      handleScrollThumbPointerDown,
      handlePrevClick,
      handleNextClick,
      scrollbar: state,
      containerRef: container,
    };
  },
  initScrollPagination: ($el) => {
    const findScrollContainer = (element) => {
      return element?.parentElement?.querySelector('[x-ref="scrollContainer"]') || findScrollContainer(element.parentElement);
    };
    const container = findScrollContainer($el);

    const content_slider = container
      ?.closest('[x-data*="initContentSlider"]')
      // @ts-ignore
      ?._x_dataStack?.find((state) => state["content_slider"])?.content_slider;

    return {
      containerRef: container,
      content_slider: content_slider ?? {},
    };
  },
};

window._scrollbar = _scrollbar;

/* LAST HASH: 2bada99b6d71d8e3779f0f3a7325ace1cfe4c202 */
