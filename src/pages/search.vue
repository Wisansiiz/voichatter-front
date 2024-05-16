<script setup lang="ts">
import { Search } from '@vicons/ionicons5'
import type { InputProps } from 'naive-ui'
import { ref } from 'vue'
import { serverPagesApi } from '~/api/server'
import { useServerListStore } from '~/store/modules/serverList'

const pageCount = ref(0)
const page = ref(1)
const pageSize = ref(6)
const searchValue = ref('')
export interface Data {
  servers: Server[]
  pageTotal: number
  [property: string]: any
}

export interface Server {
  createDate: string
  creatorUserId: number
  serverId: number
  serverImgUrl: string
  serverName: string
  serverType: string
  serverDescription: string
  [property: string]: any
}
const serverList = ref([] as Server[])
const loading = ref(false)
async function search() {
  loading.value = true
  const res: Data = await serverPagesApi(page.value, pageSize.value, searchValue.value)
  serverList.value = res.servers
  pageCount.value = res.pageTotal
  loading.value = false
}

type InputThemeOverrides = NonNullable<InputProps['themeOverrides']>
const inputThemeOverrides: InputThemeOverrides = {
  heightLarge: '50px',
}

const serverListStore = useServerListStore()
const { toJoinServer, setServerInfo } = serverListStore
function handleJoin(serverId: number) {
  window.$dialog.create({
    title: '确认参加活动',
    content: '确认参加该活动吗？',
    positiveText: '确定',
    negativeText: '不确定',
    onPositiveClick: () => {
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
  <n-flex justify="center" style="margin-top: 20px">
    <n-h1>
      搜索服务器，发现你感兴趣的
    </n-h1>
  </n-flex>
  <n-flex justify="center">
    <n-input
      v-model:value="searchValue"
      round
      placeholder="搜索服务器"
      style="margin-top: 50px;width: 70%; text-align: center"
      size="large"
      height-large="50px"
      :theme-overrides="inputThemeOverrides"
    >
      <template #suffix>
        <n-button text style="font-size: 20px" @click="search">
          <n-icon :component="Search" />
        </n-button>
      </template>
    </n-input>
  </n-flex>
  <n-spin :show="loading" style="margin-top: 10px">
    <n-flex justify="center" style="padding: 30px" :wrap-item="false">
      <template
        v-if="serverList"
      >
        <n-card
          v-for="(item, index) in serverList"
          :key="index"
          :title="item.serverName"
          style="max-width: 300px;"
        >
          <template #cover>
            <n-image
              :src="item.serverImgUrl"
              size="50"
              preview-disabled
              fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            />
          </template>
          {{ item.serverDescription }}

          <template #action>
            <n-button @click="handleJoin(item.serverId)">
              参加
            </n-button>
          </template>
        </n-card>
      </template>
    </n-flex>
    <n-flex justify="end">
      <n-pagination
        v-model:page="page"
        v-model:page-size="pageSize"
        :item-count="pageCount"
        @update:page="search"
      />
    </n-flex>
  </n-spin>
</template>

<style scoped>
</style>
