<template>
  <div class="p-1">
    <!-- 课程列表 -->
    <CourseTable @edit="handleEdit">
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold text-slate-900">课程管理</h1>
          <Button label="新建课程" icon="pi pi-plus" @click="handleCreate" />
        </div>
      </template>
    </CourseTable>

    <!-- 创建/编辑课程对话框 -->
    <CourseFormDialog ref="dialogRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  CourseTable,
  CourseFormDialog,
} from '@/features/teacher/course'
import type { CourseResponse } from '@/core/api/generated'

// ==================== 对话框 ref ====================
const dialogRef = ref<InstanceType<typeof CourseFormDialog>>()

// ==================== 创建课程 ====================
const handleCreate = () => {
  dialogRef.value?.open()
}

// ==================== 编辑课程 ====================
const handleEdit = (course: CourseResponse) => {
  dialogRef.value?.open({
    courseId: course.courseId,
    courseName: course.courseName,
  })
}
</script>
