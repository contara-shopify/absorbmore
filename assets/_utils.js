let initCollapsible = undefined;
let initContentSlider = undefined;

initCollapsible = undefined;
initContentSlider = undefined;

const JSONParse = (object, origin = "") => {
  if (object === undefined) {
    return null;
  }
  try {
    return JSON.parse(object);
  } catch (err) {
    return null;
  }
};

const getImageSrcSet = (src, maxWidth) => {
  if (!src || typeof src !== "string") {
    return "";
  }
  if (src?.includes("?")) {
    return [3840, 1920, 1440, 1200, 960, 640, 460, 384, 256, 180, 96]
      .map((number, index, arr) => {
        if (maxWidth && arr[index + 1] > maxWidth) {
          return null;
        }
        return `${src}&width=${number} ${number}w`;
      })
      .filter((d) => !!d)
      .slice(0, 5)
      .join(",");
  }
  return [3840, 1920, 1440, 1200, 960, 640, 460, 384, 256, 180, 96]
    .map((number, index, arr) => {
      if (maxWidth && arr[index + 1] > maxWidth) {
        return null;
      }
      return `${src}?width=${number} ${number}w`;
    })
    .filter((d) => !!d)
    .slice(0, 5)
    .join(",");
};

const getReviewStarGradients = (rating, position) => {
  return `url(#star-rating-${
    rating < position - 1
      ? 0
      : rating < position && rating > position - 1
      ? Math.floor(((rating - (position - 1)) * 100) / 25) * 25
      : 100
  })`;
};

const pushSearchParams = ({ update = {}, remove = [], title }) => {
  const url = new URL(window.location.href);
  Object.entries(update).forEach(([key, value]) => {
    url.searchParams.set(key, `${value}`);
  });
  remove.forEach((key) => {
    url.searchParams.delete(key);
  });

  window.history.pushState(null, null, url);
};

const replaceSearchParams = ({ update = {}, remove = [], title }) => {
  const url = new URL(window.location.href);
  Object.entries(update).forEach(([key, value]) => {
    url.searchParams.set(key, `${value}`);
  });
  remove.forEach((key) => {
    url.searchParams.delete(key);
  });

  window.history.replaceState(null, null, url);
};

const getSiblingUrl = (handle) => {
  const url = new URL(window.location.href);
  url.pathname = /\/collections\/[^/]\/products\//gi.test(url.pathname)
    ? url.pathname.replace(/\/products\/[^?]*/gi, `/products/${handle}`)
    : `/products/${handle}`;
  url.searchParams.delete("variant");
  url.searchParams.delete("selling_plan");
  return url.toString();
};

const pushUrlTarget = (id) => {
  const url = new URL(window.location.href);
  url.hash = id;

  window.history.replaceState(null, null, url);
};

