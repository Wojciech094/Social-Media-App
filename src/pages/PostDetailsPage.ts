// src/pages/PostDetailsPage.ts
import { DateTime } from 'luxon';
import { getToken } from '../services/api/client';
import { getAllPosts } from '../services/posts/posts';
import type { Comment, MediaMaybe, Post } from '../types/noroff-types';
import escHtml from '../utils/escHtml';

const AVATAR_PLACEHOLDER = '/profile-avatar.png';
const COMMENT_AVATAR_PLACEHOLDER = 'https://placehold.co/32x32?text=%20';

function currentUserName(): string | null {
	try {
		const token = getToken();

		if (!token) return null;

		const middle = token.split('.')[1];

		if (!middle) return null;

		let base64 = middle.replace(/-/g, '+').replace(/_/g, '/');

		while (base64.length % 4) {
			base64 += '=';
		}

		const payload = JSON.parse(atob(base64));

		const name = payload?.name ?? payload?.username ?? payload?.user_name ?? payload?.sub;

		return typeof name === 'string' ? name : null;
	} catch {
		return null;
	}
}

function hasDataArray(value: unknown): value is { data: Post[] } {
	return Boolean(value) && typeof value === 'object' && Array.isArray((value as { data?: unknown }).data);
}

function getMedia(media: MediaMaybe | undefined | null): {
	url: string;
	alt: string;
} | null {
	if (typeof media === 'string' && media.trim()) {
		return {
			url: media,
			alt: 'Post image',
		};
	}

	if (media && typeof media === 'object' && media.url) {
		return {
			url: media.url,
			alt: media.alt || 'Post image',
		};
	}

	return null;
}

function getLikesCount(post: Post): number {
	const heartReaction = post.reactions?.find(reaction => reaction.symbol === '❤️');

	return heartReaction?.count ?? post._count?.reactions ?? 0;
}

function renderComments(comments: Comment[], currentUser: string | null, postId: number): string {
	if (comments.length === 0) {
		return `
			<li class="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-gray-400">
				No comments yet. Be the first to comment.
			</li>
		`;
	}

	return comments
		.slice()
		.sort((first, second) => new Date(second.created).getTime() - new Date(first.created).getTime())
		.map(comment => {
			const canDelete = Boolean(currentUser && comment.owner === currentUser);
			const avatar = comment.author?.avatar?.url || COMMENT_AVATAR_PLACEHOLDER;
			const avatarAlt = comment.author?.avatar?.alt || `${comment.owner} avatar`;

			return `
				<li
					class="comment rounded-xl border border-white/10 bg-white/5 p-4"
					data-id="${comment.id}"
					data-owner="${escHtml(comment.owner)}">
					<div class="flex items-start gap-3">
						<img
							src="${escHtml(avatar)}"
							alt="${escHtml(avatarAlt)}"
							class="h-9 w-9 shrink-0 rounded-full object-cover"
							onerror="this.onerror=null; this.src='${COMMENT_AVATAR_PLACEHOLDER}'"
						/>

						<div class="min-w-0 flex-1">
							<div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
								<span class="font-semibold text-white">
									@${escHtml(comment.owner)}
								</span>

								<span class="text-gray-400">
									${escHtml(new Date(comment.created).toLocaleString())}
								</span>
							</div>

							<p class="comment-body mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-200">
								${escHtml(comment.body)}
							</p>

							${
								canDelete
									? `
										<button
											type="button"
											data-delete-comment
											data-post-id="${postId}"
											data-comment-id="${comment.id}"
											class="mt-3 text-xs font-medium text-red-300 transition hover:text-red-200">
											Delete
										</button>
									`
									: ''
							}
						</div>
					</div>
				</li>
			`;
		})
		.join('');
}

