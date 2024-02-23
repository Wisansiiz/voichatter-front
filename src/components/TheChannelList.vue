<script setup lang="ts">
import { Menu } from '@vicons/ionicons5'
import { createDiscreteApi } from 'naive-ui'
import { useRouter } from 'vue-router'

const props = defineProps<{
  serverName: string
}>()
const { message, dialog } = createDiscreteApi(
  ['message', 'dialog'],
)

const options = [
  {
    label: '邀请其他人',
    key: 'jay gatsby',
  },
  {
    label: '服务器设置',
    key: 'daisy buchanan',
  },
  {
    label: '创建新频道',
    key: 'red rose',
  },
  {
    label: '修改服务器名称',
    key: 'nick carraway',
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
                message.success('确定')
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
function handleSelect(key: string | number) {
  gMessage.info(String(key))
}

// const name = ref('124')
const router = useRouter()
const route: any = useRoute()
function go(i: any) {
  router.push(`/${route.params.server_id}/${encodeURIComponent(i)}`)
}

// watch(route, () => {
//   if (router.currentRoute.value.path !== '/login')
//     go(1)
//   // 模拟点击事件
// })
// onMounted(() => {
//   go(1) // 模拟点击事件
// })
// 随机数
function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
</script>

<template>
  <n-layout has-sider style="max-width: 240px; border-right: 1px solid #e8e8e8">
    <n-flex justify="space-between" style="height: 30px; border: 1px solid #e8e8e8; margin: 10px">
      <div style="width: 149px; height: 20px; margin: 5px">
        {{ props.serverName }}
      </div>
      <n-dropdown
        placement="bottom"
        trigger="click"
        size="medium"
        :options="options"
        @select="handleSelect"
      >
        <n-button style="height: 30px">
          <n-icon size="large">
            <Menu />
          </n-icon>
        </n-button>
      </n-dropdown>

      <div v-for="i in random(1, 10)" :key="i" :class="{ yy: i % 2 === 1 }">
        <n-input
          :value="String(i)"
          placeholder="channel name"
          autocomplete="false"
          @keydown.enter="go(i)"
        />
        <n-button
          :key="i"
          @click="go(i)"
        >
          Go
        </n-button>
      </div>
    </n-flex>
  </n-layout>
</template>

<style scoped>
.yy {
  background-color: red;
}
</style>
