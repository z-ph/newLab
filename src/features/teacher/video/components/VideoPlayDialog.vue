<template>
  <Dialog v-model:visible="visible" header="播放视频" modal>
    <div class="aspect-video bg-black">
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
    <template #footer>
      <Button label="关闭" severity="secondary" @click="close" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

import { useQueryVideoPlayKey } from '@/features/teacher/video/hooks'
import { baseURL } from '@/core/api/config'

// ✅ 状态封装在组件内部
const visible = ref(false)
const videoId = ref<number | undefined>(undefined)

// ✅ 使用 hook 获取播放密钥
const { data: playKey, isLoading: isLoadingKey } = useQueryVideoPlayKey(videoId)

// 使用 playKey 构建播放 URL
const playUrl = computed(() => {
  if (!videoId.value) return null

  // ✅ 优先使用查询到的 playKey
  if (playKey.value) {
    return `${baseURL}${playKey.value}`
  }

  // 如果正在加载密钥，暂时返回 null
  if (isLoadingKey.value) {
    return null
  }
  throw new Error('无法获取视频播放密钥')
})

// ✅ 打开对话框 - 只需要 videoId
function open(id: number) {
  videoId.value = id
  visible.value = true
}

// ✅ 关闭对话框
function close() {
  visible.value = false
  videoId.value = undefined
}

const handleVideoError = (event: Event) => {
  console.error('视频播放失败:', event)
}

// ✅ 暴露方法，不暴露状态
defineExpose({
  open,
  close,
})
</script>
