<script setup lang="ts">
import { Document } from '@vicons/ionicons5'
import { useWebsocketStore } from '~/store/modules/websocket'

const props = defineProps<{
  messageId: string | number // 消息ID
  message: string // 消息内容
  isSent: boolean // true 表示发送者，false 表示接收者
  time: string // 消息发送的时间
  avatar: string // 用户头像URL
  username: string // 用户名，用于头像alt文本
  msgType: string // 消息类型，可以是 'text'、'image'、'mix' 等
}>()
const emit = defineEmits(['data'])
const msg = ref()
msg.value = props.message
function handleClick() {
  emit('data', {
    messageId: props.messageId,
    message: msg.value,
    isSent: props.isSent,
    time: props.time,
    avatar: props.avatar,
    username: props.username,
    msgType: props.msgType,
  })
}
function handlePositiveClick() {
  console.log(msg.value)
  confirm()
}
function handleNegativeClick() {
  window.$message.info('取消')
}
const websocketStore = useWebsocketStore()
const { sendMsg } = websocketStore
function confirm() {
  sendMsg('update', msg.value, null, null, props.messageId)
  window.$message.success('修改成功')
}
</script>

<template>
  <div :key="messageId" class="chat" :class="{ 'chat-start': !isSent, 'chat-end': isSent }">
    <div class="chat-image avatar">
      <div class="w-10 rounded-full">
        <img class="w-10 rounded-full" :src="avatar" :alt="username">
      </div>
    </div>
    <div class="chat-header">
      {{ username }}
    </div>
    <div class="chat-bubble" :class="{ sent: isSent, received: !isSent }">
      <div v-if="msgType === 'text'">
        {{ message }}
      </div>
      <div v-else-if="msgType === 'image'">
        <n-image
          width="100"
          :src="message"
        />
      </div>
      <div v-else-if="msgType === 'file'">
        <a
          :href="message"
          title="点击下载文件"
        >
          <n-icon>
            <Document />
          </n-icon>
        </a>
      </div>
    </div>
    <div class="chat-footer opacity-50">
      {{ time }}
      <n-popconfirm
        v-if="isSent"
        @positive-click="handlePositiveClick"
        @negative-click="handleNegativeClick"
      >
        <template #trigger>
          <n-button v-if="isSent" i-carbon-settings :focusable="false" @click="handleClick" />
        </template>
        <n-input v-model:value="msg" />
      </n-popconfirm>
    </div>
  </div>
</template>

<style scoped>
.chat-bubble {
  display: flex;
  padding: 10px 15px;
  border-radius: 20px;
  max-width: 60%;
  white-space: pre-wrap;
  word-break: break-word;
}

.sent {
  background-color: #dcf8c6;
  margin-left: auto;
  border-top-right-radius: 0;
}

.received {
  background-color: #ebebeb;
  margin-right: auto;
  border-top-left-radius: 0;
}
.chat {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 0.75rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
.chat-start {
  place-items: start;
  grid-template-columns: auto 1fr;
}
.chat-end {
  place-items: end;
  grid-template-columns: 1fr auto;
}
.chat-image {
  grid-row: span 2 / span 2;
  align-self: flex-start;
  top: 20px;
}
.w-10 {
  width: 40px;
}
.rounded-full {
  border-radius: 9999px;
}
.avatar {
  position: relative;
  display: inline-flex;
}
.chat-header {
  grid-row-start: 1;
  font-size: 0.875rem;
  line-height: 1.25rem;
}
.chat-footer {
  grid-row-start: 3;
  font-size: 0.8rem;
  line-height: 1.25rem;
}
.opacity-50 {
  opacity: 0.5;
}
.avatar > div {
  display: block;
  aspect-ratio: 1/1;
  overflow: hidden;
}
.chat-start .chat-image {
  grid-column-start: 1;
}
.chat-end .chat-image {
  grid-column-start: 2;
}
.chat-start .chat-header,
.chat-start .chat-footer {
  grid-column-start: 2;
}
</style>
