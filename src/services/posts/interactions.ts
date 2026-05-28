import { post, put, del } from '../api/client';


export async function toggleReaction(postId: number, symbol = '❤️'): Promise<void> {
	await put(`/posts/${postId}/react/${encodeURIComponent(symbol)}`, {});
}

export async function addComment(postId: number, body: string, replyToId?: number) {
	const payload = { body, ...(replyToId ? { replyToId } : {}) };
	return post(`/posts/${postId}/comment`, payload) as Promise<{
		id: number;
		postId: number;
		body: string;
		owner: string;
		created: string;
		author?: { name: string; email: string; avatar?: string | null };
	}>;
}

export async function deleteComment(postId: number, commentId: number): Promise<void> {
	await del(`/posts/${postId}/comment/${commentId}`);
}
