<script setup lang="ts">
import { h } from 'vue'
import type { FormInst } from 'naive-ui'
import { Add } from '@vicons/ionicons5'
import { RouterLink } from 'vue-router'
import { service } from '~/utils/request'
import type { response } from '~/composables/result'
import { useProjectSettingStore } from '~/store/modules/projectSetting'
import { createImageVNode, renderIcon } from '~/utils'
import { useUserStore } from '~/store/modules/user'

const props = defineProps({
  mode: {
    // 菜单模式
    type: String,
    default: 'vertical',
  },
  collapsed: {
    // 侧边栏菜单是否收起
    type: Boolean,
    default: false,
  },
  // 位置
  location: {
    type: String,
    default: 'left',
  },
})
const emit = defineEmits(['serverName', 'clickMenuItem'])

const menuOptions: any[] = reactive([])
const showModal = ref(false)
const showModal2 = ref(false)
const showJoinServer = ref(false)
const formRef = ref<FormInst | null>(null)
const model = ref({ serverName: null, serverType: null })
const userStore = useUserStore()
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

const serverName = ref('')
function sendServerName(name: string) {
  serverName.value = name
  emit('serverName', serverName.value)
}
async function handleServerList() {
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
    key: 'add',
    icon: renderIcon(Add),
  })
  const res: response = await service.get('/servers')
  const data = res.data.serverList
  const map = new Map<number, any[]>()
  for (let i = 0; i < data.length; i++) {
    map.set(data[i].serverId, [])
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
      icon: renderIcon(createImageVNode(data[i].serverImgUrl, data[i].serverName)),
    })
  }
  userStore.setServerList(map)
}
interface serverRep {
  serverId: number
  serverName: string
  creatorUserId: number
  createDate: string
  serverType: string
  serverImgUrl: string
}
function handleCreateServer() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const res: response = await service.post('/servers', model.value)
      const server: serverRep = res.data.server
      menuOptions.push({
        label: () =>
          h(
            RouterLink,
            {
              to: {
                path: `/${encodeURIComponent(server.serverId)}`,
              },
              onClick: () => {
                sendServerName(server.serverName)
              },
            },
            { default: () => server.serverName },
          ),
        key: server.serverId,
        icon: renderIcon(createImageVNode(server.serverImgUrl, server.serverName)),
      })
      gMessage.success('创建成功')
      showModal2.value = false
      showModal.value = false
    }
    else {
      gMessage.error('验证失败')
    }
  })
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
function clickMenuItem(key: string) {
  if (/http(s)?:/.test(key))
    window.open(key)
  else
    gMessage.info(key)

  // router.push(`/${key}`)
  emit('clickMenuItem', key)
}
const settingStore = useProjectSettingStore()

const inverted = computed(() => {
  return ['dark', 'header-dark'].includes(settingStore.navTheme)
})
const route: any = useRoute()
onMounted(() => {
  handleServerList()
})
</script>

<template>
  <n-menu
    :collapsed="props.collapsed"
    :mode="props.mode"
    :collapsed-width="64"
    :collapsed-icon-size="35"
    :options="menuOptions"
    :indent="24"
    :inverted="inverted"
    :value="Number(route.params.server_id)"
    :icon-size="30"
    @update:value="clickMenuItem"
    @update:expanded-keys="sendServerName"
  />
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
