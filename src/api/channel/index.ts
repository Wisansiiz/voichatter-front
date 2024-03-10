import { service } from '~/api'
import type { response } from '~/composables/result'

export async function createChannel(formRef: any, model: any, serverId: any) {
  formRef.value?.validate(async (errors: any) => {
    if (!errors) {
      await service.post(`/channel/${serverId}`, model.value)
      gMessage.success('创建成功')
    }
    else {
      gMessage.error('验证失败')
    }
  })
}

export async function channelList(serverId: any) {
  const res: response = await service.get(`/groups/${serverId}`)
  return res.data
}
