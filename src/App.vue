<script setup lang="ts">
</script>

<template>
  <router-view />
  <!-- 全局 Toast 组件，必须添加才能使用 useToast() -->
  <Toast />
</template>

<style>
#app {
  width: 100%;
  height: 100vh;
}
</style>
