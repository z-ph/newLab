<template>
  <!-- ==================== 桌面端/平板：固定侧边栏 ==================== -->
  <div
    v-if="!isMobile"
    class="fixed left-0 top-0 h-screen bg-white border-r border-slate-200 flex flex-col z-30"
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
      <div class="flex flex-col gap-1 p-2">
        <template v-for="item in MENU_ITEMS" :key="item.path">
          <!-- 有子菜单：可展开的一级菜单 -->
          <div v-if="item.children" class="menu-group">
            <div
              @click="toggleSubmenu(item.name)"
              class="flex items-center gap-3 rounded-lg px-4 py-3 font-medium cursor-pointer transition-colors select-none"
              :class="route.path.startsWith(item.path) ? 'bg-emerald-500 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <i :class="item.icon" class="text-lg" />
              <span class="flex-1">{{ item.title }}</span>
              <i
                class="pi pi-chevron-down text-sm transition-transform duration-200"
                :class="{ 'rotate-180': isMenuExpanded(item.name) }"
              />
            </div>
            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0 -translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition-all duration-150 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-2"
            >
              <div v-show="isMenuExpanded(item.name)" class="ml-4 mt-1 space-y-1">
                <div
                  v-for="child in item.children"
                  :key="child.path"
                  @click="handleSubmenuClick(child.path, child.title)"
                  class="flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium cursor-pointer transition-colors"
                  :class="route.path === child.path ? 'bg-emerald-500 text-white' : 'text-slate-600 hover:bg-slate-100'"
                >
                  <i :class="child.icon" class="text-base" />
                  <span>{{ child.title }}</span>
                </div>
              </div>
            </Transition>
          </div>

          <!-- 无子菜单：保持原样 -->
          <router-link
            v-else
            v-ripple
            :to="item.path"
            class="flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition-colors"
            :class="route.path === item.path ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'text-slate-700 hover:bg-slate-100'"
          >
            <i :class="item.icon" class="text-lg" />
            <span>{{ item.title }}</span>
          </router-link>
        </template>
      </div>
    </div>

    <!-- 底部用户信息 -->
    <UserInfo @logout="handleLogout" />

    <!-- 拖拽手柄（桌面端和平板） -->
    <div
      v-if="!isMobile"
      class="absolute right-0 top-0 bottom-0 w-1 -mr-1 cursor-col-resize bg-slate-200 hover:bg-emerald-500 transition-colors z-10 select-none"
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

        <!-- 菜单区��� -->
        <div class="flex-1 overflow-y-auto p-2">
          <div class="flex flex-col gap-1">
            <template v-for="item in MENU_ITEMS" :key="item.path">
              <!-- 有子菜单：可展开的一级菜单 -->
              <div v-if="item.children" class="menu-group">
                <div
                  @click="toggleSubmenu(item.name)"
                  class="flex items-center gap-3 rounded-lg px-4 py-3 font-medium cursor-pointer transition-colors select-none"
                  :class="route.path.startsWith(item.path) ? 'bg-emerald-500 text-white' : 'text-slate-700 hover:bg-slate-100'"
                >
                  <i :class="item.icon" class="text-lg" />
                  <span class="flex-1">{{ item.title }}</span>
                  <i
                    class="pi pi-chevron-down text-sm transition-transform duration-200"
                    :class="{ 'rotate-180': isMenuExpanded(item.name) }"
                  />
                </div>
                <Transition
                  enter-active-class="transition-all duration-200 ease-out"
                  enter-from-class="opacity-0 -translate-y-2"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition-all duration-150 ease-in"
                  leave-from-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 -translate-y-2"
                >
                  <div v-show="isMenuExpanded(item.name)" class="ml-4 mt-1 space-y-1">
                    <div
                      v-for="child in item.children"
                      :key="child.path"
                      @click="handleSubmenuClick(child.path, child.title)"
                      class="flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium cursor-pointer transition-colors"
                      :class="route.path === child.path ? 'bg-emerald-500 text-white' : 'text-slate-600 hover:bg-slate-100'"
                    >
                      <i :class="child.icon" class="text-base" />
                      <span>{{ child.title }}</span>
                    </div>
                  </div>
                </Transition>
              </div>

              <!-- 无子菜单：保持原样 -->
              <router-link
                v-else
                v-ripple
                :to="item.path"
                @click="closeDrawer"
                class="flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition-colors"
                :class="route.path === item.path ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'text-slate-700 hover:bg-slate-100'"
              >
                <i :class="item.icon" class="text-lg" />
                <span>{{ item.title }}</span>
              </router-link>
            </template>
          </div>
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
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import { MENU_ITEMS } from '@/features/teacher/constants'
import UserInfo from './UserInfo.vue'

// ==================== Emits ====================
interface Emits {
  (e: 'widthChange', width: number): void
}

const emit = defineEmits<Emits>()

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
        emit('widthChange', width)
      }
    } else {
      emit('widthChange', DEFAULT_WIDTH)
    }
  }
})

// 持久化宽度（桌面端和平板）
watch(sidebarWidth, (newWidth) => {
  if (!isMobile.value) {
    localStorage.setItem('sidebar-width', String(newWidth))
    emit('widthChange', newWidth)
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
const router = useRouter()

// 二级菜单展开状态管理
const expandedMenus = ref<Set<string>>(new Set())

/**
 * 切换二级菜单展开/折叠
 */
function toggleSubmenu(name: string) {
  if (expandedMenus.value.has(name)) {
    expandedMenus.value.delete(name)
  } else {
    expandedMenus.value.add(name)
  }
  // 触发响应式更新
  expandedMenus.value = new Set(expandedMenus.value)
}

/**
 * 判断菜单是否展开
 */
function isMenuExpanded(name: string): boolean {
  return expandedMenus.value.has(name)
}

/**
 * 处理二级菜单点击
 */
async function handleSubmenuClick(path: string, _title: string) {
  await router.push(path)
  // 移动端点击后关闭抽屉
  if (isMobile.value) {
    closeDrawer()
  }
}

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
