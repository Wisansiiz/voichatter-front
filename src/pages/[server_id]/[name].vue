<script lang="ts">
import { useServerListStore } from '~/store/modules/serverList'

export default defineComponent({
  setup() {
    const router = useRouter()
    const route: any = useRoute()
    const serverListStore = useServerListStore()
    const channelType = serverListStore.getChannelType
    return {
      channelType,
      route,
      router,
    }
  },
})
</script>

<template>
  <n-h1>这里是channel</n-h1>

  <n-flex>
    <n-h1>{{ route.params.name }}</n-h1>
    <n-layout-footer
      bordered
      position="absolute"
      style="height: 64px;padding: 5px"
    >
      <n-flex justify="center">
        <div style="height: 54px; line-height: 54px">
          <n-button type="primary" ghost>
            发送{{ route.params.name }}
          </n-button>
        </div>
      </n-flex>
    </n-layout-footer>
  </n-flex>

  <Ws v-if="channelType === 'text'" />
  <Multiple v-if="channelType === 'voice'" />
</template>

<style scoped>

</style>
