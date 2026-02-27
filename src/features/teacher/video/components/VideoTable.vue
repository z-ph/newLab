<template>
  <Card class="mb-4">
    <template #content>
      <VideoFilter v-model="filters" />
    </template>
  </Card>
  <Card>
    <template #content>
      <DataTable :value="videos" :loading="query.isLoading.value" :paginator="true" :rows="size" :total-records="total"
        lazy
        paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rows-per-page-options="[10, 20, 50]"
        current-page-report-template="显示 {first} 到 {last} 共 {totalRecords} 条"
        @page="onPageChange" striped-rows :empty-message="'暂无视频数据'" :pt="{ header: { class: 'px-0!' } }">
        <template #header>
          <div class="flex items-center justify-between">
            <h1 class="text-xl font-bold text-slate-900">视频管理</h1>
            <Button label="上传视频" icon="pi pi-upload" @click="handleUploadClick" />
          </div>
        </template>

        <Column field="id" header="ID" />
        <Column header="文件名">
          <template #body="slotProps">
            <span @click="($event) => filenamePopoverRef?.toggle($event)"
              class="truncate max-w-50 block cursor-pointer select-none">
              {{ truncateFileName(slotProps.data.originalFileName, 10) }}
            </span>
            <Popover ref="filenamePopoverRef">
              <span class="break-all max-w-xs">{{ slotProps.data.originalFileName }}</span>
            </Popover>
          </template>
        </Column>
        <Column header="文件大小">
          <template #body="slotProps">
            {{ slotProps.data.fileSizeHumanReadable || formatFileSize(slotProps.data.fileSize) }}
          </template>
        </Column>
        <Column header="视频时长">
          <template #body="slotProps">
            {{ formatDuration(slotProps.data.videoSeconds) }}
          </template>
        </Column>
        <Column header="上传时间">
          <template #body="slotProps">
            {{ formatDateTime(slotProps.data.uploadTime) }}
          </template>
        </Column>
        <Column header="操作">
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button icon="pi pi-eye" outlined size="small" v-tooltip="'查看详情/播放'" @click="handleView(slotProps.data)" />
              <Button icon="pi pi-trash" outlined severity="danger" size="small" v-tooltip="'删除'"
                @click="handleDelete(slotProps.data)" :loading="deleteMutation.isPending.value" />
            </div>
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import Popover from 'primevue/popover'

import { VideoFilter } from '@/features/teacher/video'
import { formatDuration, formatFileSize, truncateFileName } from '../utils/formatters'
import { formatDateTime } from '@/features/shared/utils/formatters'
import { useQueryVideoPage, useDeleteVideo } from '../hooks'

import type { VideoUploadResponse, VideoQueryRequest } from "@/core/api/generated"

// ✅ 从 API 类型派生
type VideoFilters = Pick<VideoQueryRequest, 'originalFileName'>

// 筛选条件
const filters = ref<VideoFilters>({})

// 路由
const router = useRouter()

// ✅ 上传按钮点击 - 导航到上传页面
const handleUploadClick = () => {
  router.push('/teacher/videos/upload')
}

// 查看详情 - 导航到详情页面
const handleView = (video: VideoUploadResponse) => {
  router.push({
    path: `/teacher/videos/${video.id}/detail`,
    query: { title: encodeURIComponent(video.originalFileName || '视频详情') }
  })
}

// ✅ 表格内部调用 hook 获取数据
const { current, size, fileName, videos, total, query } = useQueryVideoPage({
  current: 1,
  size: 10,
})

// ✅ 监听筛选条件变化，同步到 hook 的 fileName
watch(
  () => filters.value.originalFileName,
  (newFileName) => {
    fileName.value = newFileName || ''
    current.value = 1 // 重置到第一页
  }
)

// ✅ 表格内部调用 mutation
const deleteMutation = useDeleteVideo()
const confirm = useConfirm()

// 文件名 Popover
const filenamePopoverRef = ref<InstanceType<typeof Popover>>()

// 分页处理
const onPageChange = (event: any) => {
  current.value = event.page + 1
  size.value = event.rows
}

// 删除处理
const handleDelete = (video: VideoUploadResponse) => {
  confirm.require({
    message: `确定要删除视频「${video.originalFileName}」吗？删除后将无法恢复。`,
    header: '删除确认',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: '确定',
    rejectLabel: '取消',
    accept: async () => {
      await deleteMutation.mutateAsync(video.id!)
      query.refetch()
    },
  })
}
</script>
