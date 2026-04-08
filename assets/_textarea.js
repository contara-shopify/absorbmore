export const _textarea = {
  init: (label, { maxRows = null }) => {
    const state = Alpine.reactive({
      active: false,
      paddingLeft: "",
    });

    const textarea = label.querySelector("textarea");

    state.active = !!textarea?.value && !!label?.textContent;
    state.paddingLeft = getComputedStyle(textarea).paddingLeft;

    Alpine.nextTick(() => resizeTextarea());

    const resizeTextarea = () => {
      if (!textarea) return;

      textarea.style.height = "auto";

      const style = getComputedStyle(textarea);
      const borderTop = parseInt(style.borderTopWidth) || 0;
      const borderBottom = parseInt(style.borderBottomWidth) || 0;
      const paddingTop = parseInt(style.paddingTop) || 0;
      const paddingBottom = parseInt(style.paddingBottom) || 0;
      const lineHeight = parseInt(style.lineHeight) || 20;

      const borderHeight = borderTop + borderBottom;
      const paddingHeight = paddingTop + paddingBottom;
      const maxHeight = maxRows ? maxRows * lineHeight + borderHeight + paddingHeight : Infinity;
      const newHeight = Math.min(textarea.scrollHeight + borderHeight, maxHeight);

      textarea.style.height = `${newHeight}px`;
    };

    return {
      textarea: state,
      resizeTextarea,
    };
  },
};

window._textarea = _textarea;

/* LAST HASH: f37fc6909763caf85f30c49357c7781e67b92927 */
