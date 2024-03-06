import { defineStore } from 'pinia'
import { store } from '~/store'
import { service } from '~/utils/request'
import { useAuthLocalStore, useAuthSessionStore } from '~/stores/token'

// import { ACCESS_TOKEN, CURRENT_USER, IS_SCREENLOCKED } from '~/store/mutation-types'
// import { ResultEnum } from '~/enums/httpEnum'
// import { getUserInfo as getUserInfoApi, login } from '~/api/system/user'
// import { storage } from '~/utils/Storage'

export interface UserInfoType {
  username: string
  email?: string
}

export interface IUserState {
  token: string
  userId: number
  welcome: string
  avatar: string
  serverList: Map<number, any[]>
  info: UserInfoType
}
const localStore = useAuthLocalStore()
const sessionStore = useAuthSessionStore()
export const useUserStore = defineStore({
  id: 'app-user',
  state: (): IUserState => ({
    // token: storage.get(ACCESS_TOKEN, ''),
    token: '',
    userId: 0,
    welcome: '',
    avatar: '',
    serverList: new Map<number, any[]>(),
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
    getServerList(): Map<number, any[]> {
      return this.serverList
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
    setServerList(serverList: any) {
      this.serverList = serverList
    },
    setUserInfo(info: UserInfoType) {
      this.info = info
    },
    // 登录
    // async login(params: any) {
    //   const response = await login(params)
    //   const { result, code } = response
    //   if (code === ResultEnum.SUCCESS) {
    //     const ex = 7 * 24 * 60 * 60
    //     storage.set(ACCESS_TOKEN, result.token, ex)
    //     storage.set(CURRENT_USER, result, ex)
    //     storage.set(IS_SCREENLOCKED, false)
    //     this.setToken(result.token)
    //     this.setUserInfo(result)
    //   }
    //   return response
    // },

    // 获取用户信息
    // async getInfo() {
    //   const result = await getUserInfoApi()
    //   if (result.permissions && result.permissions.length) {
    //     const permissionsList = result.permissions
    //     this.setPermissions(permissionsList)
    //     this.setUserInfo(result)
    //   }
    //   else {
    //     throw new Error('getInfo: permissionsList must be a non-null array !')
    //   }
    //   this.setAvatar(result.avatar)
    //   return result
    // },

    // 登出
    async logout() {
      await service.post('/logout')
      localStore.token = ''
      sessionStore.token = ''
      this.setUserInfo({ username: '', email: '' })
      // storage.remove(ACCESS_TOKEN)
      // storage.remove(CURRENT_USER)
    },
  },
  persist: {
    storage: localStorage,
  },
})

// Need to be used outside the setup
export function useUser() {
  return useUserStore(store)
}
