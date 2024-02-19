<script setup>
defineOptions({
  name: 'IndexPage',
})
const router = useRouter()
const messages = [
  { username: '张三', text: '一段非常长的文本，一段非常长的文本，一段非常长的文本，一段非常长的文本，一段非常长的文本，一段非常长的文本，一段非常长的文本，一段非常长的文本，一段非常长的文本，一段非常长的文本，一段非常长的文本，一段非常长的文本，一段非常长的文本，', isSent: true, time: '2024年2月19日 13:55', avatar: 'https://thirdqq.qlogo.cn/g?b=qq&nk=1392634254&s=100' },
  { username: '李四', text: '一段非常长的文本，一段非常长的文本，一段非常长的文本一段非常长的文本，一段非常长的文本，一段非常长的文本', isSent: false, time: '2024年2月19日 13:56', avatar: 'https://thirdqq.qlogo.cn/g?b=qq&nk=1392634254&s=100' },
]
</script>

<template>
  <n-scrollbar style="margin-bottom: 50px">
    <n-h1>主页</n-h1>
    <n-button @click="logout()">
      退出登录
    </n-button>
  </n-scrollbar>
  <div class="chat-window">
    <ChatBubble
      v-for="(msg, index) in messages"
      :key="index"
      :message="msg.text"
      :is-sent="msg.isSent"
      :avatar="msg.avatar"
      :time="msg.time"
      :username="msg.username"
    />
  </div>
</template>

<style scoped>
</style>
