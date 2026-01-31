<template>
  <div class="p-1">
    <!-- 课程列表 -->
    <CourseTable @edit="openEditDialog">
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold text-slate-900">课程管理</h1>
          <Button label="新建课程" icon="pi pi-plus" @click="openCreateDialog" />
        </div>
      </template>
    </CourseTable>

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
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import {
  useCreateCourse,
  useUpdateCourse,
  CourseTable,
  CourseFormDialog,
} from '@/features/teacher/course'
import type { CourseResponse } from '@/core/api/generated'

// ==================== Toast & Confirm ====================
const toast = useToast()

// ==================== 对话框状态 ====================
const showDialog = ref(false)
const isEditMode = ref(false)
const currentCourse = ref<Partial<CourseResponse>>({})
const isSubmitting = ref(false)

const createMutation = useCreateCourse()
const updateMutation = useUpdateCourse()

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

  if (isEditMode.value) {
    // 编辑模式
    if (!currentCourse.value.id) {
      isSubmitting.value = false
      toast.add({
        severity: 'error',
        summary: '错误',
        detail: '缺少课程ID',
        life: 3000,
      })
      return
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
  isSubmitting.value = false
}
</script>
