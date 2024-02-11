<script setup lang="ts">
import { h } from 'vue'
import type { FormInst } from 'naive-ui'
import { NIcon } from 'naive-ui'
import { RouterLink } from 'vue-router'
import { Add, BookOutline as BookIcon } from '@vicons/ionicons5'
import { service } from '~/utils/request.js'

const menuOptions: any[] = reactive([])
const collapsed = ref(true)
const showModal = ref(false)
const showModal2 = ref(false)
const formRef = ref<FormInst | null>(null)
const model = ref({ server_name: null, server_theme: null })
const rules = {
  server_name: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入 名字',
  },
  server_theme: {
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择 主题',
  },
}
const generalOptions = ['朋友', '家人', '同学', '网络朋友'].map(
  v => ({
    label: v,
    value: v,
  }),
)

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
                path: '/server',
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
          'a',
          {
            onClick: () => {
              showModal.value = true
            },
          },
          { default: () => '添加服务器' },
        ),
      key: 'add-server',
      icon: renderIcon(Add),
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
        handleServerList()
        gMessage.success(res.msg)
      })
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
      :collapsed-icon-size="22"
      :options="menuOptions"
    />
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
    <n-button style="width: 100%">
      加入服务器
    </n-button>
    <br>
    <n-button style="margin-top: 30px; width: 100%" @click="handleShowModal2">
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
      <n-form-item :span="12" label="选择一个主题吧，它是关于什么的？" path="server_theme">
        <n-select
          v-model:value="model.server_theme"
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
</template>

<style scoped>
</style>
