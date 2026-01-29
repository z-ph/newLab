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
    <div v-if="dataType === DATA_COLLECTION_TYPE.KEY_DATA">
      <label class="mb-2 block text-sm font-medium text-slate-700">关键数据字段</label>
      <p class="text-xs text-slate-500 mb-2">请输入JSON格式的数据字段定义</p>
      <Textarea
        v-model="dataFieldsJson"
        rows="4"
        class="w-full font-mono text-sm"
        :placeholder="JSON_FIELD_PLACEHOLDER"
      />
    </div>

    <!-- 表格数据类型 -->
    <div v-if="dataType === DATA_COLLECTION_TYPE.TABLE_DATA" class="space-y-2">
      <div>
        <label class="mb-2 block text-sm font-medium text-slate-700">表格行表头</label>
        <InputText
          v-model="tableRowHeadersStr"
          class="w-full"
          :placeholder="ROW_HEADERS_PLACEHOLDER"
        />
      </div>
      <div>
        <label class="mb-2 block text-sm font-medium text-slate-700">表格列���头</label>
        <InputText
          v-model="tableColumnHeadersStr"
          class="w-full"
          :placeholder="COLUMN_HEADERS_PLACEHOLDER"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  DATA_COLLECTION_TYPE_OPTIONS,
  DATA_COLLECTION_TYPE,
  JSON_FIELD_PLACEHOLDER,
  ROW_HEADERS_PLACEHOLDER,
  COLUMN_HEADERS_PLACEHOLDER,
} from '@/features/teacher/experiment/procedure/constants'

const dataType = defineModel<number | null>('dataType', { default: null })
const dataFieldsJson = defineModel<string>('dataFieldsJson', { default: '' })
const tableRowHeadersStr = defineModel<string>('tableRowHeadersStr', { default: '' })
const tableColumnHeadersStr = defineModel<string>('tableColumnHeadersStr', { default: '' })
</script>
