import { defineStore } from 'pinia'
import { useUserStore } from '~/store/modules/user'
import { service, wssBase } from '~/api'
import type { MessageInfo } from '~/api/message'

interface Data {
  count: number
  code: string
  message: MessageInfo
}

interface MessageMap {
  [key: string]: MessageInfo[]
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
    const getMessages = computed(() => messages[route.params.name])
    const getMembers = computed(() => members[route.params.name] || 0)

    // actions
    async function getPagesMessages(page: any, pageCount: any, pageSize: any, r: any = null) {
      r = r === null ? route : r
      return new Promise((resolve) => {
        service.get(`/messages/page/${r.params.server_id}/${r.params.name}?page=${page.value}&pageSize=${pageSize.value}`)
          .then((res) => {
            const { messageInfo, pageTotal } = res.data.messagePages
            pageCount.value = pageTotal
            resolve(messageInfo)
          })
      })
    }

    const initChatSocket = (msg: { code: string, data: any, targetId: string }) => {
      socket.value = new WebSocket(`${wssBase}/api/wz?token=${encodeURIComponent(userStore.getToken)}`)
      socket.value.onopen = () => {
        // console.log('websocket连接成功')
        // const msg = { code: 'ping', data: null, targetId: route.params.name }
        socket.value?.send(JSON.stringify(msg))
        isActive.value = true
      }
      socket.value.close = (_) => {
        // console.log('websocket连接关闭')
        isActive.value = false
        members[route.params.name] -= 1
      }
      socket.value.onerror = (_) => {
        // console.log('WebSocket:发生错误')
        isActive.value = false
        members[route.params.name] -= 1
      }
      window.onbeforeunload = (_) => {
        socket.value?.close()
        members[route.params.name] -= 1
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
            case 'image':
              if (!messages[message.channelId])
                messages[message.channelId] = []
              messages[message.channelId].push(message)
              break
            case 'file':
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
              if (userStore.getUserId !== message.senderUserId) {
                window.$notification.create({
                  title: '在线通知',
                  content: `${message.senderName}上线了`,
                  duration: 5000,
                })
              }
              break
            default:
              break
          }
        }
      }
    }
    const sendMsg = (code: string, data: any, targetId = route.params.name, serverId = route.params.server_id) => {
      if (isConnected) {
        const msg = { code, data, targetId, serverId }
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
      getPagesMessages,
    }
  },
)
