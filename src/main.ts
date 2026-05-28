// src/main.ts
import './style.css';
import { initRouterOnStart, renderRoute } from './router';
import {
  handleGlobalError,
  catchUnhandledRejection,
} from './services/error/error';

// SPA navigation helper
function navigateTo(path: string) {
  history.pushState({ path }, '', path);
  renderRoute(path); // router handles protected routes & page scripts
}

// Initialize the app
initRouterOnStart(); // router handles protected routes on startup

// Global error handlers
window.onerror = handleGlobalError;
window.addEventListener('unhandledrejection', catchUnhandledRejection);

// Handle browser Back/Forward
window.addEventListener('popstate', (event) => {
  const path = event.state?.path || window.location.pathname;
  renderRoute(path);
});

// SPA internal link handling
document.body.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  const anchor = target.closest(
    'a[href^="/"], a[data-link]'
  ) as HTMLAnchorElement | null;

  if (anchor) {
    const href = anchor.getAttribute('href');
    if (
      href &&
      href.startsWith('/') &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.shiftKey &&
      event.button === 0
    ) {
      event.preventDefault();
      navigateTo(href);
    }
  }
});
