import axios from 'axios'
import { useAuthStore } from '~/composables/auth.js'
import { gLoadingBarDone } from '~/composables/gDiscreteApi'

const baseURL = 'http://localhost:9000/api'
const service = axios.create({ baseURL, timeout: 5000 })
const errMsg = '服务异常'
const authStore = useAuthStore()
service.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.token)
    config.headers.Authorization = `Bearer ${authStore.token}`
  return config
})
service.interceptors.response.use(
  (result) => {
    if (result.data.code === 200) {
      return result.data
    }
    else {
      authStore.token = null
      return result.data
    }
    // router.push('/login').then(() => {
    //   gMessage.warning('登录已失效，请重新登录')
    // })
    // gMessage.error(result.data.msg || errMsg)
    // gLoadingBarDone.error()
    // return Promise.reject(result.data)
  },
  (err) => {
    gMessage.error(errMsg)
    gLoadingBarDone.error()
    return Promise.reject(err)
  },
)

export function isOnline(success) {
  service.post(`${baseURL}/auth`).then((data) => {
    if (data.code === 200 && data.data.expires > Math.round(new Date().getTime() / 1000)) {
      success(true)
    }
    else {
      success(false)
      gMessage.warning('登录已失效，请重新登录')
    }
  })
}

export { service }

export async function login({ username, password }) {
  const res = await service.post(
    '/login',
    { username, password },
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
  )
  return res.data
}

export async function logout() {
  const authStore = useAuthStore()
  authStore.token = null
  // router.push('/login').then(() => {
  gMessage.warning('登录已失效，请重新登录')
  // })
}

export async function register({ email, password, name }) {
  const res = await service.post('/register', { email, password, name })
  return res.data
}
