<template>
  <div class="p-1">
    <Card>
      <template #content>
        <div class="mb-4 flex items-center justify-between">
          <div class="flex items-center gap-2 text-xl font-bold text-slate-900">
            <span v-if="courseName">{{ courseName }}</span>
            <i v-if="courseName" class="pi pi-chevron-right text-sm text-slate-400"></i>
            <span v-if="experimentName">{{ experimentName }}</span>
            <i v-if="experimentName" class="pi pi-chevron-right text-sm text-slate-400"></i>
            <span>{{ className }}</span>
          </div>
          <Button label="返回" icon="pi pi-arrow-left" severity="secondary" @click="handleBack" />
        </div>

        <Tabs v-model:value="activeTab">
          <TabList>
            <Tab value="attendance">签到管理</Tab>
            <Tab value="grading">学生批改</Tab>
            <Tab value="procedures">步骤列表</Tab>
            <Tab value="extensions">延长记录</Tab>
            <Tab value="statistics">步骤统计</Tab>
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
                      :rows-per-page-options="[10, 20, 50]"
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
                      :rows-per-page-options="[10, 20, 50]"
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
                    <DataTable :value="attendanceData.notAttendanceList" :paginator="true" :rows="10" :rows-per-page-options="[10, 20, 50]">
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

            <!-- 步骤列表 -->
            <TabPanel value="procedures">
              <div v-if="proceduresQuery.isLoading.value" class="flex justify-center p-8">
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
              </div>
              <div v-else-if="proceduresList.length === 0" class="text-center p-8 text-slate-500">
                暂无步骤数据
              </div>
              <div v-else class="space-y-4">
                <!-- 一键延长按钮 -->
                <div class="flex justify-end">
                  <Button
                    label="一键延长"
                    severity="info"
                    outlined
                    icon="pi pi-clock"
                    @click="openOneClickExtendDialog"
                  />
                </div>
                <DataTable :value="proceduresList" :paginator="true" :rows="10" :rows-per-page-options="[10, 20, 50]">
                  <Column field="number" header="步骤序号" style="width: 100px" />
                  <Column field="type" header="步骤类型">
                    <template #body="slotProps">
                      {{ getProcedureTypeText(slotProps.data.type) }}
                    </template>
                  </Column>
                  <Column field="remark" header="步骤描述" />
                  <Column field="durationMinutes" header="持续时间">
                    <template #body="slotProps">
                      {{ slotProps.data.durationMinutes ? `${slotProps.data.durationMinutes} 分钟` : '-' }}
                    </template>
                  </Column>
                  <Column header="截止时间">
                    <template #body="slotProps">
                      {{ formatDeadline(calculateProcedureDeadline(slotProps.data)) }}
                    </template>
                  </Column>
                  <Column header="操作" style="width: 120px">
                    <template #body="slotProps">
                      <Button
                        label="延长时间"
                        size="small"
                        outlined
                        icon="pi pi-clock"
                        @click="openExtendDialogForProcedure(slotProps.data)"
                      />
                    </template>
                  </Column>
                </DataTable>
              </div>
            </TabPanel>

            <!-- 延长记录 -->
            <TabPanel value="extensions">
              <div v-if="extensionsQuery.isLoading.value" class="flex justify-center p-8">
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
              </div>
              <div v-else-if="extensionsList.length === 0" class="text-center p-8 text-slate-500">
                暂无延长记录
              </div>
              <div v-else>
                <DataTable :value="extensionsList" :paginator="true" :rows="10" :rows-per-page-options="[10, 20, 50]">
                  <Column header="学生姓名" sortable>
                    <template #body="slotProps">
                      {{ getStudentName(slotProps.data.studentUsername) }}
                    </template>
                  </Column>
                  <Column field="studentUsername" header="学生学号" sortable />
                  <Column header="步骤" sortable :sortField="(data) => String(getProcedureNumber(data.experimentalProcedureId))">
                    <template #body="slotProps">
                      {{ getProcedureLabel(slotProps.data.experimentalProcedureId) }}
                    </template>
                  </Column>
                  <Column field="extendedMinutes" header="延长时间(分钟)" sortable>
                    <template #body="slotProps">
                      <Tag :value="slotProps.data.extendedMinutes" severity="info" />
                    </template>
                  </Column>
                  <Column header="新截止时间">
                    <template #body="slotProps">
                      {{ getExtensionDeadline(slotProps.data) }}
                    </template>
                  </Column>
                  <Column field="teacherUsername" header="操作教师" sortable />
                  <Column header="操作" style="width: 100px">
                    <template #body="slotProps">
                      <Button
                        icon="pi pi-trash"
                        severity="danger"
                        outlined
                        size="small"
                        v-tooltip.top="'删除记录'"
                        :loading="deleteExtensionMutation.isPending.value"
                        @click="confirmDeleteExtension(slotProps.data)"
                      />
                    </template>
                  </Column>
                </DataTable>
              </div>
            </TabPanel>

            <!-- 步骤统计 -->
            <TabPanel value="statistics">
              <div v-if="statisticsQuery.isLoading.value" class="flex justify-center p-8">
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
              </div>
              <div v-else-if="statisticsData" class="space-y-6">
                <!-- 概览统计 -->
                <Card>
                  <template #title>实验概览</template>
                  <template #content>
                    <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div class="rounded-lg bg-blue-50 p-4 text-center">
                        <p class="text-2xl font-bold text-blue-600">{{ statisticsData.totalStudents ?? 0 }}</p>
                        <p class="text-sm text-slate-600">班级总人数</p>
                      </div>
                      <div class="rounded-lg bg-green-50 p-4 text-center">
                        <p class="text-2xl font-bold text-green-600">{{ statisticsData.submittedCount ?? 0 }}</p>
                        <p class="text-sm text-slate-600">已提交人数</p>
                      </div>
                      <div class="rounded-lg bg-purple-50 p-4 text-center">
                        <p class="text-2xl font-bold text-purple-600">{{ formatCompletionRate(statisticsData.completionRate) }}</p>
                        <p class="text-sm text-slate-600">完成率</p>
                      </div>
                      <div class="rounded-lg bg-orange-50 p-4 text-center">
                        <p class="text-2xl font-bold text-orange-600">{{ statisticsData.averageScore?.toFixed(1) ?? '-' }}</p>
                        <p class="text-sm text-slate-600">平均分</p>
                      </div>
                    </div>
                  </template>
                </Card>

                <!-- 步骤完成统计 -->
                <Card>
                  <template #title>步骤完成统计</template>
                  <template #content>
                    <DataTable
                      :value="statisticsData.procedureStatistics"
                      :paginator="true"
                      :rows="10"
                      :rows-per-page-options="[10, 20, 50]"
                      responsiveLayout="scroll"
                    >
                      <Column field="number" header="步骤序号" style="width: 100px" />
                      <Column field="type" header="步骤类型">
                        <template #body="slotProps">
                          {{ getProcedureTypeText(slotProps.data.type) }}
                        </template>
                      </Column>
                      <Column field="remark" header="步骤描述" />
                      <Column field="completedCount" header="完成人数" style="width: 100px">
                        <template #body="slotProps">
                          <Badge :value="slotProps.data.completedCount ?? 0" severity="success" />
                        </template>
                      </Column>
                      <Column field="notCompletedCount" header="未完成人数" style="width: 120px">
                        <template #body="slotProps">
                          <Badge :value="slotProps.data.notCompletedCount ?? 0" severity="warn" />
                        </template>
                      </Column>
                      <Column field="completionRate" header="完成率" style="width: 120px">
                        <template #body="slotProps">
                          <div class="flex items-center gap-2">
                            <ProgressBar
                              :value="(slotProps.data.completionRate ?? 0) * 100"
                              :showValue="false"
                              style="width: 60px; height: 8px"
                            />
                            <span class="text-sm">{{ formatCompletionRate(slotProps.data.completionRate) }}</span>
                          </div>
                        </template>
                      </Column>
                    </DataTable>
                  </template>
                </Card>

                <!-- 学生完成情况 -->
                <Card>
                  <template #title>
                    <div class="flex items-center justify-between">
                      <span>学生完成情况</span>
                      <Button
                        v-if="selectedStudentsForExtend.length > 0"
                        :label="`延长时间 (${selectedStudentsForExtend.length}人)`"
                        size="small"
                        severity="info"
                        outlined
                        icon="pi pi-clock"
                        @click="openExtendTimeDialog"
                      />
                    </div>
                  </template>
                  <template #content>
                    <DataTable
                      v-model:selection="selectedStudentsForExtend"
                      :value="statisticsData.studentCompletions"
                      :paginator="true"
                      :rows="10"
                      :rows-per-page-options="[10, 20, 50]"
                      responsiveLayout="scroll"
                      dataKey="studentUsername"
                    >
                      <Column selectionMode="multiple" style="width: 3rem" />
                      <Column field="studentName" header="学生姓名" sortable />
                      <Column field="studentUsername" header="学号" sortable />
                      <Column field="progress" header="进度" sortable>
                        <template #body="slotProps">
                          <div class="flex items-center gap-2">
                            <ProgressBar
                              :value="parseFloat(slotProps.data.progress?.replace('%', '') || '0')"
                              :showValue="false"
                              style="width: 80px; height: 8px"
                            />
                            <span class="text-sm">{{ slotProps.data.progress ?? '0%' }}</span>
                          </div>
                        </template>
                      </Column>
                      <Column field="completedCount" header="已完成步骤" sortable>
                        <template #body="slotProps">
                          {{ slotProps.data.completedCount ?? 0 }} / {{ slotProps.data.totalCount ?? 0 }}
                        </template>
                      </Column>
                      <Column field="totalScore" header="总得分" sortable>
                        <template #body="slotProps">
                          <Tag
                            :value="slotProps.data.totalScore ?? '-'"
                            :severity="slotProps.data.totalScore !== undefined ? 'success' : 'secondary'"
                          />
                        </template>
                      </Column>
                      <Column field="lastSubmissionTime" header="最后提交时间" sortable>
                        <template #body="slotProps">
                          {{ formatDateTime(slotProps.data.lastSubmissionTime) }}
                        </template>
                      </Column>
                    </DataTable>
                  </template>
                </Card>
              </div>
              <div v-else class="text-center p-8 text-slate-500">
                暂无统计数据
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

    <!-- 延长时间对话框 -->
    <ExtendTimeDialog ref="extendTimeDialogRef" />

    <!-- 确认对话框 -->
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Card from 'primevue/card'
import Badge from 'primevue/badge'
import ProgressBar from 'primevue/progressbar'
import Tag from 'primevue/tag'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import type { StudentAttendanceInfo, AttendanceListResponse, ProcedureSubmissionResponse, StudentCompletionInfo, TeacherProcedureDetailResponse } from '@/core/api/generated'
import { useQueryAttendanceList } from '@/features/teacher/experiment/attendance/hooks/useQueryAttendanceList'
import { useUpdateAttendanceSuccess } from '@/features/teacher/experiment/attendance/hooks/useMutateAttendanceUpdate'
import { ATTENDANCE_STATUS, ATTENDANCE_STATUS_OPTIONS } from '@/features/teacher/experiment/attendance/constants'
import { formatDateTime } from '@/features/shared/utils/formatters'
import { useQueryClassExperimentDetail } from '@/features/teacher/class/hooks/useQueryClassExperimentDetail'
import { useQueryStudentSubmissions, useStudentList, useQueryStatistics } from '@/features/teacher/class-experiment/hooks'
import type { StudentSummary } from '@/features/teacher/class-experiment/hooks'
import { getSubmissionStatusText, getSubmissionStatusSeverity } from '@/features/teacher/class-experiment/utils/submission'
import { getProcedureTypeText, formatCompletionRate } from '@/features/teacher/class-experiment/utils/statistics'
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
import ExtendTimeDialog from '@/features/teacher/class-experiment/components/ExtendTimeDialog.vue'
import { useQueryProceduresByExperiment } from '@/features/teacher/experiment/procedure/hooks/useQueryProcedure'
import { useQueryExtensions, useDeleteExtension } from '@/features/teacher/experiment/procedure/hooks'
import type { StudentProcedureExtension } from '@/core/api/generated'

