import { followUser, getProfileWithFollowing } from '../services/api/follow';

function showToast(
  message: string,
  type: 'success' | 'error' = 'error',
  duration = 3000
) {
  const toast = document.createElement('div');
  toast.textContent = message;

  // Base styles
  toast.style.position = 'fixed';
  toast.style.bottom = '75px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.padding = '12px 20px';
  toast.style.borderRadius = '12px';
  toast.style.color = 'white';
  toast.style.fontSize = '14px';
  toast.style.fontWeight = '500';
  toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
  toast.style.zIndex = '9999';
  toast.style.opacity = '0';
  toast.style.transition = 'opacity 0.3s, transform 0.3s';

  if (type === 'success') {
    toast.style.backgroundColor = '#4CAF50'; // Green
  } else if (type === 'error') {
    toast.style.backgroundColor = '#F44336'; // Red
  }

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    toast.addEventListener('transitionend', () => toast.remove());
  }, duration);
}

export async function initFollowButtons() {
  const buttons =
    document.querySelectorAll<HTMLButtonElement>('[data-follow-btn]');

  for (const btn of buttons) {
    const username = btn.getAttribute('data-username');
    if (!username) continue;

    try {
      const profile = await getProfileWithFollowing(username);
      const isFollowed = profile?.isFollowing || false;

      btn.dataset.followed = isFollowed.toString();
      btn.textContent = isFollowed ? 'Following' : 'Follow';
    } catch (err) {
      console.warn(`Could not check follow status for ${username}`, err);
    }
  }

  document.addEventListener('click', async (e: MouseEvent) => {
    const target = (e.target as HTMLElement)?.closest<HTMLButtonElement>(
      '[data-follow-btn]'
    );
    if (!target) return;

    const username = target.getAttribute('data-username');
    if (!username) return;

    const isFollowed = target.dataset.followed === 'true';

    if (isFollowed) {
      showToast('You are already following this profile');
      return;
    }

    target.disabled = true;
    target.textContent = 'Following…';

    try {
      const success = await followUser(username);

      if (success) {
        target.dataset.followed = 'true';
        target.textContent = 'Following';

        const followersEl = document.querySelector('[data-followers-count]');
        if (followersEl) {
          const current = parseInt(followersEl.textContent || '0', 10);
          followersEl.textContent = (current + 1).toString();
        }
      } else {
        target.textContent = 'Error';
        showToast('You are already following this profile');
        setTimeout(() => {
          target.textContent = 'Follow';
        }, 1500);
      }
    } catch (err: any) {
      console.error('Follow failed:', err);
      const message =
        err?.message || 'Something went wrong while trying to follow';
      showToast(message);
      target.textContent = 'Error';
    } finally {
      target.disabled = false;
    }
  });
}
