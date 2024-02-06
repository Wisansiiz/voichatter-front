<script setup>
const messageText = ref('')
const messages = ref([])
const isChatBoxVisible = ref(false)
let ws
onMounted(() => {
  ws = new WebSocket(`ws://localhost:9000/api/ws?channelID=123`)
  messages.value = []
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data)
    messages.value.push(message)
  }
  isChatBoxVisible.value = true
})
async function queryHistoryMessages() {
  const response = await service.get(`${baseURL}/history?channelID=123`)
  messages.value = response.data.map((res) => {
    return JSON.parse(res.content)
  })
  if (!response.data.length)
    gMessage.warning('该频道没有更多信息了')
}
function sendMessage() {
  if (messageText.value.trim() !== '') {
    ws.send(JSON.stringify({ data: messageText.value.trim() }))
    messageText.value = ''
  }
}
</script>

<template>
  <n-flex>
    <n-scrollbar style="margin-bottom: 50px">
      <n-flex v-show="isChatBoxVisible" justify="center">
        <n-scrollbar style="max-width: 300px">
          <n-list clickable hoverable>
            <n-list-item v-for="(message, index) in messages" :key="index">
              {{ message.data }}
            </n-list-item>
          </n-list>
        </n-scrollbar>
      </n-flex>
      <n-input
        value="123"
        type="text"
        :disabled="true"
      />
      <n-button @click="queryHistoryMessages">
        Search
      </n-button>
    </n-scrollbar>
    <n-layout-footer
      bordered
      position="absolute"
      style="height: 64px;padding: 5px"
    >
      <n-flex justify="center">
        <TheInput v-model:value="messageText" />
        <div style="height: 54px; line-height: 54px">
          <n-button type="primary" ghost @click="sendMessage()">
            发送
          </n-button>
        </div>
      </n-flex>
    </n-layout-footer>
  </n-flex>
</template>

<style scoped>

</style>
