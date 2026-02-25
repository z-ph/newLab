<template>
  <div class="space-y-4">
    <!-- 已完成状态提示 -->
    <Card>
      <template #content>
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <i class="pi pi-check text-green-600 text-xl" />
          </div>
          <div class="flex-1">
            <h3 class="text-base font-medium text-gray-900">已完成答题</h3>
            <p class="text-sm text-gray-500">
              提交时间：{{ formattedSubmissionTime }}
            </p>
          </div>
          <div v-if="score !== undefined">
            <Tag :value="`得分：${score}`" severity="success" />
          </div>
        </div>
      </template>
    </Card>

    <!-- 已提交答案列表 -->
    <Card>
      <template #title>已提交答案</template>
      <template #content>
        <div v-if="submittedAnswers.length > 0" class="space-y-3">
          <div
            v-for="item in submittedAnswers"
            :key="item.topicId"
            class="p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center gap-2 mb-2">
              <Tag :value="item.typeName" :severity="item.typeSeverity" />
              <span class="text-sm text-gray-500">第 {{ item.number }} 题</span>
            </div>
            <div class="text-sm text-gray-900 mb-2">
              {{ item.content }}
            </div>
            <div class="text-sm">
              <span class="text-gray-500">答案：</span>
              <!-- 学生答案：正确用绿色，错误用红色 -->
              <span
                class="font-medium"
                :class="item.isCorrect ? 'text-green-600' : 'text-red-600'"
              >
                {{ item.answerDisplay }}
              </span>
              <!-- 错误时显示正确答案 -->
              <span
                v-if="item.correctAnswer && !item.isCorrect"
                class="text-green-600 ml-1"
              >
                （正确答案：{{ item.correctAnswerDisplay }}）
              </span>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-6 text-gray-500">
          暂无提交记录
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { StudentProcedureDetailResponse, StudentProcedureDetailWithAnswerResponse, TopicItem } from '@/core/api/generated'
import { getTopicTypeName, getTopicTypeSeverity } from '../../constants/topic'
import { getAnswerDisplayText } from '../../utils/topic'

type MergedStepInfo = StudentProcedureDetailResponse & {
  topicDetail?: StudentProcedureDetailWithAnswerResponse['topicDetail']
  isAfterEndTime?: boolean
}

interface Props {
  stepInfo: MergedStepInfo
}

const props = defineProps<Props>()

// 格式化提交时间
const formattedSubmissionTime = computed(() => {
  const time = props.stepInfo.submissionTime
  if (!time) return '-'
  return new Date(time).toLocaleString('zh-CN')
})

// 得分
const score = computed(() => props.stepInfo.score)

// 已提交答案列表
const submittedAnswers = computed(() => {
  const topics = props.stepInfo.topicDetail?.topics ?? []

  return topics.map((topic: TopicItem) => {
    const studentAnswer = topic.studentAnswer ?? ''
    const correctAnswer = topic.correctAnswer
    const isCorrect = topic.isCorrect ?? true

    return {
      topicId: topic.id,
      number: topic.number ?? 0,
      typeName: getTopicTypeName(topic.type),
      typeSeverity: getTopicTypeSeverity(topic.type) ?? 'contrast',
      content: topic.content ?? '',
      answer: studentAnswer,
      answerDisplay: getAnswerDisplayText(topic.type ?? 0, studentAnswer, topic.choices),
      correctAnswer,
      correctAnswerDisplay: correctAnswer ? getAnswerDisplayText(topic.type ?? 0, correctAnswer, topic.choices) : undefined,
      isCorrect,
    }
  }).sort((a, b) => a.number - b.number)
})
</script>