const router = useRouter()
const route = useRoute()
const confirm = useConfirm()
const toast = useToast()

// 类型守卫函数：安全访问 route params
function getClassCode(): string {
  const params = route.params as Record<string, string>
  return params.classCode || ''
}

function getClassExperimentId(): string {
  const params = route.params as Record<string, string>
  return params.classExperimentId || ''
}

const classCode = computed(getClassCode)
const classExperimentId = computed(() => Number(getClassExperimentId()))

// 从 query 获取三层级信息
const courseName = computed(() => {
  const name = route.query.courseName as string
  return name || ''
})

const experimentName = computed(() => {
  const name = route.query.experimentName as string
  return name || ''
})

const className = computed(() => {
  const name = route.query.className as string
  return name || '实验详情'
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

// ==================== 步骤统计 ====================
const experimentIdForStats = computed(() => {
  const id = route.query.experimentId
  return id ? Number(id) : undefined
})

const statisticsQuery = useQueryStatistics(classCode, experimentIdForStats, {
  enable: computed(() => Boolean(classCode.value && experimentIdForStats.value)),
})

const statisticsData = computed(() => statisticsQuery.data.value)

// ==================== 步骤列表 ====================
const proceduresQuery = useQueryProceduresByExperiment(experimentIdForStats)

const proceduresList = computed(() => {
  const data = proceduresQuery.data.value
  if (!data) return []
  return Array.isArray(data) ? data : []
})

// ==================== 延长记录 ====================
const extensionParams = reactive({
  current: 1,
  size: 10,
  pageable: true,
})

const extensionsQuery = useQueryExtensions(
  computed(() => ({
    ...extensionParams,
  }))
)

const extensionsList = computed(() => {
  const data = extensionsQuery.data.value
  if (!data) return []
  // 筛选出当前实验的延长记录
  const procedureIds = proceduresList.value.map((p) => p.id)
  const records = Array.isArray(data.records) ? data.records : (Array.isArray(data) ? data : [])
  return records.filter((r: StudentProcedureExtension) => procedureIds.includes(r.experimentalProcedureId))
})

const deleteExtensionMutation = useDeleteExtension()

// 根据步骤ID获取步骤标签
const getProcedureLabel = (procedureId: number | undefined) => {
  if (!procedureId) return '-'
  const procedure = proceduresList.value.find((p) => p.id === procedureId)
  if (!procedure) return `步骤 ${procedureId}`
  return `步骤 ${procedure.number}${procedure.remark ? ` - ${procedure.remark}` : ''}`
}

// 根据步骤ID获取步骤序号（用于排序）
const getProcedureNumber = (procedureId: number | undefined) => {
  if (!procedureId) return 0
  const procedure = proceduresList.value.find((p) => p.id === procedureId)
  return procedure?.number ?? 0
}

// 根据学号获取学生姓名
const getStudentName = (studentUsername: string | undefined) => {
  if (!studentUsername) return '-'

  // 优先从统计数据获取
  const studentFromStats = statisticsData.value?.studentCompletions?.find(
    (s) => s.studentUsername === studentUsername
  )
  if (studentFromStats?.studentName) return studentFromStats.studentName

  // 从签到数据获取
  const allAttendanceLists = [
    attendanceData.value?.normalAttendanceList,
    attendanceData.value?.crossClassAttendanceList,
    attendanceData.value?.notAttendanceList,
  ]

  for (const list of allAttendanceLists) {
    if (list) {
      const student = list.find((s) => s.studentUsername === studentUsername)
      if (student?.studentName) return student.studentName
    }
  }

  return studentUsername
}

// 获取延长记录的截止时间
const getExtensionDeadline = (extension: StudentProcedureExtension) => {
  const procedure = proceduresList.value.find((p) => p.id === extension.experimentalProcedureId)
  if (!procedure) return '-'
  const deadline = calculateProcedureDeadline(procedure, extension.extendedMinutes || 0)
  return formatDeadline(deadline)
}

// 确认删除延长记录
const confirmDeleteExtension = (extension: StudentProcedureExtension) => {
  confirm.require({
    message: `确定要删除该延长记录吗？学生 ${extension.studentUsername} 的 ${extension.extendedMinutes} 分钟延长时间将被取消。`,
    header: '删除确认',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: '取消',
    acceptLabel: '删除',
    acceptClass: 'p-button-danger',
    accept: () => handleDeleteExtension(extension),
  })
}

const handleDeleteExtension = async (extension: StudentProcedureExtension) => {
  if (!extension.id) return
  await deleteExtensionMutation.mutateAsync(extension.id)
  toast.add({ severity: 'success', summary: '成功', detail: '延长记录已删除', life: 3000 })
  extensionsQuery.refetch()
}

// ==================== 学生批改 ====================
// 查询实验详情获取courseId
const experimentDetailQuery = useQueryClassExperimentDetail(
  classCode,
  computed(() => route.query.experimentId as string)
)

const courseId = computed(() => experimentDetailQuery.data.value?.courseId)

// 实验开始时间
const experimentStartTime = computed(() => experimentDetailQuery.data.value?.startTime)

// 计算步骤截止时间（实验开始时间 + 偏移量 + 持续时间）
const calculateProcedureDeadline = (procedure: TeacherProcedureDetailResponse, extendedMinutes = 0) => {
  if (!experimentStartTime.value) return null
  const start = new Date(experimentStartTime.value)
  const offsetMinutes = procedure.offsetMinutes || 0
  const durationMinutes = procedure.durationMinutes || 0
  const totalMinutes = offsetMinutes + durationMinutes + extendedMinutes
  const deadline = new Date(start.getTime() + totalMinutes * 60 * 1000)
  return deadline
}

// 格式化截止时间
const formatDeadline = (deadline: Date | null) => {
  if (!deadline) return '-'
  return formatDateTime(deadline.toISOString())
}

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
  return submissions.filter((s: ProcedureSubmissionResponse) => s.studentUsername === selectedStudent.value?.studentUsername)
})

