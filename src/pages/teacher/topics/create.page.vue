<template>
  <div class="p-1 space-y-4">
    <Card>
      <template #content>
        <div class="mb-4">
          <h1 class="text-xl font-bold text-slate-900">创建题目</h1>
        </div>
        <TopicForm @success="handleSuccess" />
      </template>
    </Card>

    <!-- 题目列表 -->
    <TopicTable
      @update:current="current = $event"
    />
  </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import TopicForm from '@/features/teacher/topic/components/TopicForm.vue'
import { useQueryTopicPage } from '@/features/teacher/topic/hooks'
import { TopicTable } from "@/features/teacher/topic"

const { current, query } = useQueryTopicPage({
  current: 1,
  size: 5,
})

const handleSuccess = () => {
  query.refetch()
}
</script>
