<script setup lang="ts">
// import type { Ref, UnwrapRef } from 'vue'
// import { service } from '~/utils/request.js'
//
// const messageText = ref('')
// const messages: Ref<UnwrapRef<message[]>> = ref([])
// let ws: any
// const localStore = useAuthLocalStore()
// const sessionStore = useAuthSessionStore()
// const token = ref('')
// onMounted(() => {
//   if (sessionStore.token)
//     token.value = sessionStore.token
//   else if (localStore.token)
//     token.value = localStore.token
//   ws = new WebSocket(`wss://192.168.31.198:9000/api/ws?channelID=123`)
//   messages.value = []
//   ws.onmessage = (event: any) => {
//     messages.value.push(event)
//   }
// })
// async function queryHistoryMessages() {
//   const response = await service.get(`/history?channelID=123`)
//   messages.value = response.data
//   if (!response.data.length)
//     gMessage.warning('该频道没有更多信息了')
// }
// function sendMessage() {
//   if (messageText.value.trim() !== '') {
//     ws.send(messageText.value.trim())
//     messageText.value = ''
//   }
// }
// const route = useRoute()
// const servername = ref('默认值')
// watch(route, () => {
// async function findServerName() {
// const res = await service.get(`${baseURL}/get-server-name?server_id=${route.query.id}`)
//     servername.value = res.data.server_name
//   }
//   findServerName()
// })
// onMounted(async () => {
// const res = await service.get(`${baseURL}/get-server-name?server_id=${route.query.id}`)
// if (!res.data.server_name)
//   gMessage.warning('请不要修改浏览器地址')
// else
//   servername.value = res.data.server_name
// })
// function formatTime(timeString: string) {
//   const date = new Date(timeString)
//   const formatter = new Intl.DateTimeFormat('zh-CN', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//     hour: 'numeric',
//     minute: 'numeric',
//     hour12: false,
//   })
//   return formatter.format(date)
// }

// interface message {
//   message: string
//   isSent: boolean
//   send_date: string
//   avatar: string
//   username: string
//   content: any
// }
const route = useRoute()
const params = ref()
params.value = route.params
watch(route, () => {
  params.value = route.params
})
const router = useRouter()
</script>

<template>
  <n-h1>这里是channel</n-h1>

  <n-flex>
    <n-h1>{{ params.name }}</n-h1>
    <n-scrollbar style="margin-bottom: 50px">
      <n-button @click="router.push(`${params.name}/single`)">
        发送
      </n-button>
      <RouterView />
      <!--      <n-input -->
      <!--        value="123" -->
      <!--        type="text" -->
      <!--        :disabled="true" -->
      <!--      /> -->
      <!--      <n-button @click="queryHistoryMessages"> -->
      <!--        Search -->
      <!--      </n-button> -->
      <!--      <n-flex justify="center"> -->
      <!--        <n-scrollbar style="max-width: 300px"> -->
      <!--          <div class="chat-window"> -->
      <!--            <ChatBubble -->
      <!--              v-for="(msg, index) in messages" -->
      <!--              :key="index" -->
      <!--              :message="msg.content" -->
      <!--              :is-sent="msg.isSent" -->
      <!--              avatar="https://thirdqq.qlogo.cn/g?b=qq&nk=1392634254&s=100" -->
      <!--              :time="formatTime(msg.send_date)" -->
      <!--              username="测试" -->
      <!--            /> -->
      <!--          </div> -->
      <!--        </n-scrollbar> -->
      <!--      </n-flex> -->
    </n-scrollbar>
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
  </n-flex>
</template>

<style scoped>

</style>
