<script setup lang="ts">
import { Menu } from '@vicons/ionicons5'
import { useRouter } from 'vue-router'

const props = defineProps({
  serverName: {
    type: String,
    default: '',
  },
  options: {
    type: Array,
    default: () => [],
  },
})
const router = useRouter()
const route: any = useRoute()
function go(i: any) {
  router.push(`/${route.params.server_id}/${encodeURIComponent(i)}`)
}
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
