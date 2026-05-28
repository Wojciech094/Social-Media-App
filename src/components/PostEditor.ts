import { post } from '../services/api/client';
import { renderRoute } from '../router';

export default function NewPostForm(): string {
  return `
    <section class="max-w-2xl mx-auto mt-10">
      <div class="rounded-2xl border border-gray-800 bg-gray-900/70 backdrop-blur-md p-6 sm:p-8 shadow-2xl">
        <h2 class="text-2xl text-center font-semibold mb-4 text-blue-300">Create a new post</h2>
        <form id="post-form" class="space-y-4">
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
            
          <section class="max-w-2xl mx-auto mt-10 relative">
  <div class="">
    <form id="post-form" class="">

      <!-- your existing form fields here -->
      
      <div class="flex items-center">
        <button type="submit" id="save-btn"
                class="px-10 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium hover:from-green-500 hover:to-emerald-500 transition-all cursor-pointer">
          Create
        </button>
        <span id="msg" class="text-sm opacity-80 ml-2 text-yellow-400"></span>
      </div>
    </form>
  </div>

  <!-- Spinner overlay -->
  <div id="spinner-overlay" class="hidden absolute inset-0 bg-black/50 flex items-center justify-center z-20">
    <div class="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-500"></div>
  </div>
</section>


            <span id="msg" class="text-sm opacity-80 ml-2 text-yellow-400"></span>
          </div>
        </form>
      </div>
    </section>
  `;
}

let isDelegated = false; // ensures delegation is only added once

export function wireNewPostForm() {
  if (isDelegated) return;
  isDelegated = true;

  const bgTarget = document.querySelector<HTMLElement>('#create-post-bg');

  // Spinner overlay
  let spinner = document.querySelector<HTMLDivElement>('#spinner-overlay');
  if (!spinner) {
    spinner = document.createElement('div');
    spinner.id = 'spinner-overlay';
    spinner.className =
      'hidden fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm';
    spinner.innerHTML = `
      <div class="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-500 mb-4"></div>
      <p class="text-blue-400 text-lg font-medium">Creating your post...</p>
    `;
    document.body.appendChild(spinner);
  }

  document.body.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement;
    if (target && target.id === 'imgUrl' && bgTarget) {
      const url = target.value.trim();
      bgTarget.style.backgroundImage = url ? `url("${url}")` : '';
      bgTarget.style.backgroundSize = 'cover';
      bgTarget.style.backgroundPosition = 'center';
    }
  });

  document.body.addEventListener('submit', async (e) => {
    const form = e.target as HTMLFormElement;
    if (!form || form.id !== 'post-form') return;

    e.preventDefault();

    const title = document
      .querySelector<HTMLInputElement>('#title')!
      .value.trim();
    const body = document
      .querySelector<HTMLTextAreaElement>('#body')!
      .value.trim();
    const imgUrl = document
      .querySelector<HTMLInputElement>('#imgUrl')!
      .value.trim();
    const imgAlt = document
      .querySelector<HTMLInputElement>('#imgAlt')!
      .value.trim();
    const tags = document
      .querySelector<HTMLInputElement>('#tags')!
      .value.split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const saveBtn = document.querySelector<HTMLButtonElement>('#save-btn');
    const msg = document.querySelector<HTMLSpanElement>('#msg');

    try {
      spinner!.classList.remove('hidden');
      if (saveBtn) saveBtn.disabled = true;
      if (msg) msg.textContent = '';

      await post('/posts', {
        title,
        body,
        tags,
        media: imgUrl ? { url: imgUrl, alt: imgAlt } : undefined,
      });

      setTimeout(() => {
        spinner!.classList.add('hidden');
        if (bgTarget) bgTarget.style.backgroundImage = '';
        renderRoute('/profile');
      }, 2000);
    } catch (err: any) {
      spinner!.classList.add('hidden');
      if (saveBtn) saveBtn.disabled = false;
      if (msg) msg.textContent = err?.message ?? 'Failed to create post';
      console.error('Failed to create post:', err);
    }
  });
}
