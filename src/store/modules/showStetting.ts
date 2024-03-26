import { defineStore } from 'pinia'

export const useShowSettingStore = defineStore(
  'show-setting',
  () => {
    const isShowMembersList = ref(true)
    const showMenu = ref(false)
    const showChannelList = ref(false)

    function toggleMembersList() {
      isShowMembersList.value = !isShowMembersList.value
    }
    function loadingMenu() {
      showMenu.value = true
    }
    function loadedMenu() {
      showMenu.value = false
    }
    function loadingShowChannelList() {
      showChannelList.value = true
    }
    function loadedShowChannelList() {
      showChannelList.value = false
    }
    return {
      isShowMembersList,
      toggleMembersList,
      showMenu,
      loadingMenu,
      loadedMenu,
      showChannelList,
      loadingShowChannelList,
      loadedShowChannelList,
    }
  },
)
