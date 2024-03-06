<script setup lang="ts">
import type { RouteParams } from 'vue-router'
import { useRoute } from 'vue-router'
import { computed, unref } from 'vue'
import { service } from '~/utils/request'
import { useServerName } from '~/stores/serverName.js'
import { useProjectSettingStore } from '~/store/modules/projectSetting'
import { useProjectSetting } from '~/hooks/setting/useProjectSetting'
import { useUserStore } from '~/store/modules/user'

const props = defineProps({
  serverName: {
    type: String,
    default: '',
  },
  clickMenuItem: {
    type: String,
  },
})
// interface ServerMember {
//   userID: number
//   username: string
//   email: string
//   avatarURL: string
//   SPermissions: string
//   lastLoginDate: string
// }
const serverName = useServerName()
const route: any = useRoute()
const servername = ref('')
const userStore = useUserStore()

const menu = ref<any>([])
let params: RouteParams = useRoute('/[server_id]/[name]').params
// 服务器id变化时更新成员列表
watch(() => route.params.server_id, async (value, oldValue) => {
  params = route.params
  // 服务器id变化时更新服务器名称
  if (value !== oldValue) {
    serverName.name = props.serverName
    servername.value = props.serverName
    const map = userStore.getServerList
    if (map.get(Number(value))?.length !== 0) {
      menu.value = map.get(Number(value))
    }
    else {
      // 更新用户列表
      await getUserList()
      map.set(Number(value), menu.value)
      userStore.setServerList(map)
    }
  }
})
// 读取服务器成员列表
async function getUserList() {
  const res: { data: { users: any } } = await service.get(`/users/${params.server_id}`)
  menu.value = res.data.users
}

onMounted(async () => {
  // 读取缓存的服务器名称
  servername.value = props.serverName || serverName.name
  await getUserList()
})

const settingStore = useProjectSettingStore()
const isMobile = computed<boolean>({
  get: () => settingStore.getIsMobile,
  set: val => settingStore.setIsMobile(val),
})
const {
  navMode,
  menuSetting,
} = useProjectSetting()
const isMixMenuNoneSub = computed(() => {
  const mixMenu = unref(menuSetting).mixMenu
  const currentRoute = useRoute()
  if (unref(navMode) !== 'horizontal-mix')
    return true
  return !(unref(navMode) === 'horizontal-mix' && mixMenu && currentRoute.meta.isRoot)
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
      style="max-width: 240px;min-width: 240px; border-right: 1px solid #e8e8e8"
      :native-scrollbar="false"
    >
      <TheChannelList
        :server-name="servername"
      />
    </n-layout-content>
    <n-layout-content
      class="layout-content"
      :native-scrollbar="false"
    >
      <RouterView />
    </n-layout-content>
    <n-layout-sider
      v-if="
        !isMobile && isMixMenuNoneSub && (navMode === 'vertical' || navMode === 'horizontal-mix')
      "
      collapse-mode="width"
      :collapsed-width="0"
      :width="240"
      :native-scrollbar="false"
      show-trigger="bar"
      bordered
      class="layout-sider"
    >
      <TheInfoMenu
        :menu-options="menu"
      />
    </n-layout-sider>
  </n-layout>
</template>

<style scoped lang="less">
.layout-sider {
  min-height: 90vh;
  box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
  position: relative;
  //z-index: 13;
  transition: all 0.2s ease-in-out;
}
.layout-content {
  max-height: 90vh;
  min-height: 40vh;
}
.layout {
  max-height: 90vh;
}
</style>
