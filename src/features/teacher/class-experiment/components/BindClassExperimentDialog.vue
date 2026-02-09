<template>
  <Dialog v-model:visible="visible" header="添加班级实验配置" :modal="true" :style="{ width: '100vw' }">
    <form @submit.prevent="handleSubmit">
      <div class="flex flex-col gap-4">
        <!-- 课程选择 -->
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">
            选择课程 <span class="text-red-500">*</span>
          </label>
          <Select v-model="formData.courseId" :options="courseOptions" option-label="label" option-value="value"
            placeholder="请选择课程" filter fluid />
        </div>

        <!-- 实验选择 -->
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">
            选择实验 <span class="text-red-500">*</span>
          </label>
          <Select v-model="formData.experimentId" :options="filteredExperimentOptions" option-label="label"
            option-value="value" :placeholder="formData.courseId ? '请选择实验' : '请先选择课程'" filter
            :disabled="!formData.courseId" fluid />
        </div>

        <!-- 班级选择 -->
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">
            选择班级 <span class="text-red-500">*</span>
          </label>
          <MultiSelect v-model="formData.classCodes" :options="classOptions" option-label="label" option-value="value"
            placeholder="请选择班级（可多选）" filter display="chip" fluid />
        </div>

        <!-- 上课时间 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">
              上课开始时间
            </label>
            <DatePicker v-model="formData.startTime" showTime placeholder="选择开始时间" fluid />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">
              上课结束时间
            </label>
            <DatePicker v-model="formData.endTime" showTime placeholder="选择结束时间" fluid />
          </div>
        </div>


        <!-- 实验地点 -->
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">
            实验地点
          </label>
          <InputText v-model="formData.experimentLocation" placeholder="请输入实验地点" fluid />
        </div>
      </div>

      <div class="mt-6 flex justify-end gap-2">
        <Button label="取消" outlined @click="handleCancel" />
        <Button label="保存" type="submit" :loading="mutation.isPending.value" />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useQueryClassAll } from '@/features/teacher/class'
import { useQueryCourseAll } from '@/features/teacher/course'
import { useQueryExperimentAll } from '@/features/teacher/experiment'
import { useBindExperiment } from '@/features/teacher/class'
import { formatDateTime, formatTimeShort } from '@/features/shared/utils'
import type { BatchBindClassesToExperimentRequest } from '@/core/api/generated'

const toast = useToast()
const mutation = useBindExperiment()

// 查询数据
const classQuery = useQueryClassAll()
const courseQuery = useQueryCourseAll()
const experimentQuery = useQueryExperimentAll()

// 选项数据
const courseOptions = computed(() => {
  const courses = courseQuery.query.data.value?.records || []
  return courses.map((c: any) => ({
    label: `${c.courseName} (${c.courseId})`,
    value: c.courseId,
  }))
})

const classOptions = computed(() => {
  const classes = classQuery.query.data.value?.records || []
  return classes.map((c: any) => ({
    label: `${c.className} (${c.classCode})`,
    value: c.classCode,
  }))
})

const experimentOptions = computed(() => {
  const experiments = experimentQuery.data.value || []
  return experiments.map((e: any) => ({
    label: e.experimentName || '',
    value: String(e.id!),
    courseId: e.courseId,
  }))
})

// 根据选择的课程过滤实验
const filteredExperimentOptions = computed(() => {
  if (!formData.courseId) return []
  return experimentOptions.value.filter((exp) => exp.courseId === formData.courseId)
})

// 对话框状态
const visible = ref(false)
type SubmitFormData = {
  [K in keyof Required<BatchBindClassesToExperimentRequest>]: BatchBindClassesToExperimentRequest[K] | undefined
}
// 表单数据
interface FormData {
  courseId?: string
  experimentId?: string
  classCodes: string[]
  startTime: Date | null
  endTime: Date | null
  experimentLocation: string
  userName: string
}

const formData = reactive<FormData>({
  courseId: undefined,
  experimentId: undefined,
  classCodes: [],
  startTime: null,
  endTime: null,
  experimentLocation: '',
  userName: '',
})
const submitformData = computed<SubmitFormData>(() => ({
  courseId: formData.courseId,
  experimentId: formData.experimentId,
  classCodes: formData.classCodes,
  courseTime: formData.startTime && formData.endTime
    ? `${formatDateTime(formData.startTime)} - ${formatTimeShort(formData.endTime)}`
    : undefined,
  startTime: formData.startTime?.toISOString(),
  endTime: formData.endTime?.toISOString(),
  experimentLocation: formData.experimentLocation,
  userName: formData.userName,
}))
function open() {
  visible.value = true
}

function handleCancel() {
  visible.value = false
}

function resetForm() {
  formData.courseId = undefined
  formData.experimentId = undefined
  formData.classCodes = []
  formData.startTime = null
  formData.endTime = null
  formData.experimentLocation = ''
  formData.userName = ''
}

const handleSubmit = async () => {
  // 验证
  if (!formData.courseId) {
    toast.add({ severity: 'warn', summary: '提示', detail: '请选择课程', life: 3000 })
    return
  }

  if (!formData.experimentId) {
    toast.add({ severity: 'warn', summary: '提示', detail: '请选择实验', life: 3000 })
    return
  }

  if (!formData.classCodes || formData.classCodes.length === 0) {
    toast.add({ severity: 'warn', summary: '提示', detail: '请选择班级', life: 3000 })
    return
  }

  if (!formData.startTime) {
    toast.add({ severity: 'warn', summary: '提示', detail: '请选择实验开始填写时间', life: 3000 })
    return
  }

  if (!formData.endTime) {
    toast.add({ severity: 'warn', summary: '提示', detail: '请选择实验结束填写时间', life: 3000 })
    return
  }

  // 验证结束时间必须晚于开始时间
  if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
    toast.add({ severity: 'warn', summary: '提示', detail: '实验结束时间必须晚于开始时间', life: 3000 })
    return
  }


  await mutation.mutateAsync({ body: submitformData.value })

  toast.add({ severity: 'success', summary: '成功', detail: '班级实验配置添加成功', life: 3000 })
  visible.value = false
  resetForm()
}

defineExpose({ open })
</script>
