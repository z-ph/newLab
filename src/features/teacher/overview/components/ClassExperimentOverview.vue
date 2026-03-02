<template>
      <Tabs v-model:value="activeTab" class="w-full">
        <TabList class="w-full">
          <Tab value="today">今日实验</Tab>
          <Tab value="date">按日期筛选</Tab>
          <Tab value="class">按班级</Tab>
          <Tab value="experiment">按实验</Tab>
        </TabList>
        <TabPanels>
          <!-- 今日实验 Tab -->
          <TabPanel value="today">
            <div class="space-y-4">
              <div class="flex items-center justify-between text-sm text-slate-600">
                <span>今日日期：{{ todayDateString }}</span>
                <span v-if="todayExperiments.length > 0" class="text-slate-400">
                  共 {{ todayExperiments.length }} 个实验
                </span>
              </div>

              <div v-if="query.isLoading.value" class="flex justify-center py-8">
                <ProgressSpinner />
              </div>
              <div v-else-if="todayExperiments.length === 0" class="flex flex-col items-center justify-center py-8 text-slate-400">
                <i class="pi pi-calendar text-4xl mb-2" />
                <span>今日暂无实验</span>
              </div>
              <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <ClassExperimentCard
                  v-for="exp in todayExperiments"
                  :key="exp.classExperimentId"
                  :experiment="exp"
                />
              </div>
            </div>
          </TabPanel>

          <!-- 按日期筛选 Tab -->
          <TabPanel value="date">
            <div class="space-y-4">
              <!-- 日期筛选表单 -->
              <div class="flex flex-wrap items-center gap-4">
                <div class="flex items-center gap-2">
                  <label class="text-sm text-slate-600">开始日期：</label>
                  <DatePicker
                    v-model="selectedStartDate"
                    show-button-bar
                    :show-icon="true"
                    placeholder="选择开始日期"
                    class="w-40"
                  />
                </div>
                <div class="flex items-center gap-2">
                  <label class="text-sm text-slate-600">结束日期：</label>
                  <DatePicker
                    v-model="selectedEndDate"
                    show-button-bar
                    :show-icon="true"
                    placeholder="选择结束日期"
                    class="w-40"
                  />
                </div>
                <Button
                  label="查询"
                  icon="pi pi-search"
                  @click="handleQuery"
                />
                <Button
                  label="重置"
                  icon="pi pi-refresh"
                  text
                  @click="handleReset"
                />
              </div>

              <!-- 结果列表 -->
              <div v-if="dateQuery.isLoading.value" class="flex justify-center py-8">
                <ProgressSpinner />
              </div>
              <div v-else-if="filteredExperiments.length === 0" class="flex flex-col items-center justify-center py-8 text-slate-400">
                <i class="pi pi-filter text-4xl mb-2" />
                <span>暂无数据</span>
              </div>
              <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <ClassExperimentCard
                  v-for="exp in filteredExperiments"
                  :key="exp.classExperimentId"
                  :experiment="exp"
                />
              </div>
            </div>
          </TabPanel>

          <!-- 按班级折叠 Tab -->
          <TabPanel value="class">
            <div class="space-y-4">
              <div v-if="query.isLoading.value" class="flex justify-center py-8">
                <ProgressSpinner />
              </div>
              <div v-else-if="groupedByClass.size === 0" class="flex flex-col items-center justify-center py-8 text-slate-400">
                <i class="pi pi-users text-4xl mb-2" />
                <span>暂无班级实验</span>
              </div>
              <Accordion
                v-else
                v-model:active-indices="classActiveIndices"
                multiple
                class="w-full"
              >
                <AccordionPanel
                  v-for="[classCode, experiments] in groupedByClass.entries()"
                  :key="classCode"
                  :value="classCode"
                >
                  <AccordionHeader>
                    <div class="flex items-center justify-between w-full">
                      <span class="font-medium">{{ getClassName(classCode) }}</span>
                      <span class="text-sm text-slate-500">{{ experiments.length }} 个实验</span>
                    </div>
                  </AccordionHeader>
                  <AccordionContent>
                    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <ClassExperimentCard
                        v-for="exp in experiments"
                        :key="exp.classExperimentId"
                        :experiment="exp"
                      />
                    </div>
                  </AccordionContent>
                </AccordionPanel>
              </Accordion>
            </div>
          </TabPanel>

          <!-- 按实验折叠 Tab -->
          <TabPanel value="experiment">
            <div class="space-y-4">
              <div v-if="query.isLoading.value" class="flex justify-center py-8">
                <ProgressSpinner />
              </div>
              <div v-else-if="groupedByExperiment.size === 0" class="flex flex-col items-center justify-center py-8 text-slate-400">
                <i class="pi pi-flask text-4xl mb-2" />
                <span>暂无实验数据</span>
              </div>
              <Accordion
                v-else
                v-model:active-indices="experimentActiveIndices"
                multiple
                class="w-full"
              >
                <AccordionPanel
                  v-for="[experimentId, experiments] in groupedByExperiment.entries()"
                  :key="experimentId"
                  :value="experimentId"
                >
                  <AccordionHeader>
                    <div class="flex items-center justify-between w-full">
                      <span class="font-medium">{{ getExperimentName(experimentId) }}</span>
                      <span class="text-sm text-slate-500">{{ experiments.length }} 个班级</span>
                    </div>
                  </AccordionHeader>
                  <AccordionContent>
                    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <ClassExperimentCard
                        v-for="exp in experiments"
                        :key="exp.classExperimentId"
                        :experiment="exp"
                      />
                    </div>
                  </AccordionContent>
                </AccordionPanel>
              </Accordion>
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'

