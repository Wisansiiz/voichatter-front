<script setup lang="ts">
import type { Notification } from '~/api/notification/notification'
import { deleteNotificationApi, getNotificationApi, updateNotificationApi } from '~/api/notification/notification'

const notification = ref<Notification>(null)
const route = useRoute('/server-setting/[serverId]')
const loading = ref(false)
onMounted(async () => {
  loading.value = true
  await getNotificationApi(route.params.serverId).then((res) => {
    if (res)
      notification.value = res
  })
  loading.value = false
})

function handleUpdate() {
  updateNotificationApi(route.params.serverId, notification.value).then((res) => {
    console.log(res)
    window.$message.success('更新成功')
  })
}
function handleDel() {
  window.$dialog.create({
    title: '确认删除',
    content: '确认删除该通知吗？',
    positiveText: '确定',
    negativeText: '不确定',
    onPositiveClick: () => {
      deleteNotificationApi(route.params.serverId, notification.value.notificationId)
      window.$message.success('删除成功')
    },
    onNegativeClick: () => {
      window.$message.info('不确定')
    },
  })
}
</script>

<template>
  <n-spin :show="loading">
    <n-space vertical justify="center">
      <template v-if="notification">
        <n-h2>通知设置</n-h2>
        <n-form
          label-placement="left"
          label-width="auto"
          require-mark-placement="right-hanging"
          :style="{
            maxWidth: '640px',
          }"
        >
          <n-form-item
            label="通知ID"
          >
            <n-input :value="String(notification.notificationId)" placeholder="Notification Id" disabled />
          </n-form-item>
          <n-form-item
            label="服务器ID"
          >
            <n-input :value="String(notification.serverId)" placeholder="Server Id" disabled />
          </n-form-item>
          <n-form-item
            label="最后编辑日期"
          >
            <n-input :value="notification.lastEditDate" placeholder="Last Edit Date" disabled />
          </n-form-item>
          <n-form-item
            label="创建用户ID"
          >
            <n-input :value="String(notification.createUserId)" placeholder="Create User Id" disabled />
          </n-form-item>
          <n-form-item
            label="通知标题"
          >
            <n-input v-model:value="notification.title" placeholder="标题" />
          </n-form-item>
          <n-form-item
            label="通知内容"
          >
            <n-input v-model:value="notification.content" placeholder="被搜索时别人看到的描述" type="textarea" :autosize="{ minRows: 3, maxRows: 5 }" />
          </n-form-item>
        </n-form>
        <n-flex justify="between">
          <n-button type="primary" @click="handleUpdate">
            修改
          </n-button>
          <n-button type="error" @click="handleDel">
            删除
          </n-button>
        </n-flex>
      </template>
      <template v-else>
        <n-h2>暂无通知</n-h2>
      </template>
    </n-space>
  </n-spin>
</template>

<style scoped>

</style>
