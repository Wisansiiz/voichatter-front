import { service } from '~/api'

export interface Request {
  code: number
  data: Data
  message: string
  [property: string]: any
}

export interface Data {
  activityPages: ActivityPage[]
  pageTotal: number
  [property: string]: any
}

export interface ActivityPage {
  activityDesc: string
  activityId: number
  activityTitle: string
  creatorUserId: number
  endDate: null
  serverId: number
  startDate: string
  [property: string]: any
}
export async function activityPagesApi(page: number, size: number, activityTitle: string) {
  const res: Request = await service.get(`/activities?page=${page}&pageSize=${size}&activityTitle=${activityTitle}`)
  return res.data
}
export interface ActivityPageCreate {
  activityDesc: string
  activityTitle: string
  endDate: any
  serverId: number
  startDate: any
  [property: string]: any
}
export interface createResponse {
  code: number
  data: createData
  message: string
  [property: string]: any
}

export interface createData {
  activities: createActivities
  [property: string]: any
}

export interface createActivities {
  activityDesc: string
  activityId: number
  activityTitle: string
  creatorUserId: number
  endDate: string
  serverId: number
  startDate: string
  [property: string]: any
}
export async function createActivityApi(data: ActivityPageCreate) {
  const res: createResponse = await service.post(`/activities`, data)
  return res.data
}
