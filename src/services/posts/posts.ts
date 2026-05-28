import { get } from '../api/client';
import type { Post } from '../../types/noroff-types';

export async function getAllPosts(): Promise<Post[]> {
  return get<Post[]>(`/posts?_author=true&_reactions=true&_comments=true`);
}

export async function getPostById(id: number): Promise<Post> {
  return get<Post>(`/posts/${id}?_author=true&_reactions=true&_comments=true`);
}
