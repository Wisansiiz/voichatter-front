<script lang="ts">
import { computed, defineComponent, reactive, ref, toRefs, unref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NDialogProvider, useDialog, useMessage } from 'naive-ui'
import components from './components'
import ProjectSetting from './ProjectSetting.vue'
import { useUserStore } from '~/store/modules/user'
import AsideMenu from '~/components/AsideMenu.vue'
import { useProjectSetting } from '~/hooks/setting/useProjectSetting'
import { websiteConfig } from '~/config/website.config'
import { useShowSettingStore } from '~/store/modules/showStetting'

export default defineComponent({
  name: 'PageHeader',
  components: { ...components, NDialogProvider, ProjectSetting, AsideMenu },
  props: {
    collapsed: {
      type: Boolean,
    },
    inverted: {
      type: Boolean,
    },
    isShow: {
      type: Boolean,
    },
  },
  emits: ['update:collapsed'],
  setup(props) {
    const userStore = useUserStore()
    const message = useMessage()
    const dialog = useDialog()
    const { navMode, navTheme, headerSetting, menuSetting } = useProjectSetting()

    const { username } = userStore?.info || {}

    const drawerSetting = ref()

    const state = reactive({
      username: username ?? '',
      fullscreenIcon: 'FullscreenOutlined',
      navMode,
      navTheme,
      headerSetting,
    })

    const getInverted = computed(() => {
      return ['light', 'header-dark'].includes(unref(navTheme))
        ? props.inverted
        : !props.inverted
    })

    const mixMenu = computed(() => {
      return unref(menuSetting).mixMenu
    })

    const getChangeStyle = computed(() => {
      const { collapsed } = props
      const { minMenuWidth, menuWidth } = unref(menuSetting)
      return {
        left: collapsed ? `${minMenuWidth}px` : `${menuWidth}px`,
        width: `calc(100% - ${collapsed ? `${minMenuWidth}px` : `${menuWidth}px`})`,
      }
    })

    const getMenuLocation = computed(() => {
      return 'header'
    })

    const router = useRouter()
    const route = useRoute()

    const dropdownSelect = (key: any) => {
      router.push({ name: key })
    }

    // 退出登录
    const doLogout = () => {
      dialog.info({
        title: '提示',
        content: '您确定要退出登录吗',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {
          userStore.logout().then(() => {
            message.success('成功退出登录')
            router
              .replace({
                name: '/login',
                query: {
                  redirect: route.fullPath,
                },
              })
              .finally(() => location.reload())
          })
        },
        onNegativeClick: () => {},
      })
    }

    // 切换全屏图标
    const toggleFullscreenIcon = () =>
      (state.fullscreenIcon
        = document.fullscreenElement !== null ? 'FullscreenExitOutlined' : 'FullscreenOutlined')

    // 监听全屏切换事件
    document.addEventListener('fullscreenchange', toggleFullscreenIcon)

    // 全屏切换
    const toggleFullScreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
      }
      else {
        if (document.exitFullscreen)
          document.exitFullscreen()
      }
    }

    // 图标列表
    const iconList = [
      {
        icon: 'GithubOutlined',
        tips: 'github',
        eventObject: {
          click: () => window.open('https://github.com/Wisansiiz'),
        },
      },
    ]
    const avatarOptions = [
      {
        label: '个人设置',
        key: 1,
      },
      {
        label: '退出登录',
        key: 2,
      },
    ]

    // 头像下拉菜单
    const avatarSelect = (key: number) => {
      switch (key) {
        case 1:
          router.push('/setting/account')
          break
        case 2:
          doLogout()
          break
      }
    }

    function openSetting() {
      const { openDrawer } = drawerSetting.value
      openDrawer()
    }
    const showSettingStore = useShowSettingStore()

    return {
      ...toRefs(state),
      iconList,
      toggleFullScreen,
      doLogout,
      route,
      dropdownSelect,
      avatarOptions,
      getChangeStyle,
      avatarSelect,
      drawerSetting,
      openSetting,
      getInverted,
      getMenuLocation,
      mixMenu,
      websiteConfig,
      toggleMembersList: () => {
        showSettingStore.toggleMembersList()
      },
      avatar: computed(() => userStore.getAvatar),
    }
  },
})
</script>

