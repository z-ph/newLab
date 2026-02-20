<template>
  <div class="p-1 space-y-4">
    <Card>
      <template #content>
        <div class="mb-4">
          <h1 class="text-xl font-bold text-slate-900">创建实验</h1>
        </div>
        <ExperimentForm @success="handleSuccess" />
      </template>
    </Card>

    <ExperimentTable
      :experiments="experiments"
      :is-loading="query.isLoading.value"
      :is-deleting="deleteMutation.isPending.value"
      @edit="navigateToDetail"
      @refresh="query.refetch()"
    >
      <template #header>
        <h2 class="text-lg font-semibold text-slate-800">已有实验模版</h2>
      </template>
    </ExperimentTable>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import ExperimentForm from '@/features/teacher/experiment/components/ExperimentForm.vue'
import { ExperimentTable, useQueryExperimentPage, useDeleteExperiment } from '@/features/teacher/experiment'
import { useQueryCourseAll } from '@/features/teacher/course'
import type { ExperimentResponse } from '@/core/api/generated'

const router = useRouter()

// 查询实验列表
const { experiments: rawExperiments, query } = useQueryExperimentPage({
  current: 1,
  size: 5,
})
const { query: courseQuery } = useQueryCourseAll()

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
  return rawExperiments.value.map(exp => ({
    ...exp,
    ...getCourseInfo(exp.courseId!),
  }))
})

// 删除
const deleteMutation = useDeleteExperiment()

// 跳转到实验详情页面
const navigateToDetail = (experiment: ExperimentResponse) => {
  router.push({
    path: `/teacher/experiments/${experiment.id}/edit`,
    query: {
      title: encodeURIComponent(experiment.experimentName || '实验详情'),
    },
  })
}

const handleSuccess = () => {
  query.refetch()
}
</script>
