import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  createHTML,
  clearNode,
  getDOMElements,
  areDOMElementPresent,
  isBrowser,
} from "./ui";

describe("createHTML", () => {
  it("creates a DOM node from a valid HTML string", () => {
    const html = "<div id='test'>Hello</div>";
    const node = createHTML(html);
    expect(node).toBeInstanceOf(HTMLElement);
    expect((node as HTMLElement).id).toBe("test");
    expect((node as HTMLElement).textContent).toBe("Hello");
  });

  it("returns null for an empty string", () => {
    expect(createHTML("")).toBeNull();
  });
});

describe("clearNode", () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = document.createElement("div");
    el.innerHTML = "<span>1</span><span>2</span>";
  });

  it("removes all child nodes", () => {
    expect(el.childNodes.length).toBe(2);
    clearNode(el);
    expect(el.childNodes.length).toBe(0);
  });

  it("does nothing if already empty", () => {
    clearNode(el);
    expect(el.childNodes.length).toBe(0);
    clearNode(el);
    expect(el.childNodes.length).toBe(0);
  });
});

describe("getDOMElements", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    container.innerHTML = `
        <div id="a"></div>
        <div id="b"></div>
        <div id="c"></div>
    `;
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("returns elements in the order of ids", () => {
    const ids = ["#a", "#b"];
    const els = getDOMElements(ids, container);
    expect(Array.isArray(els)).toBe(true);
    expect(els[0].id).toBe("a");
    expect(els[1].id).toBe("b");
  });

  it("throws if any id is not a string", () => {
    // @ts-expect-error
    expect(() => getDOMElements([1, 2], container)).toThrow(
      "All IDs must be strings"
    );
  });

  it("throws if an element is not found", () => {
    expect(() => getDOMElements(["#notfound"], container)).toThrow(
      "Element with selector '#notfound' not found in the container."
    );
  });

  it("returns false and logs error if no elements found", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = getDOMElements([], container);
    expect(result).toHaveLength(0);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe("areDOMElementPresent", () => {
  it("returns true if all elements are HTMLElements and array is not empty", () => {
    const el1 = document.createElement("div");
    const el2 = document.createElement("span");
    expect(areDOMElementPresent([el1, el2])).toBe(true);
  });

  it("returns false if array is empty", () => {
    expect(areDOMElementPresent([])).toBe(false);
  });

  it("throws if any element is not an HTMLElement", () => {
    // @ts-expect-error
    expect(() => areDOMElementPresent([{}])).toThrow(
      "All elements must be valid HTMLElements"
    );
  });

  it("throws if input is not an array", () => {
    // @ts-expect-error
    expect(() => areDOMElementPresent("not-an-array")).toThrow(
      "All elements must be valid HTMLElements"
    );
  });
});

describe("isBrowser", () => {
  it("returns true in browser-like environment", () => {
    expect(isBrowser()).toBe(true);
  });

  it("returns false if window is undefined", () => {
    const originalWindow = globalThis.window;
    // @ts-ignore
    delete globalThis.window;
    expect(isBrowser()).toBe(false);
    globalThis.window = originalWindow;
  });

  it("returns false if window.document is undefined", () => {
    const originalDocument = window.document;
    // @ts-ignore
    window.document = undefined;
    expect(isBrowser()).toBe(false);
    window.document = originalDocument;
  });
});
