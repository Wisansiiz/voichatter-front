import { baseURL, service } from '~/composables/interceptor.js'

const localStore = useAuthLocalStore()
const sessionStore = useAuthSessionStore()

function ok(code) {
  return /^2[0-9][0-9]$/.test(code)
}

export async function isOnline(success) {
  await service.post(`${baseURL}/auth`).then((res) => {
    if (ok(res.code)) {
      success(true)
    }
    else {
      success(false)
      gMessage.warning('登录已失效，请重新登录')
    }
  }).catch(() => {
    success(false)
    gMessage.warning('登录已失效，请重新登录')
  })
}

export async function register({ email, password, username }) {
  return await service.post('/register', { email, password, username })
}

export async function login({ username, password }) {
  return await service.post(
    '/login',
    { username, password },
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
  )
}

export async function logout() {
  await service.post('/logout').then((res) => {
    if (!ok(res.code)) {
      gMessage.error(res.msg)
      return
    }
    localStore.token = null
    sessionStore.token = null
    gMessage.success(res.msg)
  })
}
