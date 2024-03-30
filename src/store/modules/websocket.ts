import { defineStore } from 'pinia'
import { useUserStore } from '~/store/modules/user'
import { wssBase } from '~/api'

interface Data {
  count: number
  code: string
  message: IMessage
}
interface IMessage {
  messageId: number
  senderUserId: number
  channelId: number
  content: string
  attachment: string
  sendDate: string
  serverId: number
  avatarUrl: string
  senderName: string
}
interface MessageMap {
  [key: string]: IMessage[]
}

export const useWebsocketStore = defineStore(
  // id
  'websocket',
  () => {
    // state
    const socket = ref(null as WebSocket | null)
    const userStore = useUserStore()
    const messages: MessageMap = reactive({})
    const members: { [key: string]: number } = reactive({})
    const route: any = useRoute()
    const isActive = ref(false)

    // getters
    const isConnected = computed(() => socket.value?.readyState === 1 || isActive.value)
    const getMessages = computed(() => messages[route.params.name] || [])
    const getMembers = computed(() => members[route.params.name] || 0)

    // actions
    const initChatSocket = () => {
      socket.value = new WebSocket(`${wssBase}/api/wz?token=${encodeURIComponent(userStore.getToken)}`)
      socket.value.onopen = () => {
        console.log('websocket连接成功')
        const msg = { code: 'ping', data: null, targetId: route.params.name }
        socket.value?.send(JSON.stringify(msg))
        isActive.value = true
      }
      socket.value.close = (_) => {
        console.log('websocket连接关闭')
        isActive.value = false
        members[route.params.name] -= 1
      }
      socket.value.onerror = (_) => {
        console.log('WebSocket:发生错误')
        isActive.value = false
        members[route.params.name] -= 1
      }
      window.onbeforeunload = (_) => {
        socket.value?.close()
      }
      if (isConnected && socket) {
        socket.value.onmessage = (e) => {
          const result: Data = JSON.parse(e.data)
          const { count, code, message } = result
          switch (code) {
            case 'text':
              // 处理消息
              if (!messages[message.channelId])
                messages[message.channelId] = []
              messages[message.channelId].push(message)
              break
            case 'notice':
              // 处理通知
              break
            case 'ping':
              if (!members[message.channelId])
                members[message.channelId] = 0
              members[message.channelId] = count
              window.$message.success('ping')
              break
            default:
              break
          }
        }
      }
    }
    const sendMsg = (code: string, data: any, targetId = route.params.name) => {
      if (isConnected) {
        const msg = { code, data, targetId }
        socket.value?.send(JSON.stringify(msg))
      }
    }
    return {
      socket,
      initChatSocket,
      isConnected,
      sendMsg,
      messages,
      getMessages,
      getMembers,
    }
  },
)
