<template>
  <div class="space-y-4">
    <!-- 班级选择 -->
    <Card>
      <template #content>
        <div class="flex flex-wrap gap-4 items-end">
          <div class="flex-1">
            <label class="mb-2 block text-sm font-medium text-slate-700">选择班级</label>
            <Select
              v-model="selectedClassCode"
              :options="classOptions"
              option-label="label"
              option-value="value"
              placeholder="请选择班级"
              class="w-full"
              :loading="classesQuery.query.isLoading.value"
              filter
            />
          </div>
          <Button label="查询" @click="loadAttendance" :disabled="!selectedClassCode" />
        </div>
      </template>
    </Card>

    <!-- 签到统计信息 -->
    <Card v-if="statistics.data.value !== undefined" class="mb-4">
      <template #content>
        <div class="flex items-center justify-center">
          <p class="text-slate-600">实验签到总人数：</p>
          <p class="ml-2 text-2xl font-bold text-blue-600">
            {{ statistics.data.value }}
          </p>
        </div>
      </template>
    </Card>

    <!-- 签到列表 -->
    <Card v-if="attendanceList.data.value">
      <template #title>学生签到列表</template>
      <template #content>
        <DataTable
          :value="getAttendanceStudents()"
          :loading="attendanceList.isLoading.value"
          :paginator="true"
          :rows="ATTENDANCE_TABLE_PAGE_SIZE"
        >
          <Column key="studentName" field="studentName" header="学生姓名" />
          <Column key="studentNumber" field="studentNumber" header="学号" />
          <Column key="classCode" field="classCode" header="班级" />
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
          <Column key="actions" header="操作">
            <template #body="slotProps">
              <div class="flex gap-2">
                <Button
                  v-if="canUpdateAttendance(slotProps.data)"
                  label="标记为已到"
                  size="small"
                  outlined
                  @click="markAsPresent(slotProps.data)"
                  :loading="updateMutation.isPending.value"
                />
                <Button
                  v-if="canUpdateAttendance(slotProps.data)"
                  label="标记为请假"
                  size="small"
                  outlined
                  severity="secondary"
                  @click="markAsExcused(slotProps.data)"
                  :loading="updateMutation.isPending.value"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- 未签到列表 -->
    <Card v-if="attendanceData?.notAttendanceList?.length">
      <template #title>未签到学生</template>
      <template #content>
        <DataTable
          :value="attendanceData.notAttendanceList"
          :paginator="true"
          :rows="NOT_ATTENDANCE_TABLE_PAGE_SIZE"
        >
          <Column key="studentName" field="studentName" header="学生姓名" />
          <Column key="studentNumber" field="studentNumber" header="学号" />
          <Column key="classCode" field="classCode" header="班级" />
          <Column key="actions" header="操作">
            <template #body="slotProps">
              <Button
                label="手动签到"
                size="small"
                @click="manualCheckIn(slotProps.data)"
                :loading="updateMutation.isPending.value"
              />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useQueryClassAll } from '@/features/teacher/class/hooks/useQueryClass'
import { useQueryAttendanceList } from '@/features/teacher/experiment/attendance/hooks/useQueryAttendanceList'
import { useQueryAttendanceStatistics } from '@/features/teacher/experiment/attendance/hooks/useQueryAttendanceStatistics'
import { useUpdateAttendanceSuccess } from '@/features/teacher/experiment/attendance/hooks/useMutateAttendanceUpdate'
import { ATTENDANCE_STATUS } from '@/features/teacher/experiment/attendance/constants'
import { ATTENDANCE_TABLE_PAGE_SIZE, NOT_ATTENDANCE_TABLE_PAGE_SIZE } from '@/features/teacher/class-experiment/constants'
import type { StudentAttendanceInfo, AttendanceListResponse } from '@/core/api/generated'

interface Props {
  experimentId: number
  courseId: string
}

const props = defineProps<Props>()

// 获取班级列表
const classesQuery = useQueryClassAll()

