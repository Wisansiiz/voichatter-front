<script setup>
import TheServerMenu from '~/components/TheServerMenu.vue'
import TheInfoMenu from '~/components/TheInfoMenu.vue'
</script>

<template>
  <n-layout position="absolute">
    <TheHeader />
    <n-layout has-sider position="absolute" style="top: 50px">
      <TheServerMenu />
      <n-layout has-sider style="max-width: 240px; border-right: 1px solid #e8e8e8">
        占位
      </n-layout>
      <n-layout has-sider sider-placement="right">
        <n-layout content-style="padding: 24px;" :native-scrollbar="false">
          <RouterView />
        </n-layout>
        <TheInfoMenu />
      </n-layout>
    </n-layout>
  </n-layout>
</template>

<style scoped>

</style>
