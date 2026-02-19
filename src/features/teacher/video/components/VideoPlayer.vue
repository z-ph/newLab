<template>
  <div class="video-player aspect-video bg-black rounded-lg overflow-hidden">
    <video
      v-if="playUrl"
      :src="playUrl"
      controls
      class="w-full h-full"
      @error="handleVideoError"
    >
      您的浏览器不支持视频播放
    </video>
    <div v-else class="flex items-center justify-center h-full text-white">
      <span v-if="isLoadingKey">正在加载视频...</span>
      <span v-else>无视频源</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQueryVideoPlayKey } from '@/features/teacher/video/hooks'
import { baseURL } from '@/core/api/config'

interface Props {
  videoId?: number
}

const props = defineProps<Props>()

// ✅ 使用 hook 获取播放密钥
const { data: playKey, isLoading: isLoadingKey } = useQueryVideoPlayKey(
  computed(() => props.videoId)
)

// 使用 playKey 构建播放 URL
const playUrl = computed(() => {
  if (!props.videoId) return null

  // ✅ 优先使用查询到的 playKey
  if (playKey.value) {
    return `${baseURL}${playKey.value}`
  }

  // 如果正在加载密钥，暂时返回 null
  if (isLoadingKey.value) {
    return null
  }
  return null
})

const handleVideoError = (event: Event) => {
  console.error('视频播放失败:', event)
}
</script>
