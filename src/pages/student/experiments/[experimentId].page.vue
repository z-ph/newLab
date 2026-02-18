<template>
  <MobileLayout :title="experimentName">
    <div class="space-y-4">
      <!-- 概览卡片 -->
      <ExperimentOverview
        :course-id="courseId"
        :experiment-id="String(experimentId)"
      />

      <!-- 签到状态 -->
      <ExperimentAttendance
        :course-id="courseId"
        :experiment-id="String(experimentId)"
      />

      <!-- 实验步骤列表 -->
      <ExperimentSteps
        v-if="currentClassCode"
        :course-id="courseId"
        :experiment-id="String(experimentId)"
        :class-code="currentClassCode"
      />
      <div v-else class="text-center py-12">
        <p class="text-sm text-gray-500">未找到班级信息</p>
      </div>
    </div>
  </MobileLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import MobileLayout from '@/features/student/components/MobileLayout.vue'
import ExperimentOverview from '@/features/student/experiments/components/ExperimentOverview.vue'
import ExperimentAttendance from '@/features/student/experiments/components/ExperimentAttendance.vue'
import ExperimentSteps from '@/features/student/experiments/components/ExperimentSteps.vue'
import { useQueryCourseExperiments } from '@/features/student/courses/hooks'

const route = useRoute()
const params = route.params as { experimentId: string }
const query = route.query as { courseId?: string }
const courseId = query.courseId || ''
const experimentId = params.experimentId
const experimentName = experimentId || '实验详情'

// 获取课程实验列表以找到对应的 classCode（如果有 courseId）
const { experiments } = courseId
  ? useQueryCourseExperiments(computed(() => courseId))
  : { experiments: ref(undefined) }

// 当前实验的 classCode（取第一个班级的编号）
const currentClassCode = computed(() => {
  if (!experiments.value) return undefined

  const experiment = experiments.value.find(
    (exp: any) => String(exp.experimentId) === experimentId
  )

  if (!experiment || !experiment.classExperiments || experiment.classExperiments.length === 0) {
    return undefined
  }

  // 返回第一个班级的编号
  return experiment.classExperiments[0]!.classCode
})
</script>