// 班级选项
const classOptions = computed(() => {
  const pageData = classesQuery.query.data.value
  const classes = pageData?.records || []
  return classes.map((c) => ({
    label: `${c.className} (${c.classCode})`,
    value: c.classCode,
  }))
})

const selectedClassCode = ref<string | null>(null)
const selectedClassExperimentId = ref<number>(0)

// 查询签到列表（需要 classCode 和 experimentId）
const attendanceList = useQueryAttendanceList({
  classCode: computed(() => selectedClassCode.value ?? ''),
  experimentId: computed(() => String(props.experimentId)),
  enable: computed(() => Boolean(selectedClassCode.value)),
})

// 从响应中提取 classExperimentId（如果有的话）
watchEffect(() => {
  const data = attendanceList.data.value
  // 使用类型守卫安全地访问可能存在的字段
  if (data && 'classExperimentId' in data && typeof data.classExperimentId === 'number') {
    selectedClassExperimentId.value = data.classExperimentId
  }
})

// 查询签到统计（需要 courseId）
const statistics = useQueryAttendanceStatistics({
  courseId: computed(() => props.courseId),
  experimentId: computed(() => String(props.experimentId)),
  enable: computed(() => Boolean(selectedClassCode.value)),
})

// 更新签到
const updateMutation = useUpdateAttendanceSuccess()

// 计算签到数据
const attendanceData = computed((): AttendanceListResponse | null => {
  return attendanceList.data.value || null
})

const loadAttendance = () => {
  if (!selectedClassCode.value) return
  attendanceList.refetch()
  statistics.refetch()
}

// 获取签到学生列表（正常签到 + 跨班级签到）
const getAttendanceStudents = (): StudentAttendanceInfo[] => {
  const data = attendanceData.value
  if (!data) return []

  const students: StudentAttendanceInfo[] = []

  if (data.normalAttendanceList) {
    students.push(...data.normalAttendanceList)
  }

  if (data.crossClassAttendanceList) {
    students.push(...data.crossClassAttendanceList)
  }

  return students
}

// 获取签到状态文本
const getAttendanceStatusText = (status: number | undefined) => {
  const statusMap: Record<number, string> = {
    [ATTENDANCE_STATUS.NORMAL]: '正常签到',
    [ATTENDANCE_STATUS.LATE]: '迟到',
    [ATTENDANCE_STATUS.EXCUSED]: '请假',
    [ATTENDANCE_STATUS.ABSENT]: '未签到',
  }
  return statusMap[status || ATTENDANCE_STATUS.ABSENT] || '未知'
}

// 获取签到状态颜色
const getAttendanceStatusSeverity = (status: number | undefined) => {
  const severityMap: Record<number, string> = {
    [ATTENDANCE_STATUS.NORMAL]: 'success',
    [ATTENDANCE_STATUS.LATE]: 'warning',
    [ATTENDANCE_STATUS.EXCUSED]: 'info',
    [ATTENDANCE_STATUS.ABSENT]: 'danger',
  }
  return severityMap[status || ATTENDANCE_STATUS.ABSENT] || 'secondary'
}

// 是否可以更新签到状态
const canUpdateAttendance = (student: StudentAttendanceInfo) => {
  return student.studentUsername !== undefined && selectedClassExperimentId.value > 0
}

// 标记为已到
const markAsPresent = (student: StudentAttendanceInfo) => {
  if (!student.studentUsername) return

  updateMutation.mutate(
    {
      classExperimentId: selectedClassExperimentId.value,
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

// 标记为请假
const markAsExcused = (student: StudentAttendanceInfo) => {
  if (!student.studentUsername) return

  updateMutation.mutate(
    {
      classExperimentId: selectedClassExperimentId.value,
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

// 手动签到
const manualCheckIn = (student: StudentAttendanceInfo) => {
  // 这里需要调用创建签到的接口
  console.log('手动签到:', student)
}

const formatDateTime = (dateStr: string | undefined) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('zh-CN')
}
</script>
