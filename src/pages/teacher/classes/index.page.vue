<template>
  <div class="p-1">
    <!-- 班级列表 -->
    <ClassTable @edit="openEditDialog" @view-students="openStudentDialog">
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold text-slate-900">班级管理</h1>
          <div class="flex gap-2">
            <Button label="批量导入" icon="pi pi-upload" outlined severity="secondary" @click="openImportDialog" />
            <Button label="新建班级" icon="pi pi-plus" @click="openCreateDialog" />
          </div>
        </div>
      </template>
    </ClassTable>

    <!-- 对话框组件 -->
    <ClassCreateDialog ref="createDialogRef" />
    <ClassEditDialog ref="editDialogRef" />
    <StudentListDialog ref="studentDialogRef" />
    <ClassImportDialog ref="importDialogRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  ClassTable,
  StudentListDialog,
  ClassImportDialog,
  ClassCreateDialog,
  ClassEditDialog,
} from '@/features/teacher/class'
import type { Class } from '@/core/api/generated'

// ==================== 对话框 Ref ====================
const createDialogRef = ref<InstanceType<typeof ClassCreateDialog>>()
const editDialogRef = ref<InstanceType<typeof ClassEditDialog>>()
const studentDialogRef = ref<InstanceType<typeof StudentListDialog>>()
const importDialogRef = ref<InstanceType<typeof ClassImportDialog>>()

// ==================== 对话框操作 ====================
const openCreateDialog = () => {
  createDialogRef.value?.open()
}

const openEditDialog = (classItem: Class) => {
  editDialogRef.value?.open({
    id: classItem.id,
    className: classItem.className,
  })
}

const openStudentDialog = (classItem: Class) => {
  studentDialogRef.value?.open({
    classCode: classItem.classCode || '',
  })
}

const openImportDialog = () => {
  importDialogRef.value?.open()
}
</script>
