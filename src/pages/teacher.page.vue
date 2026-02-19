<template>
  <div class="flex min-h-screen bg-slate-50">
    <AppSidebar ref="sidebarRef" />

    <div class="flex-1 flex flex-col overflow-hidden">
      <AppTopbar @toggle-drawer="sidebarRef?.toggleDrawer()" />

      <!-- 标签页导航 -->
      <TabBar />

      <main class="flex-1 overflow-y-auto p-2">
        <router-view v-slot="{ Component, route }">
          <keep-alive :max="10">
            <component :is="Component" :key="route.fullPath" />
          </keep-alive>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from '@/features/teacher/components/AppSidebar.vue'
import AppTopbar from '@/features/teacher/components/AppTopbar.vue'
import TabBar from '@/features/teacher/components/TabBar.vue'

const sidebarRef = ref<InstanceType<typeof AppSidebar>>()
</script>

<style scoped>
/* 确保主内容区域是浅色背景 */
main {
  background-color: #f8fafc;
}
</style>
