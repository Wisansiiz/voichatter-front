<script setup lang="ts">
import type { NumberAnimationInst } from 'naive-ui'
import { serverCountApi } from '~/api/server'

const numberAnimationInstRef = ref<NumberAnimationInst | null>(null)
function handleClick() {
  numberAnimationInstRef.value?.play()
}

const count = ref(0)
serverCount()
function serverCount() {
  serverCountApi().then((res: any) => {
    count.value = res.count
  })
}
</script>

<template>
  <n-flex justify="center" style="margin-top: 240px">
    <n-h1>欢迎来到Voichatter</n-h1>
  </n-flex>
  <n-flex justify="center" :wrap-item="false" style="height: 100%">
    <n-flex vertical justify="center">
      <n-statistic label="一共有" tabular-nums>
        <n-number-animation ref="numberAnimationInstRef" :from="0" :to="count" />
        <template #suffix>
          个服务器
        </template>
      </n-statistic>
      <n-space vertical>
        花时间、花精力、花心思，愿你每一份努力都不负所望
        <n-button @click="handleClick">
          播放
        </n-button>
      </n-space>
    </n-flex>
  </n-flex>
</template>

<style scoped>
</style>
