<script setup lang="ts">
import { useServerListStore } from '~/store/modules/serverList'

const props = defineProps<{
  activityTitle: string
  activityDesc: string
  startDate: string
  endDate: string
  serverId: number
}>()
// const emit = defineEmits(['data'])
const serverListStore = useServerListStore()
const { toJoinServer, setServerInfo } = serverListStore
function handleJoin() {
  window.$dialog.create({
    title: '确认参加活动',
    content: '确认参加该活动吗？',
    positiveText: '确定',
    negativeText: '不确定',
    onPositiveClick: () => {
      const serverId = props.serverId
      toJoinServer({ serverId })
      setServerInfo()
      window.$message.success('参加成功')
    },
    onNegativeClick: () => {
      window.$message.info('不确定')
    },
  })
}
</script>

<template>
  <n-card
    :title="activityTitle"
    style="max-width: 300px;"
  >
    {{ activityDesc }}
    <template #header-extra>
      {{ startDate }}
    </template>
    <template #footer>
      结束时间：{{ endDate }}
    </template>
    <template #action>
      <n-button @click="handleJoin">
        参加
      </n-button>
    </template>
  </n-card>
</template>

<style scoped>

</style>
