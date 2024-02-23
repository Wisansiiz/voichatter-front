<script setup lang="ts">
import type { GlobalTheme } from 'naive-ui'

const serverName = ref('')
function getServerName(data: string) {
  serverName.value = data
}
const theme = ref<GlobalTheme | null>(null)
function getTheme(data: GlobalTheme) {
  theme.value = data
}
</script>

<template>
  <n-config-provider :theme="theme">
    <n-layout position="absolute">
      <TheHeader @theme="getTheme" />
      <n-layout has-sider position="absolute" style="top: 50px">
        <TheServerMenu @server-name="getServerName" />
        <RouterView :server-name="serverName" />
      </n-layout>
    </n-layout>
  </n-config-provider>
</template>

<style scoped>

</style>
