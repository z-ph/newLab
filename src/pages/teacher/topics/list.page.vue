<template>
  <div class="p-1">
    <!-- 筛选器 -->
    <Card class="mb-4">
      <template #content>
        <TopicFilter v-model="filters" @search="handleSearch" />
      </template>
    </Card>

    <!-- 题目列表 -->
    <TopicTable :filters="filters" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

import Card from "primevue/card"
import {
  TopicFilter,
  TopicTable,
} from "@/features/teacher/topic"
import type { TopicQueryRequest } from "@/core/api/generated"

// ✅ 从 API 类型派生筛选条件类型
type TopicFilters = Pick<TopicQueryRequest, 'type' | 'keyword' | 'tagIds' | 'difficultyTagIds' | 'subjectTagIds'>

// ✅ 页面只管理筛选条件状态
const filters = ref<TopicFilters>({})

// ✅ 查询按钮 - 筛选条件已通过 v-model 自动更新
const handleSearch = () => {
  // TopicTable 组件会通过 watch 监听 filters 变化并触发查询
}
</script>
