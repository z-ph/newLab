<template>
  <Dialog v-model:visible="visible" :header="`实验管理 - ${className}`" :modal="true" :style="{ width: '90vw' }">
    <div class="flex flex-col gap-4">
      <!-- 操作按钮 -->
      <div class="flex justify-end">
        <Button label="绑定实验" icon="pi pi-plus" @click="openBindDialog" />
      </div>

      <!-- 按课程分组的实验列表 -->
      <Card>
        <template #content>
          <div v-if="query.isLoading.value" class="flex justify-center p-8">
            <ProgressSpinner />
          </div>

          <Accordion v-else :value="[]">
            <AccordionPanel v-for="courseGroup in courseGroups" :key="courseGroup.courseId" :value="courseGroup.courseId">
              <AccordionHeader>
                <div class="flex items-center justify-between w-full">
                  <div class="flex items-center gap-2">
                    <i class="pi pi-book text-slate-600"></i>
                    <span class="font-semibold text-slate-900">{{ courseGroup.courseInfo?.courseName }}</span>
                    <Tag :value="`${courseGroup.experiments.length} 个实验`" severity="secondary" />
                  </div>
                </div>
              </AccordionHeader>
              <AccordionContent>
                <!-- 实验列表 -->
                <DataTable :value="courseGroup.experiments" :paginator="courseGroup.experiments.length > 5"
                  :rows="5" :pt="{ header: { class: 'px-0!' } }">
                  <Column field="experimentName" header="实验名称" />
                  <Column field="courseTime" header="上课时间" />
                  <Column field="percentage" header="占比">
                    <template #body="slotProps">
                      {{ slotProps.data.percentage }}%
                    </template>
                  </Column>
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
              </AccordionContent>
            </AccordionPanel>
          </Accordion>

          <div v-if="!query.isLoading.value && courseGroups.length === 0" class="text-center p-8 text-slate-500">
            暂无实验数据
          </div>
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
import type { ExperimentDetailItem, ClassWithExperimentsResponse, ExperimentInfo } from '@/core/api/generated'
import BindClassExperimentDialog from '@/features/teacher/class-experiment/components/BindClassExperimentDialog.vue'
import AttendanceManagementDialog from '@/features/teacher/class-experiment/components/AttendanceManagementDialog.vue'
import StudentGradingDialog from '@/features/teacher/class-experiment/components/StudentGradingDialog.vue'
import ClassExperimentStatisticsDialog from '@/features/teacher/class-experiment/components/ClassExperimentStatisticsDialog.vue'
import type { ClassCode, ClassExperimentId, ClassName } from '../../class-experiment'
import { useQueryClassExperimentsGroupedByCourse, toCourseGroups } from '../hooks/useQueryClassExperimentsGroupedByCourse'
import { useUnbindExperiment } from '../hooks/useMutateClassExperiment'

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
const { query } = useQueryClassExperimentsGroupedByCourse(classCode)
const courseGroups = computed(() => toCourseGroups(query.data.value))

// ==================== 删除逻辑 ====================
const deleteMutation = useUnbindExperiment()
const confirm = useConfirm()

const handleDelete = (experiment: ExperimentDetailItem) => {
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

// 将 ExperimentDetailItem 转换为 ExperimentInfo
function toExperimentInfo(item: ExperimentDetailItem, courseId?: string): ExperimentInfo {
  return {
    classExperimentId: item.classExperimentId,
    experimentId: item.experimentId?.toString(),
    experimentName: item.experimentName,
    courseTime: item.courseTime,
    startTime: item.startTime,
    endTime: item.endTime,
    experimentLocation: item.experimentLocation,
    userName: item.userName,
    courseId,
  }
}

const openAttendanceDialog = (experiment: ExperimentDetailItem) => {
  attendanceDialogRef.value?.open({ classExperiment: toExperimentInfo(experiment) })
  classExperimentId.value = experiment.classExperimentId
}

const openGradingDialog = (experiment: ExperimentDetailItem) => {
  gradingDialogRef.value?.open({ classExperiment: toExperimentInfo(experiment) })
}

const openStatisticsDialog = (experiment: ExperimentDetailItem) => {
  statisticsDialogRef.value?.open({ classExperiment: toExperimentInfo(experiment) })
}
</script>
