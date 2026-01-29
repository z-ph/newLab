<template>
  <Card>
    <template #content>
      <DataTable
        v-model:selection="selectedCourses"
        :value="courses"
        :paginator="true"
        :rows="size"
        :loading="loading"
        selection-mode="multiple"
        :total-records="total"
        @page="onPageChange"
      >
        <Column key="selection" selection-mode="multiple" header-style="width: 3rem" />
        <Column key="courseId" field="courseId" header="课程编号" />
        <Column key="courseName" field="courseName" header="课程名称" />
        <Column key="teacherUsername" field="teacherUsername" header="教师名称" />
        <Column key="createTime" field="createTime" header="创建时间">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.createTime) }}
          </template>
        </Column>
        <Column key="actions" header="操作">
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button
                icon="pi pi-pencil"
                outlined
                size="small"
                @click="$emit('edit', slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                outlined
                severity="danger"
                size="small"
                @click="$emit('delete', slotProps.data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// ==================== 类型定义 ====================
import type { CourseResponse } from '@/core/api/generated'

interface PageStateEvent {
  page: number
  first: number
  rows: number
  pageCount: number
}

// ==================== Props & Emits ====================
interface Props {
  courses: CourseResponse[]
  loading?: boolean
  size?: number
  total?: number
}

interface Emits {
  (e: 'page-change', event: PageStateEvent): void
  (e: 'edit', course: CourseResponse): void
  (e: 'delete', course: CourseResponse): void
}

// ==================== 定义 ====================
defineProps<Props>()
const emit = defineEmits<Emits>()

const selectedCourses = ref<CourseResponse[]>([])

// ==================== 事件处理 ====================
const onPageChange = (event: PageStateEvent) => {
  emit('page-change', event)
}

// ==================== 工具函数 ====================
const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ==================== 暴露 ====================
defineExpose({
  selectedCourses,
})
</script>
