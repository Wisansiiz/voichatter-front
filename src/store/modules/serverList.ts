import { defineStore } from 'pinia'

import { RouterLink } from 'vue-router'
import { Add } from '@vicons/ionicons5'
import { createImageVNode, renderIcon } from '~/utils'
import { createServer, getServerList, joinServer } from '~/api/server'

interface serverRep {
  serverId: number
  serverName: string
  creatorUserId: number
  createDate: string
  serverType: string
  serverImgUrl: string
}
export const useServerListStore = defineStore(
  'server-list-info',
  //   state: () => ({
  //     // return {
  //     serverList: new Map<number, any[]>(),
  //     channelList: [] as any[],
  //     menuOptions: [] as any[],
  //     showModal: false,
  //     channelType: '',
  //     serverName: '未找到',
  //     serverMap: new Map<number, string>(),
  //     serverId: 0,
  //     // }
  //   }),
  //   getters: {
  //     getServerName: (state) => {
  //       const route: any = useRoute()
  //       state.serverId = Number(route.params.server_id)
  //       const name = state.serverMap.get(state.serverId)
  //       if (name)
  //         return state.serverName = name
  //     },
  //   },
  //   actions: {
  //     async setServerInfo() {
  //       const menu: any[] = reactive([])
  //       menu.push({
  //         label: () =>
  //           h(
  //             'a',
  //             {
  //               onClick: () => {
  //                 this.showModal = true
  //               },
  //             },
  //             { default: () => '添加服务器' },
  //           ),
  //         key: 'add',
  //         icon: renderIcon(Add),
  //       })
  //       const map = new Map<number, any[]>()
  //       const map2 = new Map<number, any>()
  //       getServerList().then((res: any) => {
  //         res.serverList.forEach((item: serverRep) => {
  //           map.set(item.serverId, [])
  //           map2.set(item.serverId, item.serverName)
  //           menu.push({
  //             label: () =>
  //               h(
  //                 RouterLink,
  //                 {
  //                   to: {
  //                     path: `/${encodeURIComponent(item.serverId)}`,
  //                   },
  //                 },
  //                 { default: () => item.serverName },
  //               ),
  //             name: item.serverName,
  //             key: item.serverId,
  //             icon: renderIcon(createImageVNode(item.serverImgUrl, item.serverName)),
  //           })
  //         })
  //       })
  //       this.serverList = map
  //       this.serverMap = map2
  //       this.menuOptions = menu
  //       // return { serverList, serverMap, menuOptions }
  //     },
  //
  //     async  toCreateServer(model: any) {
  //       createServer(model).then((server: serverRep) => {
  //         this.menuOptions.push({
  //           label: () =>
  //             h(
  //               RouterLink,
  //               {
  //                 to: {
  //                   path: `/${encodeURIComponent(server.serverId)}`,
  //                 },
  //               },
  //               { default: () => server.serverName },
  //             ),
  //           name: server.serverName,
  //           key: server.serverId,
  //           icon: renderIcon(createImageVNode(server.serverImgUrl, server.serverName)),
  //         })
  //       })
  //     },
  //
  //     async toJoinServer(serverId: number) {
  //       joinServer(serverId).then((server: serverRep) => {
  //         this.menuOptions.push({
  //           label: () =>
  //             h(
  //               RouterLink,
  //               {
  //                 to: {
  //                   path: `/${encodeURIComponent(server.serverId)}`,
  //                 },
  //               },
  //               { default: () => server.serverName },
  //             ),
  //           name: server.serverName,
  //           key: server.serverId,
  //           icon: renderIcon(createImageVNode(server.serverImgUrl, server.serverName)),
  //         })
  //       })
  //     },
  //   },
  // },
  () => {
    const route: any = useRoute()
    const serverList = ref(new Map<number, any[]>())
    const channelList = ref<any[]>([])
    const menuOptions = ref<any[]>([])
    const showModal = ref(false)
    const channelType = ref('')
    const serverName = ref('未找到')
    const serverMap = ref(new Map<number, any>())

    const changeShowModal = computed(() => !showModal.value)
    const getServerName = computed(() => {
      const serverId = Number(route.params.server_id)
      const name = serverMap.value.get(serverId)
      if (name)
        return serverName.value = name
    })

    async function setServerInfo() {
      const menu: any[] = reactive([])
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
      const map = new Map<number, any[]>()
      const map2 = new Map<number, any>()
      getServerList().then((res: any) => {
        res.serverList.forEach((item: serverRep) => {
          map.set(item.serverId, [])
          map2.set(item.serverId, item.serverName)
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
      })
      serverList.value = map
      serverMap.value = map2
      menuOptions.value = menu
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
    return {
      serverList,
      channelList,
      menuOptions,
      showModal,
      serverMap,
      channelType,
      setServerInfo,
      changeShowModal,
      toCreateServer,
      toJoinServer,
      serverName,
      getServerName,
    }
  },
)
