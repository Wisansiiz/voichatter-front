<script setup>
import { h } from 'vue'
import { NIcon } from 'naive-ui'
import { RouterLink } from 'vue-router'
import {
  BookOutline as BookIcon,
} from '@vicons/ionicons5'

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: '/ws',
          },
        },
        { default: () => '房间' },
      ),
    key: 'go-room',
    icon: renderIcon(BookIcon),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: '/server',
          },
        },
        { default: () => '123房间' },
      ),
    key: 'go-123room',
    icon: renderIcon(BookIcon),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: '/login',
          },
        },
        { default: () => '登录' },
      ),
    key: '',
    icon: renderIcon(BookIcon),
  },
]
const collapsed = ref(true)
</script>

<template>
  <n-layout-sider
    bordered
    collapse-mode="width"
    :collapsed-width="64"
    :collapsed="true"
    @collapse="collapsed = true"
    @expand="collapsed = false"
  >
    <n-menu
      :collapsed="true"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
    />
  </n-layout-sider>
</template>

<style scoped>

</style>
