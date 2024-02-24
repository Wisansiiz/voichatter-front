<script setup lang="ts">
const props = defineProps({
  menuOptions: {
    type: Array,
    default: () => [],
  },
})
const collapsed = ref(false)
</script>

<template>
  <n-layout-sider
    bordered
    show-trigger
    collapse-mode="width"
    :collapsed-width="64"
    :width="240"
    :collapsed="collapsed"
    @collapse="collapsed = true"
    @expand="collapsed = false"
  >
    <n-flex justify="center">
      <n-h3>服务器成员列表</n-h3>
    </n-flex>
    <n-menu
      :collapsed="true"
      :collapsed-width="64"
      :collapsed-icon-size="35"
      :options="menuOptions"
    />
  </n-layout-sider>
</template>

<style scoped>

</style>
