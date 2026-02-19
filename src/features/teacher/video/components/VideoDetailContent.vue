<template>
  <div v-if="video" class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">视频 ID</label>
        <p class="text-sm text-slate-900">{{ video.id }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">文件名</label>
        <p class="text-sm text-slate-900">{{ video.originalFileName }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">文件大小</label>
        <p class="text-sm text-slate-900">{{ video.fileSizeHumanReadable }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">视频时长</label>
        <p class="text-sm text-slate-900">{{ formatDuration(video.videoSeconds) }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">上传时间</label>
        <p class="text-sm text-slate-900">{{ formatDateTime(video.uploadTime) }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">存储路径</label>
        <p class="text-xs text-slate-500 truncate">{{ video.storedFileName }}</p>
      </div>
    </div>
  </div>
  <div v-else-if="!isLoading" class="text-center text-slate-500 py-8">
    视频不存在
  </div>
</template>

<script setup lang="ts">
import { formatDuration } from '../utils/formatters'
import { formatDateTime } from '@/features/shared/utils/formatters'
import type { VideoUploadResponse } from '@/core/api/generated'

defineProps<{
  video?: VideoUploadResponse
  isLoading?: boolean
}>()
</script>
