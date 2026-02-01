<template>
  <Dialog v-model:visible="visible" header="实验详情" :modal="true">
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
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ExperimentResponse } from '@/core/api/generated'
import ProcedureList from '@/features/teacher/experiment/procedure/components/ProcedureList.vue'

interface Props {
  experiment: ExperimentResponse | null
}

const props = defineProps<Props>()

const visible = defineModel<boolean>()

const activeTab = ref(0)

const tabItems = [
  { label: '基本信息', icon: 'pi pi-info-circle' },
  { label: '实验步骤', icon: 'pi pi-list' },
]

watch(visible, (newVal) => {
  if (newVal) {
    activeTab.value = 0
  }
})

const handleRefresh = () => {
  // 刷新步骤列表
}

const formatDateTime = (dateStr: string | undefined) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('zh-CN')
}
</script>
