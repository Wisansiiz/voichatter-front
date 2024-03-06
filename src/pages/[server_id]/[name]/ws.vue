<script setup>
import { service } from '~/utils/request.js'

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
const route = useRoute()
async function queryHistoryMessages() {
  const response = await service.get(`/messages/${route.params.server_id}/${route.params.name}`)
  messages.value = response.data.messageList
  console.log(messages.value)
  // if (!messages.value)
  //   gMessage.warning('该频道没有更多信息了')
}
function sendMessage() {
  if (messageText.value.trim() !== '') {
    ws.send(JSON.stringify({ data: messageText.value.trim() }))
    messageText.value = ''
  }
}
</script>

<template>
  <!--  <n-scrollbar style="margin-bottom: 50px"> -->
  <!--    {{ messages }} -->
  <ChatBubble
    v-for="(msg, index) in messages"
    :key="index"
    :message="msg.content"
    :is-sent="msg.sender_user_id === 1"
    :avatar="msg.avatar"
    :time="msg.send_date"
    :username="msg.username"
  />
  <!--    <n-scrollbar style="margin-bottom: 50px"> -->
  <!--      <n-flex v-show="isChatBoxVisible" justify="center"> -->
  <!--        <n-scrollbar style="max-width: 300px"> -->
  <!--          <n-list clickable hoverable> -->
  <!--            <n-list-item v-for="(message, index) in messages" :key="index"> -->
  <!--              {{ message }} -->
  <!--            </n-list-item> -->
  <!--          </n-list> -->
  <!--        </n-scrollbar> -->
  <!--      </n-flex> -->
  <!--      <n-input -->
  <!--        v-model:value="channelID" -->
  <!--        type="text" -->
  <!--        placeholder="Enter room ID" -->
  <!--        :disabled="active" -->
  <!--      /> -->
  <!--      <n-button @click="joinRoom"> -->
  <!--        Join Room -->
  <!--      </n-button> -->
  <n-button @click="queryHistoryMessages">
    Search
  </n-button>
<!--  <div style="height: 300px">sss</div>-->
  <!--    </n-scrollbar> -->
  <!--    <n-layout-footer -->
  <!--      bordered -->
  <!--      position="absolute" -->
  <!--      style="height: 64px;padding: 5px" -->
  <!--    > -->
  <!--      <n-flex justify="center"> -->
  <!--        <TheInput v-model:value="messageText" /> -->
  <!--        <div style="height: 54px; line-height: 54px"> -->
  <!--          <n-button type="primary" ghost @click="sendMessage()"> -->
  <!--            发送 -->
  <!--          </n-button> -->
  <!--        </div> -->
  <!--      </n-flex> -->
  <!--    </n-layout-footer> -->
<!--  </n-scrollbar> -->
</template>

<style scoped>

</style>
