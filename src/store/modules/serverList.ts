import { defineStore } from 'pinia'

import { RouterLink } from 'vue-router'
import { Add } from '@vicons/ionicons5'
import { createImageVNode, renderIcon } from '~/utils'
import { createServer, getServerList, joinServer } from '~/api/server'
import { findChannelList } from '~/api/channel'

interface serverRep {
  serverId: number
  serverName: string
  creatorUserId: number
  createDate: string
  serverType: string
  serverImgUrl: string
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
export const useServerListStore = defineStore(
  'server-list-info',
  () => {
    const route: any = useRoute()
    const serverList = ref(new Map<number, any[]>())
    const channelList = ref<any[]>([])
    const menuOptions = ref<any[]>([])
    const showModal = ref(false)
    const channelType = ref('')
    const serverName = ref('未找到')
    const serverMap = ref(new Map<number, string>())

    const changeShowModal = computed(() => !showModal.value)
    const getServerName = computed(() => {
      const serverId = Number(route.params.server_id)
      const name = serverMap.value.get(serverId)
      if (name) {
        serverName.value = name
        return serverName
      }
    })
    const getChannelList = computed(() => channelList)
    const getMenuOptions = computed(() => menuOptions)
    const getChannelType = computed(() => channelType)

    async function setServerInfo() {
      const menu = [] as any[]
      menu.push({
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
      serverList.value = new Map<number, any[]>()
      serverMap.value = new Map<number, any>()
      getServerList().then((res: any) => {
        res.serverList.forEach((item: serverRep) => {
          serverList.value.set(item.serverId, [])
          serverMap.value.set(item.serverId, item.serverName)
          menu.push({
            label: () =>
              h(
                RouterLink,
                {
                  to: {
                    path: `/${encodeURIComponent(item.serverId)}`,
                  },
                },
                { default: () => item.serverName },
              ),
            name: item.serverName,
            key: item.serverId,
            icon: renderIcon(createImageVNode(item.serverImgUrl, item.serverName)),
          })
        })
        menuOptions.value = menu
      })
      return { serverList, serverMap, menuOptions }
    }

    async function toCreateServer(model: any) {
      createServer(model).then((server: serverRep) => {
        menuOptions.value.push({
          label: () =>
            h(
              RouterLink,
              {
                to: {
                  path: `/${encodeURIComponent(server.serverId)}`,
                },
              },
              { default: () => server.serverName },
            ),
          name: server.serverName,
          key: server.serverId,
          icon: renderIcon(createImageVNode(server.serverImgUrl, server.serverName)),
        })
      })
      return 'success'
    }

    async function toJoinServer(serverId: number) {
      joinServer(serverId).then((server: serverRep) => {
        menuOptions.value.push({
          label: () =>
            h(
              RouterLink,
              {
                to: {
                  path: `/${encodeURIComponent(server.serverId)}`,
                },
              },
              { default: () => server.serverName },
            ),
          name: server.serverName,
          key: server.serverId,
          icon: renderIcon(createImageVNode(server.serverImgUrl, server.serverName)),
        })
      })
    }
    async function toSetChannelList() {
      findChannelList(route.params.server_id).then((res: dataRep) => {
        const all = [] as any[]
        if (res.channelList) {
          const arr = [] as any[]
          res.channelList.forEach((data: channelRep) => {
            arr.push({
              label: () =>
                h(
                  RouterLink,
                  {
                    to: `/${route.params.server_id}/${encodeURIComponent(data.channelId)}`,
                  },
                  { default: () => `${data.channelName}` },
                ),
              key: data.channelId,
              channelType: data.type,
            })
          })
          all.push(arr)
        }
        if (res.groupList) {
          res.groupList.forEach((data: groupRep) => {
            all.push({
              name: data.groupName,
              index: data.groupId,
              option: data.channelList.map((v) => {
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
          })
        }
        channelList.value = all
      })
      return channelList
    }

    return {
      serverList,
      channelList,
      menuOptions,
      showModal,
      serverMap,
      setServerInfo,
      changeShowModal,
      toCreateServer,
      toJoinServer,
      serverName,
      getServerName,
      toSetChannelList,
      getChannelList,
      channelType,
      getMenuOptions,
      getChannelType,
    }
  },
)
