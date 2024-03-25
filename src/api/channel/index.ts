import { service } from '~/api'
import type { response } from '~/composables/result'

export async function createChannel(formRef: any, model: any, serverId: any) {
  let res: any
  return new Promise((resolve) => {
    formRef.value?.validate(async (errors: any) => {
      if (!errors) {
        res = await service.post(`/channel/${serverId}`, model.value)
        window.$message.success('创建成功')
      }
      else {
        window.$message.error('验证失败')
      }
      resolve(res)
    })
  })
}

export async function findChannelList(serverId: any) {
  const res: response = await service.get(`/groups/${serverId}`)
  return res.data
}

export async function deleteChannel(serverId: any, channelId: any) {
  await service.delete(`/channel/${serverId}/${channelId}`)
  window.$message.success('删除成功')
}
