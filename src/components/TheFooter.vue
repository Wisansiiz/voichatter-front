<script lang="ts">
</script>

<template>
  <n-flex>
    <n-layout-footer
      bordered
      position="absolute"
      style="height: 64px;padding: 5px"
    >
      <n-flex justify="center">
        <TheInput />
        <div style="height: 54px; line-height: 54px">
          <n-button type="primary" ghost>
            发送
          </n-button>
        </div>
      </n-flex>
    </n-layout-footer>
  </n-flex>
</template>
