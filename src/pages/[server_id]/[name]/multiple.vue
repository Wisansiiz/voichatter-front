<script setup>
import { ref } from 'vue'
import { useUserStore } from '~/store/modules/user'

// eslint-disable-next-line unused-imports/no-unused-vars
let currentUserId = null
const videoContainer = ref()
let socket = null
const pcMap = new Map()
let localStream = null
const localVideo = ref()
const params = useRoute('/[server_id]/[name]').params
const channelId = params.server_id + params.name
const userStore = useUserStore()

function initWebsocket() {
  socket = new WebSocket(`wss://192.168.31.198:9000/api/yy?channelId=${channelId}`)
  socket.onopen = () => {
    socket.send(JSON.stringify({ code: 'authorization', data: { token: userStore.getToken } }))
  }

  socket.onmessage = (e) => {
    const message = e.data
    const { code, data } = JSON.parse(message)
    if (code === 'authorization') {
      currentUserId = data.userId
    }
    else if (code === 'offer') {
      // 接收offer
      getOffer(data)
    }
    else if (code === 'answer') {
      // 接收answer
      getAnswer(data)
    }
    else if (code === 'icecandidate') {
      const { fromId, candidate } = data
      const pc = pcMap.get(fromId)
      pc.addIceCandidate(candidate)
    }
    else if (code === 'join_group') {
      const { fromId } = data
      sendOffer(fromId)
    }
    else if (code === 'leave_group') {
      const { fromId } = data
      pcMap.delete(fromId)
      const video = document.getElementById(fromId)
      video.remove()
    }
  }

  socket.onerror = (e) => {
    console.error(e)
  }
}

async function handleJoin() {
  initWebsocket()
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: {
    echoCancellation: true,
    noiseSuppression: true,
  } })
  localVideo.value.srcObject = localStream
  const message = {
    code: 'join_group',
  }
  socket.send(JSON.stringify(message))
}

async function sendOffer(targetId) {
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
        code: 'icecandidate',
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
async function getOffer({ fromId: targetId, offer }) {
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
        code: 'icecandidate',
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

async function getAnswer({ fromId, answer }) {
  const pc = pcMap.get(fromId)
  await pc.setRemoteDescription(answer)
}

// 挂断通话并通知服务器用户离开频道
async function hangUp() {
  // // 发送离开频道的消息给服务器
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
</script>

<template>
  <div class="container">
    <div ref="videoContainer">
      <video ref="localVideo" autoplay />
    </div>
    <div>
      <n-button @click="handleJoin">
        join
      </n-button>
      <n-button @click="hangUp">
        挂断
      </n-button>
    </div>
  </div>
</template>

<style>
video {
  width: 300px;
  height: 200px;
  border: 1px dashed black;
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>
