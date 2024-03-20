<script lang="ts">
import { service } from '~/api'
import { useUserStore } from '~/store/modules/user'

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
    let socket: any = null
    const userStore = useUserStore()
    const route: any = useRoute()
    const params = useRoute('/[server_id]/[name]').params

    async function queryHistoryMessages() {
      const response = await service.get(`/messages/${params.server_id}/${params.name}`)
      const { messageList } = response.data
      messages.value = messageList
      if (!messages.value)
        window.$message.warning('该频道没有更多信息了')
    }
    function initWebsocket() {
      socket = new WebSocket(`wss://192.168.31.198:9000/api/wz?serverId=${route.params.server_id}&channelId=${route.params.name}&token=${encodeURIComponent(userStore.getToken)}`)
      socket.onopen = () => {
        window.$message.success('连接成功')
        queryHistoryMessages()
      }
      socket.onclose = () => {
        window.$message.error('连接已关闭')
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
        socket.send(JSON.stringify({ data: messageText.value }))
        messageText.value = ''
      }
    }
    return {
      queryHistoryMessages,
      sendMessage,
      messages,
      initWebsocket,
      messageText,
      userId: userStore.getUserId,
      relinkWebsocket,
    }
  },
})
</script>

<template>
  <ChatBubble
    v-for="(msg, index) in messages"
    :key="index"
    :message="msg.content"
    :is-sent="msg.senderUserId === userId"
    :avatar="msg.avatarUrl"
    :time="msg.sendDate"
    :username="msg.senderName"
  />
  <n-button :focusable="false" @click="initWebsocket">
    加入频道
  </n-button>
  <n-button :focusable="false" @click="queryHistoryMessages">
    Search
  </n-button>
  <n-button :focusable="false" @click="relinkWebsocket">
    Relink
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
