export const hourMs: number = 3600000;

export const hourUnixTime: number = Math.floor(hourMs / 1000);

export const nowUnixTime = (): number => Math.floor(Date.now() / 1000);

export const calculateTimeBetween = (a: number, b: number): number => Math.abs(a - b) * 1000;

export const convertMillisecondsToTimestamp = (ms: number): string =>
  `${Math.floor(ms / hourMs).toString().padStart(2, '0')}${new Date(ms).toISOString().substr(13, 6)}`;
