const createEnsureNoHiddenTabs = ({ rootElement, tabsStore, cooldownInMilliseconds = 200 }) => {
  let isInCooldownPeriod = false;

  const runCoreCheck = async () => {
    for (let i = 0; i < tabsStore[rootElement.id].current_tabs.length; i++) {
      const nodes = [...rootElement.querySelectorAll(`[data-tab-group="${i}"][data-tab-id]`)];

      if (!nodes.length) return;

      const currentId = tabsStore[rootElement.id].current_tabs?.[i];
      const currentElement = nodes.find((el) => el.getAttribute("data-tab-id") === currentId);
      const isCurrentVisible = currentElement ? utils.isVisible(currentElement) : false;

      if (isCurrentVisible) return;

      for (const node of nodes) {
        if (node === currentElement) continue;
        tabsStore[rootElement.id].current_tabs[i] = node?.getAttribute("data-tab-id") ?? "";
        let shouldBreakLoop = false;

        await new Promise((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              if (utils.isVisible(node)) {
                shouldBreakLoop = true;
              }
              resolve(true);
            });
          });
        });

        if (shouldBreakLoop) {
          break;
        }
      }
    }
  };

  const runAfterLayoutHasSettled = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        void runCoreCheck();
      });
    });
  };

  return () => {
    if (isInCooldownPeriod) return;
    isInCooldownPeriod = true;

    runAfterLayoutHasSettled();

    window.setTimeout(() => {
      isInCooldownPeriod = false;
    }, cooldownInMilliseconds);
  };
};

export const initTabsStore = () => {
  window.Alpine.store("tabs", {});

  const tabs = window.Alpine.store("tabs");
  window.Alpine.magic("tabs", () => tabs);
  window._stores["tabs"] = tabs;
};

export const initTabs = ($el) => {
  const raw_tabs = utils.JSONParse($el.getAttribute("data-tabs") ?? "[]");

  const tabs = window.Alpine.store("tabs");

  tabs[$el.id] = {
    tabs: raw_tabs?.map((t) => t?.split("|%S%|")),
    current_tabs: raw_tabs?.map((t) => t?.split("|%S%|")?.[0] ?? ""),
  };

  const ensureNoHiddenTabs = createEnsureNoHiddenTabs({
    rootElement: $el,
    tabsStore: tabs,
    cooldownInMilliseconds: 200,
  });

  if ($el.querySelector("[data-hotspot-canvas]")) {
    window.setTimeout(() => {
      ensureNoHiddenTabs();
    }, 60);

    [480, 640, 768, 1024, 1280, 1536].forEach((pixelWidth) => {
      window.matchMedia(`(min-width: ${pixelWidth}px)`).addEventListener("change", ensureNoHiddenTabs);
    });

    window.addEventListener("orientationchange", ensureNoHiddenTabs, { passive: true });
  }

  return tabs[$el.id];
};

window._sections["initTabs"] = initTabs;

document.addEventListener("alpine:init", initTabsStore);

/* LAST HASH: 751a17d2e12b99b789afde0d72c090f2bc589d56 */
