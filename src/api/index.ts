import axios from 'axios'
import { useAuthLocalStore, useAuthSessionStore } from '~/stores/token.js'
import { router } from '~/router'

const localStore = useAuthLocalStore()
const sessionStore = useAuthSessionStore()
const baseURL = 'https://192.168.31.198:9000'
const wssBase = 'wss://192.168.31.198:9000'
const service = axios.create({ baseURL, timeout: 10000 })
service.interceptors.request.use((config) => {
  if (sessionStore.token || localStore.token)
    config.headers.Authorization = `Bearer ${sessionStore.token || localStore.token}`
  return config
})
service.interceptors.response.use(
  async (result) => {
    if (result.data.code === 0)
      return result.data
    window.$message.error(result.data.message)
    if (!storage.get('ACCESS_TOKEN') && router.currentRoute.value.path !== '/login') {
      await router.push('/login')
      storage.clear()
    }
    else if (result.data.message === 'Operation Failed: 权限不足') {
      router.back()
    }
    else if (result.data.message === '验证失败') {
      await router.push('/login')
    }
    return Promise.reject(result.data)
  },
  (err) => {
    if (err.code === 'ECONNABORTED' || err.code === 'ERR_NETWORK')
      window.$message.error('请求超时, 请稍后再试')
    window.$loadingBar.error()
    return Promise.reject(err)
  },
)

export { service, wssBase, baseURL }
