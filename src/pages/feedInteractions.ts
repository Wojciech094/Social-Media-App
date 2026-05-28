import {
  toggleReaction,
  addComment,
  deleteComment,
} from '../services/posts/interactions';
import { getToken } from '../services/api/client';

const TEXT = {
  show: 'Show',
  hide: 'Hide',
  liked: 'Liked',
  unliked: 'Removed like',
  addComment: 'Comment added',
  delComment: 'Comment deleted',
  reactError: 'Could not react to the post.',
  addError: 'Could not add the comment.',
  delError: 'Could not delete the comment.',
  notYours: 'You can delete only your own comments.',
  sending: 'Sending…',
  justNow: 'Just now',
  you: 'you',
  undo: 'UNDO',
};

const AVATAR_32 = 'https://placehold.co/32x32?text=%20';

function currentUserName(): string | null {
  try {
    const t = getToken();
    if (!t) return null;
    const mid = t.split('.')[1];
    if (!mid) return null;
    let b64 = mid.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const payload = JSON.parse(atob(b64));
    const name =
      payload?.name ?? payload?.username ?? payload?.user_name ?? payload?.sub;
    return typeof name === 'string' ? name : null;
  } catch {
    return null;
  }
}

function escapeHtml(input: unknown) {
  const s =
    typeof input === 'string' ? input : input == null ? '' : String(input);
  return s.replace(
    /[&<>"']/g,
    (m) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[
        m
      ]!)
  );
}
function showError(msg: string) {
  console.warn(msg);
}
function showUndoToast(
  msg: string,
  onUndo: () => void | Promise<void>,
  ms = 5000
) {
  const bar = document.createElement('div');
  bar.className =
    'fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-purple-500 text-white shadow-lg flex items-center gap-4';
  bar.innerHTML = `<span>${msg}</span>
    <button type="button" data-undo class="px-3 py-1 rounded bg-white/10 hover:bg-purple-700 cursor-pointer transition">${TEXT.undo}</button>`;
  document.body.appendChild(bar);
  let undone = false;
  const t = setTimeout(() => {
    if (!undone) document.body.removeChild(bar);
  }, ms);
  bar.querySelector('[data-undo]')!.addEventListener('click', async () => {
    undone = true;
    clearTimeout(t);
    try {
      await onUndo();
    } finally {
      document.body.removeChild(bar);
    }
  });
}

let BOOTED = false;

