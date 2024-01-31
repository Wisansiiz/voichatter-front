import { createDiscreteApi } from 'naive-ui'

const { message, notification, dialog, loadingBar } = createDiscreteApi(
  ['message', 'dialog', 'notification', 'loadingBar'],
)
export function gMessage(str: string) {
  message.info(str)
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
