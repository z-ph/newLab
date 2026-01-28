<template>
  <div>
    <!-- 页面头部 -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">班级管理</h1>
        <p class="text-slate-600">管理您的班级信息</p>
      </div>
      <Button label="新建班级" icon="pi pi-plus" @click="showCreateDialog = true" />
    </div>

    <!-- 搜索和筛选 -->
    <Card class="mb-6">
      <template #content>
        <div class="flex gap-4">
          <InputText v-model="searchKeyword" placeholder="搜索班级名称或代码" class="flex-1" />
          <Select v-model="selectedStatus" :options="statusOptions" option-label="label" option-value="value"
            placeholder="选择状态" class="w-48" />
          <Button icon="pi pi-search" outlined />
        </div>
      </template>
    </Card>

    <!-- 班级列表 -->
    <Card>
      <template #content>
        <DataTable generic="Class" v-model:selection="selectedClasses" :value="query.data.value?.records || []"
          :paginator="true" :rows="size" :loading="query.isLoading.value" selection-mode="multiple"
          :total-records="query.data.value?.total" @page="onPageChange">
          <Column selection-mode="multiple" header-style="width: 3rem" />
          <Column field="className" header="班级名称" />
          <Column field="studentCount" header="学生数" />
          <Column header="操作">
            <template #body="slotProps">
              <div class="flex gap-2">
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
  </div>
</template>

<script setup lang="ts">
// ==================== 导入 ====================
import { ref, type Ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useQueryClassPage } from '@/features/teacher/class/hooks/useQueryClass'
import { useCreateClass, useUpdateClass } from '@/features/teacher/class/hooks/useMutateClass'
import { useDeleteClass } from '@/features/teacher/class/hooks/useMutateClassDelete'
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
  try {
    await createMutation.mutateAsync({
      body: {
        className: formData.value.className,
        classCode: formData.value.className
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
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '班级创建失败',
      life: 3000,
    })
  }
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

  try {
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
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '班级更新失败',
      life: 3000,
    })
  }
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
  try {
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
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '班级删除失败',
      life: 3000,
    })
  }
}

// ==================== 其他状态 ====================
const searchKeyword = ref('')
const selectedStatus = ref(null)
const selectedClasses = ref([])

const statusOptions = [
  { label: '全部', value: null },
  { label: '进行中', value: 'active' },
  { label: '已结课', value: 'inactive' },
]

// ==================== 事件处理函数 ====================
const onPageChange = (event: PageStateEvent) => {
  current.value = event.page + 1
}
</script>
