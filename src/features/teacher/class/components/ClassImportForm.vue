<template>
  <div class="max-w-3xl mx-auto space-y-4">
    <!-- 导入说明 -->
    <div class="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
      <p class="mb-2 font-semibold">📋 导入说明</p>
      <ul class="list-inside list-disc space-y-1">
        <li>支持 .xlsx 和 .xls 格式的 Excel 文件</li>
        <li>Excel 第一列为学号，第二列为姓名（可选）</li>
        <li>导入前请先下载模板查看格式要求</li>
      </ul>
    </div>

    <!-- 下载模板 -->
    <div class="flex items-center justify-between rounded-lg border border-slate-200 p-4">
      <div>
        <p class="font-medium text-slate-900">Excel 导入模板</p>
        <p class="text-sm text-slate-600">下载标准模板，按要求填写学生信息</p>
      </div>
      <Button
        label="下载模板"
        icon="pi pi-download"
        outlined
        @click="downloadTemplate"
        :loading="downloadingTemplate"
      />
    </div>

    <!-- 文件上传 -->
    <div>
      <label class="mb-2 block text-sm font-medium text-slate-700">
        选择 Excel 文件 <span class="text-red-500">*</span>
      </label>
      <FileUpload
        mode="basic"
        accept=".xlsx,.xls"
        :max-file-size="5_000_000"
        :auto="false"
        choose-label="选择文件"
        class="w-full"
        @select="onFileSelect"
        :invalid="!!errorMessage"
      />
      <p v-if="selectedFileName" class="mt-2 text-sm text-slate-600">
        已选择: {{ selectedFileName }}
      </p>
      <p v-if="errorMessage" class="mt-2 text-sm text-red-600">
        {{ errorMessage }}
      </p>
    </div>

    <!-- 操作按钮 -->
    <div class="flex justify-end gap-2">
      <Button label="返回" severity="secondary" @click="handleCancel" :disabled="isImporting" />
      <Button
        label="开始导入"
        :loading="isImporting"
        :disabled="!selectedFile"
        @click="handleImport"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useRouter } from 'vue-router'
import { toast } from "@/core/utils/toast"
import type { FileUploadSelectEvent } from "primevue/fileupload"
import { useImportStudentsByExcel } from "../hooks/useMutateClassImport"
import { useDownloadExcelTemplate } from "../hooks/useQueryExcelTemplate"

interface Emits {
  (e: "success"): void
}

const emit = defineEmits<Emits>()
const router = useRouter()

// 文件选择状态
const selectedFile = ref<File>()
const selectedFileName = ref("")
const errorMessage = ref("")

// 导入状态
const importMutation = useImportStudentsByExcel()
const isImporting = computed(() => importMutation.isPending.value)

// 下载模板
const downloadTemplateMutation = useDownloadExcelTemplate()
const downloadingTemplate = computed(() => downloadTemplateMutation.isPending.value)

// 文件选择处理
function onFileSelect(event: FileUploadSelectEvent) {
  const files = event.files
  if (files && files.length > 0) {
    const file = files[0]

    // 验证文件类型（通过文件扩展名）
    const fileExtension = file.name.split(".").pop()?.toLowerCase()
    if (fileExtension !== "xlsx" && fileExtension !== "xls") {
      errorMessage.value = "请选择 .xlsx 或 .xls 格式的 Excel 文件"
      selectedFile.value = undefined
      selectedFileName.value = ""
      return
    }

    // 验证文件大小（5MB）
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      errorMessage.value = "文件大小不能超过 5MB"
      selectedFile.value = undefined
      selectedFileName.value = ""
      return
    }

    selectedFile.value = file
    selectedFileName.value = file.name
    errorMessage.value = ""
  }
}

// 执行导入
async function handleImport() {
  if (!selectedFile.value) {
    toast.warn("请先选择要导入的 Excel 文件")
    return
  }

  await importMutation.mutateAsync(selectedFile.value)
  emit("success")
  // 导入成功后返回列表页
  setTimeout(() => {
    router.push('/teacher/classes/list')
  }, 2000)
}

// 返回
const handleCancel = () => {
  router.back()
}

// 下载模板
function downloadTemplate() {
  downloadTemplateMutation.mutate()
}
</script>
