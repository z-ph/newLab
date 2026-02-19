<template>
  <Dialog v-model:visible="visible" header="签到管理" :modal="true" :style="{ maxWidth: '100vw' }">
    <div v-if="classExperiment" class="space-y-4">
      <!-- 签到列表 -->
      <Card v-if="attendanceList.data.value?.normalAttendanceList?.length">
        <template #title>本班签到列表</template>
        <template #content>
          <DataTable
            :value="attendanceList.data.value.normalAttendanceList"
            :loading="attendanceList.isLoading.value"
            :paginator="true"
            :rows="ATTENDANCE_TABLE_PAGE_SIZE"
          >
            <Column key="studentName" field="studentName" header="学生姓名" />
            <Column key="studentUsername" field="studentUsername" header="学号" />
            <Column key="className" field="className" header="班级" />
            <Column key="attendanceTime" header="签到时间">
              <template #body="slotProps">
                {{ formatDateTime(slotProps.data.attendanceTime) }}
              </template>
            </Column>
            <Column key="attendanceStatus" header="签到状态">
              <template #body="slotProps">
                <Select
                  :model-value="slotProps.data.attendanceStatus"
                  :options="ATTENDANCE_STATUS_OPTIONS"
                  option-label="label"
                  option-value="value"
                  placeholder="选择状态"
                  class="w-full"
                  @update:model-value="(value) => updateAttendanceStatus(slotProps.data, value)"
                  :loading="updateMutation.isPending.value"
                />
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>

      <!-- 跨班签到列表 -->
      <Card v-if="attendanceList.data.value?.crossClassAttendanceList?.length">
        <template #title>跨班签到列表</template>
        <template #content>
          <DataTable
            :value="attendanceList.data.value.crossClassAttendanceList"
            :loading="attendanceList.isLoading.value"
            :paginator="true"
            :rows="ATTENDANCE_TABLE_PAGE_SIZE"
          >
            <Column key="studentName" field="studentName" header="学生姓名" />
            <Column key="studentUsername" field="studentUsername" header="学号" />
            <Column key="className" field="className" header="班级" />
            <Column key="attendanceTime" header="签到时间">
              <template #body="slotProps">
                {{ formatDateTime(slotProps.data.attendanceTime) }}
              </template>
            </Column>
            <Column key="attendanceStatus" header="签到状态">
              <template #body="slotProps">
                <Select
                  :model-value="slotProps.data.attendanceStatus"
                  :options="ATTENDANCE_STATUS_OPTIONS"
                  option-label="label"
                  option-value="value"
                  placeholder="选择状态"
                  class="w-full"
                  @update:model-value="(value) => updateAttendanceStatus(slotProps.data, value)"
                  :loading="updateMutation.isPending.value"
                />
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>

      <!-- 未签到列表 -->
      <Card v-if="attendanceData?.notAttendanceList?.length">
        <template #title>未签到学生</template>
        <template #content>
          <DataTable :value="attendanceData.notAttendanceList" :paginator="true" :rows="NOT_ATTENDANCE_TABLE_PAGE_SIZE">
            <Column key="studentName" field="studentName" header="学生姓名" />
            <Column key="studentUsername" field="studentUsername" header="学号" />
            <Column key="className" field="className" header="班级" />
            <Column key="actions" header="操作">
              <template #body="slotProps">
                <Button
                  label="手动签到"
                  size="small"
                  outlined
                  @click="markAsPresent(slotProps.data)"
                  :loading="updateMutation.isPending.value"
                />
                <Button
                  label="标记为请假"
                  size="small"
                  outlined
                  severity="secondary"
                  @click="markAsExcused(slotProps.data)"
                  :loading="updateMutation.isPending.value"
                />
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ExperimentInfo, StudentAttendanceInfo, AttendanceListResponse } from '@/core/api/generated'
import type { ClassCode, ClassExperimentId } from '../types'
import { useQueryAttendanceList } from '@/features/teacher/experiment/attendance/hooks/useQueryAttendanceList'
import { useUpdateAttendanceSuccess } from '@/features/teacher/experiment/attendance/hooks/useMutateAttendanceUpdate'
import { ATTENDANCE_STATUS, ATTENDANCE_STATUS_OPTIONS } from '@/features/teacher/experiment/attendance/constants'
import { ATTENDANCE_TABLE_PAGE_SIZE, NOT_ATTENDANCE_TABLE_PAGE_SIZE } from '@/features/teacher/class-experiment/constants'
import { formatDateTime } from '@/features/shared/utils/formatters'

interface Props {
  classCode: ClassCode
  classExperimentId?: ClassExperimentId
}

const props = defineProps<Props>()
const visible = ref(false)
const classExperiment = ref<ExperimentInfo>()

interface OpenOptions {
  classExperiment: ExperimentInfo
}

function open(options: OpenOptions) {
  classExperiment.value = options.classExperiment
  visible.value = true
}

defineExpose({ open })

// ==================== 数据查询 ====================
const attendanceList = useQueryAttendanceList({
  classCode: computed(() => props.classCode ?? ''),
  experimentId: computed(() => String(classExperiment.value?.experimentId ?? '')),
  enable: computed(() => Boolean(props.classCode && classExperiment.value?.experimentId)),
})


const updateMutation = useUpdateAttendanceSuccess()

// ==================== 计算属性 ====================
const attendanceData = computed((): AttendanceListResponse | null => {
  return attendanceList.data.value || null
})

// ==================== 操作处理 ====================
const updateAttendanceStatus = (student: StudentAttendanceInfo, status: number) => {
  if (!student.studentUsername) return

  updateMutation.mutate({
    classExperimentId: props.classExperimentId,
    studentUsername: student.studentUsername,
    attendanceStatus: status,
  })
}

const markAsPresent = (student: StudentAttendanceInfo) => {
  updateAttendanceStatus(student, ATTENDANCE_STATUS.NORMAL)
}

const markAsExcused = (student: StudentAttendanceInfo) => {
  updateAttendanceStatus(student, ATTENDANCE_STATUS.EXCUSED)
}
</script>
