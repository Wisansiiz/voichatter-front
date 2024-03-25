<script lang="ts">
import { useUserStore } from '~/store/modules/user'
import { service, wssBase } from '~/api'

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

    async function queryHistoryMessages() {
      const response = await service.get(`/messages/${route.params.server_id}/${route.params.name}`)
      const { messageList } = response.data
      messages.value = messageList
      if (!messages.value)
        window.$message.warning('该频道没有更多信息了')
    }
    function initWebsocket() {
      socket = new WebSocket(`${wssBase}/api/wz?serverId=${route.params.server_id}&channelId=${route.params.name}&token=${encodeURIComponent(userStore.getToken)}`)
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

    function shutdown() {
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
      queryHistoryMessages,
      sendMessage,
      messages,
      initWebsocket,
      messageText,
      userId: userStore.getUserId,
      relinkWebsocket,
      shutdown,
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
