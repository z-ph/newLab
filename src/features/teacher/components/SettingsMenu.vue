<template>
  <Menu ref="menuRef" :model="menuItems" popup>
    <template #item="{ item, props }">
      <a v-ripple class="flex items-center gap-2" v-bind="props.action">
        <i :class="item.icon" />
        <span>{{ item.label }}</span>
        <Badge v-if="item.badge" :value="item.badge" class="ml-auto" />
        <i v-if="item.shortcut" :class="item.shortcut" class="ml-auto text-xs text-slate-400" />
      </a>
    </template>
  </Menu>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Menu from 'primevue/menu'
import Badge from 'primevue/badge'
import type { MenuItem } from 'primevue/menuitem'

// 主题类型
type Theme = 'light' | 'dark' | 'auto'

// 当前主题
const currentTheme = ref<Theme>('auto')

// 从 localStorage 恢复主题
onMounted(() => {
  const saved = localStorage.getItem('theme')
  if (saved && ['light', 'dark', 'auto'].includes(saved)) {
    currentTheme.value = saved as Theme
  }
  applyTheme()
})

// 应用主题
function applyTheme() {
  const theme = currentTheme.value
  const root = document.documentElement

  if (theme === 'dark') {
    root.classList.add('dark')
  } else if (theme === 'light') {
    root.classList.remove('dark')
  } else {
    // auto: 根据系统偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }
}

// 切换主题
function setTheme(theme: Theme) {
  currentTheme.value = theme
  localStorage.setItem('theme', theme)
  applyTheme()
}

// 主题状态文本
const themeText = computed(() => {
  if (currentTheme.value === 'light') return '浅色'
  if (currentTheme.value === 'dark') return '深色'
  return '跟随系统'
})

// 菜单项
const menuItems: MenuItem[] = [
  {
    label: `主题设置 (${themeText.value})`,
    icon: 'pi pi-palette',
    items: [
      {
        label: '浅色',
        icon: 'pi pi-sun',
        command: () => setTheme('light'),
      },
      {
        label: '深色',
        icon: 'pi pi-moon',
        command: () => setTheme('dark'),
      },
      {
        label: '跟随系统',
        icon: 'pi pi-desktop',
        command: () => setTheme('auto'),
      },
    ],
  },
  {
    separator: true,
  },
  {
    label: '修改个人信息',
    icon: 'pi pi-user-edit',
    command: () => {
      // TODO: 打开修改个人信息对话框
      console.log('打开修改个人信息')
    },
  },
  {
    label: '修改密码',
    icon: 'pi pi-key',
    command: () => {
      // TODO: 打开修改密码对话框
      console.log('打开修改密码')
    },
  },
]

// 菜单引用
const menuRef = ref<InstanceType<typeof Menu>>()

// 暴露 toggle 方法
defineExpose({
  toggle: (event: MouseEvent) => menuRef.value?.toggle(event),
})
</script>
