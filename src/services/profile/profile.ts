// src/services/profile/profile.ts
import { apiClient, getToken } from '../api/client';

export async function getCurrentProfile() {
  const token = getToken();
  if (!token) throw new Error('No token found');

  // Noroff API endpoint for the logged-in user
  const data = await apiClient<{ data: any }>('/social/profiles/me', {
    method: 'GET',
  });

  // Some Noroff endpoints return { data: { ... } }, others just { ... }
  return (data as any)?.data ?? data;
}