const checkDomain = function (url) {
  if (url && url?.indexOf("//") === 0) {
    url = location.protocol + url;
  }
  return url
    .toLowerCase()
    .replace(/([a-z])?:\/\//, "$1")
    .split("/")[0];
};

const isExternalURL = function (url) {
  if (!url || typeof url !== "string") {
    return false;
  }

  return (url?.indexOf(":") > -1 || url?.indexOf("//") > -1) && checkDomain(location.href) !== checkDomain(url);
};

const transpileRichtextMetafield = (schema) => {
  function convertSchemaToHtml(schema) {
    let html = ``;
    if (!Array.isArray(schema) && schema.type === "root") {
      html += convertSchemaToHtml(schema.children);
    }

    if (Array.isArray(schema)) {
      schema?.forEach((el) => {
        switch (el.type) {
          case "paragraph":
            html += buildParagraph(el);
            break;
          case "heading":
            html += buildHeading(el);
            break;
          case "list":
            html += buildList(el);
            break;
          case "list-item":
            html += buildListItem(el);
            break;
          case "link":
            html += buildLink(el);
            break;
          case "text":
            html += buildText(el);
            break;
          default:
            break;
        }
      });
    }
    return html;
  }

  function buildParagraph(el) {
    if (el?.children) {
      return `<p>${convertSchemaToHtml(el?.children)}</p>`;
    }
    return "";
  }

  function buildHeading(el) {
    if (el?.children) {
      return `<h${el?.level}>${convertSchemaToHtml(el?.children)}</h${el?.level}>`;
    }
    return "";
  }

  function buildList(el) {
    if (el?.children) {
      if (el?.listType === "ordered") {
        return `<ol>${convertSchemaToHtml(el?.children)}</ol>`;
      } else {
        return `<ul>${convertSchemaToHtml(el?.children)}</ul>`;
      }
    }
    return "";
  }

  function buildListItem(el) {
    if (el?.children) {
      return `<li>${convertSchemaToHtml(el?.children)}</li>`;
    }
    return "";
  }

  function buildLink(el) {
    return `<a href="${el?.url}" title="${el?.title}" target="${el?.target}">${convertSchemaToHtml(el?.children)}</a>`;
  }

  function buildText(el) {
    if (el?.bold) {
      return `<strong>${el?.value}</strong>`;
    }
    if (el?.italic) {
      return `<em>${el?.value}</em>`;
    }
    return el?.value;
  }

  return convertSchemaToHtml(schema);
};

const clsx = (...props) => {
  let i = 0;
  let tmp;
  let str = "";
  const len = props.length;
  for (; i < len; i++) {
    if ((tmp = props[i])) {
      if (typeof tmp === "string") {
        str += (str && " ") + tmp;
      }
    }
  }
  return str;
};

const shortUUID = () => {
  // I generate the UID from two parts here
  // to ensure the random number provide enough bits.
  let firstPart = (Math.random() * 46656) | 0;
  let secondPart = (Math.random() * 46656) | 0;
  firstPart = `000${firstPart.toString(36)}`.slice(-3);
  secondPart = `000${secondPart.toString(36)}`.slice(-3);
  return firstPart + secondPart;
};

const isEmail = (str) => {
  if (!str) return false;
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(str);
};

const formatMoney = (cents, money_format = window.money_format, no_rounding = true) => {
  if (money_format?.includes("store_default")) {
    money_format = window.money_format;
  }
  if (cents === null || cents === undefined) return "";

  if (typeof cents === "string") {
    cents = cents.replace(/[^\d]/g, "");
    cents = parseInt(cents, 10);
  }

  const formatRegex = /{{\s*(\w+)\s*}}/;
  const formatKey = money_format?.match(formatRegex)?.[1];

  const formatNumber = (value, decimals = 2, thousandsSep = ",", decimalSep = ".") => {
    if (isNaN(value)) return "0";
    const fixed = (value / 100).toFixed(decimals);
    const [intPart, decPart] = fixed.split(".");
    const intWithSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
    return decimals > 0 ? `${intWithSep}${decimalSep}${decPart}` : intWithSep;
  };

  let formatted = "";
  switch (formatKey) {
    case "amount":
      formatted = formatNumber(cents, 2);
      break;
    case "amount_no_decimals":
      formatted = no_rounding && cents % 100 > 0 ? formatNumber(cents, 2) : formatNumber(cents, 0);
      break;
    case "amount_with_comma_separator":
      formatted = formatNumber(cents, 2, ".", ",");
      break;
    case "amount_with_space_separator":
      formatted = formatNumber(cents, 2, "\u00A0", ",");
      break;
    case "amount_with_period_and_space_separator":
      formatted = formatNumber(cents, 2, " ", ".");
      break;
    case "amount_no_decimals_with_comma_separator":
      formatted = formatNumber(cents, 0, ".", ",");
      break;
    case "amount_no_decimals_with_space_separator":
      formatted = formatNumber(cents, 0, "\u00A0", ",");
      break;
    case "amount_with_apostrophe_separator":
      formatted = formatNumber(cents, 2, "'", ".");
      break;
    default:
      return formatNumber(cents, 2);
  }

  return money_format?.replace(formatRegex, formatted) ?? formatted;
};

window["formatMoney"] = formatMoney;

const roundToIndex = function (x, index = 0) {
  // Rounds a number to a given index around the decimal point.
  //
  // Args:
  //   x - Number to round.
  //   index - Index of the least significan digit; 0 is the decimal point.
  // Returns:
  //   rounded - Number rounded using the least signficant digit.

  const power = Math.pow(10, -index);
  return Math.round(x * power) / power;
};

const easeInOutQuad = ({ currentTime, start, change, duration }) => {
  let newCurrentTime = currentTime;
  newCurrentTime /= duration / 2;

  if (newCurrentTime < 1) {
    return (change / 2) * newCurrentTime * newCurrentTime + start;
  }

  newCurrentTime -= 1;
  return (-change / 2) * (newCurrentTime * (newCurrentTime - 2) - 1) + start;
};

const scrollToY = (duration, to, container = window, callback = () => {}) => {
  const start = container instanceof HTMLElement ? container.scrollTop : container.scrollY;

  const change = to - start;
  const startDate = new Date().getTime();

  const animateScroll = () => {
    const currentDate = new Date().getTime();
    const currentTime = currentDate - startDate;

    container.scrollTo(
      0,
      easeInOutQuad({
        currentTime,
        start,
        change,
        duration,
      })
    );

    if (currentTime < duration) {
      requestAnimationFrame(animateScroll);
    } else {
      container.scrollTo(0, to);
      callback();
    }
  };
  animateScroll();
};

const scrollToX = (duration, to, container = window, callback = () => {}) => {
  const start = container instanceof HTMLElement ? container.scrollLeft : container.scrollX;

  const change = to - start;
  const startDate = new Date().getTime();

  const animateScroll = () => {
    const currentDate = new Date().getTime();
    const currentTime = currentDate - startDate;

    container.scrollTo(
      easeInOutQuad({
        currentTime,
        start,
        change,
        duration,
      }),
      0
    );

    if (currentTime < duration) {
      requestAnimationFrame(animateScroll);
    } else {
      container.scrollTo(to, 0);
      callback();
    }
  };
  animateScroll();
};

const scrollToXY = (duration, x, y, container = window, callback = () => {}) => {
  const startX = container instanceof HTMLElement ? container.scrollLeft : container.scrollX;
  const startY = container instanceof HTMLElement ? container.scrollTop : container.scrollY;

  const changeX = x - startX;
  const changeY = y - startY;
  const startDate = Date.now();

  const animateScroll = () => {
    const currentDate = Date.now();
    const currentTime = currentDate - startDate;

    container.scrollTo(
      easeInOutQuad({
        currentTime,
        start: startX,
        change: changeX,
        duration,
      }),
      easeInOutQuad({
        currentTime,
        start: startY,
        change: changeY,
        duration,
      })
    );

    if (currentTime < duration) {
      requestAnimationFrame(animateScroll);
    } else {
      container.scrollTo(x, y);
      callback();
    }
  };
  animateScroll();
};

const isElementScrollable = (element) => {
  if (!element) return false;
  const { overflowX, overflowY } = getComputedStyle(element);
  const isScrollableX = element.scrollWidth > element.clientWidth && overflowX !== "visible";
  const isScrollableY = element.scrollHeight > element.clientHeight && overflowY !== "visible";

  return isScrollableX || isScrollableY;
};

function getElementPosition(element) {
  const box = element.getBoundingClientRect();

  const body = document.body;
  const docEl = document.documentElement;

  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  const clientTop = docEl.clientTop || body.clientTop || 0;
  const clientLeft = docEl.clientLeft || body.clientLeft || 0;

  const top = box.top + scrollTop - clientTop;
  const left = box.left + scrollLeft - clientLeft;

  return { top: Math.round(top), left: Math.round(left) };
}

const getElementOffset = (el) => {
  const rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const debounce = (callback, wait = 1) => {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, wait);
  };
};

