<script lang="ts">
import { useShowSettingStore } from '~/store/modules/showStetting'

export default defineComponent({
  setup() {
    const showSettingStore = useShowSettingStore()
    const isShow = computed(() => showSettingStore.isShowMembersList)
    const loading = computed(() => showSettingStore.showChannelList)

    return {
      isShow,
      loading,
    }
  },
})
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
      <n-spin :show="loading">
        <TheChannelList />
      </n-spin>
    </n-layout-content>
    <n-layout-content
      class="layout-content"
      :native-scrollbar="false"
    >
      <RouterView />
    </n-layout-content>
    <n-layout-sider
      v-if="isShow"
      collapse-mode="width"
      :collapsed-width="0"
      :width="240"
      :native-scrollbar="false"
      bordered
      class="layout-sider"
    >
      <TheInfoMenu />
    </n-layout-sider>
  </n-layout>
</template>

<style scoped lang="less">
.layout-sider {
  min-height: 91vh;
  box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
  position: relative;
  transition: all 0.2s ease-in-out;
}
.layout-content {
  max-height: 91vh;
  min-height: 91vh;
  padding: 10px;
}
.layout {
  max-height: 91vh;
}
</style>
