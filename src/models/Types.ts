export interface Publication {
  id: number;
  title: string;
  description: string;
  category: string;
  data: string;
  author: string;
  isFavorite?: boolean;
}

export interface User {
  id: number;
  login: string;
  password?: string;
  favorites: number[];
}

export interface ApiResponse<T = any> {
  ok: boolean;
  message: string;
  data?: T | null;
  error?: { code?: number; message: string } | null;
}
