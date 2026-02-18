export type Role = "admin" | "user";

export interface AuthPayload {
  sub: string;
  email?: string;
  role?: Role;
  exp?: number;
  iat?: number;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: {
    id: string;
    email: string;
    role: Role;
  };
}

export interface RegisterInput {
  email: string;
  password: string;
  full_name?: string;
}
