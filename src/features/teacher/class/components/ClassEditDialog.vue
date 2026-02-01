<template>
  <Dialog v-model:visible="visible" header="编辑班级" :modal="true" :style="{ maxWidth: '100vw' }">
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
        <Button label="取消" outlined @click="close" />
        <Button label="保存" type="submit" :loading="isSubmitting" />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useUpdateClass } from '@/features/teacher/class'
import { useToast } from 'primevue/usetoast'

const visible = ref(false)
const isSubmitting = ref(false)
const formData = reactive({ className: '' })
const updateMutation = useUpdateClass()
const toast = useToast()

let classId: number | undefined

interface ClassInfo {
  id?: number
  className?: string
}

function open(classInfo: ClassInfo) {
  classId = classInfo.id
  formData.className = classInfo.className || ''
  visible.value = true
}

function close() {
  visible.value = false
}

async function handleSubmit() {
  if (!formData.className?.trim()) {
    toast.add({
      severity: 'warn',
      summary: '提示',
      detail: '请输入班级名称',
      life: 3000,
    })
    return
  }

  if (!classId) {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '班级 ID 不存在',
      life: 3000,
    })
    return
  }

  isSubmitting.value = true
  try {
    await updateMutation.mutateAsync({
      path: { id: classId },
      body: { className: formData.className },
    })
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '班级更新成功',
      life: 3000,
    })
    close()
  } finally {
    isSubmitting.value = false
  }
}

defineExpose({ open, close })
</script>
