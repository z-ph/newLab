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
            <Tab value="statistics">统计信息</Tab>
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
              <div class="p-8 text-center text-slate-600">
                <p>学生批改功能</p>
                <p class="text-sm text-slate-500 mt-4">此功能正在开发中...</p>
              </div>
            </TabPanel>

            <!-- 统计信息 -->
            <TabPanel value="statistics">
              <div class="p-8 text-center text-slate-600">
                <p>统计信息功能</p>
                <p class="text-sm text-slate-500 mt-4">此功能正在开发中...</p>
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </template>
    </Card>
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

const router = useRouter()
const route = useRoute()

const classCode = computed(() => (route.params as any).classCode as string)
const classExperimentId = computed(() => Number((route.params as any).classExperimentId as string))

// 从 query 获取标题和实验信息
const pageTitle = computed(() => {
  const title = route.query.title as string
  return title ? decodeURIComponent(title) : '实验详情'
})

// 从 query 获取 tab 参数，用于切换到指定 tab
const tabParam = computed(() => route.query.tab as string | undefined)

const activeTab = ref(tabParam.value || 'attendance')

// ==================== 签到管理 ====================
const attendanceList = useQueryAttendanceList({
  classCode,
  experimentId: computed(() => route.query.experimentId as string || ''),
  enable: computed(() => Boolean(classCode.value && route.query.experimentId)),
})

const updateMutation = useUpdateAttendanceSuccess()

const attendanceData = computed((): AttendanceListResponse | null => {
  return attendanceList.data.value || null
})

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
