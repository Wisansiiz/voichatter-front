<script setup lang="ts">
const params = useRoute('/server/channel/[name]').params
</script>

<template>
  <n-h1>{{ params.name }}</n-h1>
</template>

<style scoped>

</style>
