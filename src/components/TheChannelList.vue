<script lang="ts">
import type { DataTableColumns, DropdownOption, FormInst } from 'naive-ui'
import { h, nextTick, ref } from 'vue'
import type { RowData } from 'naive-ui/es/data-table/src/interface'
import { Menu } from '@vicons/ionicons5'
import { service } from '~/utils/request'
import { channelList, createChannel } from '~/api/channel'

export default defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  components: { Menu },
  props: {
    serverName: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const serverName = computed(() => {
      return props.serverName
    })
    // const router = useRouter()
    const route: any = useRoute()
    const dialog = useDialog()
    const message = useMessage()
    // function go(i: any) {
    //   router.push(`/${route.params.server_id}/${encodeURIComponent(i)}`)
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
    const data2: Ref<RowData[] | null> = ref([])
    async function channels() {
      data2.value = []
      const res: dataRep = await channelList(route.params.server_id)
      if (res.channelList) {
        const data = res.channelList
        for (let i = 0; i < data.length; i++) {
          data2.value.push({
            name: data[i].channelName,
            index: data[i].channelId,
            channelType: data[i].type,
          })
        }
      }
      if (res.groupList) {
        const data = res.groupList
        for (let i = 0; i < data.length; i++) {
          data2.value.push({
            name: data[i].groupName,
            index: data[i].groupId,
            children: data[i].channelList.map((v) => {
              return {
                name: v.channelName,
                index: v.channelId,
                channelType: v.type,
              }
            }),
          })
        }
      }
    }
    onMounted(() => {
      channels()
    })
    watch(() => route.params.server_id, (value, oldValue) => {
      if (value !== oldValue)
        channels()
    })
    const columns: DataTableColumns<dataRep> = [
      // {
      //   type: 'selection',
      // },
      {
        title: 'name',
        key: 'name',
      },
    ]
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
    return {
      serverName,
      // go,
      options,
      showModal,
      formRef,
      model,
      rules,
      channel,
      generalOptions,
      // menuOptions,
      showDropdown: showDropdownRef,
      x: xRef,
      y: yRef,
      handleSelect() {
        showDropdownRef.value = false
      },
      onClickoutside() {
        showDropdownRef.value = false
      },
      rowProps: (row: { name: string, index: string | number }) => {
        return {
          onContextmenu: (e: MouseEvent) => {
            message.info(JSON.stringify([row.name, row.index], null, 2))
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
      rowKey: (row: RowData) => row.index,
      columns,
      // data: ref([]),
      data2,
    }
  },
})
</script>

<template>
  <div style="padding: 18px">
    <n-flex justify="space-between">
      {{ serverName }}
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

    <n-data-table
      :columns="columns"
      :data="data2"
      :row-key="rowKey"
      default-expand-all
      :row-props="rowProps"
    />
    <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :x="x"
      :y="y"
      :options="dataTableOption"
      :show="showDropdown"
      :on-clickoutside="onClickoutside"
      @select="handleSelect"
    />
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
</template>

<style scoped>
</style>
