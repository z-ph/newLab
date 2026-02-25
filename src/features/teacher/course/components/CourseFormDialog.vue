<template>
  <Dialog
    v-model:visible="visible"
    :header="isEdit ? '编辑课程' : '新建课程'"
    :modal="true"
    @update:visible="handleClose"
    :style="{ maxWidth: '100vw' }"
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
        <Button :label="isEdit ? '保存' : '创建'" type="submit" :loading="isSubmitting" />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useCreateCourse, useUpdateCourse } from '@/features/teacher/course/hooks'
import type { CreateCourseRequest } from '@/core/api/generated'

// ==================== 类型定义 ====================
type CourseFormData = Partial<CreateCourseRequest> & {
  id?: number
  courseId?: string
}

// ==================== 状态封装在组件内部 ====================
const visible = ref(false)
const isEdit = ref(false)
const isSubmitting = ref(false)
const toast = useToast()

// 表单数据
const formData = reactive<CourseFormData>({
  courseName: '',
})

// Hooks
const createMutation = useCreateCourse()
const updateMutation = useUpdateCourse()

// ==================== 打开对话框 ====================
interface OpenOptions {
  id?: number
  courseId?: string
  courseName?: string
}

function open(options: OpenOptions = {}) {
  isEdit.value = !!options.id
  formData.id = options.id
  formData.courseId = options.courseId
  formData.courseName = options.courseName || ''
  visible.value = true
}

// ==================== 关闭对话框 ====================
function close() {
  visible.value = false
}

// ==================== 关闭/重置 ====================
function handleClose() {
  visible.value = false
  // 重置表单
  formData.courseName = ''
}

// ==================== 提交表单 ====================
async function handleSubmit() {
  if (!formData.courseName?.trim()) {
    toast.add({
      severity: 'warn',
      summary: '提示',
      detail: '请输入课程名称',
      life: 3000,
    })
    return
  }

  isSubmitting.value = true

  try {
    if (isEdit.value) {
      // 编辑模式
      if (!formData.id) {
        toast.add({
          severity: 'error',
          summary: '错误',
          detail: '缺少课程ID',
          life: 3000,
        })
        return
      }

      await updateMutation.mutateAsync({
        path: { id: formData.id },
        body: {
          courseName: formData.courseName,
        },
      })

      toast.add({
        severity: 'success',
        summary: '成功',
        detail: '课程更新成功',
        life: 3000,
      })
    } else {
      // 创建模式
      await createMutation.mutateAsync({
        body: {
          courseName: formData.courseName,
          courseId:formData.courseName
        },
      })

      toast.add({
        severity: 'success',
        summary: '成功',
        detail: '课程创建成功',
        life: 3000,
      })
    }

    visible.value = false
  } finally {
    isSubmitting.value = false
  }
}
defineEmits(['refresh'])
// ==================== 暴露方法 ====================
defineExpose({ open, close })
</script>
