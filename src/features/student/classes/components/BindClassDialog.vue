<template>
  <Dialog
    v-model:visible="visible"
    header="加入班级"
    :style="{ width: '90vw', maxWidth: '400px' }"
    modal
  >
    <div class="space-y-4">
      <div>
        <label
          for="verificationCode"
          class="block text-sm font-medium text-gray-700 mb-2"
        >
          班级验证码
        </label>
        <InputText
          id="verificationCode"
          v-model="formData.verificationCode"
          placeholder="请输入班级验证码"
          class="w-full"
          :invalid="!!errorMessage"
        />
        <small v-if="errorMessage" class="p-error">{{ errorMessage }}</small>
      </div>

      <div class="text-sm text-gray-500 bg-blue-50 p-3 rounded">
        <p class="font-medium mb-1 text-blue-900">提示：</p>
        <p class="text-blue-700">请向授课教师索取班级验证码</p>
      </div>
    </div>

    <template #footer>
      <Button label="取消" text @click="close" />
      <Button
        label="加入"
        :loading="bindMutation.isPending.value"
        @click="handleBind"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useBindClass } from '../hooks'
import type { BindClassRequest } from '@/core/api/generated'

const visible = ref(false)
const errorMessage = ref('')
const formData = reactive<BindClassRequest>({
  verificationCode: '',
})

const bindMutation = useBindClass()

function open() {
  visible.value = true
  formData.verificationCode = ''
  errorMessage.value = ''
}

function close() {
  visible.value = false
  formData.verificationCode = ''
  errorMessage.value = ''
}

async function handleBind() {
  if (!formData.verificationCode) {
    errorMessage.value = '请输入班级验证码'
    return
  }

  await bindMutation.mutateAsync(formData.verificationCode)
  close()
}

defineExpose({
  open,
  close,
})
</script>
