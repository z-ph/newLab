<template>
  <Dialog v-model:visible="visible" header="题目详情" modal :style="{ maxWidth: '100vw' }">
    <div v-if="topic" class="space-y-4">
      <!-- 题目类型和 ID -->
      <div class="flex items-center gap-4">
        <Tag :value="getTopicTypeName(topic.type)" :severity="getTopicTypeSeverity(topic.type)" />
        <span class="text-sm text-slate-500">ID: {{ topic.id }}</span>
      </div>

      <!-- 题目内容 -->
      <div>
        <h3 class="text-sm font-medium text-slate-700 mb-2">题目内容</h3>
        <p class="text-slate-900">{{ topic.content }}</p>
      </div>

      <!-- 选项（如果有） -->
      <div v-if="topic.choices">
        <h3 class="text-sm font-medium text-slate-700 mb-2">选项</h3>
        <div class="space-y-2">
          <div
            v-for="(choice, index) in getChoicesList(topic.choices)"
            :key="index"
            class="flex items-center gap-2 p-2 rounded"
            :class="isCorrectChoice(getChoiceLabel(index)) ? 'bg-green-50' : ''"
          >
            <Tag :value="getChoiceLabel(index)" severity="secondary" />
            <span>{{ choice }}</span>
            <Tag v-if="isCorrectChoice(getChoiceLabel(index))" value="正确答案" severity="success" class="ml-auto" />
          </div>
        </div>
      </div>

      <!-- 正确答案 -->
      <div>
        <h3 class="text-sm font-medium text-slate-700 mb-2">正确答案</h3>
        <p class="text-slate-900 font-medium">{{ formatCorrectAnswer(topic.correctAnswer, topic.type) }}</p>
      </div>

      <!-- 标签 -->
      <div v-if="topic.tags && topic.tags.length > 0">
        <h3 class="text-sm font-medium text-slate-700 mb-2">标签</h3>
        <div class="flex flex-wrap gap-2">
          <Tag
            v-for="t in topic.tags"
            :key="t.tagId"
            :value="t.tagName"
            :severity="getTagSeverity(t.tagType)"
          />
        </div>
      </div>

      <!-- 创建信息 -->
      <div class="flex items-center gap-4 text-sm text-slate-500 pt-4 border-t">
        <span>创建者: {{ topic.createdBy || "-" }}</span>
        <span>创建时间: {{ formatDateTime(topic.createdTime) }}</span>
        <span v-if="topic.updatedTime">更新时间: {{ formatDateTime(topic.updatedTime) }}</span>
      </div>
    </div>

    <template #footer>
      <Button label="关闭" severity="secondary" @click="close" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"

import type { TopicDetailResponse } from "@/core/api/generated"
import { getTopicTypeName, getTopicTypeSeverity, CHOICE_LABEL_START_CHAR_CODE } from "@/features/teacher/topic/constants"
import { formatCorrectAnswer } from "@/features/teacher/topic/utils/formatters"
import { formatDateTime } from "@/features/shared/utils"

// ✅ 状态封装在组件内部
const visible = ref(false)
const topic = ref<TopicDetailResponse>()

// 打开对话框
function open(data: TopicDetailResponse) {
  topic.value = data
  visible.value = true
}

// 关闭对话框
function close() {
  visible.value = false
  topic.value = undefined
}

// 获取选项标签（A, B, C, ...）
function getChoiceLabel(index: number): string {
  return String.fromCharCode(CHOICE_LABEL_START_CHAR_CODE + index)
}

// 获取选项列表（从 JSON 字符串解析）
function getChoicesList(choices?: string): string[] {
  if (!choices) return []
  try {
    const parsed = JSON.parse(choices) as Record<string, string>
    return Object.entries(parsed)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, content]) => content)
  } catch {
    return []
  }
}

// 获取标签颜色
function getTagSeverity(tagType?: string): "success" | "warn" | "contrast" | undefined {
  if (!tagType) return undefined
  const severityMap: Record<string, "success" | "warn" | "contrast"> = {
    "1": "success",
    "2": "warn",
    "4": "contrast",
  }
  return severityMap[tagType]
}

// 判断是否是正确选项
function isCorrectChoice(choiceLabel: string): boolean {
  if (!choiceLabel || !topic.value?.correctAnswer) return false
  return topic.value.correctAnswer.includes(choiceLabel)
}

// ✅ 暴露方法
defineExpose({
  open,
  close,
})
</script>
