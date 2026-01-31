<template>
  <div class="p-1">
    <!-- 筛选 -->
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
              placeholder="筛选课程"
              class="w-full"
              show-clear
            />
          </div>
        </div>
      </template>
    </Card>

    <!-- 实验列表 -->
    <ExperimentTable
      :experiments="experiments"
      :is-loading="query.isLoading.value"
      :is-deleting="deleteMutation.isPending.value"
      @edit="openEdit"
      @manage="openDetail"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold text-slate-900">实验模版管理</h1>
          <Button label="新建实验模版" icon="pi pi-plus" @click="openCreateDialog" />
        </div>
      </template>
    </ExperimentTable>

    <!-- 创建/编辑实验对话框 -->
    <ExperimentFormDialog v-model:visible="showCreateDialog" :experiment="null" @success="handleCreateSuccess" />

    <ExperimentFormDialog v-model:visible="showEditDialog" :experiment="editingExperiment"
      @success="handleEditSuccess" />

    <!-- 实验详情对���框 -->
    <ExperimentDetailDialog v-model:visible="showDetailDialog" :experiment="selectedExperiment" />

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  useQueryExperimentAll,
  useDeleteExperiment,
  ExperimentTable,
  ExperimentFormDialog,
  ExperimentDetailDialog,
} from '@/features/teacher/experiment'
import { useQueryCourseAll } from '@/features/teacher/course'
import type { ExperimentResponse } from '@/core/api/generated'

// 查询实验列表
const query = useQueryExperimentAll()
const { query: courseQuery } = useQueryCourseAll()

// 课程选项
const courseOptions = computed(() => {
  const courses = courseQuery.data.value?.records || []
  return courses.map((c) => ({
    label: c.courseName || '',
    value: c.courseId || '',
  }))
})

// 选中的课程ID
const selectedCourseId = ref<string | null>(null)

// 课程信息缓存
const courseMap = new Map<string | undefined, { courseName: string; teacherUsername: string }>()
function getCourseInfo(courseId: string) {
  if (courseMap.has(courseId)) {
    return courseMap.get(courseId)!
  }
  const course = courseQuery.data.value?.records?.find(c => c.courseId === courseId)
  const info = {
    courseName: course?.courseName || '未知课程',
    teacherUsername: course?.teacherUsername || '未知教师',
  }
  courseMap.set(courseId, info)
  return info
}

// 实验列表（带课程信息）
const experiments = computed(() => {
  const allExperiments = query.data.value || []
  const expWithCourse = allExperiments.map(exp => ({
    ...exp,
    ...getCourseInfo(exp.courseId!),
  }))

  // 按课程筛选
  if (selectedCourseId.value) {
    return expWithCourse.filter(exp => exp.courseId === selectedCourseId.value)
  }
  return expWithCourse
})

// 对话框状态
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showDetailDialog = ref(false)
const editingExperiment = ref<ExperimentResponse | null>(null)
const selectedExperiment = ref<ExperimentResponse | null>(null)

// 删除实验 mutation（用于 loading 状态）
const deleteMutation = useDeleteExperiment()

const openCreateDialog = () => {
  showCreateDialog.value = true
}

const openEdit = (experiment: ExperimentResponse) => {
  editingExperiment.value = experiment
  showEditDialog.value = true
}

const openDetail = (experiment: ExperimentResponse) => {
  selectedExperiment.value = experiment
  showDetailDialog.value = true
}

const handleCreateSuccess = () => {
  showCreateDialog.value = false
  query.refetch()
}

const handleEditSuccess = () => {
  showEditDialog.value = false
  editingExperiment.value = null
  query.refetch()
}
</script>
