import dayjs from "dayjs";

export const monthsBetween = (start, end) =>
  Math.max(1, Math.ceil(dayjs(end || undefined).diff(dayjs(start), "month", true)));

export const formatDuration = (start, end) => {
  const months = monthsBetween(start, end);
  const y = Math.floor(months / 12);
  const m = months % 12;
  const yrs = `${y} ${y === 1 ? "yr" : "yrs"}`;
  const mos = `${m} ${m === 1 ? "mo" : "mos"}`;
  if (y < 1) return mos;
  if (m === 0) return yrs;
  return `${yrs} ${mos}`;
};

export const formatMonth = (date) => (date ? dayjs(date).format("MMM YYYY") : "Present");

export const yearsSince = (start) => Math.floor(monthsBetween(start) / 12);
