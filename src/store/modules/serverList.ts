import { defineStore } from 'pinia'
import { RouterLink } from 'vue-router'
import { Add } from '@vicons/ionicons5'
import { createImageVNode, renderIcon } from '~/composables'
import { createServer, getServerList, joinServer } from '~/api/server'

// import { findChannelList } from '~/api/channel'
import { userList } from '~/api/user'
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
  channelList?: [
    {
      channelId: number
      channelName: string
      serverId: number
      type: string
      createUserId: number
    },
  ]
}
interface serverMember {
  userID: number
  username: string
  email: string
  avatarURL: string
  SPermissions: string
  lastLoginDate: string
}
export const useServerListStore = defineStore(
  'server-list-info',
  () => {
    const route: any = useRoute()
    // const serverList = ref(new Map<number, any[] | null>())
    const menuOptions = ref<any[]>([])
    const showModal = ref(false)
    const channelType = ref(storage.get('channelType'))
    const serverMap = ref(new Map<number, string>())
    const memberList = ref([] as any[])

    const changeShowModal = computed(() => !showModal.value)
    const getServerName = computed(() => {
      const serverId = Number(route.params.server_id)
      const name = serverMap.value.get(serverId)
      if (name)
        return name
    })
    const getMenuOptions = computed(() => menuOptions)
    const getChannelType = computed(() => channelType)
    const getMemberList = computed(() => memberList)

    async function toSetMemberList() {
      let ml = [] as any[]
      return new Promise((resolve) => {
        userList(route.params.server_id).then((res: serverMember[]) => {
          ml = res.map((item) => {
            return {
              avatarURL: createImageVNode(item.avatarURL, item.username),
              username: item.username,
              SPermissions: item.SPermissions,
            }
          })
          resolve(ml)
        })
      })
    }

    function setChannelType(type: string) {
      channelType.value = type
    }
    async function setServerInfo() {
      const menu = [] as any[]
      return new Promise((resolve) => {
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
        serverMap.value = new Map<number, any>()
        getServerList().then((res: { serverList: any }) => {
          if (res.serverList) {
            res.serverList.forEach((item: serverRep) => {
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
          }
          menuOptions.value = menu
          resolve(menu)
        })
      })
    }

    async function toCreateServer(model: any) {
      return new Promise((resolve) => {
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
        resolve('success')
      })
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
    function toSetChannelList() {
      const list = [] as any[]
      return new Promise((resolve) => {
        findChannelList(route.params.server_id).then((res: dataRep) => {
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
            list.push(arr)
          }
          if (res.groupList) {
            res.groupList.forEach((data: groupRep) => {
              if (data.channelList) {
                list.push({
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
              }
              else {
                list.push({
                  name: data.groupName,
                  index: data.groupId,
                  option: [],
                })
              }
            })
          }
          resolve(list)
        })
      })
    }

    return {
      // serverList,
      menuOptions,
      showModal,
      serverMap,
      setServerInfo,
      changeShowModal,
      toCreateServer,
      toJoinServer,
      getServerName,
      getMenuOptions,
      getChannelType,
      channelType,
      setChannelType,
      toSetMemberList,
      getMemberList,
      memberList,
      toSetChannelList,
    }
  },
)
