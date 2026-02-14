<template>
  <Dialog v-model:visible="visible" header="实验详情" :modal="true" :style="{ maxWidth: '100vw' }">
    <div v-if="experiment">
      <!-- Tab 导航 -->
      <Tabs v-model:value="activeTab" class="mb-4">
        <TabList>
          <Tab value="basic">基本信息</Tab>
          <Tab value="steps">实验步骤</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="basic">
            <div class="space-y-4">
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
          </TabPanel>
          <TabPanel value="steps">
            <div class="min-h-[500px]">
              <ProcedureList
                :experiment-id="experiment.id!"
                @refresh="handleRefresh"
              />
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ExperimentResponse } from '@/core/api/generated'
import ProcedureList from '@/features/teacher/experiment/procedure/components/ProcedureList.vue'
import { formatDateTime } from '@/features/shared/utils/formatters'

interface Props {
  experiment?: ExperimentResponse
}

const props = defineProps<Props>()

const visible = defineModel<boolean>()

const activeTab = ref('basic')

watch(visible, (newVal) => {
  if (newVal) {
    activeTab.value = 'basic'
  }
})

const handleRefresh = () => {
  // 刷新步骤列表
}
</script>
