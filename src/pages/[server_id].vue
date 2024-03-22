<script lang="ts">
</script>

<template>
  <n-layout
    has-sider
    sider-placement="right"
    :native-scrollbar="false"
    style="margin-top: 2px"
    class="layout"
  >
    <n-layout-content
      has-sider
      style="max-width: 240px; border-right: 1px solid #e8e8e8"
      :native-scrollbar="false"
    >
      <TheChannelList />
    </n-layout-content>
    <n-layout-content
      class="layout-content"
      :native-scrollbar="false"
    >
      <RouterView />
    </n-layout-content>
    <n-layout-sider
      collapse-mode="width"
      :collapsed-width="0"
      :width="240"
      :native-scrollbar="false"
      show-trigger="bar"
      bordered
      class="layout-sider"
    >
      <TheInfoMenu />
    </n-layout-sider>
  </n-layout>
</template>

<style scoped lang="less">
.layout-sider {
  min-height: 90vh;
  box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
  position: relative;
  transition: all 0.2s ease-in-out;
}
.layout-content {
  max-height: 90vh;
  min-height: 40vh;
  padding: 10px;
}
.layout {
  max-height: 90vh;
}
</style>
