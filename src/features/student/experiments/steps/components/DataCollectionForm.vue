<template>
  <div class="space-y-4">
    <!-- 步骤信息 -->
    <Card>
      <template #content>
        <div class="space-y-2">
          <h3 class="text-base font-medium text-gray-900">
            {{ DATA_COLLECTION_TYPE_LABELS[dataCollectionType as keyof typeof DATA_COLLECTION_TYPE_LABELS] }}
          </h3>
          <p v-if="isLoading" class="text-sm text-gray-400">
            <i class="pi pi-spin pi-spinner mr-1" />正在加载...
          </p>
          <p v-else-if="stepRemark" class="text-sm text-gray-600">
            {{ stepRemark }}
          </p>
        </div>
      </template>
    </Card>

    <!-- 数据表单 -->
    <Card>
      <template #content>
        <!-- 加载状态 -->
        <div v-if="isLoading" class="text-center py-8">
          <i class="pi pi-spin pi-spinner text-primary text-3xl mb-2" />
          <p class="text-sm text-gray-500">正在加载数据字段...</p>
        </div>

        <!-- 关键数据表单 -->
        <KeyDataForm
          v-else-if="dataCollectionType === DATA_COLLECTION_TYPE.KEY_DATA"
          v-model="formData.fillBlankAnswers"
          :data-fields="dataFields"
        />

        <!-- 表格数据表单 -->
        <TableDataForm
          v-else-if="dataCollectionType === DATA_COLLECTION_TYPE.TABLE_DATA"
          v-model="formData.tableCellAnswers"
          :row-headers="tableData.rowHeaders"
          :column-headers="tableData.columnHeaders"
        />

        <!-- 空状态 -->
        <div v-else class="text-center py-8 bg-gray-50 rounded border border-gray-200">
          <i class="pi pi-inbox text-gray-400 text-3xl mb-2" />
          <p class="text-sm text-gray-500">暂无数据配置</p>
        </div>
      </template>
    </Card>

    <!-- 照片上传（仅在需要时显示） -->
    <Card v-if="needPhoto">
      <template #title>照片上传</template>
      <template #content>
        <PhotoUpload
          v-model="formData.photo"
          :required="needPhoto"
        />
      </template>
    </Card>

    <!-- 文档上传（仅在需要时显示） -->
    <Card v-if="needDoc">
      <template #title>文档上传</template>
      <template #content>
        <DocumentUpload
          v-model="formData.document"
          :required="needDoc"
        />
      </template>
    </Card>

    <!-- 提交按钮 -->
    <div class="flex justify-end">
      <Button
        label="提交数据"
        severity="primary"
        :loading="isSubmitting"
        :disabled="!isFormValid"
        @click="handleSubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { DATA_COLLECTION_TYPE } from '@/features/teacher/experiment/procedure/constants'
import { DATA_COLLECTION_TYPE_LABELS } from '@/features/student/experiments/constants'
import { dataCollectionToFormData, recordToFillBlankAnswers, recordToTableCellAnswers, type DataCollectionFormData, type DataCollectionSubmitParams } from '@/features/student/experiments/utils/dataCollection'
import { useSubmitDataCollection } from '@/features/student/experiments/hooks'
import KeyDataForm from './KeyDataForm.vue'
import TableDataForm from './TableDataForm.vue'
import PhotoUpload from './PhotoUpload.vue'
import DocumentUpload from './DocumentUpload.vue'
import type { DataCollectionDetail } from '@/core/api/generated'

interface StepInfo {
  dataCollectionDetail?: DataCollectionDetail | null
  submissionTime?: string
  remark?: string
}

interface Props {
  stepId: number
  classCode: string
  stepInfo?: StepInfo | null
  isLoading?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submitted: []
}>()

// 完成数据采集 hook
const submitDataCollection = useSubmitDataCollection()

// 表单数据
const formData = ref<DataCollectionFormData>({
  fillBlankAnswers: {},
  tableCellAnswers: {},
  photo: null,
  document: null,
})

// 数据采集类型
const dataCollectionType = computed(() => {
  return props.stepInfo?.dataCollectionDetail?.type ?? DATA_COLLECTION_TYPE.KEY_DATA
})

// 步骤描述
const stepRemark = computed(() => {
  return props.stepInfo?.remark
})

// 是否需要上传照片
const needPhoto = computed(() => {
  return props.stepInfo?.dataCollectionDetail?.needPhoto ?? false
})

// 是否需要上传文档
const needDoc = computed(() => {
  return props.stepInfo?.dataCollectionDetail?.needDoc ?? false
})

// 解析数据配置（使用 computed 保持响应式）
const parsedData = computed(() => dataCollectionToFormData(props.stepInfo?.dataCollectionDetail))
const dataFields = computed(() => parsedData.value.dataFields)
const tableData = computed(() => parsedData.value.tableData)

// 提交中状态
const isSubmitting = computed(() => submitDataCollection.isPending.value)

// 表单验证
const isFormValid = computed(() => {
  // 照片验证
  if (needPhoto.value && !formData.value.photo) {
    return false
  }

  // 文档验证
  if (needDoc.value && !formData.value.document) {
    return false
  }

  // 关键数据：至少填写一个字段
  if (dataCollectionType.value === DATA_COLLECTION_TYPE.KEY_DATA) {
    const hasData = Object.values(formData.value.fillBlankAnswers).some(v => v && v.trim())
    if (!hasData) return false
  }

  // 表格数据：至少填写一个单元格
  if (dataCollectionType.value === DATA_COLLECTION_TYPE.TABLE_DATA) {
    const hasData = Object.values(formData.value.tableCellAnswers).some(v => v && v.trim())
    if (!hasData) return false
  }

  return true
})

// 处理提交
async function handleSubmit() {
  if (!isFormValid.value || !props.classCode) {
    return
  }

  // 构建提交参数
  const params: DataCollectionSubmitParams = {}

  // 添加填空答案（转换为 DTO 数组）
  if (dataCollectionType.value === DATA_COLLECTION_TYPE.KEY_DATA) {
    const hasAnswers = Object.values(formData.value.fillBlankAnswers).some(v => v && v.trim())
    if (hasAnswers) {
      params.fillBlankAnswers = recordToFillBlankAnswers(formData.value.fillBlankAnswers)
    }
  }

  // 添加表格答案（转换为 DTO 数组）
  if (dataCollectionType.value === DATA_COLLECTION_TYPE.TABLE_DATA) {
    const hasAnswers = Object.values(formData.value.tableCellAnswers).some(v => v && v.trim())
    if (hasAnswers) {
      params.tableCellAnswers = recordToTableCellAnswers(formData.value.tableCellAnswers)
    }
  }

  // 添加文件
  if (formData.value.photo) {
    params.photos = formData.value.photo
  }
  if (formData.value.document) {
    params.documents = formData.value.document
  }

  await submitDataCollection.mutateAsync({
    procedureId: props.stepId,
    classCode: props.classCode,
    data: params,
  })
  emit('submitted')
}
</script>
