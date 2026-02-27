<template>
  <div class="p-1">
    <!-- 筛选器 -->
    <Card class="mb-4">
      <template #content>
        <TopicFilter v-model="filters" @search="handleSearch" />
      </template>
    </Card>

    <!-- 题目列表 -->
    <TopicTable @update:current="current = $event" />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick } from "vue"

import Card from "primevue/card"
import {
  TopicFilter,
  TopicTable,
} from "@/features/teacher/topic"
import { useQueryTopicPage } from "@/features/teacher/topic/hooks"

// ✅ 使用题目查询 hook，直接从 hook 获取所有状态
const { current, type, keyword, tagIds, difficultyTagIds, subjectTagIds } =
  useQueryTopicPage({
    current: 1,
    size: 10,
  })

// ✅ 通过 computed 组合筛选条件，直接绑定到 TopicFilter
const filters = computed({
  get: () => ({
    type: type.value,
    keyword: keyword.value,
    tagIds: tagIds.value,
    difficultyTagIds: difficultyTagIds.value,
    subjectTagIds: subjectTagIds.value,
  }),
  set: (value) => {
    type.value = value.type
    keyword.value = value.keyword
    tagIds.value = value.tagIds
    difficultyTagIds.value = value.difficultyTagIds
    subjectTagIds.value = value.subjectTagIds
  },
})

// ✅ 查询按钮
const handleSearch = async () => {
  // 筛选条件已通过 v-model 自动更新到 hook 的状态
  // 使用 nextTick 确保 ref 更新完成后再重置页码
  await nextTick()
  current.value = 1
  // Vue Query 会自动响应 queryKey 的变化并重新查询
}
</script>
