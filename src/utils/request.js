import axios from 'axios'
import { useAuthLocalStore, useAuthSessionStore } from '~/stores/token.js'
import { router } from '~/router'

const localStore = useAuthLocalStore()
const sessionStore = useAuthSessionStore()
const baseURL = 'https://192.168.31.198:9000'
const service = axios.create({ baseURL, timeout: 10000 })
service.interceptors.request.use((config) => {
  if (sessionStore.token)
    config.headers.Authorization = `Bearer ${sessionStore.token}`
  else if (localStore.token)
    config.headers.Authorization = `Bearer ${localStore.token}`
  return config
}, (err) => {
  return Promise.reject(err)
})
service.interceptors.response.use(
  async (result) => {
    if (result.data.code === 200 || result.data.code === 0) {
      return result.data
    }
    else if (result.data.code !== 200 || result.data.code === 0) {
      gMessage.error(result.data.message)
      // if (router.currentRoute.value.path !== '/login')
      //   await router.push('/login')
    }
    return Promise.reject(result.data)
  },
  (err) => {
    return Promise.reject(err)
  },
)
export { service, baseURL }
