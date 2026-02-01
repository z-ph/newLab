<template>
  <Dialog v-model:visible="visible" header="Excel 批量导入学生" modal :style="{ maxWidth: '100vw' }">
    <div class="space-y-4">
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

      <!-- 导入结果 -->
      <div v-if="importResult" class="rounded-lg border p-4">
        <h3 class="mb-3 font-semibold text-slate-900">导入结果</h3>
        <div class="rounded bg-slate-50 p-3 text-sm text-slate-700">
          {{ importResult }}
        </div>
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
import type { FileUploadSelectEvent } from "primevue/fileupload"
import { useToast } from "primevue/usetoast"
import { useImportStudentsByExcel } from "../hooks/useMutateClassImport"
import { getApiTestExcelTemplateUsers } from "@/core/api/generated"
import client from "@/core/api/config"

interface Emits {
  (e: "success"): void
}

const emit = defineEmits<Emits>()
const toast = useToast()

// 对话框状态
const visible = ref(false)

// 文件选择状态
const selectedFile = ref<File | null>(null)
const selectedFileName = ref("")
const errorMessage = ref("")

// 导入状态
const importMutation = useImportStudentsByExcel()
const isImporting = computed(() => importMutation.isPending.value)
const importResult = ref<string | null>(null)

// 下载模板状态
const downloadingTemplate = ref(false)

// 打开对话框
function open() {
  visible.value = true
  // 重置状态
  selectedFile.value = null
  selectedFileName.value = ""
  errorMessage.value = ""
  importResult.value = null
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
      selectedFile.value = null
      selectedFileName.value = ""
      return
    }

    // 验证文件大小（5MB）
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      errorMessage.value = "文件大小不能超过 5MB"
      selectedFile.value = null
      selectedFileName.value = ""
      return
    }

    selectedFile.value = file
    selectedFileName.value = file.name
    errorMessage.value = ""
    importResult.value = null
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

  try {
    const response = await importMutation.mutateAsync(selectedFile.value)
    importResult.value = response?.data ?? null

    toast.add({
      severity: "success",
      summary: "导入完成",
      detail: "学生数据导入成功",
      life: 3000,
    })

    // 通知父组件刷新列表
    emit("success")

    // 延迟关闭对话框，让用户看到结果
    setTimeout(() => {
      close()
    }, 2000)
  } catch (error) {
    // 错误已在拦截器中处理
    console.error("导入失败:", error)
  }
}

// 下载模板
async function downloadTemplate() {
  downloadingTemplate.value = true
  try {
    // 使用自定义的 responseType 选项下载文件
    const response = await getApiTestExcelTemplateUsers({
      client,
      headers: {
        Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    })

    // 类型守卫：检查响应数据是否为 Blob
    const responseData = response.data
    if (responseData instanceof Blob) {
      const url = window.URL.createObjectURL(responseData)
      const link = document.createElement("a")
      link.href = url
      link.download = "学生导入模板.xlsx"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.add({
        severity: "success",
        summary: "下载成功",
        detail: "模板文件已下载",
        life: 3000,
      })
    } else {
      throw new Error("响应数据格式错误，期望 Blob 类型")
    }
  } catch (error) {
    console.error("下载模板失败:", error)
    toast.add({
      severity: "error",
      summary: "下载失败",
      detail: "模板文件下载失败，请稍后重试",
      life: 3000,
    })
  } finally {
    downloadingTemplate.value = false
  }
}

// 暴露方法
defineExpose({
  open,
  close,
})
</script>
