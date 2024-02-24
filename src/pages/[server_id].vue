<script setup lang="ts">
import type { RouteParams } from 'vue-router'
import { RouterLink } from 'vue-router'
import { User } from '@vicons/carbon'
import { h } from 'vue'
import { NIcon, createDiscreteApi } from 'naive-ui'
import { service } from '~/utils/request'
import { useServerName } from '~/stores/serverName.js'

const props = defineProps({
  serverName: {
    type: String,
    default: '',
  },
})
const serverName = useServerName()
const route: any = useRoute()
const servername = ref('')

const menuOptions: any = reactive([])
let params: RouteParams = useRoute('/[server_id]/[name]').params
// 服务器id变化时更新成员列表
watch(() => route.params.server_id, async (value, oldValue) => {
  params = route.params
  // 服务器id变化时更新服务器名称
  if (value !== oldValue) {
    serverName.name = props.serverName
    servername.value = props.serverName
    // 更新用户列表
    menuOptions.splice(0, menuOptions.length)
    const res = await service.get(`/server-members/${params.server_id}`)
    res.data.members.forEach((item: ServerMember) => {
      menuOptions.push({
        label: () =>
          h(
            RouterLink,
            {
              to: {},
            },
            { default: () => item.username },
          ),
        key: item.user_id,
        icon: renderIcon(User),
      })
    })
  }
})
interface ServerMember {
  user_id: number
  username: string
  email: string
  avatar_url: string
  s_permissions: string
  last_login_date: string
}
function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
onMounted(async () => {
  // 读取缓存的服务器名称
  servername.value = props.serverName || serverName.name
  // 读取服务器成员列表
  const res = await service.get(`/server-members/${params.server_id}`)
  res.data.members.forEach((item: ServerMember) => {
    menuOptions.push({
      label: () =>
        h(
          RouterLink,
          {
            to: {
            },
          },
          { default: () => item.username },
        ),
      key: item.user_id,
      icon: renderIcon(User),
    })
  })
})

const { message, dialog } = createDiscreteApi(
  ['message', 'dialog'],
)

const options = [
  {
    label: '邀请其他人',
    key: 'invite',
  },
  {
    label: '服务器设置',
    key: 'serverSetting',
  },
  {
    label: '创建新频道',
    key: 'createNewChannel',
  },
  {
    label: '修改服务器名称',
    key: 'modifyServerName',
  },
  {
    label: () =>
      h(
        'a',
        {
          style: {
            color: 'red',
          },
          onClick: () => {
            dialog.warning({
              title: '警告',
              content: '确定删除该服务器吗',
              positiveText: '确定',
              negativeText: '不确定',
              onPositiveClick: () => {
                deleteServer()
              },
              onNegativeClick: () => {
                message.error('不确定')
              },
            })
          },
        },
        { default: () => '删除服务器' },
      ),
    key: 'delete',
  },
]

interface Response {
  code: number
  data: any
  messages: string
}
async function deleteServer() {
  const res: Response = await service.delete(`/delete-server/${route.params.server_id}`)
  gMessage.info(res.messages)
}
</script>

<template>
  <TheChannelList
    :options="options"
    :server-name="servername"
  />
  <n-layout has-sider sider-placement="right">
    <n-layout content-style="padding: 24px;" :native-scrollbar="false">
      <RouterView />
    </n-layout>
    <TheInfoMenu
      :server-name="servername"
      :menu-options="menuOptions"
    />
  </n-layout>
</template>

<style scoped>

</style>
