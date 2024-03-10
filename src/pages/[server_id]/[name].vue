<script lang="ts">
// interface message {
//   message: string
//   isSent: boolean
//   send_date: string
//   avatar: string
//   username: string
//   content: any
// }
import Ws from '~/pages/[server_id]/[name]/ws.vue'
import Multiple from '~/pages/[server_id]/[name]/multiple.vue'

export default defineComponent({
  components: { Ws, Multiple },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const params = ref()
    params.value = route.params
    watch(route, () => {
      params.value = route.params
    })
    return {
      params,
      router,
      Ws,
    }
  },
})
</script>

<template>
  <n-h1>这里是channel</n-h1>

  <n-flex>
    <n-h1>{{ params.name }}</n-h1>
    <!--    <n-scrollbar style="margin-bottom: 50px"> -->
    <!--    <n-button @click="router.push(`${params.name}/ws`)"> -->
    <!--      发送 -->
    <!--    </n-button> -->
    <!--    <RouterView /> -->
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
  </n-flex>

  <Ws />
  <Multiple />
</template>

<style scoped>

</style>
