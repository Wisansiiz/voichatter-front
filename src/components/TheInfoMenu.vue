<script setup lang="ts">
import { h, nextTick, ref } from 'vue'
import type { DataTableColumns, DropdownOption } from 'naive-ui'
import { NTag } from 'naive-ui'
import { useServerListStore } from '~/store/modules/serverList'
import { modifyUserSPermissionsApi } from '~/api/user'

const serverListStore = useServerListStore()
const route: any = useRoute()
const showDropdownRef = ref(false)
const xRef = ref(0)
const yRef = ref(0)
const userInfo = ref({
  userId: 0,
  username: '',
  sPermissions: '',
})

async function modifyUserSPermissions(): Promise<void> {
  await modifyUserSPermissionsApi(route.params.server_id, userInfo)
}

const menu = ref([] as any[])
const isLoading = ref(false)
async function updateMemberList() {
  isLoading.value = true
  await serverListStore.toSetMemberList().then((res: any) => {
    menu.value = res
  })
  isLoading.value = false
}
const options: DropdownOption[] = [
  {
    label: '编辑',
    key: 'edit',
    children: [
      {
        label: '管理员',
        key: 'admin',
        props: {
          onClick: async () => {
            userInfo.value.sPermissions = 'admin'
            await modifyUserSPermissions()
            await updateMemberList()
          },
        },
      },
      {
        label: '普通成员',
        key: 'member',
        props: {
          onClick: async () => {
            userInfo.value.sPermissions = 'member'
            await modifyUserSPermissions()
            await updateMemberList()
          },
        },
      },
    ],
  },
  {
    label: () => h('span', { style: { color: 'red' } }, '举报'),
    key: 'report',
    props: {
      onClick: () => {
        window.$message.success(`你举报了${userInfo.value.username}感谢你的为社区做的贡献`)
      },
    },
  },
  {
    label: () => h('span', { style: { color: 'red' } }, '删除'),
    key: 'delete',
  },
]
const colsReactive: DataTableColumns = [
  {
    title: '头像',
    key: 'avatarURL',
  },
  {
    title: '用户',
    key: 'username',
  },
  {
    title: '身份',
    key: 'SPermissions',
    render(row) {
      return h(
        NTag,
        {
          style: {
            marginRight: '6px',
          },
          type: 'info',
          bordered: false,
        },
        {
          default: () => row.SPermissions,
        },
      )
    },
  },
]

onMounted(updateMemberList)
watch(() => route.params.server_id, updateMemberList)

const cols = colsReactive
const showDropdown = showDropdownRef
const x = xRef
const y = yRef
function handleSelect() {
  showDropdownRef.value = false
}
function onClickoutside() {
  showDropdownRef.value = false
}
function rowProps(row: { username: string, SPermissions: string, userId: number }) {
  return {
    onContextmenu: (e: MouseEvent) => {
      userInfo.value = { username: row.username, sPermissions: row.SPermissions, userId: row.userId }
      // window.$message.info(JSON.stringify([row.SPermissions, row.username, row.userId], null, 2))
      e.preventDefault()
      showDropdownRef.value = false
      nextTick().then(() => {
        showDropdownRef.value = true
        xRef.value = e.clientX
        yRef.value = e.clientY
      })
    },
  }
}
</script>

<template>
  <n-data-table :columns="cols" :data="menu" :row-props="rowProps" :loading="isLoading" />
  <n-dropdown
    placement="bottom-start"
    trigger="manual"
    :x="x"
    :y="y"
    :options="options"
    :show="showDropdown"
    :on-clickoutside="onClickoutside"
    @select="handleSelect"
  />
</template>

<style scoped lang="less">
</style>
