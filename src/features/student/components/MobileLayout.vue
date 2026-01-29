<template>
  <div class="min-h-screen bg-gray-50 pb-16">
    <!-- 顶部标题栏 -->
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="px-4 py-3">
        <h1 class="text-lg font-semibold text-gray-900">{{ title }}</h1>
      </div>
    </header>

    <!-- 主内容区域 -->
    <main class="px-4 py-4">
      <slot />
    </main>

    <!-- 底部导航栏 -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
      <div class="grid grid-cols-4 gap-0">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex flex-col items-center py-2 px-1 text-center"
          :class="isActive(item.path) ? 'text-blue-600' : 'text-gray-500'"
        >
          <i :class="item.icon" class="text-xl mb-1" />
          <span class="text-xs">{{ item.label }}</span>
        </RouterLink>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

interface Props {
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '学生端',
})

const route = useRoute()

const navItems = [
  { path: '/student', icon: 'pi pi-home', label: '首页' },
  { path: '/student/classes', icon: 'pi pi-users', label: '班级' },
  { path: '/student/experiments', icon: 'pi pi-book', label: '实验' },
  { path: '/student/grades', icon: 'pi pi-chart-bar', label: '成绩' },
]

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>
