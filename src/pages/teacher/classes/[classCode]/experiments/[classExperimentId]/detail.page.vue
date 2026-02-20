<template>
  <div class="p-1">
    <Card>
      <template #content>
        <div class="mb-4 flex items-center justify-between">
          <h1 class="text-xl font-bold text-slate-900">{{ pageTitle }}</h1>
          <Button label="返回" icon="pi pi-arrow-left" severity="secondary" @click="handleBack" />
        </div>

        <Tabs v-model:value="activeTab">
          <TabList>
            <Tab value="attendance">签到管理</Tab>
            <Tab value="grading">学生批改</Tab>
          </TabList>
          <TabPanels>
            <!-- 签到管理 -->
            <TabPanel value="attendance">
              <div v-if="attendanceData" class="space-y-4">
                <!-- 签到列表 -->
                <Card v-if="attendanceData.normalAttendanceList?.length">
                  <template #title>本班签到列表</template>
                  <template #content>
                    <DataTable
                      :value="attendanceData.normalAttendanceList"
                      :loading="attendanceList.isLoading.value"
                      :paginator="true"
                      :rows="10"
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
                <Card v-if="attendanceData.crossClassAttendanceList?.length">
                  <template #title>跨班签到列表</template>
                  <template #content>
                    <DataTable
                      :value="attendanceData.crossClassAttendanceList"
                      :loading="attendanceList.isLoading.value"
                      :paginator="true"
                      :rows="10"
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
                <Card v-if="attendanceData.notAttendanceList?.length">
                  <template #title>未签到学生</template>
                  <template #content>
                    <DataTable :value="attendanceData.notAttendanceList" :paginator="true" :rows="10">
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

                <div v-if="!attendanceList.isLoading.value && !attendanceData?.normalAttendanceList?.length && !attendanceData?.crossClassAttendanceList?.length && !attendanceData?.notAttendanceList?.length" class="text-center p-8 text-slate-500">
                  暂无签到数据
                </div>
              </div>
            </TabPanel>

            <!-- 学生批改 -->
            <TabPanel value="grading">
              <div class="flex gap-4">
                <!-- 左侧：学生列表 -->
                <div class="w-1/3 overflow-y-auto border-r border-slate-200 pr-4">
                  <h3 class="mb-4 text-lg font-semibold text-slate-900">学生列表</h3>
                  <div v-if="studentSubmissions.isLoading.value" class="text-center text-slate-500">
                    <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
                    <p class="mt-2">{{ LOADING_MESSAGE }}</p>
                  </div>
                  <div v-else-if="studentsList.length === 0" class="text-center text-slate-500">
                    <p>{{ NO_SUBMISSION_MESSAGE }}</p>
                  </div>
                  <div v-else class="space-y-2">
                    <div
                      v-for="student in studentsList"
                      :key="student.studentUsername"
                      :class="[
                        'cursor-pointer rounded-lg border p-3 transition-colors',
                        selectedStudent?.studentUsername === student.studentUsername
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50',
                      ]"
                      @click="selectStudent(student)"
                    >
                      <div class="flex items-center justify-between">
                        <div>
                          <p class="font-medium text-slate-900">{{ student.studentName }}</p>
                          <p class="text-sm text-slate-600">{{ student.studentUsername }}</p>
                        </div>
                        <Badge
                          :value="student.submissionCount"
                          :severity="student.submissionCount > 0 ? 'info' : 'secondary'"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 右侧：步骤提交列表 -->
                <div class="w-2/3 overflow-y-auto pl-4">
                  <h3 class="mb-4 text-lg font-semibold text-slate-900">步骤提交</h3>
                  <div v-if="!selectedStudent" class="text-center text-slate-500">
                    <p>{{ NO_STUDENT_SELECTED_MESSAGE }}</p>
                  </div>
                  <div v-else-if="studentSubmissions.isLoading.value" class="text-center text-slate-500">
                    <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
                    <p class="mt-2">{{ LOADING_STUDENT_MESSAGE }}</p>
                  </div>
                  <div v-else-if="selectedStudentSubmissions.length === 0" class="text-center text-slate-500">
                    <p>{{ NO_STUDENT_SUBMISSION_MESSAGE }}</p>
                  </div>
                  <div v-else class="space-y-4">
                    <Card
                      v-for="submission in selectedStudentSubmissions"
                      :key="submission.id"
                      class="cursor-pointer transition-shadow hover:shadow-md"
                      @click="viewSubmissionDetail(submission)"
                    >
                      <template #title>
                        <div class="flex items-center justify-between">
                          <span>{{ submission.submissionType || DEFAULT_SUBMISSION_TITLE }}</span>
                          <Tag
                            :value="getSubmissionStatusText(submission.submissionStatus)"
                            :severity="getSubmissionStatusSeverity(submission.submissionStatus)"
                          />
                        </div>
                      </template>
                      <template #subtitle>
                        <div class="text-sm text-slate-600">
                          <p>{{ SUBMIT_TIME_LABEL }}: {{ formatDateTime(submission.submissionTime) }}</p>
                        </div>
                      </template>
                      <template #content>
                        <div
                          v-if="submission.submissionStatus === SUBMISSION_STATUS.GRADED"
                          class="flex items-center justify-between"
                        >
                          <div>
                            <p class="text-sm text-slate-600">{{ SCORE_DISPLAY }}: {{ submission.score }}</p>
                            <p v-if="submission.teacherComment" class="mt-1 text-sm text-slate-600">
                              {{ COMMENT_DISPLAY }}: {{ submission.teacherComment }}
                            </p>
                          </div>
                          <Button
                            :label="REGRADE_BUTTON"
                            outlined
                            size="small"
                            @click.stop="openGradeDialog(submission)"
                          />
                        </div>
                        <div v-else class="flex justify-end">
                          <Button
                            :label="GRADE_BUTTON"
                            outlined
                            size="small"
                            @click.stop="openGradeDialog(submission)"
                          />
                        </div>
                      </template>
                    </Card>
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </template>
    </Card>

    <!-- 批改对话框 -->
    <GradeDialog ref="gradeDialogRef" @success="studentSubmissions.refetch" />

    <!-- 步骤详情对话框 -->
    <ProcedureDetailDialog ref="detailDialogRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Card from 'primevue/card'
