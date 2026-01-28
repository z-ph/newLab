<template>
  <div class="h-screen w-64 bg-white border-r border-slate-200 flex flex-col">
    <!-- Logo区域 -->
    <div class="p-6 border-b border-slate-200">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500">
          <i class="pi pi-book text-xl text-white" />
        </div>
        <div>
          <h1 class="text-lg font-bold text-slate-900">广工大实验教学</h1>
          <p class="text-xs text-slate-500">教师管理后台</p>
        </div>
      </div>
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
    <div class="p-4 border-t border-slate-200">
      <div class="flex rounded-lg bg-slate-50 p-3 justify-between">
        <Avatar icon="pi pi-user" class="bg-emerald-500 text-white" shape="circle" />
        <Button
          icon="pi pi-sign-out"
          severity="secondary"
          text
          rounded
          @click="handleLogout"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import PanelMenu from 'primevue/panelmenu'
import type { MenuItem } from 'primevue/menuitem'
import { MENU_ITEMS } from '@/features/teacher/constants'
import { TokenManager } from '@/core/entity/TokenManager'
import { UserManager } from '@/core/entity/UserManager'

const route = useRoute()
const router = useRouter()
/**
 * 将自定义菜单项转换为 PrimeVue MenuItem 格式
 */
const panelMenuItems: MenuItem[] = MENU_ITEMS.map((item) => ({
  label: item.title,
  icon: item.icon,
  route: item.path,
  class:'border-0!'
}))

const handleLogout = () => {
  TokenManager.removeToken()
  UserManager.removeUserInfo()
  router.replace({ name: '/login' })
}
</script>
