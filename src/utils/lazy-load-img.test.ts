import { describe, it, expect, vi, beforeEach } from "vitest";
import { handleImgIntersection } from "./lazy-load-img";
import { LAZY_LOAD_CLASSNAME } from "../constants";

describe("handleImgIntersection", () => {
  let mockObserver: IntersectionObserver;
  let unobserveMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    unobserveMock = vi.fn();
    mockObserver = {
      unobserve: unobserveMock,
    } as unknown as IntersectionObserver;
  });

  it("should set src from data-src, remove lazy class, and unobserve when intersecting", () => {
    const mockImg = document.createElement("img");
    mockImg.classList.add(LAZY_LOAD_CLASSNAME);
    mockImg.dataset.src = "https://example.com/image.jpg";
    const entry = {
      isIntersecting: true,
      target: mockImg,
    } as unknown as IntersectionObserverEntry;

    handleImgIntersection([entry], mockObserver);

    expect(mockImg.src).toContain("https://example.com/image.jpg");
    expect(mockImg.classList.contains(LAZY_LOAD_CLASSNAME)).toBe(false);
    expect(unobserveMock).toHaveBeenCalledWith(mockImg);
  });

  it("should do nothing if not intersecting", () => {
    const mockImg = document.createElement("img");
    mockImg.classList.add(LAZY_LOAD_CLASSNAME);
    mockImg.dataset.src = "https://example.com/image.jpg";
    const entry = {
      isIntersecting: false,
      target: mockImg,
    } as unknown as IntersectionObserverEntry;

    handleImgIntersection([entry], mockObserver);

    expect(mockImg.src).not.toContain("https://example.com/image.jpg");
    expect(mockImg.classList.contains(LAZY_LOAD_CLASSNAME)).toBe(true);
    expect(unobserveMock).not.toHaveBeenCalled();
  });

  it("should handle multiple entries", () => {
    const img1 = document.createElement("img");
    img1.classList.add(LAZY_LOAD_CLASSNAME);
    img1.dataset.src = "https://example.com/1.jpg";
    const img2 = document.createElement("img");
    img2.classList.add(LAZY_LOAD_CLASSNAME);
    img2.dataset.src = "https://example.com/2.jpg";

    const entries = [
      {
        isIntersecting: true,
        target: img1,
      } as unknown as IntersectionObserverEntry,
      {
        isIntersecting: false,
        target: img2,
      } as unknown as IntersectionObserverEntry,
    ];

    handleImgIntersection(entries, mockObserver);

    expect(img1.src).toContain("https://example.com/1.jpg");
    expect(img1.classList.contains(LAZY_LOAD_CLASSNAME)).toBe(false);
    expect(unobserveMock).toHaveBeenCalledWith(img1);

    expect(img2.src).not.toContain("https://example.com/2.jpg");
    expect(img2.classList.contains(LAZY_LOAD_CLASSNAME)).toBe(true);
    // img2 should not be unobserved
    expect(unobserveMock).toHaveBeenCalledTimes(1);
  });

  it("should not throw if entries array is empty", () => {
    expect(() => handleImgIntersection([], mockObserver)).not.toThrow();
    expect(unobserveMock).not.toHaveBeenCalled();
  });
});