const findAllScrollableParents = (element) => {
  const scrollableParents = [];
  let parent = element.parentElement;

  while (parent) {
    const style = window.getComputedStyle(parent);
    const overflowY = style.getPropertyValue("overflow-y");

    if (overflowY === "auto" || overflowY === "scroll") {
      scrollableParents.push(parent);
    }

    parent = parent.parentElement;
  }

  // Check if the document element is a scrollable container (window)
  if (document.scrollingElement) {
    scrollableParents.push(document.scrollingElement);
  }
  scrollableParents.push(window);

  return scrollableParents;
};

const findCurrentlyAllScrollableParents = (element) => {
  const scrollableParents = [];
  let parent = element.parentElement;

  while (parent) {
    const style = window.getComputedStyle(parent);
    const overflowY = style.getPropertyValue("overflow-y");

    if ((overflowY === "auto" || overflowY === "scroll") && parent.scrollHeight > parent.clientHeight) {
      scrollableParents.push(parent);
    }

    parent = parent.parentElement;
  }
  parent = document.scrollingElement;
  const style = window.getComputedStyle(document.scrollingElement);
  const overflowY = style?.getPropertyValue("overflow-y");

  if ((overflowY === "auto" || overflowY === "scroll") && parent.scrollHeight > parent.clientHeight) {
    scrollableParents.push(document.scrollingElement);
  }

  return scrollableParents;
};

const handlelize = (str) => {
  str = str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/([^\w]+|\s+)/g, "-") // Replace space and other characters by hyphen
    .replace(/--+/g, "-") // Replaces multiple hyphens by one hyphen
    .replace(/(^-+|-+$)/g, "") // Remove extra hyphens from beginning or end of the string
    .toLowerCase(); // To lowercase

  return str;
};

const serializeForm = (formElement) => {
  const obj = {};
  const formData = new FormData(formElement);
  for (const key of formData.keys()) {
    obj[key] = formData.get(key);
  }
  return obj;
};

const deepEqual = (a, b) => {
  if (a === b) return true;

  if (a && b && typeof a === "object" && typeof b === "object") {
    if (a.constructor !== b.constructor) return false;

    let length, i, keys;
    if (Array.isArray(a)) {
      length = a.length;
      // eslint-disable-next-line eqeqeq
      if (length != b.length) return false;
      for (i = length; i-- !== 0; ) if (!deepEqual(a[i], b[i])) return false;
      return true;
    }

    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

    // eslint-disable-next-line prefer-const
    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;

    for (i = length; i-- !== 0; ) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (i = length; i-- !== 0; ) {
      const key = keys[i];

      if (!deepEqual(a[key], b[key])) return false;
    }

    return true;
  }

  // true if both NaN, false otherwise
  return a !== a && b !== b;
};

window.clsx = clsx;

const isVisible = (elem, isParent = false) => {
  if (!(elem instanceof Element)) {
    return false;
  }
  const style = getComputedStyle(elem);
  if (style.display === "none") return false;
  if (!isParent && style.pointerEvents === "none") return false;
  if (style.visibility !== "visible") return false;
  if (+style.opacity < 0.1) return false;
  if (elem.offsetWidth + elem.offsetHeight + elem.getBoundingClientRect().height + elem.getBoundingClientRect().width === 0) {
    return false;
  }
  if (elem.parentElement) {
    return isVisible(elem.parentElement, true);
  }
  return true;
};

