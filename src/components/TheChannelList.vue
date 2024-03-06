<script setup lang="ts">
import { Menu } from '@vicons/ionicons5'

// import { useRouter } from 'vue-router'
import type { FormInst } from 'naive-ui'
import { createDiscreteApi } from 'naive-ui'
import { h } from 'vue'
import { service } from '~/utils/request'
import type { response } from '~/composables/result'

// import {RouterLink} from "vue-router";

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
// function random(min: number, max: number) {
//   return Math.floor(Math.random() * (max - min + 1) + min)
// }
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

async function deleteServer() {
  await service.delete(`/servers/${route.params.server_id}`)
  gMessage.success('删除成功')
}
async function createChannel() {
  // console.log(model.value, route.params.server_id)
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const res: response = await service.post(
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
const menuOptions = [
  {
    label: '通知',
    key: 1,
    children: [
      {
        label: '文字',
        type: 'text',
        key: 3,
        children: [
          {
            label: '文字',
            type: 'text',
            key: 5,
          },
          {
            label: '语音',
            type: 'voice',
            key: 6,
          },
        ],
      },
      {
        label: '语音',
        type: 'voice',
        key: 4,
      },
    ],
  },
  {
    label: '交流',
    key: 2,
  },
]
</script>

<template>
  <n-flex justify="space-between" style="padding: 18px">
    <!--    <div style="line-height: 30px"> -->
    {{ props.serverName }}
    <!--    </div> -->
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
    <n-layout has-sider>
      <n-layout-sider
        :collapsed="false"
        collapse-mode="width"
        :collapsed-width="64"
        :native-scrollbar="false"
        class="layout-sider"
      >
        <n-menu
          :collapsed="false"
          :collapsed-width="64"
          :collapsed-icon-size="35"
          :options="menuOptions"
          :indent="24"
          @update:value="go"
        />
      </n-layout-sider>
    </n-layout>
    <!--    <n-button -->
    <!--      v-for="i in random(1, 10)" -->
    <!--      :key="i" -->
    <!--      :class="{ yy: i % 2 === 1 }" -->
    <!--      style="width: 100%" -->
    <!--      @click="go(i)" -->
    <!--    > -->
    <!--      {{ i }} -->
    <!--    </n-button> -->
  </n-flex>
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
