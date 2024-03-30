<script lang="ts">
import { useServerListStore } from '~/store/modules/serverList'

export default defineComponent({
  setup() {
    const route: any = useRoute()
    const serverListStore = useServerListStore()
    return {
      channelType: computed(() => serverListStore.channelType),
      route,
    }
  },
})
</script>

<template>
  <n-h2>欢迎来到{{ route.params.name }}</n-h2>
  <!--  <keep-alive> -->
  <Ws v-if="channelType === 'text'" />
  <Multiple v-else-if="channelType === 'voice'" />
  <n-h2 v-else>
    什么也没有
  </n-h2>
<!--  </keep-alive> -->
</template>

<style scoped>

</style>
