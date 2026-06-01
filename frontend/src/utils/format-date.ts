// FILE: src/utils/format-date.ts

import { format, formatDistanceToNow, isPast, isToday } from "date-fns";

export function formatEventDate(dateStr: string): string {
  try {
    return format(new Date(dateStr), "EEEE, d MMMM yyyy");
  } catch {
    return dateStr;
  }
}

export function formatEventTime(dateStr: string): string {
  try {
    return format(new Date(dateStr), "h:mm a");
  } catch {
    return "";
  }
}

export function formatDateShort(dateStr: string): string {
  try {
    return format(new Date(dateStr), "d MMM");
  } catch {
    return "";
  }
}

export function formatRelative(dateStr: string): string {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return "";
  }
}

export function formatPrice(paise: number): string {
  if (!paise || paise === 0) return "Free";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(paise / 100);
}

export function isEventPast(dateStr: string): boolean {
  try {
    return isPast(new Date(dateStr));
  } catch {
    return false;
  }
}

export function isEventToday(dateStr: string): boolean {
  try {
    return isToday(new Date(dateStr));
  } catch {
    return false;
  }
}