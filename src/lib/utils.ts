import { invoke } from "@tauri-apps/api/core";
import { type ClassValue, clsx } from "clsx";
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
  let ts = timestamp;
  // Convert seconds to milliseconds if needed
  if (ts < 10000000000) {
    ts *= 1000;
  }
  const now = Date.now();
  const diffInSeconds = Math.floor((now - ts) / 1000);

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
    if (Number.isNaN(timestamp)) {
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
    if (Number.isNaN(date.getTime())) {
      throw new Error("Invalid date string");
    }

    return dtf.format(date);
  } catch (error) {
    console.error("Error prettifying date string:", error);
    return "Invalid date";
  }
}
export async function computePartialFileHash(
  filePath: string,
  file: Uint8Array,
) {
  // try to hash with rust
  const chunkSize = 16 * 1024;
  try {
    const hash = await invoke<string>("partial_file_hash", {
      filePath,
      chunkSize,
    });
    if (hash && hash.length > 0) {
      return hash;
    }
  } catch (error) {
    console.error("Failed to hash file with Rust:", error);
  }

  // hash with js
  const first = file.slice(0, chunkSize);
  const last = file.slice(-chunkSize);
  const combined = new Uint8Array(first.length + last.length);
  combined.set(first);
  combined.set(last, first.length);

  const hashBuffer = await crypto.subtle.digest("SHA-256", combined.buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
