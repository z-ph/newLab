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
        选定题目ID列表 <span class="text-red-500">*</span>
      </label>
      <p class="text-xs text-slate-500 mb-2">{{ TOPIC_IDS_HINT }}</p>
      <InputText
        v-model="teacherSelectedTopicIdsStr"
        class="w-full"
        :placeholder="TOPIC_IDS_PLACEHOLDER"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  PREDEFINED_TAGS,
  MIN_TOPIC_NUMBER,
  CUSTOM_TAG_PLACEHOLDER,
  ADD_BUTTON_LABEL,
  TOPIC_IDS_HINT,
  TOPIC_IDS_PLACEHOLDER,
} from '@/features/teacher/experiment/procedure/constants'

const isRandom = defineModel<boolean>('isRandom', { default: false })
const topicNumber = defineModel<number | null>('topicNumber', { default: null })
const topicTags = defineModel<string[]>('topicTags', { default: () => [] })
const teacherSelectedTopicIdsStr = defineModel<string>('teacherSelectedTopicIdsStr', { default: '' })

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
