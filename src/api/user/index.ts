import type { UnwrapRef } from 'vue'
import { service } from '~/api'
import { useAuthLocalStore, useAuthSessionStore } from '~/stores/token'
import { useUserStore } from '~/store/modules/user'
import { router } from '~/router'

const localStore = useAuthLocalStore()
const sessionStore = useAuthSessionStore()
const userStore = useUserStore()
export async function userLogin(isLoading: Ref<UnwrapRef<boolean>>, model: Ref<UnwrapRef<{
  password: null
  username: null
  remember: boolean
}>>) {
  isLoading.value = true
  service.post('/login', (model.value))
    .then(async (data: any) => {
      if (model.value.remember)
        localStore.token = data.data.token
      else sessionStore.token = data.data.token
      userStore.setUserInfo({ username: data.data.username })
      userStore.setUserId(data.data.userId)
      userStore.setAvatar(data.data.avatarUrl)
      userStore.setToken(data.data.token)
      if (localStore.token || sessionStore.token) {
        window.$message.success('登录成功')
        storage.set('ACCESS_TOKEN', userStore.token)
        await router.push('/')
      }
      else {
        window.$message.error(data.message)
      }
    })
    .finally(() => {
      isLoading.value = false
    })
}
export async function userRegister(model: { username: string, password: string, email: string, reenteredPassword: string, code: string, id: string }) {
  return await service.post('/register', model)
}
export async function userLogout() {
  await service.post('/logout').then(() => {
    storage.clear()
    window.$message.success('退出成功')
  }).then(() => router.push('/login'))
}

export async function codeApi() {
  return await service.get('/api/code')
}

export async function userList(serverId: any) {
  const res: { data: { users: any } } = await service.get(`/users/${serverId}`)
  return res.data.users
}
/**
 * Request
 */
export interface Response {
  code: number
  data: null | Data
  message: string
  [property: string]: any
}

export interface Data {
  userInput: UserInput
  [property: string]: any
}

export interface UserInput {
  serverId: number
  SPermissions: string
  userId: number
  [property: string]: any
}

export async function modifyUserSPermissionsApi(serverId: any, userInfo: any) {
  const { userId, username, sPermissions } = userInfo.value
  try {
    const res: Response = await service.put(`/user/${serverId}`, { userId, username, sPermissions })
    return res.data?.userInput
  }
  catch (e) {
    return undefined
  }
}

export function modifyUserInfoApi(userInfo: any) {
  const { username, avatarUrl } = userInfo
  return service.put(`/user`, { username, avatarUrl })
}

export interface uploadAvatarApiResponse {
  code: number
  data: uploadAvatarApiData
  message: string
  [property: string]: any
}

export interface uploadAvatarApiData {
  userInfo: UserInfo
  [property: string]: any
}

export interface UserInfo {
  avatarUrl: string
  email: string
  userId: number
  username: string
  [property: string]: any
}

export async function uploadAvatarApi(file: any) {
  const formData = new FormData()
  formData.append('file', file)
  const res: uploadAvatarApiResponse = await service.put('/user/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return res.data.userInfo
}

export async function removeUserApi(serverId: any, userId: any) {
  await service.delete(`/user/${serverId}/${userId}`)
}

export async function userInfoUpdateApi(userInfo: any) {
  const res: { data: any } = await service.put('/user/info', userInfo)
  // console.log(res.data.userInfo)
  return res.data.userInfo
}
