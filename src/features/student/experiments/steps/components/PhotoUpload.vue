<template>
  <div>
    <label class="mb-2 block text-sm font-medium text-slate-700">
      实验照片
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <p class="text-xs text-slate-500 mb-3">支持上传图片文件，移动端可直接拍照</p>

    <!-- 预览区域 -->
    <div v-if="previewUrl" class="mb-3">
      <div class="relative inline-block">
        <img
          :src="previewUrl"
          alt="预览图片"
          class="max-w-full h-auto rounded border border-slate-200 max-h-64 object-contain"
        />
        <Button
          icon="pi pi-times"
          severity="danger"
          size="small"
          class="absolute top-2 right-2"
          @click="removePhoto"
          v-tooltip.top="'删除'"
        />
      </div>
    </div>

    <!-- 上传按钮 -->
    <FileUpload
      mode="basic"
      :accept="FILE_UPLOAD_LIMITS.PHOTO_ACCEPT"
      :auto="false"
      :custom-upload="true"
      choose-label="选择图片"
      class="w-full"
      @select="handleSelect"
      @uploader="() => {}"
    >
      <template #chooseicon>
        <i class="pi pi-camera mr-2" />
      </template>
    </FileUpload>

    <!-- 错误提示 -->
    <p v-if="errorMessage" class="mt-2 text-xs text-red-500">
      <i class="pi pi-exclamation-triangle mr-1" />
      {{ errorMessage }}
    </p>

    <!-- 文件信息 -->
    <p v-if="file && !errorMessage" class="mt-2 text-xs text-slate-500">
      <i class="pi pi-file mr-1" />
      {{ file.name }} ({{ formatFileSize(file.size) }})
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { FILE_UPLOAD_LIMITS, ERROR_MESSAGES } from '@/features/student/experiments/constants'
import { formatFileSize } from '@/features/shared/utils/formatters'

interface Props {
  required?: boolean
}

defineProps<Props>()

const modelValue = defineModel<File | null>({ required: true })

const file = ref<File | null>(modelValue.value)
const previewUrl = ref<string | null>(null)
const errorMessage = ref<string>('')

// 处理文件选择
function handleSelect(event: { files: File[] }) {
  const selectedFile = event.files[0]
  if (!selectedFile) return

  errorMessage.value = ''

  // 验证文件类型
  if (!selectedFile.type.startsWith('image/')) {
    errorMessage.value = ERROR_MESSAGES.INVALID_PHOTO_FORMAT
    return
  }

  // 验证文件大小
  if (selectedFile.size > FILE_UPLOAD_LIMITS.PHOTO_MAX_SIZE) {
    errorMessage.value = ERROR_MESSAGES.PHOTO_TOO_LARGE
    return
  }

  file.value = selectedFile
  modelValue.value = selectedFile

  // 生成预览
  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result
    if (typeof result === 'string') {
      previewUrl.value = result
    }
  }
  reader.readAsDataURL(selectedFile)
}

// 删除照片
function removePhoto() {
  file.value = null
  previewUrl.value = null
  errorMessage.value = ''
  modelValue.value = null
}

// 监听外部 modelValue 变化
watch(
  modelValue,
  (newValue) => {
    file.value = newValue
    if (newValue) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result
        if (typeof result === 'string') {
          previewUrl.value = result
        }
      }
      reader.readAsDataURL(newValue)
    } else {
      previewUrl.value = null
    }
  }
)
</script>
