<script lang="ts">
export default defineComponent({
  setup() {
    const route = useRoute('/[server_id]/[name]')
    return {
      serverId: computed(() => route.params.server_id),
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
