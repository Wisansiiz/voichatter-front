<script  lang="ts" setup>
import { websocketStore } from '~/stores/websokcet.js'
import socket from '~/utils/websocket'

const web = websocketStore()
const route = useRoute()
const v1 = ref()
const v2 = ref()
const pc = ref()
const mystream = ref()
// const uid = localStorage.getItem("im-userid");
// const tid = route.query.from;
const uid = ref()
const tid = ref()
const isaccept = ref(false)

function accept() {
  socket.send({ uid: uid.value, to: tid.value, type: 4 })
}

function loginWebsocket() {
  Promise.resolve().then(() => {
    socket.init()
  }).then(() => {
    //  uid.value = localStorage.getItem("im-userid")
    if (route.query.type == 1) {
      uid.value = localStorage.getItem('im-userid')
      tid.value = route.query.from
    }
    else {
      uid.value = localStorage.getItem('im-userid')
      tid.value = route.query.from
      isaccept.value = true
    }
    socket.send({ uid: uid.value, type: 1 })
  }).then(() => {
    if (route.query.type == 1)
      socket.send({ uid: uid.value, to: tid.value, type: 3 })
  })
}

web.$subscribe((mutations, state) => {
  const msg = JSON.parse(state.msg)
  sxt().then((res) => {
    console.log(res)
    socket.send({ uid: uid.value, to: tid.value, type: 5 })
  })

  sxt().then((res) => {
    console.log(res)
    if (pc.value == null)
      createPeerConnection()
    pc.value.createOffer(createOfferAndSendMessage, handleCreateOfferError)
  })

  if (pc.value == null)
    createPeerConnection()

  console.log(msg.message)
  pc.value.setRemoteDescription(new RTCSessionDescription(msg.message))
  doAnswer()

  pc.value.setRemoteDescription(new RTCSessionDescription(msg.message))

  console.log('aaa')
  const candidate = new RTCIceCandidate({
    sdpMLineIndex: msg.message.sdpMLineIndex,
    candidate: msg.message.candidate,
  })
  pc.value.addIceCandidate(candidate)
  // switch (msg.type) {
  //   case 4:
  //     sxt().then((res) => {
  //       socket.send({ uid: uid.value, to: tid.value, type: 5 })
  //     })
  //     break
  //   case 5:
  //     sxt().then((res) => {
  //       if (pc.value == null)
  //         createPeerConnection()
  //
  //       pc.value.createOffer(createOfferAndSendMessage, handleCreateOfferError)
  //     })
  //     break
  //   case 6:
  //     if (pc.value == null)
  //       createPeerConnection()
  //
  //     console.log(msg.message)
  //     pc.value.setRemoteDescription(new RTCSessionDescription(msg.message))
  //     doAnswer()
  //     break
  //   case 7:
  //     pc.value.setRemoteDescription(new RTCSessionDescription(msg.message))
  //     break
  //   case 8:
  //
  //     console.log('aaa')
  //     candidate = new RTCIceCandidate({
  //       sdpMLineIndex: msg.message.sdpMLineIndex,
  //       candidate: msg.message.candidate,
  //     })
  //     pc.value.addIceCandidate(candidate)
  //
  //     break
  // }
})

function handleCreateOfferError() {
  console.log('==================handleCreateOfferError')
}

function createOfferAndSendMessage(sessionDescription: any) {
  pc.value.setLocalDescription(sessionDescription)
  socket.send({ uid: uid.value, to: tid.value, type: 6, message: sessionDescription })
}

function doAnswer() {
  if (pc.value == null)
    createPeerConnection()

  pc.value.createAnswer().then(createAnswerAndSendMessage, handleCreateAnswerError)
}

function handleCreateAnswerError() {
  console.log('bbb')
}

function createAnswerAndSendMessage(sessionDescription: any) {
  pc.value.setLocalDescription(sessionDescription)
  socket.send({ uid: uid.value, to: tid.value, type: 7, message: sessionDescription })
}

function createPeerConnection() {
  pc.value = new RTCPeerConnection(null)
  pc.value.onicecandidate = handleIceCandidate
  pc.value.onaddstream = handleRemoteStreamAdded
  for (const trac of mystream.value.getTracks())
    pc.value.addTrack(trac, mystream.value)
}

function handleRemoteStreamAdded(event: any) {
  console.log(event)
  v2.value.srcObject = event.stream
}

function handleIceCandidate(event: any) {
  if (event.candidate)
    socket.send({ uid: uid.value, to: tid.value, type: 8, message: event.candidate })
}

// 开启摄像头
function sxt() {
  return new Promise((resolve: any, reject: any) => {
    navigator.mediaDevices.getUserMedia({
      audio: true,
    }).then((value) => {
      mystream.value = value
      v1.value.srcObject = value // 自己的流
    }).then(() => resolve())
      .catch(() => reject())
  })
}

onMounted(() => {
  loginWebsocket()
})
</script>

<template>
  {{ uid }}{{ tid }}
  <n-button v-if="isaccept" @click="accept">
    接受
  </n-button>
  <audio ref="v1" autoplay style="width: 300px;height: 300px" />
  <audio ref="v2" autoplay style="width: 300px;height: 300px" />
</template>

<style scoped>

</style>
