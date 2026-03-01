<template>
  <Card>
    <template #content>
      <DataTable
        v-model:selection="selectedExperiments"
        :value="internalExperiments"
        :loading="internalLoading"
        selection-mode="multiple"
        :paginator="true"
        :rows="internalSize"
        :total-records="internalTotal"
        :lazy="withDataFetch"
        :rows-per-page-options="[10, 20, 50]"
        :pt="{ header: { class: 'px-0!' } }"
        @page="onPageChange"
      >
        <template #header>
          <slot name="header" />
        </template>
        <Column key="selection" selection-mode="multiple" />
        <Column key="experimentName" field="experimentName" header="实验名称" />
        <Column key="courseName" field="courseName" header="课程" />
        <Column key="teacherUsername" field="teacherUsername" header="教师" />
        <Column key="percentage" field="percentage" header="分数占比 (%)" />
        <Column key="endTime" field="endTime" header="截止时间" />
        <Column key="actions" header="操作">
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button icon="pi-pencil" outlined size="small" @click="emit('edit', slotProps.data)" />
              <Button icon="pi pi-trash" outlined severity="danger" size="small"
                @click="handleDelete(slotProps.data)" :loading="deleteMutation.isPending.value" />
            </div>
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import { useQueryExperimentPage } from '../hooks/useQueryExperiment'
import { useDeleteExperiment } from '../hooks/useMutateExperimentDelete'
import type { ExperimentResponse } from '@/core/api/generated'
import type { DataTablePageEvent } from 'primevue/datatable'

interface Props {
  experiments?: ExperimentResponse[]
  isLoading?: boolean
  withDataFetch?: boolean
}

interface Emits {
  (e: 'edit', experiment: ExperimentResponse): void
  (e: 'refresh'): void
}

const props = withDefaults(defineProps<Props>(), {
  experiments: () => [],
  isLoading: false,
  withDataFetch: true,
})

const emit = defineEmits<Emits>()

// 表格内部调用 mutation
const deleteMutation = useDeleteExperiment()
const confirm = useConfirm()

const selectedExperiments = ref<ExperimentResponse[]>([])

// 内部数据获取模式
const { current: internalCurrent, size: internalSize, experiments: internalExperimentsData, total: internalTotalData, query: internalQuery } = useQueryExperimentPage({
  current: 1,
  size: 10,
})

const internalExperiments = computed(() => {
  if (props.withDataFetch) {
    return internalExperimentsData.value || []
  }
  return props.experiments || []
})

const internalLoading = computed(() => {
  if (props.withDataFetch) {
    return internalQuery.isLoading.value
  }
  return props.isLoading
})

const internalTotal = computed(() => {
  if (props.withDataFetch) {
    return internalTotalData.value || 0
  }
  return props.experiments?.length || 0
})

// 分页处理
const onPageChange = (event: DataTablePageEvent) => {
  if (props.withDataFetch) {
    internalCurrent.value = event.page + 1
    internalSize.value = event.rows
  }
}

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
      if (props.withDataFetch) {
        internalQuery.refetch()
      } else {
        emit('refresh')
      }
    },
  })
}

// 暴露
defineExpose({
  selectedExperiments,
})
</script>
