import { service } from '~/api'
import type { response } from '~/composables/result'

export async function modifyServerNameByOwner(model: any) {
  const res = await service.put(`/server/${model.value.serverId}`, { serverName: model.value.serverName })
  return res.data
}
export async function deleteServerByOwner(serverId: any) {
  await service.delete(`/servers/${serverId}`)
  window.$message.success('删除成功')
}
export async function getServerList() {
  const res: response = await service.get('/servers')
  return res.data
}

export async function createServer(model: any) {
  const res: response = await service.post('/servers', { serverName: model.serverName, serverType: model.serverType })
  return res.data.server
}
export async function joinServer(model: any) {
  const { serverId, link } = model
  const res = await service.post(`/servers/${serverId}`, { link })
  return res.data.server
}

export async function serverPagesApi(page: number, pageSize: number, serverName: string) {
  const res = await service.get(`/servers/page?serverName=${serverName}&page=${page}&pageSize=${pageSize}`)
  return res.data
}
export interface Data {
  serverInfo: ServerInfo
  [property: string]: any
}

export interface ServerInfo {
  createDate: string
  creatorUserId: number
  serverDescription: string
  serverId: number
  serverImgUrl: string
  serverName: string
  serverType: string
  [property: string]: any
}

export async function serverInfoApi(serverId: any): Promise<ServerInfo> {
  const res: Data = await service.get(`/server/${serverId}`)
  return res.data.serverInfo
}

export async function serverInfoUpdApi(model: { serverId: number, serverName: string, serverType: string, serverDescription: string }) {
  const res: Data = await service.put(`/server-info/${model.serverId}`, model)
  return res.data.serverInfo
}

export async function serverCountApi() {
  const res = await service.get(`/servers/count`)
  return res.data
}

export async function serverImgApi(serverId: string, file: any) {
  const formData = new FormData()
  formData.append('file', file)
  const res = await service.put(`/server/img/${serverId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return res.data.serverInfo
}

export async function serverInviteLinkApi(serverId: string) {
  const res = await service.post(`/servers/link/${serverId}`)
  return res.data
}
