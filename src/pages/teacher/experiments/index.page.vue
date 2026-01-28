<template>
  <div>
    <!-- ��面头部 -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">实验模版管理</h1>
        <p class="text-slate-600">管理实验模版的基本信息和步骤配置</p>
      </div>
      <Button label="新建实验模版" icon="pi pi-plus" @click="showCreateDialog = true" />
    </div>

    <!-- 筛选 -->
    <Card class="mb-6">
      <template #content>
        <div class="flex gap-4">
          <Select
            v-model="selectedCourseId"
            :options="courseOptions"
            option-label="label"
            option-value="value"
            placeholder="筛选课程"
            class="w-64"
            show-clear
          />
        </div>
      </template>
    </Card>

    <!-- 实验列表 -->
    <Card>
      <template #content>
        <DataTable v-model:selection="selectedExperiments" :value="experiments"
          :loading="query.isLoading.value" selection-mode="multiple" :paginator="true" :rows="10">
          <Column key="selection" selection-mode="multiple" header-style="width: 3rem" />
          <Column key="experimentName" field="experimentName" header="实验名称" />
          <Column key="courseName" field="courseName" header="课程" />
          <Column key="teacherUsername" field="teacherUsername" header="教师" />
          <Column key="percentage" field="percentage" header="分数占比(%)" />
          <Column key="endTime" field="endTime" header="截止时间" />
          <Column key="actions" header="操作">
            <template #body="slotProps">
              <div class="flex gap-2">
                <Button label="管理" outlined size="small" @click="openDetail(slotProps.data)" />
                <Button icon="pi pi-pencil" outlined severity="secondary" size="small"
                  @click="openEdit(slotProps.data)" />
                <Button icon="pi pi-trash" outlined severity="danger" size="small"
                  @click="confirmDelete(slotProps.data)" :loading="deleteMutation.isPending.value" />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- 创建/编辑实验对话框 -->
    <ExperimentFormDialog v-model:visible="showCreateDialog" :experiment="null" @success="handleCreateSuccess" />

    <ExperimentFormDialog v-model:visible="showEditDialog" :experiment="editingExperiment"
      @success="handleEditSuccess" />

    <!-- 实验详情对话框 -->
    <ExperimentDetailDialog v-model:visible="showDetailDialog" :experiment="selectedExperiment" />

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useQueryExperimentAll } from '@/features/teacher/experiment/hooks/useQueryExperiment'
import { useDeleteExperiment } from '@/features/teacher/experiment/hooks/useMutateExperimentDelete'
import { useQueryCourseAll } from '@/features/teacher/course/hooks/useQueryCourse'
import type { ExperimentResponse } from '@/core/api/generated'
import ExperimentFormDialog from './components/ExperimentFormDialog.vue'
import ExperimentDetailDialog from './components/ExperimentDetailDialog.vue'

const toast = useToast()
const confirm = useConfirm()
const courseMap = new Map<string|undefined,{courseName:string,teacherUsername:string}>()
function getCourseInfo(courseId: string) {
  if (courseMap.has(courseId)) {
    return courseMap.get(courseId)!
  }
  const course = courseQuery.data.value?.records?.find(c=>c.courseId===courseId)
  const info = {
    courseName: course?.courseName || '未知课程',
    teacherUsername: course?.teacherUsername || '未知教师',
  }
  courseMap.set(courseId, info)
  return info
}
// 查询实验列表
const query = useQueryExperimentAll()
const { query: courseQuery } = useQueryCourseAll()

// 课程选项
const courseOptions = computed(() => {
  const courses = courseQuery.data.value?.records || []
  return courses.map((c) => ({
    label: c.courseName || '',
    value: c.courseId || '',
  }))
})

// 选中的课程ID
const selectedCourseId = ref<string | null>(null)

// 实验列表（带课程信息）
const experiments = computed(()=>{
  const allExperiments = query.data.value || []
  const expWithCourse = allExperiments.map(exp=>({
    ...exp,
    ...getCourseInfo(exp.courseId!)
  }))

  // 按课程筛选
  if (selectedCourseId.value) {
    return expWithCourse.filter(exp => exp.courseId === selectedCourseId.value)
  }
  return expWithCourse
})

// 对话框状态
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showDetailDialog = ref(false)
const editingExperiment = ref<ExperimentResponse | null>(null)
const selectedExperiment = ref<ExperimentResponse | null>(null)

// 删除实验
const deleteMutation = useDeleteExperiment()

const openEdit = (experiment: ExperimentResponse) => {
  editingExperiment.value = experiment
  showEditDialog.value = true
}

const openDetail = (experiment: ExperimentResponse) => {
  selectedExperiment.value = experiment
  showDetailDialog.value = true
}

const confirmDelete = (experiment: ExperimentResponse) => {
  confirm.require({
    message: `确定要删除实验"${experiment.experimentName}"吗？此操作不可撤销。`,
    header: '删除确认',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: '取消',
    acceptLabel: '删除',
    acceptClass: 'p-button-danger',
    accept: () => handleDelete(experiment.id!),
  })
}

const handleDelete = async (id: number) => {
  await deleteMutation.mutateAsync({
    path: { experimentId: id },
  })
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: '实验删除成功',
    life: 3000,
  })
  query.refetch()
}

const handleCreateSuccess = () => {
  showCreateDialog.value = false
  query.refetch()
}

const handleEditSuccess = () => {
  showEditDialog.value = false
  editingExperiment.value = null
  query.refetch()
}

// 其他状态
const selectedExperiments = ref([])
</script>