const isInViewport = (element) => {
  const { y } = element.getBoundingClientRect();
  if (y > window.innerHeight || y < 0) {
    return false;
  }
  return true;
};

const isElementVisiblyOnTop = (element) => {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const topElement = document.elementFromPoint(centerX, centerY);

  return element === topElement || element.contains(topElement);
};

const isElementFullyVisible = (el) => isInViewport(el) && isElementVisiblyOnTop(el);

const unwrapNestedBlocksSimple = (html) => {
  if (typeof html !== "string") {
    return html;
  }
  return (
    html?.replace(
      /<(?<outer>p|h[1-6])[^>]*>\s*<(?<inner>\k<outer>)[^>]*>((?:.|\n)*?)<\/\k<inner>>\s*<\/\k<outer>>/gi,
      "<$<inner>>$3</$<inner>>"
    ) ?? ""
  );
};

const applyInlinePluralization = (content) => {
  let replaced = content;

  // Step 1: Direct "number word{...}" matches
  replaced = replaced.replace(/(\d+)\s+([a-zA-Z]+)\{([^{}|]+)(?:\|([^{}|]+))?\}/g, (_, number, base, singular, plural) => {
    const count = parseInt(number, 10);
    return plural === undefined
      ? `${number} ${base}${count === 1 ? "" : singular}`
      : `${number} ${count === 1 ? base + singular : base + plural}`;
  });

  // Step 2: Fallback for lone word{...} — use last number before it
  replaced = replaced.replace(/([a-zA-Z]+)\{([^{}|]+)(?:\|([^{}|]+))?\}/g, (match, base, singular, plural, offset) => {
    const upToMatch = replaced.slice(0, offset);
    const matchNumber = upToMatch.match(/(\d+)(?!.*\d)/); // last number before match
    const count = matchNumber ? parseInt(matchNumber[1], 10) : 1;

    return plural === undefined ? `${base}${count === 1 ? "" : singular}` : `${count === 1 ? base + singular : base + plural}`;
  });

  return replaced;
};

const getBracketInputDynamicPluralizedText = (content, object = {}) => {
  let returnValue = "";

  returnValue =
    content?.replace(/\[([^\]]*)\]/gi, (...matches) => {
      if (!matches[1]) {
        return "";
      }
      if (/^icon\./gi.test(matches[1])) {
        return matches[0];
      }
      let result =
        // @ts-ignore
        matches?.[1]?.split(".")?.reduce(
          (acc, selector, index, arr) => {
            if (!selector || acc[0] === undefined || acc[0] === null) {
              if (/price$/gi.test(acc[1]) && typeof acc[0] === "number") {
                return [utils.formatMoney(acc[0]), selector];
              }
              if (/_at$/gi.test(acc[1]) && Date.parse(acc[0])) {
                return [new Date(acc[0]).toLocaleDateString(), selector];
              }
              if (typeof acc[0] === "string" && acc[0].includes("®")) {
                return [acc[0].replace(/®/gi, `<sup style="font-size: 0.7em;">®</sup>`), selector];
              }

              if (Array.isArray(acc[0]) && acc[0].every((val) => typeof val === "string" || typeof val === "number")) {
                return [acc[0].join(", "), selector];
              }
              return acc;
            }

            if (acc[0] && typeof acc[0] === "object" && selector in acc[0]) {
              if (/price$/gi.test(selector) && typeof acc[0][selector] === "number") {
                return [utils.formatMoney(acc[0][selector]), selector];
              }
              if (/_at$/gi.test(selector) && Date.parse(acc[0][selector])) {
                if (arr[index + 1]) {
                  return [window.dayjs(acc[0][selector])?.format(arr[index + 1]), selector];
                }
                return [new Date(acc[0][selector]).toLocaleDateString(), selector];
              }
              if (typeof acc[0][selector] === "string" && acc[0][selector].includes("®")) {
                return [acc[0][selector].replace(/®/gi, `<sup style="font-size: 0.7em;">®</sup>`), selector];
              }
              if (index === arr.length - 1) {
                if (
                  Array.isArray(acc[0][selector]) &&
                  acc[0][selector].every((val) => typeof val === "string" || typeof val === "number")
                ) {
                  return [acc[0][selector].join(", "), selector];
                }
              }

              return [acc[0][selector], selector];
            }
            if (selector && typeof acc[0] === "string") {
              return acc;
            }
            return ["", ""];
          },
          [object, ""]
        )?.[0] ?? "";

      if (typeof result === "string" && result?.includes("Default Title")) {
        result = result?.replace("Default Title", "");
      }
      return result;
    }) ?? "";

  return unwrapNestedBlocksSimple(applyInlinePluralization(returnValue ?? ""));
};

