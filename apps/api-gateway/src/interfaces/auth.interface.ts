export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthData {
  user: User;
  token?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthData | null;
}
