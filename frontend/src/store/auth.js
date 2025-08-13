import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setAuth } from '../lib/api';

export const useAuth = create(persist((set, get) => ({
  token: null,
  user: null,
  setSession: ({ token, user }) => {
    set({ token, user });
    setAuth(token);
  },
  clear: () => {
    set({ token: null, user: null });
    setAuth(null);
  },
}), { name: 'auth-store' }));

// Initialize auth header if token exists on load
const { token } = useAuth.getState();
if (token) setAuth(token);