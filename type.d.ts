import type { DialogApiInjection } from 'naive-ui/es/dialog/src/DialogProvider'
import type { LoadingBarInst } from 'naive-ui/es/loading-bar/src/LoadingBarProvider'
import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider'
import type { NotificationApiInjection } from 'naive-ui/es/notification/src/NotificationProvider'

export {}
declare global {
  interface Window {
    $dialog: DialogApiInjection
    $loadingBar: LoadingBarInst
    $message: MessageApiInjection
    $notification: NotificationApiInjection
  }
}
