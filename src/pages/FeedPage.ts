// src/pages/FeedPage.ts
import postCard from '../components/posts/postCard';
import logoutBtn from '../components/logoutBtn';
import { api, getToken } from '../services/api/client';
import { getAllPosts } from '../services/posts/posts';
import type { Post } from '../types/noroff-types';
import escHtml from '../utils/escHtml';

const AVATAR_PLACEHOLDER = '/profile-avatar.png';

// Cache posts for search and to prevent rate-limit errors
let allPosts: Post[] = [];
let lastFetchTime = 0;
const CACHE_TTL = 1000 * 60 * 2; // 2 minutes

export function invalidateFeedCache(): void {
	allPosts = [];
	lastFetchTime = 0;
}

/* ---------------------- UTILS ---------------------- */
function getUsername(): string | null {
	const storedName = localStorage.getItem('name');

	if (storedName) {
		try {
			return JSON.parse(storedName);
		} catch {
			return storedName;
		}
	}

	const storedUsername = localStorage.getItem('username');

	if (storedUsername) {
		try {
			return JSON.parse(storedUsername);
		} catch {
			return storedUsername;
		}
	}

	const token = getToken();

	if (!token) return null;

	try {
		const payload = JSON.parse(atob(token.split('.')[1] || ''));

		if (payload && typeof payload.name === 'string') {
			return payload.name;
		}
	} catch {
		return null;
	}

	return null;
}

/* ---------------------- SAFE FETCH WRAPPERS ---------------------- */
async function safeGetAllPosts(): Promise<Post[]> {
	const now = Date.now();
	const cacheValid = allPosts.length > 0 && now - lastFetchTime < CACHE_TTL;

	if (cacheValid) {
		return allPosts;
	}

	try {
		const result = await getAllPosts();

		const posts = Array.isArray(result)
			? result
			: Array.isArray((result as { data?: Post[] })?.data)
				? (result as { data: Post[] }).data
				: [];

		allPosts = posts;
		lastFetchTime = now;

		return posts;
	} catch (error: unknown) {
		const apiError = error as { response?: { status?: number } };

		if (apiError.response?.status === 429) {
			console.warn('Rate limited by Noroff API — retrying in 3 seconds...');
			await new Promise(resolve => window.setTimeout(resolve, 3000));
			return safeGetAllPosts();
		}

		console.error('Error loading posts:', error);
		return [];
	}
}

async function safeGetProfile(username: string): Promise<Record<string, unknown>> {
	try {
		const response = await api(`/profiles/${encodeURIComponent(username)}?_followers=true&_following=true`);

		const result = response as { data?: Record<string, unknown> };

		return result?.data ?? (response as Record<string, unknown>) ?? {};
	} catch (error: unknown) {
		const apiError = error as { response?: { status?: number } };

		if (apiError.response?.status === 429) {
			console.warn('Rate limited fetching profile — retrying in 3 seconds...');
			await new Promise(resolve => window.setTimeout(resolve, 3000));
			return safeGetProfile(username);
		}

		console.error('Error fetching profile:', error);
		return {};
	}
}

