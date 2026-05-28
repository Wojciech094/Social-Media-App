// src/components/logoutBtn.ts
import { logout } from '../router';

export default function logoutBtn(id = 'logout-btn', label = 'Logout'): string {
  return `
    <button
      id="${id}"
      type="button"
      class="px-4 py-1.5 rounded-md bg-red-600/90 hover:bg-red-500 text-white font-medium text-sm transition-colors duration-200 cursor-pointer md:text-lg"
      aria-label="${label}"
    >
      ${label}
    </button>
  `;
}

export function initLogoutBtn(id = 'logout-btn', root?: HTMLElement) {
  const scope = root ?? document;
  const btn = scope.querySelector<HTMLButtonElement>('#' + id);
  if (!btn) return;

  btn.addEventListener('click', async (e) => {
    e.preventDefault();

    console.log('🚪 Logging out...');
    await logout(); // ✅ make sure we wait until logout finishes

    // Debug log — should print null
    console.log('🔑 Token after logout:', localStorage.getItem('accessToken'));
  });
}
