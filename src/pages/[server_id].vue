<script setup lang="ts">
const props = defineProps<{
  serverName: string
}>()
const route = useRoute()
const servername = ref('')
servername.value = props.serverName
watch(route, () => {
  servername.value = props.serverName
})
</script>

<template>
  <TheChannelList :server-name="servername" />
  <n-layout has-sider sider-placement="right">
    <n-layout content-style="padding: 24px;" :native-scrollbar="false">
      <RouterView />
    </n-layout>
    <TheInfoMenu />
  </n-layout>
</template>

<style scoped>

</style>