// 批改对话框和详情对话框
const gradeDialogRef = ref<InstanceType<typeof GradeDialog>>()
const detailDialogRef = ref<InstanceType<typeof ProcedureDetailDialog>>()
const extendTimeDialogRef = ref<InstanceType<typeof ExtendTimeDialog>>()

const openGradeDialog = (submission: ProcedureSubmissionResponse) => {
  gradeDialogRef.value?.open(submission)
}

const viewSubmissionDetail = (submission: ProcedureSubmissionResponse) => {
  detailDialogRef.value?.open(submission.id!)
}

// 延长时间相关
const selectedStudentsForExtend = ref<StudentCompletionInfo[]>([])

const openExtendTimeDialog = () => {
  if (selectedStudentsForExtend.value.length === 0) return
  if (!experimentStartTime.value) {
    toast.add({ severity: 'warn', summary: '提示', detail: '无法获取实验开始时间', life: 3000 })
    return
  }

  const students = selectedStudentsForExtend.value.map((s) => ({
    studentUsername: s.studentUsername!,
    studentName: s.studentName!,
  }))

  const procedureList = proceduresList.value.map((p: TeacherProcedureDetailResponse) => ({
    id: p.id!,
    number: p.number!,
    type: p.type!,
    remark: p.remark,
    offsetMinutes: p.offsetMinutes,
    durationMinutes: p.durationMinutes,
  }))

  extendTimeDialogRef.value?.open(students, experimentIdForStats.value!, procedureList, experimentStartTime.value)
}

