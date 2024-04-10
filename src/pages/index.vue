<script setup lang="ts">
import { addDays, isYesterday } from 'date-fns'
import type { NumberAnimationInst } from 'naive-ui'
import { serverCountApi } from '~/api/server'

const value = ref(addDays(Date.now(), 1).valueOf())
function handleUpdateValue(
  _: number,
  { year, month, date }: { year: number, month: number, date: number },
) {
  window.$message.success(`${year}-${month}-${date}`)
}
function isDateDisabled(timestamp: number) {
  return (isYesterday(timestamp))
}

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
  <n-flex justify="center" style="margin-top: 40px">
    <n-h1>欢迎来到Voichatter</n-h1>
  </n-flex>
  <n-flex justify="start" :wrap-item="false" style="height: 100%">
    <n-flex vertical justify="center">
      <div style="width: 500px; ">
        <n-calendar
          v-model:value="value"
          #="{ year, month, date }"
          :is-date-disabled="isDateDisabled"
          @update:value="handleUpdateValue"
        >
          {{ year }}-{{ month }}-{{ date }}
        </n-calendar>
      </div>
    </n-flex>
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
