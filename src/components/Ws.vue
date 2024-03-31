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
      :msg-type="msg.messageType"
    />
  </template>
  <div style="margin-bottom: 100px" />
  <Footer />
</template>

<style scoped>

</style>
