<template>
  <div>
    <label class="mb-2 block text-sm font-medium text-slate-700">
      实验文档
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <p class="text-xs text-slate-500 mb-3">请上传 Word 文档（.doc 或 .docx 格式）</p>

    <!-- 文件信息 -->
    <div v-if="file" class="mb-3 p-3 bg-blue-50 rounded border border-blue-200 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <i class="pi pi-file-pdf text-blue-500 text-xl" />
        <div>
          <p class="text-sm font-medium text-slate-700">{{ file.name }}</p>
          <p class="text-xs text-slate-500">{{ formatFileSize(file.size) }}</p>
        </div>
      </div>
      <Button
        icon="pi pi-times"
        severity="danger"
        text
        size="small"
        @click="removeDocument"
        v-tooltip.top="'删除'"
      />
    </div>

    <!-- 上传按钮 -->
    <FileUpload
      v-else
      mode="basic"
      :accept="FILE_UPLOAD_LIMITS.DOC_ACCEPT"
      :auto="false"
      :custom-upload="true"
      choose-label="选择文档"
      class="w-full"
      @select="handleSelect"
      @uploader="() => {}"
    >
      <template #chooseicon>
        <i class="pi pi-upload mr-2" />
      </template>
    </FileUpload>

    <!-- 错误提示 -->
    <p v-if="errorMessage" class="mt-2 text-xs text-red-500">
      <i class="pi pi-exclamation-triangle mr-1" />
      {{ errorMessage }}
    </p>

    <!-- 提示信息 -->
    <p class="mt-2 text-xs text-slate-400">
      <i class="pi pi-info-circle mr-1" />
      支持上传 .doc 和 .docx 格式，文件大小不超过 20MB
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
const errorMessage = ref<string>('')

// 检查是否为有效的 Word 文档
function isValidWordFile(fileName: string): boolean {
  const validExtensions = ['.doc', '.docx']
  const lowerFileName = fileName.toLowerCase()
  return validExtensions.some(ext => lowerFileName.endsWith(ext))
}

// 处理文件选择
function handleSelect(event: { files: File[] }) {
  const selectedFile = event.files[0]
  if (!selectedFile) return

  errorMessage.value = ''

  // 验证文件类型
  if (!isValidWordFile(selectedFile.name)) {
    errorMessage.value = ERROR_MESSAGES.INVALID_DOC_FORMAT
    return
  }

  // 验证文件大小
  if (selectedFile.size > FILE_UPLOAD_LIMITS.DOC_MAX_SIZE) {
    errorMessage.value = ERROR_MESSAGES.DOC_TOO_LARGE
    return
  }

  file.value = selectedFile
  modelValue.value = selectedFile
}

// 删除文档
function removeDocument() {
  file.value = null
  errorMessage.value = ''
  modelValue.value = null
}

// 监听外部 modelValue 变化
watch(
  modelValue,
  (newValue) => {
    file.value = newValue
    errorMessage.value = ''
  }
)
</script>
