<script lang="ts">
// import { useWebrtcStore } from '~/store/modules/webrtc'
import { wssBase } from '~/api'
import { useUserStore } from '~/store/modules/user'

export default defineComponent({
  setup() {
    const videoContainer = ref()
    let socket: WebSocket
    const pcMap = new Map()
    let localStream: MediaStream
    const localVideo = ref()
    const userStore = useUserStore()
    const route: any = useRoute()

    async function createWebsocket() {
      return new Promise((resolve) => {
        socket?.close()
        socket = new WebSocket(`${wssBase}/api/yy?serverId=${route.params.server_id}&channelId=${route.params.name}&token=${encodeURIComponent(userStore.getToken)}`)
        socket.onopen = () => {
          window.$message.success('连接成功')
          resolve(socket)
        }
        socket.onclose = () => {
          window.$message.error('连接断开')
        }
      })
    }
    async function initWebsocket() {
      await createWebsocket()
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.onmessage = async (e) => {
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

    const isVideo = ref(false)
    const isAudio = ref(true)
    async function handleJoin() {
      await initWebsocket()
      let audioStream: boolean | { echoCancellation: true, noiseSuppression: true }
      if (isAudio.value)
        audioStream = { echoCancellation: true, noiseSuppression: true }
      else
        audioStream = false
      localStream = await navigator.mediaDevices.getUserMedia({
        video: isVideo.value,
        audio: audioStream,
      })
      localVideo.value.srcObject = localStream
      const message = {
        code: 'join_group',
      }
      socket.send(JSON.stringify(message))
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
          socket.send(JSON.stringify(message))
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
      socket.send(JSON.stringify(message))
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
          socket.send(JSON.stringify(message))
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
      socket.send(JSON.stringify(message))
    }

    async function getAnswer({ fromId, answer }: any) {
      const pc = pcMap.get(fromId)
      await pc.setRemoteDescription(answer)
    }

    // 挂断通话并通知服务器用户离开频道
    async function hangUp() {
      // 发送离开频道的消息给服务器
      if (socket) {
        const message = {
          code: 'leave_group',
        }
        socket.send(JSON.stringify(message))
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
    }

    onBeforeRouteUpdate(async (_to) => {
      await hangUp()
    })
    onBeforeRouteLeave(async (_to, _from, next) => {
      await hangUp()
      next()
    })

    return {
      videoContainer,
      localVideo,
      isVideo,
      isAudio,
      handleChange(_value: boolean) {
        // window.$message.info(`Update value: ${value}`)
      },
      handleJoin,
      hangUp,
      refresh: () => {
        location.reload()
      },
    }
  },
})
</script>

<template>
  <n-layout-header relative style="width: 100%; margin-top: 20px; margin-bottom: 20px">
    <n-flex justify="center">
      <n-switch v-model:value="isVideo" size="large" @update:value="handleChange">
        <template #checked>
          摄像头已打开
        </template>
        <template #unchecked>
          摄像头已关闭
        </template>
      </n-switch>
      <n-switch v-model:value="isAudio" size="large" @update:value="handleChange">
        <template #checked>
          麦克风已打开
        </template>
        <template #unchecked>
          麦克风已关闭
        </template>
      </n-switch>
    </n-flex>
    <div style="margin-top: 20px">
      <n-flex justify="center">
        <n-button @click="handleJoin">
          join
        </n-button>
        <n-button @click="hangUp">
          挂断
        </n-button>
        <n-button @click="refresh">
          刷新
        </n-button>
      </n-flex>
    </div>
  </n-layout-header>
  <div class="container">
    <n-flex justify="center">
      <div ref="videoContainer">
        <video ref="localVideo" autoplay />
      </div>
    </n-flex>
  </div>
</template>

<style>
video {
  width: 300px;
  height: 200px;
  border: 1px dashed black;
}
</style>
