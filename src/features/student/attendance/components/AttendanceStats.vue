<template>
  <div>
    <div v-if="isLoading" class="flex justify-center py-8">
      <ProgressSpinner />
    </div>

    <div v-else-if="stats" class="space-y-3">
      <!-- 总签到次数 -->
      <Card>
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">总签到次数</p>
              <p class="text-2xl font-bold text-blue-600 mt-1">
                {{ stats.totalAttendance || 0 }}
              </p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i class="pi pi-calendar text-blue-600" />
            </div>
          </div>
        </template>
      </Card>

      <!-- 正常签到 -->
      <Card>
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">正常签到</p>
              <p class="text-2xl font-bold text-green-600 mt-1">
                {{ stats.normalAttendance || 0 }}
              </p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <i class="pi pi-check-circle text-green-600" />
            </div>
          </div>
        </template>
      </Card>

      <!-- 迟到次数 -->
      <Card>
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">迟到次数</p>
              <p class="text-2xl font-bold text-orange-600 mt-1">
                {{ stats.lateAttendance || 0 }}
              </p>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <i class="pi pi-clock text-orange-600" />
            </div>
          </div>
        </template>
      </Card>

      <!-- 补签次数 -->
      <Card>
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">补签次数</p>
              <p class="text-2xl font-bold text-purple-600 mt-1">
                {{ stats.makeupAttendance || 0 }}
              </p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <i class="pi pi-sync text-purple-600" />
            </div>
          </div>
        </template>
      </Card>

      <!-- 跨班签到 -->
      <Card>
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">跨班签到</p>
              <p class="text-2xl font-bold text-red-600 mt-1">
                {{ stats.crossClassAttendance || 0 }}
              </p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <i class="pi pi-external-link text-red-600" />
            </div>
          </div>
        </template>
      </Card>

      <!-- 出勤率 -->
      <Card>
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">出勤率</p>
              <p class="text-2xl font-bold text-blue-600 mt-1">
                {{ attendanceRate }}%
              </p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i class="pi pi-chart-line text-blue-600" />
            </div>
          </div>
        </template>
      </Card>
    </div>

    <div v-else class="text-center text-gray-500 p-8">
      暂无统计数据
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQueryAttendanceStats } from '../hooks'

const { stats, query } = useQueryAttendanceStats()
const isLoading = query.isLoading

const attendanceRate = computed(() => {
  if (!stats.value || !stats.value.totalAttendance) return '0'
  const normal = stats.value.normalAttendance ?? 0
  const rate = (normal / stats.value.totalAttendance) * 100
  return rate.toFixed(1)
})
</script>
