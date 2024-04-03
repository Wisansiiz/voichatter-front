<script setup lang="ts">
import { Add } from '@vicons/ionicons5'
import type { UploadFileInfo, UploadInst } from 'naive-ui'
import { NButton } from 'naive-ui'
import { baseURL } from '~/api'
import { useWebsocketStore } from '~/store/modules/websocket'
import { useUserStore } from '~/store/modules/user'

const userStore = useUserStore()
const userId = computed(() => userStore.userId)
const route: any = useRoute()

const websocketStore = useWebsocketStore()
const messages = ref()
const members = ref()

watchEffect(() => {
  messages.value = websocketStore.getMessages
  members.value = websocketStore.getMembers
})
const { sendMsg } = websocketStore
onMounted(() => {
  if (!websocketStore.isConnected)
    websocketStore.initChatSocket({ code: 'ping', data: null, targetId: route.params.name })
  else
    sendMsg('ping', null, route.params.name)
  // sendMsg('ping', null, route.params.name)
  members.value = websocketStore.getMembers
})
onBeforeRouteUpdate((to: any) => {
  sendMsg('ping', null, to.params.name)
})
const page = ref(1)
const pageSize = ref(7)
const pageCount = ref(1)
function getPagesMessages() {
  websocketStore.getPagesMessages(page, pageCount, pageSize).then((res: any) => {
    websocketStore.messages[route.params.name] = res
  })
}

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
      'a',
      {
        onClick: () => {
          show.value = true
        },
      },
      { default: () => '上传图片' },
    ),
    value: 'uploadPic',
  },
  {
    label: () => h(
      'a',
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
  // file,
  event,
}: {
  file: UploadFileInfo
  event?: ProgressEvent
}) {
  const res: Rep = JSON.parse((event?.target as XMLHttpRequest).response)
  const fileUrl = res.data.url
  const fileType = getFileExtension(fileUrl)
  if (fileType === 'webp')
    sendMsg('image', fileUrl)
  else
    sendMsg('file', fileUrl)
  // return file
}
function getFileExtension(url: string) {
  const regex = /\.(\w+)$/
  const match = url.match(regex)
  return match ? match[1] : null
}
</script>

<template>
  <n-anchor
    affix
    :trigger-top="24"
    :top="88"
    style="z-index: 1"
    :bound="24"
  >
    <n-anchor-link title="回到底部" href="#bottom" />
  </n-anchor>
  <n-flex justify="center">
    当前在线人数{{ members }}
  </n-flex>
  <n-flex justify="center">
    <n-pagination
      v-model:page="page"
      v-model:page-size="pageSize"
      :item-count="pageCount"
      simple
      @update:page="getPagesMessages"
    />
    <NButton @click="getPagesMessages">
      历史消息
    </NButton>
  </n-flex>
  <template
    v-for="(msg, _i) in messages"
    :key="_i"
  >
    <ChatBubble
      :message="msg.content"
      :is-sent="msg.senderUserId === userId"
      :avatar="msg.avatarUrl"
      :time="msg.sendDate"
      :username="msg.senderName"
      :msg-type="msg.messageType"
    />
  </template>
  <div id="bottom" style="margin-bottom: 100px" />
  <n-layout-footer
    bordered
    position="absolute"
    style="height: 100px;padding: 5px;"
  >
    <n-flex justify="between">
      <TheInput v-model:value="messageText" />
      <n-flex justify="between" align="center">
        <NButton
          type="primary" ghost
          :disabled="!messageText"
          @click="sendMessage"
        >
          发送
        </NButton>
        <n-popselect
          v-model:value="value"
          :options="options"
          size="medium"
          scrollable
        >
          <NButton strong secondary>
            <template #icon>
              <NIcon>
                <Add />
              </NIcon>
            </template>
          </NButton>
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
      <NButton
        :disabled="!fileListLength"
        style="margin-bottom: 12px"
        @click="handleClick"
      >
        上传文件
      </NButton>
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