import type { StudentAttendanceInfo, AttendanceListResponse } from '@/core/api/generated'
import { useQueryAttendanceList } from '@/features/teacher/experiment/attendance/hooks/useQueryAttendanceList'
import { useUpdateAttendanceSuccess } from '@/features/teacher/experiment/attendance/hooks/useMutateAttendanceUpdate'
import { ATTENDANCE_STATUS, ATTENDANCE_STATUS_OPTIONS } from '@/features/teacher/experiment/attendance/constants'
import { formatDateTime } from '@/features/shared/utils/formatters'
import { useQueryClassExperimentDetail } from '@/features/teacher/class/hooks/useQueryClassExperimentDetail'
import { useQueryStudentSubmissions, useStudentList } from '@/features/teacher/class-experiment/hooks'
import type { StudentSummary } from '@/features/teacher/class-experiment/hooks'
import { getSubmissionStatusText, getSubmissionStatusSeverity } from '@/features/teacher/class-experiment/utils/submission'
import { SUBMISSION_STATUS } from '@/features/teacher/class-experiment/constants/submission'
import {
  LOADING_MESSAGE,
  NO_SUBMISSION_MESSAGE,
  NO_STUDENT_SELECTED_MESSAGE,
  LOADING_STUDENT_MESSAGE,
  NO_STUDENT_SUBMISSION_MESSAGE,
  DEFAULT_SUBMISSION_TITLE,
  SUBMIT_TIME_LABEL,
  SCORE_DISPLAY,
  COMMENT_DISPLAY,
  REGRADE_BUTTON,
  GRADE_BUTTON,
} from '@/features/teacher/class-experiment/constants/messages'
import GradeDialog from '@/features/teacher/class-experiment/components/GradeDialog.vue'
import ProcedureDetailDialog from '@/features/teacher/class-experiment/components/ProcedureDetailDialog.vue'

const router = useRouter()
const route = useRoute()

const classCode = computed(() => (route.params as any).classCode as string)
const classExperimentId = computed(() => Number((route.params as any).classExperimentId as string))

// 从 query 获取标题和实验信息
const pageTitle = computed(() => {
  const title = route.query.title as string
  return title ? decodeURIComponent(title) : '实验详情'
})

const activeTab = ref('attendance')

// ==================== 签到管理 ====================
const attendanceList = useQueryAttendanceList({
  classCode,
  experimentId: computed(() => {
    const id = route.query.experimentId
    return id ? String(id) : ''
  }),
  enable: computed(() => Boolean(classCode.value && route.query.experimentId)),
})

const updateMutation = useUpdateAttendanceSuccess()

const attendanceData = computed((): AttendanceListResponse | null => {
  return attendanceList.data.value || null
})

// ==================== 学生批改 ====================
// 查询实验详情获取courseId
const experimentDetailQuery = useQueryClassExperimentDetail(
  classCode,
  computed(() => route.query.experimentId as string)
)

const courseId = computed(() => experimentDetailQuery.data.value?.courseId)

// 查询学生提交
const studentSubmissions = useQueryStudentSubmissions(courseId, {
  enable: computed(() => Boolean(courseId.value)),
})

// 学生列表
const studentsList = useStudentList(studentSubmissions.data)

// 选中的学生
const selectedStudent = ref<StudentSummary>()

const selectStudent = (student: StudentSummary) => {
  selectedStudent.value = student
}

// 选中学生的提交记录
const selectedStudentSubmissions = computed(() => {
  if (!selectedStudent.value) return []
  const submissions = studentSubmissions.data.value || []
  return submissions.filter((s) => s.studentUsername === selectedStudent.value?.studentUsername)
})

// 批改对话框和详情对话框
const gradeDialogRef = ref<InstanceType<typeof GradeDialog>>()
const detailDialogRef = ref<InstanceType<typeof ProcedureDetailDialog>>()

const openGradeDialog = (submission: any) => {
  gradeDialogRef.value?.open(submission)
}

const viewSubmissionDetail = (submission: any) => {
  detailDialogRef.value?.open(submission.id!)
}

const updateAttendanceStatus = (student: StudentAttendanceInfo, status: number) => {
  if (!student.studentUsername) return

  updateMutation.mutate({
    classExperimentId: classExperimentId.value,
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

// ==================== 其他 ====================
const handleBack = () => {
  router.back()
}
</script>
