<template>
  <div class="space-y-3 border-t border-slate-200 pt-3">
    <div>
      <label class="mb-2 block text-sm font-medium text-slate-700">
        选择视频 <span class="text-red-500">*</span>
      </label>
      <Select
        v-model="localVideoId"
        :options="videoOptions"
        option-label="videoLabel"
        option-value="videoId"
        placeholder="请选择视频"
        class="w-full"
        :loading="isLoading"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQueryVideosAll } from '@/features/teacher/experiment/procedure/hooks'
import { formatVideoDuration } from '@/features/teacher/experiment/procedure/utils'

interface Props {
  videoId: number | null
}

interface Emits {
  (e: 'update:videoId', value: number | null): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localVideoId = computed({
  get: () => props.videoId,
  set: (value) => emit('update:videoId', value),
})

// 查询视频列表
const { data: videosData, isLoading } = useQueryVideosAll()

// 准备视频选项数据
const videoOptions = computed(() => {
  const videos = videosData.value
  if (!videos || !Array.isArray(videos)) return []

  return videos.map((video: any) => ({
    videoId: video.id,
    videoLabel: `${video.originalFileName} (${formatVideoDuration(video.videoSeconds)})`,
  }))
})
</script>
