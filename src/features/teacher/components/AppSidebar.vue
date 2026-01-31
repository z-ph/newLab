<template>
  <!-- ==================== 桌面端/平板：固定侧边栏 ==================== -->
  <div
    v-if="!isMobile"
    class="h-screen bg-white border-r border-slate-200 flex flex-col relative"
    :style="sidebarStyle"
  >
    <!-- Logo区域 -->
    <div class="p-6 border-b border-slate-200">
      <div class="flex items-center gap-3">
        <img src="/gdut.png" alt="广工大校徽" class="h-10 w-10 flex-shrink-0" />
        <div class="min-w-0 flex-1">
          <h1 class="text-lg font-bold text-slate-900 truncate">广工大实验教学</h1>
          <p class="text-xs text-slate-500 truncate">教师管理后台</p>
        </div>
      </div>
    </div>

    <!-- 菜单区域 -->
    <div class="flex-1 overflow-y-auto">
      <PanelMenu :model="panelMenuItems" class="gap-0!">
        <template #item="{ item, props }">
          <router-link
            v-if="item.route"
            v-ripple
            :to="item.route"
            v-bind="props.action"
            class="flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition-colors"
            :class="route.path === item.route ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'text-slate-700 hover:bg-slate-100'"
          >
            <i :class="item.icon" class="text-lg" />
            <span>{{ item.label }}</span>
          </router-link>
        </template>
      </PanelMenu>
    </div>

    <!-- 底部用户信息 -->
    <UserInfo @logout="handleLogout" />

    <!-- 拖拽手柄（桌面端和平板） -->
    <div
      v-if="!isMobile"
      class="sidebar-resize-handle absolute right-0 top-0 bottom-0 w-1 -mr-1 cursor-col-resize bg-slate-200 hover:bg-emerald-500 transition-colors z-10"
      :class="{ 'bg-emerald-500': isResizing }"
      @mousedown="startResize"
      title="拖动调整侧边栏宽度"
    />
  </div>

  <!-- ==================== 移动端：抽屉 ==================== -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-transform duration-300 ease-in-out"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-300 ease-in-out"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <div
        v-if="isMobile && isDrawerOpen"
        class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl flex flex-col"
      >
        <!-- Logo区域 -->
        <div class="p-6 border-b border-slate-200 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0 flex-1">
            <img src="/gdut.png" alt="广工大校徽" class="h-10 w-10 flex-shrink-0" />
            <div class="min-w-0 flex-1">
              <h1 class="text-lg font-bold text-slate-900 truncate">广工大实验教学</h1>
              <p class="text-xs text-slate-500 truncate">教师管理后台</p>
            </div>
          </div>
          <Button
            icon="pi pi-times"
            text
            rounded
            @click="closeDrawer"
            class="flex-shrink-0"
          />
        </div>

        <!-- 菜单区域 -->
        <div class="flex-1 overflow-y-auto p-4">
          <PanelMenu :model="panelMenuItems" class="gap-0!">
            <template #item="{ item, props }">
              <router-link
                v-if="item.route"
                v-ripple
                :to="item.route"
                v-bind="props.action"
                class="flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition-colors"
                :class="route.path === item.route ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'text-slate-700 hover:bg-slate-100'"
              >
                <i :class="item.icon" class="text-lg" />
                <span>{{ item.label }}</span>
              </router-link>
            </template>
          </PanelMenu>
        </div>

        <!-- 底部用户信息 -->
        <UserInfo @logout="handleLogoutAndCloseDrawer" />
      </div>
    </Transition>

    <!-- 遮罩层 -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isMobile && isDrawerOpen"
        class="fixed inset-0 bg-black/50 z-40"
        @click="closeDrawer"
      />
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useBreakpoints } from '@vueuse/core'
import { useRoute } from 'vue-router'
import Button from 'primevue/button'
import PanelMenu from 'primevue/panelmenu'
import type { MenuItem } from 'primevue/menuitem'
import { MENU_ITEMS } from '@/features/teacher/constants'
import UserInfo from './UserInfo.vue'

// ==================== 断点检测 ====================
const breakpoints = useBreakpoints({
  md: 768,
  lg: 1024,
})

const isMobile = breakpoints.smaller('md')  // < 768px

// ==================== 桌面端：可调节宽度 ====================
const MIN_WIDTH = 200
const MAX_WIDTH = 400
const DEFAULT_WIDTH = 256

const sidebarWidth = ref(DEFAULT_WIDTH)
const isResizing = ref(false)

// 从 localStorage 恢复宽度（桌面端和平板）
onMounted(() => {
  if (!isMobile.value) {
    const saved = localStorage.getItem('sidebar-width')
    if (saved) {
      const width = parseInt(saved, 10)
      if (width >= MIN_WIDTH && width <= MAX_WIDTH) {
        sidebarWidth.value = width
      }
    }
  }
})

// 持久化宽度（桌面端和平板）
watch(sidebarWidth, (newWidth) => {
  if (!isMobile.value) {
    localStorage.setItem('sidebar-width', String(newWidth))
  }
})

// 拖拽逻辑
function startResize(_e: MouseEvent) {
  if (isMobile.value) return  // 移动端禁用拖拽
  isResizing.value = true
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
}

function handleResize(e: MouseEvent) {
  if (!isResizing.value) return

  const newWidth = e.clientX
  if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
    sidebarWidth.value = newWidth
  }
}

function stopResize() {
  isResizing.value = false
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
}

// ==================== 移动端：Drawer 状态 ====================
const isDrawerOpen = ref(false)

function toggleDrawer() {
  isDrawerOpen.value = !isDrawerOpen.value
}

function closeDrawer() {
  isDrawerOpen.value = false
}

// ==================== 路由相关 ====================
const route = useRoute()

/**
 * 将自定义菜单项转换为 PrimeVue MenuItem 格式
 */
const panelMenuItems: MenuItem[] = MENU_ITEMS.map((item) => ({
  label: item.title,
  icon: item.icon,
  route: item.path,
  class:'border-0!',
}))

const handleLogout = () => {
  // 桌面端登出，无需额外操作
}

const handleLogoutAndCloseDrawer = () => {
  closeDrawer()
}

// ==================== 计算样式 ====================
const sidebarStyle = computed(() => {
  if (isMobile.value) {
    return {}  // 移动端：不适用（抽屉模式）
  } else {
    return { width: `${sidebarWidth.value}px` }  // 桌面/平板：可调节宽度
  }
})

// ==================== 暴露方法给父组件 ====================
defineExpose({
  toggleDrawer,
  closeDrawer,
})
</script>

<style scoped>
/* 防止拖拽时选中文字 */
.sidebar-resize-handle {
  user-select: none;
}
</style>
