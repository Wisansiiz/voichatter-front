<script lang="ts">
import type { CollapseProps, DropdownOption, FormInst } from 'naive-ui'
import { Menu } from '@vicons/ionicons5'
import { createChannel, deleteChannel } from '~/api/channel'
import { deleteServerByOwner, modifyServerNameByOwner } from '~/api/server'
import { useServerListStore } from '~/store/modules/serverList'
import { createGroupApi, deleteGroupApi } from '~/api/group'
import { useNotificationStore } from '~/store/modules/notificationSetting'

export default defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  components: { Menu },
  setup() {
    const route: any = useRoute()
    const router = useRouter()
    const message = useMessage()
    const showModal = ref(false)
    const modifyServerNameShowModal = ref(false)
    const formRef = ref<FormInst | null>(null)
    const showGroupModal = ref(false)
    const showCreateNotification = ref(false)
    const notificationModel = ref({
      title: '',
      content: '',
    })
    const notificationStore = useNotificationStore()
    const createNotification = async () => {
      showCreateNotification.value = false
      await notificationStore.createNotification(route.params.server_id, {
        title: notificationModel.value.title,
        content: notificationModel.value.content,
        meta: '',
        markAsRead: false,
      })
      window.$message.success('创建成功')
    }
    const { getNotification } = notificationStore
    const init = async (serverId: string) => {
      if (notificationStore.notificationInfo[serverId] && notificationStore.notificationInfo[serverId].markAsRead)
        return
      const res = await getNotification(serverId)
      res()
    }
    const serverListStore = useServerListStore()
    const channelList = ref([] as any[])
    const toSetChannelList = () => {
      serverListStore.toSetChannelList().then((res: any) => {
        channelList.value = res
      })
    }
    onMounted(async () => {
      toSetChannelList()
      await init(route.params.server_id)
    })
    watch(() => route.params.server_id, async () => {
      toSetChannelList()
      await init(route.params.server_id)
    })

    const model = ref({
      channel_name: null,
      type: null,
    })
    const groupModel = ref({
      groupName: '',
    })
    const modifyServerNameModel = ref({
      serverId: null,
      serverName: null,
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

    const options = [
      {
        label: '邀请其他人',
        key: 'invite',
      },
      {
        label: '服务器设置',
        key: 'serverSetting',
        props: {
          onClick: () => {
            router.push(`/server-setting?serverId=${route.params.server_id}`)
          },
        },
      },
      {
        label: () =>
          h(
            'a',
            {
              onClick: () => {
                showGroupModal.value = true
              },
            },
            { default: () => '创建新分组' },
          ),
        key: 'createNewGroup',
      },
      {
        label: () =>
          h(
            'a',
            {
              onClick: () => {
                showCreateNotification.value = true
              },
            },
            { default: () => '创建公告' },
          ),
        key: 'createNotification',
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
        label: () =>
          h(
            'a',
            {
              onClick: () => {
                modifyServerNameShowModal.value = true
              },
            },
            { default: () => '修改服务器名称' },
          ),
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
                window.$dialog.warning({
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

    function deleteServer() {
      deleteServerByOwner(route.params.server_id)
      serverListStore.setServerInfo()
    }

    async function channel() {
      await createChannel(formRef, model, route.params.server_id).then((_res) => {
        showModal.value = false
      })
      model.value.channel_name = null
      model.value.type = null
      toSetChannelList()
    }

    const channelInfo = ref({
      key: null,
    })
    const dataTableOption: DropdownOption[] = [
      {
        label: '编辑',
        key: 'edit',
      },
      {
        label: () =>
          h('a', {
            style: { color: 'red' },
            onClick: () => {
              window.$dialog.warning({
                title: '警告',
                content: '确定删除该频道吗',
                positiveText: '确定',
                negativeText: '不确定',
                onPositiveClick: async () => {
                  await deleteChannel(route.params.server_id, channelInfo.value.key)
                  toSetChannelList()
                },
                onNegativeClick: () => {
                  window.$message.error('不确定')
                },
              })
            },
          }, '删除'),
        key: 'delete',
      },
    ]
    const showDropdownRef = ref(false)
    const xRef = ref(0)
    const yRef = ref(0)

    function modifyServerName() {
      modifyServerNameShowModal.value = false
      modifyServerNameModel.value.serverId = route.params.server_id
      modifyServerNameByOwner(modifyServerNameModel).then((data: { serverInfo: any }) => {
        serverListStore.setServerInfo()
        window.$message.info(data.serverInfo.serverName)
      })
    }

    function handleUpdateValue(key: any, { channelType }: any) {
      // 更新频道类型
      serverListStore.setChannelType(channelType)
      storage.set('channelType', channelType)
    }

    const groupInfoModel = ref({
      name: '',
      expanded: false,
    })

    const handleItemHeaderClick: CollapseProps['onItemHeaderClick'] = ({
      name,
      expanded,
    }) => {
      groupInfoModel.value.name = name
      groupInfoModel.value.expanded = expanded
    }
    const showGroupSetting = ref(false)

    const createGroup = async () => {
      await createGroupApi(route.params.server_id, groupModel.value.groupName)
      toSetChannelList()
      showGroupModal.value = false
    }
    return {
      options,
      showModal,
      formRef,
      model,
      modifyServerNameModel,
      modifyServerNameShowModal,
      modifyServerName,
      rules,
      channel,
      generalOptions,
      showDropdown: showDropdownRef,
      x: xRef,
      y: yRef,
      handleSelect() {
        showDropdownRef.value = false
      },
      onClickOutside() {
        showDropdownRef.value = false
      },
      handleContextMenu: (data: any) => {
        return {
          onContextmenu:
            (e: MouseEvent) => {
              channelInfo.value.key = data.key
              message.info(JSON.stringify(data.key, null, 2))
              e.preventDefault()
              showDropdownRef.value = false
              nextTick().then(() => {
                showDropdownRef.value = true
                xRef.value = e.clientX
                yRef.value = e.clientY
              })
            },
        }
      },
      dataTableOption,
      serverId: computed(() => {
        return route.params.server_id
      }),
      v: computed(() => {
        return route.params.name
      }),
      handleUpdateValue,
      serverListStore,
      showGroupModal,
      groupModel,
      triggerAreas: ['main', 'arrow'],
      handleItemHeaderClick,
      showGroupSetting,
      groupInfoModel,
      channelList,
      serverName: computed(() => serverListStore.getServerName),
      showCreateNotification,
      notificationModel,
      handleClear() {
        notificationModel.value.title = ''
        notificationModel.value.content = ''
      },
      createGroup,
      options2: [
        {
          label: '编辑分组',
          key: 'editGroup',
          props: {
            onClick: () => {
              showGroupSetting.value = true
            },
          },
        },
        {
          label:
            () => h(
              'a',
              {
                style: 'color: red',
                onClick: async () => {
                  window.$dialog.warning({
                    title: '警告',
                    content: '确定删除该分组吗',
                    positiveText: '确定',
                    negativeText: '不确定',
                    onPositiveClick: async () => {
                      await deleteGroupApi(route.params.server_id, groupInfoModel.value.name)
                      toSetChannelList()
                    },
                    onNegativeClick: () => {
                      message.error('不确定')
                    },
                  })
                },
              },
              { default: () => '删除分组' },
            ),
          key: 'deleteGroup',
        },
      ],
      createNotification,
    }
  },
})
</script>

<template>
  <div style="padding: 10px">
    <n-flex justify="center" style="width: 220px">
      <n-dropdown
        placement="bottom"
        trigger="click"
        size="medium"
        :options="options"
      >
        <n-button
          style="height: 30px; width: 100%"
          size="large"
          tertiary type="info"
        >
          {{ serverName }}
          <n-icon size="large">
            <Menu />
          </n-icon>
        </n-button>
      </n-dropdown>
    </n-flex>
    <n-layout-sider>
      <n-collapse
        style="width: 220px;"
        @item-header-click="handleItemHeaderClick"
      >
        <template #header-extra>
          <n-dropdown :options="options2" trigger="click">
            <n-button
              text
              :focusable="false"
              i-carbon:settings
            />
          </n-dropdown>
        </template>
        <n-collapse style="margin-top: 20px">
          <n-menu
            :options="channelList[0]"
            :value="Number(v)"
            :node-props="handleContextMenu"
            @update:value="handleUpdateValue"
          />
        </n-collapse>
        <n-dropdown
          placement="bottom-start"
          trigger="manual"
          :x="x"
          :y="y"
          :options="dataTableOption"
          :show="showDropdown"
          :on-clickoutside="onClickOutside"
          @select="handleSelect"
        />
        <template v-for="(item, index) in channelList">
          <n-collapse-item v-if="item.option" :key="index" :title="item.name" :name="item.index">
            <n-collapse>
              <n-menu
                :options="item.option"
                :value="Number(v)"
                :node-props="handleContextMenu"
                @update:value="handleUpdateValue"
              />
            </n-collapse>
            <n-dropdown
              placement="bottom-start"
              trigger="manual"
              :x="x"
              :y="y"
              :options="dataTableOption"
              :show="showDropdown"
              :on-clickoutside="onClickOutside"
              @select="handleSelect"
            />
          </n-collapse-item>
        </template>
      </n-collapse>
    </n-layout-sider>
  </div>
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
      @click="channel"
    >
      创建频道
    </n-button>
  </n-modal>
  <n-modal
    v-model:show="showGroupModal"
    class="custom-card"
    preset="card"
    :style="{ maxWidth: '600px' }"
    title="创建一个分组"
    size="huge"
    :bordered="false"
    :segmented="{
      content: 'soft',
      footer: 'soft',
    }"
  >
    <n-form
      ref="formRef"
      :model="groupModel"
    >
      <n-form-item label="为分组取个名字" path="groupName">
        <n-input
          v-model:value="groupModel.groupName"
          placeholder="什么名字呢"
        />
      </n-form-item>
    </n-form>
    <n-button
      style="margin-top: 30px; width: 100%"
      @click="createGroup"
    >
      创建分组
    </n-button>
  </n-modal>
  <n-modal
    v-model:show="modifyServerNameShowModal"
    class="custom-card"
    preset="card"
    :style="{ maxWidth: '600px' }"
    title="修改服务器名称"
    size="huge"
    :bordered="false"
    :segmented="{
      content: 'soft',
      footer: 'soft',
    }"
  >
    <n-form
      ref="formRef"
      :model="modifyServerNameModel"
    >
      <n-form-item label="服务器id" path="serverId">
        <n-input
          v-model:value="serverId"
          disabled
        />
      </n-form-item>
      <n-form-item :span="12" label="重命名服务器" path="serverName">
        <n-input
          v-model:value="modifyServerNameModel.serverName"
          placeholder="重命名服务器"
        />
      </n-form-item>
    </n-form>
    <n-button
      style="margin-top: 30px; width: 100%"
      @click="modifyServerName"
    >
      确定
    </n-button>
  </n-modal>
  <n-modal
    v-model:show="showGroupSetting"
    class="custom-card"
    preset="card"
    :style="{ maxWidth: '600px' }"
    title="设置"
    size="huge"
    :bordered="false"
    :segmented="{
      content: 'soft',
      footer: 'soft',
    }"
  >
    {{ groupInfoModel }}
    <n-button
      style="margin-top: 30px; width: 100%"
    >
      确定
    </n-button>
  </n-modal>
  <n-modal
    v-model:show="showCreateNotification"
    class="custom-card"
    preset="card"
    :style="{ maxWidth: '600px' }"
    title="创建通知"
    size="huge"
    :bordered="false"
    :segmented="{
      content: 'soft',
      footer: 'soft',
    }"
  >
    <n-form
      ref="formRef"
      :model="notificationModel"
    >
      <n-form-item label="标题" path="title">
        <n-input v-model:value="notificationModel.title" />
      </n-form-item>
      <n-form-item :span="12" label="内容" path="content">
        <n-input
          v-model:value="notificationModel.content"
          type="textarea"
          style="max-height: 54px"
          :autosize="{ minRows: 2 }"
          maxlength="99"
          show-count
        />
      </n-form-item>
    </n-form>
    <n-button
      style="width: 100%"
      @click="createNotification"
    >
      确定
    </n-button>
    <n-button
      style="margin-top: 30px;width: 100%"
      @click="handleClear"
    >
      清空
    </n-button>
  </n-modal>
</template>

<style scoped>
</style>
