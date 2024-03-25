<script lang="ts">
import { useServerListStore } from '~/store/modules/serverList'

export default defineComponent({
  setup() {
    const route: any = useRoute()
    const serverListStore = useServerListStore()
    const channelType = serverListStore.getChannelType
    return {
      channelType,
      route,
    }
  },
})
</script>

<template>
  <n-h1>这里是channel</n-h1>

  <n-flex>
    <n-h1>{{ route.params.name }}</n-h1>
  </n-flex>

  <Ws v-if="channelType === 'text'" />
  <Multiple v-else-if="channelType === 'voice'" />
  <n-h2 v-else>
    什么也没有
  </n-h2>
</template>

<style scoped>

</style>
