import { defineStore } from 'pinia'
import { NButton } from 'naive-ui'
import { createNotificationApi, getNotificationApi } from '~/api/notification/notification'

interface INotification {
  title: string
  content: string
  meta: string
  markAsRead: boolean
}
interface NotificationList {
  [key: string]: INotification
}

export const useNotificationStore = defineStore(
  'notification-info',
  () => {
    const notificationInfo: Ref<NotificationList> = ref({})

    const createNotification = async (id: string, notification: INotification) => {
      const { title, content } = notification
      const res = await createNotificationApi(id, { title, content })
      if (res) {
        notificationInfo.value[res.serverId]
          = { title: res.title, content: res.content, meta: res.lastEditDate, markAsRead: false }
        return notificationInfo.value[res.serverId]
      }
      return null
    }

    const getNotification = async (serverId: string): Promise<Function> => {
      const res = await getNotificationApi(serverId)
      return new Promise((resolve) => {
        if (res) {
          notificationInfo.value[res.serverId]
            = { title: res.title, content: res.content, meta: res.lastEditDate, markAsRead: false }
          const create = () => {
            // const markAsRead = false
            const n = window.$notification.create({
              title: res.title,
              content: res.content,
              meta: res.lastEditDate,
              action: () =>
                h(
                  NButton,
                  {
                    text: true,
                    type: 'primary',
                    onClick: () => {
                      notificationInfo.value[res.serverId].markAsRead
                        = true
                      n.destroy()
                    },
                  },
                  {
                    default: () => '已读',
                  },
                ),
              onClose: () => {
                if (!notificationInfo.value[res.serverId].markAsRead) {
                  window.$message.warning('请设为已读')
                  return false
                }
              },
            })
          }
          resolve(create)
        }
      })
    }
    return {
      notificationInfo,
      createNotification,
      getNotification,
    }
  },
)
