import type { Post } from './noroff-types';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  image: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoggedIn: boolean;
  // https://docs.noroff.dev/docs/v2/authentication
  accessToken: string;
  refreshToken: string;
  apiKey: string;
}

export interface AppState {
  posts: Post[];
  auth?: AuthState;
  currentPage?: string;
}

export interface Meta {
  barcode: string;
  createdAt: Date;
  qrCode: string;
  updatedAt: Date;
}

// Create a clean object to send to our service
export interface ErrorReport {
  message: string;
  stack: string;
  timestamp: string;
  url: string;
}

// ## Define our custom error types

export class ValidationError extends Error {
  constructor(message: string) {
    // Call the parent constructor
    super(message);
    // Set the error name to the class name
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  bio?: string;
}

// ## API Response interfaces

export interface ApiResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    code?: string;
  }>;
}

export interface LoginResponse {
  accessToken: string;
  name: string;
  email: string;
}

export interface RegisterResponse {
  accessToken: any;
  name: string;
  email: string;
  id: number;
}

export type ProfileResponse = {
  name: string;
  avatar?: { url?: string; alt?: string } | string;
  bio?: string;
  _count?: { followers?: number; following?: number; posts?: number };
  followers?: any[];
  following?: any[];
};

export type PostItem = {
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

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: {
    url: string;
    alt?: string;
  };
}

// ## Form handling interfaces

export interface FormElements {
  [key: string]: HTMLInputElement | HTMLTextAreaElement;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: string[];
}
