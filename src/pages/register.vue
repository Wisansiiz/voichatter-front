<script setup>
//
// // function validateEmail() {
// //   coldTime.value = 60
// //   get(`/api/auth/ask-code?email=${form.email}&type=register`, () => {
// //     ElMessage.success(`验证码已发送到邮箱: ${form.email}，请注意查收`)
// //     const handle = setInterval(() => {
// //       coldTime.value--
// //       if (coldTime.value === 0)
// //         clearInterval(handle)
// //     }, 1000)
// //   }, undefined, (message) => {
// //     ElMessage.warning(message)
// //     coldTime.value = 0
// //   })
// // }
//
// const form = reactive({
//   username: '',
//   password: '',
//   password_repeat: '',
//   email: '',
//   code: '',
// })

// function validateUsername(rule, value, callback) {
//   if (value === '')
//     callback(new Error('请输入用户名'))
//   else if (!/^[a-zA-Z0-9\u4E00-\u9FA5]+$/.test(value))
//     callback(new Error('用户名不能包含特殊字符，只能是中文/英文'))
//
//   else
//     callback()
// }
//
// function validatePassword(rule, value, callback) {
//   if (value === '')
//     callback(new Error('请再次输入密码'))
//   else if (value !== form.password)
//     callback(new Error('两次输入的密码不一致'))
//   else
//     callback()
// }
// const rules = {
//   username: [
//     { validator: validateUsername, trigger: ['blur', 'change'] },
//     { min: 2, max: 8, message: '用户名的长度必须在2-8个字符之间', trigger: ['blur', 'change'] },
//   ],
//   password: [
//     { required: true, message: '请输入密码', trigger: 'blur' },
//     { min: 6, max: 16, message: '密码的长度必须在6-16个字符之间', trigger: ['blur', 'change'] },
//   ],
//   password_repeat: [
//     { validator: validatePassword, trigger: ['blur', 'change'] },
//   ],
//   email: [
//     { required: true, message: '请输入邮件地址', trigger: 'blur' },
//     { type: 'email', message: '请输入合法的电子邮件地址', trigger: ['blur', 'change'] },
//   ],
//   code: [
//     { required: true, message: '请输入获取的验证码', trigger: 'blur' },
//   ],
// }
import { Email, Password, User } from '@vicons/carbon'
import { register } from '~/stores/authorized'

const router = useRouter()
const formRef = ref(null)
const rPasswordFormItemRef = ref(null)
const modelRef = ref({
  username: null,
  email: '',
  password: null,
  reenteredPassword: null,
})
const model = modelRef
function validatePasswordStartWith(rule, value) {
  return !!modelRef.value.password && modelRef.value.password.startsWith(value) && modelRef.value.password.length >= value.length
}
function validatePasswordSame(rule, value) {
  return value === modelRef.value.password
}

const rules = {
  username: [
    {
      required: true,
      validator(rule, value) {
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
      validator(rule, value) {
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
function userRegister() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      register(
        model.value.username,
        model.value.password,
        model.value.email,
        // code: form.code,
        () => {
          gMessage.success('注册成功，欢迎加入我们')
          router.push('/')
        },
      )
    }
    else {
      gMessage.warning('请完整填写注册表单内容！')
    }
  })
}
</script>

<template>
  <n-flex justify="center">
    <div style="margin-top: 50px">
      <n-form ref="formRef" :model="model" :rules="rules">
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
        <n-form-item path="password" label="密码">
          <n-input
            v-model:value="model.password"
            type="password"
            show-password-on="mousedown"
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
      </n-form>
      <div style="margin-top: 40px">
        <n-button
          style="width: 270px"
          type="warning"
          attr-type="submit"
          @click="userRegister"
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
