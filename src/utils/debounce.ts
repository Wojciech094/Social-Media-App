import { FUNC_ERROR_TEXT } from "../constants";

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was invoked.
 * @param {Function} func The function to debounce.
 * @param {number} wait The number of milliseconds to delay.
 * @returns {Function} Returns the new debounced function.
 * @example
 * ```
 * const debouncedSearch = debounce(searchApi, 500); 
 
debouncedSearchInput.addEventListener('keyup', (event) => { 
  // Call the debounced version instead of the original. 
  debouncedSearch(event.target.value); 
});
```
 */
export function debounce<Args extends any[]>(
  func: (...args: Args) => void,
  wait = 250
) {
  let timeoutId: ReturnType<typeof setTimeout>;

  if (typeof func != "function") {
    throw new TypeError(FUNC_ERROR_TEXT);
  }

  // The returned function is what gets called on every event.
  return function (this: any, ...args: Args) {
    // `this` and `args` are preserved from the original call.
    const context = this;

    // Clear the previous timeout to reset the timer.
    clearTimeout(timeoutId);

    // Set a new timeout.
    timeoutId = setTimeout(() => {
      // When the timeout completes, call the original function.
      func.apply(context, args);
    }, wait);
  };
}
