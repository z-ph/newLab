<template>
  <div>
    <h1 class="mb-2 text-2xl font-bold text-slate-900">概览</h1>
    <p class="mb-6 text-slate-600">欢迎使用教师管理后台</p>

    <!-- 统计卡片 -->
    <div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card v-for="stat in statistics" :key="stat.title" class="hover:shadow-lg transition-shadow">
        <template #content>
          <div class="flex items-center gap-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-full text-white" :class="stat.color">
              <i :class="stat.icon" class="text-xl" />
            </div>
            <div>
              <p class="text-sm text-slate-600">{{ stat.title }}</p>
              <p class="text-2xl font-bold text-slate-900">
                <span v-if="isLoading">...</span>
                <span v-else>{{ stat.value }}</span>
              </p>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import { useOverviewStatistics } from '@/features/teacher/overview'
// 使用 hook 获取统计数据
const { statistics, isLoading } = useOverviewStatistics()
</script>
