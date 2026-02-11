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

      <!-- 预定义标签 -->
      <div class="mb-3">
        <p class="text-xs text-slate-500 mb-2">选择预定义标签</p>
        <div class="flex flex-wrap gap-2">
          <div v-for="tag in PREDEFINED_TAGS" :key="tag" class="flex items-center gap-1">
            <Checkbox
              :input-id="`tag-${tag}`"
              :model-value="selectedTagsMap[tag]"
              :binary="true"
              @update:model-value="val => updateTagMap(tag, val)"
            />
            <label :for="`tag-${tag}`" class="text-sm text-slate-700 cursor-pointer select-none">{{ tag }}</label>
          </div>
        </div>
      </div>

      <!-- 自定义标签输入 -->
      <div class="mb-3">
        <p class="text-xs text-slate-500 mb-2">或添加自定义标签</p>
        <div class="flex gap-2">
          <InputText
            v-model="customTagInput"
            :placeholder="CUSTOM_TAG_PLACEHOLDER"
            class="flex-1"
            @keydown.enter.prevent="addCustomTag"
          />
          <Button
            :label="ADD_BUTTON_LABEL"
            @click="addCustomTag"
            :disabled="!customTagInput.trim()"
          />
        </div>
      </div>

      <!-- 已选标签列表 -->
      <div v-if="topicTags.length > 0">
        <p class="text-xs text-slate-500 mb-2">
          已选择 {{ topicTags.length }} 个标签
        </p>
        <div class="flex flex-wrap gap-2">
          <Chip
            v-for="tag in topicTags"
            :key="tag"
            :label="tag"
            removable
            @remove="removeTag(tag)"
            class="bg-blue-50 text-blue-700"
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
import {
  PREDEFINED_TAGS,
  MIN_TOPIC_NUMBER,
  CUSTOM_TAG_PLACEHOLDER,
  ADD_BUTTON_LABEL,
} from '@/features/teacher/experiment/procedure/constants'
import { useQueryAllTopics } from '@/features/teacher/topic'

const isRandom = defineModel<boolean>('isRandom', { default: false })
const topicNumber = defineModel<number | null>('topicNumber', { default: null })
const topicTags = defineModel<string[]>('topicTags', { default: () => [] })
const teacherSelectedTopicIdsStr = defineModel<string>('teacherSelectedTopicIdsStr', { default: '' })

// 获取所有题目列表（两次查询模式）
const { topics, isLoading } = useQueryAllTopics()

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

// 预定义标签选中状态映射
const selectedTagsMap = ref<Record<string, boolean>>({})

// 自定义标签输入
const customTagInput = ref('')

// 初始化标签映射
watch(topicTags, (tags) => {
  PREDEFINED_TAGS.forEach(tag => {
    selectedTagsMap.value[tag] = tags.includes(tag)
  })
}, { deep: true, immediate: true })

// 更新标签映射
const updateTagMap = (tag: string, value: boolean) => {
  selectedTagsMap.value[tag] = value
  const index = topicTags.value.indexOf(tag)
  if (value && index === -1) {
    topicTags.value = [...topicTags.value, tag]
  } else if (!value && index > -1) {
    const newTags = [...topicTags.value]
    newTags.splice(index, 1)
    topicTags.value = newTags
  }
}

// 添加自定义标签
const addCustomTag = () => {
  const tag = customTagInput.value.trim()
  if (tag && !topicTags.value.includes(tag)) {
    topicTags.value = [...topicTags.value, tag]
    customTagInput.value = ''
    // 如果是预定义标签，同步更新映射
    if (PREDEFINED_TAGS.includes(tag as any)) {
      selectedTagsMap.value[tag] = true
    }
  }
}

// 移除标签
const removeTag = (tag: string) => {
  const index = topicTags.value.indexOf(tag)
  if (index > -1) {
    const newTags = [...topicTags.value]
    newTags.splice(index, 1)
    topicTags.value = newTags
    // 如果是预定义标签，同步更新映射
    if (PREDEFINED_TAGS.includes(tag as any)) {
      selectedTagsMap.value[tag] = false
    }
  }
}
</script>
