<script setup lang="ts">
import { Email, Password, User } from '@vicons/carbon'
import { codeApi, userRegister } from '~/api/user'

const router = useRouter()
const formRef = ref()
const rPasswordFormItemRef = ref()
const modelRef = ref({
  username: '',
  email: '',
  password: '',
  reenteredPassword: '',
  code: '',
  id: '',
})
const model = modelRef
function validatePasswordStartWith(_rule: any, value: any) {
  return !!modelRef.value.password && modelRef.value.password.startsWith(value) && modelRef.value.password.length >= value.length
}
function validatePasswordSame(_rule: any, value: any) {
  return value === modelRef.value.password
}

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
  email: [
    {
      required: true,
      validator(_rule: any, value: any) {
        if (!value)
          return new Error('需要邮箱')
        else if (!/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(value))
          return new Error('邮箱不和规范')
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
  reenteredPassword: [
    {
      required: true,
      message: '请再次输入密码',
      trigger: ['input', 'blur'],
    },
    {
      validator: validatePasswordStartWith,
      message: '两次密码输入不一致',
      trigger: 'input',
    },
    {
      validator: validatePasswordSame,
      message: '两次密码输入不一致',
      trigger: ['blur', 'password-input'],
    },
  ],
  code: [
    {
      required: true,
      message: '请输入验证码',
    },
  ],
}
function handlePasswordInput() {
  if (modelRef.value.reenteredPassword)
    rPasswordFormItemRef.value?.validate({ trigger: 'password-input' })
}
const autoCompleteOptions = computed(() => {
  return ['@gmail.com', '@163.com', '@qq.com', '@outlook.com'].map((suffix) => {
    const prefix = model.value.email.split('@')[0]
    return {
      label: prefix + suffix,
      value: prefix + suffix,
    }
  })
})
function register() {
  formRef.value?.validate(async (errors: any) => {
    if (!errors) {
      await userRegister(model.value)
      window.$message.success('注册成功！')
      await router.push('/login')
    }
    else { window.$message.warning('请完整填写注册表单内容！') }
  })
}

const base64 = ref('')
function getCode() {
  codeApi().then((res: any) => {
    base64.value = res.data.img
    model.value.id = res.data.id
  })
}
</script>

<template>
  <n-flex justify="center">
    <div style="margin-top: 50px">
      <n-form ref="formRef" :model="model" :rules="rules">
        <n-form-item path="email" label="邮箱">
          <n-auto-complete
            v-model:value="model.email"
            :options="autoCompleteOptions"
            placeholder="Email"
          >
            <template #prefix>
              <n-icon>
                <Email />
              </n-icon>
            </template>
          </n-auto-complete>
        </n-form-item>
        <n-form-item path="username" label="用户名">
          <n-input
            v-model:value="model.username"
            maxlength="20"
            @keydown.enter.prevent
          >
            <template #prefix>
              <n-icon>
                <User />
              </n-icon>
            </template>
          </n-input>
        </n-form-item>
        <n-form-item path="password" label="密码">
          <n-input
            v-model:value="model.password"
            type="password"
            show-password-on="click"
            maxlength="25"
            @input="handlePasswordInput"
            @keydown.enter.prevent
          >
            <template #prefix>
              <n-icon>
                <Password />
              </n-icon>
            </template>
          </n-input>
        </n-form-item>
        <n-form-item
          ref="rPasswordFormItemRef"
          first
          path="reenteredPassword"
          label="重复密码"
        >
          <n-input
            v-model:value="model.reenteredPassword"
            :disabled="!model.password"
            type="password"
            @keydown.enter.prevent
          >
            <template #prefix>
              <n-icon>
                <Password />
              </n-icon>
            </template>
          </n-input>
        </n-form-item>
        <n-form-item path="code" label="验证码">
          <n-input
            v-model:value="model.code"
            type="text"
            show-password-on="click"
            maxlength="10"
            @keydown.enter.prevent
          >
            <template #prefix>
              <n-icon>
                <Password />
              </n-icon>
            </template>
          </n-input>
          <n-button @click="getCode">
            获取验证码
          </n-button>
        </n-form-item>
        <n-image
          :src="base64"
          size="15"
        />
      </n-form>
      <div style="margin-top: 20px">
        <n-button
          style="width: 270px"
          type="warning"
          attr-type="submit"
          @click="register"
        >
          注册账号
        </n-button>
      </div>
      <n-divider>
        <span style="color: grey;font-size: 13px">没有账号</span>
      </n-divider>
      <div>
        <n-button
          style="width: 270px"
          type="success"
          @click="router.push('/login')"
        >
          去登录
        </n-button>
      </div>
    </div>
  </n-flex>
</template>

<style scoped>

</style>

<route lang="yaml">
meta:
  layout: home
</route>
