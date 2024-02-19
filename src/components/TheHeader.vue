<script setup>
import { Home, Search, Store, User } from '@vicons/carbon'
import { NIcon } from 'naive-ui'
import {
  Pencil as EditIcon,
  LogOutOutline as LogoutIcon,
  PersonCircleOutline as UserIcon,
} from '@vicons/ionicons5'

function renderIcon(icon) {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    })
  }
}
const options = [
  {
    label: '用户资料',
    key: 'profile',
    icon: renderIcon(UserIcon),
  },
  {
    label: '编辑用户资料',
    key: 'editProfile',
    icon: renderIcon(EditIcon),
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon(LogoutIcon),
  },
]
function handleSelect(key) {
  if (key === 'logout')
    logout()
  gMessage.info(String(key))
}
</script>

<template>
  <n-layout-header bordered style="height: 50px">
    <n-breadcrumb separator="|" style="line-height: 42px">
      <n-flex style="padding-left: 10px">
        <n-breadcrumb-item>
          <NIcon><Home /></NIcon>
          <RouterLink to="/">
            首页
          </RouterLink>
        </n-breadcrumb-item>
        <n-breadcrumb-item>
          <NIcon><Search /></NIcon>
          搜索
        </n-breadcrumb-item>
        <n-breadcrumb-item>
          <NIcon><Store /></NIcon>
          <RouterLink to="/store">
            商城?
          </RouterLink>
        </n-breadcrumb-item>
        <n-breadcrumb-item>
          <NIcon><User /></NIcon>
          <n-dropdown trigger="hover" :options="options" @select="handleSelect">
            <RouterLink to="/my">
              我的
            </RouterLink>
          </n-dropdown>
        </n-breadcrumb-item>
      </n-flex>
    </n-breadcrumb>
  </n-layout-header>
</template>

<style scoped>

</style>
