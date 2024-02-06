import axios from 'axios'

const localStore = useAuthLocalStore()
const sessionStore = useAuthSessionStore()
const baseURL = 'http://localhost:9000/api'
const service = axios.create({ baseURL, timeout: 5000 })
service.interceptors.request.use((config) => {
  if (localStore.token)
    config.headers.Authorization = `Bearer ${localStore.token}`
  if (sessionStore.token)
    config.headers.Authorization = `Bearer ${sessionStore.token}`
  return config
})
service.interceptors.response.use(
  (result) => {
    if (/^20[0-9]$/.test(result.data.code)) {
      return result.data
    }
    else {
      localStore.token = null
      sessionStore.token = null
    }
    return Promise.reject(result.data)
  },
  (err) => {
    return Promise.reject(err)
  },
)
export { service, baseURL }