import ClassExperimentCard from '@/features/teacher/overview/components/ClassExperimentCard.vue'
import {
  useClassExperimentOverview,
  filterTodayExperiments,
  groupExperimentsByClass,
  groupExperimentsByExperiment,
  getTodayDateString,
} from '@/features/teacher/overview/hooks/useClassExperimentOverview'

// 当前激活的 Tab
const activeTab = ref('today')

// 今天日期字符串
const todayDateString = getTodayDateString()

// 获取所有实验数据
const { query, experiments, refetch } = useClassExperimentOverview()

// 按日期筛选的日期范围
const selectedStartDate = ref<Date | undefined>()
const selectedEndDate = ref<Date | undefined>()

// 日期查询时的数据
const { query: dateQuery, experiments: dateExperiments } = useClassExperimentOverview({
  startDate: computed(() =>
    selectedStartDate.value
      ? selectedStartDate.value.toISOString().split('T')[0]
      : undefined
  ),
  endDate: computed(() =>
    selectedEndDate.value
      ? selectedEndDate.value.toISOString().split('T')[0]
      : undefined
  ),
})

// 今日实验
const todayExperiments = computed(() => filterTodayExperiments(experiments.value))

// 按日期筛选的结果
const filteredExperiments = computed(() => dateExperiments.value)

// 按班级分组
const groupedByClass = computed(() => groupExperimentsByClass(experiments.value))

// 按实验分组
const groupedByExperiment = computed(() => groupExperimentsByExperiment(experiments.value))

// Accordion 展开状态
const classActiveIndices = ref<number[]>([])
const experimentActiveIndices = ref<number[]>([])

// 班级名称缓存
const classNamesMap = ref<Record<string, string>>({})

// 实验名称缓存
const experimentNamesMap = ref<Record<number, string>>({})

// 更新班级和实验名称缓存
watch(
  experiments,
  (newExperiments) => {
    newExperiments.forEach((exp) => {
      if (exp.classCode && exp.className) {
        classNamesMap.value[exp.classCode] = exp.className
      }
      if (exp.experimentId && exp.experimentName) {
        experimentNamesMap.value[exp.experimentId] = exp.experimentName
      }
    })
  },
  { immediate: true }
)

// 获取班级名称
function getClassName(classCode: string): string {
  return classNamesMap.value[classCode] || classCode
}

// 获取实验名称
function getExperimentName(experimentId: number): string {
  return experimentNamesMap.value[experimentId] || `实验 ${experimentId}`
}

// 查询按钮处理
function handleQuery() {
  // 触发 refetch，由于 computed 依赖，会自动使用新的日期参数
  refetch()
}

// 重置按钮处理
function handleReset() {
  selectedStartDate.value = undefined
  selectedEndDate.value = undefined
}
</script>
