import { api, post, put, del, getToken } from '../services/api/client';
import { renderRoute } from '../router';

/* ------------------------ utils ------------------------ */
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

export function escHtml(v: any) {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

type ProfileResponse = {
  name: string;
  avatar?: { url?: string; alt?: string } | string;
  bio?: string;
  _count?: { followers?: number; following?: number; posts?: number };
  followers?: any[];
  following?: any[];
};

type PostItem = {
  id: number;
  title: string;
  body?: string;
  tags?: string[];
  media?:
    | { url?: string; alt?: string }
    | Array<{ url?: string; alt?: string }>;
  author?: { name?: string };
  created?: string;
  updated?: string;
};

/* ------------------------ view ------------------------ */
export default async function ProfilePage(): Promise<string> {
  const username = getUsername();
  if (!username) {
    return `
         <main class="min-h-dvh bg-gray-900 text-gray-100 p-8">
        <h1 class="text-3xl font-bold mb-6">Your Profile</h1>
        <p class="opacity-80">
          No username found. Please log in again or set it manually:
          <code>localStorage.setItem('name', JSON.stringify('YourName'))</code>
        </p>
        <a class="inline-block mt-6 underline" href="/login">→ Go to Login</a>
      </main>
    `;
  }

  // 1) Profil
  let profile: ProfileResponse;
  try {
    profile = await api<ProfileResponse>(
      `/profiles/${encodeURIComponent(username)}`
    );
  } catch (err: any) {
    return `
    <main class="min-h-dvh bg-gray-900 text-gray-100 p-8">
        <h1 class="text-3xl font-bold mb-6">Your Profile</h1>
        <div class="p-4 rounded bg-red-900/30 border border-red-700">
          <div class="font-semibold mb-1">Error loading profile</div>
          <code class="text-sm break-all">${escHtml(
            err?.message ?? String(err)
          )}</code>
        </div>
        <p class="mt-4 opacity-80">Check your token / API key.</p>
      </main>
    `;
  }
  // 2) Post
  let posts: PostItem[] = [];
  try {
    const res = await api<any>(
      `/profiles/${encodeURIComponent(
        username
      )}/posts?sort=created&sortOrder=desc`
    );
    posts = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
  } catch {
    posts = [];
  }

  const data = (profile as any)?.data ?? {};

  const avatar =
    (typeof data?.avatar === 'string' ? data.avatar : data?.avatar?.url) ||
    './profile-avatar.png';

  const displayName = data?.name || username || 'Anonymous';
  const bio = data?.bio || 'Welcome to my page!';

  const followers = data?._count?.followers ?? 0;
  const following = data?._count?.following ?? 0;
  const postsCount = data?._count?.posts ?? posts.length ?? 0;

  // 3) HTML
  const html = `
   <main class="relative min-h-dvh bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 text-gray-100">
  
  <!-- 🔹 Sticky Header -->
  <header class="sticky top-0 z-50 w-full bg-gray-900/70 backdrop-blur-md border-b border-gray-800 shadow-sm">
    <div class="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
      <!-- Left: Nav -->
      <nav class="flex items-center gap-6">
        <a href="/feed" 
           class="text-gray-300 hover:text-blue-400 md:text-lg font-medium transition-colors duration-200">
          🏠 Feed
        </a>
        <a href="/profile"
           class="text-gray-300 hover:text-blue-400 md:text-lg font-medium transition-colors duration-200">
          👤 Profile
        </a>
      </nav>

      <!-- Center: Profile Name -->
      <h1 class="text-lg sm:text-xl font-semibold text-blue-300 tracking-tight">
        ${escHtml(displayName)}
      </h1>

      <!-- Right: Logout -->
      <button id="logout-btn"
              class="px-4 py-1.5 rounded-md bg-red-600/90 hover:bg-red-500 text-white font-medium text-sm transition-colors duration-200 cursor-pointer md:text-lg">
        Logout
      </button>
    </div>
  </header>

  <!-- 🔹 Profile Header Card -->

  <section class="px-4 sm:px-6 py-10">
    <header class="max-w-3xl mx-auto mt-6 rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md p-8 sm:p-10 shadow-xl hover:shadow-2xl transition-all duration-300">
      <div class="flex flex-col items-center text-center gap-5">
        <div class="relative">
          <img src="${escHtml(avatar)}" alt="${escHtml(
    typeof profile?.avatar === 'string'
      ? 'Avatar'
      : profile?.avatar?.alt ?? 'Avatar'
  )}"
               class="w-25 h-25 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gray-800 shadow-lg hover:scale-105 transition-transform duration-300"/>
        </div>

        <div>
          <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
            ${escHtml(displayName)}
          </h2>
          <p class="opacity-80 text-sm sm:text-base mt-3 max-w-md mx-auto leading-relaxed">
            ${bio ? escHtml(bio) : '—'}
          </p>

          <div class="mt-4 flex flex-wrap justify-center gap-4 text-sm text-gray-300">
            <span class="cursor-pointer text-md lg:text-lg bg-gray-800/50 px-4 py-2 rounded-lg hover:bg-gray-700/60 transition"><span class="text-blue-400 text-lg">👥</span> Followers: <b>${followers}</b></span>
            <span class="cursor-pointer text-md lg:text-lg bg-gray-800/50 px-4 py-2 rounded-lg hover:bg-gray-700/60 transition"><span class="text-green-400 text-lg">⭐</span> Following: <b>${following}</b></span>
            <span class="cursor-pointer text-md lg:text-lg bg-gray-800/50 px-4 py-2 rounded-lg hover:bg-gray-700/60 transition"><span class="text-yellow-400 text-lg">📝</span> Posts: <b>${postsCount}</b></span>
          </div>

          <div class="mt-6">
            <button id="toggle-create"
                    class="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600
                           text-white font-medium shadow hover:from-blue-500 hover:to-indigo-500 
                           transition-all duration-200 cursor-pointer">
              + New Post
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 🔹 Post Editor -->
    <section id="editor" class="max-w-2xl mx-auto mt-10 hidden">
      <div class="rounded-2xl border border-gray-800 bg-gray-900/70 backdrop-blur-md p-6 sm:p-8 shadow-2xl">
        <h2 id="editor-title" class="text-xl font-semibold mb-4 text-blue-300">Create a new post</h2>
        <form id="post-form" class="space-y-4">
          <input type="hidden" id="postId" value="">

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-300">Title <span class="text-red-400">*</span></label>
            <input id="title" required
                   class="w-full p-2.5 rounded-lg border border-gray-700 bg-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-300">Body</label>
            <textarea id="body" rows="6"
                      class="w-full p-2.5 rounded-lg border border-gray-700 bg-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"></textarea>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block mb-1 text-sm font-medium text-gray-300">Image URL</label>
              <input id="imgUrl"
                     class="w-full p-2.5 rounded-lg border border-gray-700 bg-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                     placeholder="https://..." />
            </div>
            <div>
              <label class="block mb-1 text-sm font-medium text-gray-300">Image ALT</label>
              <input id="imgAlt"
                     class="w-full p-2.5 rounded-lg border border-gray-700 bg-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
            </div>
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-300">Tags (comma separated)</label>
            <input id="tags"
                   class="w-full p-2.5 rounded-lg border border-gray-700 bg-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                   placeholder="news, cats" />
          </div>

          <div class="flex items-center gap-3 pt-2">
            <button type="submit" id="save-btn"
                    class="px-5 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium hover:from-green-500 hover:to-emerald-500 transition-all cursor-pointer">
              Create
            </button>
            <button type="button" id="cancel-edit"
                    class="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all cursor-pointer">
              Cancel
            </button>
            <button type="button" id="reset-edit"
                    class="px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 hover:bg-gray-700 transition-all cursor-pointer">
              Reset
            </button>
            <span id="msg" class="text-sm opacity-80 ml-2 text-yellow-400"></span>
          </div>
        </form>
      </div>
    </section>

    <!-- 🔹 Posts -->
    <section class="max-w-6xl mx-auto mt-12">
      <div class="flex items-center gap-2 mb-5">
        <span class="inline-flex h-7 w-7 items-center justify-center rounded-md bg-gray-800 border border-gray-700 text-blue-400">🗂️</span>
        <h2 class="text-xl font-semibold text-gray-200">Your Posts</h2>
      </div>

      <div id="posts" class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        ${
          posts.length
            ? posts
                .map((p) => {
                  const media = Array.isArray(p.media)
                    ? p.media?.[0]?.url
                    : (p.media as any)?.url;
                  const own = p.author?.name === profile.name;
                  const created = p.created
                    ? new Date(p.created).toLocaleString()
                    : '';
                  const tags =
                    Array.isArray(p.tags) && p.tags.length
                      ? `<div class="flex flex-wrap gap-1 mt-2">${p.tags
                          .slice(0, 5)
                          .map(
                            (t) =>
                              `<span class="text-xs px-2 py-0.5 rounded-full bg-gray-800 border border-gray-700 text-gray-300">${escHtml(
                                t
                              )}</span>`
                          )
                          .join('')}</div>`
                      : '';
                  return `
                  <article class="rounded-2xl bg-gray-900/60 border border-gray-800 p-5 shadow-lg hover:shadow-blue-900/30 hover:border-blue-600/50 transition-all duration-300">
                    ${
                      media
                        ? `<img class="w-full h-48 object-cover rounded-lg mb-4 border border-gray-800" src="${escHtml(
                            media
                          )}" alt="">`
                        : ''
                    }
                    <h3 class="font-semibold text-lg mb-1 text-gray-100">${escHtml(
                      p.title
                    )}</h3>
                    <div class="text-xs text-gray-400 mb-2">${escHtml(
                      created
                    )}</div>
                    <div class="text-sm text-gray-300 line-clamp-3">${escHtml(
                      p.body ?? ''
                    )}</div>
                    ${tags}
                    ${
                      own
                        ? `<div class="flex gap-2 mt-4">
                             <button class="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 transition-all js-edit cursor-pointer" data-id="${p.id}">Edit</button>
                             <button class="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 transition-all js-delete cursor-pointer" data-id="${p.id}">Delete</button>
                           </div>`
                        : ''
                    }
                  </article>
                `;
                })
                .join('')
            : `<p class="opacity-70 text-gray-400 italic">No posts yet. Create your first one!</p>`
        }
      </div>
    </section>
  </section>

  <!-- 🔹 Bottom Back Link -->
  <div class="max-w-6xl mx-auto text-center pb-10">
    <a href="/feed"
       class="inline-flex items-center gap-2 text-lg font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200">
      ← Back to Feed
    </a>
  </div>
</main>

  `;

  // 4) Zachowanie – delegacja globalna
  wireProfileHandlersOnce();

  return html;
}

/* ------------------------ behavior ------------------------ */
function q<T extends Element = Element>(sel: string): T | null {
  return document.querySelector<T>(sel);
}

function openCreate() {
  const editor = q<HTMLDivElement>('#editor');
  const editorTitle = q<HTMLHeadingElement>('#editor-title');
  const hiddenId = q<HTMLInputElement>('#postId');
  const saveBtn = q<HTMLButtonElement>('#save-btn');
  const msg = q<HTMLParagraphElement>('#msg');
  const titleEl = q<HTMLInputElement>('#title');
  const bodyEl = q<HTMLTextAreaElement>('#body');
  const imgUrlEl = q<HTMLInputElement>('#imgUrl');
  const imgAltEl = q<HTMLInputElement>('#imgAlt');
  const tagsEl = q<HTMLInputElement>('#tags');

  editor?.classList.remove('hidden');
  if (editorTitle) editorTitle.textContent = 'Create a new post';
  if (saveBtn) saveBtn.textContent = 'Create';
  if (hiddenId) hiddenId.value = '';
  if (msg) msg.textContent = '';
  if (titleEl) titleEl.value = '';
  if (bodyEl) bodyEl.value = '';
  if (imgUrlEl) imgUrlEl.value = '';
  if (imgAltEl) imgAltEl.value = '';
  if (tagsEl) tagsEl.value = '';
  titleEl?.focus();
}

function openEdit(post: any) {
  const editor = q<HTMLDivElement>('#editor');
  const editorTitle = q<HTMLHeadingElement>('#editor-title');
  const hiddenId = q<HTMLInputElement>('#postId');
  const saveBtn = q<HTMLButtonElement>('#save-btn');
  const msg = q<HTMLParagraphElement>('#msg');

  const form = q<HTMLFormElement>('#post-form');
  const titleEl = q<HTMLInputElement>('#title');
  const bodyEl = q<HTMLTextAreaElement>('#body');
  const imgUrlEl = q<HTMLInputElement>('#imgUrl');
  const imgAltEl = q<HTMLInputElement>('#imgAlt');
  const tagsEl = q<HTMLInputElement>('#tags');

  editor?.classList.remove('hidden');
  if (editorTitle) editorTitle.textContent = `Edit post #${post.id}`;
  if (saveBtn) saveBtn.textContent = 'Save changes';
  if (hiddenId) hiddenId.value = String(post.id);
  if (msg) msg.textContent = '';

  const media = Array.isArray(post.media) ? post.media?.[0] : post.media || {};
  const original = {
    id: post?.id ?? '',
    title: post?.title ?? '',
    body: post?.body ?? '',
    imgUrl: media?.url ?? '',
    imgAlt: media?.alt ?? '',
    tags: Array.isArray(post?.tags) ? post.tags : [],
  };

  // Prefill
  if (titleEl) titleEl.value = original.title;
  if (bodyEl) bodyEl.value = original.body;
  if (imgUrlEl) imgUrlEl.value = original.imgUrl;
  if (imgAltEl) imgAltEl.value = original.imgAlt;
  if (tagsEl) tagsEl.value = original.tags.join(', ');

  if (form) (form as any).dataset.original = JSON.stringify(original);

  titleEl?.focus();
}

function closeEditor() {
  const editor = q<HTMLDivElement>('#editor');
  const hiddenId = q<HTMLInputElement>('#postId');
  const msg = q<HTMLParagraphElement>('#msg');
  editor?.classList.add('hidden');
  if (hiddenId) hiddenId.value = '';
  if (msg) msg.textContent = '';
}

function wireProfileHandlersOnce() {
  if ((window as any).__profileHandlersWired) return;
  (window as any).__profileHandlersWired = true;

  document.addEventListener('click', async (e) => {
    const el = e.target as HTMLElement;

    /* ---------------------- 🔹 NAVIGATION ---------------------- */

    // Logout button
    if (el.closest('#logout-btn')) {
      e.preventDefault();
      try {
        localStorage.clear();
        sessionStorage.clear();
        renderRoute('/login');
      } catch (err) {
        console.error('Logout failed:', err);
      }
      return;
    }

    // Feed link (if we want SPA navigation)
    if (el.closest('a[href="/feed"]')) {
      e.preventDefault();
      renderRoute('/feed');
      return;
    }

    /* ---------------------- 🔹 EDITOR TOGGLE ---------------------- */

    // Toggle create / close editor
    if (el.closest('#toggle-create')) {
      const editor = q<HTMLDivElement>('#editor');
      if (!editor) return;
      if (editor.classList.contains('hidden')) openCreate();
      else closeEditor();
      return;
    }

    // Cancel editing
    if (el.closest('#cancel-edit')) {
      if (!q('#editor')) return;
      closeEditor();
      return;
    }

    // Reset edit form
    if (el.closest('#reset-edit')) {
      const form = q<HTMLFormElement>('#post-form');
      if (!form?.dataset.original) return;
      const data = JSON.parse(form.dataset.original);
      q<HTMLInputElement>('#title')!.value = data.title || '';
      q<HTMLTextAreaElement>('#body')!.value = data.body || '';
      q<HTMLInputElement>('#imgUrl')!.value = data.imgUrl || '';
      q<HTMLInputElement>('#imgAlt')!.value = data.imgAlt || '';
      q<HTMLInputElement>('#tags')!.value = Array.isArray(data.tags)
        ? data.tags.join(', ')
        : '';
      return;
    }

    /* ---------------------- 🔹 EDIT & DELETE ---------------------- */

    // Edit post
    const editBtn = el.closest('.js-edit') as HTMLButtonElement | null;
    if (editBtn) {
      const id = editBtn.getAttribute('data-id');
      if (!id) return;
      try {
        const res = await api<any>(
          `/posts/${id}?_author=true&_reactions=true&_comments=true`
        );
        const p = res?.data ?? res;
        openEdit({
          id: p?.id ?? id,
          title: p?.title ?? '',
          body: p?.body ?? '',
          tags: Array.isArray(p?.tags) ? p.tags : [],
          media: p?.media ?? null,
        });
      } catch {
        alert('Failed to load post for edit');
      }
      return;
    }

    // Delete post
    const delBtn = el.closest('.js-delete') as HTMLButtonElement | null;
    if (delBtn) {
      const id = delBtn.getAttribute('data-id');
      if (!id) return;
      if (!confirm('Delete this post? This cannot be undone.')) return;
      try {
        await del(`/posts/${id}`);
        renderRoute('/profile');
      } catch (err: any) {
        alert(`Delete failed: ${err?.message ?? String(err)}`);
      }
      return;
    }
  });

  /* ---------------------- 🔹 FORM SUBMIT (CREATE / UPDATE) ---------------------- */

  document.addEventListener('submit', async (e) => {
    const form = e.target as HTMLFormElement;
    if (form?.id !== 'post-form') return;
    e.preventDefault();

    const saveBtn = q<HTMLButtonElement>('#save-btn');
    const msg = q<HTMLParagraphElement>('#msg');
    const hiddenId = q<HTMLInputElement>('#postId');
    const titleEl = q<HTMLInputElement>('#title');
    const bodyEl = q<HTMLTextAreaElement>('#body');
    const imgUrlEl = q<HTMLInputElement>('#imgUrl');
    const imgAltEl = q<HTMLInputElement>('#imgAlt');
    const tagsEl = q<HTMLInputElement>('#tags');

    if (!titleEl || !saveBtn || !msg) return;

    const id = hiddenId?.value?.trim();
    const title = titleEl.value.trim();
    const body = bodyEl?.value?.trim() || '';
    const imgUrl = imgUrlEl?.value?.trim() || '';
    const imgAlt = imgAltEl?.value?.trim() || '';
    const tagsRaw = tagsEl?.value?.trim() || '';
    const tags = tagsRaw
      ? tagsRaw
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    if (!title) {
      msg.textContent = 'Title is required.';
      return;
    }

    const payload: any = { title };
    if (body) payload.body = body;
    if (tags.length) payload.tags = tags;
    payload.media = imgUrl
      ? { url: imgUrl, ...(imgAlt ? { alt: imgAlt } : {}) }
      : null;

    try {
      saveBtn.disabled = true;
      saveBtn.textContent = id ? 'Saving…' : 'Creating…';
      msg.textContent = '';

      if (id) await put(`/posts/${id}`, payload);
      else await post('/posts', payload);

      renderRoute('/profile');
    } catch (err: any) {
      msg.textContent = `Error: ${err?.message ?? String(err)}`;
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = id ? 'Save changes' : 'Create';
    }
  });
}
