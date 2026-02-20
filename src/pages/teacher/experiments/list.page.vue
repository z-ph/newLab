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
      @edit="navigateToDetail"
      @refresh="query.refetch()"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold text-slate-900">实验模版管理</h1>
          <Button label="新建实验模版" icon="pi pi-plus" @click="openCreateDialog" />
        </div>
      </template>
    </ExperimentTable>

    <!-- 创建实验对话框 -->
    <ExperimentFormDialog v-model:visible="showCreateDialog" @success="handleCreateSuccess" />

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  useQueryExperimentAll,
  useDeleteExperiment,
  ExperimentTable,
  ExperimentFormDialog,
} from '@/features/teacher/experiment'
import { useQueryCourseAll } from '@/features/teacher/course'
import type { ExperimentResponse } from '@/core/api/generated'

const router = useRouter()

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
const selectedCourseId = ref<string>()

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

// 删除实验 mutation（用于 loading 状态）
const deleteMutation = useDeleteExperiment()

const openCreateDialog = () => {
  showCreateDialog.value = true
}

// 跳转到实验详情页面
const navigateToDetail = (experiment: ExperimentResponse) => {
  router.push({
    path: `/teacher/experiments/${experiment.id}/edit`,
    query: {
      title: encodeURIComponent(experiment.experimentName || '实验详情'),
    },
  })
}

const handleCreateSuccess = () => {
  showCreateDialog.value = false
  query.refetch()
}
</script>
