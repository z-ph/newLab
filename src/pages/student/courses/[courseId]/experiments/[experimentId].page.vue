<template>
  <MobileLayout :title="experimentName">
    <Tabs v-model:value="activeTab" class="mobile-tabs">
      <TabList>
        <Tab value="overview">概览</Tab>
        <Tab value="attendance">签到</Tab>
        <Tab value="steps">实验步骤</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="overview">
          <ExperimentOverview
            :course-id="courseId"
            :experiment-id="experimentId"
          />
        </TabPanel>
        <TabPanel value="attendance">
          <ExperimentAttendance
            :course-id="courseId"
            :experiment-id="experimentId"
          />
        </TabPanel>
        <TabPanel value="steps">
          <ExperimentSteps
            :course-id="courseId"
            :experiment-id="experimentId"
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </MobileLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import MobileLayout from '@/features/student/components/MobileLayout.vue'
import ExperimentOverview from '@/features/student/experiments/components/ExperimentOverview.vue'
import ExperimentAttendance from '@/features/student/experiments/components/ExperimentAttendance.vue'
import ExperimentSteps from '@/features/student/experiments/components/ExperimentSteps.vue'

const route = useRoute()
const params = route.params as { courseId: string; experimentId: string }
const courseId = params.courseId
const experimentId = params.experimentId
const experimentName = experimentId || '实验详情'

const activeTab = ref('overview')
</script>

<style scoped>
.mobile-tabs :deep(.p-tablist) {
  justify-content: center;
}

.mobile-tabs :deep(.p-tab) {
  flex: 1;
}
</style>
