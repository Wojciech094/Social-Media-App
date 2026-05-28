import { ANALYTICS_ENDPOINT } from "../../constants";
import { post } from "../api/client";
import type { ErrorReport } from "../../types";

/**
 * Represents an error returned from an API request.
 * Extends the standard `Error` object to include an HTTP status code.
 *
 * @remarks
 * Use this class to throw or handle errors that originate from API responses,
 * allowing you to access both the error message and the associated HTTP status code.
 *
 * @example
 * ```typescript
 * try { 
        throw new ValidationError('The email address is not valid.'); 
    } catch (error) { 
        console.error(error); 
        // The console will show: 
        // ValidationError: The email address is not valid. 
        //   at ... (stack trace) 
    }
 * ```
 *
 * @extends Error
 *
 * @property statusCode - The HTTP status code associated with the error.
 */
export class ApiError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiError";
    // Add our custom property
    this.statusCode = statusCode;
  }
}

/**
 * Handles uncaught global errors by logging detailed information and sending error analytics.
 *
 * This function is intended to be used as a global error handler (e.g., assigned to `window.onerror`).
 * It logs the error details to the console and sends a generic error report to an analytics service.
 * Optionally, you can integrate with external logging services (e.g., Sentry) as needed.
 *
 * @param event - The error event or message string.
 * @param source - (Optional) The source file where the error occurred.
 * @param lineno - (Optional) The line number in the source file where the error occurred.
 * @param colno - (Optional) The column number in the source file where the error occurred.
 * @param error - (Optional) The Error object associated with the error event.
 * @returns Returns `true` to prevent the browser's default error handling.
 */
export function handleGlobalError(
  event: string | Event,
  source?: string,
  lineno?: number,
  colno?: number,
  error?: Error
) {
  console.warn("--- Global Error Caught ---");
  console.warn("Message:", event);
  console.warn("Source:", source);
  console.warn("Line:", lineno);
  console.warn("Column:", colno);
  console.warn("Error Object:", error);

  // In a real app, you would send this data to a logging service.
  // Sentry.captureException(error);
  if (typeof event === "string") {
    logErrorAnalytics(createGenericErrorReport(event));
  } else {
    logErrorAnalytics(
      createGenericErrorReport("A generic error occured in our app")
    );
  }

  // Return true to prevent the browser's default error handling (e.g., logging to console).
  return true;
}

/**
 * Handles unhandled promise rejections by logging the reason,
 * sending the error to an analytics or logging service, and
 * preventing the browser's default handling of the event.
 *
 * @param event - The PromiseRejectionEvent containing the reason for the rejection.
 */
export function catchUnhandledRejection(event: PromiseRejectionEvent) {
  console.log("--- Unhandled Promise Rejection Caught ---");
  console.log("Reason for rejection:", event.reason);

  const errorReport = createGenericErrorReport(
    event.reason.message,
    event.reason.stack
  );

  // In a real app, send the reason to a logging service.
  // Sentry.captureException(event.reason);
  logErrorAnalytics(errorReport);

  // Prevent the browser's default handling (logging to console).
  event.preventDefault();
}

/**
 * Sends an error message to an analytics endpoint for logging purposes.
 *
 * @param message - The error message to be logged.
 * @returns A promise that resolves to the response data from the analytics endpoint,
 *          or undefined if an error occurs during the request.
 *
 * @throws Will throw an error if the network request fails or the response is not OK.
 */
async function logErrorAnalytics(errorReport: ErrorReport) {
  try {
    await post(`/${ANALYTICS_ENDPOINT}`, errorReport);
  } catch (error) {
    console.log(error);
  }
}

function createGenericErrorReport(
  message: string = "No error message provided.",
  stack: string = "No stack trace available."
): ErrorReport {
  return {
    message,
    stack,
    timestamp: new Date().toISOString(),
    // In a real app, you could add more context, like the current URL or user ID
    url: window.location.href,
  };
}
