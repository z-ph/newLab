<template>
  <Card>
    <template #content>
      <DataTable
        v-model:selection="selectedExperiments"
        :value="experiments"
        :loading="isLoading"
        selection-mode="multiple"
        :paginator="true"
        :rows="10"
        :pt="{ header: { class: 'px-0!' } }"
      >
        <template #header>
          <slot name="header" />
        </template>
        <Column key="selection" selection-mode="multiple" />
        <Column key="experimentName" field="experimentName" header="实验名称" />
        <Column key="courseName" field="courseName" header="课程" />
        <Column key="teacherUsername" field="teacherUsername" header="教师" />
        <Column key="percentage" field="percentage" header="分数占比(%)" />
        <Column key="endTime" field="endTime" header="截止时间" />
        <Column key="actions" header="操作">
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button icon="pi-pencil" outlined size="small" @click="emit('edit', slotProps.data)" />
              <Button icon="pi pi-trash" outlined severity="danger" size="small"
                @click="handleDelete(slotProps.data)" :loading="isDeleting" />
            </div>
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import type { ExperimentResponse } from '@/core/api/generated'
import { useDeleteExperiment } from '../hooks/useMutateExperimentDelete'

interface Props {
  experiments: ExperimentResponse[]
  isLoading?: boolean
  isDeleting?: boolean
}

interface Emits {
  (e: 'edit', experiment: ExperimentResponse): void
  (e: 'refresh'): void
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  isDeleting: false,
})

const emit = defineEmits<Emits>()

// ✅ 表格内部调用 mutation
const deleteMutation = useDeleteExperiment()
const confirm = useConfirm()

const selectedExperiments = ref<ExperimentResponse[]>([])

// 删除处理
const handleDelete = (experiment: ExperimentResponse) => {
  const experimentId = experiment.id
  if (!experimentId) return

  confirm.require({
    message: `确定要删除实验"${experiment.experimentName}"吗？此操作不可撤销。`,
    header: '删除确认',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: '取消',
    acceptLabel: '删除',
    acceptClass: 'p-button-danger',
    accept: async () => {
      await deleteMutation.mutateAsync({
        path: { experimentId },
      })
      emit('refresh') // 刷新列表
    },
  })
}

// 暴露
defineExpose({
  selectedExperiments,
})
</script>
