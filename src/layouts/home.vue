<template>
  <div class="contain">
    <RouterView />
    <div mx-auto mt-5 text-center text-sm opacity-50>
      [Home Layout]
    </div>
  </div>
</template>

<style scoped>
.contain {
  height: 100%;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
