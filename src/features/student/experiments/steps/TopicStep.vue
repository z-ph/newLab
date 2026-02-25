<template>
  <div class="space-y-4">
    <!-- 已完成状态 - 只读模式 -->
    <TopicSubmittedStatus
      v-if="isCompleted && stepInfo"
      :step-info="stepInfo"
    />

    <!-- 不可访问状态 -->
    <template v-else-if="!isAccessible">
      <Card>
        <template #content>
          <div class="text-center py-8">
            <i class="pi pi-lock text-4xl text-orange-400 mb-3" />
            <h3 class="text-base font-medium text-gray-900 mb-2">暂不可答题</h3>
            <p class="text-sm text-gray-500">{{ inaccessibleReason || '请先完成前置步骤' }}</p>
          </div>
        </template>
      </Card>
    </template>

    <!-- 未完成状态 - 显示题目列表 -->
    <template v-else>
      <!-- 步骤信息 -->
      <Card>
        <template #content>
          <div class="flex items-center justify-between">
            <div class="space-y-2">
              <h3 class="text-base font-medium text-gray-900">
                {{ stepInfo?.remark || '完成题目' }}
              </h3>
              <p class="text-sm text-gray-600">
                共 {{ topicCount }} 道题目，请认真作答
              </p>
            </div>
          </div>
        </template>
      </Card>

      <!-- 题目列表 -->
      <Card v-if="topics.length > 0">
        <template #content>
          <div class="space-y-6">
            <TopicQuestion
              v-for="topic in topics"
              :key="topic.id"
              :topic="topic"
              v-model="answers[topic.id as number]"
            />
          </div>
        </template>
      </Card>

      <!-- 空状态 -->
      <Card v-else>
        <template #content>
          <div class="text-center py-8">
            <i class="pi pi-inbox text-4xl text-gray-300 mb-3" />
            <p class="text-sm text-gray-500">暂无题目</p>
          </div>
        </template>
      </Card>

      <!-- 提交按钮 -->
      <div class="flex justify-end">
        <Button
          label="提交答案"
          severity="primary"
          :loading="isSubmitting"
          :disabled="!canSubmit"
          @click="handleSubmit"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useQueryProcedureDetail, useQueryStudentExperimentDetail, useSubmitTopicAnswers } from '../hooks'
import { getDefaultAnswer, checkAllRequiredAnswered, buildAnswersPayload } from '../utils/topic'
import TopicQuestion from './components/TopicQuestion.vue'
import TopicSubmittedStatus from './components/TopicSubmittedStatus.vue'

interface Props {
  stepId: number
  courseId: string
  experimentId: number
  classCode: string
}

const props = defineProps<Props>()

// 获取步骤详情
const { procedureDetail: stepInfo, topics } = useQueryProcedureDetail(
  computed(() => props.stepId),
  {
    courseId: computed(() => props.courseId),
    experimentId: computed(() => props.experimentId),
    classCode: computed(() => props.classCode),
  }
)

// 获取实验详情（用于刷新数据）
const { query: experimentQuery } = useQueryStudentExperimentDetail(
  computed(() => props.experimentId),
  computed(() => props.classCode)
)

// 提交答案 hook
const submitTopicAnswers = useSubmitTopicAnswers()

// 是否已完成
const isCompleted = computed(() => stepInfo.value?.isCompleted ?? false)

// 是否可访问
const isAccessible = computed(() => stepInfo.value?.isAccessible ?? true)

// 不可访问原因
const inaccessibleReason = computed(() => stepInfo.value?.inaccessibleReason)

// 题目数量
const topicCount = computed(() => topics.value.length)

// 答案数据
const answers = ref<Record<number, string>>({})

// 初始化答案
watch(topics, (newTopics) => {
  const newAnswers: Record<number, string> = {}
  for (const topic of newTopics) {
    if (topic.id) {
      newAnswers[topic.id] = answers.value[topic.id] ?? getDefaultAnswer(topic.type ?? 0)
    }
  }
  answers.value = newAnswers
}, { immediate: true })

// 提交中状态
const isSubmitting = computed(() => submitTopicAnswers.isPending.value)

// 是否可以提交
const canSubmit = computed(() => {
  if (topics.value.length === 0) return false
  return checkAllRequiredAnswered(topics.value, answers.value)
})

// 处理提交
async function handleSubmit() {
  if (!canSubmit.value || !props.classCode) {
    return
  }

  const payload = buildAnswersPayload(answers.value)

  await submitTopicAnswers.mutateAsync({
    procedureId: props.stepId,
    classCode: props.classCode,
    answers: payload,
  })

  // 刷新数据
  experimentQuery.refetch()
}
</script>
