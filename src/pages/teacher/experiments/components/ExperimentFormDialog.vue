<template>
  <Dialog v-model:visible="visible" :header="isEdit ? '编辑实验' : '新建实验'" :style="{ width: '50vw' }"
    :modal="true">
    <form @submit.prevent="handleSubmit">
      <div class="mb-4 flex flex-col gap-3">
        <div v-if="!isEdit">
          <label class="mb-2 block text-sm font-medium text-slate-700">
            选择课程 <span class="text-red-500">*</span>
          </label>
          <Select v-model="selectedCourseId" :options="courseOptions" option-label="label" option-value="value"
            placeholder="请选择课程" class="w-full" :loading="coursesQuery.query.isLoading.value" filter />
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">
            实验名称 <span class="text-red-500">*</span>
          </label>
          <InputText v-model="formData.experimentName" class="w-full" placeholder="请输入实验名称" />
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">
            分数占比(%) <span class="text-red-500">*</span>
          </label>
          <InputNumber v-model="formData.percentage" :min="0" :max="100" class="w-full" placeholder="请输入分数占比" />
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">
            截止时间 <span class="text-red-500">*</span>
          </label>
          <DatePicker v-model="formData.endTime" showTime class="w-full" placeholder="请选择截止时间" fluid />
        </div>
      </div>
      <div class="flex justify-end gap-2">
        <Button label="取消" outlined @click="visible = false" />
        <Button label="保存" type="submit" :loading="isSubmitting" :disabled="!isEdit && !selectedCourseId" />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useCreateExperiment, useUpdateExperiment } from '@/features/teacher/experiment/hooks/useMutateExperiment'
import { useQueryCourseAll } from '@/features/teacher/course/hooks/useQueryCourse'
import type { ExperimentResponse } from '@/core/api/generated'

interface Props {
  experiment: ExperimentResponse | null
}

interface Emits {
  (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const visible = defineModel<boolean>()

const toast = useToast()
const createMutation = useCreateExperiment()
const updateMutation = useUpdateExperiment()

const isEdit = computed(() => !!props.experiment?.id)
const isSubmitting = computed(() => createMutation.isPending.value || updateMutation.isPending.value)

// 获取课程列表
const coursesQuery = useQueryCourseAll()

// 课程选项
const courseOptions = computed(() => {
  const pageData = coursesQuery.query.data.value
  const courses = pageData?.records || []
  return courses.map((c) => ({
    label: `${c.courseName} (${c.courseId})`,
    value: c.courseId,
  }))
})

const selectedCourseId = ref<string | null>(null)

const formData = ref({
  courseId: '',
  experimentName: '',
  percentage: 10,
  endTime: null as Date | null,
})

const resetForm = () => {
  formData.value = {
    courseId: '',
    experimentName: '',
    percentage: 10,
    endTime: null,
  }
  selectedCourseId.value = null
}

watch(() => props.experiment, (newExperiment) => {
  if (newExperiment) {
    formData.value = {
      courseId: newExperiment.courseId || '',
      experimentName: newExperiment.experimentName || '',
      percentage: newExperiment.percentage || 10,
      endTime: newExperiment.endTime ? new Date(newExperiment.endTime) : null,
    }
    selectedCourseId.value = newExperiment.courseId || null
  } else {
    resetForm()
  }
}, { immediate: true })

watch(selectedCourseId, (newCourseId) => {
  if (newCourseId) {
    formData.value.courseId = newCourseId
  }
})

watch(visible, (newVal) => {
  if (newVal) {
    // 加载课程列表
    coursesQuery.query.refetch()
  } else {
    resetForm()
  }
})

const handleSubmit = async () => {
  if (isEdit.value) {
    await updateMutation.mutateAsync({
      body: {
        id: props.experiment!.id,
        experimentName: formData.value.experimentName,
        percentage: formData.value.percentage,
        endTime: formData.value.endTime ? formData.value.endTime.toISOString() : undefined,
      },
    })
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '实验更新成功',
      life: 3000,
    })
  } else {
    await createMutation.mutateAsync({
      body: {
        courseId: formData.value.courseId,
        experimentName: formData.value.experimentName,
        percentage: formData.value.percentage,
        endTime: formData.value.endTime ? formData.value.endTime.toISOString() : undefined,
      },
    })
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '实验创建成功',
      life: 3000,
    })
  }
  emit('success')
}
</script>
