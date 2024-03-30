<script setup lang="ts">
import { useUserStore } from '~/store/modules/user'
import { useWebsocketStore } from '~/store/modules/websocket'

const userStore = useUserStore()
const userId = computed(() => userStore.userId)

const websocketStore = useWebsocketStore()
const messages = ref()
const members = ref()
watchEffect(() => {
  messages.value = websocketStore.getMessages
  members.value = websocketStore.getMembers
})
onMounted(() => {
  if (!websocketStore.isConnected)
    websocketStore.initChatSocket()
  members.value = websocketStore.getMembers
})
const { sendMsg } = websocketStore
onBeforeRouteUpdate((to: any) => {
  sendMsg('ping', null, to.params.name)
})
const messageText = ref('')
function sendMessage() {
  sendMsg('text', messageText.value)
  messageText.value = ''
}
</script>

<template>
  <n-flex justify="center">
    当前在线人数{{ members }}
  </n-flex>
  <template
    v-for="(msg, _) in messages"
    :key="_"
  >
    <ChatBubble
      :message="msg.content"
      :is-sent="msg.senderUserId === userId"
      :avatar="msg.avatarUrl"
      :time="msg.sendDate"
      :username="msg.senderName"
    />
  </template>
  <div style="margin-bottom: 70px" />
  <n-layout-footer
    bordered
    position="absolute"
    style="height: 64px;padding: 5px"
  >
    <n-flex justify="between">
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
