<script lang="ts">
import { computed, defineComponent, unref } from 'vue'

// import { useAsyncRouteStore } from '~/store/modules/asyncRoute'
import { useProjectSetting } from '~/hooks/setting/useProjectSetting'

export default defineComponent({
  name: 'MainView',
  components: {},
  props: {
    notNeedKey: {
      type: Boolean,
      default: false,
    },
    animate: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const { isPageAnimate, pageAnimateType } = useProjectSetting()
    // const asyncRouteStore = useAsyncRouteStore()
    // 需要缓存的路由组件
    // const keepAliveComponents = computed(() => asyncRouteStore.keepAliveComponents)

    const getTransitionName = computed(() => {
      return unref(isPageAnimate) ? unref(pageAnimateType) : ''
    })

    const mode = import.meta.env.MODE
    return {
      // keepAliveComponents,
      getTransitionName,
      mode,
    }
  },
})
</script>

<template>
  <RouterView />
</template>

<style lang="less" scoped></style>
