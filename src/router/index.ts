import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import FeedPage from '../pages/FeedPage';
import NotFoundPage from '../pages/NotFoundPage';
import PostDetailsPage from '../pages/PostDetailsPage';
import ProfilePage from '../pages/Profile';
import CreatePostPage from '../pages/createNewPost';
import { initLogoutBtn } from '../components/logoutBtn';
import { bootFeedInteractions } from '../pages/feedInteractions';
import initFeedPageScripts from '../pages/initFeedPageScript';
import { APP_CONTAINER_CLASSNAME } from '../constants';
import { lazyLoadImgs } from '../utils/lazy-load-img';

const PATHS = {
	home: { url: '/', component: LoginPage, protected: false },
	login: { url: '/login', component: LoginPage, protected: false },
	register: { url: '/register', component: RegisterPage, protected: false },
	feed: { url: '/feed', component: FeedPage, protected: true },
	profile: { url: '/profile', component: ProfilePage, protected: true },
	create: { url: '/create', component: CreatePostPage, protected: true },
	postDetails: {
		url: /^\/post\/(\d+)$/,
		component: PostDetailsPage,
		protected: true,
	},
};

export function isLoggedIn(): boolean {
	try {
		const token = localStorage.getItem('accessToken');

		return Boolean(token && token.trim().length > 0);
	} catch (error) {
		console.warn('Error reading accessToken', error);
		return false;
	}
}

export async function login(token: string): Promise<void> {
	localStorage.setItem('accessToken', token);
	history.pushState({}, '', '/feed');
	await renderRoute('/feed');
}

export async function logout(): Promise<void> {
	localStorage.removeItem('accessToken');
	history.pushState({}, '', '/login');
	await renderRoute('/login');
}

export default async function router(currentPath = '', routes = PATHS): Promise<string> {
	currentPath = currentPath || window.location.pathname;

	let matchedRoute: any = null;
	let routeParams: string[] = [];

	for (const key of Object.keys(routes)) {
		const route = (routes as any)[key];

		if (typeof route.url === 'string' && route.url === currentPath) {
			matchedRoute = route;
			break;
		}

		if (route.url instanceof RegExp) {
			const match = currentPath.match(route.url);

			if (match) {
				matchedRoute = route;
				routeParams = match.slice(1);
				break;
			}
		}
	}

	if (!matchedRoute) {
		return NotFoundPage();
	}

	if (matchedRoute.protected && !isLoggedIn()) {
		console.warn('Unauthorized access, redirecting to /login');
		history.replaceState({}, '', '/login');

		return LoginPage();
	}

	return matchedRoute.component(routeParams);
}

export async function renderRoute(path?: string): Promise<void> {
	const current = path ?? window.location.pathname;
	const container = document.getElementById(APP_CONTAINER_CLASSNAME);

	if (!container) return;

	container.innerHTML = await router(current);
	lazyLoadImgs();

	// Post details page
	if (/^\/post\/\d+$/.test(current)) {
		const backBtn = document.getElementById('back-to-feed');

		if (backBtn) {
			backBtn.addEventListener('click', event => {
				event.preventDefault();
				history.pushState({}, '', '/feed');
				void renderRoute('/feed');
			});
		}

		try {
			bootFeedInteractions();
		} catch (error) {
			console.error('Could not initialise post interactions:', error);
		}

		try {
			const { initFollowButtons } = await import('../utils/initFollowButtons');

			initFollowButtons();
		} catch (error) {
			console.error('Could not initialise follow button:', error);
		}
	}

	// Feed page
	if (current === '/feed') {
		initFeedPageScripts(container);
		initLogoutBtn('logout-mobile', container);
		initLogoutBtn('logout-desktop', container);

		try {
			bootFeedInteractions();
		} catch (error) {
			console.error('Could not initialise feed interactions:', error);
		}
	}
}

export async function initRouterOnStart(): Promise<void> {
	const current = window.location.pathname;

	if (!isLoggedIn() && !['/login', '/register'].includes(current)) {
		history.replaceState({}, '', '/login');
		await renderRoute('/login');
		return;
	}

	await renderRoute(current);
}
