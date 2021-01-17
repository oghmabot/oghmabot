export const calculateTimeBetween = (a: number, b: number): number => Math.abs(a - b) * 1000;

export const convertMillisecondsToTimestamp = (m: number): string => new Date(m).toISOString().substr(11, 8);

