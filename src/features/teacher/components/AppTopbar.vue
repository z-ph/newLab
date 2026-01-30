<template>
  <div class="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
    <div class="flex items-center gap-4">
      <!-- 汉堡菜单按钮（仅移动端显示） -->
      <Button
        icon="pi pi-bars"
        severity="secondary"
        text
        rounded
        class="md:hidden"
        @click="emit('toggle-drawer')"
      />

      <h2 class="text-xl font-semibold text-slate-900">{{ pageTitle }}</h2>
    </div>

    <div class="flex items-center gap-2">
      <Button icon="pi pi-bell" severity="secondary" text rounded />
      <Button icon="pi pi-cog" severity="secondary" text rounded />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { RouteNamedMap } from 'vue-router/auto-routes'
import Button from 'primevue/button'
import { MENU_ITEMS } from '@/features/teacher/constants'

const route = useRoute()

/**
 * 获取当前页面的标题
 *
 * 使用路由名称进行��型安全的匹配，而不是路径字符串比较
 * route.name 是从 RouteNamedMap 派生的类型安全值
 */
const pageTitle = computed(() => {
  // 将路由名称转换为字符串进行比较
  const currentRouteName = route.name as keyof RouteNamedMap | undefined

  // 在菜单项中查找匹配的路由
  const matched = MENU_ITEMS.find((item) => {
    // item.path 的类型是 TeacherRoutePath（从 RouteNamedMap 派生）
    // 将其视为路由名称进行比较
    const itemRouteName = item.path as keyof RouteNamedMap
    return currentRouteName === itemRouteName
  })

  return matched?.title || '教师管理后台'
})

const emit = defineEmits<{
  'toggle-drawer': []
}>()
</script>
