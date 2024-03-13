import { useServerListStore } from '~/store/modules/serverList'

export function useServerInfo() {
  const serverListStore = useServerListStore()
  const serverList = computed(() => serverListStore.serverList)
  const channelList = computed(() => serverListStore.channelList)
  const menu = computed(() => serverListStore.menuOptions)
  const showModal = computed(() => serverListStore.showModal)
  const serverMap = computed(() => serverListStore.serverMap)
  const channelType = computed(() => serverListStore.channelType)
  return {
    serverList,
    channelList,
    channelType,
    menu,
    showModal,
    serverMap,
  }
}
