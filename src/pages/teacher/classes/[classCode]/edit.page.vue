<template>
  <div class="p-1">
    <Card>
      <template #content>
        <div class="mb-4 flex items-center justify-between">
          <h1 class="text-xl font-bold text-slate-900">{{ pageTitle }}</h1>
          <Button label="返回" icon="pi pi-arrow-left" severity="secondary" @click="handleBack" />
        </div>

        <div class="flex flex-col gap-6">
          <!-- 编辑班级名称 -->
          <section>
            <h3 class="mb-3 text-base font-semibold text-slate-900">班级信息</h3>
            <form @submit.prevent="handleUpdateClassName" class="flex items-end gap-3">
              <div class="flex-1">
                <label class="mb-2 block text-sm font-medium text-slate-700">
                  班级名称 <span class="text-red-500">*</span>
                </label>
                <InputText v-model="formData.className" class="w-full" placeholder="请输入班级名称" />
              </div>
              <Button type="submit" :loading="isSubmitting">保存</Button>
            </form>
          </section>

          <!-- Tabs：学生和实验 -->
          <Tabs v-model:value="activeTab">
            <TabList>
              <Tab value="students">学生管理</Tab>
              <Tab value="experiments">实验管理</Tab>
            </TabList>
            <TabPanels>
              <!-- 学生标签页 -->
              <TabPanel value="students">
                <div class="mb-4 flex items-center justify-between gap-4">
                  <InputText
                    v-model="searchKeyword"
                    placeholder="搜索学生姓名或学号"
                    class="flex-1"
                    @keyup.enter="handleSearch"
                  />
                  <Button label="添加学生" icon="pi pi-plus" @click="showAddStudentDialog = true" />
                </div>

                <DataTable
                  :value="students"
                  :paginator="true"
                  :rows="studentSize"
                  :loading="studentsLoading"
                  :total-records="studentTotal"
                  :rows-per-page-options="[10, 20, 50]"
                  :lazy="true"
                  @page="onStudentPageChange"
                >
                  <Column key="studentUsername" field="studentUsername" header="学号" />
                  <Column key="studentName" field="studentName" header="姓名" />
                  <Column key="bindTime" field="bindTime" header="绑定时间">
                    <template #body="slotProps">
                      {{ formatDateTime(slotProps.data.bindTime) }}
                    </template>
                  </Column>
                  <Column key="actions" header="操作">
                    <template #body="slotProps">
                      <Button
                        icon="pi pi-trash"
                        outlined
                        severity="danger"
                        size="small"
                        @click="confirmRemoveStudent(slotProps.data)"
                      />
                    </template>
                  </Column>
                </DataTable>
              </TabPanel>

              <!-- 实验标签页 -->
              <TabPanel value="experiments">
                <div class="mb-4 flex justify-between items-center">
                  <Button
                    :icon="allExpanded ? 'pi pi-minus' : 'pi pi-plus'"
                    :label="allExpanded ? '全部折叠' : '全部展开'"
                    outlined
                    severity="secondary"
                    @click="toggleAllExpanded"
                    :disabled="courseGroups.length === 0"
                  />
                  <Button label="绑定实验" icon="pi pi-plus" @click="openBindExperimentDialog" />
                </div>

                <!-- 按课程分组的实验列表 -->
                <div v-if="experimentQuery.isLoading.value" class="flex justify-center p-8">
                  <ProgressSpinner />
                </div>

                <Accordion v-else v-model:value="expandedPanels" multiple>
                  <AccordionPanel v-for="courseGroup in courseGroups" :key="courseGroup.courseId" :value="courseGroup.courseId">
                    <AccordionHeader>
                      <div class="flex items-center justify-between w-full">
                        <div class="flex items-center gap-2">
                          <i class="pi pi-book text-slate-600"></i>
                          <span class="font-semibold text-slate-900">{{ courseGroup.courseInfo?.courseName }}</span>
                          <Tag :value="`${courseGroup.experiments.length} 个实验`" severity="secondary" />
                        </div>
                      </div>
                    </AccordionHeader>
                    <AccordionContent>
                      <!-- 实验列表 -->
                      <DataTable :value="courseGroup.experiments" :paginator="courseGroup.experiments.length > 5"
                        :rows="5" :pt="{ header: { class: 'px-0!' } }">
                        <Column field="experimentName" header="实验名称" />
                        <Column field="courseTime" header="上课时间" />
                        <Column field="percentage" header="占比">
                          <template #body="slotProps">
                            {{ slotProps.data.percentage }}%
                          </template>
                        </Column>
                        <Column header="操作">
                          <template #body="slotProps">
                            <div class="flex gap-2">
                              <Button label="查看" outlined size="small"
                                @click="navigateToExperimentDetail(slotProps.data, courseGroup.courseInfo?.courseName)" />
                              <Button icon="pi pi-trash" outlined severity="danger" size="small" v-tooltip.top="'删除'"
                                @click="handleDeleteExperiment(slotProps.data)" :loading="deleteExperimentMutation.isPending.value" />
                            </div>
                          </template>
                        </Column>
                      </DataTable>
                    </AccordionContent>
                  </AccordionPanel>
                </Accordion>

                <div v-if="!experimentQuery.isLoading.value && courseGroups.length === 0" class="text-center p-8 text-slate-500">
                  暂无实验数据
                </div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>

        <!-- 添加学生对话框 -->
        <Dialog v-model:visible="showAddStudentDialog" header="添加学生" :modal="true" :style="{ maxWidth: '100vw' }">
          <div class="mb-4">
            <label class="mb-2 block text-sm font-medium text-slate-700">
              学生学号（多个用逗号或换行分隔）
            </label>
            <Textarea
              v-model="studentInput"
              rows="5"
              placeholder="请输入学生学号，多个学号用逗号或换行分隔&#10;例如：2021001, 2021002, 2021003"
              class="w-full"
            />
          </div>
          <div class="flex justify-end gap-2">
            <Button label="取消" outlined @click="showAddStudentDialog = false" />
            <Button label="添加" :loading="addingStudent" @click="handleAddStudents" />
          </div>
        </Dialog>

        <!-- 绑定实验对话框 -->
        <BindClassExperimentDialog ref="bindExperimentDialogRef" />

        <!-- 确认对话框 -->
        <ConfirmDialog />
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import Card from 'primevue/card'
import { useUpdateClass } from '@/features/teacher/class'
import { useQueryStudentList } from '@/features/teacher/class/hooks/useQueryStudentList'
import { useBindStudents, useUnbindStudents } from '@/features/teacher/class/hooks/useMutateClassStudents'
import { useQueryClassExperimentsGroupedByCourse, toCourseGroups } from '@/features/teacher/class/hooks/useQueryClassExperimentsGroupedByCourse'
import { useUnbindExperiment } from '@/features/teacher/class/hooks/useMutateClassExperiment'
import { formatDateTime } from '@/features/shared/utils/formatters'
import type { StudentClassRelation, ExperimentDetailItem } from '@/core/api/generated'
import BindClassExperimentDialog from '@/features/teacher/class-experiment/components/BindClassExperimentDialog.vue'

