import { service } from '~/api'

export interface Response {
  code: number
  data: Data
  message: string
  [property: string]: any
}
export interface GetNotificationResponse {
  code: number
  data: Data
  message: string
  [property: string]: any
}

export interface Data {
  notification: null | Notification
  [property: string]: any
}

export interface Notification {
  content: string
  createUserId: number
  notificationId: number
  serverId: number
  title: string
  lastEditDate: string
  [property: string]: any
}
export async function createNotificationApi(serverId: string, data: any) {
  const res: Response = await service.post(`/notification/${serverId}`, data)
  return res.data.notification
}

export async function getNotificationApi(serverId: string) {
  const res: GetNotificationResponse = await service.get(`/notification/${serverId}`)
  return res.data.notification
}

export async function updateNotificationApi(serverId: string, data: any) {
  const res: Response = await service.put(`/notification/${serverId}`, data)
  return res.data.notification
}

export async function deleteNotificationApi(serverId: string, notificationId: any) {
  await service.delete(`/notification/${serverId}/${notificationId}`)
}
