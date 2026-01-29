<template>
  <div class="p-6">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">视频管理</h1>
        <p class="text-sm text-slate-500 mt-1">管理教学视频资源库</p>
      </div>
      <Button label="上传视频" icon="pi pi-upload" @click="handleUploadClick" />
    </div>

    <!-- 筛选器 -->
    <VideoFilter v-model="filters" class="mb-6" />

    <!-- 视频列表 -->
    <VideoTable
      :videos="videos"
      :is-loading="query.isLoading.value"
      :total="total"
      :is-deleting="deleteMutation.isPending.value"
      @page="onPage"
      @view="handleView"
      @play="handlePlay"
      @delete="handleDelete"
    />

    <!-- 上传视频对话框 -->
    <VideoUploadDialog
      ref="uploadDialogRef"
      :course-options="courseOptions"
      :experiment-options="experimentOptions"
      :is-loading="uploadMutation.isPending.value"
      @confirm="handleUploadConfirm"
    />

    <!-- 视频详情对话框 -->
    <VideoDetailDialog ref="detailDialogRef" />

    <!-- 视频播放对话框 -->
    <VideoPlayDialog ref="playDialogRef" />

    <!-- 删除确认对话框 -->
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { useConfirm } from "primevue/useconfirm"
import Button from "primevue/button"
import ConfirmDialog from "primevue/confirmdialog"

import type { VideoUploadResponse, VideoQueryRequest } from "@/core/api/generated"

import {
  VideoFilter,
  VideoTable,
  VideoUploadDialog,
  VideoDetailDialog,
  VideoPlayDialog,
} from "@/features/teacher/video"
import { useQueryVideoPage, useUploadVideo, useDeleteVideo } from "@/features/teacher/video/hooks"

// ✅ 从 API 类型派生
type VideoFilters = Pick<VideoQueryRequest, 'originalFileName'>

// 筛选条件
const filters = ref<VideoFilters>({})

// 使用视频查询 hook
const { current, fileName, videos, total, query } = useQueryVideoPage({
  current: 1,
  size: 10,
})

// 使用上传 mutation
const uploadMutation = useUploadVideo()

// 使用删除 mutation
const deleteMutation = useDeleteVideo()

// ✅ 对话框 ref（不管理状态）
const uploadDialogRef = ref<InstanceType<typeof VideoUploadDialog>>()
const detailDialogRef = ref<InstanceType<typeof VideoDetailDialog>>()
const playDialogRef = ref<InstanceType<typeof VideoPlayDialog>>()

const confirm = useConfirm()

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
        query.refetch()
      },
    },
  )
}

// 分页
const onPage = (event: any) => {
  current.value = event.page + 1
}

// 查看详情 - 通过 ref 调用
const handleView = (video: VideoUploadResponse) => {
  detailDialogRef.value?.open(video)
}

// 播放视频 - 通过 ref 调用
const handlePlay = (video: VideoUploadResponse) => {
  playDialogRef.value?.open(video.id!)
}

// 删除视频
const handleDelete = (video: VideoUploadResponse) => {
  confirm.require({
    message: `确定要删除视频「${video.originalFileName}」吗？删除后将无法恢复。`,
    header: "删除确认",
    icon: "pi pi-exclamation-triangle",
    acceptLabel: "确定",
    rejectLabel: "取消",
    accept: async () => {
      await deleteMutation.mutateAsync(video.id!)
      query.refetch()
    },
  })
}

// 监听筛选条件变化
watch(
  () => filters.value.originalFileName,
  (newFileName) => {
    fileName.value = newFileName || ""
  },
)
</script>
