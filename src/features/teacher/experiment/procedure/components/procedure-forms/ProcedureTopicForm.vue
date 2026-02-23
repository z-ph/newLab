<template>
  <div class="space-y-3 border-t border-slate-200 pt-3">
    <div class="flex items-center gap-2">
      <Checkbox v-model="isRandom" binary />
      <label class="text-sm font-medium text-slate-700">随机抽取题目</label>
    </div>

    <!-- 随机模式 -->
    <div v-if="isRandom">
      <label class="mb-2 block text-sm font-medium text-slate-700">
        题目数量 <span class="text-red-500">*</span>
      </label>
      <InputNumber
        v-model="topicNumber"
        :min="MIN_TOPIC_NUMBER"
        class="w-full"
        placeholder="请输入题目数量"
      />

      <!-- 标签选择 -->
      <label class="mb-2 block text-sm font-medium text-slate-700 mt-4">标签限制</label>

      <Select
        v-model="selectedTagId"
        :options="tagOptions"
        option-label="label"
        option-value="value"
        placeholder="请选择标签（可选）"
        :loading="isLoadingTags"
        class="w-full"
        show-clear
      />
    </div>

    <!-- 指定题目模式 -->
    <div v-if="!isRandom">
      <label class="mb-2 block text-sm font-medium text-slate-700">
        选定题目 <span class="text-red-500">*</span>
      </label>
      <MultiSelect
        v-model="selectedTopics"
        :options="topicsWithLabel"
        option-label="displayLabel"
        option-value="id"
        :loading="isLoading"
        filter
        placeholder="请选择题目"
        class="w-full"
        display="chip"
      >
        <template #option="slotProps">
          <div class="flex flex-col">
            <span class="font-medium">{{ slotProps.option.displayLabel }}</span>
            <span class="text-xs text-slate-500 truncate max-w-[200px]">{{ slotProps.option.content }}</span>
          </div>
        </template>
      </MultiSelect>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { MIN_TOPIC_NUMBER } from '@/features/teacher/experiment/procedure/constants'
import { useQueryAllTopics, useQueryTags } from '@/features/teacher/topic'

const isRandom = defineModel<boolean>('isRandom', { default: false })
const topicNumber = defineModel<number | null>('topicNumber', { default: null })
const topicTags = defineModel<number[]>('topicTags', { default: () => [] })
const teacherSelectedTopicIdsStr = defineModel<string>('teacherSelectedTopicIdsStr', { default: '' })

// 获取所有题目列表（两次查询模式）
const { topics, isLoading } = useQueryAllTopics()

// 获取所有标签
const { data: tags, isLoading: isLoadingTags } = useQueryTags()

// 为题目添加显示标签
const topicsWithLabel = computed(() => {
  return topics.value.map(topic => ({
    ...topic,
    displayLabel: `ID:${topic.id} - ${topic.content?.slice(0, 30)}${topic.content && topic.content.length > 30 ? '...' : ''}`,
  }))
})

// 选中的题目 ID 数组
const selectedTopics = ref<number[]>([])

// 初始化：从字符串解析 ID 数组
watch(teacherSelectedTopicIdsStr, (str) => {
  if (str && selectedTopics.value.length === 0) {
    selectedTopics.value = str.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
  }
}, { immediate: true })

// 监听选中变化，同步到字符串
watch(selectedTopics, (ids) => {
  teacherSelectedTopicIdsStr.value = ids.join(',')
}, { deep: true })

// 选中的标签 ID（单选）
const selectedTagId = ref<number | null>(null)

// 初始化选中标签
watch(topicTags, (ids) => {
  selectedTagId.value = ids.length > 0 ? (ids[0] ?? null) : null
}, { immediate: true })

// 同步选中标签到父组件
watch(selectedTagId, (id) => {
  topicTags.value = id !== null ? [id] : []
})

// 标签类型名称映射
const TAG_TYPE_LABELS: Record<string, string> = {
  '1': '学科标签',
  '2': '难度标签',
  '3': '题型标签',
  '4': '自定义标签',
}

// 下拉选项：按类型分组
const tagOptions = computed(() => {
  if (!tags.value) return []

  const groups: Record<string, Array<{ label: string; value: number }>> = {}

  tags.value.forEach(tag => {
    const type = tag.type || '4'
    if (!groups[type]) {
      groups[type] = []
    }
    groups[type].push({
      label: tag.tagName || '',
      value: tag.id!,
    })
  })

  // 按类型排序并生成选项列表
  const options: Array<{ label: string; value: number }> = []
  Object.entries(groups)
    .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
    .forEach(([type, typeTags]) => {
      // 添加分组标题（作为不可选项，用前缀标识）
      typeTags.forEach(tag => {
        options.push({
          label: `[${TAG_TYPE_LABELS[type] || '其他'}] ${tag.label}`,
          value: tag.value,
        })
      })
    })

  return options
})
</script>
