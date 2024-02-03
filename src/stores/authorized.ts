import axios from 'axios'

const authItemName = 'authorize'

function accessHeader() {
  return {
    Authorization: `Bearer ${takeAccessToken()}`,
  }
}

function defaultError() {
  gMessage.error('发生了一些错误，请联系管理员')
}

function defaultFailure(message: any) {
  gMessage.warning(message)
}

function takeAccessToken() {
  const str = localStorage.getItem(authItemName) || sessionStorage.getItem(authItemName)
  if (!str)
    return null
  const authObj = JSON.parse(str)
  return authObj.token
}

function storeAccessToken(remember: any, token: any) {
  const authObj = {
    token,
  }
  const str = JSON.stringify(authObj)
  if (remember)
    localStorage.setItem(authItemName, str)
  else
    sessionStorage.setItem(authItemName, str)
}

function deleteAccessToken() {
  localStorage.removeItem(authItemName)
  sessionStorage.removeItem(authItemName)
}

function internalPost(url: any, data: any, headers: any, success: any, failure: any, error = defaultError) {
  axios.post(url, data, { headers }).then(({ data }) => {
    if (data.code === 200)
      success(data.data)
    else
      failure(data.msg, url)
  }).catch(() => error())
}

function internalGet(url: any, headers: any, success: any, failure: any, error = defaultError) {
  axios.get(url, { headers }).then(({ data }) => {
    if (data.code === 200)
      success(data.data)
    else
      failure(data.message, data.code, url)
  }).catch(() => error())
}

function login(username: any, password: any, remember: any, success: any, failure = defaultFailure) {
  internalPost('http://localhost:9000/api/login', {
    username,
    password,
  }, {
    'Content-Type': 'application/x-www-form-urlencoded',
  }, (data: any) => {
    storeAccessToken(remember, data.token)
    gMessage.success(`登录成功，欢迎 XXX 来到我们的系统`)
    success(data)
  }, failure)
}
function register(username: string, password: string, email: string, success: any, failure = defaultFailure) {
  internalPost('http://localhost:9000/api/register', {
    username,
    password,
    email,
  }, {
    'Content-Type': 'application/x-www-form-urlencoded',
  }, (data: any) => {
    success(data)
  }, failure)
}

function post(url: any, data: any, success: any, failure = defaultFailure) {
  internalPost(url, data, accessHeader(), success, failure)
}

function logout(success: any, failure = defaultFailure) {
  get('/api/auth/logout', () => {
    deleteAccessToken()
    useMessage().success(`退出登录成功，欢迎您再次使用`)
    success()
  }, failure)
}

function get(url: any, success: any, failure = defaultFailure) {
  internalGet(url, accessHeader(), success, failure)
}

function unauthorized() {
  return !takeAccessToken()
}

export { post, get, login, logout, unauthorized, register }
