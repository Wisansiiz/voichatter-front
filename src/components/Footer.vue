<script setup lang="ts">
import { Add } from '@vicons/ionicons5'

import type { UploadFileInfo, UploadInst } from 'naive-ui'
import { useWebsocketStore } from '~/store/modules/websocket'
import { baseURL } from '~/api'
import { useUserStore } from '~/store/modules/user'

const websocketStore = useWebsocketStore()
const { sendMsg } = websocketStore
const messageText = ref('')
function sendMessage() {
  sendMsg('text', messageText.value)
  messageText.value = ''
}
const value = ref('')
const show = ref(false)
const options = [
  {
    label: () => h(
      'span',
      {
        onClick: () => {
          window.$message.info('点击事件')
          show.value = true
        },
      },
      { default: () => '上传图片' },
    ),
    value: 'uploadPic',
  },
  {
    label: () => h(
      'span',
      {
        onClick: () => {
          window.$message.info('点击事件')
        },
      },
      { default: () => '上传文件' },
    ),
    value: 'uploadFile',
  },
]
const previewImageUrlRef = ref('')
const showModalRef = ref(false)
function handlePreview(file: UploadFileInfo) {
  const { url } = file
  previewImageUrlRef.value = url as string
  showModalRef.value = true
}
const fileList = ref<UploadFileInfo[]>([])
const userStore = useUserStore()
const token = userStore.getToken
const upload = ref<UploadInst | null>(null)
const fileListLength = ref(0)
function handleChange(options: { fileList: UploadFileInfo[] }) {
  fileListLength.value = options.fileList.length
}
function handleClick() {
  upload.value?.submit()
  show.value = false
}

interface Rep {
  code: number
  message: string
  data: RepData
}
interface RepData {
  url: string
}
function handleFinish({
  file,
  event,
}: {
  file: UploadFileInfo
  event?: ProgressEvent
}) {
  const res: Rep = JSON.parse((event?.target as XMLHttpRequest).response)
  window.$message.success(res.data.url)
  sendMsg('image', res.data.url)
  return file
}
</script>

<template>
  <n-layout-footer
    bordered
    position="absolute"
    style="height: 100px;padding: 5px"
  >
    <n-flex justify="between">
      <TheInput v-model:value="messageText" />
      <n-flex justify="between" align="center">
        <n-button
          type="primary" ghost
          :disabled="!messageText"
          @click="sendMessage"
        >
          发送
        </n-button>
        <n-popselect
          v-model:value="value"
          :options="options"
          size="medium"
          scrollable
        >
          <n-button strong secondary>
            <template #icon>
              <NIcon>
                <Add />
              </NIcon>
            </template>
          </n-button>
        </n-popselect>
      </n-flex>
    </n-flex>
  </n-layout-footer>
  <n-modal
    v-model:show="show"
  >
    <n-card
      style="width: 600px"
      title="上传图片"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-button
        :disabled="!fileListLength"
        style="margin-bottom: 12px"
        @click="handleClick"
      >
        上传文件
      </n-button>
      <n-upload
        ref="upload"
        :action="`${baseURL}/file?token=${encodeURIComponent(token)}`"
        :default-file-list="fileList"
        list-type="image-card"
        :default-upload="false"
        @preview="handlePreview"
        @change="handleChange"
        @finish="handleFinish"
      />
      <n-modal
        v-model:show="showModalRef"
        preset="card"
        style="width: 600px"
        title="一张很酷的图片"
      >
        <img :src="previewImageUrlRef" style="width: 100%" alt="">
      </n-modal>
    </n-card>
  </n-modal>
</template>

<style scoped>
</style>
