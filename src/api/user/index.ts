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
        await router.push('/')
        window.$message.success('登录成功')
        storage.set('ACCESS_TOKEN', userStore.token)
      }
      else {
        window.$message.error(data.message)
      }
    })
    .finally(() => {
      isLoading.value = false
    })
}
export function userRegister(formRef: any, model: Ref<UnwrapRef<{
  password: null
  reenteredPassword: null
  email: string
  username: null
}>>) {
  formRef.value?.validate(async (errors: any) => {
    if (!errors) {
      await service.post('/register', model)
      window.$message.success('注册成功！')
    }
    else { window.$message.warning('请完整填写注册表单内容！') }
  })
}
export async function userLogout() {
  await service.post('/logout').then(() => {
    storage.clear()
    window.$message.success('退出成功')
  }).then(() => router.push('/login'))
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
