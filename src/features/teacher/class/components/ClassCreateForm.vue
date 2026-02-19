<template>
  <div class="max-w-2xl mx-auto space-y-4">
    <form @submit.prevent="handleSubmit">
      <div class="mb-4 flex flex-col gap-3">
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">
            班级名称 <span class="text-red-500">*</span>
          </label>
          <InputText v-model="formData.className" class="w-full" placeholder="请输入班级名称" />
        </div>
      </div>
      <div class="flex justify-end gap-2">
        <Button label="取消" outlined @click="handleCancel" />
        <Button label="创建" type="submit" :loading="isSubmitting" />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCreateClass } from '@/features/teacher/class'
import { toast } from '@/core/utils/toast'

const emit = defineEmits<{
  success: []
}>()

const router = useRouter()
const formData = reactive({ className: '' })
const isSubmitting = ref(false)
const createMutation = useCreateClass()

const handleCancel = () => {
  router.back()
}

async function handleSubmit() {
  if (!formData.className?.trim()) {
    toast.warn('请输入班级名称')
    return
  }

  isSubmitting.value = true
  try {
    await createMutation.mutateAsync({
      body: { className: formData.className },
    })
    toast.success('班级创建成功')
    emit('success')
    router.push('/teacher/classes/list')
  } finally {
    isSubmitting.value = false
  }
}
</script>
