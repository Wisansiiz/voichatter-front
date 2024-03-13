<script lang="ts">
// interface message {
//   message: string
//   isSent: boolean
//   send_date: string
//   avatar: string
//   username: string
//   content: any
// }
import Ws from '~/pages/[server_id]/[name]/ws.vue'
import Multiple from '~/pages/[server_id]/[name]/multiple.vue'
import { useServerInfo } from '~/hooks/useServerInfo'

export default defineComponent({
  components: { Ws, Multiple },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const params = ref()
    params.value = route.params
    const { channelType } = useServerInfo()
    watch(route, () => {
      params.value = route.params
    })
    return {
      channelType,
      params,
      router,
      Ws,
    }
  },
})
</script>

<template>
  <n-h1>这里是channel</n-h1>

  <n-flex>
    <n-h1>{{ params.name }}</n-h1>
    <n-layout-footer
      bordered
      position="absolute"
      style="height: 64px;padding: 5px"
    >
      <n-flex justify="center">
        <div style="height: 54px; line-height: 54px">
          <n-button type="primary" ghost>
            发送{{ params.name }}
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
