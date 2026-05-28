/**
 * Stores a value in localStorage.
 * Automatically stringifies non-string values (objects, arrays).
 *
 * @param key - The localStorage key.
 * @param value - The value to store (string or object).
 */
export function setLocalItem(key: string, value: any): void {
  if (!key) return;

  const storedValue = typeof value === 'string' ? value : JSON.stringify(value);
  window.localStorage.setItem(key, storedValue);
}

/**
 * Retrieves and parses an item from localStorage.
 * Returns plain strings as-is, and parses JSON for objects.
 *
 * @param key - The localStorage key.
 * @returns The stored value, or null if not found or failed.
 */
export function getLocalItem<T = string | object>(key: string): T | null {
  if (!key) return null;

  const rawValue = window.localStorage.getItem(key);
  if (rawValue === null) return null;

  try {
    // Try to parse JSON (objects/arrays), fallback to string
    return JSON.parse(rawValue);
  } catch {
    return rawValue as T;
  }
}
