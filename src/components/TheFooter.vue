<script setup lang="ts">
</script>

<template>
  <nav mt-6 inline-flex gap-2 text-xl>
    <RouterLink to="/" i-carbon-home icon-btn />

    <button icon-btn @click="toggleDark()">
      <div i-carbon-sun dark:i-carbon-moon />
    </button>

    <a
      i-carbon-logo-github icon-btn
      rel="noreferrer"
      href="https://github.com/antfu/vitesse-lite"
      target="_blank"
      title="GitHub"
    />

    <RouterLink to="/ws" i-carbon-add-comment icon-btn />
  </nav>
</template>
