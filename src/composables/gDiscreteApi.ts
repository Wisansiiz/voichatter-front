import { createDiscreteApi } from 'naive-ui'

const { message, notification, dialog, loadingBar } = createDiscreteApi(
  ['message', 'dialog', 'notification', 'loadingBar'],
)
export const gMessage = {
  // info: (str: string) => {
  //   message.info(str)
  // },
  success: (str: string) => {
    message.success(str)
  },
  warning: (str: string) => {
    message.warning(str)
  },
  error: (str: string) => {
    message.error(str)
  },
}
export function gNotification(str: string) {
  notification.create({ title: str })
}
export function gDialog(str: string) {
  dialog.info({ title: str })
}
export function gLoadingBar(router: any) {
  router.beforeEach(() => {
    loadingBar.start()
  })

  router.afterEach(() => {
    loadingBar.finish()
  })

  router.onError(() => {
    loadingBar.error()
  })
}
export const gLoadingBarDone = {
  start: () => {
    loadingBar.start()
  },
  finish: () => {
    loadingBar.finish()
  },
  error: () => {
    loadingBar.error()
  },
}
