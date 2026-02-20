<template>
  <Dialog v-model:visible="visible" header="实验详情" :modal="true" :style="{ maxWidth: '100vw' }">
    <div v-if="experiment" class="space-y-4">
      <!-- 基本信息 -->
      <Card>
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

      <!-- 实验步骤 -->
      <ProcedureList
        :experiment-id="experiment.id!"
        @refresh="handleRefresh"
      />
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import type { ExperimentResponse } from '@/core/api/generated'
import ProcedureList from '@/features/teacher/experiment/procedure/components/ProcedureList.vue'
import { formatDateTime } from '@/features/shared/utils/formatters'

interface Props {
  experiment?: ExperimentResponse
}

defineProps<Props>()

const visible = defineModel<boolean>()

const handleRefresh = () => {
  // 刷新步骤列表
}
</script>
