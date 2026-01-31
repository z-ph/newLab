<template>
  <div class="p-4 border-t border-slate-200">
    <div class="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
      <!-- 用户头像和名称区域：点击触发 Popover -->
      <div
        class="flex items-center gap-3 flex-1 min-w-0 cursor-pointer hover:bg-slate-100 rounded-lg p-1 -m-1 transition-colors"
        @click="($event) => popoverRef?.toggle($event)"
      >
        <Avatar icon="pi pi-user" class="bg-emerald-500 text-white" shape="circle" />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-slate-900 truncate">{{ displayName }}</p>
          <p class="text-xs text-slate-500 truncate">{{ userRole }}</p>
        </div>
      </div>
      <Button
        icon="pi pi-sign-out"
        severity="secondary"
        text
        rounded
        @click="handleLogout"
      />
    </div>

    <UserInfoPopover ref="popoverRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import { UserManager } from '@/core/entity/UserManager'
import { TokenManager } from '@/core/entity/TokenManager'
import UserInfoPopover from './UserInfoPopover.vue'

interface Emits {
  (e: 'logout'): void
}

const emit = defineEmits<Emits>()
const router = useRouter()

// Popover 引用
const popoverRef = ref<InstanceType<typeof UserInfoPopover>>()

// 获取用户信息
const userInfo = computed(() => UserManager.getUserInfo())

// 显示名称：优先显示 name，如果没有则显示 username
const displayName = computed(() => {
  return userInfo.value?.name || userInfo.value?.username || '未登录'
})

// 用户角色
const userRole = computed(() => {
  const role = userInfo.value?.role
  if (role === 'teacher') return '教师'
  if (role === 'student') return '学生'
  return ''
})

const handleLogout = () => {
  TokenManager.removeToken()
  UserManager.removeUserInfo()
  emit('logout')
  router.replace({ name: '/login' })
}
</script>
