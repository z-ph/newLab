<template>
  <div>
    <div class="mb-4 flex justify-end">
      <Button label="添加步骤" icon="pi pi-plus" @click="handleOpenAddDialog" />
    </div>
    <DataTable :value="proceduresQuery.data.value || []" :loading="proceduresQuery.isLoading.value"
      :paginator="true" :rows="10" striped-rows>
      <Column key="number" field="number" header="序号" style="width: 80px" />
      <Column key="type" header="类型" style="width: 150px">
        <template #body="slotProps">
          <Tag :value="getTypeText(slotProps.data.type)" :severity="getTypeSeverity(slotProps.data.type)" />
        </template>
      </Column>
      <Column key="remark" field="remark" header="步骤描述" class="min-w-[200px]" />
      <Column key="proportion" field="proportion" header="分数占比" style="width: 100px">
        <template #body="slotProps">
          {{ slotProps.data.proportion }}%
        </template>
      </Column>
      <Column key="timeRange" header="时间范围" style="width: 180px">
        <template #body="slotProps">
          <div class="text-xs">
            <div v-if="slotProps.data.startTime">{{ formatDateTime(slotProps.data.startTime) }}</div>
            <div v-if="slotProps.data.endTime" class="text-slate-500">{{ formatDateTime(slotProps.data.endTime) }}</div>
            <div v-if="!slotProps.data.startTime && !slotProps.data.endTime" class="text-slate-400">-</div>
          </div>
        </template>
      </Column>
      <Column key="typeDetails" header="类型详情" style="width: 200px">
        <template #body="slotProps">
          <div v-if="slotProps.data.type === 1" class="text-xs space-y-1">
            <div>视频: {{ slotProps.data.videoTitle || 'N/A' }}</div>
            <div class="text-slate-500">时长: {{ formatDuration(slotProps.data.videoSeconds) }}</div>
          </div>
          <div v-else-if="slotProps.data.type === 2" class="text-xs">
            <Tag :value="getDataCollectionTypeText(slotProps.data.dataCollectionType)" severity="info" />
          </div>
          <div v-else-if="slotProps.data.type === 3" class="text-xs">
            <Tag :value="slotProps.data.isRandom ? '随机' : '指定'" severity="info" />
          </div>
        </template>
      </Column>
      <Column key="isSkip" header="可跳过" style="width: 100px">
        <template #body="slotProps">
          <Tag :value="slotProps.data.isSkip ? '是' : '否'" :severity="slotProps.data.isSkip ? 'info' : 'secondary'" />
        </template>
      </Column>
      <Column key="actions" header="操作" style="width: 150px">
        <template #body="slotProps">
          <div class="flex gap-2">
            <Button icon="pi pi-pencil" outlined size="small" @click="handleEdit(slotProps.data)" />
            <Button icon="pi pi-trash" outlined severity="danger" size="small"
              @click="handleDelete(slotProps.data)" :loading="deleteMutation.isPending.value" />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- 添加步骤对话框 -->
    <ProcedureFormDialog
      ref="procedureFormDialogRef"
      :experiment-id="experimentId"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useQueryProceduresByExperiment } from '@/features/teacher/experiment/procedure/hooks/useQueryProcedure'
import { useDeleteProcedure } from '@/features/teacher/experiment/procedure/hooks/useMutateProcedureDelete'
import type { TeacherProcedureDetailResponse } from '@/core/api/generated'
import ProcedureFormDialog from './ProcedureFormDialog.vue'

interface Props {
  experimentId: number
}

interface Emits {
  (e: 'refresh'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const toast = useToast()
const confirm = useConfirm()

const proceduresQuery = useQueryProceduresByExperiment(
  computed(() => props.experimentId),
  { enable: true },
)

const deleteMutation = useDeleteProcedure()
const procedureFormDialogRef = ref<InstanceType<typeof ProcedureFormDialog>>()

const handleOpenAddDialog = () => {
  procedureFormDialogRef.value?.open()
  proceduresQuery.refetch()
}

const handleEdit = (_procedure: TeacherProcedureDetailResponse) => {
  toast.add({
    severity: 'info',
    summary: '提示',
    detail: '编辑步骤功能开发中',
    life: 3000,
  })
}

const handleDelete = (procedure: TeacherProcedureDetailResponse) => {
  confirm.require({
    message: '确定要删除此步骤吗？',
    header: '删除确认',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: '取消',
    acceptLabel: '删除',
    acceptClass: 'p-button-danger',
    accept: () => confirmDelete(procedure.id!),
  })
}

const confirmDelete = async (id: number) => {
  await deleteMutation.mutateAsync({
    path: { procedureId: id },
  })
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: '步骤删除成功',
    life: 3000,
  })
  proceduresQuery.refetch()
  emit('refresh')
}

const getTypeText = (type: number | undefined) => {
  const typeMap: Record<number, string> = {
    1: '观看视频',
    2: '数据收集',
    3: '题库答题',
  }
  return typeMap[type || 1] || '未知'
}

const getTypeSeverity = (type: number | undefined) => {
  const severityMap: Record<number, string> = {
    1: 'info',
    2: 'success',
    3: 'warning',
  }
  return severityMap[type || 1] || 'secondary'
}

const getDataCollectionTypeText = (type: number | undefined) => {
  const typeMap: Record<number, string> = {
    1: '关键数据',
    2: '表格数据',
  }
  return typeMap[type || 1] || '未知'
}

const formatDateTime = (dateStr: string | undefined) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatDuration = (seconds: number | undefined) => {
  if (!seconds) return '-'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}
</script>