// 一键延长 - 延长所有步骤
const openOneClickExtendDialog = () => {
  if (!experimentStartTime.value) {
    toast.add({ severity: 'warn', summary: '提示', detail: '无法获取实验开始时间', life: 3000 })
    return
  }

  // 从签到数据获取学生列表
  const allStudents: { studentUsername: string; studentName: string }[] = []

  // 添加已签到的学生
  if (attendanceData.value?.normalAttendanceList) {
    for (const s of attendanceData.value.normalAttendanceList) {
      if (s.studentUsername && s.studentName) {
        allStudents.push({ studentUsername: s.studentUsername, studentName: s.studentName })
      }
    }
  }

  // 添加跨班签到的学生
  if (attendanceData.value?.crossClassAttendanceList) {
    for (const s of attendanceData.value.crossClassAttendanceList) {
      if (s.studentUsername && s.studentName) {
        allStudents.push({ studentUsername: s.studentUsername, studentName: s.studentName })
      }
    }
  }

  // 添加未签到的学生
  if (attendanceData.value?.notAttendanceList) {
    for (const s of attendanceData.value.notAttendanceList) {
      if (s.studentUsername && s.studentName) {
        allStudents.push({ studentUsername: s.studentUsername, studentName: s.studentName })
      }
    }
  }

  // 如果没有学生数据，提示用户
  if (allStudents.length === 0) {
    toast.add({ severity: 'warn', summary: '提示', detail: '暂无学生数据', life: 3000 })
    return
  }

  const procedureList = proceduresList.value.map((p: TeacherProcedureDetailResponse) => ({
    id: p.id!,
    number: p.number!,
    type: p.type!,
    remark: p.remark,
    offsetMinutes: p.offsetMinutes,
    durationMinutes: p.durationMinutes,
  }))

  // 不传 procedureId，进入一键延长模式
  extendTimeDialogRef.value?.open(allStudents, experimentIdForStats.value!, procedureList, experimentStartTime.value)
}

