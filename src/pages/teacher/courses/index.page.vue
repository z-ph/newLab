<template>
  <div>
    <!-- 页面头部 -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">课程管理</h1>
        <p class="text-slate-600">管理您的课程信息</p>
      </div>
      <Button label="新建课程" icon="pi pi-plus" @click="openCreateDialog" />
    </div>

    <!-- 搜索和筛选 -->
    <CourseSearchBar ref="searchBarRef" @search="handleSearch" />

    <!-- 课程列表 -->
    <CourseTable
      :courses="query.data.value?.records || []"
      :loading="query.isLoading.value"
      :size="size"
      :total="query.data.value?.total"
      @page-change="onPageChange"
      @edit="openEditDialog"
      @delete="confirmDelete"
    />

    <!-- 创建/编辑课程对话框 -->
    <CourseFormDialog
      v-model="showDialog"
      :is-edit="isEditMode"
      :initial-data="currentCourse"
      :loading="isSubmitting"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
// ==================== 导入 ====================
import { ref, reactive } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import {
  useQueryCoursePage,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
} from '@/features/teacher/course/hooks'
import type { CourseResponse, CourseQueryRequest } from '@/core/api/generated'

// ==================== 组件引入 ====================
import CourseSearchBar from './components/CourseSearchBar.vue'
import CourseTable from './components/CourseTable.vue'
import CourseFormDialog from './components/CourseFormDialog.vue'

// ==================== 类型定义 ====================
interface PageStateEvent {
  page: number
  first: number
  rows: number
  pageCount: number
}

// ==================== Toast & Confirm ====================
const toast = useToast()
const confirm = useConfirm()

// ==================== 查询状态 ====================
const { current, size, query } = useQueryCoursePage({ current: 1, size: 10 })

// ==================== 搜索 ====================
const searchParams = reactive<Partial<CourseQueryRequest>>({})

const handleSearch = (keyword: string) => {
  if (keyword) {
    searchParams.courseId = keyword
    searchParams.courseName = keyword
  } else {
    searchParams.courseId = undefined
    searchParams.courseName = undefined
  }
  // 重置到第一页
  current.value = 1
}

// ==================== 对话框状态 ====================
const showDialog = ref(false)
const isEditMode = ref(false)
const currentCourse = ref<Partial<CourseResponse>>({})
const isSubmitting = ref(false)

const createMutation = useCreateCourse()
const updateMutation = useUpdateCourse()
const deleteMutation = useDeleteCourse()

// ==================== 打开创建对话框 ====================
const openCreateDialog = () => {
  isEditMode.value = false
  currentCourse.value = {}
  showDialog.value = true
}

// ==================== 打开编辑对话框 ====================
const openEditDialog = (course: CourseResponse) => {
  isEditMode.value = true
  currentCourse.value = {
    courseId: course.courseId,
    courseName: course.courseName,
  }
  showDialog.value = true
}

// ==================== 处理表单提交 ====================
const handleSubmit = async (data: Partial<CourseResponse>) => {
  isSubmitting.value = true

  try {
    if (isEditMode.value) {
      // 编辑模式
      if (!currentCourse.value.id) {
        throw new Error('缺少课程ID')
      }

      await updateMutation.mutateAsync({
        path: { id: currentCourse.value.id },
        body: {
          courseName: data.courseName,
        },
      })

      toast.add({
        severity: 'success',
        summary: '成功',
        detail: '课程更新成功',
        life: 3000,
      })
    } else {
      // 创建模式
      await createMutation.mutateAsync({
        body: {
          courseId: data.courseId,
          courseName: data.courseName,
        },
      })

      toast.add({
        severity: 'success',
        summary: '成功',
        detail: '课程创建成功',
        life: 3000,
      })
    }

    showDialog.value = false
    query.refetch()
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: isEditMode.value ? '课程更新失败' : '课程创建失败',
      life: 3000,
    })
  } finally {
    isSubmitting.value = false
  }
}

// ==================== 删除确认 ====================
const confirmDelete = (course: CourseResponse) => {
  confirm.require({
    message: `确定要删除课程"${course.courseName}"吗？此操作不可撤销。`,
    header: '删除确认',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: '取消',
    acceptLabel: '删除',
    acceptClass: 'p-button-danger',
    accept: () => handleDelete(course),
  })
}

// ==================== 执行删除 ====================
const handleDelete = async (course: CourseResponse) => {
  if (!course.id) {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '缺少课程ID',
      life: 3000,
    })
    return
  }

  try {
    await deleteMutation.mutateAsync(course.id)

    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '课程删除成功',
      life: 3000,
    })

    query.refetch()
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '课程删除失败',
      life: 3000,
    })
  }
}

// ==================== 分页处理 ====================
const onPageChange = (event: PageStateEvent) => {
  current.value = event.page + 1
}
</script>
