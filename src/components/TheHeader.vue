<script setup lang="ts">
import { Home, Search, Store } from '@vicons/carbon'
import { NIcon } from 'naive-ui'
</script>

<template>
  <n-layout-header bordered style="height: 50px; padding: 5px">
    <n-breadcrumb separator="|">
      <n-flex style="padding-left: 10px">
        <n-breadcrumb-item>
          <NIcon><Home /></NIcon>
          <RouterLink to="/">
            首页
          </RouterLink>
        </n-breadcrumb-item>
        <n-breadcrumb-item>
          <NIcon><Search /></NIcon>
          搜索
        </n-breadcrumb-item>
        <n-breadcrumb-item>
          <NIcon><Store /></NIcon>
          <RouterLink to="/store">
            商城?
          </RouterLink>
        </n-breadcrumb-item>
        <n-breadcrumb-item>
          <n-image
            style="border-radius: 50%"
            height="32"
            src="https://thirdqq.qlogo.cn/g?b=qq&nk=1392634254&s=100"
          />
        </n-breadcrumb-item>
      </n-flex>
    </n-breadcrumb>
  </n-layout-header>
</template>

<style scoped>

</style>