const router = useRouter()
const route = useRoute()
const confirm = useConfirm()
const toast = useToast()

const classCode = computed(() => (route.params as any).classCode as string)
const classId = computed(() => Number(route.query.id as string))

// 从 query 获取标题参数
const pageTitle = computed(() => {
  const title = route.query.title as string
  return title ? decodeURIComponent(title) : '编辑班级'
})

const activeTab = ref('students')
const isSubmitting = ref(false)
const formData = reactive({ className: '' })
const updateMutation = useUpdateClass()

// 初始化表单数据
formData.className = pageTitle.value

// ==================== 更新班级名称 ====================
async function handleUpdateClassName() {
  if (!formData.className?.trim()) {
    toast.add({ severity: 'warn', summary: '提示', detail: '请输入班级名称', life: 3000 })
    return
  }

  isSubmitting.value = true
  try {
    await updateMutation.mutateAsync({
      path: { id: classId.value },
      body: { className: formData.className },
    })
    toast.add({ severity: 'success', summary: '成功', detail: '班级名称更新成功', life: 3000 })
  } finally {
    isSubmitting.value = false
  }
}

// ==================== 学生管理 ====================
const {
  current: studentCurrent,
  size: studentSize,
  searchKeyword,
  students,
  total: studentTotal,
  isLoading: studentsLoading,
  query: studentQuery,
} = useQueryStudentList(classCode, { current: 1, size: 10 })

// 添加学生相关
const showAddStudentDialog = ref(false)
const studentInput = ref('')
const addingStudent = ref(false)
const bindStudentsMutation = useBindStudents()
const unbindStudentsMutation = useUnbindStudents()

