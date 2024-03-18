<script lang="ts">
import { websiteConfig } from '~/config/website.config'

export default defineComponent({
  name: 'Logo',
  props: {
    collapsed: {
      type: Boolean,
    },
  },
  setup() {
    return {
      websiteConfig,
    }
  },
})
</script>

<template>
  <div class="logo">
    <img :src="websiteConfig.logo" alt="" :class="{ 'mr-2': !collapsed }">
    <h2 v-show="!collapsed" class="title">
      <RouterLink to="/">
        {{ websiteConfig.title }}
      </RouterLink>
    </h2>
  </div>
</template>

<style lang="less" scoped>
  .logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  line-height: 64px;
  overflow: hidden;
  white-space: nowrap;

  img {
    width: auto;
    height: 32px;
  }

  .title {
    margin: 0;
  }
}
h2 a {
  text-decoration: none;
  outline: none;
  color: inherit;
}
</style>
