<template>
  <Card>
    <template #content>
      <DataTable v-model:selection="selectedCourses" :value="courses" :paginator="true" :rows="size"
        :loading="query.isLoading.value" selection-mode="multiple" :total-records="total"
        lazy
        paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rows-per-page-options="[10, 20, 50]"
        current-page-report-template="显示 {first} 到 {last} 共 {totalRecords} 条"
        @page="onPageChange"
        :pt="{ header: { class: 'px-0!' } }">
        <template #header>
          <div class="flex items-center justify-between">
            <h1 class="text-xl font-bold text-slate-900">课程管理</h1>
            <Button label="新建课程" icon="pi pi-plus" @click="handleCreate" />
          </div>
        </template>
        <Column key="selection" selection-mode="multiple" />
        <Column key="courseId" field="courseId" header="课程编号" />
        <Column key="courseName" field="courseName" header="课程名称" />
        <Column key="teacherUsername" field="teacherUsername" header="教师名称" />
        <Column key="createTime" field="createTime" header="创建时间">
          <template #body="slotProps">
            {{ formatDateTime(slotProps.data.createTime) }}
          </template>
        </Column>
        <Column key="actions" header="操作">
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button icon="pi pi-eye" outlined size="small" severity="info" @click="handleViewDetail(slotProps.data)" v-tooltip.top="'查看详情'" />
              <Button icon="pi pi-trash" outlined severity="danger" size="small" @click="handleDelete(slotProps.data)"
                :loading="deleteMutation.isPending.value" v-tooltip.top="'删除'" />
            </div>
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import type { DataTablePageEvent } from 'primevue/datatable'
import type { CourseResponse } from '@/core/api/generated'
import { useQueryCoursePage, useDeleteCourse } from '../hooks'
import { formatDateTime } from '@/features/shared/utils/formatters'

const router = useRouter()

// ==================== 创建课程 ====================
const handleCreate = () => {
  router.push('/teacher/courses/create')
}

// ==================== 查看课程详情 ====================
const handleViewDetail = (course: CourseResponse) => {
  if (!course.courseId) return
  router.push({
    path: `/teacher/courses/${course.courseId}/detail`,
    query: {
      tabbarName: course.courseName || '课程详情',
      courseName: course.courseName || '',
      courseId: course.id?.toString(),
    },
  })
}

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
const onPageChange = (event: DataTablePageEvent) => {
  current.value = event.page + 1
  size.value = event.rows
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

// 暴露
defineExpose({
  selectedCourses,
})
</script>
