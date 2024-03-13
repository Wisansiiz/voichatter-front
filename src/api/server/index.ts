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
  const res: response = await service.post('/servers', model.value)
  return res.data.server
}
export async function joinServer(serverId: any) {
  const res = await service.post(`/servers/${serverId}`)
  return res.data.server
}
