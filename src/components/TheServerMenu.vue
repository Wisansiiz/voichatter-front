<script setup lang="ts">
import { h } from 'vue'
import type { FormInst } from 'naive-ui'
import { NIcon } from 'naive-ui'
import { RouterLink } from 'vue-router'
import { Add, BookOutline as BookIcon } from '@vicons/ionicons5'
import { service } from '~/api'
import type { response } from '~/composables/result'
import { useProjectSetting } from '~/hooks/setting/useProjectSetting'

const emit = defineEmits(['serverName'])
const menuOptions: any[] = reactive([])
const collapsed = ref<boolean>(true)
const showModal = ref<boolean>(false)
const showModal2 = ref<boolean>(false)
const showJoinServer = ref<boolean>(false)
const formRef = ref<FormInst | null>(null)
const model = ref({ serverName: null, serverType: null })
const rules = {
  serverName: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入 名字',
  },
  serverType: {
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
function handleShowModal2() {
  showModal2.value = true
}

function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

async function handleServerList() {
  const res: response = await service.get('/servers')
  const data = res.data.serverList
  for (let i = 0; i < data.length; i++) {
    menuOptions.push({
      label: () =>
        h(
          RouterLink,
          {
            to: {
              path: `/${encodeURIComponent(data[i].serverId)}`,
            },
            onClick: () => {
              sendServerName(data[i].serverName)
            },
          },
          { default: () => data[i].serverName },
        ),
      key: data[i].serverId,
      icon: renderIcon(BookIcon),
    })
  }
}

onMounted(() => {
  handleServerList()
})

function handleCreateServer() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const res: response = await service.post('/servers', model.value)
      menuOptions.length = 0
      await handleServerList()
      gMessage.success(res.message)
      showModal2.value = false
      showModal.value = false
    }
    else {
      gMessage.error('验证失败')
    }
  })
}
// 创建一个响应式引用
const serverName = ref('')
function sendServerName(name: string) {
  serverName.value = name
  emit('serverName', serverName.value)
}
const joinModel = ref({ serverId: null })
const joinRules = {
  serverId: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入 id',
  },
}
async function handleJoinServer() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      await service.post(`/servers/${Number(joinModel.value.serverId)}`)
      menuOptions.length = 0
      await handleServerList()
      gMessage.success('添加成功')
      showJoinServer.value = false
      showModal.value = false
    }
    else {
      gMessage.error('验证失败')
    }
  })
}
const {
  headerSetting,
} = useProjectSetting()
const fixedMenu = computed(() => {
  const { fixed } = unref(headerSetting)
  return fixed ? 'absolute' : 'static'
})
</script>

<template>
  <n-layout class="layout" :position="fixedMenu" has-sider>
    <n-layout-sider
      bordered
      :position="fixedMenu"
      collapse-mode="width"
      :collapsed-width="64"
      :collapsed="collapsed"
      show-trigger="bar"
      class="layout-sider"
      :native-scrollbar="false"
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
      <n-menu
        :collapsed="collapsed"
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
  </n-layout>
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
      <n-form-item label="为服务器取个名字" path="serverName">
        <n-input
          v-model:value="model.serverName"
          placeholder="什么名字呢"
        />
      </n-form-item>
      <n-form-item :span="12" label="选择一个服务器类型" path="serverType">
        <n-select
          v-model:value="model.serverType"
          placeholder="什么类型呢"
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
      <n-form-item label="添加的服务器id" path="serverId">
        <n-input
          v-model:value="joinModel.serverId"
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

<style lang="less">
.layout-side-drawer {
  background-color: rgb(0, 20, 40);

  .layout-sider {
    min-height: 100vh;
    box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
    position: relative;
    z-index: 13;
    transition: all 0.2s ease-in-out;
  }
}
</style>

<style lang="less" scoped>
.layout {
  display: flex;
  flex-direction: row;
  flex: auto;

  &-default-background {
    background: #f5f7f9;
  }

  .layout-sider {
    min-height: 100vh;
    box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
    position: relative;
    z-index: 13;
    transition: all 0.2s ease-in-out;
  }

  .layout-sider-fix {
    position: fixed;
    top: 0;
    left: 0;
  }

  .ant-layout {
    overflow: hidden;
  }

  .layout-right-fix {
    overflow-x: hidden;
    padding-left: 200px;
    min-height: 100vh;
    transition: all 0.2s ease-in-out;
  }

  .layout-content {
    flex: auto;
    min-height: 100vh;
  }

  .n-layout-header.n-layout-header--absolute-positioned {
    z-index: 11;
  }

  .n-layout-footer {
    background: none;
  }
}

.layout-content-main {
  margin: 0 10px 10px;
  position: relative;
  padding-top: 64px;
}

.layout-content-main-fix {
  padding-top: 64px;
}

.fluid-header {
  padding-top: 0;
}

.main-view-fix {
  padding-top: 44px;
}

.noMultiTabs {
  padding-top: 0;
}
</style>
