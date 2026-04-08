export const initCSSAutoPrefixer = (forceCheck = false) => {
  const needsAutoprefixing = () => {
    const testElem = document.createElement("div");
    testElem.style.userSelect = "none";
    testElem.style.backdropFilter = "blur(10px)";
    testElem.style.appearance = "none";
    testElem.style.clipPath = "circle(50%)";

    return (
      testElem.style.userSelect !== "none" ||
      testElem.style.backdropFilter !== "blur(10px)" ||
      testElem.style.appearance !== "none" ||
      testElem.style.clipPath !== "circle(50%)"
    );
  };

  const isOldBrowser = () => {
    if (forceCheck) {
      return true;
    }
    const ua = navigator.userAgent;

    // Older iOS Safari (12-14)
    const isOldiOS = /iP(hone|od|ad)/.test(ua) && /Version\/(12|13|14).*Safari/.test(ua);

    // Older Samsung Internet Browser
    const isOldSamsung = /SamsungBrowser\/([0-9]+)/.test(ua) && parseInt(ua.match(/SamsungBrowser\/([0-9]+)/)[1], 10) < 15;

    // Older Android WebView / Chrome / Firefox versions
    const isOldAndroid =
      /Android/.test(ua) &&
      ((/Chrome\/([0-9]+)/.test(ua) && parseInt(ua.match(/Chrome\/([0-9]+)/)[1], 10) < 90) ||
        (/Firefox\/([0-9]+)/.test(ua) && parseInt(ua.match(/Firefox\/([0-9]+)/)[1], 10) < 85) ||
        /wv/.test(ua)); // WebView detection

    return isOldiOS || isOldSamsung || isOldAndroid || needsAutoprefixing();
  };

  const loadAutoprefixerForOldBrowsers = async () => {
    if (!isOldBrowser()) {
      return;
    }

    try {
      // @ts-ignore
      const postcss = (await import("https://jspm.dev/postcss@8.1.10")).default;
      // @ts-ignore
      const autoprefixer = (await import("https://jspm.dev/autoprefixer@10.0.2")).default;

      const processStylesWithAutoprefixer = async () => {
        const styleTags = document.querySelectorAll("style");

        for (const styleTag of styleTags) {
          const css = styleTag.textContent;
          try {
            const result = await postcss([
              autoprefixer({
                overrideBrowserslist: [
                  "iOS 12-14",
                  "Safari 12-14",
                  "Samsung 4-15",
                  "Android >= 6",
                  "Chrome <= 90",
                  "Firefox <= 85",
                ],
              }),
            ]).process(css, { from: undefined });
            if (forceCheck) {
              console.log(`CSS style element check Completed`);
              continue;
            }
            styleTag.textContent = result.css;
          } catch (err) {
            console.error("❌ CSS Validation - Autoprefixer Error:", styleTag, err, { css });
          }
        }
      };

      processStylesWithAutoprefixer();
    } catch (error) {
      console.error("❌ Failed to load PostCSS or Autoprefixer:", error);
    }
  };

  loadAutoprefixerForOldBrowsers();
};

window.initCSSAutoPrefixer = initCSSAutoPrefixer;

initCSSAutoPrefixer();

/* LAST HASH: 6d16248fbede4361a5a6a06f21bc88bb1d7f56c0 */
