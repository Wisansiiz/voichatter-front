<script lang="ts">
import { useWebRTCStore } from '~/store/modules/webrtc'

export default defineComponent({
  setup() {
    const videoContainer = ref()
    const localVideo = ref()

    const webRTCStore = useWebRTCStore()
    onMounted(() => {
      webRTCStore.setLocalVideo(localVideo.value)
      webRTCStore.setVideoContainer(videoContainer.value)
    })

    onBeforeRouteUpdate(async (_to) => {
      await webRTCStore.hangUp()
    })
    onBeforeRouteLeave(async (_to, _from, next) => {
      await webRTCStore.hangUp()
      next()
    })

    const isVideo = ref(false)
    const isAudio = ref(true)
    return {
      videoContainer,
      localVideo,
      isVideo,
      isAudio,
      handleChange(value: boolean) {
        window.$message.info(`Update value: ${value}`)
      },
      handleJoin: () => {
        webRTCStore.handleJoin(isVideo.value, isAudio.value)
      },
      hangUp: () => {
        webRTCStore.hangUp()
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
