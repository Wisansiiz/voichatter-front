<script setup lang="ts">
const props = defineProps({
  menuOptions: {
    type: Array<ServerMember>,
    default: () => [],
  },
})
const collapsed = ref(false)
interface ServerMember {
  user_id: number
  username: string
  email: string
  avatar_url: string
  s_permissions: string
  last_login_date: string
}
const menuOptions: ServerMember[] = props.menuOptions
</script>

<template>
  <n-layout-sider
    bordered
    show-trigger
    collapse-mode="width"
    :collapsed-width="0"
    :width="240"
    :collapsed="collapsed"
    @collapse="collapsed = true"
    @expand="collapsed = false"
  >
    <n-flex justify="center">
      <n-h3>服务器成员列表</n-h3>
    </n-flex>
    <n-flex justify="center">
      <n-popover v-for="(option, index) in menuOptions" :key="index" placement="left-start" trigger="click">
        <template #trigger>
          <n-button
            style="width: 80%; height: 36px; border: #e8e8e8 1px solid;"
            bordered
            justify-start
          >
            <n-button text style="font-size: 24px; margin-bottom: 3px">
              <n-icon>
                <n-avatar
                  round
                  size="small"
                  src="https://thirdqq.qlogo.cn/g?b=qq&nk=1392634254&s=100"
                />
              </n-icon>
            </n-button>
            <n-flex justify="start" style="height: 34px;">
              <n-text
                style="margin-left: 20px; line-height: 34px;"
              >
                {{ option.username }}
              </n-text>
            </n-flex>
          </n-button>
        </template>
        <div style="width: 200px; height: 300px">
          <n-avatar
            round
            size="large"
            src="https://thirdqq.qlogo.cn/g?b=qq&nk=1392634254&s=100"
          />
          <n-flex style="border: #e8e8e8 1px solid; width: 100%; height: 80%;" justify="start">
            <n-text>
              name: {{ option.username }}
            </n-text>
            <n-text>
              id: {{ option.user_id }}
            </n-text>
          </n-flex>
        </div>
      </n-popover>
    </n-flex>
  </n-layout-sider>
</template>

<style scoped>

</style>
