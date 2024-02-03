<script setup lang="ts" generic="T extends any, O extends any">
import { unauthorized } from '~/stores/authorized'

defineOptions({
  name: 'IndexPage',
})

const name = ref('')

const router = useRouter()
function go() {
  if (name.value)
    router.push(`/hi/${encodeURIComponent(name.value)}`)
}
if (unauthorized()) {
  router.push('/login')
  gMessage.warning('请先登录')
}
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
        <div i-carbon-sun dark:i-carbon-moon />
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
  </n-scrollbar>
</template>
