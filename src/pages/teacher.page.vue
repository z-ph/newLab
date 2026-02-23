<template>
  <div class="min-h-screen bg-slate-50">
    <AppSidebar ref="sidebarRef" @width-change="handleWidthChange" />

    <div
      class="flex flex-col overflow-hidden transition-[margin] duration-200"
      :style="isMobile ? {} : { marginLeft: `${sidebarWidth}px` }"
    >
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
import { ref, onMounted } from 'vue'
import { useBreakpoints } from '@vueuse/core'
import AppSidebar from '@/features/teacher/components/AppSidebar.vue'
import AppTopbar from '@/features/teacher/components/AppTopbar.vue'
import TabBar from '@/features/teacher/components/TabBar.vue'

const breakpoints = useBreakpoints({ md: 768 })
const isMobile = breakpoints.smaller('md')

const sidebarRef = ref<InstanceType<typeof AppSidebar>>()
const sidebarWidth = ref(256)

const handleWidthChange = (width: number) => {
  sidebarWidth.value = width
}

onMounted(() => {
  const saved = localStorage.getItem('sidebar-width')
  if (saved) {
    sidebarWidth.value = parseInt(saved, 10)
  }
})
</script>

<style scoped>
/* 确保主内容区域是浅色背景 */
main {
  background-color: #f8fafc;
}
</style>
