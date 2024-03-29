<script setup lang="ts">
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { nextTick, ref } from 'vue'

// 向父元素传递resultData
const emit = defineEmits(['update:resultData'])

const resultDate: any = {
  blobData: null,
  dataURL: null,
}
let cropper: Cropper
function initCropper() {
  const image: any = document.getElementById('image')
  cropper?.destroy()
  cropper = new Cropper(image, {
    viewMode: 1,
    dragMode: 'move',
    aspectRatio: 1,
    autoCropArea: 0.5,
    cropBoxResizable: false,
    toggleDragModeOnDblclick: false,
    preview: '.img-preview',
  })
}
const showCropper = ref(false)
const picSrc = ref<string>()
function showCropperWindow(imgURL: string) {
  resultDate.blobData = null
  resultDate.dataURL = null
  showCropper.value = true
  picSrc.value = imgURL
  nextTick(() => {
    initCropper()
  })
}
function getCropperCanvas() {
  const croppedCanvas = cropper.getCroppedCanvas({
    width: 120,
    height: 120,
  })
  resultDate.dataURL = croppedCanvas.toDataURL('image/png')
  croppedCanvas.toBlob((blob) => {
    resultDate.blobData = blob
    emit('update:resultData', resultDate)
  })
  showCropper.value = false
}

defineExpose({
  showCropperWindow,
})
</script>

<template>
  <n-modal
    v-model:show="showCropper"
    preset="card"
    closable
    title="头像上传"
    style="height: 560px; width: 800px;"
    segmented
    content-style="height: 0"
    :mask-closable="false"
  >
    <template #default>
      <n-space justify="space-between" :wrap-item="false" style="height: 100%">
        <div style="height: 100%; width: calc(100% - 200px);">
          <img id="image" :src="picSrc" style="max-height: 100%; max-width: 100%;" alt="">
        </div>
        <n-space justify="center" :size="24" vertical :wrap-item="false" style="width: 170px;">
          <n-space vertical align="center">
            <div class="img-preview img-preview-120" />
            <n-text>120 X 120 像素</n-text>
          </n-space>
          <n-space vertical align="center">
            <div class="img-preview img-preview-40" />
            <n-text>40 X 40 像素</n-text>
          </n-space>
          <n-space vertical align="center">
            <div class="img-preview img-preview-36" />
            <n-text>36 X 36 像素</n-text>
          </n-space>
        </n-space>
      </n-space>
    </template>
    <template #action>
      <n-space justify="end">
        <n-button @click="showCropper = false">
          取消
        </n-button>
        <n-button type="primary" @click="getCropperCanvas">
          确定
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<style scoped>
.img-preview {
  border: 1px solid darkgray;
  border-radius: 50%;
  overflow: hidden;
}
.img-preview-120 {
  width: 120px;
  height: 120px;
}
.img-preview-40 {
  width: 40px;
  height: 40px;
}
.img-preview-36 {
  width: 36px;
  height: 36px;
}
</style>
