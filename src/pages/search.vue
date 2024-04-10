<script setup lang="ts">
import { Search } from '@vicons/ionicons5'
import type { InputProps } from 'naive-ui'
import { serverSearchApi } from '~/api/server'

const searchValue = ref('')
export interface Data {
  servers: Server[]
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
  const res: Data = await serverSearchApi(searchValue.value)
  serverList.value = res.servers
  loading.value = false
}

type InputThemeOverrides = NonNullable<InputProps['themeOverrides']>
const inputThemeOverrides: InputThemeOverrides = {
  heightLarge: '50px',
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
  <n-spin :show="loading" style="margin-top: 30px">
    <n-flex justify="center" style="padding: 20px;">
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
        </n-card>
      </template>
    </n-flex>
  </n-spin>
</template>

<style scoped>
</style>
