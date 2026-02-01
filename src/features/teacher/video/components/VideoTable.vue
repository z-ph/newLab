<template>
  <Card>
    <template #content>
      <DataTable
        :value="videos"
        :loading="query.isLoading.value"
        :paginator="true"
        :rows="size"
        :total-records="total"
        :lazy="true"
        @page="onPageChange"
        striped-rows
        :empty-message="'暂无视频数据'"
        :pt="{ header: { class: 'px-0!' } }"
      >
        <template #header>
          <slot name="header" />
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
              <Button icon="pi pi-eye" outlined size="small" v-tooltip="'查看详情'"
                @click="emit('view', slotProps.data)" />
              <Button icon="pi pi-play" outlined size="small" v-tooltip="'播放视频'"
                @click="emit('play', slotProps.data)" />
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
import { ref } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import Popover from 'primevue/popover'

import type { VideoUploadResponse } from '@/core/api/generated'
import { formatDuration, formatFileSize, truncateFileName } from '../utils/formatters'
import { formatDateTime } from '@/features/shared/utils'
import { useQueryVideoPage, useDeleteVideo } from '../hooks'

interface Emits {
  (e: 'page', event: any): void
  (e: 'view', video: VideoUploadResponse): void
  (e: 'play', video: VideoUploadResponse): void
}

const emit = defineEmits<Emits>()

// ✅ 表格内部调用 hook 获取数据
const { current, size, videos, total, query } = useQueryVideoPage({
  current: 1,
  size: 10,
})

// ✅ 表格内部调用 mutation
const deleteMutation = useDeleteVideo()
const confirm = useConfirm()

// 文件名 Popover
const filenamePopoverRef = ref<InstanceType<typeof Popover>>()

// 分页处理
const onPageChange = (event: any) => {
  current.value = event.page + 1
  emit('page', event)
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
