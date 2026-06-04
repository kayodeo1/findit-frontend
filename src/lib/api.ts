import type { AdminUser, Claim, Item, Paginated, StatusHistory, UserProfile } from "./types";

export interface RegisterPayload {
  email: string;
  password: string;
  role: string;
  first_name: string;
  middle_name?: string;
  last_name?: string;
  phone?: string;
  house_no?: string;
  street?: string;
  area?: string;
  lga?: string;
  city?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
const TOKEN_KEY = "findit_token";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function getAuthHeader(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiFetch<T>(
  path: string,
  options?: RequestInit,
  skipAuth = false,
  isFormData = false,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      // Let the browser set Content-Type for FormData (includes boundary)
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(skipAuth ? {} : getAuthHeader()),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    let detail = "";
    try {
      const body = await res.json();
      detail = body.detail ?? JSON.stringify(body);
    } catch {
      detail = await res.text();
    }
    throw new Error(detail || `Request failed with status ${res.status}`);
  }

  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return undefined as T;
  }
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

function qs(params?: Record<string, string | number | undefined>): string {
  if (!params) return "";
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== "",
  ) as [string, string][];
  if (entries.length === 0) return "";
  return `?${new URLSearchParams(entries)}`;
}

export const api = {
  auth: {
    login: (body: { email: string; password: string; role?: string }): Promise<{ token: string; user: UserProfile }> =>
      apiFetch("/users/login/", { method: "POST", body: JSON.stringify(body) }, true),
    register: (body: RegisterPayload): Promise<{ token: string; user: UserProfile }> =>
      apiFetch("/users/register/", { method: "POST", body: JSON.stringify(body) }, true),
  },

  users: {
    me: (): Promise<UserProfile> => apiFetch("/users/me/"),
    updateMe: (body: Partial<UserProfile>): Promise<UserProfile> =>
      apiFetch("/users/me/", { method: "PATCH", body: JSON.stringify(body) }),
    list: (params?: Record<string, string | undefined>): Promise<Paginated<AdminUser>> =>
      apiFetch(`/users/${qs(params)}`),
    get: (id: number): Promise<AdminUser> => apiFetch(`/users/${id}/`),
    update: (id: number, body: Partial<AdminUser>): Promise<AdminUser> =>
      apiFetch(`/users/${id}/`, { method: "PATCH", body: JSON.stringify(body) }),
    remove: (id: number): Promise<void> =>
      apiFetch(`/users/${id}/`, { method: "DELETE" }),
  },

  items: {
    list: (params?: Record<string, string | undefined>): Promise<Paginated<Item>> =>
      apiFetch(`/items/${qs(params)}`),
    listAll: (params?: Record<string, string | undefined>): Promise<Paginated<Item>> =>
      apiFetch(`/items/all/${qs(params)}`),
    get: (id: number): Promise<Item> => apiFetch(`/items/${id}/`),
    create: (formData: FormData): Promise<Item> =>
      apiFetch("/items/", { method: "POST", body: formData }, false, true),
    update: (id: number, body: Partial<Item>): Promise<Item> =>
      apiFetch(`/items/${id}/`, { method: "PATCH", body: JSON.stringify(body) }),
    remove: (id: number): Promise<void> =>
      apiFetch(`/items/${id}/`, { method: "DELETE" }),
  },

  claims: {
    list: (params?: Record<string, string | undefined>): Promise<Paginated<Claim>> =>
      apiFetch(`/claims/${qs(params)}`),
    listAll: (params?: Record<string, string | undefined>): Promise<Paginated<Claim>> =>
      apiFetch(`/claims/all/${qs(params)}`),
    get: (id: number): Promise<Claim> => apiFetch(`/claims/${id}/`),
    create: (body: { item: number; proof: string }): Promise<Claim> =>
      apiFetch("/claims/", { method: "POST", body: JSON.stringify(body) }),
    review: (
      id: number,
      body: {
        action: "approve" | "reject";
        rejection_reason?: string;
        release_date?: string;
        notes?: string;
      },
    ): Promise<Claim> =>
      apiFetch(`/claims/${id}/review/`, { method: "POST", body: JSON.stringify(body) }),
    query: (id: number, body: { admin_query: string }): Promise<Claim> =>
      apiFetch(`/claims/${id}/query/`, { method: "POST", body: JSON.stringify(body) }),
    history: (id: number): Promise<Paginated<StatusHistory>> =>
      apiFetch(`/claims/${id}/history/`),
  },
};
