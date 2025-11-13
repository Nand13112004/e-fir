import { create } from 'zustand';

export const useAuth = create((set) => ({
  token: null,
  user: null,
  login: (payload) => set(payload),
  logout: () => set({ token: null, user: null })
}));


