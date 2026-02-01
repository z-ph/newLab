<template>
  <Dialog v-model:visible="visible" header="视频详情" modal :style="{ maxWidth: '100vw' }">
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
    <template #footer>
      <Button label="关闭" severity="secondary" @click="close" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

import type { VideoUploadResponse } from '@/core/api/generated'
import { formatDuration } from '../utils/formatters'
import { formatDateTime } from '@/features/shared/utils'

// ✅ 状态封装在组件内部
const visible = ref(false)
const video = ref<VideoUploadResponse>()

// ✅ 打开对话框
function open(data: VideoUploadResponse) {
  video.value = data
  visible.value = true
}

// ✅ 关闭对话框
function close() {
  visible.value = false
}

// ✅ 暴露方法，不暴露状态
defineExpose({
  open,
  close,
})
</script>
