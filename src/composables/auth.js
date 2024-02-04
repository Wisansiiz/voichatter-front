import { defineStore } from 'pinia'

export const useAuthStore = defineStore(
  'authorize',
  {
    state: () => ({
      token: '',
    }),
  },
)
