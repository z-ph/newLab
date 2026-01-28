<template>
  <div>
    <!-- ��面头部 -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">实验管理</h1>
        <p class="text-slate-600">管理您的实验项目、步骤和学生批改</p>
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
                <Button label="管理" outlined size="small" @click="openDetail(slotProps.data)" />
                <Button icon="pi pi-pencil" outlined severity="secondary" size="small"
                  @click="openEdit(slotProps.data)" />
                <Button icon="pi pi-trash" outlined severity="danger" size="small"
                  @click="confirmDelete(slotProps.data)" :loading="deleteMutation.isPending.value" />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- 创建/编辑实验对话框 -->
    <ExperimentFormDialog v-model:visible="showCreateDialog" :experiment="null" @success="handleCreateSuccess" />

    <ExperimentFormDialog v-model:visible="showEditDialog" :experiment="editingExperiment"
      @success="handleEditSuccess" />

    <!-- 实验详情对话框 -->
    <ExperimentDetailDialog v-model:visible="showDetailDialog" :experiment="selectedExperiment" />

    <!-- 删除确认对话框 -->
    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useQueryExperimentAll } from '@/features/teacher/experiment/hooks/useQueryExperiment'
import { useDeleteExperiment } from '@/features/teacher/experiment/hooks/useMutateExperimentDelete'
import type { ExperimentResponse } from '@/core/api/generated'
import ExperimentFormDialog from './components/ExperimentFormDialog.vue'
import ExperimentDetailDialog from './components/ExperimentDetailDialog.vue'

const toast = useToast()
const confirm = useConfirm()

// 查询实验列表
const query = useQueryExperimentAll()

// 对话框状态
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showDetailDialog = ref(false)
const editingExperiment = ref<ExperimentResponse | null>(null)
const selectedExperiment = ref<ExperimentResponse | null>(null)

// 删除实验
const deleteMutation = useDeleteExperiment()

const openEdit = (experiment: ExperimentResponse) => {
  editingExperiment.value = experiment
  showEditDialog.value = true
}

const openDetail = (experiment: ExperimentResponse) => {
  selectedExperiment.value = experiment
  showDetailDialog.value = true
}

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
}

const handleCreateSuccess = () => {
  showCreateDialog.value = false
  query.refetch()
}

const handleEditSuccess = () => {
  showEditDialog.value = false
  editingExperiment.value = null
  query.refetch()
}

// 其他状态
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
