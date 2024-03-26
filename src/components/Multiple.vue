<script lang="ts">
// import { useUserStore } from '~/store/modules/user'
// import { wssBase } from '~/api'

import { useWebsocketStore } from '~/store/modules/websocket'

export default defineComponent({
  setup() {
    const videoContainer = ref()
    // const socket: Ref<WebSocket | null> = ref(null)
    // const pcMap = new Map()
    // let localStream: MediaStream
    const localVideo = ref()
    // const userStore = useUserStore()
    // const route: any = useRoute()

    // async function createWebsocket() {
    //   return new Promise((resolve) => {
    //     // try {
    //     if (socket.value) {
    //       socket.value.close()
    //       socket.value = null
    //     }
    //     socket.value = new WebSocket(`${wssBase}/api/yy?serverId=${route.params.server_id}&channelId=${route.params.name}&token=${encodeURIComponent(userStore.getToken)}`)
    //     socket.value.onopen = () => {
    //       window.$message.success('连接成功')
    //       resolve(socket.value)
    //     }
    //     socket.value.onclose = () => {
    //       window.$message.error('连接断开')
    //     }
    //   })
    // }
    // async function initWebsocket() {
    //   await createWebsocket()
    //   if (socket.value && socket.value.readyState === WebSocket.OPEN) {
    //     socket.value.onmessage = async (e) => {
    //       const message = e.data
    //       const { code, data } = JSON.parse(message)
    //       console.log(code)
    //       if (code === 'offer') {
    //         // 接收offer
    //         await getOffer(data)
    //       }
    //       else if (code === 'answer') {
    //         // 接收answer
    //         await getAnswer(data)
    //       }
    //       else if (code === 'candidate') {
    //         const { fromId, candidate } = data
    //         const pc = pcMap.get(fromId)
    //         pc.addIceCandidate(candidate)
    //       }
    //       else if (code === 'join_group') {
    //         const { fromId } = data
    //         await sendOffer(fromId)
    //       }
    //       else if (code === 'leave_group') {
    //         const { fromId } = data
    //         pcMap.delete(fromId)
    //         const video = document.getElementById(fromId)
    //         if (video)
    //           video.remove()
    //       }
    //     }
    //   }
    // }
    // async function handleJoin() {
    //   await initWebsocket()
    //   localStream = await navigator.mediaDevices.getUserMedia({
    //     video: true,
    //     audio: {
    //       echoCancellation: true,
    //       noiseSuppression: true,
    //     },
    //   })
    //   localVideo.value.srcObject = localStream
    //   const message = {
    //     code: 'join_group',
    //   }
    //   socket.value?.send(JSON.stringify(message))
    // }
    //
    // async function sendOffer(targetId: any) {
    //   const pc = new RTCPeerConnection({})
    //   pcMap.set(targetId, pc)
    //   localStream.getTracks().forEach(track => pc.addTrack(track, localStream))
    //   const video = document.createElement('video')
    //   video.id = targetId
    //   video.autoplay = true
    //   videoContainer.value.appendChild(video)
    //   pc.addEventListener('track', (e) => {
    //     // 更新远程的视频
    //     video.srcObject = e.streams[0]
    //   })
    //
    //   pc.addEventListener('icecandidate', (e) => {
    //     if (e.candidate) {
    //       const message = {
    //         code: 'candidate',
    //         data: {
    //           targetId,
    //           candidate: e.candidate,
    //         },
    //       }
    //       socket.value?.send(JSON.stringify(message))
    //     }
    //   })
    //   const description = await pc.createOffer()
    //   await pc.setLocalDescription(description)
    //   const message = {
    //     code: 'offer',
    //     data: {
    //       targetId,
    //       offer: description,
    //     },
    //   }
    //   socket.value?.send(JSON.stringify(message))
    // }
    //
    // // 接收offer
    // async function getOffer({ fromId: targetId, offer }: any) {
    //   const pc = new RTCPeerConnection({})
    //   pcMap.set(targetId, pc)
    //   localStream.getTracks().forEach(track => pc.addTrack(track, localStream))
    //   const video = document.createElement('video')
    //   video.id = targetId
    //   video.autoplay = true
    //   videoContainer.value.appendChild(video)
    //   pc.addEventListener('track', (e) => {
    //     // 更新远程的视频
    //     video.srcObject = e.streams[0]
    //   })
    //
    //   pc.addEventListener('icecandidate', (e) => {
    //     if (e.candidate) {
    //       const message = {
    //         code: 'candidate',
    //         data: {
    //           targetId,
    //           candidate: e.candidate,
    //         },
    //       }
    //       socket.value?.send(JSON.stringify(message))
    //     }
    //   })
    //   await pc.setRemoteDescription(offer)
    //   const description = await pc.createAnswer()
    //   await pc.setLocalDescription(description)
    //   const message = {
    //     code: 'answer',
    //     data: {
    //       targetId,
    //       answer: description,
    //     },
    //   }
    //   socket.value?.send(JSON.stringify(message))
    // }
    //
    // async function getAnswer({ fromId, answer }: any) {
    //   const pc = pcMap.get(fromId)
    //   await pc.setRemoteDescription(answer)
    // }
    //
    // // 挂断通话并通知服务器用户离开频道
    // async function hangUp() {
    //   // // 发送离开频道的消息给服务器
    //   const message = {
    //     code: 'leave_group',
    //   }
    //   socket.value?.send(JSON.stringify(message))
    //   // 关闭所有与当前用户相关的RTCPeerConnections
    //   for (const [key, pc] of pcMap.entries()) {
    //     pc.close()
    //     pcMap.delete(key)
    //     const video = document.getElementById(key)
    //     videoContainer.value.removeChild(video)
    //   }
    //   // 停止所有本地媒体流
    //   if (localStream)
    //     localStream.getTracks().forEach(track => track.stop())
    // }
    // onMounted(() => {
    //   socket.value?.close()
    // })
    // window.addEventListener('beforeunload', (e) => {
    //   // Cancel the event
    //   e.preventDefault()
    //   // Chrome requires returnValue to be set
    //   e.returnValue = '自定义文本'
    //   console.log('beforeunload')
    // })

    const websocketStore = useWebsocketStore()
    onMounted(() => {
      websocketStore.setLocalVideo(localVideo.value)
      websocketStore.setVideoContainer(videoContainer.value)
    })

    onBeforeRouteUpdate(async (_to) => {
      await websocketStore.hangUp()
    })
    onBeforeRouteLeave(async (_to, _from, next) => {
      await websocketStore.hangUp()
      next()
    })

    const isVideo = ref(false)
    const isAudio = ref(true)
    return {
      videoContainer,
      localVideo,
      show: () => {
        // console.log(websocketStore.getVideoContainer())
      },
      isVideo,
      isAudio,
      handleChange(value: boolean) {
        window.$message.info(`Update value: ${value}`)
      },
      handleJoin: () => {
        websocketStore.handleJoin(isVideo.value, isAudio.value)
      },
      hangUp: () => {
        websocketStore.hangUp()
      },
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
        <n-button @click="show">
          showDetails
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
