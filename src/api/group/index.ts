import { service } from '~/api'

export interface Response {
  code: number
  data: Data
  message: string
  [property: string]: any
}

export interface Data {
  group: Group
  [property: string]: any
}

export interface Group {
  groupId: number
  groupName: string
  serverId: number
  [property: string]: any
}

export async function createGroupApi(serverId: any, groupName: string): Promise<Group> {
  const res: Response = await service.post(`/group/${serverId}`, { groupName })
  return res.data.group
}

export async function deleteGroupApi(serverId: any, groupId: any): Promise<void> {
  await service.delete(`/group/${serverId}/${groupId}`)
}

export async function groupModifyApi(model: any): Promise<Group> {
  const { serverId, groupId, groupName } = model
  const res: Response = await service.put(`/group/${serverId}/${groupId}`, { groupName })
  return res.data.group
}
