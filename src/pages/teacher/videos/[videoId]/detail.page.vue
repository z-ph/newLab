<template>
  <div class="p-1">
    <Card v-if="video">
      <template #content>
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-xl font-bold text-slate-900">{{ pageTitle }}</h1>
          <Button label="返回" icon="pi pi-arrow-left" severity="secondary" @click="handleBack" />
        </div>
        <VideoDetailContent :video="video" :isLoading="isLoading" />
      </template>
    </Card>
    <Card v-else-if="!isLoading">
      <template #content>
        <div class="text-center text-slate-500 py-8">视频不存在</div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Button from 'primevue/button'
import Card from 'primevue/card'
import VideoDetailContent from '@/features/teacher/video/components/VideoDetailContent.vue'
import { useQueryVideoDetail } from '@/features/teacher/video/hooks'

const router = useRouter()
const route = useRoute()

// 类型守卫函数：安全访问 route params
function getVideoId(): string {
  const params = route.params as Record<string, string>
  return params.videoId || ''
}

const videoIdValue = computed(getVideoId)

// 从 query 获取标题参数
const pageTitle = computed(() => {
  const title = route.query.tabbarName as string
  return title ? decodeURIComponent(title) : '视频详情'
})

const { video, query } = useQueryVideoDetail(videoIdValue)
const isLoading = computed(() => query.isLoading.value)

// 返回处理
const handleBack = () => {
  router.back()
}
</script>
