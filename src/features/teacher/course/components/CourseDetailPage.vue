<template>
  <div class="p-1">
    <Card>
      <template #content>
        <div class="mb-4 flex items-center justify-between">
          <div class="flex items-center gap-2 text-xl font-bold text-slate-900">
            <span>课程详情</span>
            <i class="pi pi-chevron-right text-sm text-slate-400"></i>
            <span>{{ courseName }}</span>
          </div>
          <Button label="返回" icon="pi pi-arrow-left" severity="secondary" @click="handleBack" />
        </div>

        <Tabs v-model:value="activeTab">
          <TabList>
            <Tab value="experiments">实验列表</Tab>
            <Tab value="classes">班级列表</Tab>
          </TabList>
          <TabPanels>
            <!-- 实验列表 -->
            <TabPanel value="experiments">
              <div v-if="experimentsQuery.isLoading.value" class="flex justify-center p-8">
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
              </div>
              <div v-else-if="experiments.length === 0" class="text-center p-8 text-slate-500">
                暂无实验数据
              </div>
              <div v-else>
                <DataTable :value="experiments" :paginator="true" :rows="10">
                  <Column field="id" header="实验ID" style="width: 100px" />
                  <Column field="experimentName" header="实验名称" />
                  <Column field="percentage" header="分数占比">
                    <template #body="slotProps">
                      {{ slotProps.data.percentage ? `${slotProps.data.percentage}%` : '-' }}
                    </template>
                  </Column>
                  <Column field="createdTime" header="创建时间">
                    <template #body="slotProps">
                      {{ formatDateTime(slotProps.data.createdTime) }}
                    </template>
                  </Column>
                  <Column field="endTime" header="截止时间">
                    <template #body="slotProps">
                      {{ formatDateTime(slotProps.data.endTime) }}
                    </template>
                  </Column>
                </DataTable>
              </div>
            </TabPanel>

            <!-- 班级列表 -->
            <TabPanel value="classes">
              <div v-if="classExperimentsQuery.isLoading.value" class="flex justify-center p-8">
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
              </div>
              <div v-else-if="classExperiments.length === 0" class="text-center p-8 text-slate-500">
                暂无班级数据
              </div>
              <div v-else>
                <DataTable :value="classExperiments" :paginator="true" :rows="10">
                  <Column field="classCode" header="班级编号" />
                  <Column field="className" header="班级名称" />
                  <Column field="experimentName" header="实验名称" />
                  <Column field="courseTime" header="上课时间" />
                  <Column field="experimentLocation" header="实验地点" />
                  <Column field="startTime" header="开始时间">
                    <template #body="slotProps">
                      {{ formatDateTime(slotProps.data.startTime) }}
                    </template>
                  </Column>
                  <Column field="endTime" header="结束时间">
                    <template #body="slotProps">
                      {{ formatDateTime(slotProps.data.endTime) }}
                    </template>
                  </Column>
                  <Column field="teacherName" header="授课教师" />
                  <Column header="操作" style="width: 120px">
                    <template #body="slotProps">
                      <Button
                        label="查看详情"
                        size="small"
                        outlined
                        icon="pi pi-eye"
                        @click="handleViewClassExperiment(slotProps.data)"
                      />
                    </template>
                  </Column>
                </DataTable>
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Card from 'primevue/card'
import { useQueryCourseExperimentList, useQueryCourseClassExperiments } from '../hooks'
import { formatDateTime } from '@/features/shared/utils/formatters'
import type { ClassExperimentDetailResponse } from '@/core/api/generated'

const router = useRouter()
const route = useRoute()

const courseId = computed(() => {
  const params = route.params as { courseId?: string }
  return params.courseId || ''
})
const courseName = computed(() => {
  const name = route.query.courseName as string
  return name ? decodeURIComponent(name) : ''
})

const activeTab = ref('experiments')

// 查询课程下的实验列表
const experimentsQuery = useQueryCourseExperimentList(courseId)

// 查询课程关联的班级实验列表
const classExperimentsQuery = useQueryCourseClassExperiments(courseId)

// 实验列表
const experiments = computed(() => experimentsQuery.data.value || [])

// 班级实验列表
const classExperiments = computed(() => {
  const data = classExperimentsQuery.data.value
  if (!data) return []
  // 处理分页数据或列表数据
  const records = data.records || (Array.isArray(data) ? data : [])
  return records as ClassExperimentDetailResponse[]
})

// 查看班级实验详情
const handleViewClassExperiment = (classExperiment: ClassExperimentDetailResponse) => {
  if (!classExperiment.classCode || !classExperiment.classExperimentId) return

  router.push({
    path: `/teacher/classes/${classExperiment.classCode}/experiments/${classExperiment.classExperimentId}/detail`,
    query: {
      courseName: encodeURIComponent(courseName.value),
      experimentName: encodeURIComponent(classExperiment.experimentName || ''),
      className: encodeURIComponent(classExperiment.className || ''),
      experimentId: classExperiment.experimentId,
    },
  })
}

// 返回
const handleBack = () => {
  router.back()
}
</script>
