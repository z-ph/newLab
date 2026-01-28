<template>
  <Dialog
    v-model:visible="visible"
    :header="isEdit ? '编辑课程' : '新建课程'"
    :style="{ width: '50vw' }"
    :modal="true"
    @update:visible="handleClose"
  >
    <form @submit.prevent="handleSubmit">
      <div class="mb-4 flex flex-col gap-4">
        <!-- 课程名称 -->
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">
            课程名称 <span class="text-red-500">*</span>
          </label>
          <InputText
            v-model="formData.courseName"
            class="w-full"
            placeholder="请输入课程名称"
          />
        </div>
      </div>

      <div class="flex justify-end gap-2">
        <Button label="取消" outlined @click="handleClose" />
        <Button
          :label="isEdit ? '保存' : '创建'"
          type="submit"
          :loading="loading"
        />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useToast } from 'primevue/usetoast'

// ==================== 类型定义 ====================
interface CourseFormData {
  courseId?: string
  courseName?: string
}

interface Props {
  modelValue: boolean
  isEdit?: boolean
  initialData?: CourseFormData
  loading?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', data: CourseFormData): void
}

// ==================== Props & Emits ====================
const props = withDefaults(defineProps<Props>(), {
  isEdit: false,
  loading: false,
})

const emit = defineEmits<Emits>()

// ==================== Toast ====================
const toast = useToast()

// ==================== 响应式数据 ====================
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const formData = reactive<CourseFormData>({
  courseId: '',
  courseName: '',
})

// ==================== 监听初始数据 ====================
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      formData.courseId = newData.courseId || ''
      formData.courseName = newData.courseName || ''
    }
  },
  { immediate: true },
)

// ==================== 事件处理 ====================
const handleClose = () => {
  emit('update:modelValue', false)
  // 重置表单
  formData.courseId = ''
  formData.courseName = ''
}

const handleSubmit = () => {
  // 验证必填字段
  if (!props.isEdit && !formData.courseId?.trim()) {
    toast.add({
      severity: 'warn',
      summary: '提示',
      detail: '请输入课程编号',
      life: 3000,
    })
    return
  }

  if (!formData.courseName?.trim()) {
    toast.add({
      severity: 'warn',
      summary: '提示',
      detail: '请输入课程名称',
      life: 3000,
    })
    return
  }

  emit('submit', { ...formData })
}
</script>
