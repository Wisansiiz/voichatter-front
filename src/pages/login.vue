<script setup lang="ts">
import { Password, User } from '@vicons/carbon'
import { useAuthLocalStore, useAuthSessionStore } from '~/stores/token.js'
import { service } from '~/utils/request.js'

const router = useRouter()
const formRef = ref(null)
const isLoading = ref(false)
const modelRef = ref({
  username: null,
  password: null,
})
const remember = ref(false)
const model = modelRef
const rules = {
  username: [
    {
      required: true,
      validator(_rule: any, value: any) {
        if (!value)
          return new Error('需要用户名')
        else if (!/^[a-zA-Z0-9_-]{4,16}$/.test(value))
          return new Error('用户名不和规范')
        return true
      },
      trigger: ['input', 'blur'],
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
    },
  ],
}
const localStore = useAuthLocalStore()
const sessionStore = useAuthSessionStore()

async function userLogin() {
  isLoading.value = true
  service.post('/login', (model.value))
    .then(async (data) => {
      if (remember.value)
        localStore.token = data.data.token
      else sessionStore.token = data.data.token
      setTimeout(() => {
        if (localStore.token || sessionStore.token) {
          router.push('/')
          gMessage.success('登录成功')
        }
      }, 1000)
    })
    .finally(() => {
      setTimeout(() => {
        isLoading.value = false
      }, 1000)
    })
}
onMounted(() => {
  service.get('/auth').then((data: any) => {
    if (data) {
      router.push('/')
      gMessage.success(data.messages)
    }
  })
})
</script>

<template>
  <n-flex justify="center">
    <div style="margin-top: 50px">
      <n-form ref="formRef" :model="model" :rules="rules">
        <n-form-item path="username" label="用户名">
          <n-input v-model:value="model.username" maxlength="20" @keydown.enter.prevent>
            <template #prefix>
              <n-icon>
                <User />
              </n-icon>
            </template>
          </n-input>
        </n-form-item>
        <n-form-item path="password" label="密码">
          <n-input v-model:value="model.password" type="password" show-password-on="mousedown" maxlength="24" @keydown.enter.prevent>
            <template #prefix>
              <n-icon>
                <Password />
              </n-icon>
            </template>
          </n-input>
        </n-form-item>
      </n-form>
      <n-checkbox v-model:checked="remember">
        记住我
      </n-checkbox>
      <div style="margin-top: 40px">
        <n-button style="width: 270px" type="success" attr-type="submit" :loading="isLoading" @click="userLogin">
          立即登录
        </n-button>
      </div>
      <n-divider>
        <span style="color: grey; font-size: 13px">没有账号</span>
      </n-divider>
      <div>
        <n-button style="width: 270px" type="warning" @click="router.push('/register')">
          去注册
        </n-button>
      </div>
    </div>
  </n-flex>
</template>

<style scoped></style>

<route lang="yaml">
meta:
  layout: home
</route>
