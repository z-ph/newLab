<template>
  <div class="max-w-3xl mx-auto space-y-4">
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
        <Button label="返回" outlined @click="handleCancel" />
        <Button label="保存" type="submit" :loading="mutation.isPending.value" />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from '@/core/utils/toast'
import { useQueryClassAll } from '@/features/teacher/class'
import { useQueryCourseAll } from '@/features/teacher/course'
import { useQueryExperimentAll } from '@/features/teacher/experiment'
import { useBindExperiment } from '@/features/teacher/class'
import { formatDateTime, formatTimeShort } from '@/features/shared/utils/formatters'
import type { BatchBindClassesToExperimentRequest, Course, Class, Experiment } from '@/core/api/generated'

interface Props {
  initialClassCodes?: string[]
}

interface Emits {
  (e: "success"): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const router = useRouter()

const mutation = useBindExperiment()

// 查询数据
const classQuery = useQueryClassAll()
const courseQuery = useQueryCourseAll()
const experimentQuery = useQueryExperimentAll()

// 选项数据
const courseOptions = computed(() => {
  const courses = courseQuery.query.data.value?.records || []
  return courses.map((c: Course) => ({
    label: `${c.courseName} (${c.courseId})`,
    value: c.courseId,
  }))
})

const classOptions = computed(() => {
  const classes = classQuery.query.data.value?.records || []
  return classes.map((c: Class) => ({
    label: `${c.className} (${c.classCode})`,
    value: c.classCode,
  }))
})

const experimentOptions = computed(() => {
  const experiments = experimentQuery.data.value || []
  return experiments.map((e: Experiment) => ({
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

// 表单数据（使用 API 类型派生）
type FormData = Pick<BatchBindClassesToExperimentRequest, 'courseId' | 'experimentId' | 'classCodes' | 'experimentLocation'> & {
  startTime: Date | null
  endTime: Date | null
}

const formData = reactive<FormData>({
  courseId: undefined,
  experimentId: undefined,
  classCodes: props.initialClassCodes || [],
  startTime: null,
  endTime: null,
  experimentLocation: '',
})

const submitformData = computed((): BatchBindClassesToExperimentRequest => ({
  courseId: formData.courseId,
  experimentId: formData.experimentId,
  classCodes: formData.classCodes,
  courseTime: formData.startTime && formData.endTime
    ? `${formatDateTime(formData.startTime)} - ${formatTimeShort(formData.endTime)}`
    : undefined,
  startTime: formData.startTime?.toISOString(),
  endTime: formData.endTime?.toISOString(),
  experimentLocation: formData.experimentLocation || undefined,
}))

const handleCancel = () => {
  router.back()
}

const handleSubmit = async () => {
  // 验证
  if (!formData.courseId) {
    toast.warn('请选择课程')
    return
  }

  if (!formData.experimentId) {
    toast.warn('请选择实验')
    return
  }

  if (!formData.classCodes || formData.classCodes.length === 0) {
    toast.warn('请选择班级')
    return
  }

  if (!formData.startTime) {
    toast.warn('请选择实验开始填写时间')
    return
  }

  if (!formData.endTime) {
    toast.warn('请选择实验结束填写时间')
    return
  }

  // 验证结束时间必须晚于开始时间
  if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
    toast.warn('实验结束时间必须晚于开始时间')
    return
  }

  await mutation.mutateAsync({ body: submitformData.value })

  toast.success('班级实验配置添加成功')
  emit('success')
  // 重置表单
  formData.courseId = undefined
  formData.experimentId = undefined
  formData.classCodes = []
  formData.startTime = null
  formData.endTime = null
  formData.experimentLocation = ''
}
</script>
