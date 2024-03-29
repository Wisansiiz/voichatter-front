<script lang="ts" setup>
import { computed, onMounted, ref, unref } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectSetting } from '~/hooks/setting/useProjectSetting'
import { useDesignSetting } from '~/hooks/setting/useDesignSetting'
import { useProjectSettingStore } from '~/store/modules/projectSetting'
import PageHeader from '~/components/Header/PageHeader.vue'
import { useShowSettingStore } from '~/store/modules/showStetting'

const { getDarkTheme } = useDesignSetting()
const {
  navMode,
  navTheme,
  headerSetting,
  menuSetting,
  multiTabsSetting,
} = useProjectSetting()
const settingStore = useProjectSettingStore()

const collapsed = ref<boolean>(false)
const showSettingStore = useShowSettingStore()
const isShow = showSettingStore.isShowMembersList

const { mobileWidth, menuWidth } = unref(menuSetting)

const isMobile = computed<boolean>({
  get: () => settingStore.getIsMobile,
  set: val => settingStore.setIsMobile(val),
})

const fixedHeader = computed(() => {
  const { fixed } = unref(headerSetting)
  return fixed ? 'absolute' : 'static'
})
const currentRoute = useRoute()
const isMixMenuNoneSub = computed(() => {
  const mixMenu = unref(menuSetting).mixMenu
  if (unref(navMode) !== 'horizontal-mix')
    return true
  return !(unref(navMode) === 'horizontal-mix' && mixMenu && currentRoute.meta.isRoot)
})

const fixedMenu = computed(() => {
  const { fixed } = unref(headerSetting)
  return fixed ? 'absolute' : 'static'
})

const fixedMulti = computed(() => {
  return unref(multiTabsSetting).fixed
})

const inverted = computed(() => {
  return ['dark', 'header-dark'].includes(unref(navTheme))
})

const getHeaderInverted = computed(() => {
  return ['light', 'header-dark'].includes(unref(navTheme)) ? unref(inverted) : !unref(inverted)
})

const leftMenuWidth = computed(() => {
  const { minMenuWidth, menuWidth } = unref(menuSetting)
  return collapsed.value ? minMenuWidth : menuWidth
})

const getMenuLocation = computed(() => {
  return 'left'
})

// 控制显示或隐藏移动端侧边栏
const showSideDrawer = computed({
  get: () => isMobile.value && collapsed.value,
  set: val => (collapsed.value = val),
})

// 判断是否触发移动端模式
function checkMobileMode() {
  isMobile.value = document.body.clientWidth <= mobileWidth
  collapsed.value = false
}

function watchWidth() {
  const Width = document.body.clientWidth
  collapsed.value = Width <= 950
  checkMobileMode()
}

onMounted(() => {
  checkMobileMode()
  window.addEventListener('resize', watchWidth)
})
const loading = computed(() => showSettingStore.showMenu)
</script>

<template>
  <n-layout class="layout" :position="fixedMenu" has-sider>
    <n-layout-sider
      v-if="
        !isMobile && isMixMenuNoneSub && (navMode === 'vertical' || navMode === 'horizontal-mix')
      "
      :position="fixedMenu"
      :collapsed="collapsed"
      collapse-mode="width"
      :collapsed-width="64"
      :width="leftMenuWidth"
      :native-scrollbar="false"
      :inverted="inverted"
      class="layout-sider"
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
      <n-spin :show="loading">
        <Logo :collapsed="collapsed" />
        <AsideMenu
          v-model:collapsed="collapsed"
          v-model:location="getMenuLocation"
        />
      </n-spin>
    </n-layout-sider>

    <n-drawer
      v-model:show="showSideDrawer"
      :width="menuWidth"
      placement="left"
      class="layout-side-drawer"
    >
      <n-layout-sider
        :position="fixedMenu"
        :collapsed="false"
        :width="menuWidth"
        :native-scrollbar="false"
        :inverted="inverted"
        class="layout-sider"
      >
        <n-spin :show="loading">
          <Logo :collapsed="collapsed" />
          <AsideMenu v-model:location="getMenuLocation" />
        </n-spin>
      </n-layout-sider>
    </n-drawer>

    <n-layout :inverted="inverted">
      <n-layout-header :inverted="getHeaderInverted" :position="fixedHeader">
        <PageHeader v-model:collapsed="collapsed" v-model:isShow="isShow" :inverted="inverted" />
      </n-layout-header>

      <n-layout-content
        class="layout-content"
        :class="{ 'layout-default-background': getDarkTheme === false }"
      >
        <div
          class="layout-content-main"
          :class="{
            'layout-content-main-fix': fixedMulti,
            'fluid-header': fixedHeader === 'static',
          }"
        >
          <MainView />
        </div>
      </n-layout-content>
      <n-back-top :right="100" />
    </n-layout>
  </n-layout>
</template>

<style lang="less">
.layout-side-drawer {
  background-color: rgb(255, 0, 0);

  .layout-sider {
    min-height: 100vh;
    box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
    position: relative;
    z-index: 13;
    transition: all 0.2s ease-in-out;
  }
}
</style>

<style lang="less" scoped>
.layout {
  display: flex;
  flex-direction: row;
  flex: auto;

  &-default-background {
    background: #f5f7f9;
  }

  .layout-sider {
    min-height: 100vh;
    box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
    position: relative;
    z-index: 13;
    transition: all 0.2s ease-in-out;
  }

  .layout-sider-fix {
    position: fixed;
    top: 0;
    left: 0;
  }

  .ant-layout {
    overflow: hidden;
  }

  .layout-right-fix {
    overflow-x: hidden;
    padding-left: 200px;
    min-height: 100vh;
    transition: all 0.2s ease-in-out;
  }

  .layout-content {
    flex: auto;
    min-height: 100vh;
  }

  .n-layout-header.n-layout-header--absolute-positioned {
    z-index: 11;
  }

  .n-layout-footer {
    background: none;
  }
}

.layout-content-main {
  margin: 0 10px 10px;
  position: relative;
  padding-top: 64px;
}

.layout-content-main-fix {
  padding-top: 64px;
}

.fluid-header {
  padding-top: 0;
}

.main-view-fix {
  padding-top: 44px;
}

.noMultiTabs {
  padding-top: 0;
}
</style>
