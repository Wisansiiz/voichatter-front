<script setup lang="ts">
import { Menu } from '@vicons/ionicons5'
import { useRouter } from 'vue-router'
import type { FormInst } from 'naive-ui'
import { createDiscreteApi } from 'naive-ui'
import { h } from 'vue'
import { service } from '~/utils/request'

const props = defineProps({
  serverName: {
    type: String,
    default: '',
  },
})
const router = useRouter()
const route: any = useRoute()
function go(i: any) {
  router.push(`/${route.params.server_id}/${encodeURIComponent(i)}`)
}
// 随机数
function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
const showModal = ref(false)
const formRef = ref<FormInst | null>(null)
const model = ref({
  channel_name: null,
  type: null,
})
const generalOptions = [
  ['文字', 'text'],
  ['语音', 'voice'],
].map(
  v => ({
    label: v[0],
    value: v[1],
  }),
)
const rules = {
  channel_name: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入 名字',
  },
  type: {
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择 类型',
  },
}
const { message, dialog } = createDiscreteApi(
  ['message', 'dialog'],
)

const options = [
  {
    label: '邀请其他人',
    key: 'invite',
  },
  {
    label: '服务器设置',
    key: 'serverSetting',
  },
  {
    label: () =>
      h(
        'a',
        {
          onClick: () => {
            showModal.value = true
          },
        },
        { default: () => '创建新频道' },
      ),
    key: 'createNewChannel',
  },
  {
    label: '修改服务器名称',
    key: 'modifyServerName',
  },
  {
    label: () =>
      h(
        'a',
        {
          style: {
            color: 'red',
          },
          onClick: () => {
            dialog.warning({
              title: '警告',
              content: '确定删除该服务器吗',
              positiveText: '确定',
              negativeText: '不确定',
              onPositiveClick: () => {
                deleteServer()
              },
              onNegativeClick: () => {
                message.error('不确定')
              },
            })
          },
        },
        { default: () => '删除服务器' },
      ),
    key: 'delete',
  },
]
interface Response {
  code: number
  data: any
  messages: string
}
async function deleteServer() {
  const res: Response = await service.delete(
    `/delete-server/${route.params.server_id}`,
  )
  gMessage.success(res.messages)
}
async function createChannel() {
  // console.log(model.value, route.params.server_id)
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const res: Response = await service.post(
        `/create-channel/${route.params.server_id}`,
        model.value,
      )
      gMessage.success(res.messages)
      showModal.value = false
    }
    else {
      gMessage.error('验证失败')
    }
  })
}
</script>

<template>
  <n-layout has-sider style="max-width: 240px; border-right: 1px solid #e8e8e8">
    <n-flex justify="space-between" style="height: 30px; border: 1px solid #e8e8e8; margin: 10px">
      <div style="width: 149px; height: 20px; margin: 5px">
        {{ props.serverName }}
      </div>
      <n-dropdown
        placement="bottom"
        trigger="click"
        size="medium"
        :options="options"
      >
        <n-button style="height: 30px">
          <n-icon size="large">
            <Menu />
          </n-icon>
        </n-button>
      </n-dropdown>

      <n-button
        v-for="i in random(1, 10)"
        :key="i"
        :class="{ yy: i % 2 === 1 }"
        style="width: 100%"
        @click="go(i)"
      >
        {{ i }}
      </n-button>
    </n-flex>
  </n-layout>
  <n-modal
    v-model:show="showModal"
    class="custom-card"
    preset="card"
    :style="{ maxWidth: '600px' }"
    title="创建一个频道"
    size="huge"
    :bordered="false"
    :segmented="{
      content: 'soft',
      footer: 'soft',
    }"
  >
    <n-form
      ref="formRef"
      :model="model"
      :rules="rules"
    >
      <n-form-item label="为频道取个名字" path="channel_name">
        <n-input
          v-model:value="model.channel_name"
          placeholder="什么名字呢"
        />
      </n-form-item>
      <n-form-item :span="12" label="选择一个服务器类型" path="type">
        <n-select
          v-model:value="model.type"
          placeholder="什么类型呢"
          :options="generalOptions"
        />
      </n-form-item>
    </n-form>
    <n-button
      style="margin-top: 30px; width: 100%"
      @click="createChannel"
    >
      创建频道
    </n-button>
  </n-modal>
</template>

<style scoped>
</style>
