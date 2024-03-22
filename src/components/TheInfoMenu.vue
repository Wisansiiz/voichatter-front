<script lang="ts">
import { defineComponent, h, nextTick, ref } from 'vue'
import type { DataTableColumns, DropdownOption } from 'naive-ui'
import { NTag, useMessage } from 'naive-ui'
import { useServerListStore } from '~/store/modules/serverList'

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
  setup() {
    const serverListStore = useServerListStore()
    const route: any = useRoute()
    const message = useMessage()
    const showDropdownRef = ref(false)
    const xRef = ref(0)
    const yRef = ref(0)
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
    const updateMemberList = () => {
      serverListStore.toSetMemberList()
    }
    onMounted(updateMemberList)
    watch(() => route.params.server_id, updateMemberList)

    return {
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
      data: computed(() => serverListStore.memberList),
    }
  },
})
</script>

<template>
  <n-data-table :columns="cols" :data="data" :row-props="rowProps" />
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
