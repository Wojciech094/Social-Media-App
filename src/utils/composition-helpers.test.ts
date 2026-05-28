import { describe, it, expect } from "vitest";
import { compose, pipe } from "./composition-helpers";

describe("compose", () => {
  it("should compose two functions (right-to-left)", () => {
    const add1 = (x: number) => x + 1;
    const double = (x: number) => x * 2;
    const composed = compose(double, add1); // double(add1(x))
    expect(composed(3)).toBe(8); // double(add1(3)) = double(4) = 8
  });

  it("should compose multiple functions (right-to-left)", () => {
    const add1 = (x: number) => x + 1;
    const double = (x: number) => x * 2;
    const square = (x: number) => x * x;
    const composed = compose(square, double, add1); // square(double(add1(x)))
    expect(composed(2)).toBe(36); // square(double(add1(2))) = square(double(3)) = square(6) = 36
  });

  it("should return the same value if no functions are provided", () => {
    const composed = compose();
    expect(composed(42)).toBe(42);
    expect(composed("test")).toBe("test");
  });

  it("should work with functions returning different types", () => {
    const toString = (x: number) => x.toString();
    const appendHello = (s: string) => `Hello, ${s}!`;
    const composed = compose(appendHello, toString);
    expect(composed(5)).toBe("Hello, 5!");
  });
});

describe("pipe", () => {
  it("should pipe two functions (left-to-right)", () => {
    const add1 = (x: number) => x + 1;
    const double = (x: number) => x * 2;
    const piped = pipe(add1, double); // double(add1(x))
    expect(piped(3)).toBe(8); // double(add1(3)) = double(4) = 8
  });

  it("should pipe multiple functions (left-to-right)", () => {
    const add1 = (x: number) => x + 1;
    const double = (x: number) => x * 2;
    const square = (x: number) => x * x;
    const piped = pipe(add1, double, square); // square(double(add1(x)))
    expect(piped(2)).toBe(36); // square(double(add1(2))) = square(double(3)) = square(6) = 36
  });

  it("should return the same value if no functions are provided in pipe", () => {
    const piped = pipe();
    expect(piped(42)).toBe(42);
    expect(piped("test")).toBe("test");
  });

  it("should work with functions returning different types in pipe", () => {
    const toString = (x: number) => x.toString();
    const appendHello = (s: string) => `Hello, ${s}!`;
    const piped = pipe(toString, appendHello);
    expect(piped(5)).toBe("Hello, 5!");
  });
});
