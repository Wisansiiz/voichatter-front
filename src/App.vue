<script lang="ts" setup>
import { computed } from 'vue'
import { NThemeEditor, darkTheme, dateZhCN, zhCN } from 'naive-ui'
import { useDesignSettingStore } from '~/store/modules/designSetting'

const designStore = useDesignSettingStore()
const getThemeOverrides: any = computed(() => {
  const appTheme = designStore.appTheme
  return {
    common: {
      primaryColor: appTheme,
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
</template>

<style lang="less">

</style>