<template>
  <div class="layout-header">
    <!-- 顶部菜单 -->
    <div
      v-if="navMode === 'horizontal' || (navMode === 'horizontal-mix' && mixMenu)"
      class="layout-header-left"
    >
      <div v-if="navMode === 'horizontal'" class="logo">
        <img :src="websiteConfig.logo" alt="">
        <h2 v-show="!collapsed" class="title">
          {{ websiteConfig.title }}
        </h2>
      </div>
      <AsideMenu
        :collapsed="collapsed"
        :location="getMenuLocation"
        :inverted="getInverted"
        mode="horizontal"
      />
    </div>
    <!-- 左侧菜单 -->
    <div v-else class="layout-header-left">
      <!-- 菜单收起 -->
      <div
        class="layout-header-trigger layout-header-trigger-min ml-1"
        @click="() => $emit('update:collapsed', !collapsed)"
      >
        <n-icon v-if="collapsed" size="18">
          <MenuUnfoldOutlined />
        </n-icon>
        <n-icon v-else size="18">
          <MenuFoldOutlined />
        </n-icon>
      </div>
    </div>
    <div class="layout-header-right">
      <div
        v-for="item in iconList"
        :key="item.icon"
        class="layout-header-trigger layout-header-trigger-min"
      >
        <n-tooltip placement="bottom">
          <template #trigger>
            <n-icon size="18">
              <component :is="item.icon" v-on="item.eventObject || {}" />
            </n-icon>
          </template>
          <span>{{ item.tips }}</span>
        </n-tooltip>
      </div>
      <!-- 切换全屏 -->
      <div class="layout-header-trigger layout-header-trigger-min">
        <n-tooltip placement="bottom">
          <template #trigger>
            <n-icon size="18">
              <component :is="fullscreenIcon" @click="toggleFullScreen" />
            </n-icon>
          </template>
          <span>全屏</span>
        </n-tooltip>
      </div>
      <!-- 个人中心 -->
      <div class="layout-header-trigger layout-header-trigger-min">
        <n-dropdown trigger="hover" :options="avatarOptions" @select="avatarSelect">
          <div class="avatar">
            <n-avatar v-if="!avatar" round>
              {{ username }}
              <template #icon>
                <UserOutlined />
              </template>
            </n-avatar>
            <n-avatar v-else round :src="avatar" />
          </div>
        </n-dropdown>
      </div>
      <!-- 设置 -->
      <div class="layout-header-trigger layout-header-trigger-min" @click="openSetting">
        <n-tooltip placement="bottom-end">
          <template #trigger>
            <n-icon size="18" style="font-weight: bold">
              <SettingOutlined />
            </n-icon>
          </template>
          <span>项目配置</span>
        </n-tooltip>
      </div>
      <!-- 设置 -->
      <div
        class="layout-header-trigger layout-header-trigger-min"
        @click="toggleMembersList"
      >
        <n-tooltip placement="bottom-end">
          <template #trigger>
            <n-icon size="18" style="font-weight: bold">
              <SettingOutlined />
            </n-icon>
          </template>
          <span>服务器内用户列表</span>
        </n-tooltip>
      </div>
    </div>
  </div>
  <!-- 项目配置 -->
  <ProjectSetting ref="drawerSetting" />
</template>

<style lang="less" scoped>
.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  height: 64px;
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
  transition: all 0.2s ease-in-out;
  width: 100%;
  z-index: 11;

  &-left {
    display: flex;
    align-items: center;

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 64px;
      line-height: 64px;
      overflow: hidden;
      white-space: nowrap;
      padding-left: 10px;

      img {
        width: auto;
        height: 32px;
        margin-right: 10px;
      }

      .title {
        margin-bottom: 0;
      }
    }

    ::v-deep(.ant-breadcrumb span:last-child .link-text) {
      color: #515a6e;
    }

    .n-breadcrumb {
      display: inline-block;
    }

    &-menu {
      color: var(--text-color);
    }
  }

  &-right {
    display: flex;
    align-items: center;
    margin-right: 20px;

    .avatar {
      display: flex;
      align-items: center;
      height: 64px;
    }

    > * {
      cursor: pointer;
    }
  }

  &-trigger {
    display: inline-block;
    width: 64px;
    height: 64px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    .n-icon {
      display: flex;
      align-items: center;
      height: 64px;
      line-height: 64px;
    }

    &:hover {
      background: hsla(0, 0%, 100%, 0.08);
    }

    .anticon {
      font-size: 16px;
      color: #515a6e;
    }
  }

  &-trigger-min {
    width: auto;
    padding: 0 12px;
  }
}

.layout-header-light {
  background: #fff;
  color: #515a6e;

  .n-icon {
    color: #515a6e;
  }

  .layout-header-left {
    ::v-deep(
        .n-breadcrumb .n-breadcrumb-item:last-child .n-breadcrumb-item__link
      ) {
      color: #515a6e;
    }
  }

  .layout-header-trigger {
    &:hover {
      background: #f8f8f9;
    }
  }
}

.layout-header-fix {
  position: fixed;
  top: 0;
  right: 0;
  left: 200px;
  z-index: 11;
}
</style>
