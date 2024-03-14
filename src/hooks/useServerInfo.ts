import { useServerListStore } from '~/store/modules/serverList'

export function useServerInfo() {
  const serverListStore = useServerListStore()
  const menu = computed(() => serverListStore.menuOptions)
  const channelType = computed(() => serverListStore.channelType)
  return {
    channelType,
    menu,
  }
}
