<script>
import { ref } from 'vue'
import axios from 'axios'

export default {
  setup() {
    const roomID = ref('')
    const messageText = ref('')
    const messages = ref([])
    const isChatBoxVisible = ref(false)
    let ws

    const joinRoom = () => {
      if (roomID.value.trim() !== '') {
        ws = new WebSocket(`ws://localhost:8080/ws?roomID=${roomID.value.trim()}`)
        messages.value = []
        ws.onmessage = (event) => {
          const message = JSON.parse(event.data)
          messages.value.push(message)
        }
        isChatBoxVisible.value = true
      }
    }
    const queryHistoryMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/history?roomID=${roomID.value.trim()}`)
        messages.value = response.data.data.map((event) => {
          return JSON.parse(event.text)
        })
      }
      catch (error) {
        console.error('Error fetching history messages:', error)
      }
    }
    const sendMessage = () => {
      if (messageText.value.trim() !== '') {
        ws.send(JSON.stringify({ data: messageText.value.trim() }))
        messageText.value = ''
      }
    }

    return {
      roomID,
      messageText,
      messages,
      isChatBoxVisible,
      joinRoom,
      sendMessage,
      queryHistoryMessages,
    }
  },
}
</script>

<template>
  <div>
    <div v-show="isChatBoxVisible">
      <ul>
        <li v-for="(message, index) in messages" :key="index">
          {{ message.data }}
        </li>
      </ul>
      <textarea v-model="messageText" placeholder="Type your message" />
      <button @click="sendMessage">
        Send
      </button>
    </div>
    <input v-model="roomID" type="text" placeholder="Enter room ID">
    <button @click="joinRoom">
      Join Room
    </button>
    <div>
      <button @click="queryHistoryMessages">
        Search
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>
