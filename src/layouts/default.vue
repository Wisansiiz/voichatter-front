<script lang="ts">
import type { Component } from 'vue'
import { defineComponent, h } from 'vue'
import { NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { RouterLink } from 'vue-router'
import {
  BookOutline as BookIcon,
  HomeOutline as HomeIcon,
} from '@vicons/ionicons5'

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: '/',
          },
        },
        { default: () => '回家' },
      ),
    key: 'go-back-home',
    icon: renderIcon(HomeIcon),
  },
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

export default defineComponent({
  setup() {
    return {
      collapsed: ref(true),
      menuOptions,
    }
  },
})
</script>

<template>
  <div>
    <n-layout position="absolute">
      <n-layout-header bordered style="max-height: 64px">
        <TheHeader />
        <n-menu
          mode="horizontal" :options="menuOptions"
        />
      </n-layout-header>
      <n-layout has-sider position="absolute" style="top: 64px">
        <n-layout-sider
          bordered
          collapse-mode="width"
          :collapsed-width="64"
          :width="240"
          :collapsed="collapsed"
          show-trigger
          @collapse="collapsed = true"
          @expand="collapsed = false"
        >
          <n-menu
            :collapsed="collapsed"
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="menuOptions"
          />
        </n-layout-sider>
        <n-layout has-sider sider-placement="right">
          <n-layout content-style="padding: 24px;" :native-scrollbar="false">
            <RouterView />
          </n-layout>
          <n-layout-sider
            bordered
            show-trigger
            collapse-mode="width"
            :collapsed-width="64"
            :width="240"
            :native-scrollbar="false"
          >
            <n-menu
              :collapsed-width="64"
              :collapsed-icon-size="22"
              :options="menuOptions"
            />
          </n-layout-sider>
        </n-layout>
      </n-layout>
    </n-layout>
  </div>
</template>

<style scoped>

</style>
