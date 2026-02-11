<template>
  <div class="flex flex-wrap gap-4 items-center">
    <!-- 题目类型筛选 -->
    <div class="flex-1 min-w-50">
      <Select v-model="localType" :options="TOPIC_TYPE_OPTIONS" option-label="label" option-value="value"
        placeholder="全部类型" class="w-full" show-clear />
    </div>

    <!-- 关键词搜索 -->
    <div class="flex-1 min-w-50">
      <InputText v-model="localKeyword" placeholder="搜索题目内容" class="w-full" />
    </div>

    <!-- 难度标签筛选 -->
    <div class="flex-1 min-w-50">
      <MultiSelect v-model="localDifficultyTagIds" :options="difficultyTagOptions" option-label="tagName"
        option-value="id" placeholder="选择难度" class="w-full" display="chip" />
    </div>

    <!-- 学科标签筛选 -->
    <div class="flex-1 min-w-50">
      <MultiSelect v-model="localSubjectTagIds" :options="subjectTagOptions" option-label="tagName" option-value="id"
        placeholder="选择学科" class="w-full" display="chip" />
    </div>

    <!-- 自定义标签筛选 -->
    <div class="flex-1 min-w-50">
      <MultiSelect v-model="localTagIds" :options="customTagOptions" option-label="tagName" option-value="id"
        placeholder="选择自定义标签" class="w-full" display="chip" />
    </div>

    <!-- 操作按钮 -->
    <div class="flex gap-2">
      <Button label="查询" severity="primary" @click="handleSearch" />
      <Button label="重置" severity="secondary" outlined @click="handleReset" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue"
import Button from "primevue/button"
import Select from "primevue/select"
import MultiSelect from "primevue/multiselect"
import InputText from "primevue/inputtext"

import type { TopicQueryRequest } from "@/core/api/generated"
import { TOPIC_TYPE_OPTIONS, TAG_TYPE } from "@/features/teacher/topic/constants"
import { useQueryTags } from "@/features/teacher/topic/hooks"

// ✅ 从 API 类型派生
type TopicFilters = Pick<TopicQueryRequest, 'type' | 'keyword' | 'tagIds' | 'difficultyTagIds' | 'subjectTagIds'>

interface Emits {
  (e: 'search'): void
}

const emit = defineEmits<Emits>()
const filters = defineModel<TopicFilters>({
  required: true,
  default: () => ({}),
})

// ✅ 查询标签列表
const { data: tags } = useQueryTags()
// 本地状态
const localType = ref<number | undefined>(filters.value.type)
const localKeyword = ref<string | undefined>(filters.value.keyword)
const localTagIds = ref<number[] | undefined>(filters.value.tagIds)
const localDifficultyTagIds = ref<number[] | undefined>(filters.value.difficultyTagIds)
const localSubjectTagIds = ref<number[] | undefined>(filters.value.subjectTagIds)

// 标签选项（按类型分组）
const difficultyTagOptions = computed(() => {
  if (!tags.value) return []
  return tags.value.filter((tag) => tag.type === TAG_TYPE.DIFFICULTY)
})

const subjectTagOptions = computed(() => {
  if (!tags.value) return []
  return tags.value.filter((tag) => tag.type === TAG_TYPE.SUBJECT)
})

const customTagOptions = computed(() => {
  if (!tags.value) return []
  return tags.value.filter((tag) => tag.type === TAG_TYPE.CUSTOM)
})

// 查询按钮
const handleSearch = () => {
  filters.value = {
    type: localType.value,
    keyword: localKeyword.value || undefined,
    tagIds: localTagIds.value?.length ? localTagIds.value : undefined,
    difficultyTagIds: localDifficultyTagIds.value?.length ? localDifficultyTagIds.value : undefined,
    subjectTagIds: localSubjectTagIds.value?.length ? localSubjectTagIds.value : undefined,
  }
  emit("search")
}

// 重置按钮
const handleReset = () => {
  localType.value = undefined
  localKeyword.value = undefined
  localTagIds.value = undefined
  localDifficultyTagIds.value = undefined
  localSubjectTagIds.value = undefined
  filters.value = {}
  emit("search")
}

// 同步外部变化
watch(filters, (newVal) => {
  localType.value = newVal.type
  localKeyword.value = newVal.keyword
  localTagIds.value = newVal.tagIds
  localDifficultyTagIds.value = newVal.difficultyTagIds
  localSubjectTagIds.value = newVal.subjectTagIds
}, { deep: true })
</script>
