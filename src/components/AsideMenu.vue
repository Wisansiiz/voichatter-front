<script lang="ts">
import type { FormInst } from 'naive-ui'
import { useProjectSettingStore } from '~/store/modules/projectSetting'
import { useServerListStore } from '~/store/modules/serverList'
import { useServerInfo } from '~/hooks/useServerInfo'

export default defineComponent({
  props: {
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
  },
  setup(props) {
    const serverListStore = useServerListStore()
    const showModal2 = ref(false)
    const showJoinServer = ref(false)
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

    function handleCreateServer() {
      formRef.value?.validate((errors) => {
        if (!errors) {
          serverListStore.toCreateServer(model.value).then(() => {
            window.$message.success('创建成功')
            showModal2.value = false
            serverListStore.showModal = false
            serverListStore.setServerInfo()
          })
        }
        else {
          window.$message.error('验证失败')
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
    function handleJoinServer() {
      formRef.value?.validate((errors) => {
        if (!errors) {
          serverListStore.toJoinServer(Number(joinModel.value.serverId)).then(() => {
            window.$message.success('添加成功')
            showJoinServer.value = false
            serverListStore.showModal = false
            serverListStore.setServerInfo()
          })
        }
        else {
          window.$message.error('验证失败')
        }
      })
    }

    const settingStore = useProjectSettingStore()

    const inverted = computed(() => {
      return ['dark', 'header-dark'].includes(settingStore.navTheme)
    })
    const route: any = useRoute()
    const serverId = computed(() => {
      return route.params.server_id
    })
    const { menu } = useServerInfo()
    onMounted(() => {
      serverListStore.setServerInfo()
    })

    return {
      serverListStore,
      showModal2,
      showJoinServer,
      formRef,
      model,
      rules,
      generalOptions,
      handleCreateServer,
      joinModel,
      joinRules,
      handleJoinServer,
      inverted,
      route,
      serverId,
      menu,
      mode: computed(() => props.mode),
      collapsed: computed(() => props.collapsed),
      location: computed(() => props.location),
    }
  },
})
</script>

<template>
  <n-menu
    :collapsed="collapsed"
    :mode="mode"
    :collapsed-width="64"
    :options="menu"
    :collapsed-icon-size="35"
    :indent="24"
    :inverted="inverted"
    :value="Number(serverId)"
    :icon-size="30"
  />
  <n-modal
    v-model:show="serverListStore.showModal"
    :on-mask-click="() => serverListStore.showModal = false"
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
      @click="showModal2 = true"
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