export function bootFeedInteractions() {
  if (BOOTED) return;
  BOOTED = true;

  document.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>(
      '[data-comments-toggle]'
    );
    if (!btn) return;
    const card = btn.closest<HTMLElement>('[data-post]');
    const list = card?.querySelector<HTMLElement>('[data-comment-list]');
    if (!list) return;

    const underline = btn.querySelector('span.underline');
    const willShow = list.classList.contains('hidden');
    list.classList.toggle('hidden', !willShow);
    if (underline) underline.textContent = willShow ? TEXT.hide : TEXT.show;
  });

  document.addEventListener('click', async (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(
      '[data-like-btn]'
    );
    if (!btn) return;

    if (btn.dataset.busy === '1') return;
    const postId = Number(btn.dataset.postId);
    if (!Number.isFinite(postId)) return;
    const symbol = btn.dataset.symbol || '❤️';

    const card = btn.closest<HTMLElement>('[data-post]');
    const counterEl = card?.querySelector<HTMLElement>('[data-like-count]');
    const wasLiked =
      btn.classList.contains('is-liked') ||
      btn.getAttribute('aria-pressed') === 'true' ||
      btn.dataset.liked === '1';

    btn.dataset.busy = '1';

    if (counterEl) {
      const cur = Number(counterEl.innerText || '0');
      counterEl.innerText = String(wasLiked ? Math.max(0, cur - 1) : cur + 1);
    }
    btn.classList.toggle('is-liked', !wasLiked);
    btn.setAttribute('aria-pressed', String(!wasLiked));
    btn.dataset.liked = !wasLiked ? '1' : '0';

    try {
      await toggleReaction(postId, symbol);
      showUndoToast(wasLiked ? TEXT.unliked : TEXT.liked, async () => {
        btn.dataset.busy = '1';
        try {
          await toggleReaction(postId, symbol);
          btn.classList.toggle('is-liked', wasLiked);
          btn.setAttribute('aria-pressed', String(wasLiked));
          btn.dataset.liked = wasLiked ? '1' : '0';
          if (counterEl) {
            const cur = Number(counterEl.innerText || '0');
            counterEl.innerText = String(
              wasLiked ? cur + 1 : Math.max(0, cur - 1)
            );
          }
        } finally {
          btn.dataset.busy = '0';
        }
      });
    } catch (err) {
      btn.classList.toggle('is-liked', wasLiked);
      btn.setAttribute('aria-pressed', String(wasLiked));
      btn.dataset.liked = wasLiked ? '1' : '0';
      if (counterEl) {
        const cur = Number(counterEl.innerText || '0');
        counterEl.innerText = String(wasLiked ? cur + 1 : Math.max(0, cur - 1));
      }
      console.error('Reaction failed', err);
      showError(TEXT.reactError);
    } finally {
      btn.dataset.busy = '0';
    }
  });

  document.addEventListener('submit', async (e) => {
    const form = (e.target as HTMLElement).closest<HTMLFormElement>(
      '[data-comment-form]'
    );
    if (!form) return;

    e.preventDefault();
    const postId = Number(form.dataset.postId);
    if (!Number.isFinite(postId)) return;

    const input = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(
      '[name="comment"]'
    );
    if (!input) return;

    const body = String(input.value || '').trim();
    if (!body) return;

    const card = form.closest<HTMLElement>('[data-post]');
    const list = card?.querySelector<HTMLElement>('[data-comment-list]');
    if (!list) return;

    if (list.classList.contains('hidden')) {
      list.classList.remove('hidden');
      const toggle = card?.querySelector<HTMLElement>(
        '[data-comments-toggle] .underline'
      );
      if (toggle) toggle.textContent = TEXT.hide;
    }

    const me = currentUserName() || '';
    const displayName = me || TEXT.you;

    const tempId = `temp-${Date.now()}`;
    const tempLi = document.createElement('li');
    tempLi.dataset.id = tempId;
    tempLi.dataset.owner = me;
    tempLi.className = 'comment pending rounded-lg bg-white/5 p-3';
    tempLi.innerHTML = `
      <div class="flex items-start gap-3">
        <img src="${AVATAR_32}" class="size-8 rounded-full" alt="" />
        <div class="flex-1">
          <div class="text-sm">
            <span class="font-semibold">@${escapeHtml(displayName)}</span>
            <span class="opacity-70">• ${TEXT.justNow}</span>
            <span class="opacity-60 ml-2" data-sending>${TEXT.sending}</span>
          </div>
          <div class="comment-body whitespace-pre-wrap">${escapeHtml(
            body
          )}</div>
        </div>
      </div>
    `;
    list.prepend(tempLi);

    try {
      const created = await addComment(postId, body);

      tempLi.dataset.id = String(created.id);
      tempLi.dataset.owner = created.owner ?? me;
      tempLi.classList.remove('pending');
      tempLi.innerHTML = `
        <div class="flex items-start gap-3">
          <img src="${
            created.author?.avatar || AVATAR_32
          }" class="size-8 rounded-full" alt="" />
          <div class="flex-1">
            <div class="text-sm">
              <span class="font-semibold">@${escapeHtml(
                created.owner ?? displayName
              )}</span>
              <span class="opacity-70">• ${
                created.created
                  ? new Date(created.created).toLocaleString()
                  : TEXT.justNow
              }</span>
            </div>
            <div class="comment-body whitespace-pre-wrap">${escapeHtml(
              created.body
            )}</div>
            <div class="mt-2">
              <button type="button" class="text-xs opacity-70 hover:opacity-100"
                      data-delete-comment data-post-id="${postId}" data-comment-id="${
        created.id
      }">
                Delete
              </button>
            </div>
          </div>
        </div>
      `;

      requestAnimationFrame(() => {
        tempLi.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });

      showUndoToast(TEXT.addComment, async () => {
        await deleteComment(postId, created.id);
        tempLi.remove();
      });
    } catch (err) {
      tempLi.remove();
      console.error('Add comment failed', err);
      showError(TEXT.addError);
    } finally {
      input.value = '';
    }
  });

  document.addEventListener('click', async (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(
      '[data-delete-comment]'
    );
    if (!btn) return;

    const me = currentUserName();
    const li = btn.closest<HTMLElement>('li[data-id]');
    const owner = li?.getAttribute('data-owner') || '';

    if (!me || owner !== me) {
      showError(TEXT.notYours);
      return;
    }

    const postId = Number(btn.dataset.postId);
    const commentId = Number(btn.dataset.commentId);
    if (!li || !Number.isFinite(postId) || !Number.isFinite(commentId)) return;

    const snapshotBody =
      li.querySelector<HTMLElement>('.comment-body')?.textContent ?? '';

    li.classList.add('opacity-50');
    try {
      await deleteComment(postId, commentId);
      li.remove();
      showUndoToast(TEXT.delComment, async () => {
        const recreated = await addComment(postId, snapshotBody);
        const list = document.querySelector<HTMLElement>(
          `[data-post-id="${postId}"] [data-comment-list]`
        );
        if (!list) return;
        const restored = document.createElement('li');
        restored.dataset.id = String(recreated.id);
        restored.dataset.owner = me;
        restored.className = 'comment rounded-lg bg-white/5 p-3';
        restored.innerHTML = `
          <div class="flex items-start gap-3">
            <img src="${
              recreated.author?.avatar || AVATAR_32
            }" class="size-8 rounded-full" alt="" />
            <div class="flex-1">
              <div class="text-sm">
                <span class="font-semibold">@${escapeHtml(
                  recreated.owner ?? me ?? TEXT.you
                )}</span>
                <span class="opacity-70">• ${
                  recreated.created
                    ? new Date(recreated.created).toLocaleString()
                    : TEXT.justNow
                }</span>
              </div>
              <div class="comment-body whitespace-pre-wrap">${escapeHtml(
                recreated.body
              )}</div>
              <div class="mt-2">
                <button type="button" class="text-xs opacity-70 hover:opacity-100"
                        data-delete-comment data-post-id="${postId}" data-comment-id="${
          recreated.id
        }">
                  Delete
                </button>
              </div>
            </div>
          </div>
        `;
        list.prepend(restored);
      });
    } catch (err) {
      li.classList.remove('opacity-50');
      console.error('Delete comment failed', err);
      showError(TEXT.delError);
    }
  });
}

bootFeedInteractions();

export function wireLikeAndComments(_root?: HTMLElement) {
  bootFeedInteractions();
}
