<template>
  <div class="p-1">
    <!-- 筛选 -->
    <Card class="mb-4">
      <template #content>
        <VideoFilter v-model="filters" />
      </template>
    </Card>

    <!-- 视频列表 -->
    <VideoTable @view="handleView" @play="handlePlay">
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold text-slate-900">视频管理</h1>
          <Button label="上传视频" icon="pi pi-upload" @click="handleUploadClick" />
        </div>
      </template>
    </VideoTable>

    <!-- 上传视频对话框 -->
    <VideoUploadDialog ref="uploadDialogRef" :course-options="courseOptions" :experiment-options="experimentOptions"
      :is-loading="uploadMutation.isPending.value" @confirm="handleUploadConfirm" />

    <!-- 视频详情对话框 -->
    <VideoDetailDialog ref="detailDialogRef" />

    <!-- 视频播放对话框 -->
    <VideoPlayDialog ref="playDialogRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import Button from "primevue/button"

import type { VideoUploadResponse, VideoQueryRequest } from "@/core/api/generated"

import {
  VideoFilter,
  VideoTable,
  VideoUploadDialog,
  VideoDetailDialog,
  VideoPlayDialog,
} from "@/features/teacher/video"
import { useUploadVideo } from "@/features/teacher/video/hooks"

// ✅ 从 API 类型派生
type VideoFilters = Pick<VideoQueryRequest, 'originalFileName'>

// 筛选条件
const filters = ref<VideoFilters>({})

// 使用上传 mutation
const uploadMutation = useUploadVideo()

// ✅ 对话框 ref（不管理状态）
const uploadDialogRef = ref<InstanceType<typeof VideoUploadDialog>>()
const detailDialogRef = ref<InstanceType<typeof VideoDetailDialog>>()
const playDialogRef = ref<InstanceType<typeof VideoPlayDialog>>()

// 课程选项（上传表单使用）
const courseOptions = ref<Array<{ courseId: string; courseName: string }>>([])

// 实验选项（上传表单使用）
const experimentOptions = ref<Array<{ experimentId: string; experimentName: string }>>([])

// ✅ 上传按钮点击 - 通过 ref 调用
const handleUploadClick = () => {
  uploadDialogRef.value?.open()
}

// ✅ 上传确认
const handleUploadConfirm = (data: any) => {
  uploadMutation.mutate(
    {
      file: data.file!,
      title: data.title,
      description: data.description,
      courseId: data.courseId,
      experimentId: data.experimentId,
    },
    {
      onSuccess: () => {
        uploadDialogRef.value?.close()
      },
    },
  )
}

// 查看详情 - 通过 ref 调用
const handleView = (video: VideoUploadResponse) => {
  detailDialogRef.value?.open(video)
}

// 播放视频 - 通过 ref 调用
const handlePlay = (video: VideoUploadResponse) => {
  playDialogRef.value?.open(video.id!)
}
</script>
