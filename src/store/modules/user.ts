import { defineStore } from 'pinia'
import { store } from '~/store'
import { service } from '~/api'
import { useAuthLocalStore, useAuthSessionStore } from '~/stores/token'

export interface UserInfoType {
  username: string
  email?: string
}

export interface IUserState {
  token: string
  userId: number
  welcome: string
  avatar: string
  info: UserInfoType
}
const localStore = useAuthLocalStore()
const sessionStore = useAuthSessionStore()
export const useUserStore = defineStore({
  id: 'USER_INFO',
  state: (): IUserState => ({
    token: localStore.token || sessionStore.token,
    userId: 0,
    welcome: '',
    avatar: '',
    info: { username: '', email: '' },
  }),
  getters: {
    getToken(): string {
      return this.token
    },
    getUserId(): number {
      return this.userId
    },
    getAvatar(): string {
      return this.avatar
    },
    getUserInfo(): UserInfoType {
      return this.info
    },
  },
  actions: {
    setToken(token: string) {
      this.token = token
    },
    setUserId(userId: number) {
      this.userId = userId
    },
    setAvatar(avatar: string) {
      this.avatar = avatar
    },
    setUserInfo(info: UserInfoType) {
      this.info = info
    },

    // 登出
    async logout() {
      await service.post('/logout')
      localStore.token = ''
      sessionStore.token = ''
      this.setToken('')
      this.setUserInfo({ username: '', email: '' })
    },
  },
  persist: {
    storage: localStorage,
  },
})

export function useUser() {
  return useUserStore(store)
}
