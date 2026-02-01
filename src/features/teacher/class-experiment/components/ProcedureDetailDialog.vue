<template>
  <Dialog v-model:visible="visible" header="提交详情" :modal="true" :style="{ maxWidth: '100vw' }">
    <div v-if="isLoading" class="text-center py-8">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
      <p class="mt-2">加载中...</p>
    </div>
    <div v-else-if="detail" class="space-y-4">
      <!-- 基本信息 -->
      <Card>
        <template #title>基本信息</template>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-slate-600">学生姓名</p>
              <p class="font-medium">{{ detail.studentName || '-' }}</p>
            </div>
            <div>
              <p class="text-sm text-slate-600">学生用户名</p>
              <p class="font-medium">{{ detail.studentUsername || '-' }}</p>
            </div>
            <div>
              <p class="text-sm text-slate-600">提交类型</p>
              <p class="font-medium">{{ detail.submissionType || '-' }}</p>
            </div>
            <div>
              <p class="text-sm text-slate-600">提交时间</p>
              <p class="font-medium">{{ formatDateTime(detail.submissionTime) }}</p>
            </div>
            <div v-if="detail.score !== undefined">
              <p class="text-sm text-slate-600">得分</p>
              <p class="font-medium">{{ detail.score }}</p>
            </div>
            <div v-if="detail.teacherComment">
              <p class="text-sm text-slate-600">教师评语</p>
              <p class="font-medium">{{ detail.teacherComment }}</p>
            </div>
            <div v-if="detail.fileName">
              <p class="text-sm text-slate-600">文件名</p>
              <p class="font-medium">{{ detail.fileName }}</p>
            </div>
            <div v-if="detail.fileSize">
              <p class="text-sm text-slate-600">文件大小</p>
              <p class="font-medium">{{ formatFileSize(detail.fileSize) }}</p>
            </div>
          </div>
        </template>
      </Card>

      <!-- TODO: 根据实际返回的数据结构添加更多详情 -->
      <!-- 比如：视频观看时长、数据收集附件、题库答题情况等 -->
    </div>
    <div v-else class="text-center text-slate-500 py-8">
      <p>暂无详情</p>
    </div>

    <template #footer>
      <Button label="关闭" @click="visible = false" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useQuerySubmissionDetail } from '../hooks'
import { formatDateTime } from '@/features/shared/utils'

// ==================== 对话框状态 ====================
const visible = ref(false)
const submissionId = ref<number>(0)

function open(id: number) {
  submissionId.value = id
  visible.value = true
}

// ==================== 查询提交详情 ====================
const { data: detail, isLoading, refetch } = useQuerySubmissionDetail(submissionId, {
  enable: computed(() => (visible.value && !!submissionId.value))
})

// ==================== 监听对话框打开，重新获取数据 ====================
watch(visible, (newVal) => {
  if (newVal) {
    refetch()
  }
})

defineExpose({ open })

// ==================== 工具函数 ====================
const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '-'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
</script>
