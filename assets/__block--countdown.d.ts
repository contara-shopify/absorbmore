import type { CountdownBlock } from "./_blocks.js";
declare const initCountDownTimer: ($el: HTMLElement, { type, end_date, end_time, timezone, duration_offset_hours, auto_refresh_hours, content, timer_expired_message, hide_if_expired, block_id, }: CountdownBlock["settings"] & {
    block_id: string;
}) => {
    countdown: any;
};
export type InitCountDownTimer = typeof initCountDownTimer;
export {};
