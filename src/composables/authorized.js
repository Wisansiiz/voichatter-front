import { baseURL, service } from '~/composables/interceptor.js'

const localStore = useAuthLocalStore()
const sessionStore = useAuthSessionStore()

export async function isOnline(success) {
  await service.post(`${baseURL}/auth`).then((res) => {
    if (res.code === 200)
      success(true)
  }).catch(() => {
    success(false)
  })
}

export async function register({ email, password, username }) {
  return await service.post('/register', { email, password, username })
}

export async function login({ username, password }) {
  return await service.post('/login', { username, password })
}

export async function logout() {
  await service.post('/logout').then((res) => {
    if (res.code === 200) {
      gMessage.success(res.msg)
      return
    }
    localStore.token = null
    sessionStore.token = null
    gMessage.success(res.msg)
  })
}
