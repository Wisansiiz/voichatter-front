<script setup>
defineOptions({
  name: 'IndexPage',
})
const router = useRouter()
</script>

<template>
  <n-scrollbar style="margin-bottom: 50px">
    <n-h1>主页</n-h1>
    <n-button @click="logout().then(() => router.push('/login'))">
      退出登录
    </n-button>
  </n-scrollbar>
</template>
