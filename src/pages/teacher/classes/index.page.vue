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

    <!-- 创建班级对话框 -->
    <Dialog v-model:visible="showCreateDialog" header="新建班级" :modal="true" :style="{ maxWidth: '100vw' }">
      <form @submit.prevent="handleCreate">
        <div class="mb-4 flex flex-col gap-3">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">
              班级名称 <span class="text-red-500">*</span>
            </label>
            <InputText v-model="formData.className" class="w-full" placeholder="请输入班级名称" />
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <Button label="取消" outlined @click="showCreateDialog = false" />
          <Button label="创建" type="submit" :loading="createMutation.isPending.value" />
        </div>
      </form>
    </Dialog>

    <!-- 编辑班级对话框 -->
    <Dialog v-model:visible="showEditDialog" header="编辑班级" :modal="true" :style="{ maxWidth: '100vw' }">
      <form @submit.prevent="handleUpdate">
        <div class="mb-4 flex flex-col gap-3">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">
              班级名称 <span class="text-red-500">*</span>
            </label>
            <InputText
              v-model="editFormData.className"
              class="w-full"
              placeholder="请输入班级名称"
            />
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <Button label="取消" outlined @click="closeEditDialog" />
          <Button
            label="保存"
            type="submit"
            :loading="updateMutation.isPending.value"
          />
        </div>
      </form>
    </Dialog>

    <!-- 学生列表对话框 -->
    <StudentListDialog
      v-model="showStudentDialog"
      :class-code="selectedClassCode"
    />

    <!-- Excel批量导入对话框 -->
    <ClassImportDialog ref="importDialogRef" @success="handleImportSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import {
  useCreateClass,
  useUpdateClass,
  ClassTable,
  StudentListDialog,
  ClassImportDialog,
} from '@/features/teacher/class'
import type { GetApiBodyParamsType } from '@/core/utils/typeUtils'
import type { postApiTeacherClass, Class } from '@/core/api/generated'

// ==================== Toast ====================
const toast = useToast()

// ==================== 创建相关 ====================
const showCreateDialog = ref(false)
const createMutation = useCreateClass()
const formData = ref({
  className: '',
}) satisfies Ref<Partial<GetApiBodyParamsType<typeof postApiTeacherClass>>>

const openCreateDialog = () => {
  showCreateDialog.value = true
}

const handleCreate = async () => {
  await createMutation.mutateAsync({
    body: {
      className: formData.value.className,
    },
  })
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: '班级创建成功',
    life: 3000,
  })
  showCreateDialog.value = false
  formData.value = { className: '' }
}

// ==================== 编辑相关 ====================
const showEditDialog = ref(false)
const editingClass = ref<Class | null>(null)
const editFormData = ref({ className: '' })
const updateMutation = useUpdateClass()

const openEditDialog = (classItem: Class) => {
  editingClass.value = classItem
  editFormData.value = {
    className: classItem.className || '',
  }
  showEditDialog.value = true
}

const closeEditDialog = () => {
  showEditDialog.value = false
  editingClass.value = null
  editFormData.value = { className: '' }
}

const handleUpdate = async () => {
  if (!editingClass.value?.id) return

  await updateMutation.mutateAsync({
    path: { id: editingClass.value.id },
    body: {
      className: editFormData.value.className,
    },
  })
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: '班级更新成功',
    life: 3000,
  })
  closeEditDialog()
}

// ==================== 学生管理相关 ====================
const showStudentDialog = ref(false)
const selectedClassCode = ref('')

const openStudentDialog = (classItem: Class) => {
  selectedClassCode.value = classItem.classCode || ''
  showStudentDialog.value = true
}

// ==================== Excel批量导入相关 ====================
const importDialogRef = ref<InstanceType<typeof ClassImportDialog>>()

const openImportDialog = () => {
  importDialogRef.value?.open()
}

const handleImportSuccess = () => {
  // 导入成功后刷新班级列表
  // 这里可以添加额外的逻辑，比如显示成功消息
}
</script>
