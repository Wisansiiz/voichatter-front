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
      // {
      //   title: () =>
      //     h(
      //       NButton,
      //       {
      //         size: 'small',
      //         on: {
      //           // click: handleSelect,
      //         },
      //       },
      //       {
      //         default: () => h('span', { style: { color: 'green' } }, '刷新'),
      //       },
      //     ),
      //   key: 'SPermissions',
      // },
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
      // data,
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
<!--  <n-popover v-for="(option, index) in menuOptions" :key="index" placement="left-start" trigger="click"> -->
<!--    &lt;!&ndash;    <template #trigger> &ndash;&gt; -->
<!--    &lt;!&ndash;      <n-data-table :columns="cols" :data="menu" :row-props="rowProps" /> &ndash;&gt; -->
<!--    &lt;!&ndash;      <n-dropdown &ndash;&gt; -->
<!--    &lt;!&ndash;        placement="bottom-start" &ndash;&gt; -->
<!--    &lt;!&ndash;        trigger="manual" &ndash;&gt; -->
<!--    &lt;!&ndash;        :x="x" &ndash;&gt; -->
<!--    &lt;!&ndash;        :y="y" &ndash;&gt; -->
<!--    &lt;!&ndash;        :options="options" &ndash;&gt; -->
<!--    &lt;!&ndash;        :show="showDropdown" &ndash;&gt; -->
<!--    &lt;!&ndash;        :on-clickoutside="onClickoutside" &ndash;&gt; -->
<!--    &lt;!&ndash;        @select="handleSelect" &ndash;&gt; -->
<!--    &lt;!&ndash;      /> &ndash;&gt; -->
<!--    &lt;!&ndash;    </template> &ndash;&gt; -->
<!--    <div style="width: 200px; height: 300px"> -->
<!--      <n-avatar -->
<!--        round -->
<!--        size="large" -->
<!--        src="https://thirdqq.qlogo.cn/g?b=qq&nk=1392634254&s=100" -->
<!--      /> -->
<!--      <n-flex style="border: #e8e8e8 1px solid; width: 100%; height: 80%;" justify="start"> -->
<!--        <n-text> -->
<!--          name: {{ option.username }} -->
<!--        </n-text> -->
<!--        <n-text> -->
<!--          id: {{ option.userID }} -->
<!--        </n-text> -->
<!--      </n-flex> -->
<!--    </div> -->
<!--  </n-popover> -->
</template>
<!-- <template> -->
<!--  &lt;!&ndash;  <n-layout-sider &ndash;&gt; -->
<!--  &lt;!&ndash;    bordered &ndash;&gt; -->
<!--  &lt;!&ndash;    show-trigger="bar" &ndash;&gt; -->
<!--  &lt;!&ndash;    collapse-mode="width" &ndash;&gt; -->
<!--  &lt;!&ndash;    :collapsed-width="0" &ndash;&gt; -->
<!--  &lt;!&ndash;    :width="240" &ndash;&gt; -->
<!--  &lt;!&ndash;    :collapsed="collapsed" &ndash;&gt; -->
<!--  &lt;!&ndash;    @collapse="collapsed = true" &ndash;&gt; -->
<!--  &lt;!&ndash;    @expand="collapsed = false" &ndash;&gt; -->
<!--  &lt;!&ndash;  > &ndash;&gt; -->
<!--  <n-flex justify="center"> -->
<!--    <n-h3>服务器成员列表</n-h3> -->
<!--  </n-flex> -->
<!--  <n-flex justify="center"> -->
<!--    <n-popover v-for="(option, index) in menuOptions" :key="index" placement="left-start" trigger="click"> -->
<!--      <template #trigger> -->
<!--        <n-button -->
<!--          style="width: 80%; height: 36px; border: #e8e8e8 1px solid;" -->
<!--          bordered -->
<!--          justify-start -->
<!--        > -->
<!--          <n-button text style="font-size: 24px; margin-bottom: 3px"> -->
<!--            <n-icon> -->
<!--              <n-avatar -->
<!--                round -->
<!--                size="small" -->
<!--                src="https://thirdqq.qlogo.cn/g?b=qq&nk=1392634254&s=100" -->
<!--              /> -->
<!--            </n-icon> -->
<!--          </n-button> -->
<!--          <n-flex justify="start" style="height: 34px;"> -->
<!--            <n-text -->
<!--              style="margin-left: 20px; line-height: 34px;" -->
<!--            > -->
<!--              {{ option.username }} -->
<!--            </n-text> -->
<!--          </n-flex> -->
<!--        </n-button> -->
<!--      </template> -->
<!--      <div style="width: 200px; height: 300px"> -->
<!--        <n-avatar -->
<!--          round -->
<!--          size="large" -->
<!--          src="https://thirdqq.qlogo.cn/g?b=qq&nk=1392634254&s=100" -->
<!--        /> -->
<!--        <n-flex style="border: #e8e8e8 1px solid; width: 100%; height: 80%;" justify="start"> -->
<!--          <n-text> -->
<!--            name: {{ option.username }} -->
<!--          </n-text> -->
<!--          <n-text> -->
<!--            id: {{ option.userId }} -->
<!--          </n-text> -->
<!--        </n-flex> -->
<!--      </div> -->
<!--    </n-popover> -->
<!--  </n-flex> -->
<!-- &lt;!&ndash;  </n-layout-sider> &ndash;&gt; -->
<!-- </template> -->

<style scoped lang="less">
</style>
