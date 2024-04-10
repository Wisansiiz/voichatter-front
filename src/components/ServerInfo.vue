<script setup lang="ts">
import { ref } from 'vue'
import { serverImgApi, serverInfoApi, serverInfoUpdApi } from '~/api/server'
import { useServerListStore } from '~/store/modules/serverList'

interface ServerInfo {
  createDate: string
  creatorUserId: number
  serverDescription: string
  serverId: number
  serverImgUrl: string
  serverName: string
  serverType: string
  [property: string]: any
}
const route = useRoute('/server-setting/[serverId]')
const serverId = computed(() => route.params.serverId)

const serverInfo = ref<ServerInfo>(null)
const loading = ref(false)
onMounted(async () => {
  loading.value = true
  await serverInfoApi(route.params.serverId)
    .then(res => serverInfo.value = res)
  loading.value = false
})

const generalOptions = ['public', 'private'].map(
  v => ({
    label: v,
    value: v,
  }),
)

const cropperRef = ref()
const fileInputRef = ref()
function selectImageFile(e: any) {
  const { files } = e.target
  if (!files || !files.length)
    return
  const file = files[0]
  const reader = new FileReader()
  // 读取文件 base64
  reader.readAsDataURL(file)
  reader.onload = () => {
    const imgURL = String(reader.result)
    if (fileInputRef.value)
      fileInputRef.value.value = ''
    cropperRef.value.showCropperWindow(imgURL)
  }
}
const serverListStore = useServerListStore()
const { setServerInfo } = serverListStore
function getResultData({ blobData, dataURL }: any) {
  serverInfo.value.serverImgUrl = dataURL
  serverImgApi(serverId.value, blobData).then((res) => {
    serverInfo.value.serverImgUrl = res.serverImgUrl
    window.$message.success('更新成功')
    setServerInfo()
  })
}
async function serverInfoUpd() {
  await serverInfoUpdApi(serverInfo.value).then((res) => {
    console.log(res)
    window.$message.success('更新成功')
    setServerInfo()
  })
}
</script>

<template>
  <div style="margin-left: 100px">
    <n-spin :show="loading">
      <n-space vertical justify="center">
        <template v-if="serverInfo">
          <n-form
            label-placement="left"
            label-width="auto"
            require-mark-placement="right-hanging"
            :style="{
              maxWidth: '640px',
            }"
          >
            <n-form-item label="服务器ID：">
              <n-input :value="String(serverInfo.serverId)" placeholder="Server Id" disabled />
            </n-form-item>

            <n-form-item label="服务器名称：">
              <n-input v-model:value="serverInfo.serverName" placeholder="Server Name" />
            </n-form-item>

            <n-form-item label="服务器描述：">
              <n-input
                v-model:value="serverInfo.serverDescription"
                placeholder="被搜索时别人看到的描述"
                type="textarea"
                :autosize="{
                  minRows: 3,
                  maxRows: 5,
                }"
              />
            </n-form-item>

            <n-form-item label="服务器类型：">
              <n-select
                v-model:value="serverInfo.serverType"
                placeholder="决定是否会被别人搜到"
                :options="generalOptions"
              />
            </n-form-item>

            <n-space justify="start" style="margin-left: 150px; margin-bottom: 50px">
              <n-button type="primary" @click="serverInfoUpd">
                确认修改
              </n-button>
            </n-space>

            <n-form-item label="头像：" path="serverImgUrl">
              <label>
                <n-avatar round :size="120" :src="serverInfo.serverImgUrl" />
                <input
                  ref="fileInputRef"
                  type="file" style="display: none"
                  accept="image/jpeg, image/png, image/jpg, image/gif"
                  @change="selectImageFile"
                >
              </label>
            </n-form-item>
            <CropperWindow
              ref="cropperRef"
              @update:result-data="getResultData"
            />
          </n-form>
        </template>
      </n-space>
    </n-spin>
  </div>
</template>

<style scoped>

</style>
