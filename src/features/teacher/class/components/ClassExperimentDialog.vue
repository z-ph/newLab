<template>
  <Dialog v-model:visible="visible" :header="`实验管理 - ${className}`" :modal="true" :style="{ width: '90vw' }">
    <div class="flex flex-col gap-4">
      <!-- 操作按钮 -->
      <div class="flex justify-end">
        <Button label="绑定实验" icon="pi pi-plus" @click="openBindDialog" />
      </div>

      <!-- 实验表格 -->
      <Card>
        <template #content>
          <DataTable :value="experiments" :loading="query.isLoading.value" :paginator="true" :rows="size"
            :total-records="total" :lazy="true" @page="onPageChange" :pt="{ header: { class: 'px-0!' } }">
            <template #header>
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-slate-900">实验列表</h2>
              </div>
            </template>

            <Column field="experimentName" header="实验名称" />
            <Column field="courseTime" header="上课时间" />
            <Column field="startTime" header="开始时间">
              <template #body="slotProps">
                {{ formatDateTime(slotProps.data.startTime) }}
              </template>
            </Column>
            <Column field="endTime" header="结束时间">
              <template #body="slotProps">
                {{ formatDateTime(slotProps.data.endTime) }}
              </template>
            </Column>
            <Column field="experimentLocation" header="地点" />
            <Column header="操作">
              <template #body="slotProps">
                <div class="flex gap-2">
                  <Button icon="pi pi-check-circle" outlined size="small" v-tooltip.top="'签到管理'"
                    @click="openAttendanceDialog(slotProps.data)" />
                  <Button icon="pi pi-pencil" outlined size="small" v-tooltip.top="'学生批改'"
                    @click="openGradingDialog(slotProps.data)" />
                  <Button icon="pi pi-chart-bar" outlined size="small" v-tooltip.top="'统计信息'"
                    @click="openStatisticsDialog(slotProps.data)" />
                  <Button icon="pi pi-trash" outlined severity="danger" size="small" v-tooltip.top="'删除'"
                    @click="handleDelete(slotProps.data)" :loading="deleteMutation.isPending.value" />
                </div>
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>

    <!-- 子对话框 -->
    <BindClassExperimentDialog ref="bindDialogRef" />
    <AttendanceManagementDialog ref="attendanceDialogRef" :classCode="classCode"
      :class-experiment-id="classExperimentId" />
    <StudentGradingDialog ref="gradingDialogRef" />
    <ClassExperimentStatisticsDialog ref="statisticsDialogRef" />
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import type { DataTablePageEvent } from 'primevue/datatable'
import type { ClassWithExperimentsResponse, ExperimentInfo } from '@/core/api/generated'
import BindClassExperimentDialog from '@/features/teacher/class-experiment/components/BindClassExperimentDialog.vue'
import AttendanceManagementDialog from '@/features/teacher/class-experiment/components/AttendanceManagementDialog.vue'
import StudentGradingDialog from '@/features/teacher/class-experiment/components/StudentGradingDialog.vue'
import ClassExperimentStatisticsDialog from '@/features/teacher/class-experiment/components/ClassExperimentStatisticsDialog.vue'
import type { ClassCode, ClassExperimentId, ClassName } from '../../class-experiment'
import { useQueryClassExperiments } from '../hooks/useQueryClassExperiments'
import { useUnbindExperiment } from '../hooks/useMutateClassExperiment'
import { formatDateTime } from '@/features/shared/utils'

// ==================== 对话框状态 ====================
const visible = ref(false)
const classCode = ref<ClassCode>()
const className = ref<ClassName>()
const classExperimentId = ref<ClassExperimentId>()

type OpenOptions = ClassWithExperimentsResponse

function open(options: OpenOptions) {
  console.log(options)
  classCode.value = options.classCode
  className.value = options.className
  visible.value = true
}

function close() {
  visible.value = false
}

defineExpose({ open, close })

// ==================== 数据查询 ====================
const { current, size, query } = useQueryClassExperiments(classCode)
const experiments = computed(() => query.data.value || [])
const total = computed(() => experiments.value.length)

// ==================== 分页逻辑 ====================
const onPageChange = (event: DataTablePageEvent) => {
  current.value = event.page + 1
}

// ==================== 删除逻辑 ====================
const deleteMutation = useUnbindExperiment()
const confirm = useConfirm()

const handleDelete = (experiment: ExperimentInfo) => {
  const experimentId = experiment.experimentId
  if (!experimentId || !classCode.value) return

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
        body: [classCode.value!],
      })
      query.refetch()
    },
  })
}

// ==================== 子对话框 Ref ====================
const bindDialogRef = ref<InstanceType<typeof BindClassExperimentDialog>>()
const attendanceDialogRef = ref<InstanceType<typeof AttendanceManagementDialog>>()
const gradingDialogRef = ref<InstanceType<typeof StudentGradingDialog>>()
const statisticsDialogRef = ref<InstanceType<typeof ClassExperimentStatisticsDialog>>()

// ==================== 打开子对话框 ====================
const openBindDialog = () => {
  bindDialogRef.value?.open()
}

const openAttendanceDialog = (experiment: ExperimentInfo) => {
  attendanceDialogRef.value?.open({ classExperiment: experiment })
  classExperimentId.value = experiment.classExperimentId
}

const openGradingDialog = (experiment: ExperimentInfo) => {
  gradingDialogRef.value?.open({ classExperiment: experiment })
}

const openStatisticsDialog = (experiment: ExperimentInfo) => {
  statisticsDialogRef.value?.open({ classExperiment: experiment })
}
</script>
