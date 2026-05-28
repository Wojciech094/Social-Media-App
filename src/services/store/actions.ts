import { renderRoute } from "../../router";
import type { User } from "../../types";
import { state } from "./store";

// We'll pass our router instance here so actions can trigger re-renders.
export function login(user: User): void {
  if (state.auth) {
    state.auth.isLoggedIn = true;
    state.auth.user = user;
  }

  renderRoute(); // The magic! Re-render the current page.
}

export function logout() {
  if (state.auth) {
    state.auth.isLoggedIn = false;
    state.auth.user = null;
  }
  renderRoute(); // Re-render again.
}
