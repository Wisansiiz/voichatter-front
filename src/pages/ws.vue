<script setup>
import axios from 'axios'

const channelID = ref('')
const messageText = ref('')
const messages = ref([])
const isChatBoxVisible = ref(false)
let ws
const active = ref(false)

function joinRoom() {
  if (channelID.value.trim() !== '') {
    ws = new WebSocket(`ws://localhost:9000/api/ws?channelID=${channelID.value.trim()}`)
    messages.value = []
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      messages.value.push(message)
    }
    isChatBoxVisible.value = true
    active.value = true
  }
}
async function queryHistoryMessages() {
  try {
    const response = await axios.get(`http://localhost:9000/api/history?channelID=${channelID.value.trim()}`)
    messages.value = response.data.data.map((event) => {
      return JSON.parse(event.content)
    })
  }
  catch (error) {
    console.error('Error fetching history messages:', error)
  }
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
        v-model:value="channelID"
        type="text"
        placeholder="Enter room ID"
        :disabled="active"
      />
      <n-button @click="joinRoom">
        Join Room
      </n-button>
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
