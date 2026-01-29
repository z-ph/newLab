<template>
  <Dialog v-model:visible="visible" header="题目详情" modal :style="{ width: '700px' }">
    <div v-if="topic" class="space-y-4">
      <!-- 题目类型和 ID -->
      <div class="flex items-center gap-4">
        <Tag :value="getTopicTypeName(topic.type)" :severity="getTypeSeverity(topic.type)" />
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
            v-for="(choice, index) in formatChoices(topic.choices).filter(Boolean)"
            :key="index"
            class="flex items-center gap-2 p-2 rounded"
            :class="isCorrectChoice(choice?.[0]) ? 'bg-green-50' : ''"
          >
            <Tag :value="choice?.[0]" severity="secondary" />
            <span>{{ choice?.substring(2) || choice }}</span>
            <Tag v-if="isCorrectChoice(choice?.[0])" value="正确答案" severity="success" class="ml-auto" />
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
            v-for="tag in topic.tags"
            :key="tag.tagId"
            :value="tag.tagName"
            :severity="getTagSeverity(tag.tagType)"
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
import Dialog from "primevue/dialog"
import Button from "primevue/button"
import Tag from "primevue/tag"

import type { TopicDetailResponse } from "@/core/api/generated"
import { getTopicTypeName, formatChoices } from "@/features/teacher/topic/utils/formatters"

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

// 获取题目类型对应的 Tag 颜色
function getTypeSeverity(type?: number): "success" | "info" | "warn" | "contrast" | undefined {
  if (!type) return undefined
  const severityMap: Record<number, "success" | "info" | "warn" | "contrast"> = {
    1: "success",
    2: "info",
    3: "warn",
    4: "contrast",
    6: "contrast",
  }
  return severityMap[type]
}

// 获取标签颜色
function getTagSeverity(tagType?: string): "success" | "info" | "warn" | "contrast" | undefined {
  if (!tagType) return undefined
  const severityMap: Record<string, "success" | "info" | "warn" | "contrast"> = {
    "1": "success",
    "2": "warn",
    "3": "info",
    "4": "contrast",
  }
  return severityMap[tagType]
}

// 判断是否是正确选项
function isCorrectChoice(choiceLabel: string | undefined): boolean {
  if (!choiceLabel || !topic.value?.correctAnswer) return false
  return topic.value.correctAnswer.includes(choiceLabel)
}

// 格式化正确答案
function formatCorrectAnswer(answer?: string, type?: number): string {
  if (!answer) return "-"

  if (type === 3) {
    // 判断题
    return answer === "T" ? "正确" : "错误"
  }

  if (type === 1 || type === 2) {
    // 单选/多选题：展开字母
    return answer.split("").sort().join("、")
  }

  return answer
}

// 格式化时间
function formatDateTime(dateStr?: string): string {
  if (!dateStr) return "-"
  try {
    const date = new Date(dateStr)
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return dateStr
  }
}

// ✅ 暴露方法
defineExpose({
  open,
  close,
})
</script>
