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
            <Column key="attendanceStatus" header="签到状态">
              <template #body="slotProps">
                <Tag
                  :value="getAttendanceStatusText(slotProps.data.attendanceStatus)"
                  :severity="getAttendanceStatusSeverity(slotProps.data.attendanceStatus)"
                />
              </template>
            </Column>
            <Column key="attendanceTime" header="签到时间">
              <template #body="slotProps">
                {{ formatDateTime(slotProps.data.attendanceTime) }}
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
            <Column key="attendanceStatus" header="签到状态">
              <template #body="slotProps">
                <Tag
                  :value="getAttendanceStatusText(slotProps.data.attendanceStatus)"
                  :severity="getAttendanceStatusSeverity(slotProps.data.attendanceStatus)"
                />
              </template>
            </Column>
            <Column key="attendanceTime" header="签到时间">
              <template #body="slotProps">
                {{ formatDateTime(slotProps.data.attendanceTime) }}
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
import { ATTENDANCE_STATUS } from '@/features/teacher/experiment/attendance/constants'
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

// ==================== 工具函数 ====================
const getAttendanceStatusText = (status: number | undefined) => {
  const statusMap: Record<number, string> = {
    [ATTENDANCE_STATUS.NORMAL]: '正常签到',
    [ATTENDANCE_STATUS.LATE]: '迟到',
    [ATTENDANCE_STATUS.EXCUSED]: '请假',
    [ATTENDANCE_STATUS.ABSENT]: '未签到',
  }
  return statusMap[status || ATTENDANCE_STATUS.ABSENT] || '未知'
}

const getAttendanceStatusSeverity = (status: number | undefined) => {
  const severityMap: Record<number, string> = {
    [ATTENDANCE_STATUS.NORMAL]: 'success',
    [ATTENDANCE_STATUS.LATE]: 'warning',
    [ATTENDANCE_STATUS.EXCUSED]: 'info',
    [ATTENDANCE_STATUS.ABSENT]: 'danger',
  }
  return severityMap[status || ATTENDANCE_STATUS.ABSENT] || 'secondary'
}

const loadAttendance = () => {
  if (!props.classCode) return
  attendanceList.refetch()
}

// ==================== 操作处理 ====================
const markAsPresent = (student: StudentAttendanceInfo) => {
  if (!student.studentUsername) return

  updateMutation.mutate(
    {
      classExperimentId: props.classExperimentId,
      studentUsername: student.studentUsername,
      attendanceStatus: ATTENDANCE_STATUS.NORMAL,
    },
    {
      onSuccess: () => {
        loadAttendance()
      },
    },
  )
}

const markAsExcused = (student: StudentAttendanceInfo) => {
  if (!student.studentUsername) return

  updateMutation.mutate(
    {
      classExperimentId: props.classExperimentId,
      studentUsername: student.studentUsername,
      attendanceStatus: ATTENDANCE_STATUS.EXCUSED,
    },
    {
      onSuccess: () => {
        loadAttendance()
      },
    },
  )
}
</script>
