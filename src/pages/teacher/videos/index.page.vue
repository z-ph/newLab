<template>
  <div class="p-6">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">视频管理</h1>
        <p class="text-sm text-slate-500 mt-1">管理教学视频资源库</p>
      </div>
      <Button label="上传视频" icon="pi pi-upload" @click="showUploadDialog = true" />
    </div>

    <!-- 筛选器 -->
    <Card class="mb-6">
      <template #content>
        <div class="flex gap-4 items-end">
          <div class="flex-1">
            <label class="block text-sm font-medium text-slate-700 mb-2">搜索视频</label>
            <InputText v-model="filters.fileName" placeholder="输入文件名搜索" class="w-full" />
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-slate-700 mb-2">关联课程</label>
            <Select
              v-model="filters.courseId"
              :options="courseOptions"
              option-label="courseName"
              option-value="courseId"
              placeholder="全部课程"
              class="w-full"
              show-clear
            />
          </div>
        </div>
      </template>
    </Card>

    <!-- 视频列表 -->
    <Card>
      <template #content>
        <DataTable
          :value="videos"
          :loading="isLoading"
          :paginator="true"
          :rows="10"
          :total-records="total"
          :lazy="true"
          @page="onPage"
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
                  @click="handleView(slotProps.data)"
                />
                <Button
                  icon="pi pi-play"
                  outlined
                  size="small"
                  v-tooltip="'播放视频'"
                  @click="handlePlay(slotProps.data)"
                />
                <Button
                  icon="pi pi-trash"
                  outlined
                  severity="danger"
                  size="small"
                  v-tooltip="'删除'"
                  @click="handleDelete(slotProps.data)"
                  :loading="deleteMutation.isPending.value"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- 上传视频对话框 -->
    <Dialog v-model:visible="showUploadDialog" header="上传视频" modal :style="{ width: '600px' }">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">视频文件 *</label>
          <FileUpload
            mode="basic"
            accept="video/*"
            :max-file-size="104857600"
            @select="onFileSelect"
            :auto="false"
            choose-label="选择视频文件"
            class="w-full"
          />
          <p class="text-xs text-slate-500 mt-1">支持 MP4、AVI 等视频格式，最大 100MB</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">视频标题 *</label>
          <InputText v-model="uploadForm.title" placeholder="输入视频标题" class="w-full" />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">视频描述</label>
          <Textarea v-model="uploadForm.description" placeholder="输入视频描述（可选）" rows="3" class="w-full" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">关联课程</label>
            <Select
              v-model="uploadForm.courseId"
              :options="courseOptions"
              option-label="courseName"
              option-value="courseId"
              placeholder="无"
              class="w-full"
              show-clear
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">关联实验</label>
            <Select
              v-model="uploadForm.experimentId"
              :options="experimentOptions"
              option-label="experimentName"
              option-value="experimentId"
              placeholder="无"
              class="w-full"
              show-clear
            />
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="取消" severity="secondary" @click="showUploadDialog = false" />
        <Button
          label="上传"
          @click="handleUpload"
          :loading="uploadMutation.isPending.value"
          :disabled="!uploadForm.file || !uploadForm.title"
        />
      </template>
    </Dialog>

    <!-- 视频详情对话框 -->
    <Dialog v-model:visible="showDetailDialog" header="视频详情" modal :style="{ width: '600px' }">
      <div v-if="currentVideo" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">视频 ID</label>
            <p class="text-sm text-slate-900">{{ currentVideo.id }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">文件名</label>
            <p class="text-sm text-slate-900">{{ currentVideo.originalFileName }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">文件大小</label>
            <p class="text-sm text-slate-900">{{ currentVideo.fileSizeHumanReadable }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">视频时长</label>
            <p class="text-sm text-slate-900">{{ formatDuration(currentVideo.videoSeconds) }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">上传时间</label>
            <p class="text-sm text-slate-900">{{ formatDateTime(currentVideo.uploadTime) }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">存储路径</label>
            <p class="text-xs text-slate-500 truncate">{{ currentVideo.storedFileName }}</p>
          </div>
        </div>
      </div>
      <template #footer>
        <Button label="关闭" severity="secondary" @click="showDetailDialog = false" />
      </template>
    </Dialog>

    <!-- 视频播放对话框 -->
    <Dialog v-model:visible="showPlayDialog" header="播放视频" modal :style="{ width: '800px' }">
      <div v-if="currentVideo" class="aspect-video bg-black">
        <video v-if="currentVideo.fileAccessPath" :src="currentVideo.fileAccessPath" controls class="w-full h-full">
          您的浏览器不支持视频播放
        </video>
        <div v-else class="flex items-center justify-center h-full text-white">无视频源</div>
      </div>
      <template #footer>
        <Button label="关闭" severity="secondary" @click="showPlayDialog = false" />
      </template>
    </Dialog>

    <!-- 删除确认对话框 -->
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useQuery, useMutation } from '@tanstack/vue-query'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Select from 'primevue/select'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import FileUpload from 'primevue/fileupload'
import ConfirmDialog from 'primevue/confirmdialog'

import { postApiTeacherVideosQuery, deleteApiTeacherVideosByVideoId } from '@/core/api/generated'
import client from '@/core/api/config'
import { useQueryCourseAll } from '@/features/teacher/course/hooks'
import type { VideoUploadResponse } from '@/core/api/generated'

// 分页参数
const page = ref(1)
const size = ref(10)

// 筛选条件
const filters = ref<{
  fileName?: string
  courseId?: string
}>({})

// 对话框状态
const showUploadDialog = ref(false)
const showDetailDialog = ref(false)
const showPlayDialog = ref(false)

// 当前视频
const currentVideo = ref<VideoUploadResponse | null>(null)

// 上传表单
const uploadForm = ref<{
  file?: File
  title: string
  description: string
  courseId?: string
  experimentId?: string
}>({
  title: '',
  description: '',
})

const toast = useToast()
const confirm = useConfirm()

// 查询所有课程
const { query: coursesQuery } = useQueryCourseAll()

// 查询视频列表
const { data, isLoading, refetch } = useQuery({
  queryKey: ['videos', page, size, filters],
  queryFn: async () => {
    const response = await postApiTeacherVideosQuery({
      client,
      body: {
        current: page.value,
        size: size.value,
        pageable: true,
        ...(filters.value.fileName && { originalFileName: filters.value.fileName }),
      },
    })
    return response.data
  },
})

// 视频列表
const videos = computed(() => data.value?.data?.records || [])
const total = computed(() => data.value?.data?.total || 0)

// 课程选项
const courseOptions = computed(() => {
  const coursesData = coursesQuery.data.value
  if (!coursesData) return []

  const coursesList = Array.isArray(coursesData) ? coursesData : coursesData.records || []

  return coursesList.map((course: any) => ({
    courseId: course.courseId,
    courseName: course.courseName,
  }))
})

// 实验选项（根据课程筛选）
const experimentOptions = computed(() => {
  // 这里可以根据需要添加实验列表
  return []
})

// 上传视频
const uploadMutation = useMutation({
  mutationFn: async () => {
    if (!uploadForm.value.file) throw new Error('请选择视频文件')
    if (!uploadForm.value.title) throw new Error('请输入视频标题')

    const formData = new FormData()
    formData.append('file', uploadForm.value.file)

    // 构建查询参数
    const params: Record<string, string> = {
      title: uploadForm.value.title,
    }

    if (uploadForm.value.description) {
      params.description = uploadForm.value.description
    }

    if (uploadForm.value.courseId) {
      params.courseId = uploadForm.value.courseId
    }

    if (uploadForm.value.experimentId) {
      params.experimentId = uploadForm.value.experimentId
    }

    const queryString = new URLSearchParams(params).toString()

    const response = await fetch(`/api/teacher/videos/upload?${queryString}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error('上传失败')
    }

    return response.json()
  },
  onSuccess: () => {
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '视频上传成功',
      life: 3000,
    })
    showUploadDialog.value = false
    resetUploadForm()
    refetch()
  },
})

// 删除视频
const deleteMutation = useMutation({
  mutationFn: async (videoId: number) => {
    return await deleteApiTeacherVideosByVideoId({
      path: { videoId },
      client,
    })
  },
  onSuccess: () => {
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '视频删除成功',
      life: 3000,
    })
    refetch()
  },
})

// 文件选择
const onFileSelect = (event: any) => {
  uploadForm.value.file = event.files[0]
  // 自动填充标题
  if (!uploadForm.value.title) {
    uploadForm.value.title = event.files[0].name.replace(/\.[^/.]+$/, '')
  }
}

// 分页
const onPage = (event: any) => {
  page.value = event.page + 1
}

// 查看详情
const handleView = (video: VideoUploadResponse) => {
  currentVideo.value = video
  showDetailDialog.value = true
}

// 播放视频
const handlePlay = (video: VideoUploadResponse) => {
  currentVideo.value = video
  showPlayDialog.value = true
}

// 删除视频
const handleDelete = (video: VideoUploadResponse) => {
  confirm.require({
    message: `确定要删除视频「${video.originalFileName}」吗？删除后将无法恢复。`,
    header: '删除确认',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: '确定',
    rejectLabel: '取消',
    accept: async () => {
      await deleteMutation.mutateAsync(video.id!)
    },
  })
}

// 上传视频
const handleUpload = () => {
  uploadMutation.mutate()
}

// 重置上传表单
const resetUploadForm = () => {
  uploadForm.value = {
    title: '',
    description: '',
  }
}

// 格式化时长
const formatDuration = (seconds?: number): string => {
  if (!seconds) return '-'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`
}

// 格式化文件大小
const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '-'
  const mb = bytes / (1024 * 1024)
  return `${mb.toFixed(2)} MB`
}

// 格式化日期时间
const formatDateTime = (dateTime?: string): string => {
  if (!dateTime) return '-'
  return new Date(dateTime).toLocaleString('zh-CN')
}
</script>
