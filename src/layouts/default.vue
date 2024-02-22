<script setup>
// 创建一个响应式引用
const serverName = ref('')
function getServerName(data) {
  serverName.value = data
}
</script>

<template>
  <n-layout position="absolute">
    <TheHeader />
    <n-layout has-sider position="absolute" style="top: 50px">
      <TheServerMenu @server-name="getServerName" />
      <RouterView :server-name="serverName" />
    </n-layout>
  </n-layout>
</template>

<style scoped>

</style>
