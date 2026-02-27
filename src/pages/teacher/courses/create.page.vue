<template>
  <div class="p-1 flex gap-0.5 flex-col">
    <Card>
      <template #content>
        <div class="mb-4 flex items-center justify-between">
          <h1 class="text-xl font-bold text-slate-900">创建课程</h1>
          <Button label="返回" icon="pi pi-arrow-left" severity="secondary" @click="handleBack" />
        </div>
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
            <Button label="取消" outlined @click="handleBack" />
            <Button label="创建" type="submit" :loading="isSubmitting" />
          </div>
        </form>
      </template>
    </Card>
    <CourseTable/>

  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useCreateCourse } from '@/features/teacher/course/hooks'
import type { CreateCourseRequest } from '@/core/api/generated'
import {
  CourseTable,
} from '@/features/teacher/course'

const router = useRouter()
const toast = useToast()

// 表单数据
const formData = reactive<Partial<CreateCourseRequest>>({
  courseName: '',
})

// 状态
const isSubmitting = ref(false)

// Hooks
const createMutation = useCreateCourse()

// 返回
const handleBack = () => {
  router.back()
}

// 提交表单
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
    await createMutation.mutateAsync({
      body: {
        courseName: formData.courseName,
      },
    })

    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '课程创建成功',
      life: 3000,
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>
