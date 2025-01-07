import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shorten(str: string, n = 5): string {
  if (str.length <= n * 2) return str;
  return `${str.slice(0, n)}...${str.slice(-n)}`;
}

const rtf = new Intl.RelativeTimeFormat("en", { style: "short" });

export function relativeTime(timestamp: number) {
  // Convert seconds to milliseconds if needed
  if (timestamp < 10000000000) {
    timestamp *= 1000;
  }
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, "second");
  }

  if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), "minute");
  }

  if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), "hour");
  }

  return rtf.format(-Math.floor(diffInSeconds / 86400), "day");
}

export function relativeDate(dateStr: string): string {
  try {
    const timestamp = Date.parse(dateStr);
    if (isNaN(timestamp)) {
      throw new Error("Invalid date string");
    }

    return relativeTime(timestamp);
  } catch (error) {
    console.error("Error parsing date string:", error);
    return "Invalid date";
  }
}

const dtf = new Intl.DateTimeFormat("en", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

export function prettifyDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date string");
    }

    return dtf.format(date);
  } catch (error) {
    console.error("Error prettifying date string:", error);
    return "Invalid date";
  }
}