/* ---------------------- FEED PAGE ---------------------- */
export default async function FeedPage(): Promise<string> {
	const posts = await safeGetAllPosts();
	const username = getUsername();

	let profile: Record<string, any> = {};

	if (username) {
		await new Promise(resolve => window.setTimeout(resolve, 500));
		profile = await safeGetProfile(username);
	}

	const avatar = typeof profile.avatar === 'string' ? profile.avatar : profile.avatar?.url || AVATAR_PLACEHOLDER;

	const avatarAlt =
		typeof profile.avatar === 'object' && profile.avatar?.alt
			? profile.avatar.alt
			: `${profile.name || username || 'User'} profile picture`;

	const displayName = profile.name || username || 'Anonymous';
	const bio = profile.bio || 'No bio yet.';

	const followers = Array.isArray(profile.followers) ? profile.followers.length : (profile._count?.followers ?? 0);

	const following = Array.isArray(profile.following) ? profile.following.length : (profile._count?.following ?? 0);

	const postsCount = Array.isArray(posts) ? posts.length : 0;

	const html = `
		<div class="min-h-dvh bg-gray-950 text-white">

			<!-- MOBILE NAVIGATION -->
			<nav
				class="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-gray-800 bg-gray-900/95 px-3 backdrop-blur-md lg:hidden"
				aria-label="Mobile navigation">
				<a
					href="/feed"
					class="flex h-11 w-11 items-center justify-center rounded-xl transition hover:bg-white/10"
					aria-label="Feed">
					<img
						src="/Hubble.png"
						alt="Hubble home"
						class="h-9 w-9 object-contain [mix-blend-mode:lighten]"
					/>
				</a>

				<a
					href="/feed"
					class="flex h-11 w-11 items-center justify-center rounded-xl text-gray-300 transition hover:bg-white/10 hover:text-blue-400"
					aria-label="Feed">
					<i class="text-xl fa-solid fa-house-user"></i>
				</a>

				<a
					href="/profile"
					class="flex h-11 w-11 items-center justify-center rounded-xl text-gray-300 transition hover:bg-white/10 hover:text-blue-400"
					aria-label="Profile">
					<i class="text-xl fa-solid fa-user"></i>
				</a>

				<a
					href="/create"
					class="flex h-11 w-11 items-center justify-center rounded-xl text-gray-300 transition hover:bg-white/10 hover:text-blue-400"
					aria-label="Create post">
					<i class="text-xl fa fa-camera"></i>
				</a>

				<div class="flex items-center justify-center">
					${logoutBtn('logout-mobile', 'Logout')}
				</div>
			</nav>

			<!-- DESKTOP SIDEBAR -->
			<aside class="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-gray-800 bg-gray-900/95 text-gray-300 lg:flex">
				<a
					href="/feed"
					class="mx-auto mt-10 flex w-36 items-center justify-center"
					aria-label="Hubble feed home">
					<img
						src="/Hubble.png"
						alt="Hubble logo"
						class="w-full object-contain [mix-blend-mode:lighten]"
					/>
				</a>

				<nav class="mt-20 flex flex-col gap-3 px-6" aria-label="Desktop navigation">
					<a
						href="/feed"
						class="flex items-center gap-4 rounded-xl bg-white/5 px-5 py-4 text-white transition hover:bg-white/10 hover:text-blue-400">
						<i class="text-xl fa-solid fa-house-user"></i>
						<span class="text-lg font-medium">Feed</span>
					</a>

					<a
						href="/profile"
						class="flex items-center gap-4 rounded-xl px-5 py-4 transition hover:bg-white/10 hover:text-blue-400">
						<i class="text-xl fa-solid fa-user"></i>
						<span class="text-lg font-medium">Profile</span>
					</a>

					<a
						href="/create"
						class="flex items-center gap-4 rounded-xl px-5 py-4 transition hover:bg-white/10 hover:text-blue-400">
						<i class="text-xl fa fa-camera"></i>
						<span class="text-lg font-medium">Create</span>
					</a>
				</nav>

				<div class="mt-auto px-8 pb-8">
					${logoutBtn('logout-desktop', 'Logout')}
				</div>
			</aside>

			<!-- MAIN CONTENT -->
			<main class="min-h-dvh w-full pb-24 lg:ml-64 lg:w-[calc(100%-16rem)] lg:pb-12">
				<div class="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10 lg:py-12">

					<!-- PROFILE SUMMARY -->
					<section class="mx-auto w-full max-w-6xl text-center" aria-label="Profile summary">
						<div class="relative mx-auto mb-4 h-20 w-20 sm:h-28 sm:w-28 lg:h-32 lg:w-32">
							<img
								src="${escHtml(avatar)}"
								alt="${escHtml(avatarAlt)}"
								class="h-full w-full rounded-full border-4 border-gray-700 object-cover shadow-inner"
								onerror="this.onerror=null; this.src='${AVATAR_PLACEHOLDER}'"
							/>
							<span class="absolute bottom-0.5 right-0.5 h-5 w-5 rounded-full border-2 border-gray-950 bg-green-500 sm:h-6 sm:w-6"></span>
						</div>

						<h1 class="text-2xl font-extrabold sm:text-3xl lg:text-4xl">
							${escHtml(displayName)}
						</h1>

						<p class="mt-1 text-sm text-gray-300 sm:text-base">
							${escHtml(bio)}
						</p>

						<!-- STATS -->
						<div class="mx-auto mt-6 grid max-w-md grid-cols-3 gap-2 sm:gap-4">
							<button
								id="followersBtn"
								type="button"
								class="flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl bg-gray-800/70 px-2 py-3 text-xs transition hover:bg-gray-700/70 sm:flex-row sm:px-4 sm:text-sm">
								<span aria-hidden="true">👥</span>
								<span class="truncate">Followers: <b>${followers}</b></span>
							</button>

							<button
								id="followingBtn"
								type="button"
								class="flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl bg-gray-800/70 px-2 py-3 text-xs transition hover:bg-gray-700/70 sm:flex-row sm:px-4 sm:text-sm">
								<span aria-hidden="true">⭐</span>
								<span class="truncate">Following: <b>${following}</b></span>
							</button>

							<div
								class="flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl bg-gray-800/70 px-2 py-3 text-xs sm:flex-row sm:px-4 sm:text-sm">
								<span aria-hidden="true">📝</span>
								<span class="truncate">Posts: <b>${postsCount}</b></span>
							</div>
						</div>
					</section>

					<!-- SEARCH -->
					<div class="mx-auto mt-8 w-full max-w-6xl">
						<label for="feedSearch" class="sr-only">Search posts</label>
						<input
							type="search"
							id="feedSearch"
							placeholder="Search posts, authors, text..."
							class="w-full rounded-xl bg-white/10 px-4 py-3 text-sm text-white ring-1 ring-white/15 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
							autocomplete="off"
						/>
					</div>

					<!-- POSTS GRID -->
					<section
						id="feedGrid"
						aria-label="Posts feed"
						class="mx-auto mt-7 grid w-full max-w-6xl grid-cols-1 items-start gap-5 sm:mt-9 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
						${posts.map((post, index) => postCard(post, index)).join('')}
					</section>
				</div>
			</main>
		</div>
	`;

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

	input.addEventListener('input', event => {
		const query = (event.target as HTMLInputElement).value.toLowerCase().trim();

		const filtered = allPosts.filter(
			post =>
				post.title?.toLowerCase().includes(query) ||
				post.body?.toLowerCase().includes(query) ||
				post.author?.name?.toLowerCase().includes(query),
		);

		grid.innerHTML = filtered.map((post, index) => postCard(post, index)).join('');

		import('../utils/initFollowButtons').then(module => {
			module.initFollowButtons();
		});
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

const followCache: Record<string, any[]> = {};

function wireFollowerLists() {
	const followersBtn = document.getElementById('followersBtn');
	const followingBtn = document.getElementById('followingBtn');
	const username = getStoredUsername();

	if (!username) return;

	followersBtn?.addEventListener('click', () => {
		showFollowList(username, 'followers');
	});

	followingBtn?.addEventListener('click', () => {
		showFollowList(username, 'following');
	});
}

async function showFollowList(username: string, type: 'followers' | 'following') {
	const cacheKey = `${username}_${type}`;

	if (followCache[cacheKey]) {
		renderFollowModal(followCache[cacheKey], type);
		return;
	}

	renderFollowModal(null, type, true);

	try {
		const token = getToken();
		const url = `https://v2.api.noroff.dev/social/profiles/${encodeURIComponent(username)}/${type}`;

		const response = await fetch(url, {
			headers: token ? { Authorization: `Bearer ${token}` } : {},
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch ${type}`);
		}

		const result = await response.json();
		const list = Array.isArray(result) ? result : result.data || [];

		followCache[cacheKey] = list;
		sessionStorage.setItem(cacheKey, JSON.stringify(list));

		renderFollowModal(list, type);
	} catch (error) {
		console.error('Error fetching follow list:', error);
		renderFollowModal([], type, false, true);
	}
}

function renderFollowModal(list: any[] | null, type: 'followers' | 'following', loading = false, error = false) {
	let modal = document.getElementById('followModal');

	if (!modal) {
		modal = document.createElement('div');
		modal.id = 'followModal';
		modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm';
		document.body.appendChild(modal);
	}

	const header = `<h2 class="mb-4 text-center text-xl font-bold capitalize">${type}</h2>`;

	let body = '';

	if (loading) {
		body = `<p class="text-center text-gray-400">Loading...</p>`;
	} else if (error) {
		body = `<p class="text-center text-red-400">Failed to load ${type}. Please try again later.</p>`;
	} else if (list && list.length) {
		body = `<ul class="space-y-3">${list
			.map((item: any) => {
				const avatar = item.avatar?.url || AVATAR_PLACEHOLDER;
				const name = item.name || 'Unknown User';

				return `
					<li class="flex items-center gap-3 border-b border-gray-700 pb-2">
						<img
							src="${escHtml(avatar)}"
							alt="${escHtml(name)}"
							class="h-10 w-10 rounded-full border border-gray-700 object-cover"
							onerror="this.onerror=null; this.src='${AVATAR_PLACEHOLDER}'"
						/>
						<span class="font-semibold">${escHtml(name)}</span>
					</li>
				`;
			})
			.join('')}</ul>`;
	} else {
		body = `<p class="text-center text-gray-400">No ${type} yet.</p>`;
	}

	modal.innerHTML = `
		<div class="relative max-h-[80vh] w-full max-w-sm overflow-y-auto rounded-2xl bg-gray-800 p-6 text-white shadow-2xl">
			<button
				id="closeFollowModal"
				type="button"
				class="absolute right-3 top-2 text-xl text-gray-400 transition hover:text-white"
				aria-label="Close ${type} list">
				&times;
			</button>
			${header}
			${body}
		</div>
	`;

	modal.querySelector('#closeFollowModal')?.addEventListener('click', () => modal?.remove());

	modal.addEventListener('click', event => {
		if (event.target === modal) {
			modal?.remove();
		}
	});
}

/* ---------------------- OPTIONAL CSS ANIMATION ---------------------- */
const style = document.createElement('style');

style.textContent = `
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: scale(0.98);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.animate-fadeIn {
		animation: fadeIn 0.2s ease-out;
	}
`;

document.head.appendChild(style);
