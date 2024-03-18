<script setup>
import { ref } from 'vue'
import { service } from '~/api'

const localVideo = ref()
const remoteVideo = ref()
let localStream = null
let socket = null
const targetId = ref(null)
let pc = null
onMounted(async () => {
  const currentUserId = ref(null)
  const res = await service.get('/auth')
  currentUserId.value = res.data
  initWebsocket(currentUserId)
})
async function handleStart() {
  localStream = await navigator.mediaDevices.getUserMedia({ audio: {
    echoCancellation: true, // 音频开启回音消除
    noiseSuppression: true, // 开启降噪
    autoGainControl: true, // 开启自动增益功能
  } })
  localVideo.value.srcObject = localStream
}
function initWebsocket(currentUserId) {
  socket = new WebSocket(`wss://192.168.31.198:9000/api/yy?id=${currentUserId.value}`)
  socket.onopen = () => {
    window.$message.info('open_success')
  }

  socket.onmessage = (e) => {
    const message = e.data
    const { code, data } = JSON.parse(message)
    if (code === 'offer') {
      // 接收offer
      getOffer(data)
    }
    else if (code === 'answer') {
      // 接收answer
      getAnswer(data)
    }
    else if (code === 'icecandidate') {
      const { candidate } = data
      pc.addIceCandidate(candidate)
    }
  }

  socket.onerror = (e) => {
    console.error(e)
  }
}

// ====== 发送方 ======= //
function handleCall() {
  pc = new RTCPeerConnection({})
  localStream.getTracks().forEach(track => pc.addTrack(track, localStream))
  pc.addEventListener('track', (e) => {
    remoteVideo.value.srcObject = e.streams[0]
  })
  pc.addEventListener('icecandidate', (e) => {
    if (e.candidate) {
      const message = {
        code: 'icecandidate',
        data: {
          targetId: targetId.value,
          candidate: e.candidate,
        },
      }
      socket.send(JSON.stringify(message))
    }
  })
  sendOffer()
}

async function sendOffer() {
  const description = await pc.createOffer()
  await pc.setLocalDescription(description)
  const message = {
    code: 'offer',
    data: {
      targetId: targetId.value,
      offer: description,
    },
  }
  socket.send(JSON.stringify(message))
}

function getAnswer({ answer }) {
  pc.setRemoteDescription(answer)
}

// ====== 接收方 ======= //
function getOffer({ fromId, offer }) {
  pc = new RTCPeerConnection({})
  localStream.getTracks().forEach(track => pc.addTrack(track, localStream))
  pc.addEventListener('track', (e) => {
    remoteVideo.value.srcObject = e.streams[0]
  })
  pc.addEventListener('icecandidate', (e) => {
    if (e.candidate) {
      // 内网穿透
      const message = {
        code: 'icecandidate',
        data: {
          targetId: fromId,
          candidate: e.candidate,
        },
      }
      socket.send(JSON.stringify(message))
    }
  })
  pc.setRemoteDescription(offer)
  sendAnswer(fromId)
}

async function sendAnswer(targetId) {
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

function handleHangup() {
  socket.close(1000)
}
</script>

<template>
  <div class="container">
    <div>
      <video ref="localVideo" autoplay />
      <video ref="remoteVideo" autoplay />
    </div>
    <div>
      <button @click="handleStart">
        start
      </button>
    </div>
    <div>
      <input v-model="targetId" type="text">
      <button @click="handleCall">
        call
      </button>
      <n-button @click="handleHangup">
        挂断
      </n-button>
    </div>
  </div>
</template>

<style scoped>
video {
  width: 500px;
  height: 400px;
  border: 1px dashed black;
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>
