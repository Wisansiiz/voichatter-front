<script lang="ts">
import { useUserStore } from '~/store/modules/user'
import { wssBase } from '~/api'
import { useWebsocketStore } from '~/store/modules/websocket'

interface Message {
  messageId: number
  senderUserId: number
  channelId: number
  content: string
  attachment: string
  sendDate: string
  serverId: number
  avatarUrl: string
  senderName: string
}
export default defineComponent({
  setup() {
    const messageText = ref('')
    const messages = ref([] as Message[])
    let socket: WebSocket
    const userStore = useUserStore()
    const route: any = useRoute()

    const page = ref(1)
    const pageSize = ref(7)
    const pageCount = ref(1)
    const websocketStore = useWebsocketStore()
    const info = ref('')
    async function getPagesMessages() {
      messages.value = await websocketStore.getPagesMessages(page, pageCount, pageSize)
    }
    onActivated(async () => {
      await initWebsocket()
    })
    onBeforeRouteUpdate(async (to) => {
      messages.value = await websocketStore.getPagesMessages(page, pageCount, pageSize, to)
      await shutdown()
    })
    onBeforeRouteLeave(async (_to, _from, next) => {
      await shutdown()
      next()
    })
    async function initWebsocket() {
      socket = new WebSocket(`${wssBase}/api/wz?serverId=${route.params.server_id}&channelId=${route.params.name}&token=${encodeURIComponent(userStore.getToken)}`)
      socket.onopen = async () => {
        window.$message.success('连接成功')
        info.value = '你加入了频道'
        messages.value = await websocketStore.getPagesMessages(page, pageCount, pageSize)
      }
      socket.onclose = () => {
        window.$message.error('连接已关闭')
        info.value = '你断开了连接'
      }
    }
    function relinkWebsocket() {
      if (socket)
        socket.close()
      initWebsocket()
    }
    function sendMessage() {
      socket.onmessage = (e: any) => {
        const data = e.data
        const { message } = JSON.parse(data)
        messages.value.push(message)
      }
      if (messageText.value.trim() !== '') {
        try {
          socket.send(JSON.stringify({ data: messageText.value }))
        }
        catch (e) {
          window.$message.error('连接断开或未连接')
        }
        messageText.value = ''
      }
    }

    async function shutdown() {
      try {
        if (socket)
          socket.close()
      }
      catch (e) {
        console.error(e)
        window.$message.error('发生错误')
      }
    }

    return {
      sendMessage,
      messages,
      initWebsocket,
      messageText,
      userId: userStore.getUserId,
      relinkWebsocket,
      shutdown,
      page,
      pageSize,
      getPagesMessages,
      pageCount,
      info,
    }
  },
})
</script>

<template>
  <n-flex justify="center">
    <n-pagination
      v-model:page="page"
      v-model:page-size="pageSize"
      :page-sizes="[7, 10, 20]"
      show-size-picker
      :item-count="pageCount"
      @update:page="getPagesMessages"
    />
  </n-flex>
  <ChatBubble
    v-for="(msg, index) in messages"
    :key="index"
    :message="msg.content"
    :is-sent="msg.senderUserId === userId"
    :avatar="msg.avatarUrl"
    :time="msg.sendDate"
    :username="msg.senderName"
  />
  <n-flex justify="center">
    {{ info }}
  </n-flex>
  <n-button :focusable="false" @click="getPagesMessages">
    分页
  </n-button>
  <n-button :focusable="false" @click="initWebsocket">
    加入频道
  </n-button>
  <n-button :focusable="false" @click="relinkWebsocket">
    Relink
  </n-button>
  <n-button :focusable="false" @click="shutdown">
    断开
  </n-button>
  <div style="margin-bottom: 70px" />
  <n-layout-footer
    bordered
    position="absolute"
    style="height: 64px;padding: 5px"
  >
    <n-flex justify="center">
      <TheInput v-model:value="messageText" />
      <div style="height: 54px; line-height: 54px">
        <n-button type="primary" ghost @click="sendMessage">
          发送
        </n-button>
      </div>
    </n-flex>
  </n-layout-footer>
</template>

<style scoped>

</style>
