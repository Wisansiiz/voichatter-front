import { defineStore } from 'pinia'
import { service, wssBase } from '~/api'
import { useUserStore } from '~/store/modules/user'
import type { Request } from '~/api/message'

interface Message {
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

export const useWebsocketStore = defineStore(
  'websocket',
  () => {
    const socket: Ref<WebSocket | null> = ref(null)
    const userStore = useUserStore()
    const pcMap = new Map()
    let localStream: MediaStream
    const route: any = useRoute()
    const videoContainer = ref()
    const localVideo = ref()
    async function getPagesMessages(page: any, pageCount: any, pageSize: any, r: any = null): Promise<Message[]> {
      r = r === null ? route : r
      const res: Request = await service.get(`/messages/page/${r.params.server_id}/${r.params.name}?page=${page.value}&pageSize=${pageSize.value}`)
      const { messageInfo, pageTotal } = res.data.messagePages
      pageCount.value = pageTotal
      return messageInfo
    }
    function setVideoContainer(container: HTMLElement) {
      videoContainer.value = container
    }
    function getVideoContainer(): Ref<any> {
      return videoContainer
    }
    function setLocalVideo(video: HTMLVideoElement) {
      localVideo.value = video
    }
    function getLocalVideo(): Ref<any> {
      return localVideo
    }

    async function createWebsocket() {
      return new Promise((resolve) => {
        if (socket.value) {
          socket.value.close()
          socket.value = null
        }
        socket.value = new WebSocket(`${wssBase}/api/yy?serverId=${route.params.server_id}&channelId=${route.params.name}&token=${encodeURIComponent(userStore.getToken)}`)
        socket.value.onopen = () => {
          window.$message.success('连接成功')
          resolve(socket.value)
        }
        socket.value.onclose = () => {
          window.$message.error('连接断开')
        }
      })
    }

    async function initWebsocket() {
      await createWebsocket()
      if (socket.value && socket.value.readyState === WebSocket.OPEN) {
        socket.value.onmessage = async (e) => {
          const message = e.data
          const { code, data } = JSON.parse(message)
          if (code === 'offer') {
            // 接收offer
            await getOffer(data)
          }
          else if (code === 'answer') {
            // 接收answer
            await getAnswer(data)
          }
          else if (code === 'candidate') {
            const { fromId, candidate } = data
            const pc = pcMap.get(fromId)
            pc.addIceCandidate(candidate)
          }
          else if (code === 'join_group') {
            const { fromId } = data
            await sendOffer(fromId)
          }
          else if (code === 'leave_group') {
            const { fromId } = data
            pcMap.delete(fromId)
            const video = document.getElementById(fromId)
            if (video)
              video.remove()
          }
        }
      }
    }

    async function handleJoin(isVideo: boolean, isAudio: boolean) {
      await initWebsocket()
      let audioStream: boolean | { echoCancellation: true, noiseSuppression: true }
      if (isAudio)
        audioStream = { echoCancellation: true, noiseSuppression: true }
      else
        audioStream = false
      localStream = await navigator.mediaDevices.getUserMedia({
        video: isVideo,
        audio: audioStream,
      })
      localVideo.value.srcObject = localStream
      const message = {
        code: 'join_group',
      }
      socket.value?.send(JSON.stringify(message))
    }

    async function sendOffer(targetId: any) {
      const pc = new RTCPeerConnection({})
      pcMap.set(targetId, pc)
      localStream.getTracks().forEach(track => pc.addTrack(track, localStream))
      const video = document.createElement('video')
      video.id = targetId
      video.autoplay = true
      videoContainer.value.appendChild(video)
      pc.addEventListener('track', (e) => {
        // 更新远程的视频
        video.srcObject = e.streams[0]
      })

      pc.addEventListener('icecandidate', (e) => {
        if (e.candidate) {
          const message = {
            code: 'candidate',
            data: {
              targetId,
              candidate: e.candidate,
            },
          }
          socket.value?.send(JSON.stringify(message))
        }
      })
      const description = await pc.createOffer()
      await pc.setLocalDescription(description)
      const message = {
        code: 'offer',
        data: {
          targetId,
          offer: description,
        },
      }
      socket.value?.send(JSON.stringify(message))
    }

    // 接收offer
    async function getOffer({ fromId: targetId, offer }: any) {
      const pc = new RTCPeerConnection({})
      pcMap.set(targetId, pc)
      localStream.getTracks().forEach(track => pc.addTrack(track, localStream))
      const video = document.createElement('video')
      video.id = targetId
      video.autoplay = true
      videoContainer.value.appendChild(video)
      pc.addEventListener('track', (e) => {
        // 更新远程的视频
        video.srcObject = e.streams[0]
      })

      pc.addEventListener('icecandidate', (e) => {
        if (e.candidate) {
          const message = {
            code: 'candidate',
            data: {
              targetId,
              candidate: e.candidate,
            },
          }
          socket.value?.send(JSON.stringify(message))
        }
      })
      await pc.setRemoteDescription(offer)
      const description = await pc.createAnswer()
      await pc.setLocalDescription(description)
      const message = {
        code: 'answer',
        data: {
          targetId,
          answer: description,
        },
      }
      socket.value?.send(JSON.stringify(message))
    }

    async function getAnswer({ fromId, answer }: any) {
      const pc = pcMap.get(fromId)
      await pc.setRemoteDescription(answer)
    }

    // 挂断通话并通知服务器用户离开频道
    async function hangUp() {
      // // 发送离开频道的消息给服务器
      const message = {
        code: 'leave_group',
      }
      if (socket.value?.readyState === 1)
        socket.value?.send(JSON.stringify(message))
      // 关闭所有与当前用户相关的RTCPeerConnections
      for (const [key, pc] of pcMap.entries()) {
        pc.close()
        pcMap.delete(key)
        const video = document.getElementById(key)
        videoContainer.value.removeChild(video)
      }
      // 停止所有本地媒体流
      if (localStream)
        localStream.getTracks().forEach(track => track.stop())
    }
    return {
      hangUp,
      handleJoin,
      getVideoContainer,
      setVideoContainer,
      getLocalVideo,
      setLocalVideo,
      getPagesMessages,
    }
  },
)
