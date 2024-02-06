import { defineStore } from 'pinia'

export const useAuthSessionStore = defineStore(
  'auth-session',
  {
    state: () => ({
      token: '',
    }),
    persist: {
      storage: sessionStorage,
    },
  },
)
export const useAuthLocalStore = defineStore(
  'auth-local',
  {
    state: () => ({
      token: '',
    }),
    persist: {
      storage: localStorage,
    },
  },
)
