<template>
  <div class="p-1">
    <!-- 上传视频表单 -->
    <VideoUploadForm @success="handleSuccess" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import VideoUploadForm from '@/features/teacher/video/components/VideoUploadForm.vue'

const router = useRouter()

const handleSuccess = () => {
  router.push('/teacher/videos/list')
}
</script>
