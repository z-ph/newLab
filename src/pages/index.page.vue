<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { UserManager } from '@/core/entity/UserManager'
import { TokenManager } from '@/core/entity/TokenManager'
import { getHomePathForRole } from '@/core/utils/routeGuards'
import type { UserRole } from '@/core/types/route'

const router = useRouter()

/**
 * 首页 - 登录后的重定向处理
 *
 * 功能：
 * 1. 检查用户登录状态
 * 2. 根据用户角色跳转到对应首页
 * 3. 未登录则跳转到登录页
 */
onMounted(() => {
  // 检查是否有 token
  if (!TokenManager.hasToken()) {
    router.replace({ name: '/login' })
    return
  }

  // 获取用户角色
  const role = UserManager.getRole() as UserRole | undefined

  if (!role) {
    // 没有角色信息，跳转到登录页
    router.replace({ name: '/login' })
    return
  }

  // 根据角色跳转到对应首页
  const homePath = getHomePathForRole(role)
  router.replace(homePath)
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <p class="text-slate-600">正在跳转...</p>
    </div>
  </div>
</template>
