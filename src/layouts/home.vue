<script setup lang="ts">
</script>

<template>
  <div class="contain">
    <n-flex justify="center">
      <n-h1>在线语音聊天频道</n-h1>
    </n-flex>
    <n-flex justify="center">
      <n-h1>Voichatter</n-h1>
    </n-flex>
    <RouterView />
  </div>
</template>

<style scoped>
.contain {
  height: 100vh;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
