<template>
  <Dialog v-model:visible="visible" header="实验详情" :style="{ width: '80vw' }" :modal="true">
    <div v-if="experiment">
      <!-- Tab 导航 -->
      <TabMenu v-model:activeIndex="activeTab" :model="tabItems" class="mb-4" />

      <!-- Tab 内容 -->
      <div class="min-h-[500px]">
        <!-- 基本信息 Tab -->
        <div v-if="activeTab === 0" class="space-y-4">
          <Card>
            <template #title>实验信息</template>
            <template #content>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-sm text-slate-600">实验名称</label>
                  <p class="font-semibold">{{ experiment.experimentName }}</p>
                </div>
                <div>
                  <label class="text-sm text-slate-600">课程ID</label>
                  <p class="font-semibold">{{ experiment.courseId }}</p>
                </div>
                <div>
                  <label class="text-sm text-slate-600">分数占比</label>
                  <p class="font-semibold">{{ experiment.percentage }}%</p>
                </div>
                <div>
                  <label class="text-sm text-slate-600">截止时间</label>
                  <p class="font-semibold">{{ formatDateTime(experiment.endTime) }}</p>
                </div>
              </div>
            </template>
          </Card>
        </div>

        <!-- 实验步骤 Tab -->
        <ProcedureList
          v-if="activeTab === 1"
          :experiment-id="experiment.id!"
          @refresh="handleRefresh"
        />

        <!-- 学生批改 Tab -->
        <div v-if="activeTab === 2">
          <Card class="mb-4">
            <template #content>
              <div class="flex gap-4 items-end">
                <div class="flex-1">
                  <label class="mb-2 block text-sm font-medium text-slate-700">选择班级</label>
                  <Select v-model="selectedClassCode" :options="classOptions" option-label="label"
                    option-value="value" placeholder="请选择班级" class="w-full" :loading="classesQuery.query.isLoading.value"
                    filter />
                </div>
                <Button label="查询" @click="loadStatistics" :disabled="!selectedClassCode" />
              </div>
            </template>
          </Card>
          <div v-if="statisticsQuery.data.value" class="text-center py-8">
            <p class="text-slate-600">请点击"统计信息"标签查看统计数据</p>
            <p class="text-sm text-slate-500 mt-2">总学生数: {{ statisticsQuery.data.value.totalStudents }}</p>
          </div>
        </div>

        <!-- 统计信息 Tab -->
        <ExperimentStatistics
          v-if="activeTab === 3"
          :statistics="statisticsQuery.data.value || null"
          :loading="statisticsQuery.isLoading.value"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useQueryExperimentStatistics } from '@/features/teacher/experiment/hooks/useQueryExperimentStatistics'
import { useQueryClassAll } from '@/features/teacher/class/hooks/useQueryClass'
import type { ExperimentResponse } from '@/core/api/generated'
import ProcedureList from './ProcedureList.vue'
import ExperimentStatistics from './ExperimentStatistics.vue'

interface Props {
  experiment: ExperimentResponse | null
}

const props = defineProps<Props>()

const visible = defineModel<boolean>()

const activeTab = ref(0)
const selectedClassCode = ref<string | null>(null)

const tabItems = [
  { label: '基本信息', icon: 'pi pi-info-circle' },
  { label: '实验步骤', icon: 'pi pi-list' },
  { label: '学生批改', icon: 'pi pi-users' },
  { label: '统计信息', icon: 'pi pi-chart-bar' },
]

// 获取班级列表
const classesQuery = useQueryClassAll()

// 班级选项
const classOptions = computed(() => {
  const pageData = classesQuery.query.data.value
  const classes = pageData?.records || []
  return classes.map((c) => ({
    label: `${c.className} (${c.classCode})`,
    value: c.classCode,
  }))
})

const statisticsQuery = useQueryExperimentStatistics(
  computed(() => selectedClassCode.value || ''),
  computed(() => props.experiment?.id || 0),
  { enable: () => Boolean(visible.value && activeTab.value === 2 && selectedClassCode.value) },
)

watch(visible, (newVal) => {
  if (newVal) {
    activeTab.value = 0
    // 加载班级列表
    classesQuery.query.refetch()
  } else {
    selectedClassCode.value = null
  }
})

const handleRefresh = () => {
  // 刷新步骤列表
}

const loadStatistics = () => {
  statisticsQuery.refetch()
}

const formatDateTime = (dateStr: string | undefined) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('zh-CN')
}
</script>
