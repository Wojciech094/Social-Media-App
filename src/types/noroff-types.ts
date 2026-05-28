export type ProfileMini = {
  name?: string;
  email?: string;
  bio?: string | null;
  banner?: { url?: string } | null;
  avatar?: {
    url?: string;
    alt?: string;
  } | null;
};

export type Reaction = { symbol: string; count: number };

export type Comment = {
  id: number;
  postId: number;
  body: string;
  owner: string;
  created: string;
  author?: ProfileMini;
};

export type MediaMaybe =
  | string
  | { url?: string | null; alt?: string | null }
  | null;

export type Post = {
  tags: any;
  id: number;
  title?: string | null;
  body?: string | null;
  media?: MediaMaybe | null; // explicitly allow null or undefined
  created: string;
  author?: ProfileMini;
  _count?: {
    comments: number;
    reactions: number;
  };
  reactions?: Reaction[];
  comments?: Comment[];
};
