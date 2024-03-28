<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useMessage } from 'naive-ui'
import { useUserStore } from '~/store/modules/user'

const rules = {
  username: {
    required: true,
    message: '请输入昵称',
    trigger: 'blur',
  },
  email: {
    required: true,
    message: '请输入邮箱',
    trigger: 'blur',
  },
  mobile: {
    required: true,
    message: '请输入联系电话',
    trigger: 'input',
  },
}
const formRef: any = ref(null)
const message = useMessage()

const userStore = useUserStore()

const formValue = reactive({
  username: '',
  mobile: '',
  email: '',
  avatar: userStore.getAvatar,
})

function formSubmit() {
  formRef.value.validate((errors: any) => {
    if (!errors)
      message.success('验证成功')
    else
      message.error('验证失败，请填写完整信息')
  })
}

const cropperRef = ref()
const fileInputRef = ref<any>()
function selectImageFile(e: any) {
  const { files } = e.target
  if (!files || !files.length)
    return
  const file = files[0]
  const reader = new FileReader()
  // 读取文件 base64
  reader.readAsDataURL(file)
  reader.onload = () => {
    const imgURL = String(reader.result)
    if (fileInputRef.value)
      fileInputRef.value.value = ''
    cropperRef.value.showCropperWindow(imgURL)
  }
}
function getResultData(res: any) {
  formValue.avatar = res.dataURL
  console.log(res)
}
</script>

<template>
  <n-grid cols="2 s:2 m:2 l:3 xl:3 2xl:3" responsive="screen">
    <n-grid-item>
      <n-form ref="formRef" :label-width="80" :model="formValue" :rules="rules">
        <n-form-item label="昵称" path="username">
          <n-input v-model:value="formValue.username" placeholder="请输入昵称" />
        </n-form-item>

        <n-form-item label="邮箱" path="email">
          <n-input v-model:value="formValue.email" placeholder="请输入邮箱" />
        </n-form-item>

        <n-form-item label="联系电话" path="mobile">
          <n-input v-model:value="formValue.mobile" placeholder="请输入联系电话" />
        </n-form-item>

        <n-form-item label="头像" path="avatar">
          <label>
            <n-avatar round :size="120" :src="formValue.avatar" />
            <input
              ref="fileInputRef"
              type="file" style="display: none"
              accept="image/jpeg, image/png, image/jpg, image/gif"
              @change="selectImageFile"
            >
          </label>
        </n-form-item>
        <CropperWindow
          ref="cropperRef"
          @update:result-data="getResultData"
        />
        <div>
          <n-space>
            <n-button type="primary" @click="formSubmit">
              更新基本信息
            </n-button>
          </n-space>
        </div>
      </n-form>
    </n-grid-item>
  </n-grid>
</template>

<style scoped>
</style>
