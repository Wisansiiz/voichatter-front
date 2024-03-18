import * as NaiveUI from 'naive-ui'
import { computed } from 'vue'
import { useDesignSetting } from '~/store/modules/designSetting'
import { lighten } from '~/composables/utils'

/**
 * 挂载 Naive-ui 脱离上下文的 API
 */

export function setupNaiveDiscreteApi() {
  const designStore = useDesignSetting()

  const configProviderPropsRef = computed(() => ({
    theme: designStore.darkTheme ? NaiveUI.darkTheme : undefined,
    themeOverrides: {
      common: {
        primaryColor: designStore.appTheme,
        primaryColorHover: lighten(designStore.appTheme, 6),
        primaryColorPressed: lighten(designStore.appTheme, 6),
      },
      LoadingBar: {
        colorLoading: designStore.appTheme,
      },
    },
  }))
  const { message, dialog, notification, loadingBar } = NaiveUI.createDiscreteApi(
    ['message', 'dialog', 'notification', 'loadingBar'],
    {
      configProviderProps: configProviderPropsRef,
    },
  )

  window.$message = message
  window.$dialog = dialog
  window.$notification = notification
  window.$loadingBar = loadingBar
}
