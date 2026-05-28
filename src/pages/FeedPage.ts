// src/pages/FeedPage.ts
import postCard from '../components/posts/postCard';
import { getAllPosts } from '../services/posts/posts';
import { api, getToken } from '../services/api/client';
import logoutBtn from '../components/logoutBtn';
import type { Post } from '../types/noroff-types';
import escHtml from '../utils/escHtml';

const AVATAR_PLACEHOLDER = '/profile.avatar.png';

// Cache posts for search and to prevent rate-limit errors
let allPosts: Post[] = [];
let lastFetchTime = 0;
const CACHE_TTL = 1000 * 60 * 2; // 2 minutes

/* ---------------------- UTILS ---------------------- */
function getUsername(): string | null {
  const n1 = localStorage.getItem('name');
  if (n1) {
    try {
      return JSON.parse(n1);
    } catch {
      return n1;
    }
  }
  const n2 = localStorage.getItem('username');
  if (n2) {
    try {
      return JSON.parse(n2);
    } catch {
      return n2;
    }
  }
  const t = getToken();
  if (!t) return null;
  try {
    const payload = JSON.parse(atob((t.split('.')[1] || '') as string));
    if (payload && typeof payload.name === 'string') return payload.name;
  } catch {}
  return null;
}

/* ---------------------- SAFE FETCH WRAPPERS ---------------------- */
async function safeGetAllPosts(): Promise<Post[]> {
  const now = Date.now();
  const cacheValid = allPosts.length > 0 && now - lastFetchTime < CACHE_TTL;

  if (cacheValid) {
    console.log('[FeedPage] Using cached posts');
    return allPosts;
  }

  try {
    const result = await getAllPosts();
    const posts = Array.isArray(result)
      ? result
      : Array.isArray((result as any)?.data)
      ? (result as any).data
      : [];

    allPosts = posts;
    lastFetchTime = now;
    return posts;
  } catch (error: any) {
    if (error.response?.status === 429) {
      console.warn('Rate limited by Noroff API — retrying in 3 seconds...');
      await new Promise((res) => setTimeout(res, 3000));
      return safeGetAllPosts(); // retry once
    }
    console.error('Error loading posts:', error);
    return [];
  }
}

async function safeGetProfile(username: string) {
  try {
    const res = await api(
      `/profiles/${encodeURIComponent(
        username
      )}?_followers=true&_following=true`
    );
    return (res as any)?.data ?? res ?? {};
  } catch (error: any) {
    if (error.response?.status === 429) {
      console.warn('Rate limited fetching profile — retrying in 3 seconds...');
      await new Promise((res) => setTimeout(res, 3000));
      return safeGetProfile(username);
    }
    console.error('Error fetching profile:', error);
    return {};
  }
}

