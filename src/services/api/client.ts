import { API_URL } from '../../constants';
import { getLocalItem, setLocalItem } from '../../utils/storage';
import { ApiError } from '../error/error';

type ApiClientOptions = Omit<RequestInit, 'body'> & {
  body?: BodyInit | Record<string, any> | null | undefined;
};

type Endpoint = string;

const API_KEY_HEADER = 'X-Noroff-API-Key';

/* ------------------------- TOKEN HELPERS ------------------------- */

export function getToken(): string | null {
  const raw =
    getLocalItem<string>('accessToken') ??
    getLocalItem<string>('token') ??
    null;

  if (!raw) return null;
  if (typeof raw === 'string') return raw;

  try {
    const asObj =
      typeof raw === 'object' ? raw : JSON.parse(String(raw ?? 'null'));
    if (asObj && typeof asObj === 'object') {
      if (typeof (asObj as any).accessToken === 'string')
        return (asObj as any).accessToken;
      if (typeof (asObj as any).token === 'string') return (asObj as any).token;
    }
  } catch {}
  return null;
}

export function setToken(token: string) {
  setLocalItem('accessToken', token);
}

/* ------------------------- CORE CLIENT ------------------------- */

export async function apiClient<T = unknown>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const { body, ...customOptions } = options;

  const config: RequestInit = {
    method: body
      ? customOptions.method ?? 'POST'
      : customOptions.method ?? 'GET',
    ...customOptions,
    headers: {
      ...(customOptions.headers || {}),
    },
  };

  const apiKey = getLocalItem<string>('apiKey');
  const accessToken = getToken();
  if (apiKey)
    (config.headers as Record<string, string>)[API_KEY_HEADER] = apiKey;
  if (accessToken)
    (config.headers as Record<string, string>)[
      'Authorization'
    ] = `Bearer ${accessToken}`;

  // Handle body payload
  if (body !== undefined && body !== null) {
    if (body instanceof FormData) {
      config.body = body;
    } else if (typeof body === 'string' || body instanceof Blob) {
      config.body = body as BodyInit;
      if (typeof body === 'string') {
        (config.headers as Record<string, string>)['Content-Type'] =
          (config.headers as Record<string, string>)['Content-Type'] ??
          'application/json';
      }
    } else {
      (config.headers as Record<string, string>)['Content-Type'] =
        (config.headers as Record<string, string>)['Content-Type'] ??
        'application/json';
      config.body = JSON.stringify(body);
    }
  }

  // Ensure clean URL
  const baseRaw = API_URL.replace(/\/+$/, '');
  let path = endpoint.replace(/^\/+/, '');

  // remove double /social prefix if passed accidentally
  if (baseRaw.endsWith('/social') && /^social\/?/i.test(path)) {
    path = path.replace(/^social\/?/i, '');
  }

  const url = `${baseRaw}/${path}`;

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get('content-type') ?? '';

    if (response.status === 204 || !contentType.includes('application/json')) {
      if (!response.ok)
        throw new ApiError(`HTTP Error: ${response.status}`, response.status);
      return null as T;
    }

    const data = await response.json();
    if (!response.ok) {
      const message =
        data?.errors?.[0]?.message || `HTTP Error: ${response.status}`;
      throw new ApiError(message, response.status);
    }

    // Filter out invalid media
    if (Array.isArray(data)) {
      return data.filter(
        (item) => item?.media?.url !== '' && item?.url !== ''
      ) as T;
    }

    return data as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new Error('A network or client error occurred.');
  }
}

/* ------------------------- API HELPERS ------------------------- */

export function api<T = unknown>(endpoint: string, options?: ApiClientOptions) {
  return apiClient<T>(endpoint, options);
}

function buildQuery(params: Record<string, any>) {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join('&');
}

export const get = <T = unknown>(endpoint: Endpoint): Promise<T> =>
  apiClient<T>(endpoint, { method: 'GET' });

export const post = <TBody extends Record<string, any>, TResp = unknown>(
  endpoint: Endpoint,
  body: TBody
): Promise<TResp> => apiClient<TResp>(endpoint, { method: 'POST', body });

export const put = <TBody extends Record<string, any>, TResp = unknown>(
  endpoint: Endpoint,
  body: TBody
): Promise<TResp> => apiClient<TResp>(endpoint, { method: 'PUT', body });

export const del = <TResp = unknown>(endpoint: Endpoint): Promise<TResp> =>
  apiClient<TResp>(endpoint, { method: 'DELETE' });

/* ------------------------- POSTS ------------------------- */

interface PaginationParams {
  page?: number;
  limit?: number;
  [key: string]: any;
}

export const getPosts = <T = unknown>(
  paginationParams: PaginationParams = {}
): Promise<T> => {
  const query = buildQuery(paginationParams);
  const endpoint = `/posts${query ? `?${query}` : ''}`;
  return get<T>(endpoint);
};

// Create a new post
export const createPost = <TResp = unknown>(
  postData: Record<string, any>
): Promise<TResp> => post('/posts', postData);

// Update an existing post by ID
export const updatePost = <TResp = unknown>(
  id: string,
  postData: Record<string, any>
): Promise<TResp> => put(`/posts/${id}`, postData);

// Delete a post by ID
export const deletePost = <TResp = unknown>(id: string): Promise<TResp> =>
  del(`/posts/${id}`);

/* ------------------------- COMMENTS ------------------------- */

// ✅ FIXED: correct endpoint for adding a comment
export const addComment = <TResp = unknown>(
  postId: string,
  commentData: Record<string, any>
): Promise<TResp> => post(`/posts/${postId}/comment`, commentData);

/* ------------------------- AUTH ------------------------- */

export async function loginUser(data: { email: string; password: string }) {
  const response = await fetch('https://v2.api.noroff.dev/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await response.json();
  const token = json?.data?.accessToken || json?.accessToken;
  if (typeof token === 'string') setToken(token);
  return json;
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const response = await fetch('https://v2.api.noroff.dev/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}

/* ------------------------- API KEY ------------------------- */

export async function fetchApiKey(
  accessToken: string
): Promise<string | undefined> {
  const response = await fetch(
    'https://v2.api.noroff.dev/auth/create-api-key',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch API key: ${response.status} ${response.statusText}`
    );
  }
  const data = await response.json();
  const key = data?.data?.key;
  if (typeof key === 'string') {
    setLocalItem('apiKey', key);
  }
  return key;
}
