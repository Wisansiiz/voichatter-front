import axios from 'axios'
import { useAuthLocalStore, useAuthSessionStore } from '~/stores/token.js'

const localStore = useAuthLocalStore()
const sessionStore = useAuthSessionStore()
const baseURL = 'http://localhost:9000/api'
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
    if (result.data.code === 200) {
      return result.data
    }
    else {
      sessionStore.token = null
      localStore.token = null
      window.location.href = '/login'
      gMessage.error('登录失效，请重新登录')
    }
  },
  (err) => {
    return Promise.reject(err)
  },
)
export { service, baseURL }
