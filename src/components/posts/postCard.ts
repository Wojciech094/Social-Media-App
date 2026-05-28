import type { Post } from '../../types/noroff-types';
import { getToken } from '../../services/api/client';

const safe = (v?: string | null, fallback = '') =>
  v && String(v).trim() ? String(v) : fallback;
const AVATAR_48 = 'https://placehold.co/48x48?text=%20';
const AVATAR_32 = 'https://placehold.co/32x32?text=%20';

function media(post: Post): { url: string; alt: string } {
  const m: any = post.media;
  if (typeof m === 'string') return { url: m, alt: post.title || 'media' };
  if (m && typeof m === 'object')
    return { url: m.url || '', alt: m.alt || post.title || 'media' };
  return { url: '', alt: post.title || 'media' };
}

function likesCount(p: Post) {
  const heart = p.reactions?.find((r) => r.symbol === '❤️');
  return heart?.count ?? p._count?.reactions ?? 0;
}
function commentsCount(p: Post) {
  return p._count?.comments ?? p.comments?.length ?? 0;
}

// decode current user's name from JWT
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
const ME = currentUserName();

export default function postCard(p: Post, _index?: number) {
  const { url, alt } = media(p);
  const likeCounter = likesCount(p);
  const commentCounter = commentsCount(p);

  return `
  <article
class="post-card h-full flex flex-col rounded-xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur-md shadow-md hover:shadow-lg hover:shadow-blue-900/30 hover:ring-blue-600/50 transition-all duration-300"
    data-post data-post-id="${p.id}">

    <header class="flex items-center justify-between gap-3 mb-3">
      <img src="${safe(
        typeof p.author?.avatar === 'object' && p.author.avatar !== null
          ? (p.author.avatar as { url?: string }).url
          : null,
        AVATAR_48
      )}" alt="${safe(
    p.author?.avatar?.alt,
    'User avatar'
  )}" class="size-10 rounded-full object-cover" onerror="this.src='${AVATAR_48}'" />
      <div>
        <div class="font-semibold clamp-1">${safe(
          p.author?.name,
          'Unknown'
        )}</div>
        <div class=" text-xs md:text-s opacity-70">${new Date(
          p.created
        ).toLocaleString()}</div>
      </div>

     ${
       ME && p.author?.name !== ME && getToken()
         ? `<button
      type="button"
      class="follow-btn px-3 py-1 rounded-lg bg-green-500/70 hover:bg-green-800 text-white text-md transition cursor-pointer"
      data-follow-btn
      data-username="${p.author?.name}"
      data-followed="false"
    >
      Follow
    </button>`
         : ''
     }
    </header>

    ${
      url
        ? `
      <div class="w-full rounded-lg overflow-hidden aspect-[16/9] mb-3 bg-white/10">
        <img src="${url}" alt="${alt}" class="w-full h-full object-cover" onerror="this.style.display='none'"/>
      </div>`
        : ''
    }

    ${
      p.title
        ? `<h3 class="text-lg font-bold mb-1 clamp-1">${p.title}</h3>`
        : ''
    }
    ${
      p.body
        ? `<p class="opacity-90 mb-3 whitespace-pre-wrap clamp-3">${p.body}</p>`
        : ''
    }

    <div class="mt-auto">
      <div class="flex items-center justify-between gap-6 text-sm mb-3">
        <button
          type="button"
          class="like-btn inline-flex md:text-lg items-center gap-1 px-3 py-1 rounded-full hover:ring-1 hover:ring-white/30 cursor-pointer"
          data-like-btn data-post-id="${p.id}" data-symbol="❤️" data-liked="0"
          aria-pressed="false" aria-label="Like">
          ❤️ <span data-like-count>${likeCounter}</span>
        </button>

        <button type="button" class="inline-flex items-center gap-1 opacity-80 cursor-pointer"
                data-comments-toggle data-post-id="${p.id}">
          💬 <span>${commentCounter}</span> <span class="underline ml-1">Show</span>
        </button>
      </div>

      <a href="/post/${p.id}" data-link
         class="inline-block mb-3 px-3 py-1 rounded-md bg-blue-600 text-white text-sm md:text-base hover:bg-blue-700 transition">
        View post →
      </a>

      <form data-comment-form data-post-id="${
        p.id
      }" class="flex flex-wrap items-center gap-2">
        <input name="comment" placeholder="Write a comment…" class="flex-1 px-3 py-2 rounded-lg bg-white/10 ring-1 ring-white/15 focus:outline-none" autocomplete="off" />
        <button type="submit" class="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 cursor-pointer">Send</button>
      </form>

      <ul data-comment-list class="space-y-3 hidden mt-3">
        ${(p.comments ?? [])
          .slice()
          .sort((a, b) => +new Date(b.created) - +new Date(a.created))
          .map((c) => {
            const canDelete = ME && c.owner === ME;
            return `
            <li class="comment rounded-lg bg-white/5 p-3" data-id="${
              c.id
            }" data-owner="${c.owner}">
              <div class="flex items-start gap-3">
                <img src="${safe(
                  c.author?.avatar?.url,
                  AVATAR_32
                )}" alt="${safe(
              c.author?.avatar?.alt,
              'User avatar'
            )}" class="size-8 rounded-full object-cover" onerror="this.src='${AVATAR_32}'" />
                <div class="flex-1">
                  <div class="text-sm">
                    <span class="font-semibold">@${c.owner}</span>
                    <span class="opacity-70">• ${new Date(
                      c.created
                    ).toLocaleString()}</span>
                  </div>
                  <div class="comment-body whitespace-pre-wrap">${
                    c.body ?? ''
                  }</div>
                  <div class="mt-2">
                    ${
                      canDelete
                        ? `
                      <button type="button" class="text-xs opacity-70 hover:opacity-100"
                              data-delete-comment data-post-id="${p.id}" data-comment-id="${c.id}">
                        Delete
                      </button>`
                        : ``
                    }
                  </div>
                </div>
              </div>
            </li>`;
          })
          .join('')}
      </ul>
    </div>
  </article>
  `;
}