const getBracketInputDynamicValue = (content, object = {}) => {
  let returnValue = null;
  if (!content || typeof content !== "string") {
    return null;
  }
  content?.replace(/\[([^\]]*)\]/gi, (...matches) => {
    if (!matches[1]) {
      return returnValue;
    }

    // @ts-ignore
    returnValue = matches?.[1]?.split(".")?.reduce(
      (acc, selector) => {
        if (!selector || acc[0] === undefined || acc[0] === null) {
          if (/price$/gi.test(acc[1]) && typeof acc[0] === "number") {
            return [utils.formatMoney(acc[0]), selector];
          }
          if (/_at$/gi.test(acc[1]) && Date.parse(acc[0])) {
            return [new Date(acc[0]).toLocaleDateString(), selector];
          }
          if (typeof acc[0] === "string" && acc[0].includes("®")) {
            return [acc[0].replace(/®/gi, `<sup style="font-size: 0.7em;">®</sup>`), selector];
          }
          return acc;
        }

        if (acc[0] && selector in acc[0]) {
          if (/price$/gi.test(selector) && typeof acc[0][selector] === "number") {
            return [utils.formatMoney(acc[0][selector]), selector];
          }
          if (/_at$/gi.test(selector) && Date.parse(acc[0][selector])) {
            return [new Date(acc[0][selector]).toLocaleDateString(), selector];
          }
          if (typeof acc[0][selector] === "string" && acc[0][selector].includes("®")) {
            return [acc[0][selector].replace(/®/gi, `<sup style="font-size: 0.7em;">®</sup>`), selector];
          }
          return [acc[0][selector], selector];
        }
        return ["", ""];
      },
      [object, ""]
    )?.[0];
    return "";
  });

  return unwrapNestedBlocksSimple(returnValue ?? "");
};

function unescape(htmlStr) {
  htmlStr = htmlStr.replace(/&lt;/g, "<");
  htmlStr = htmlStr.replace(/&gt;/g, ">");
  htmlStr = htmlStr.replace(/&quot;/g, '"');
  htmlStr = htmlStr.replace(/&#39;/g, "'");
  htmlStr = htmlStr.replace(/&amp;/g, "&");
  return htmlStr;
}

function setUniformHeightById(id) {
  // Get all elements with the specified ID
  const elements = document.querySelectorAll(`[data-style-id="${id}"]`);

  // If there are no elements with the given ID, do nothing
  if (elements.length === 0) {
    return;
  }

  // Calculate the maximum height
  let maxHeight = 0;
  elements.forEach((element) => {
    // Reset height to auto to correctly measure the height if it was previously set
    element.style.height = "auto";
    const elementHeight = element.offsetHeight;
    if (elementHeight > maxHeight) {
      maxHeight = elementHeight;
    }
  });

  // Set all elements to the maximum height
  elements.forEach((element) => {
    element.style.height = `${maxHeight}px`;
  });
}

const setCookie = (cookieName, cookieValue, cookieMinutes = 60 * 24) => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }
  const d = new Date();
  d.setTime(d.getTime() + cookieMinutes * 60 * 1000); // Set the cookie expiration time (cookieLifespan is in days).
  const expires = d.toUTCString();
  document.cookie = `${cookieName}=${cookieValue};expires=${expires};path=/;SameSite=Strict;`;
  return true;
};

const getCookie = (cookieName) => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }

  const name = `${cookieName}=`;
  const cookieArray = document.cookie.split(";"); // Split the document's cookie string into an array.
  for (let i = 0; i < cookieArray.length; i++) {
    // For every cookie in the array.
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === " ") {
      // Remove any space from the start of the cookie name.
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length); // Return the value of the cookie.
    }
  }
  return false; // Return false if there were no matching cookies.
};

const checkCookie = (cookieName) => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }
  return !!cookieName && document.cookie.includes(`${cookieName}=`); // Return true if the requested cookie name exists in the document.
};

const removeCookie = (cookieName) => {
  setCookie(cookieName, "", -1); // Cause the browser to remove the cookie by setting its expiration to a date in the past.
};

const focusSelectorString = `:not(.placeholder) a[href]:not(:where([disabled],[tabindex="-1"])),
              :not(.placeholder) button:not(:where([disabled],[tabindex="-1"])),
              :not(.placeholder) textarea:not(:where([disabled],[tabindex="-1"])),
              :not(.placeholder) input[type="text"]:not(:where([disabled],[tabindex="-1"])),
              :not(.placeholder) input[type="radio"]:not(:where([disabled],[tabindex="-1"])),
              :not(.placeholder) input[type="checkbox"]:not(:where([disabled],[tabindex="-1"])),
              :not(.placeholder) select:not(:where([disabled],[tabindex="-1"])),
              :not(.placeholder, [tabindex="-1"]) [tabindex]:not(:where([disabled],[tabindex="-1"])`;

const getHeaderHeight = () => {
  return Math.max(utils.roundToIndex(document.querySelector("[data-navigation-bar]")?.getBoundingClientRect().bottom, -2), 0);
};

