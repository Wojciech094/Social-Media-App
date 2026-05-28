import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import FeedPage from '../pages/FeedPage';
import NotFoundPage from '../pages/NotFoundPage';
import PostDetailsPage from '../pages/PostDetailsPage';
import ProfilePage from '../pages/Profile';
import { initLogoutBtn } from '../components/logoutBtn';
import { bootFeedInteractions } from '../pages/feedInteractions';
import { lazyLoadImgs } from '../utils/lazy-load-img';
import { APP_CONTAINER_CLASSNAME } from '../constants';
import initFeedPageScripts from '../pages/initFeedPageScript';
import CreatePostPage from '../pages/createNewPost';

const PATHS = {
  home: { url: '/', component: LoginPage, protected: false },
  login: { url: '/login', component: LoginPage, protected: false },
  register: { url: '/register', component: RegisterPage, protected: false },
  feed: { url: '/feed', component: FeedPage, protected: true },
  profile: { url: '/profile', component: ProfilePage, protected: true },
  create: { url: '/create', component: CreatePostPage, protected: true }, // <- updated
  postDetails: {
    url: /^\/post\/(\d+)$/,
    component: PostDetailsPage,
    protected: true,
  },
};

// ✅ Always read token from localStorage
export function isLoggedIn(): boolean {
  try {
    const token = localStorage.getItem('accessToken');
    return !!token && token.trim().length > 0;
  } catch (err) {
    console.warn('Error reading accessToken', err);
    return false;
  }
}

// login: save token + navigate
export async function login(token: string) {
  localStorage.setItem('accessToken', token);
  history.pushState({}, '', '/feed');
  await renderRoute('/feed');
}

// logout: remove token + navigate
export async function logout() {
  localStorage.removeItem('accessToken');
  history.pushState({}, '', '/login');
  await renderRoute('/login');
}

export default async function router(
  currentPath = '',
  routes = PATHS
): Promise<string> {
  currentPath = currentPath || window.location.pathname;

  let matchedRoute: any = null;
  let routeParams: string[] = [];

  for (const key of Object.keys(routes)) {
    const route = (routes as any)[key];
    if (typeof route.url === 'string' && route.url === currentPath) {
      matchedRoute = route;
      break;
    } else if (route.url instanceof RegExp) {
      const m = currentPath.match(route.url);
      if (m) {
        matchedRoute = route;
        routeParams = m.slice(1);
        break;
      }
    }
  }

  let html: string;
  if (!matchedRoute) {
    html = await NotFoundPage();
  } else if (matchedRoute.protected && !isLoggedIn()) {
    console.warn('Unauthorized access, redirecting to /login');
    history.replaceState({}, '', '/login');
    html = await LoginPage();
  } else {
    html = await matchedRoute.component(routeParams);
  }

  return html;
}

export async function renderRoute(path?: string) {
  const current = path ?? window.location.pathname;
  const container = document.getElementById(APP_CONTAINER_CLASSNAME);
  if (!container) return;

  container.innerHTML = await router(current);
  lazyLoadImgs();

  // Post page
  if (/^\/post\/\d+$/.test(current)) {
    const backBtn = document.getElementById('back-to-feed');
    if (backBtn) {
      backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        history.pushState({}, '', '/feed');
        renderRoute('/feed');
      });
    }
    try {
      bootFeedInteractions();
    } catch {}
  }

  // Feed page
  if (current === '/feed') {
    initFeedPageScripts(container); // safe: does NOT clear token
    initLogoutBtn('logout-mobile', container);
    initLogoutBtn('logout-desktop', container);
    try {
      bootFeedInteractions();
    } catch {}
  }
}

// ✅ Run on app start
export async function initRouterOnStart() {
  const current = window.location.pathname;
  if (!isLoggedIn() && !['/login', '/register'].includes(current)) {
    history.replaceState({}, '', '/login');
    await renderRoute('/login');
  } else {
    await renderRoute(current);
  }
}
