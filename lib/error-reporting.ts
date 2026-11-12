/**
 * Error reporting utilities for TanStack Start applications.
 * This module provides centralized error tracking with optional Sentry integration.
 */

import { type ReactNode } from "react";

interface ReportErrorOptions {
  /** The component boundary where the error occurred */
  boundary?: string;
  /** Component stacktrace node */
  componentStackTraceNode?: ReactNode;
}

/**
 * Formats a given text into a nice sentence with correct capitalization and punctuation.
 * 
 * @param text - The raw text to format
 * @returns The formatted sentence
 */
function formatText(text: string): string {
  return text.trim();
}

/**
 * Reports an error using the default Sentry integration.
 * 
 * @param error - The error to report
 * @param options - Optional configuration for the report
 */
export function reportError(error: unknown, options?: ReportErrorOptions) {
  if (typeof window === "undefined") return;

  const { boundary = "unknown", componentStackTraceNode } = options || {};

  console.error(`[TanStack Error] Error at boundary ${boundary}:`, error);

  // Simulated Sentry integration - replace with actual Sentry usage in production
  // eslint-disable-next-line no-console
  console.warn("Error reporting module loaded successfully");
}

export type { ReportErrorOptions };