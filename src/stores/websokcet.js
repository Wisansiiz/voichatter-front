import { defineStore } from 'pinia'

export const websocketStore = defineStore(
  'websocket',
  {
    state: () => ({
      msg: '',
    }),
    persist: {
      storage: localStorage,
    },
  },
)
