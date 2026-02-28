<template>
  <MobileLayout title="关于">
    <div class="space-y-4">
      <!-- 应用信息 -->
      <Card>
        <template #content>
          <div class="text-center py-4">
            <div class="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i class="pi pi-flask text-white text-3xl" />
            </div>
            <h1 class="text-xl font-semibold text-gray-900">实验室管理系统</h1>
            <p class="text-sm text-gray-500 mt-1">学生端</p>
            <p class="text-sm text-gray-400 mt-2">版本 {{ APP_VERSION }}</p>
          </div>
        </template>
      </Card>

      <!-- 更新日志 -->
      <Card>
        <template #title>
          <div class="flex items-center gap-2">
            <i class="pi pi-history text-gray-600" />
            <span>更新日志</span>
          </div>
        </template>
        <template #content>
          <div class="space-y-4">
            <div
              v-for="(logs, version) in CHANGELOG"
              :key="version"
              class="space-y-2"
            >
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                  v{{ version }}
                </span>
              </div>
              <ul class="space-y-1 pl-2">
                <li
                  v-for="(log, index) in logs"
                  :key="index"
                  class="text-sm text-gray-600 flex items-start gap-2"
                >
                  <span class="text-gray-400 mt-1">•</span>
                  <span>{{ log }}</span>
                </li>
              </ul>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </MobileLayout>
</template>

<script setup lang="ts">
import MobileLayout from '@/features/student/components/MobileLayout.vue'
import { APP_VERSION, CHANGELOG } from '@/constants'
</script>
