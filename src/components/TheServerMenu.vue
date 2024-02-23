<script setup lang="ts">
import type { Ref } from 'vue'
import { h } from 'vue'
import type { FormInst } from 'naive-ui'
import { NIcon } from 'naive-ui'
import { RouterLink } from 'vue-router'
import { Add, BookOutline as BookIcon } from '@vicons/ionicons5'
import { service } from '~/utils/request.js'

const emit = defineEmits(['serverName'])
const menuOptions: any[] = reactive([])
const collapsed = ref(true)
const showModal = ref(false)
const showModal2 = ref(false)
const showJoinServer = ref(false)
const formRef = ref<FormInst | null>(null)
const model = ref({ server_name: null, server_type: null })
const rules = {
  server_name: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入 名字',
  },
  server_type: {
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择 类型',
  },
}
const generalOptions = ['public', 'private'].map(
  v => ({
    label: v,
    value: v,
  }),
)
function createImageVNode(url: string) {
  return h('img', {
    src: url,
    alt: '描述',
    style: {
      width: '35px', // 设置图片宽度
    },
  })
}
function handleShowModal2() {
  showModal2.value = true
}

function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

interface result {
  server_name: string
  server_id: number
}

function handleServerList() {
  service.get('/servers-list').then((res) => {
    const data: [result] = res.data
    for (let i = 0; i < data.length; i++) {
      menuOptions.push({
        label: () =>
          h(
            RouterLink,
            {
              to: {
                path: `/${encodeURIComponent(data[i].server_id)}`,
              },
              onClick: () => {
                sendServerName(data[i].server_name)
              },
            },
            { default: () => data[i].server_name },
          ),
        key: data[i].server_id,
        icon: renderIcon(BookIcon),
      })
    }
    menuOptions.push({
      label: () =>
        h(
          RouterLink,
          {
            to: {
              path: '/125',
            },
          },
          { default: () => '测试' },
        ),
      key: 'test',
      icon: renderIcon(createImageVNode('https://thirdqq.qlogo.cn/g?b=qq&nk=1392634254&s=100')),
    })
  })
}

onMounted(() => {
  handleServerList()
})

function handleCreateServer() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      service.post('/create-server', model.value).then((res: any) => {
        menuOptions.length = 0
        handleServerList()
        gMessage.success(res.messages)
        showModal2.value = false
        showModal.value = false
      })
    }
    else {
      gMessage.error('验证失败')
    }
  })
}
// 创建一个响应式引用
const serverName = ref('')
function sendServerName(data: string) {
  serverName.value = data
  emit('serverName', serverName.value)
}
const joinModel = ref({ server_id: null })
const joinRules = {
  server_id: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入 id',
  },
}
async function handleJoinServer() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const res: any = await service.post('/join-server', { server_id: Number(joinModel.value.server_id) })
      menuOptions.length = 0
      handleServerList()
      gMessage.success(res.messages)
      showJoinServer.value = false
      showModal.value = false
    }
    else {
      gMessage.error('验证失败')
    }
  })
}
</script>

<template>
  <n-layout-sider
    bordered
    collapse-mode="width"
    :collapsed-width="64"
    :collapsed="true"
    @collapse="collapsed = true"
    @expand="collapsed = false"
  >
    <n-menu
      :collapsed="true"
      :collapsed-width="64"
      :collapsed-icon-size="35"
      :options="menuOptions"
    />
    <n-button
      quaternary
      style="width: 48px; height: 42px; left: 8px"
      @click="showModal = true"
    >
      <template #icon>
        <NIcon size="35">
          <Add />
        </NIcon>
      </template>
    </n-button>
  </n-layout-sider>
  <n-modal
    v-model:show="showModal"
    class="custom-card"
    preset="card"
    :style="{ width: '400px' }"
    title="另一个服务器？"
    size="huge"
    :bordered="false"
    :segmented="{
      content: 'soft',
      footer: 'soft',
    }"
  >
    <n-button
      style="width: 100%"
      @click="showJoinServer = true"
    >
      加入服务器
    </n-button>
    <br>
    <n-button
      style="margin-top: 30px; width: 100%"
      @click="handleShowModal2"
    >
      创建服务器
    </n-button>
  </n-modal>
  <n-modal
    v-model:show="showModal2"
    class="custom-card"
    preset="card"
    :style="{ maxWidth: '600px' }"
    title="创建怎样的服务器？"
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
      <n-form-item label="为服务器取个名字" path="server_name">
        <n-input
          v-model:value="model.server_name"
          placeholder="什么名字呢"
        />
      </n-form-item>
      <n-form-item :span="12" label="选择一个服务器类型" path="server_theme">
        <n-select
          v-model:value="model.server_type"
          placeholder="什么主题呢"
          :options="generalOptions"
        />
      </n-form-item>
    </n-form>
    <n-button
      style="margin-top: 30px; width: 100%"
      @click="handleCreateServer"
    >
      创建服务器
    </n-button>
  </n-modal>
  <n-modal
    v-model:show="showJoinServer"
    class="custom-card"
    preset="card"
    :style="{ maxWidth: '600px' }"
    title="创建怎样的服务器？"
    size="huge"
    :bordered="false"
    :segmented="{
      content: 'soft',
      footer: 'soft',
    }"
  >
    <n-form
      ref="formRef"
      :model="joinModel"
      :rules="joinRules"
    >
      <n-form-item label="添加的服务器id" path="server_id">
        <n-input
          v-model:value="joinModel.server_id"
          placeholder="请输入服务器id"
        />
      </n-form-item>
    </n-form>
    <n-button
      style="margin-top: 30px; width: 100%"
      @click="handleJoinServer"
    >
      加入服务器
    </n-button>
  </n-modal>
</template>

<style scoped>
</style>
