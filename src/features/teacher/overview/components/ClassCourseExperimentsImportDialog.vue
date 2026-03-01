<template>
  <Dialog v-model:visible="visible" header="一键导入班级课程实验" modal :style="{ maxWidth: '100vw' }">
    <div class="space-y-4">
      <!-- 导入说明 -->
      <div class="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
        <p class="mb-2 font-semibold">📋 导入说明</p>
        <ul class="list-inside list-disc space-y-1">
          <li>支持 .xlsx 和 .xls 格式的 Excel 文件</li>
          <li>一次性导入班级、课程、实验、课次信息</li>
          <li>支持合班上课（同一时间多个班级）</li>
          <li>导入前请先下载模板查看格式要求</li>
        </ul>
      </div>

      <!-- 下载模板 -->
      <div class="flex items-center justify-between rounded-lg border border-slate-200 p-4">
        <div>
          <p class="font-medium text-slate-900">Excel 导入模板</p>
          <p class="text-sm text-slate-600">下载标准模板，按要求填写信息</p>
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
    </div>

    <template #footer>
      <Button label="取消" severity="secondary" @click="close" :disabled="isImporting" />
      <Button
        label="开始导入"
        :loading="isImporting"
        :disabled="!selectedFile"
        @click="handleImport"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useToast } from "primevue/usetoast"
import type { FileUploadSelectEvent } from "primevue/fileupload"
import { useImportClassCourseExperiments } from "../hooks/useImportClassCourseExperiments"
import { useDownloadClassCourseExperimentsTemplate } from "../hooks/useDownloadClassCourseExperimentsTemplate"

interface Emits {
  (e: "success"): void
}

const emit = defineEmits<Emits>()
const toast = useToast()

// 对话框状态
const visible = ref(false)

// 文件选择状态
const selectedFile = ref<File>()
const selectedFileName = ref("")
const errorMessage = ref("")

// 导入状态
const importMutation = useImportClassCourseExperiments()
const isImporting = computed(() => importMutation.isPending.value)

// 下载模板
const downloadTemplateMutation = useDownloadClassCourseExperimentsTemplate()
const downloadingTemplate = computed(() => downloadTemplateMutation.isPending.value)

// 打开对话框
function open() {
  visible.value = true
  // 重置状态
  selectedFile.value = undefined
  selectedFileName.value = ""
  errorMessage.value = ""
}

// 关闭对话框
function close() {
  visible.value = false
}

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
    toast.add({
      severity: "warn",
      summary: "提示",
      detail: "请先选择要导入的 Excel 文件",
      life: 3000,
    })
    return
  }

  await importMutation.mutateAsync(selectedFile.value)

  // hook 的 onSuccess 已经处理了数据解析和 toast
  // 这里只需要处理组件逻辑：刷新列表、关闭对话框
  emit("success")

  // 延迟关闭对话框，让用户看到结果
  setTimeout(() => {
    close()
  }, 2000)
}

// 下载模板
function downloadTemplate() {
  downloadTemplateMutation.mutate()
}

// 暴露方法
defineExpose({
  open,
  close,
})
</script>
