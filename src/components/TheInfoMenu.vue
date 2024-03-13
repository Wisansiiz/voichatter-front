<script lang="ts">
import { defineComponent, h, nextTick, ref } from 'vue'
import type { DataTableColumns, DropdownOption } from 'naive-ui'
import { NTag, useMessage } from 'naive-ui'
import { createImageVNode } from '~/utils'

interface ServerMember {
  userID: number
  username: string
  email: string
  avatarURL: string
  SPermissions: string
  lastLoginDate: string
}

const options: DropdownOption[] = [
  {
    label: '编辑',
    key: 'edit',
  },
  {
    label: () => h('span', { style: { color: 'red' } }, '删除'),
    key: 'delete',
  },
]

export default defineComponent({
  props: {
    menuOptions: {
      type: Array<ServerMember>,
      default: () => [],
    },
  },
  setup(props) {
    const menu = computed(() => {
      return props.menuOptions.map((item) => {
        return {
          avatarURL: createImageVNode('https://thirdqq.qlogo.cn/g?b=qq&nk=1392634254&s=100', item.username),
          username: item.username,
          SPermissions: item.SPermissions,
        }
      })
    })
    const message = useMessage()
    const showDropdownRef = ref(false)
    const xRef = ref(0)
    const yRef = ref(0)
    const colsReactive: DataTableColumns<ServerMember> = [
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

    return {
      menu,
      cols: colsReactive,
      options,
      showDropdown: showDropdownRef,
      x: xRef,
      y: yRef,
      handleSelect() {
        showDropdownRef.value = false
      },
      onClickoutside() {
        showDropdownRef.value = false
      },
      rowProps: (row: { username: string, SPermissions: string }) => {
        return {
          onContextmenu: (e: MouseEvent) => {
            message.info(JSON.stringify([row.SPermissions, row.username], null, 2))
            e.preventDefault()
            showDropdownRef.value = false
            nextTick().then(() => {
              showDropdownRef.value = true
              xRef.value = e.clientX
              yRef.value = e.clientY
            })
          },
        }
      },
    }
  },
})
</script>

<template>
  <n-data-table :columns="cols" :data="menu" :row-props="rowProps" />
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
