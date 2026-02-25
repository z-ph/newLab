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
        <div v-if="submittedAnswers.length > 0" class="space-y-4">
          <div
            v-for="item in submittedAnswers"
            :key="item.topicId"
            class="p-4 bg-gray-50 rounded-lg"
          >
            <!-- 题目标题 -->
            <div class="flex items-center gap-2 mb-2">
              <Tag :value="item.typeName" :severity="item.typeSeverity" />
              <span class="text-sm text-gray-500">第 {{ item.number }} 题</span>
            </div>

            <!-- 题目内容 -->
            <div class="text-sm text-gray-900 mb-3">
              {{ item.content }}
            </div>

            <!-- 选项列表（单选/多选/判断） -->
            <div v-if="item.choices.length > 0" class="space-y-1 mb-3">
              <div
                v-for="choice in item.choices"
                :key="choice.label"
                class="text-sm flex items-center gap-2"
                :class="{
                  'text-green-600 font-medium': item.correctAnswerLabels.includes(choice.label) && item.studentAnswerLabels.includes(choice.label),
                  'text-red-600 font-medium': item.studentAnswerLabels.includes(choice.label) && !item.correctAnswerLabels.includes(choice.label),
                  'text-green-500': item.correctAnswerLabels.includes(choice.label) && !item.studentAnswerLabels.includes(choice.label),
                  'text-gray-600': !item.studentAnswerLabels.includes(choice.label) && !item.correctAnswerLabels.includes(choice.label),
                }"
              >
                <span v-if="item.studentAnswerLabels.includes(choice.label)" class="w-4">
                  <i v-if="item.correctAnswerLabels.includes(choice.label)" class="pi pi-check text-green-600" />
                  <i v-else class="pi pi-times text-red-600" />
                </span>
                <span v-else class="w-4" />
                <span>{{ choice.label }}. {{ choice.content }}</span>
              </div>
            </div>

            <!-- 答案信息（填空/简答） -->
            <div v-if="item.type === 4 || item.type === 5" class="text-sm">
              <span class="text-gray-500">答案：</span>
              <span
                class="font-medium"
                :class="item.isCorrect ? 'text-green-600' : 'text-red-600'"
              >
                {{ item.answerDisplay }}
              </span>
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
import { getAnswerDisplayText, parseTopicChoices, parseMultipleChoiceAnswer } from '../../utils/topic'

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
    const topicType = topic.type ?? 0

    // 解析选项
    const choices = parseTopicChoices(topic.choices)

    // 解析学生答案的选项标签
    const studentAnswerLabels = parseMultipleChoiceAnswer(studentAnswer)

    // 解析正确答案的选项标签
    const correctAnswerLabels = correctAnswer ? parseMultipleChoiceAnswer(correctAnswer) : []

    return {
      topicId: topic.id,
      number: (topic.number ?? 0) + 1,
      type: topicType,
      typeName: getTopicTypeName(topic.type),
      typeSeverity: getTopicTypeSeverity(topic.type) ?? 'contrast',
      content: topic.content ?? '',
      choices,
      studentAnswerLabels,
      correctAnswerLabels,
      answer: studentAnswer,
      answerDisplay: getAnswerDisplayText(topicType, studentAnswer, topic.choices),
      correctAnswer,
      correctAnswerDisplay: correctAnswer ? getAnswerDisplayText(topicType, correctAnswer, topic.choices) : undefined,
      isCorrect,
    }
  }).sort((a, b) => a.number - b.number)
})
</script>
