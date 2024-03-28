<script lang="ts">
export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const serverId = computed(() => route.query.serverId as string)
    if (!serverId.value)
      router.back()
    return {
      serverId,
    }
  },
})
</script>

<template>
  <h1>这里是{{ serverId }}</h1>
  <div>
    <h1>About</h1>
  </div>
</template>

<style scoped>

</style>

<route lang="yaml">
meta:
  layout: home
</route>
