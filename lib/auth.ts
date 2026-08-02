import { useSyncExternalStore } from "react";

export type UserRole = "TENANT" | "LANDLORD" | "ADMIN";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}

const TOKEN_KEY = "rentnest_token";
const USER_KEY = "rentnest_user";

let cachedUser: AuthUser | null | undefined;
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  if (cachedUser !== undefined) return cachedUser;

  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) {
    cachedUser = null;
    return null;
  }
  try {
    cachedUser = JSON.parse(raw) as AuthUser;
  } catch {
    cachedUser = null;
  }
  return cachedUser;
}

export function setStoredAuth(token: string, user: AuthUser) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  cachedUser = user;
  emitChange();
}

export function clearStoredAuth() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  cachedUser = null;
  emitChange();
}

export function subscribeAuth(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = () => {
    cachedUser = undefined;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useAuthUser(): AuthUser | null {
  return useSyncExternalStore(subscribeAuth, getStoredUser, () => null);
}
