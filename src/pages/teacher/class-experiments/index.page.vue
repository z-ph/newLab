<template>
  <div>
    <!-- 页面头部 -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">班级实验管理</h1>
        <p class="text-slate-600">管理班级实验的签到、批改和统计</p>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <Card class="mb-6">
      <template #content>
        <div class="flex gap-4">
          <Select
            v-model="selectedCourseId"
            :options="courseOptions"
            option-label="label"
            option-value="value"
            placeholder="选择课程"
            class="w-64"
            filter
          />
          <Select
            v-model="selectedClassCode"
            :options="classOptions"
            option-label="label"
            option-value="value"
            placeholder="选择班级"
            class="w-64"
            filter
          />
          <Select
            v-model="selectedExperimentId"
            :options="experimentOptions"
            option-label="label"
            option-value="value"
            placeholder="选择实验"
            class="w-64"
            filter
          />
        </div>
      </template>
    </Card>

    <!-- 班级实验列表 -->
    <Card>
      <template #content>
        <DataTable
          v-model:selection="selectedClassExperiments"
          :value="filteredClassExperiments"
          :loading="isLoading"
          selection-mode="multiple"
          :paginator="true"
          :rows="10"
        >
          <Column key="selection" selection-mode="multiple" header-style="width: 3rem" />
          <Column key="courseName" field="courseName" header="课程" />
          <Column key="className" field="className" header="班级" />
          <Column key="experimentName" field="experimentName" header="实验" />
          <Column key="courseTime" field="courseTime" header="上课时间" />
          <Column key="experimentLocation" field="experimentLocation" header="实验地点" />
          <Column key="actions" header="操作">
            <template #body="slotProps">
              <div class="flex gap-2">
                <Button
                  label="签到管理"
                  outlined
                  size="small"
                  @click="openAttendanceManagement(slotProps.data)"
                />
                <Button
                  label="学生批改"
                  outlined
                  size="small"
                  @click="openStudentGrading(slotProps.data)"
                />
                <Button
                  label="统计信息"
                  outlined
                  severity="secondary"
                  size="small"
                  @click="openStatistics(slotProps.data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- 签到管理对话框 -->
    <AttendanceManagementDialog
      v-model:visible="showAttendanceDialog"
      :class-experiment="selectedClassExperiment"
    />

    <!-- 学生批改对话框 -->
    <StudentGradingDialog
      v-model:visible="showGradingDialog"
      :class-experiment="selectedClassExperiment"
    />

    <!-- 统计信息对话框 -->
    <ClassExperimentStatisticsDialog
      v-model:visible="showStatisticsDialog"
      :class-experiment="selectedClassExperiment"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQueryClassAll } from '@/features/teacher/class/hooks/useQueryClass'
import { useQueryCourseAll } from '@/features/teacher/course/hooks/useQueryCourse'
import { useQueryExperimentAll } from '@/features/teacher/experiment/hooks/useQueryExperiment'
import type { ExperimentInfo } from '@/core/api/generated'
import AttendanceManagementDialog from './components/AttendanceManagementDialog.vue'
import StudentGradingDialog from './components/StudentGradingDialog.vue'
import ClassExperimentStatisticsDialog from './components/ClassExperimentStatisticsDialog.vue'

// ==================== 类型定义 ====================
// 班级实验显示类型（从 ExperimentInfo 派生，添加显示用的字段）
type ClassExperimentDisplay = ExperimentInfo & {
  courseName: string
  className: string
  classCode: string
}

// ==================== 状态 ====================
const selectedCourseId = ref<string | null>(null)
const selectedClassCode = ref<string | null>(null)
const selectedExperimentId = ref<string | null>(null)
const selectedClassExperiments = ref<ClassExperimentDisplay[]>([])
const selectedClassExperiment = ref<ClassExperimentDisplay | null>(null)

const showAttendanceDialog = ref(false)
const showGradingDialog = ref(false)
const showStatisticsDialog = ref(false)

// ==================== 查询数据 ====================
const courseQuery = useQueryCourseAll()
const classQuery = useQueryClassAll()
const experimentQuery = useQueryExperimentAll()

// ==================== 选项数据 ====================
const courseOptions = computed(() => {
  const courses = courseQuery.query.data.value?.records || []
  return courses.map((c) => ({
    label: `${c.courseName} (${c.courseId})`,
    value: c.courseId,
  }))
})

const classOptions = computed(() => {
  const classes = classQuery.query.data.value?.records || []
  return classes.map((c) => ({
    label: `${c.className} (${c.classCode})`,
    value: c.classCode,
  }))
})

const experimentOptions = computed(() => {
  const experiments = experimentQuery.data.value || []
  return experiments.map((e: any) => ({
    label: e.experimentName || '',
    value: String(e.id!),
  }))
})

// ==================== 模拟数据（实际应该从 API 获取） ====================
const isLoading = ref(false)

// 生成模拟的班级实验数据
const mockClassExperiments = computed<ClassExperimentDisplay[]>(() => {
  const courses = courseQuery.query.data.value?.records || []
  const classes = classQuery.query.data.value?.records || []
  const experiments = experimentQuery.data.value || []

  // 生成所有组合（实际应该从后端获取班级实验关联表）
  const result: ClassExperimentDisplay[] = []
  classes.forEach((c: any) => {
    courses.forEach((course: any) => {
      if (course.courseId) {
        experiments.forEach((exp: any) => ({
          classExperimentId: Math.random(), // 实际应该从 API 获取
          courseName: course.courseName || '',
          className: c.className || '',
          experimentName: exp.experimentName || '',
          courseTime: '周一 8:00-14:00',
          experimentLocation: '实验楼 A101',
          courseId: course.courseId || '',
          classCode: c.classCode || '',
          experimentId: String(exp.id!),
        }))
      }
    })
  })

  return result
})

// 筛选后的班级实验列表
const filteredClassExperiments = computed(() => {
  return mockClassExperiments.value.filter((item) => {
    if (selectedCourseId.value && item.courseId !== selectedCourseId.value) {
      return false
    }
    if (selectedClassCode.value && item.classCode !== selectedClassCode.value) {
      return false
    }
    if (selectedExperimentId.value && item.experimentId !== selectedExperimentId.value) {
      return false
    }
    return true
  })
})

// ==================== 操作 ====================
const openAttendanceManagement = (classExperiment: ClassExperimentDisplay) => {
  selectedClassExperiment.value = classExperiment
  showAttendanceDialog.value = true
}

const openStudentGrading = (classExperiment: ClassExperimentDisplay) => {
  selectedClassExperiment.value = classExperiment
  showGradingDialog.value = true
}

const openStatistics = (classExperiment: ClassExperimentDisplay) => {
  selectedClassExperiment.value = classExperiment
  showStatisticsDialog.value = true
}
</script>
