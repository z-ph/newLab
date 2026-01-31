<template>
  <div class="p-1">
    <!-- 搜索和筛选 -->
    <Card class="mb-4">
      <template #content>
        <div class="flex flex-wrap gap-4 items-center">
          <!-- 课程筛选 -->
          <div class="flex-1 min-w-50">
            <Select
              v-model="selectedCourseId"
              :options="courseOptions"
              option-label="label"
              option-value="value"
              placeholder="选择课程"
              class="w-full"
              filter
              show-clear
            />
          </div>

          <!-- 班级筛选 -->
          <div class="flex-1 min-w-50">
            <Select
              v-model="selectedClassCode"
              :options="classOptions"
              option-label="label"
              option-value="value"
              placeholder="选择班级"
              class="w-full"
              filter
              show-clear
            />
          </div>

          <!-- 实验筛选 -->
          <div class="flex-1 min-w-50">
            <Select
              v-model="selectedExperimentId"
              :options="experimentOptions"
              option-label="label"
              option-value="value"
              placeholder="选择实验"
              class="w-full"
              filter
              show-clear
            />
          </div>
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
          :pt="{ header: { class: 'px-0!' } }"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <h1 class="text-xl font-bold text-slate-900">班级实验管理</h1>
              <Button label="添加班级实验" icon="pi pi-plus" @click="openAddDialog" />
            </div>
          </template>
          <Column selection-mode="multiple" header-style="width: 3rem" />
          <Column field="courseName" header="课程" />
          <Column field="className" header="班级" />
          <Column field="experimentName" header="实验" />
          <Column field="courseTime" header="上课时间">
            <template #body="{ data }">
              {{ data.courseTime || '-' }}
            </template>
          </Column>
          <Column field="startTime" header="开始时间">
            <template #body="{ data }">
              {{ formatDateTime(data.startTime) }}
            </template>
          </Column>
          <Column field="endTime" header="结束时间">
            <template #body="{ data }">
              {{ formatDateTime(data.endTime) }}
            </template>
          </Column>
          <Column field="experimentLocation" header="实验地点">
            <template #body="{ data }">
              {{ data.experimentLocation || '-' }}
            </template>
          </Column>
          <Column header="操作">
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
                <Button
                  icon="pi pi-trash"
                  outlined
                  severity="danger"
                  size="small"
                  @click="handleDelete(slotProps.data)"
                  :loading="deleteMutation.isPending.value"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- 添加班级实验对话框 -->
    <BindClassExperimentDialog ref="bindDialogRef" @success="handleRefresh" />

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
import { useConfirm } from 'primevue/useconfirm'
import { useQueryClassAll } from '@/features/teacher/class'
import { useQueryCourseAll } from '@/features/teacher/course'
import { useQueryExperimentAll } from '@/features/teacher/experiment'
import { useQueryClassExperiments } from '../hooks'
import { useUnbindExperiment } from '@/features/teacher/class'
import { formatDateTime } from '../utils'
import {
  AttendanceManagementDialog,
  StudentGradingDialog,
  ClassExperimentStatisticsDialog,
} from '.'
import BindClassExperimentDialog from './BindClassExperimentDialog.vue'
import type { ExperimentInfo } from '@/core/api/generated'

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

const bindDialogRef = ref<InstanceType<typeof BindClassExperimentDialog>>()
const confirm = useConfirm()

// ==================== 查询数据 ====================
const courseQuery = useQueryCourseAll()
const classQuery = useQueryClassAll()
const experimentQuery = useQueryExperimentAll()
const { data: classesData, isLoading, refetch } = useQueryClassExperiments({ enable: true })
const deleteMutation = useUnbindExperiment()

// ==================== 选项数据 ====================
const courseOptions = computed(() => {
  const courses = courseQuery.query.data.value?.records || []
  return courses.map((c: any) => ({
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

// ==================== 展开班级实验数据 ====================
const expandedClassExperiments = computed<ClassExperimentDisplay[]>(() => {
  if (!classesData.value) return []

  const result: ClassExperimentDisplay[] = []

  const classes = Array.isArray(classesData.value) ? classesData.value : classesData.value.records || []
  classes.forEach((cls: any) => {
    if (cls.experiments && cls.experiments.length > 0) {
      cls.experiments.forEach((exp: ExperimentInfo) => {
        result.push({
          ...exp,
          courseName: cls.courseName || '',
          className: cls.className || '',
          classCode: cls.classCode || '',
        })
      })
    }
  })

  return result
})

// 筛选后的班级实验列表
const filteredClassExperiments = computed(() => {
  return expandedClassExperiments.value.filter((item) => {
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
const openAddDialog = () => {
  bindDialogRef.value?.open()
}

const handleRefresh = () => {
  refetch()
}

const handleDelete = (classExperiment: ClassExperimentDisplay) => {
  confirm.require({
    message: `确定要删除班级"${classExperiment.className}"的实验"${classExperiment.experimentName}"吗？`,
    header: '删除确认',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: '取消',
    acceptLabel: '删除',
    acceptClass: 'p-button-danger',
    accept: async () => {
      await deleteMutation.mutateAsync({
        path: { experimentId: classExperiment.experimentId! },
        body: [classExperiment.classCode],
      })
      refetch()
    },
  })
}

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