/* ---------------------- FEED PAGE ---------------------- */
export default async function FeedPage(): Promise<string> {
  let posts: Post[] = [];
  let profile: any = {};

  posts = await safeGetAllPosts();

  const username = getUsername();
  if (username) {
    await new Promise((res) => setTimeout(res, 500)); // small delay for rate-limit safety
    profile = await safeGetProfile(username);
  }

  const avatar =
    typeof profile?.avatar === 'string'
      ? profile.avatar
      : profile?.avatar?.url || AVATAR_PLACEHOLDER;

  const avatarAlt =
    typeof profile?.avatar === 'object' && profile?.avatar?.alt
      ? profile.avatar.alt
      : 'Profile picture';

  const displayName = profile?.name || username || 'Anonymous';
  const bio = profile?.bio || 'No bio yet.';

  const followers = Array.isArray(profile?.followers)
    ? profile.followers.length
    : profile?._count?.followers ?? 0;

  const following = Array.isArray(profile?.following)
    ? profile.following.length
    : profile?._count?.following ?? 0;

  const postsCount = Array.isArray(posts) ? posts.length : 0;

  /* ---------------------- HTML ---------------------- */
  const html = `
    <div class="container fixed grid min-w-full grid-cols-5 min-h-dvh bg-gray-900">

      <!-- MOBILE NAV -->
      <div class="aside fixed bottom-0 left-0 right-0 z-30 flex justify-evenly items-center gap-5 h-16 w-full 
                  border-t border-gray-800 
                  bg-gray-900/70 backdrop-blur-md shadow-lg 
                  lg:hidden">
        <a href="/feed" class="flex items-center w-12 h-12 pl-2" title="Home / Feed">
          <img src="/Hubble.png" alt="Logo" class="w-10 h-10 object-contain [mix-blend-mode:lighten]">
        </a>
        <a href="/feed" class="flex items-center hover:text-blue-400 transition-colors duration-200" title="Feed">
          <i class="text-xl text-gray-300 cursor-pointer fa-solid fa-house-user"></i>
        </a>
        <a href="/profile" class="flex items-center hover:text-blue-400 transition-colors duration-200" title="Profile">
          <i class="text-xl text-gray-300 cursor-pointer fa-solid fa-user"></i>
        </a>
        <a href="/create" class="flex items-center hover:text-blue-400 transition-colors duration-200" title="Create">
          <i class="text-xl text-gray-300 cursor-pointer fa fa-camera"></i>
        </a>
        <div class="flex items-center">
          ${logoutBtn('logout-mobile', 'Logout')}
        </div>
      </div>

      <!-- DESKTOP SIDEBAR NAV -->
      <div class="aside hidden lg:flex flex-col h-full min-h-dvh w-64 
                  border-r border-gray-800 
                  bg-gray-800/70 backdrop-blur-md shadow-lg 
                  text-gray-300">
        <a href="/feed" class="flex items-center h-20 py-20 pl-10 w-45 shadow-white mt-10 mb-20" title="Home / Feed">
          <img src="/Hubble.png" alt="Logo" class="shadow-white [mix-blend-mode:lighten]">
        </a>
        <nav class="flex flex-col gap-7">
          <a href="/feed" class="flex items-center py-3 px-10 hover:text-blue-400 transition-colors duration-200" title="Feed">
            <i class="text-xl fa-solid fa-house-user"></i>
            <span class="text-lg font-medium pl-4">Feed</span>
          </a>
          <a href="/profile" class="flex items-center py-3 px-10 hover:text-blue-400 transition-colors duration-200" title="Profile">
            <i class="text-xl fa-solid fa-user"></i>
            <span class="text-lg font-medium pl-4">Profile</span>
          </a>
          <a href="/create" class="flex items-center py-3 px-10 hover:text-blue-400 transition-colors duration-200" title="Create">
            <i class="text-xl fa fa-camera"></i>
            <span class="text-lg font-medium pl-4">Create</span>
          </a>
        </nav>
        <div class="mt-auto px-10 pb-8">
          ${logoutBtn('logout-desktop', 'Logout')}
        </div>
      </div>

      <!-- MAIN CONTENT -->
      <div class="aside grid grid-rows-4 col-span-5 h-dvh w-full px-5 overflow-y-scroll bg-gray-900 place-items-start s:pt-10 s:px-10 lg:col-span-4 lg:px-0">
        <div class="flex flex-col items-center mt-10 top-container ">
          <div class="w-full bg-gray-850/70 backdrop-blur-sm text-center rounded-lg p-6">
            <div class="relative mx-auto w-25 h-25 sm:w-32 sm:h-32 mb-4">
              <img src="${escHtml(avatar)}" alt="${escHtml(
    avatarAlt
  )}" class="w-full h-full rounded-full object-cover border-4 border-gray-700 shadow-inner"/>
              <span class="absolute bottom-1 right-1 w-6 h-6 sm:w-7 sm:h-7 bg-green-500 border-2 border-gray-900 rounded-full animate-pulse"></span>
            </div>

            <h1 class="text-2xl sm:text-4xl font-extrabold mb-1">${escHtml(
              displayName
            )}</h1>
            <p class="text-gray-300 text-sm sm:text-base mb-4">${
              bio ? escHtml(bio) : '—'
            }</p>

            <!-- STATS -->
            <div class="flex justify-center gap-4 mb-6 flex-wrap">
                   <span class="cursor-pointer text-md bg-gray-800/50 px-4 py-2 rounded-lg hover:bg-gray-700/60 transition"><span class="text-blue-400 text-lg">👥</span> Followers: <b>${followers}</b></span>
            <span class="cursor-pointer text-md bg-gray-800/50 px-4 py-2 rounded-lg hover:bg-gray-700/60 transition"><span class="text-green-400 text-lg">⭐</span> Following: <b>${following}</b></span>
            <span class="cursor-pointer text-md bg-gray-800/50 px-4 py-2 rounded-lg hover:bg-gray-700/60 transition"><span class="text-yellow-400 text-lg">📝</span> Posts: <b>${postsCount}</b></span>
            </div>

            <!-- SEARCH -->
            <div class="w-full px-5 md:px-10 mt-6">
              <input
                type="search"
                id="feedSearch"
                placeholder="Search posts, authors, text…"
                class="w-full px-4 py-2 rounded-lg bg-white/10 ring-1 ring-white/15 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autocomplete="off"
              />
            </div>

            <!-- POSTS GRID -->
            <div
              id="feedGrid"
              class="w-full mt-6 md:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-5 md:px-10 items-start justify-items-stretch">
              ${posts.map((post, index) => postCard(post, index)).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach event handlers after render
  setTimeout(async () => {
    wireSearch();
    wireFollowerLists();
    const { initFollowButtons } = await import('../utils/initFollowButtons');
    initFollowButtons();
  }, 0);

  return html;
}

/* ---------------------- SEARCH LOGIC ---------------------- */
function wireSearch() {
  const input = document.querySelector<HTMLInputElement>('#feedSearch');
  const grid = document.querySelector<HTMLElement>('#feedGrid');
  if (!input || !grid) return;

  input.addEventListener('input', (e) => {
    const query = (e.target as HTMLInputElement).value.toLowerCase().trim();
    const filtered = allPosts.filter(
      (post) =>
        post.title?.toLowerCase().includes(query) ||
        post.body?.toLowerCase().includes(query) ||
        post.author?.name?.toLowerCase().includes(query)
    );
    grid.innerHTML = filtered
      .map((post, index) => postCard(post, index))
      .join('');
    import('../utils/initFollowButtons').then((m) => m.initFollowButtons());
  });
}

/* ---------------------- FOLLOWERS / FOLLOWING MODAL ---------------------- */

function getStoredUsername(): string | null {
  const raw = localStorage.getItem('username') || localStorage.getItem('name');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

// Simple in-memory cache to avoid repeated API calls
const followCache: Record<string, any[]> = {};

function wireFollowerLists() {
  const followersBtn = document.getElementById('followersBtn');
  const followingBtn = document.getElementById('followingBtn');
  const username = getStoredUsername();

  if (!username) return;

  followersBtn?.addEventListener('click', () =>
    showFollowList(username, 'followers')
  );
  followingBtn?.addEventListener('click', () =>
    showFollowList(username, 'following')
  );
}

async function showFollowList(
  username: string,
  type: 'followers' | 'following'
) {
  // Check cache first
  const cacheKey = `${username}_${type}`;
  if (followCache[cacheKey]) {
    console.log(`[Cache hit] Using cached ${type} data`);
    renderFollowModal(followCache[cacheKey], type);
    return;
  }

  // Show modal immediately with "Loading..." while fetching
  renderFollowModal(null, type, true);

  try {
    const token = getToken();
    const url = `https://v2.api.noroff.dev/social/profiles/${encodeURIComponent(
      username
    )}/${type}`;

    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) throw new Error(`Failed to fetch ${type}`);
    const data = await res.json();
    const list = Array.isArray(data) ? data : data.data || [];

    // Save in cache (and sessionStorage if you want persistence)
    followCache[cacheKey] = list;
    sessionStorage.setItem(cacheKey, JSON.stringify(list));

    renderFollowModal(list, type);
  } catch (error) {
    console.error('Error fetching follow list:', error);
    renderFollowModal([], type, false, true);
  }
}

function renderFollowModal(
  list: any[] | null,
  type: 'followers' | 'following',
  loading = false,
  error = false
) {
  // Create or reuse modal container
  let modal = document.getElementById('followModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'followModal';
    modal.className =
      'fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50';
    document.body.appendChild(modal);
  }

  const header = `<h2 class="text-xl font-bold mb-4 text-center capitalize">${type}</h2>`;

  let body = '';
  if (loading) {
    body = `<p class="text-center text-gray-400">Loading...</p>`;
  } else if (error) {
    body = `<p class="text-center text-red-400">Failed to load ${type}. Please try again later.</p>`;
  } else if (list && list.length) {
    body = `<ul class="space-y-3">${list
      .map((item: any) => {
        const avatar = item.avatar?.url || '/profile.avatar.png';
        const name = item.name || 'Unknown User';
        return `
          <li class="flex items-center gap-3 border-b border-gray-700 pb-2">
            <img src="${avatar}" alt="${name}" class="w-10 h-10 rounded-full object-cover border border-gray-700">
            <span class="font-semibold">${name}</span>
          </li>`;
      })
      .join('')}</ul>`;
  } else {
    body = `<p class="text-gray-400 text-center">No ${type} yet.</p>`;
  }

  modal.innerHTML = `
    <div class="bg-gray-800 text-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto relative">
      <button id="closeFollowModal" class="absolute top-2 right-3 text-gray-400 hover:text-white text-xl">&times;</button>
      ${header}
      ${body}
    </div>
  `;

  modal
    .querySelector('#closeFollowModal')
    ?.addEventListener('click', () => modal?.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

/* ---------------------- OPTIONAL CSS ANIMATION ---------------------- */
const style = document.createElement('style');
style.textContent = `
@keyframes fadeIn { from {opacity:0; transform:scale(0.98);} to {opacity:1; transform:scale(1);} }
.animate-fadeIn { animation: fadeIn 0.2s ease-out; }
`;
document.head.appendChild(style);