const initYouTube = async () => {
  if (!window.YT && !window._youtube_initialized) {
    window._youtube_initialized = true;
    await new Promise((resolve) => {
      if (!window.onYouTubeIframeAPIReady) {
        window.onYouTubeIframeAPIReady = () => {
          resolve(true);
          document.dispatchEvent(new CustomEvent("youtube-loaded"));
        };
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
    });
  }
};

const simulateAnchorTag = ($el) => {
  if (!$el) return;
  const modalStore = window.Alpine.store("modal");

  $el.addEventListener("click", (e) => {
    if (e.target.closest("a") || !$el.getAttribute("data-href")) return;

    e.preventDefault();
    e.stopPropagation();

    if (e.button === 1 || e.ctrlKey || e.metaKey || $el.getAttribute("data-target") === "_blank") {
      window.open($el.getAttribute("data-href"), "_blank", "noopener,noreferrer");
    } else if (e.shiftKey) {
      window.open($el.getAttribute("data-href"), "_blank");
    } else {
      barba.go($el.getAttribute("data-href"));
      modalStore.setId("");
    }
  });

  $el.addEventListener("mousedown", (e) => {
    if (e.target.closest("a") || !$el.getAttribute("data-href") || e.button !== 1) return;

    if (e.ctrlKey || e.metaKey || $el.getAttribute("data-target") === "_blank") {
      window.open($el.getAttribute("data-href"), "_blank", "noopener,noreferrer");
      e.preventDefault();
    }
  });

  $el.addEventListener("keydown", (e) => {
    if (!$el.getAttribute("data-href")) return;
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();

      if ($el.getAttribute("data-target") === "_blank") {
        window.open($el.getAttribute("data-href"), "_blank", "noopener,noreferrer");
        return;
      } else {
        barba.go($el.getAttribute("data-href"));
        modalStore.setId("");
      }
    }
  });
};

const preloadImage = (src) => {
  if (!src) return true;
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
};

const applyStyles = (el, styles) => {
  Object.entries(styles).forEach(([key, value]) => {
    el.style[key] = value;
  });
};

const richtextWithPrices = (content, price = 0, compare_at_price = 0) => {
  if (!content) return content ?? "";

  return (
    content
      ?.replace(
        "[price|no-decimals]",
        utils.formatMoney(price, window?.money_format?.replace(/\{(\s*)amount(\s*)}/gi, "{$1amount_no_decimals$2}"))
      )
      ?.replace("[price]", utils.formatMoney(price))
      ?.replace(
        "[compare_at_price|no-decimals]",
        compare_at_price > price
          ? `<span style='text-decoration: line-through; opacity: 0.5;'>${utils.formatMoney(
              compare_at_price,
              window?.money_format?.replace(/\{(\s*)amount(\s*)}/gi, "{$1amount_no_decimals$2}")
            )}</span>`
          : ""
      )
      ?.replace(
        "[compare_at_price]",
        compare_at_price > price
          ? `<span style='text-decoration: line-through; opacity: 0.5;'>${utils.formatMoney(compare_at_price)}</span>`
          : ""
      ) ?? ""
  );
};

const validateFormAndToast = (formEl) => {
  const inputs = formEl.querySelectorAll("input, textarea, select");
  let firstInvalid = null;

  for (const input of inputs) {
    // Reset any prior custom errors
    input.setCustomValidity("");

    if (input.disabled) continue;

    const value = input.value.trim();
    const label = input.getAttribute("aria-label") || input.name || "This field";

    // Required field check
    if (input.hasAttribute("required") && !value) {
      _stores.toast.addToast({
        type: "error",
        target: "generic",
        title: "We've encountered a problem.",
        content: `${label} is required.`,
        timestamp: Date.now(),
      });
      input.setCustomValidity("Required");
      firstInvalid = firstInvalid || input;
      continue;
    }

    // Email format check
    if (
      (input.type === "email" || input.getAttribute("data-type") === "email") &&
      value &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
    ) {
      _stores.toast.addToast({
        type: "error",
        target: "generic",
        title: "We've encountered a problem.",
        content: `${label} must be a valid email address.`,
        timestamp: Date.now(),
      });
      input.setCustomValidity("Invalid");
      firstInvalid = firstInvalid || input;
    }
  }

  if (firstInvalid) {
    firstInvalid.reportValidity(); // Optional: show browser error indicator
    firstInvalid.scrollIntoView({ behavior: "instant", block: "start" });
    setTimeout(() => {
      window.scrollBy({ top: -230, behavior: "instant" });
    }, 10);
    firstInvalid.focus();
    return false;
  }

  return true;
};

const normalizePhoneInput = (input) =>
  input
    ?.replace(/[^\d+]/g, "")
    ?.replace(/^00/, "+")
    ?.replace(/^0+/, "");

