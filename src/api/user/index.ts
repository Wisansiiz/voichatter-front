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
      userStore.setAvatar(data.data.avatar)
      userStore.setToken(data.data.token)
      if (localStore.token || sessionStore.token) {
        await router.push('/')
        gMessage.success('登录成功')
      }
      else {
        gMessage.error(data.message)
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
      gMessage.success('注册成功！')
    }
    else { gMessage.warning('请完整填写注册表单内容！') }
  })
}
export async function userLogout() {
  await service.post('/logout').then(() => {
    localStore.token = ''
    sessionStore.token = ''
    gMessage.success('退出成功')
  }).then(() => router.push('/login'))
}
