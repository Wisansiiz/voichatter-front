import { baseURL, service } from '~/utils/request.js'
import { useAuthLocalStore, useAuthSessionStore } from '~/stores/token.js'

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
  await service.post('/logout').then((data) => {
    localStore.token = null
    sessionStore.token = null
    gMessage.success(data.msg)
  })
}