export default async function PostDetailsPage(params: string[] = []): Promise<string> {
	const id = Number(params[0]);

	if (!Number.isFinite(id)) {
		return `
			<main class="flex min-h-screen items-center justify-center bg-gray-950 px-4 text-white">
				<p class="rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-center text-red-300">
					Invalid post ID.
				</p>
			</main>
		`;
	}

	let posts: Post[] = [];

	try {
		const raw: unknown = await getAllPosts();

		if (Array.isArray(raw)) {
			posts = raw as Post[];
		} else if (hasDataArray(raw)) {
			posts = raw.data;
		}
	} catch (error) {
		console.error('Could not load posts:', error);

		return `
			<main class="flex min-h-screen items-center justify-center bg-gray-950 px-4 text-white">
				<p class="rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-center text-red-300">
					Could not load this post.
				</p>
			</main>
		`;
	}

	const post = posts.find(item => Number(item.id) === id);

	if (!post) {
		return `
			<main class="flex min-h-screen items-center justify-center bg-gray-950 px-4 text-white">
				<p class="rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-center text-red-300">
					Post not found.
				</p>
			</main>
		`;
	}

	const me = currentUserName();

	const authorName = post.author?.name || 'Unknown user';
	const authorAvatar = post.author?.avatar?.url || AVATAR_PLACEHOLDER;
	const authorAvatarAlt = post.author?.avatar?.alt || `${authorName} avatar`;

	const media = getMedia(post.media);
	const title = post.title || 'Untitled post';
	const body = post.body || 'No description added.';

	const relativeTime = DateTime.fromISO(post.created).toRelative({ locale: 'en' }) || 'just now';

	const likes = getLikesCount(post);
	const comments = Array.isArray(post.comments) ? post.comments : [];
	const commentsCount = post._count?.comments ?? comments.length;

	const shouldShowFollow = Boolean(getToken()) && Boolean(post.author?.name) && post.author?.name !== me;

	return `
		<main class="min-h-dvh bg-gray-950 px-4 py-6 text-white sm:px-6 sm:py-10">
			<div class="mx-auto w-full max-w-3xl">
				<button
					id="back-to-feed"
					type="button"
					class="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition hover:text-white">
					<span aria-hidden="true">←</span>
					Back to Feed
				</button>

				<article
					class="overflow-hidden rounded-2xl border border-white/10 bg-gray-900 shadow-2xl"
					data-post
					data-post-id="${post.id}">

					<header class="flex flex-col gap-4 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
						<div class="flex min-w-0 items-center gap-3 sm:gap-4">
							<img
								src="${escHtml(authorAvatar)}"
								alt="${escHtml(authorAvatarAlt)}"
								class="h-12 w-12 shrink-0 rounded-full border border-gray-700 object-cover sm:h-14 sm:w-14"
								onerror="this.onerror=null; this.src='${AVATAR_PLACEHOLDER}'"
							/>

							<div class="min-w-0">
								<h1 class="break-words text-lg font-bold leading-snug text-white sm:text-2xl">
									${escHtml(title)}
								</h1>

								<p class="mt-1 text-xs text-gray-400 sm:text-sm">
									${escHtml(relativeTime)} · By
									<span class="font-semibold text-gray-200">
										${escHtml(authorName)}
									</span>
								</p>
							</div>
						</div>

						${
							shouldShowFollow
								? `
									<button
										type="button"
										data-follow-btn
										data-username="${escHtml(authorName)}"
										data-followed="false"
										class="follow-btn w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
										Follow
									</button>
								`
								: ''
						}
					</header>

					${
						media
							? `
								<figure class="border-b border-white/10 bg-gray-950">
									<img
										src="${escHtml(media.url)}"
										alt="${escHtml(media.alt || title)}"
										class="max-h-[34rem] w-full object-cover"
									/>
								</figure>
							`
							: ''
					}

					<div class="p-4 sm:p-6">
						<p class="whitespace-pre-wrap break-words text-base leading-8 text-gray-200 sm:text-lg">
							${escHtml(body)}
						</p>

						${
							Array.isArray(post.tags) && post.tags.length > 0
								? `
									<div class="mt-6 flex flex-wrap gap-2">
										${post.tags
											.map(
												tag => `
													<span class="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-gray-300">
														#${escHtml(String(tag))}
													</span>
												`,
											)
											.join('')}
									</div>
								`
								: ''
						}

						<div class="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
							<button
								type="button"
								data-like-btn
								data-post-id="${post.id}"
								data-symbol="❤️"
								data-liked="0"
								aria-pressed="false"
								aria-label="Like post"
								class="like-btn inline-flex items-center gap-2 rounded-full px-3 py-2 text-pink-400 transition hover:bg-white/10 hover:text-pink-300">
								<span aria-hidden="true">❤️</span>
								<span data-like-count class="text-sm font-semibold">${likes}</span>
							</button>

							<button
								type="button"
								data-comments-toggle
								data-post-id="${post.id}"
								class="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white">
								<span aria-hidden="true">💬</span>
								<span>${commentsCount}</span>
								<span class="underline">Hide</span>
							</button>
						</div>

						<section class="mt-7 border-t border-white/10 pt-6" aria-label="Comments">
							<h2 class="mb-4 text-lg font-semibold text-white">
								Comments
							</h2>

							<ul data-comment-list class="space-y-3">
								${renderComments(comments, me, post.id)}
							</ul>
						</section>

						<form
							data-comment-form
							data-post-id="${post.id}"
							class="mt-6">
							<label for="comment-text-${post.id}" class="sr-only">
								Write a comment
							</label>

							<textarea
								id="comment-text-${post.id}"
								name="comment"
								placeholder="Write a comment..."
								required
								rows="3"
								class="w-full resize-none rounded-xl border border-white/10 bg-gray-800 p-4 text-sm text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"></textarea>

							<button
								type="submit"
								class="mt-4 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
								Post Comment
							</button>
						</form>
					</div>
				</article>
			</div>
		</main>
	`;
}
