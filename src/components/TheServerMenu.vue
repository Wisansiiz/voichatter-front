<script setup lang="ts">
import { h } from 'vue'
import { NIcon } from 'naive-ui'
import { RouterLink } from 'vue-router'
import {
  Add,
  BookOutline as BookIcon,
} from '@vicons/ionicons5'
import { service } from '~/utils/request.js'

const menuOptions: any[] = reactive([])
function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
interface result {
  server_name: string
  server_id: number
}
const collapsed = ref(true)
const showModal = ref(false)
onMounted(() => {
  service.get('/servers-list').then((res) => {
    const data: [result] = res.data
    for (let i = 0; i < data.length; i++) {
      menuOptions.push({
        label: () =>
          h(
            RouterLink,
            {
              to: {
                path: '/server',
              },
            },
            { default: () => data[i].server_name },
          ),
        key: data[i].server_id,
        icon: renderIcon(BookIcon),
      })
    }
    menuOptions.push({
      label: () =>
        h(
          'a',
          {
            onClick: () => {
              showModal.value = true
            },
          },
          { default: () => '添加服务器' },
        ),
      key: 'add-server',
      icon: renderIcon(Add),
    })
  })
})
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
  <n-modal v-model:show="showModal" preset="dialog" title="Dialog">
    <template #header>
      <div>标题</div>
    </template>
    <div>添加服务器</div>
    <template #action>
      <div>操作</div>
    </template>
  </n-modal>
</template>
