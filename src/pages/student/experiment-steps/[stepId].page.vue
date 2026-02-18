<template>
  <MobileLayout :title="pageTitle">
    <div v-if="stepType === '1'" class="h-full">
      <VideoStep
        :step-id="Number(stepId)"
        :course-id="courseId"
        :experiment-id="Number(experimentId)"
        :class-code="classCode"
      />
    </div>

    <div v-else-if="stepType === '2'" class="h-full">
      <DataCollectionStep
        :step-id="Number(stepId)"
        :course-id="courseId"
        :experiment-id="Number(experimentId)"
        :class-code="classCode"
      />
    </div>

    <div v-else-if="stepType === '3'" class="h-full">
      <TopicStep
        :step-id="Number(stepId)"
        :course-id="courseId"
        :experiment-id="Number(experimentId)"
        :class-code="classCode"
      />
    </div>

    <div v-else-if="stepType === '5'" class="h-full">
      <TimedQuizStep
        :step-id="Number(stepId)"
        :course-id="courseId"
        :experiment-id="Number(experimentId)"
        :class-code="classCode"
      />
    </div>

    <div v-else class="flex items-center justify-center h-full">
      <p class="text-gray-500">未知步骤类型: {{ stepType }}</p>
    </div>
  </MobileLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MobileLayout from '@/features/student/components/MobileLayout.vue'
import VideoStep from '@/features/student/experiments/steps/VideoStep.vue'
import DataCollectionStep from '@/features/student/experiments/steps/DataCollectionStep.vue'
import TopicStep from '@/features/student/experiments/steps/TopicStep.vue'
import TimedQuizStep from '@/features/student/experiments/steps/TimedQuizStep.vue'

const route = useRoute()

const params = route.params as { stepId: string }
const query = route.query as { experimentId?: string; courseId?: string; classCode?: string; stepType?: string }

const stepId = params.stepId
const experimentId = query.experimentId || ''
const courseId = query.courseId || ''
const classCode = query.classCode || ''
const stepType = query.stepType || ''

// 步骤类型名称映射
const stepTypeNames: Record<string, string> = {
  '1': '观看视频',
  '2': '数据采集',
  '3': '完成题目',
  '5': '限时答题',
}

const pageTitle = computed(() => stepTypeNames[stepType] || '实验步骤')

// 验证必要参数
if (!courseId || !classCode || !stepType) {
  console.warn('缺少必要参数:', { courseId, classCode, stepType })
}
</script>
