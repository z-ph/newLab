<template>
  <Card>
    <template #content>
      <DataTable
        v-model:selection="props.query.experiments"
        :value="internalExperiments"
        :loading="internalLoading"
        selection-mode="multiple"
        :paginator="true"
        :rows="props.query.size.value"
        :total-records="internalTotal"
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
              <Button icon="pi-pencil" outlined size="small" @click="navigateToExperimentEdit(router, slotProps.data)" />
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
import {  computed } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import { useQueryExperimentPage } from '../hooks/useQueryExperiment'
import { useDeleteExperiment } from '../hooks/useMutateExperimentDelete'
import type { ExperimentResponse } from '@/core/api/generated'
import type { DataTablePageEvent } from 'primevue/datatable'
import { useRouter } from 'vue-router'
import {
  navigateToExperimentEdit,
} from '@/features/teacher/experiment'
interface Props {
 query: ReturnType<typeof useQueryExperimentPage>
}
const router = useRouter()


const props = defineProps<Props>()


// 表格内部调用 mutation
const deleteMutation = useDeleteExperiment()
const confirm = useConfirm()


const internalExperiments = computed(() => {
  return props.query.experiments.value || []
})

const internalLoading = computed(() => {
  return props.query.isLoading.value
})

const internalTotal = computed(() => {

  return props.query.data.value?.total || 0
})

// 分页处理
const onPageChange = (event: DataTablePageEvent) => {
    props.query.current.value = event.page + 1
    props.query.size.value = event.rows
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
      props.query.refetch()
    },
  })
}

</script>
