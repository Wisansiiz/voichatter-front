<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <n-result status="404" title="404 资源不存在" description="生活总归带点荒谬">
    <template #footer>
      <n-button @click="router.back()">
        返回
      </n-button>
    </template>
  </n-result>
</template>
