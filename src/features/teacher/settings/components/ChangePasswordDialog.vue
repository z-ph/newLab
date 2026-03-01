<template>
  <Dialog
    v-model:visible="visible"
    header="修改密码"
    :modal="true"
    :style="{ width: '400px' }"
  >
    <form @submit.prevent="handleSubmit">
      <div class="flex flex-col gap-4">
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">
            新密码 <span class="text-red-500">*</span>
          </label>
          <Password
            v-model="formData.password"
            :feedback="false"
            toggleMask
            class="w-full"
            inputClass="w-full"
            placeholder="请输入6位数字密码"
          />
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">
            确认密码 <span class="text-red-500">*</span>
          </label>
          <Password
            v-model="formData.confirmPassword"
            :feedback="false"
            toggleMask
            class="w-full"
            inputClass="w-full"
            placeholder="请再次输入密码"
          />
        </div>
      </div>
      <div class="mt-6 flex justify-end gap-2">
        <Button label="取消" outlined @click="close" />
        <Button label="确认" type="submit" :loading="isSubmitting" />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import Dialog from 'primevue/dialog'
import Password from 'primevue/password'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import { useChangePassword } from '../hooks/useChangePassword'

const visible = ref(false)
const isSubmitting = ref(false)
const toast = useToast()
const changePasswordMutation = useChangePassword()

const formData = reactive({
  password: '',
  confirmPassword: '',
})

function open() {
  formData.password = ''
  formData.confirmPassword = ''
  visible.value = true
}

function close() {
  visible.value = false
}

async function handleSubmit() {
  if (!formData.password) {
    toast.add({
      severity: 'warn',
      summary: '提示',
      detail: '请输入新密码',
      life: 3000,
    })
    return
  }

  if (!/^\d{6}$/.test(formData.password)) {
    toast.add({
      severity: 'warn',
      summary: '提示',
      detail: '密码必须为6位数字',
      life: 3000,
    })
    return
  }

  if (formData.password !== formData.confirmPassword) {
    toast.add({
      severity: 'warn',
      summary: '提示',
      detail: '两次输入的密码不一致',
      life: 3000,
    })
    return
  }

  isSubmitting.value = true
  changePasswordMutation.mutate(
    {
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    },
    {
      onSuccess: () => {
        toast.add({
          severity: 'success',
          summary: '成功',
          detail: '密码修改成功',
          life: 3000,
        })
        close()
      },
      onSettled: () => {
        isSubmitting.value = false
      },
    },
  )
}

defineExpose({ open, close })
</script>
