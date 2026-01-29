<template>
  <Card>
    <template #content>
      <DataTable
        :value="videos"
        :loading="isLoading"
        :paginator="true"
        :rows="rows"
        :total-records="total"
        :lazy="true"
        @page="$emit('page', $event)"
        striped-rows
        :empty-message="'暂无视频数据'"
      >
        <Column field="id" header="ID" style="width: 80px" />
        <Column field="originalFileName" header="文件名" class="min-w-[200px]" />
        <Column header="文件大小" style="width: 120px">
          <template #body="slotProps">
            {{ slotProps.data.fileSizeHumanReadable || formatFileSize(slotProps.data.fileSize) }}
          </template>
        </Column>
        <Column header="视频时长" style="width: 120px">
          <template #body="slotProps">
            {{ formatDuration(slotProps.data.videoSeconds) }}
          </template>
        </Column>
        <Column header="上传时间" style="width: 180px">
          <template #body="slotProps">
            {{ formatDateTime(slotProps.data.uploadTime) }}
          </template>
        </Column>
        <Column header="操作" style="width: 150px">
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button
                icon="pi pi-eye"
                outlined
                size="small"
                v-tooltip="'查看详情'"
                @click="$emit('view', slotProps.data)"
              />
              <Button
                icon="pi pi-play"
                outlined
                size="small"
                v-tooltip="'播放视频'"
                @click="$emit('play', slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                outlined
                severity="danger"
                size="small"
                v-tooltip="'删除'"
                @click="$emit('delete', slotProps.data)"
                :loading="isDeleting"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>

<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Card from 'primevue/card'

import type { VideoUploadResponse } from '@/core/api/generated'
import { formatDuration, formatFileSize, formatDateTime } from '../utils/formatters'

interface Props {
  videos: VideoUploadResponse[]
  isLoading: boolean
  total: number
  rows?: number
  isDeleting?: boolean
}

interface Emits {
  (e: 'page', event: any): void
  (e: 'view', video: VideoUploadResponse): void
  (e: 'play', video: VideoUploadResponse): void
  (e: 'delete', video: VideoUploadResponse): void
}

withDefaults(defineProps<Props>(), {
  rows: 10,
  isDeleting: false,
})

defineEmits<Emits>()
</script>
