import { defineStore } from 'pinia'

export const useServerName = defineStore(
  'serverName',
  {
    state: () => ({
      name: '',
    }),
    persist: {
      storage: localStorage,
    },
  },
)
