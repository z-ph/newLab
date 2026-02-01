<template>
  <Card>
    <template #content>
      <DataTable
        v-model:selection="selectedCourses"
        :value="courses"
        :paginator="true"
        :rows="size"
        :loading="query.isLoading.value"
        selection-mode="multiple"
        :total-records="total"
        @page="onPageChange"
        :pt="{ header: { class: 'px-0!' } }"
      >
        <template #header>
          <slot name="header" />
        </template>
        <Column key="selection" selection-mode="multiple" />
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
                @click="emit('edit', slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                outlined
                severity="danger"
                size="small"
                @click="handleDelete(slotProps.data)"
                :loading="deleteMutation.isPending.value"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import type { CourseResponse } from '@/core/api/generated'
import { useQueryCoursePage, useDeleteCourse } from '../hooks'

interface PageStateEvent {
  page: number
  first: number
  rows: number
  pageCount: number
}

interface Emits {
  (e: 'page-change', event: PageStateEvent): void
  (e: 'edit', course: CourseResponse): void
}

const emit = defineEmits<Emits>()

// ✅ 表格内部调用 hook 获取数据
const { current, size, query } = useQueryCoursePage({
  current: 1,
  size: 20,
})

// ✅ 表格内部调用 mutation
const deleteMutation = useDeleteCourse()
const confirm = useConfirm()

const selectedCourses = ref<CourseResponse[]>([])

// 计算属性
const courses = computed(() => query.data.value?.records || [])
const total = computed(() => query.data.value?.total || 0)

// 事件处理
const onPageChange = (event: PageStateEvent) => {
  current.value = event.page + 1
  emit('page-change', event)
}

// 删除处理
const handleDelete = (course: CourseResponse) => {
  const courseId = course.id
  if (!courseId) return

  confirm.require({
    message: `确定要删除课程"${course.courseName}"吗？此操作不可撤销。`,
    header: '删除确认',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: '取消',
    acceptLabel: '删除',
    acceptClass: 'p-button-danger',
    accept: async () => {
      await deleteMutation.mutateAsync(courseId)
      query.refetch()
    },
  })
}

// 工具函数
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

// 暴露
defineExpose({
  selectedCourses,
})
</script>
