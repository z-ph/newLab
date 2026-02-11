<template>
  <div class="space-y-3 border-t border-slate-200 pt-3">
    <div>
      <label class="mb-2 block text-sm font-medium text-slate-700">
        数据类型 <span class="text-red-500">*</span>
      </label>
      <Select
        v-model="dataType"
        :options="DATA_COLLECTION_TYPE_OPTIONS"
        option-label="label"
        option-value="value"
        placeholder="选择数据类型"
        class="w-full"
      />
    </div>

    <!-- 关键数据类型 -->
    <KeyDataForm
      v-if="dataType === DATA_COLLECTION_TYPE.KEY_DATA"
      v-model="dataFieldsJson"
    />

    <!-- 表格数据类型 -->
    <TableDataForm
      v-if="dataType === DATA_COLLECTION_TYPE.TABLE_DATA"
      v-model:row-headers-str="tableRowHeadersStr"
      v-model:column-headers-str="tableColumnHeadersStr"
      v-model:cell-answers-str="tableCellAnswersStr"
    />
  </div>
</template>

<script setup lang="ts">
import {
  DATA_COLLECTION_TYPE_OPTIONS,
  DATA_COLLECTION_TYPE,
} from '@/features/teacher/experiment/procedure/constants'
import KeyDataForm from './KeyDataForm.vue'
import TableDataForm from './TableDataForm.vue'

const dataType = defineModel<number | null>('dataType', { default: null })
const dataFieldsJson = defineModel<string>('dataFieldsJson', { default: '' })
const tableRowHeadersStr = defineModel<string>('tableRowHeadersStr', { default: '' })
const tableColumnHeadersStr = defineModel<string>('tableColumnHeadersStr', { default: '' })
const tableCellAnswersStr = defineModel<string>('tableCellAnswersStr', { default: '' })
</script>
