<script lang="ts">
import type { DropdownOption, FormInst } from 'naive-ui'
import { Menu } from '@vicons/ionicons5'
import { RouterLink } from 'vue-router'
import { channelList, createChannel } from '~/api/channel'
import { deleteServerByOwner, modifyServerNameByOwner } from '~/api/server'
import { useServerListStore } from '~/store/modules/serverList'
import { useServerInfo } from '~/hooks/useServerInfo'

export default defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  components: { Menu },
  setup() {
    const route: any = useRoute()
    const dialog = useDialog()
    const message = useMessage()
    const showModal = ref(false)
    const modifyServerNameShowModal = ref(false)
    const formRef = ref<FormInst | null>(null)

    const model = ref({
      channel_name: null,
      type: null,
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
      await deleteServerByOwner(route.params.server_id)
    }
    async function channel() {
      await createChannel(formRef, model, route.params.server_id)
      showModal.value = false
    }
    interface dataRep {
      channelList: channelRep[]
      groupList?: groupRep[]
    }
    interface channelRep {
      channelId: number
      channelName: string
      serverId: number
      type: string
      createUserId: number
      groupId?: number
    }
    interface groupRep {
      groupId: number
      serverId: number
      groupName: string
      channelList: [
        {
          channelId: number
          channelName: string
          serverId: number
          type: string
          createUserId: number
        },
      ]
    }
    const data2: Ref<any[]> = ref([])
    function channels() {
      channelList(route.params.server_id).then((res: dataRep) => {
        data2.value = []
        if (res.channelList) {
          const data = res.channelList
          const arr = []
          for (let i = 0; i < data.length; i++) {
            arr.push({
              label: () =>
                h(
                  RouterLink,
                  {
                    to: `/${route.params.server_id}/${encodeURIComponent(data[i].channelId)}`,
                  },
                  { default: () => `${data[i].channelName}` },
                ),
              key: data[i].channelId,
              channelType: data[i].type,
            })
          }
          data2.value.push(arr)
        }
        if (res.groupList) {
          const data = res.groupList
          for (let i = 0; i < data.length; i++) {
            data2.value.push({
              name: data[i].groupName,
              index: data[i].groupId,
              option: data[i].channelList.map((v) => {
                return {
                  label: () =>
                    h(
                      RouterLink,
                      {
                        to: `/${route.params.server_id}/${encodeURIComponent(v.channelId)}`,
                      },
                      { default: () => `${v.channelName}` },
                    ),
                  key: v.channelId,
                  channelType: v.type,
                }
              }),
            })
          }
        }
      })
    }
    const serverListStore = useServerListStore()
    watch(() => route.params.server_id, (value, oldValue) => {
      if (value !== oldValue)
        channels()
    })
    const dataTableOption: DropdownOption[] = [
      {
        label: '编辑',
        key: 'edit',
      },
      {
        label: () => h('span', { style: { color: 'red' } }, '删除'),
        key: 'delete',
      },
    ]
    const showDropdownRef = ref(false)
    const xRef = ref(0)
    const yRef = ref(0)

    const { serverMap } = useServerInfo()
    const serverName = ref()
    onMounted(() => {
      channels()
    })

    function modifyServerName() {
      modifyServerNameModel.value.serverId = route.params.server_id
      modifyServerNameByOwner(modifyServerNameModel).then((data: { serverInfo: any }) => {
        serverListStore.setServerInfo()
        setTimeout(() => {
          serverName.value = serverMap.value.get(Number(route.params.server_id))
        }, 1000)
        window.$message.info(data.serverInfo.serverName)
      })
      modifyServerNameShowModal.value = false
    }

    function handleUpdateValue(key: any, { channelType }: any) {
      serverListStore.channelType = channelType
    }

    return {
      serverName,
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
              message.info(JSON.stringify([data], null, 2))
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
      data2,
      serverId: computed(() => {
        return route.params.server_id
      }),
      v: computed(() => {
        return route.params.name
      }),
      handleUpdateValue,
      serverListStore,
    }
  },
})
</script>

<template>
  <div style="padding: 10px">
    <n-flex justify="space-between" style="width: 220px">
      {{ serverListStore.getServerName }}
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
    </n-flex>
    <n-layout-sider>
      <n-collapse style="width: 220px;">
        <n-collapse style="margin-top: 20px">
          <n-menu
            :options="data2[0]"
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
        <template v-for="(item, index) in data2">
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
</template>

<style scoped>
</style>
