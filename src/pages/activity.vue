<script setup lang="ts">
import { ref } from 'vue'
import type { InputProps } from 'naive-ui'
import { Search } from '@vicons/ionicons5'
import type { ActivityPage } from '~/api/activity/activity'
import { activityPagesApi } from '~/api/activity/activity'
import ActivityCard from '~/components/ActivityCard.vue'

const loading = ref(false)

const activityList = ref([] as ActivityPage[])
const pageCount = ref(0)
const page = ref(1)
const pageSize = ref(6)
const searchValue = ref('')
function getActivityList() {
  // console.log(page.value, pageSize.value)
  loading.value = true
  activityPagesApi(page.value, pageSize.value, searchValue.value).then((res) => {
    activityList.value = res.activityPages
    pageCount.value = res.pageTotal
    loading.value = false
  })
}
getActivityList()

type InputThemeOverrides = NonNullable<InputProps['themeOverrides']>
const inputThemeOverrides: InputThemeOverrides = {
  heightLarge: '50px',
}
</script>

<template>
  <n-flex justify="center" style="margin-top: 30px">
    <n-h1>活动列表</n-h1>
  </n-flex>
  <n-flex justify="center">
    <n-input
      v-model:value="searchValue"
      round
      placeholder="搜索活动"
      style="margin-top: 20px;width: 70%; text-align: center"
      size="large"
      height-large="50px"
      :theme-overrides="inputThemeOverrides"
    >
      <template #suffix>
        <n-button text style="font-size: 20px" @click="getActivityList">
          <n-icon :component="Search" />
        </n-button>
      </template>
    </n-input>
  </n-flex>
  <n-spin :show="loading" style="margin-top: 10px">
    <n-flex justify="center" style="padding: 10px;" :wrap-item="false">
      <template
        v-if="activityList"
      >
        <template
          v-for="(item, _index) in activityList"
          :key="_index"
        >
          <ActivityCard
            :activity-title="item.activityTitle"
            :activity-desc="item.activityDesc"
            :start-date="item.startDate"
            :end-date="item.endDate"
            :server-id="item.serverId"
          />
        </template>
      </template>
      <template v-else>
        <n-h1>当前似乎没有活动</n-h1>
      </template>
    </n-flex>
    <n-flex justify="end">
      <n-pagination
        v-model:page="page"
        v-model:page-size="pageSize"
        :item-count="pageCount"
        @update:page="getActivityList"
      />
    </n-flex>
  </n-spin>
</template>

<style scoped>
</style>
