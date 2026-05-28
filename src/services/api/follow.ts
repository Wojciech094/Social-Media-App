import { getToken } from './client';

const API_URL = 'https://v2.api.noroff.dev/social';

/**
 * Fetch a profile including the list of followed users, with caching.
 */
export async function getProfileWithFollowing(username: string) {
  const cacheKey = `profile_${username}`;
  const cached = localStorage.getItem(cacheKey);

  // ✅ Use cached profile if it's not older than 5 minutes
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      const cacheAge = Date.now() - parsed.timestamp;
      if (cacheAge < 5 * 60 * 1000) {
        // 5 minutes
        console.log(`🟢 Using cached profile for ${username}`);
        return parsed.data;
      }
    } catch {
      console.warn('⚠️ Invalid cache data, refetching...');
    }
  }

  const token = localStorage.getItem('accessToken') || getToken();
  const key = localStorage.getItem('apiKey');
  if (!token) {
    console.warn('⚠️ No token found — cannot fetch profile');
    return null;
  }

  try {
    console.log(`🌐 Fetching fresh profile for ${username}...`);
    const res = await fetch(`${API_URL}/profiles/${username}?_following=true`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Noroff-API-Key': `${key}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.warn(`❌ Failed to fetch profile for ${username}: ${res.status}`);
      return null;
    }

    const json = await res.json();

    // ✅ Save to cache
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        data: json.data,
        timestamp: Date.now(),
      })
    );

    return json.data;
  } catch (err) {
    console.error('Error fetching profile with following:', err);
    return null;
  }
}

/**
 * Follow a user (PUT /follow)
 */
export async function followUser(username: string): Promise<boolean> {
  const token = localStorage.getItem('accessToken') || getToken();
  const key = localStorage.getItem('apiKey');

  if (!token) {
    console.warn('⚠️ No token found — cannot follow user');
    return false;
  }

  try {
    const res = await fetch(`${API_URL}/profiles/${username}/follow`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Noroff-API-Key': `${key}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.warn(`❌ Follow failed for ${username}: ${res.status}`);
      return false;
    }

    console.log(`✅ Successfully followed ${username}`);
    // Clear cached profile after follow to refresh next time
    localStorage.removeItem(`profile_${username}`);
    return true;
  } catch (err) {
    console.error('Follow request failed:', err);
    return false;
  }
}

/**
 * Unfollow a user (PUT /unfollow)
 */
export async function unfollowUser(username: string): Promise<boolean> {
  const token = localStorage.getItem('accessToken') || getToken();
  const key = localStorage.getItem('apiKey');

  if (!token) {
    console.warn('⚠️ No token found — cannot unfollow user');
    return false;
  }

  try {
    // ✅ Ensure correct lowercase endpoint
    const res = await fetch(`${API_URL}/profiles/${username}/unfollow`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Noroff-API-Key': `${key}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.warn(`❌ Unfollow failed for ${username}: ${res.status}`);
      return false;
    }

    console.log(`✅ Successfully unfollowed ${username}`);
    // Clear cached profile after unfollow to refresh next time
    localStorage.removeItem(`profile_${username}`);
    return true;
  } catch (err) {
    console.error('Unfollow request failed:', err);
    return false;
  }
}
