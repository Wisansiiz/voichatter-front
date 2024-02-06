<script setup>
defineOptions({
  name: 'IndexPage',
})
const name = ref('')
const router = useRouter()
function go() {
  if (name.value)
    router.push(`/hi/${encodeURIComponent(name.value)}`)
}
onMounted (() => {
  isOnline((res) => {
    if (!res) {
      gMessage.warning('登录已失效，请重新登录')
      router.push('/login')
    }
  })
})
</script>

<template>
  <n-scrollbar style="margin-bottom: 50px">
    <div i-carbon-campsite inline-block text-4xl />
    <p>
      <a rel="noreferrer" href="" target="_blank">
        Vitesse Lite
      </a>
    </p>
    <p>
      <em text-sm op75>Opinionated Vite Starter Template</em>
    </p>

    <div py-4 />

    <TheInput
      v-model="name"
      placeholder="What's your name?"
      autocomplete="false"
      @keydown.enter="go"
    />

    <div>
      <button
        class="m-3 text-sm btn"
        :disabled="!name"
        @click="go"
      >
        Go
      </button>
    </div>

    <div>
      <RouterLink to="/" i-carbon-home icon-btn />

      <button icon-btn @click="toggleDark()">
        <div i-carbon-sun />
      </button>

      <a
        i-carbon-logo-github icon-btn
        rel="noreferrer"
        href=""
        target="_blank"
        title="GitHub"
      />
      <RouterLink to="/ws" i-carbon-add-comment icon-btn />
    </div>
    <n-button @click="logout().then(() => router.push('/login'))">
      退出登录
    </n-button>
  </n-scrollbar>
</template>