const getShopifyCacheUrl = (href) => {
  try {
    const url = new URL(href);
    const searchParams = [];
    // @ts-ignore
    for (const [key, value] of url.searchParams) {
      if (key === "page") {
        searchParams.push(`${key}=${value}`);
      }
      if (key === "sort_by") {
        searchParams.push(`${key}=${value}`);
      }
      if (/^filter\./gi.test(key)) {
        searchParams.push(`${key}=${value}`);
      }
    }

    const sortedSearchParams = [...searchParams].sort();

    if (sortedSearchParams?.length) {
      return `${href?.split(/[?#&]/gi)?.[0]?.replace(/(\/collections\/[^/]*\/)/gi, "/")}?${sortedSearchParams.join("&")}`;
    }
    return href?.split(/[?#&]/gi)?.[0]?.replace(/(\/collections\/[^/]*\/)/gi, "/");
  } catch (err) {
    return href?.split(/[?#&]/gi)?.[0]?.replace(/(\/collections\/[^/]*\/)/gi, "/");
  }
};

const fetchFromCache = async (urlString, options = {}) => {
  if (!urlString.includes(window.location.origin)) {
    urlString = window.location.origin + urlString;
  }

  const url = new URL(urlString);
  const cacheUrl = getShopifyCacheUrl(urlString);

  const cachePath = url.toString().replace(window.location.origin, "");

  let cache = barba.cache.get(cacheUrl);

  if (!cache?.request) {
    const keys = await idbKeyval.keys();

    const key = keys.find((key) => key.includes(cacheUrl));

    if (key) {
      cache = barba.cache.set(cacheUrl, idbKeyval.get(key)?.then((res) => res?.data), "prefetch");
    }
  }

  if (!cache?.request) {
    const data = fetch(urlString, { cache: "force-cache", ...options })
      .then((res) => res.text())
      .then((html) => ({
        html,
        url: { hash: undefined, href: cacheUrl, path: cachePath },
      }));

    // @ts-ignore
    cache = barba.cache.set(cacheUrl, data, "prefetch");
    document.dispatchEvent(new CustomEvent("barba:prefetch:fulfilled", { detail: { url: cacheUrl } }));
  }

  let request = await cache?.request;
  let html = request?.html;

  if (!html) {
    const data = fetch(urlString, { cache: "force-cache", ...options })
      .then((res) => res.text())
      .then((html) => ({
        html,
        url: { hash: undefined, href: cacheUrl, path: cachePath },
      }));

    // @ts-ignore
    cache = barba.cache.set(cacheUrl, data, "prefetch");
    request = await cache?.request;
    html = request?.html;
    document.dispatchEvent(new CustomEvent("barba:prefetch:fulfilled", { detail: { url: cacheUrl } }));
  }

  return html;
};

const hasAlpine = new Promise((resolve) => {
  window.addEventListener("alpine:initialized", resolve, { once: true, passive: true });
});

const initializeIgnoredAlpineTree = (el) => {
  utils.hasAlpine.then(() => {
    if (el.hasAttribute("x-ignore")) {
      el.setAttribute("data-x-ignore", "");
      el.removeAttribute("x-ignore");
    }
    queueMicrotask(() => Alpine.initTree(el));
  });
};

const barbaPrefetchTargetPage = (element, url, delayMs = 2500) => {
  const abortController = new AbortController();
  let idleCallback;
  const timeout = setTimeout(() => {
    idleCallback = requestIdleCallback(() => {
      barba?.prefetch(url);
      abortController.abort();
    });
  }, delayMs);

  ["pointerenter", "pointerdown", "focusin"].forEach((event) => {
    element.addEventListener(
      event,
      () => {
        abortController.abort();
        if (timeout) clearTimeout(timeout);
        if (idleCallback) cancelIdleCallback(idleCallback);
        barba?.prefetch(url);
      },
      { signal: abortController.signal, passive: true, once: true }
    );
  });
};

const spreadGenericCardFunctions = (state) => {
  const getDynamicValue = (content) => {
    return utils.getBracketInputDynamicValue(content, state);
  };

  const getDynamicValueWithFallbacks = (content) => {
    return content.split(",")?.reduce((acc, item) => {
      acc ||= utils.getBracketInputDynamicValue(item.trim(), state);
      return acc;
    }, "");
  };

  const getDynamicText = (content) => {
    return utils.getBracketInputDynamicPluralizedText(content, state);
  };

  const getContentLabels = (key) => {
    const labels = key
      .replace(/[[\]]/gi, "")
      .split(".")
      .reduce((acc, selector) => {
        if (!selector || acc === undefined || acc === null) return acc || "";

        if (acc && selector in acc) {
          return acc[selector];
        }
        return "";
      }, state);

    if (Array.isArray(labels)) {
      return labels.filter(Boolean);
    }
    return [labels].filter(Boolean);
  };

  return {
    getDynamicValue,
    getDynamicValueWithFallbacks,
    getDynamicText,
    getContentLabels,
  };
};

const hideIfEmpty = (element, hide_if_empty, isEmpty = false) => {
  switch (hide_if_empty) {
    case "none":
      break;
    case "section":
      element.closest(`.shopify-section`)?.classList.toggle("!hidden", isEmpty);
      break;
    case "container":
      element
        .closest(`[data-style-id]:not([data-style-id="${element.getAttribute("data-style-id")}"])`)
        ?.classList.toggle("!hidden", isEmpty);
      break;
    case "block":
      break;
  }
};

const fallbackHydrationQueue = new Map();

document.addEventListener("modalsLoaded", () => {
  fallbackHydrationQueue.entries().forEach(([el, type]) => {
    hydrateCardContent(el, type);
  });
  fallbackHydrationQueue.clear();
});

const hydrateCardContent = ($el, cardType) => {
  const node = document.querySelector(`[data-${cardType}-card='${$el.getAttribute(`data-card-handle`)}']`)?.cloneNode(true);

  if (!node) {
    fallbackHydrationQueue.set($el, cardType);
    return;
  }

  const object_handle = $el.getAttribute(`data-${cardType}-handle`);
  const object_id = $el.getAttribute(`data-${cardType}-id`);
  const addon_target_product = $el.getAttribute("data-addon-product-target");

  if (addon_target_product) {
    node.setAttribute("data-addon-product-target", addon_target_product);
    if ($el.hasAttribute("data-addon-auto-add")) node.setAttribute("data-addon-auto-add", "");
    if ($el.hasAttribute("data-addon-cart-bundle")) node.setAttribute("data-addon-cart-bundle", "");
  }

  node.removeAttribute(`data-${cardType}-card`);
  node.setAttribute(`data-${cardType}-handle`, object_handle);
  node.setAttribute(`data-${cardType}-id`, object_id);
  node.querySelectorAll("[data-loop-item], [data-x-if], style").forEach((el) => el.remove());
  node.querySelectorAll("[data-x-ignore]").forEach((el) => el.setAttribute("x-ignore", ""));
  node.querySelectorAll("[x-defer-active]").forEach((el) => el.removeAttribute("x-defer-active"));
  node.removeAttribute("x-defer-active");

  node.classList.add("card-loading", ...utils.JSONParse($el.getAttribute(`data-card-classes`) ?? "[]"));
  $el.parentNode?.replaceChild(node, $el);
};

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting && entry.target instanceof HTMLElement) {
        utils.hydrateCardContent(entry.target, entry.target.getAttribute("data-card-type"));
        observer.unobserve(entry.target);
      }
    }
  },
  { rootMargin: "300px 300px 300px 300px" }
);

