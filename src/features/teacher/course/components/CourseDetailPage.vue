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

        <!-- 编辑课程名称 -->
        <section class="mb-6">
          <h3 class="mb-3 text-base font-semibold text-slate-900">课程信息</h3>
          <form @submit.prevent="handleUpdateCourseName" class="flex items-end gap-3">
            <div class="flex-1">
              <label class="mb-2 block text-sm font-medium text-slate-700">
                课程名称 <span class="text-red-500">*</span>
              </label>
              <InputText v-model="formData.courseName" class="w-full" placeholder="请输入课程名称" />
            </div>
            <Button type="submit" :loading="isSubmitting">保存</Button>
          </form>
        </section>

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
                <DataTable :value="experiments" :paginator="true" :rows="10" :rows-per-page-options="[10, 20, 50]">
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
                <DataTable :value="classExperiments" :paginator="true" :rows="10" :rows-per-page-options="[10, 20, 50]">
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
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import Card from 'primevue/card'
import { useQueryCourseExperimentList, useQueryCourseClassExperiments, useUpdateCourse } from '../hooks'
import { useGlobalTabManager } from '@/features/teacher/composables/useTabManager'
import { formatDateTime } from '@/features/shared/utils/formatters'
import type { ClassExperimentDetailResponse } from '@/core/api/generated'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const courseId = computed(() => {
  const params = route.params as { courseId?: string }
  return params.courseId || ''
})
const courseName = computed(() => {
  const name = route.query.courseName as string
  return name ? decodeURIComponent(name) : ''
})
const courseIdNumber = computed(() => {
  const id = route.query.courseId as string
  return id ? parseInt(id, 10) : undefined
})

const activeTab = ref('experiments')
const isSubmitting = ref(false)
const formData = reactive({ courseName: '' })

// 初始化表单数据
const initFormData = () => {
  formData.courseName = courseName.value
}
initFormData()

// 更新课程名称
const updateMutation = useUpdateCourse()

// Tab 管理器
const tabManager = useGlobalTabManager()

async function handleUpdateCourseName() {
  if (!formData.courseName?.trim()) {
    toast.add({
      severity: 'warn',
      summary: '提示',
      detail: '请输入课程名称',
      life: 3000,
    })
    return
  }

  if (!courseIdNumber.value) {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '课程 ID 不存在',
      life: 3000,
    })
    return
  }

  const oldKey = route.fullPath

  isSubmitting.value = true
  try {
    await updateMutation.mutateAsync({
      path: { id: courseIdNumber.value },
      body: { courseName: formData.courseName },
    })

    // 更新 URL query 参数中的 courseName
    const newQuery = { ...route.query, courseName: encodeURIComponent(formData.courseName) }
    router.replace({ query: newQuery })

    // 更新 Tab 的 key 和标题
    const newKey = tabManager.generateTabKey(route.path, newQuery as Record<string, string>)
    tabManager.updateTabKeyAndTitle(oldKey, newKey, formData.courseName)

    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '课程名称更新成功',
      life: 3000,
    })
  } finally {
    isSubmitting.value = false
  }
}

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
      tabbarName: encodeURIComponent(classExperiment.experimentName || '实验详情'),
      courseName: encodeURIComponent(formData.courseName),
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
