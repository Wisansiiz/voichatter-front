<script setup>
import { Home, Search, Store, User } from '@vicons/carbon'
import { NAvatar, NIcon, NText } from 'naive-ui'

function renderCustomHeader() {
  return h(
    'div',
    {
      style: 'display: flex; align-items: center; padding: 8px 12px;',
    },
    [
      h(NAvatar, {
        round: true,
        style: 'margin-right: 12px;',
        src: 'https://thirdqq.qlogo.cn/g?b=qq&nk=1392634254&s=100',
      }),
      h('div', null, [
        h('div', null, [h(NText, { depth: 2 }, { default: () => '打工仔' })]),
        h('div', { style: 'font-size: 12px;' }, [
          h(
            NText,
            { depth: 3 },
            { default: () => '毫无疑问，你是办公室里最亮的星' },
          ),
        ]),
      ]),
    ],
  )
}
const options = [
  {
    key: 'header',
    type: 'render',
    render: renderCustomHeader,
  },
  {
    key: 'header-divider',
    type: 'divider',
  },
  {
    label: '处理群消息 342 条',
    key: 'stmt1',
  },
  {
    label: '被 @ 58 次',
    key: 'stmt2',
  },
  {
    label: '加入群 17 个',
    key: 'stmt3',
  },
]
function handleSelect(key) {
  gMessage.info(String(key))
}
</script>

<template>
  <n-layout-header bordered style="height: 50px">
    <n-breadcrumb separator="|" style="line-height: 42px">
      <n-flex style="padding-left: 10px">
        <n-breadcrumb-item>
          <NIcon><Home /></NIcon>
          <RouterLink to="/">
            首页
          </RouterLink>
        </n-breadcrumb-item>
        <n-breadcrumb-item>
          <NIcon><Search /></NIcon>
          搜索
        </n-breadcrumb-item>
        <n-breadcrumb-item>
          <NIcon><Store /></NIcon>
          <RouterLink to="/store">
            商城?
          </RouterLink>
        </n-breadcrumb-item>
        <n-breadcrumb-item>
          <NIcon><User /></NIcon>
          <n-dropdown trigger="hover" :options="options" @select="handleSelect">
            <RouterLink to="/my">
              我的
            </RouterLink>
          </n-dropdown>
        </n-breadcrumb-item>
      </n-flex>
    </n-breadcrumb>
  </n-layout-header>
</template>

<style scoped>

</style>
