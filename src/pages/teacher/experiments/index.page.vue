<template>
  <div class="p-1">
    <!-- 筛选 -->
    <Card class="mb-4">
      <template #content>
        <div class="flex flex-wrap gap-4 items-center">
          <!-- 课程筛选 -->
          <div class="flex-1 min-w-50">
            <Select v-model="query.courseId" :options="courseOptions" option-label="label" option-value="value"
              placeholder="筛选课程" class="w-full" show-clear />
          </div>
        </div>
      </template>
    </Card>

    <!-- 实验列表 -->
    <ExperimentTable :query="query">
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold text-slate-900">实验模版管理</h1>
          <Button label="新建实验模版" icon="pi pi-plus" @click="navigateToExperimentCreate(router)" />
        </div>
      </template>
    </ExperimentTable>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  ExperimentTable,
  navigateToExperimentCreate,
  useQueryExperimentPage,
} from '@/features/teacher/experiment'
import { useQueryCourseAll } from '@/features/teacher/course'

const router = useRouter()

// 查询实验列表
const query = useQueryExperimentPage({
  current: 1,
  size: 10,
})
const { query: courseQuery } = useQueryCourseAll()

// 课程选项
const courseOptions = computed(() => {
  const courses = courseQuery.data.value?.records || []
  return courses.map((c) => ({
    label: c.courseName || '',
    value: c.courseId || '',
  }))
})


</script>
