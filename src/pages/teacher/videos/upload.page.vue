<template>
  <div class="p-1 space-y-4">
    <!-- 上传视频表单 -->
    <Card>
      <template #content>
        <div class="mb-4">
          <h1 class="text-xl font-bold text-slate-900">上传视频</h1>
        </div>
        <VideoUploadForm @success="handleSuccess" />
      </template>
    </Card>

    <!-- 视频列表 -->
    <Card>
      <template #content>
        <DataTable :value="videos" :loading="query.isLoading.value" :paginator="true" :rows="size"
          :total-records="total" :lazy="true" @page="onPageChange"
          paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          :rows-per-page-options="[10, 20, 50]"
          :pt="{ header: { class: 'px-0!' } }">
          <template #header>
            <h2 class="text-lg font-semibold text-slate-800">已有视频</h2>
          </template>
          <Column field="id" header="ID" />
          <Column header="文件名">
            <template #body="slotProps">
              <span class="truncate max-w-50 block cursor-pointer select-none"
                @click="($event) => filenamePopoverRef?.toggle($event)">
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
                <Button icon="pi pi-eye" outlined size="small" @click="handleView(slotProps.data)" />
                <Button icon="pi pi-trash" outlined severity="danger" size="small"
                  @click="handleDelete(slotProps.data)" :loading="deleteMutation.isPending.value" />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Popover from 'primevue/popover'
import VideoUploadForm from '@/features/teacher/video/components/VideoUploadForm.vue'
import { useQueryVideoPage, useDeleteVideo } from '@/features/teacher/video/hooks'
import { formatDuration, formatFileSize, truncateFileName } from '@/features/teacher/video/utils/formatters'
import { formatDateTime } from '@/features/shared/utils/formatters'
import type { VideoUploadResponse } from '@/core/api/generated'
import type { DataTablePageEvent } from 'primevue/datatable'

const router = useRouter()
const confirm = useConfirm()

const handleSuccess = () => {
  query.refetch()
}

// 视频列表数据
const { current, size, videos, total, query } = useQueryVideoPage({
  current: 1,
  size: 5,
})

const deleteMutation = useDeleteVideo()
const filenamePopoverRef = ref<InstanceType<typeof Popover>>()

const onPageChange = (event: DataTablePageEvent) => {
  current.value = event.page + 1
  size.value = event.rows
}

const handleView = (video: VideoUploadResponse) => {
  router.push({
    path: `/teacher/videos/${video.id}/detail`,
    query: { tabbarName: video.originalFileName || '视频详情' }
  })
}

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
