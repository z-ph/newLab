<template>
  <div class="p-4 border border-gray-200 rounded-lg bg-white">
    <!-- 题目标题 -->
    <div class="flex items-start gap-3 mb-4">
      <Tag :value="topicTypeName" :severity="topicTypeSeverity" />
      <span class="text-sm text-gray-500">第 {{ topicNumber }} 题</span>
    </div>

    <!-- 题目内容 -->
    <div class="mb-4 text-gray-900 leading-relaxed">
      {{ topicContent }}
    </div>

    <!-- 单选题 -->
    <div v-if="topicType === TOPIC_TYPE.SINGLE_CHOICE" class="space-y-2">
      <div
        v-for="choice in parsedChoices"
        :key="choice.label"
        class="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all"
        :class="modelValue === choice.label
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'"
        @click="updateValue(choice.label)"
      >
        <RadioButton
          v-model="modelValue"
          :value="choice.label"
          :input-id="`choice-${topicId}-${choice.label}`"
        />
        <label
          :for="`choice-${topicId}-${choice.label}`"
          class="flex-1 cursor-pointer"
        >
          <span class="font-medium text-gray-700">{{ choice.label }}.</span>
          <span class="ml-2 text-gray-900">{{ choice.content }}</span>
        </label>
      </div>
    </div>

    <!-- 多选题 -->
    <div v-else-if="topicType === TOPIC_TYPE.MULTIPLE_CHOICE" class="space-y-2">
      <div
        v-for="choice in parsedChoices"
        :key="choice.label"
        class="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all"
        :class="selectedMultipleChoices.includes(choice.label)
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'"
        @click="toggleMultipleChoice(choice.label)"
      >
        <Checkbox
          v-model="selectedMultipleChoices"
          :value="choice.label"
          :input-id="`choice-${topicId}-${choice.label}`"
        />
        <label
          :for="`choice-${topicId}-${choice.label}`"
          class="flex-1 cursor-pointer"
        >
          <span class="font-medium text-gray-700">{{ choice.label }}.</span>
          <span class="ml-2 text-gray-900">{{ choice.content }}</span>
        </label>
      </div>
    </div>

    <!-- 判断题 -->
    <div v-else-if="topicType === TOPIC_TYPE.TRUE_FALSE" class="flex gap-4">
      <div
        v-for="option in TRUE_FALSE_OPTIONS"
        :key="option.value"
        class="flex-1 flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all"
        :class="modelValue === option.value
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'"
        @click="updateValue(option.value)"
      >
        <RadioButton
          v-model="modelValue"
          :value="option.value"
          :input-id="`true-false-${topicId}-${option.value}`"
        />
        <label
          :for="`true-false-${topicId}-${option.value}`"
          class="flex-1 cursor-pointer text-center font-medium"
        >
          {{ option.label }}
        </label>
      </div>
    </div>

    <!-- 填空题 -->
    <div v-else-if="topicType === TOPIC_TYPE.FILL_BLANK">
      <InputText
        v-model="modelValue"
        class="w-full"
        placeholder="请填写答案"
      />
    </div>

    <!-- 简答题 -->
    <div v-else-if="topicType === TOPIC_TYPE.SHORT_ANSWER">
      <Textarea
        v-model="modelValue"
        class="w-full"
        :rows="4"
        placeholder="请输入详细回答"
      />
    </div>

    <!-- 未知题型 -->
    <div v-else class="text-gray-500 text-sm">
      未知题型
    </div>

    <!-- 答案提示 -->
    <div v-if="formatHint" class="mt-3 text-xs text-gray-500">
      <i class="pi pi-info-circle mr-1" />
      {{ formatHint }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import {
  TOPIC_TYPE,
  TRUE_FALSE_OPTIONS,
  ANSWER_FORMAT_HINT,
  getTopicTypeName,
  getTopicTypeSeverity,
} from '../../constants/topic'
import { parseTopicChoices, parseMultipleChoiceAnswer, sortMultipleChoiceAnswer } from '../../utils/topic'
import type { TopicDetail5 } from '@/core/api/generated'

interface Props {
  topic: TopicDetail5
}

const props = defineProps<Props>()

const modelValue = defineModel<string>()

// 题目信息
const topicId = computed(() => props.topic.id)
const topicNumber = computed(() => props.topic.number ?? 0)
const topicType = computed(() => props.topic.type ?? 0)
const topicContent = computed(() => props.topic.content ?? '')
const topicChoices = computed(() => props.topic.choices ?? '')

// 题目类型名称和颜色
const topicTypeName = computed(() => getTopicTypeName(topicType.value))
const topicTypeSeverity = computed(() => getTopicTypeSeverity(topicType.value) ?? 'contrast')

// 答案格式提示
const formatHint = computed(() => ANSWER_FORMAT_HINT[topicType.value as keyof typeof ANSWER_FORMAT_HINT])

// 解析选项
const parsedChoices = computed(() => parseTopicChoices(topicChoices.value))

// 多选题选中的选项
const selectedMultipleChoices = computed({
  get: () => parseMultipleChoiceAnswer(modelValue.value ?? ''),
  set: (values: string[]) => {
    modelValue.value = sortMultipleChoiceAnswer(values)
  },
})

// 更新单选值
function updateValue(value: string) {
  modelValue.value = value
}

// 切换多选选项
function toggleMultipleChoice(label: string) {
  const current = selectedMultipleChoices.value
  const index = current.indexOf(label)

  if (index === -1) {
    selectedMultipleChoices.value = [...current, label]
  } else {
    selectedMultipleChoices.value = current.filter(l => l !== label)
  }
}

// 初始化多选答案格式
watch(modelValue, (newVal) => {
  if (topicType.value === TOPIC_TYPE.MULTIPLE_CHOICE && newVal) {
    // 确保多选答案格式正确
    const sorted = sortMultipleChoiceAnswer(parseMultipleChoiceAnswer(newVal))
    if (sorted !== newVal) {
      modelValue.value = sorted
    }
  }
}, { immediate: true })
</script>
