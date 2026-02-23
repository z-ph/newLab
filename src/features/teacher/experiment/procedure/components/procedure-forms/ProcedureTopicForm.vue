<template>
  <div class="space-y-3 border-t border-slate-200 pt-3">
    <div class="flex items-center gap-2">
      <Checkbox v-model="isRandom" binary />
      <label class="text-sm font-medium text-slate-700">随机抽取题目</label>
    </div>

    <!-- 随机模式 -->
    <div v-if="isRandom" class="space-y-3">
      <div>
        <label class="mb-2 block text-sm font-medium text-slate-700">
          题目数量 <span class="text-red-500">*</span>
        </label>
        <InputNumber
          v-model="topicNumber"
          :min="MIN_TOPIC_NUMBER"
          class="w-full"
          placeholder="请输入题目数量"
        />
      </div>

      <!-- 三类标签选择：学科、难度、题型各选一个 -->
      <div class="grid grid-cols-3 gap-3">
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">
            学科标签 <span class="text-red-500">*</span>
          </label>
          <Select
            v-model="selectedSubjectTagId"
            :options="subjectTagOptions"
            option-label="label"
            option-value="value"
            placeholder="请选择学科"
            :loading="isLoadingTags"
            class="w-full"
          />
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">
            难度标签 <span class="text-red-500">*</span>
          </label>
          <Select
            v-model="selectedDifficultyTagId"
            :options="difficultyTagOptions"
            option-label="label"
            option-value="value"
            placeholder="请选择难度"
            :loading="isLoadingTags"
            class="w-full"
          />
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">
            自定义标签 <span class="text-red-500">*</span>
          </label>
          <Select
            v-model="selectedCustomTagId"
            :options="customTagOptions"
            option-label="label"
            option-value="value"
            placeholder="请选择自定义标签"
            :loading="isLoadingTags"
            class="w-full"
          />
        </div>
      </div>
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
import { TAG_TYPE } from '@/features/teacher/topic/constants'

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

// 三类标签各选一个
const selectedSubjectTagId = ref<number | null>(null)
const selectedDifficultyTagId = ref<number | null>(null)
const selectedCustomTagId = ref<number | null>(null)

// 初始化：从 topicTags 数组解析各类型标签
watch(topicTags, (ids) => {
  if (ids.length === 0) return
  // 根据 tags 数据确定每个 ID 对应的类型
  ids.forEach(id => {
    const tag = tags.value?.find(t => t.id === id)
    if (tag) {
      if (tag.type === TAG_TYPE.SUBJECT) selectedSubjectTagId.value = id
      else if (tag.type === TAG_TYPE.DIFFICULTY) selectedDifficultyTagId.value = id
      else if (tag.type === TAG_TYPE.CUSTOM) selectedCustomTagId.value = id
    }
  })
}, { immediate: true })

// 同步三类标签到父组件
watch([selectedSubjectTagId, selectedDifficultyTagId, selectedCustomTagId], ([subject, difficulty, custom]) => {
  const ids: number[] = []
  if (subject !== null) ids.push(subject)
  if (difficulty !== null) ids.push(difficulty)
  if (custom !== null) ids.push(custom)
  topicTags.value = ids
})

// 按类型过滤标签选项
const subjectTagOptions = computed(() => {
  if (!tags.value) return []
  return tags.value
    .filter(tag => tag.type === TAG_TYPE.SUBJECT)
    .map(tag => ({ label: tag.tagName || '', value: tag.id! }))
})

const difficultyTagOptions = computed(() => {
  if (!tags.value) return []
  return tags.value
    .filter(tag => tag.type === TAG_TYPE.DIFFICULTY)
    .map(tag => ({ label: tag.tagName || '', value: tag.id! }))
})

const customTagOptions = computed(() => {
  if (!tags.value) return []
  return tags.value
    .filter(tag => tag.type === TAG_TYPE.CUSTOM)
    .map(tag => ({ label: tag.tagName || '', value: tag.id! }))
})
</script>
