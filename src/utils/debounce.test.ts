import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { debounce } from "./debounce";
import { FUNC_ERROR_TEXT } from "../constants";

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should throw if func is not a function", () => {
    // @ts-expect-error
    expect(() => debounce(null)).toThrow(FUNC_ERROR_TEXT);
    // @ts-expect-error
    expect(() => debounce(undefined)).toThrow(FUNC_ERROR_TEXT);
    // @ts-expect-error
    expect(() => debounce(123)).toThrow(FUNC_ERROR_TEXT);
  });

  it("should call the function after the wait time", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced("a", 1);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(99);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledWith("a", 1);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should only call the function once if called multiple times rapidly", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 200);

    debounced("first");
    vi.advanceTimersByTime(100);
    debounced("second");
    vi.advanceTimersByTime(100);
    debounced("third");

    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("third");
  });

  it("should preserve the context (`this`)", () => {
    const context = { value: 42 };
    const fn = vi.fn(function (this: any) {
      return this.value;
    });
    const debounced = debounce(fn, 50);

    debounced.call(context);
    vi.advanceTimersByTime(50);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn.mock.instances[0]).toBe(context);
  });

  it("should use default wait time if not provided", () => {
    const fn = vi.fn();
    const debounced = debounce(fn);

    debounced("x");
    vi.advanceTimersByTime(249);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledWith("x");
  });
});
