<script lang="ts" setup>
import { computed } from 'vue'
import { NThemeEditor, darkTheme, dateZhCN, zhCN } from 'naive-ui'

// import { useRoute } from 'vue-router'

import { useDesignSettingStore } from '~/store/modules/designSetting'

// import { lighten } from '~/utils/index'

// const route = useRoute()

const designStore = useDesignSettingStore()

const getThemeOverrides: any = computed(() => {
  const appTheme = designStore.appTheme
  // const lightenStr = lighten(designStore.appTheme, 6)
  return {
    common: {
      primaryColor: appTheme,
      // primaryColorHover: lightenStr,
      // primaryColorPressed: lightenStr,
      primaryColorSuppl: appTheme,
    },
    LoadingBar: {
      colorLoading: appTheme,
    },
  }
})

const getDarkTheme = computed(() => (designStore.darkTheme ? darkTheme : undefined))
</script>

<template>
  <NConfigProvider
    :locale="zhCN"
    :theme="getDarkTheme"
    :theme-overrides="getThemeOverrides"
    :date-locale="dateZhCN"
  >
    <NThemeEditor>
      <AppProvider>
        <RouterView />
      </AppProvider>
    </NThemeEditor>
  </NConfigProvider>

<!--  <transition v-if="isLock && $route.name !== 'login'" name="slide-up"> -->
<!--    <LockScreen /> -->
<!--  </transition> -->
</template>

<style lang="less">

</style>