const hydrateCard = (cardType) => {
  return ($el) => {
    if ($el.hasAttribute("data-intersected")) {
      utils.hydrateCardContent($el, cardType);
      return;
    }

    $el.setAttribute("data-card-type", cardType);
    observer.observe($el);
  };
};

const hydrateImages = (show, element) => {
  if (show) {
    element.querySelectorAll("img[data-src]").forEach((img) => {
      const src = img.getAttribute("data-src");
      const srcset = img.getAttribute("data-srcset");
      if (srcset) {
        img.setAttribute("srcset", srcset);
        img.removeAttribute("data-srcset");
      }
      if (src) {
        img.setAttribute("src", src);
        img.removeAttribute("data-src");
      }
    });
  }
};

const truncateChildren = (element, container) => {
  const children = [...container.children];
  if (children.at(-2)?.offsetLeft + children.at(-2)?.clientWidth < container.clientWidth) {
    return children.length - 2;
  }
  return (
    children.findIndex(
      (childElement) =>
        childElement.offsetLeft +
          childElement.clientWidth +
          element.clientWidth +
          +getComputedStyle(container).gap.replace("px", "") +
          15 >
        container.clientWidth
    ) - 1
  );
};

const utils = {
  hasAlpine,
  initializeIgnoredAlpineTree,
  normalizePhoneInput,
  initYouTube,
  simulateAnchorTag,
  clsx,
  getImageSrcSet,
  JSONParse,
  getSiblingUrl,
  getHeaderHeight,
  unescape,
  getShopifyCacheUrl,
  validateFormAndToast,
  richtextWithPrices,
  applyStyles,
  preloadImage,
  setCookie,
  getCookie,
  checkCookie,
  removeCookie,
  isVisible,
  isInViewport,
  getReviewStarGradients,
  transpileRichtextMetafield,
  handlelize,
  delay,
  debounce,
  scrollToY,
  scrollToX,
  scrollToXY,
  isElementScrollable,
  checkDomain,
  isExternalURL,
  getElementPosition,
  applyInlinePluralization,
  getBracketInputDynamicPluralizedText,
  getBracketInputDynamicValue,
  spreadGenericCardFunctions,
  deepEqual,
  getElementOffset,
  shortUUID,
  serializeForm,
  roundToIndex,
  formatMoney,
  findAllScrollableParents,
  findCurrentlyAllScrollableParents,
  isEmail,
  pushSearchParams,
  replaceSearchParams,
  pushUrlTarget,
  setUniformHeightById,
  fetchFromCache,
  focusSelectorString,
  isElementVisiblyOnTop,
  isElementFullyVisible,
  initContentSlider,
  initCollapsible,
  barbaPrefetchTargetPage,
  hideIfEmpty,
  hydrateCardContent,
  hydrateCard,
  hydrateImages,
  truncateChildren,
};

export default utils;

// @ts-ignore
window.utils = utils;
document.dispatchEvent(new CustomEvent("theme:utils:loaded"));

/* LAST HASH: 565ae5d6cf5d9f5cd1a7943dd800fd57f77f90d3 */
