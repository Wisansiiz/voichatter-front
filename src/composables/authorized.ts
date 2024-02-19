import { service } from '~/utils/request.js'
import { useAuthLocalStore, useAuthSessionStore } from '~/stores/token.js'
import { router } from '~/router'

const localStore = useAuthLocalStore()
const sessionStore = useAuthSessionStore()

interface registerResponse {
  email: string
  password: string
  username: string
}
interface loginResponse {
  password: string
  username: string
}
export async function register({ email, password, username }: registerResponse) {
  return await service.post('/register', { email, password, username })
}

export async function login({ username, password }: loginResponse) {
  return await service.post('/login', { username, password })
}

export async function logout() {
  await service.post('/logout').then((data: any) => {
    localStore.token = ''
    sessionStore.token = ''
    gMessage.success(data.messages)
  }).then(() => router.push('/login'))
}
