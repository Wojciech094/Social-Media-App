import { LAZY_LOAD_CLASSNAME } from "../constants";

// The callback function to execute when an image intersects
interface LazyLoadImage extends HTMLImageElement {
  dataset: {
    src: string;
    [key: string]: string;
  };
}

/**
 * Handles the intersection events for lazy-loading images.
 *
 * This function is intended to be used as a callback for an `IntersectionObserver`
 * monitoring images that should be lazy-loaded. When an image enters the viewport,
 * its `src` attribute is set from the `data-src` attribute, the lazy-load class is removed,
 * and the observer stops observing the image.
 *
 * @param entries - An array of `IntersectionObserverEntry` objects representing the observed elements.
 * @param observer - The `IntersectionObserver` instance observing the images.
 */
export function handleImgIntersection(
  entries: IntersectionObserverEntry[] = [],
  observer: IntersectionObserver
): void {
  entries.forEach((entry) => {
    // Check if the element is intersecting (i.e., is in the viewport)
    if (entry.isIntersecting) {
      const image = entry.target as LazyLoadImage;

      // Take the URL from data-src and put it in the src attribute
      image.src = image.dataset.src;

      // The image is now loading. We can remove the class.
      image.classList.remove(LAZY_LOAD_CLASSNAME);

      // Stop observing this image, as our job is done.
      observer.unobserve(image);
    }
  });
}

export function lazyLoadImgs(
  className = LAZY_LOAD_CLASSNAME,
  threshold = "15%"
) {
  const lazyImages = document.querySelectorAll(`.${className}`);

  const observerOptions = {
    root: null, // use the viewport
    rootMargin: `0px 0px ${threshold} 0px`, // trigger 200px before it enters viewport
  };

  const observer = new IntersectionObserver(
    handleImgIntersection,
    observerOptions
  );

  lazyImages.forEach((image) => observer.observe(image));
}
