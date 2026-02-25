<template>
  <div class="space-y-4">
    <!-- 提交信息卡片 -->
    <Card>
      <template #content>
        <div class="space-y-3">
          <!-- 提交状态 -->
          <div class="flex items-center text-green-600">
            <i class="pi pi-check-circle text-2xl mr-3" />
            <div>
              <p class="text-base font-medium">已提交</p>
              <p class="text-xs text-slate-500">{{ formatDateTime(submissionTime) }}</p>
            </div>
          </div>

          <!-- 得分信息 -->
          <div v-if="score !== undefined" class="flex items-center text-slate-700">
            <i class="pi pi-star text-yellow-500 text-xl mr-3" />
            <div>
              <p class="text-sm">得分</p>
              <p class="text-lg font-semibold">{{ score }} 分</p>
            </div>
          </div>

          <!-- 教师评语 -->
          <div v-if="teacherComment" class="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
            <p class="text-xs font-medium text-blue-700 mb-1">
              <i class="pi pi-comment mr-1" />
              教师评语
            </p>
            <p class="text-sm text-slate-700">{{ teacherComment }}</p>
          </div>
        </div>
      </template>
    </Card>

    <!-- 提交的数据内容 -->
    <Card>
      <template #title>
        <div class="flex items-center">
          <i class="pi pi-database mr-2" />
          <span>{{ DATA_COLLECTION_TYPE_LABELS[type as keyof typeof DATA_COLLECTION_TYPE_LABELS] }}</span>
        </div>
      </template>
      <template #content>
        <!-- 关键数据展示 -->
        <div v-if="type === DATA_COLLECTION_TYPE.KEY_DATA">
          <div class="space-y-2">
            <div v-if="fieldKeys.length === 0" class="text-center py-4 bg-gray-50 rounded border border-gray-200">
              <p class="text-sm text-gray-500">暂无数据</p>
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="fieldName in fieldKeys"
                :key="fieldName"
                class="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0"
              >
                <label class="text-sm font-medium text-slate-700 w-32 shrink-0">{{ fieldName }}</label>
                <!-- 学生答案：正确用绿色，错误用红色 -->
                <span
                  class="text-sm font-medium"
                  :class="isAnswerCorrect(fieldName) ? 'text-green-600' : 'text-red-600'"
                >
                  {{ submittedData.fillBlankAnswers[fieldName] || '-' }}
                </span>
                <!-- 错误时显示括号里的正确答案（绿色） -->
                <span
                  v-if="!isAnswerCorrect(fieldName) && correctAnswerMap[fieldName]"
                  class="text-sm text-green-600"
                >
                  （{{ correctAnswerMap[fieldName] }}）
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 表格数据展示 -->
        <div v-else-if="type === DATA_COLLECTION_TYPE.TABLE_DATA">
          <div class="overflow-x-auto border border-slate-200 rounded">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th class="px-4 py-2 text-center text-xs font-medium text-slate-500 uppercase tracking-wider bg-slate-100 border-b border-r border-slate-200">
                    行 \ 列
                  </th>
                  <th
                    v-for="col in tableHeaders.columnHeaders"
                    :key="col"
                    class="px-4 py-2 text-left text-xs font-medium text-slate-700 uppercase tracking-wider bg-slate-100 border-b border-slate-200"
                  >
                    {{ col || '(未命名)' }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-slate-200">
                <tr v-for="row in tableHeaders.rowHeaders" :key="row">
                  <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-700 bg-slate-50 border-r border-slate-200">
                    {{ row || '(未命名)' }}
                  </td>
                  <td
                    v-for="col in tableHeaders.columnHeaders"
                    :key="`${row}-${col}`"
                    class="px-4 py-2 text-sm"
                  >
                    <!-- 学生答案：正确用绿色，错误用红色 -->
                    <span
                      :class="isTableCellCorrect(`${row}-${col}`) ? 'text-green-600' : 'text-red-600'"
                      class="font-medium"
                    >
                      {{ submittedData.tableCellAnswers[`${row}-${col}`] || '-' }}
                    </span>
                    <!-- 错误时显示括号里的正确答案（绿色） -->
                    <span
                      v-if="!isTableCellCorrect(`${row}-${col}`) && correctAnswerMap[`${row}-${col}`]"
                      class="text-green-600 ml-1"
                    >
                      （{{ correctAnswerMap[`${row}-${col}`] }}）
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 照片展示 -->
        <div v-if="submittedData.photos && submittedData.photos.length > 0" class="mt-4">
          <h4 class="text-sm font-medium text-slate-700 mb-2">实验照片</h4>
          <div class="grid grid-cols-2 gap-3">
            <div
              v-for="photo in submittedData.photos"
              :key="photo.id"
              class="relative"
            >
              <img
                :src="getPhotoUrl(photo.downloadKey)"
                :alt="photo.originalFileName || '照片'"
                class="w-full rounded border border-slate-200"
              />
            </div>
          </div>
        </div>

        <!-- 文档展示 -->
        <div v-if="submittedData.documents && submittedData.documents.length > 0" class="mt-4">
          <h4 class="text-sm font-medium text-slate-700 mb-2">实验文档</h4>
          <div class="space-y-2">
            <a
              v-for="doc in submittedData.documents"
              :key="doc.id"
              :href="getDocUrl(doc.downloadKey)"
              :download="doc.originalFileName"
              class="flex items-center gap-3 p-3 bg-slate-50 rounded border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              <i class="pi pi-file-pdf text-blue-500 text-xl" />
              <div class="flex-1">
                <p class="text-sm font-medium text-slate-700">{{ doc.originalFileName }}</p>
                <p class="text-xs text-slate-500">{{ formatFileSize(doc.fileSize) }}</p>
              </div>
              <i class="pi pi-download text-slate-400" />
            </a>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { DATA_COLLECTION_TYPE } from '@/features/teacher/experiment/procedure/constants'
import { DATA_COLLECTION_TYPE_LABELS } from '@/features/student/experiments/constants'
import { formatDateTime, formatFileSize } from '@/features/shared/utils/formatters'
import { parseTableConfig, fillBlankAnswersToRecord, tableCellAnswersToRecord } from '@/features/student/experiments/utils/dataCollection'
import type { DataCollectionDetail, DataCollectionDetail2 } from '@/core/api/generated'
import { baseURL } from '@/core/api/config'

interface Props {
  type: number
  submissionTime?: string
  score?: number
  teacherComment?: string
  dataCollectionDetail?: DataCollectionDetail | DataCollectionDetail2 | null
}

const props = defineProps<Props>()

// 提交的数据
const submittedData = computed(() => {
  const detail = props.dataCollectionDetail

  // 提取填空答案（新 API 返回 FillBlankAnswer[]）
  const fillBlankAnswers = fillBlankAnswersToRecord(detail?.fillBlankAnswers)

  // 提取表格答案（新 API 返回 TableCellAnswer[]）
  const tableCellAnswers = tableCellAnswersToRecord(detail?.tableCellAnswers)

  return {
    fillBlankAnswers,
    tableCellAnswers,
    photos: detail?.photos ?? [],
    documents: detail?.documents ?? [],
  }
})

// 关键数据字段名列表
const fieldKeys = computed(() => Object.keys(submittedData.value.fillBlankAnswers))

// 解析表格表头
const tableHeaders = computed(() => {
  return parseTableConfig(submittedData.value.tableCellAnswers)
})

// 解析正确答案 JSON
const correctAnswerMap = computed<Record<string, string>>(() => {
  const detail = props.dataCollectionDetail
  if (!detail || !('correctAnswer' in detail) || !detail.correctAnswer) {
    return {}
  }
  try {
    return JSON.parse(detail.correctAnswer) as Record<string, string>
  } catch {
    console.warn('[SubmittedStatus] 解析 correctAnswer 失败')
    return {}
  }
})

// 判断答案是否正确
function isAnswerCorrect(fieldName: string): boolean {
  const studentAnswer = submittedData.value.fillBlankAnswers[fieldName]
  const correctAnswer = correctAnswerMap.value[fieldName]
  if (!correctAnswer || studentAnswer === undefined) return true
  return studentAnswer.trim() === correctAnswer.trim()
}

// 判断表格单元格答案是否正确
function isTableCellCorrect(cellPosition: string): boolean {
  const studentAnswer = submittedData.value.tableCellAnswers[cellPosition]
  const correctAnswer = correctAnswerMap.value[cellPosition]
  if (!correctAnswer || studentAnswer === undefined) return true
  return studentAnswer.trim() === correctAnswer.trim()
}

// 获取图片 URL
function getPhotoUrl(downloadKey?: string): string {
  if (!downloadKey) return ''
  return `${baseURL}${downloadKey}`
}

// 获取文档 URL
function getDocUrl(downloadKey?: string): string {
  if (!downloadKey) return ''
  return `${baseURL}${downloadKey}`
}
</script>