// 页面挂载时查询学生数据
onMounted(() => {
  studentQuery.refetch()
})

// 监听标签页切换，自动加载数据
watch(activeTab, (newTab) => {
  if (newTab === 'students') {
    studentQuery.refetch()
  } else if (newTab === 'experiments') {
    experimentQuery.refetch()
  }
})

// 学生分页
const onStudentPageChange = (event: any) => {
  studentCurrent.value = event.page + 1
  studentSize.value = event.rows
}

// 学生搜索
const handleSearch = () => {
  studentCurrent.value = 1
}

// 添加学生
const handleAddStudents = async () => {
  if (!studentInput.value.trim()) {
    toast.add({ severity: 'warn', summary: '提示', detail: '请输入学生学号', life: 3000 })
    return
  }

  const usernames = studentInput.value
    .split(/[,\n\s]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  if (usernames.length === 0) {
    toast.add({ severity: 'warn', summary: '提示', detail: '请输入有效的学生学号', life: 3000 })
    return
  }

  addingStudent.value = true
  await bindStudentsMutation.mutateAsync({
    path: { classCode: classCode.value },
    body: {
      classCode: classCode.value,
      studentUsernames: usernames,
    },
  })

  toast.add({ severity: 'success', summary: '成功', detail: `成功添加 ${usernames.length} 名学生`, life: 3000 })

  showAddStudentDialog.value = false
  studentInput.value = ''
  studentQuery.refetch()
  addingStudent.value = false
}

// 移除学生
const confirmRemoveStudent = (student: StudentClassRelation) => {
  confirm.require({
    message: `确定要将学生"${student.studentUsername}"移出班级吗？`,
    header: '移除确认',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: '取消',
    acceptLabel: '移除',
    acceptClass: 'p-button-danger',
    accept: () => handleRemoveStudent(student),
  })
}

const handleRemoveStudent = async (student: StudentClassRelation) => {
  await unbindStudentsMutation.mutateAsync({
    path: { classCode: classCode.value },
    body: [student.studentUsername!],
  })

  toast.add({ severity: 'success', summary: '成功', detail: '学生已移出班级', life: 3000 })
  studentQuery.refetch()
}

// ==================== 实验管理 ====================
const { query: experimentQuery } = useQueryClassExperimentsGroupedByCourse(classCode)
const courseGroups = computed(() => toCourseGroups(experimentQuery.data.value))

// 折叠面板状态
const expandedPanels = ref<string[]>([])

// 是否全部展开
const allExpanded = computed(() => {
  if (courseGroups.value.length === 0) return false
  return courseGroups.value.every((group) => expandedPanels.value.includes(group.courseId))
})

// 一键展开/折叠
const toggleAllExpanded = () => {
  if (allExpanded.value) {
    expandedPanels.value = []
  } else {
    expandedPanels.value = courseGroups.value.map((group) => group.courseId)
  }
}

// 删除实验
const deleteExperimentMutation = useUnbindExperiment()

// 删除实验
const handleDeleteExperiment = (experiment: ExperimentDetailItem) => {
  const experimentId = experiment.experimentId?.toString()
  if (!experimentId || !classCode.value) return

  confirm.require({
    message: `确定要删除实验"${experiment.experimentName}"吗？此操作不可撤销。`,
    header: '删除确认',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: '取消',
    acceptLabel: '删除',
    acceptClass: 'p-button-danger',
    accept: async () => {
      await deleteExperimentMutation.mutateAsync({
        path: { experimentId },
        body: [classCode.value],
      })
      experimentQuery.refetch()
    },
  })
}

// ==================== 实验管理子对话框 ====================
const bindExperimentDialogRef = ref<InstanceType<typeof BindClassExperimentDialog>>()

const openBindExperimentDialog = () => {
  bindExperimentDialogRef.value?.open({ classCodes: [classCode.value] })
}

// 跳转到实验详情页面
const navigateToExperimentDetail = (experiment: ExperimentDetailItem, courseName?: string) => {
  router.push({
    path: `/teacher/classes/${classCode.value}/experiments/${experiment.classExperimentId}/detail`,
    query: {
      experimentName: encodeURIComponent(experiment.experimentName || '实验详情'),
      experimentId: experiment.experimentId,
      courseName: courseName ? encodeURIComponent(courseName) : undefined,
      className: encodeURIComponent(pageTitle.value),
    },
  })
}

const handleBack = () => {
  router.back()
}
</script>
