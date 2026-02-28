<template>
  <MobileLayout title="我的">
    <div class="space-y-4">
      <!-- 用户信息卡片 -->
      <Card>
        <template #content>
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <i class="pi pi-user text-white text-2xl" />
            </div>
            <div class="flex-1">
              <h2 class="text-lg font-semibold text-gray-900">学生</h2>
              <p class="text-sm text-gray-500 mt-0.5">学号</p>
            </div>
          </div>
        </template>
      </Card>

      <!-- 功能菜单 -->
      <Card>
        <template #content>
          <div class="space-y-1">
            <div
              class="flex items-center justify-between py-3 px-2 cursor-pointer active:bg-gray-50 rounded"
              @click="handleMenuClick('grades')"
            >
              <div class="flex items-center gap-3">
                <i class="pi pi-chart-bar text-purple-600" />
                <span class="text-sm text-gray-900">我的成绩</span>
              </div>
              <i class="pi pi-chevron-right text-gray-400 text-sm" />
            </div>

            <Divider />

            <div
              class="flex items-center justify-between py-3 px-2 cursor-pointer active:bg-gray-50 rounded"
              @click="handleMenuClick('attendance')"
            >
              <div class="flex items-center gap-3">
                <i class="pi pi-clock text-orange-600" />
                <span class="text-sm text-gray-900">考勤记录</span>
              </div>
              <i class="pi pi-chevron-right text-gray-400 text-sm" />
            </div>

            <Divider />
          </div>
        </template>
      </Card>

      <!-- 设置菜单 -->
      <Card>
        <template #content>
          <div class="space-y-1">
            <div
              class="flex items-center justify-between py-3 px-2 cursor-pointer active:bg-gray-50 rounded"
              @click="handleMenuClick('settings')"
            >
              <div class="flex items-center gap-3">
                <i class="pi pi-cog text-gray-600" />
                <span class="text-sm text-gray-900">设置</span>
              </div>
              <i class="pi pi-chevron-right text-gray-400 text-sm" />
            </div>

            <Divider />

            <div
              class="flex items-center justify-between py-3 px-2 cursor-pointer active:bg-gray-50 rounded"
              @click="handleMenuClick('about')"
            >
              <div class="flex items-center gap-3">
                <i class="pi pi-info-circle text-gray-600" />
                <span class="text-sm text-gray-900">关于</span>
              </div>
              <i class="pi pi-chevron-right text-gray-400 text-sm" />
            </div>
          </div>
        </template>
      </Card>

      <!-- 退出登录 -->
      <Button
        label="退出登录"
        severity="danger"
        outlined
        class="w-full"
        @click="handleLogout"
      />
    </div>
  </MobileLayout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import MobileLayout from '@/features/student/components/MobileLayout.vue'
import { toast } from '@/core/utils/toast'

const router = useRouter()

const handleMenuClick = (menu: string) => {
  switch (menu) {
    case 'grades':
      router.push('/student/grades')
      break
    case 'attendance':
      router.push('/student/attendance')
      break
    case 'settings':
      toast.warn('设置功能开发中')
      break
    case 'about':
      router.push('/student/about')
      break
  }
}

const handleLogout = () => {
  // TODO: 调用登出 API
  toast.success('已退出登录')
  router.push('/login')
}
</script>
