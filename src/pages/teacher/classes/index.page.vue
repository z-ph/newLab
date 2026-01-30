<template>
  <div>
    <!-- 班级列表 -->
    <Card>
      <template #content>
        <DataTable generic="Class" v-model:selection="selectedClasses" :value="query.data.value?.records || []"
          :paginator="true" :rows="size" :loading="query.isLoading.value" selection-mode="multiple"
          :total-records="query.data.value?.total" @page="onPageChange">
          <template #header>
            <div class="flex items-center justify-between">
              <h1 class="text-2xl font-bold text-slate-900">班级管理</h1>
              <Button label="新建班级" icon="pi pi-plus" @click="showCreateDialog = true" />
            </div>
          </template>
          <Column key="selection" selection-mode="multiple" header-style="width: 3rem" />
          <Column key="className" field="className" header="班级名称" />
          <Column key="studentCount" field="studentCount" header="学生数" />
          <Column key="actions" header="操作">
            <template #body="slotProps">
              <div class="flex gap-2">
                <Button
                  icon="pi pi-users"
                  outlined
                  size="small"
                  v-tooltip.top="'查看学生'"
                  @click="openStudentDialog(slotProps.data)"
                />
                <Button
                  icon="pi pi-pencil"
                  outlined
                  size="small"
                  @click="openEditDialog(slotProps.data)"
                />
                <Button
                  icon="pi pi-trash"
                  outlined
                  severity="danger"
                  size="small"
                  @click="confirmDelete(slotProps.data)"
                  :loading="deleteMutation.isPending.value"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- 创建班级对话框 -->
    <Dialog v-model:visible="showCreateDialog" header="新建班级" :style="{ width: '50vw' }" :modal="true">
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
    <Dialog v-model:visible="showEditDialog" header="编辑班级" :style="{ width: '50vw' }" :modal="true">
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
      @refresh="query.refetch"
    />
  </div>
</template>

<script setup lang="ts">
// ==================== 导入 ====================
import { ref, type Ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import {
  useQueryClassPage,
  useCreateClass,
  useUpdateClass,
  useDeleteClass,
  StudentListDialog,
} from '@/features/teacher/class'
import type { GetApiBodyParamsType } from '@/core/utils/typeUtils'
import type { postApiTeacherClass, Class } from '@/core/api/generated'

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
const { current, size, query } = useQueryClassPage({ current: 1, size: 10 })

// ==================== 创建相关 ====================
const showCreateDialog = ref(false)
const createMutation = useCreateClass()
const formData = ref({
  className: '',
}) satisfies Ref<Partial<GetApiBodyParamsType<typeof postApiTeacherClass>>>

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
  query.refetch()
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
  query.refetch()
}

// ==================== 删除相关 ====================
const deleteMutation = useDeleteClass()

const confirmDelete = (classItem: Class) => {
  confirm.require({
    message: `确定要删除班级"${classItem.className}"吗？此操作不可撤销。`,
    header: '删除确认',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: '取消',
    acceptLabel: '删除',
    acceptClass: 'p-button-danger',
    accept: () => handleDelete(classItem.id!),
  })
}

const handleDelete = async (id: number) => {
  await deleteMutation.mutateAsync({
    path: { id },
  })
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: '班级删除成功',
    life: 3000,
  })
  query.refetch()
}

// ==================== 其他状态 ====================
const selectedClasses = ref([])

// ==================== 学生管理相关 ====================
const showStudentDialog = ref(false)
const selectedClassCode = ref('')

const openStudentDialog = (classItem: Class) => {
  selectedClassCode.value = classItem.classCode || ''
  showStudentDialog.value = true
}

// ==================== 事件处理函数 ====================
const onPageChange = (event: PageStateEvent) => {
  current.value = event.page + 1
}
</script>
