<template>
  <MobileLayout :title="experimentName">
    <Tabs v-model:value="activeTab" pt:tabList:class="justify-center" pt:tab:class="flex-1">
      <TabList>
        <Tab value="overview">概览</Tab>
        <Tab value="attendance">签到</Tab>
        <Tab value="steps">实验步骤</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="overview">
          <ExperimentOverview
            :course-id="courseId"
            :experiment-id="String(experimentId)"
          />
        </TabPanel>
        <TabPanel value="attendance">
          <ExperimentAttendance
            :course-id="courseId"
            :experiment-id="String(experimentId)"
          />
        </TabPanel>
        <TabPanel value="steps">
          <ExperimentSteps
            v-if="currentClassCode"
            :course-id="courseId"
            :experiment-id="String(experimentId)"
            :class-code="currentClassCode"
          />
          <div v-else class="text-center py-12">
            <p class="text-sm text-gray-500">未找到班级信息</p>
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </MobileLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import MobileLayout from '@/features/student/components/MobileLayout.vue'
import ExperimentOverview from '@/features/student/experiments/components/ExperimentOverview.vue'
import ExperimentAttendance from '@/features/student/experiments/components/ExperimentAttendance.vue'
import ExperimentSteps from '@/features/student/experiments/components/ExperimentSteps.vue'
import { useQueryCourseExperiments } from '@/features/student/courses/hooks'

const route = useRoute()
const params = route.params as { courseId: string; experimentId: number }
const courseId = params.courseId
const experimentId = params.experimentId
const experimentName = String(experimentId) || '实验详情'

const activeTab = ref('overview')

// 获取课程实验列表以找到对应的 classCode
const { experiments } = useQueryCourseExperiments(computed(() => courseId))

// 当前实验的 classCode（取第一个班级的编号）
const currentClassCode = computed(() => {
  if (!experiments.value) return undefined

  const experiment = experiments.value.find(
    (exp) => exp.experimentId === Number(experimentId)
  )

  if (!experiment || !experiment.classExperiments || experiment.classExperiments.length === 0) {
    return undefined
  }

  // 返回第一个班级的编号
  return experiment.classExperiments[0]!.classCode
})
</script>
