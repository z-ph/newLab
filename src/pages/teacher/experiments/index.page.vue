<template>
  <div>
    <!-- 页面头部 -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">实验管理</h1>
        <p class="text-slate-600">管理您的实验项目</p>
      </div>
      <Button label="新建实验" icon="pi pi-plus" @click="showCreateDialog = true" />
    </div>

    <!-- 搜索和筛选 -->
    <Card class="mb-6">
      <template #content>
        <div class="flex gap-4">
          <InputText v-model="searchKeyword" placeholder="搜索实验名称" class="flex-1" />
          <Select v-model="selectedStatus" :options="statusOptions" option-label="label" option-value="value"
            placeholder="选择状态" class="w-48" />
          <Button icon="pi pi-search" outlined />
        </div>
      </template>
    </Card>

    <!-- 实验列表 -->
    <Card>
      <template #content>
        <DataTable v-model:selection="selectedExperiments" :value="query.data.value || []"
          :loading="query.isLoading.value" selection-mode="multiple" :paginator="true" :rows="10">
          <Column selection-mode="multiple" header-style="width: 3rem" />
          <Column field="experimentName" header="实验名称" />
          <Column field="courseId" header="课程ID" />
          <Column field="percentage" header="分数占比(%)" />
          <Column field="endTime" header="截止时间" />
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

    <!-- 创建实验对话框 -->
    <Dialog v-model:visible="showCreateDialog" header="新建实验" :style="{ width: '50vw' }" :modal="true">
      <form @submit.prevent="handleCreate">
        <div class="mb-4 flex flex-col gap-3">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">
              课程ID <span class="text-red-500">*</span>
            </label>
            <InputText v-model="formData.courseId" class="w-full" placeholder="请输入课程ID" />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">
              实验名称 <span class="text-red-500">*</span>
            </label>
            <InputText v-model="formData.experimentName" class="w-full" placeholder="请输入实验名称" />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">
              分数占比(%) <span class="text-red-500">*</span>
            </label>
            <InputNumber v-model="formData.percentage" :min="0" :max="100" class="w-full" placeholder="请输入分数占比" />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">
              截止时间 <span class="text-red-500">*</span>
            </label>
            <DatePicker v-model="formData.endTime" showTime class="w-full" placeholder="请选择截止时间" fluid />
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <Button label="取消" outlined @click="showCreateDialog = false" />
          <Button label="创建" type="submit" :loading="createMutation.isPending.value" />
        </div>
      </form>
    </Dialog>

    <!-- 编辑实验对话框 -->
    <Dialog v-model:visible="showEditDialog" header="编辑实验" :style="{ width: '50vw' }" :modal="true">
      <form @submit.prevent="handleUpdate">
        <div class="mb-4 flex flex-col gap-3">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">
              实验名称 <span class="text-red-500">*</span>
            </label>
            <InputText
              v-model="editFormData.experimentName"
              class="w-full"
              placeholder="请输入实验名称"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">
              分数占比(%) <span class="text-red-500">*</span>
            </label>
            <InputNumber v-model="editFormData.percentage" :min="0" :max="100" class="w-full" placeholder="请输入分数占比" />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">
              截止时间 <span class="text-red-500">*</span>
            </label>
            <DatePicker v-model="editFormData.endTime" showTime class="w-full" placeholder="请选择截止时间" fluid />
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
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useQueryExperimentAll } from '@/features/teacher/experiment/hooks/useQueryExperiment'
import { useCreateExperiment, useUpdateExperiment } from '@/features/teacher/experiment/hooks/useMutateExperiment'
import { useDeleteExperiment } from '@/features/teacher/experiment/hooks/useMutateExperimentDelete'
import type { ExperimentResponse } from '@/core/api/generated'

// ==================== Toast & Confirm ====================
const toast = useToast()
const confirm = useConfirm()

// ==================== 查询状态 ====================
const query = useQueryExperimentAll()

// ==================== 创建相关 ====================
const showCreateDialog = ref(false)
const createMutation = useCreateExperiment()
const formData = ref({
  courseId: '',
  experimentName: '',
  percentage: 10,
  endTime: null as Date | null,
})

const handleCreate = async () => {
  try {
    await createMutation.mutateAsync({
      body: {
        courseId: formData.value.courseId,
        experimentName: formData.value.experimentName,
        percentage: formData.value.percentage,
        endTime: formData.value.endTime ? formData.value.endTime.toISOString() : undefined,
      },
    })
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '实验创建成功',
      life: 3000,
    })
    showCreateDialog.value = false
    resetFormData()
    query.refetch()
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '实验创建失败',
      life: 3000,
    })
  }
}

const resetFormData = () => {
  formData.value = {
    courseId: '',
    experimentName: '',
    percentage: 10,
    endTime: null,
  }
}

// ==================== 编辑相关 ====================
const showEditDialog = ref(false)
const editingExperiment = ref<ExperimentResponse | null>(null)
const editFormData = ref({
  experimentName: '',
  percentage: 10,
  endTime: null as Date | null,
})
const updateMutation = useUpdateExperiment()

const openEditDialog = (experiment: ExperimentResponse) => {
  editingExperiment.value = experiment
  editFormData.value = {
    experimentName: experiment.experimentName || '',
    percentage: experiment.percentage || 10,
    endTime: experiment.endTime ? new Date(experiment.endTime) : null,
  }
  showEditDialog.value = true
}

const closeEditDialog = () => {
  showEditDialog.value = false
  editingExperiment.value = null
  editFormData.value = {
    experimentName: '',
    percentage: 10,
    endTime: null,
  }
}

const handleUpdate = async () => {
  if (!editingExperiment.value?.id) return

  try {
    await updateMutation.mutateAsync({
      body: {
        id: editingExperiment.value.id,
        experimentName: editFormData.value.experimentName,
        percentage: editFormData.value.percentage,
        endTime: editFormData.value.endTime ? editFormData.value.endTime.toISOString() : undefined,
      },
    })
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '实验更新成功',
      life: 3000,
    })
    closeEditDialog()
    query.refetch()
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '实验更新失败',
      life: 3000,
    })
  }
}

// ==================== 删除相关 ====================
const deleteMutation = useDeleteExperiment()

const confirmDelete = (experiment: ExperimentResponse) => {
  confirm.require({
    message: `确定要删除实验"${experiment.experimentName}"吗？此操作不可撤销。`,
    header: '删除确认',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: '取消',
    acceptLabel: '删除',
    acceptClass: 'p-button-danger',
    accept: () => handleDelete(experiment.id!),
  })
}

const handleDelete = async (id: number) => {
  try {
    await deleteMutation.mutateAsync({
      path: { experimentId: id },
    })
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '实验删除成功',
      life: 3000,
    })
    query.refetch()
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '实验删除失败',
      life: 3000,
    })
  }
}

// ==================== 其他状态 ====================
const searchKeyword = ref('')
const selectedStatus = ref(null)
const selectedExperiments = ref([])

const statusOptions = [
  { label: '全部', value: null },
  { label: '草稿', value: 'draft' },
  { label: '已发布', value: 'published' },
  { label: '已截止', value: 'closed' },
]
</script>