// 按步骤延长时间 - 从签到列表获取学生
const openExtendDialogForProcedure = (procedure: TeacherProcedureDetailResponse) => {
  if (!experimentStartTime.value) {
    toast.add({ severity: 'warn', summary: '提示', detail: '无法获取实验开始时间', life: 3000 })
    return
  }

  // 从签到数据获取学生列表
  const allStudents: { studentUsername: string; studentName: string }[] = []

  // 添加已签到的学生
  if (attendanceData.value?.normalAttendanceList) {
    for (const s of attendanceData.value.normalAttendanceList) {
      if (s.studentUsername && s.studentName) {
        allStudents.push({ studentUsername: s.studentUsername, studentName: s.studentName })
      }
    }
  }

  // 添加跨班签到的学生
  if (attendanceData.value?.crossClassAttendanceList) {
    for (const s of attendanceData.value.crossClassAttendanceList) {
      if (s.studentUsername && s.studentName) {
        allStudents.push({ studentUsername: s.studentUsername, studentName: s.studentName })
      }
    }
  }

  // 添加未签到的学生
  if (attendanceData.value?.notAttendanceList) {
    for (const s of attendanceData.value.notAttendanceList) {
      if (s.studentUsername && s.studentName) {
        allStudents.push({ studentUsername: s.studentUsername, studentName: s.studentName })
      }
    }
  }

  // 如果没有学生数据，提示用户
  if (allStudents.length === 0) {
    toast.add({ severity: 'warn', summary: '提示', detail: '暂无学生数据', life: 3000 })
    return
  }

  // 打开延长时间对话框，预选该步骤
  const procedureList = proceduresList.value.map((p: TeacherProcedureDetailResponse) => ({
    id: p.id!,
    number: p.number!,
    type: p.type!,
    remark: p.remark,
    offsetMinutes: p.offsetMinutes,
    durationMinutes: p.durationMinutes,
  }))

  extendTimeDialogRef.value?.open(allStudents, experimentIdForStats.value!, procedureList, experimentStartTime.value, procedure.id)
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
