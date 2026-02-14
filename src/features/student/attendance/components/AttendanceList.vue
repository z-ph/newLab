<template>
  <div>
    <div v-if="query.isLoading.value" class="flex justify-center py-8">
      <ProgressSpinner />
    </div>

    <div v-else-if="records && records.length > 0" class="space-y-3">
      <Card
        v-for="record in records"
        :key="record.id"
        class="active:scale-[0.98] transition-transform"
      >
        <template #content>
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="text-sm text-gray-900">
                {{ record.courseId }}
              </p>
              <p v-if="record.experimentId" class="text-xs text-gray-500 mt-1">
                {{ record.experimentId }}
              </p>
              <div class="flex items-center gap-3 mt-2">
                <span class="text-xs text-gray-500">
                  <i class="pi pi-clock mr-1" />
                  {{ formatDateTime(record.attendanceTime) }}
                </span>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <div v-else class="text-center py-12">
      <i class="pi pi-calendar-times text-4xl text-gray-300 mb-3" />
      <p class="text-sm text-gray-500">暂无签到记录</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQueryAttendanceRecords } from '../hooks'
import { formatDateTime } from '@/features/shared/utils/formatters'

const { records, query } = useQueryAttendanceRecords()
</script>
