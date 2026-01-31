<template>
  <Popover ref="popoverRef">
    <div class="flex flex-col gap-2 min-w-48">
      <div class="flex items-center gap-3 pb-2 border-b border-slate-200">
        <Avatar icon="pi pi-user" class="bg-emerald-500 text-white" shape="circle" size="large" />
        <div>
          <p class="font-medium text-slate-900">{{ displayName }}</p>
          <p class="text-xs text-slate-500">{{ userRole }}</p>
        </div>
      </div>
      <div class="flex flex-col gap-1 pt-1">
        <div class="flex justify-between text-sm">
          <span class="text-slate-500">用户名:</span>
          <span class="font-medium text-slate-900">{{ userInfo?.username || '-' }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-slate-500">姓名:</span>
          <span class="font-medium text-slate-900">{{ userInfo?.name || '-' }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-slate-500">用户ID:</span>
          <span class="font-medium text-slate-900">{{ userInfo?.userId || '-' }}</span>
        </div>
      </div>
    </div>
  </Popover>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Popover from 'primevue/popover'
import Avatar from 'primevue/avatar'
import { UserManager } from '@/core/entity/UserManager'

// Popover 引用
const popoverRef = ref<InstanceType<typeof Popover>>()

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

// 暴露 toggle 方法
defineExpose({
  toggle: (event: MouseEvent) => popoverRef.value?.toggle(event),
})
</script>
