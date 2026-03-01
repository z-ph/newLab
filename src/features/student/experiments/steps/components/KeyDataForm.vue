<template>
  <div>
    <label class="mb-2 block text-sm font-medium text-slate-700">关键数据字段</label>
    <p class="text-xs text-slate-500 mb-3">请填写以下数据字段</p>

    <!-- 空状态 -->
    <div v-if="fieldKeys.length === 0" class="text-center py-8 bg-gray-50 rounded border border-gray-200">
      <i class="pi pi-inbox text-gray-400 text-3xl mb-2" />
      <p class="text-sm text-gray-500">暂无数据字段</p>
    </div>

    <!-- 数据字段列表 -->
    <div v-else class="space-y-3">
      <div
        v-for="fieldName in fieldKeys"
        :key="fieldName"
        class="flex items-center gap-3"
      >
        <label class="text-sm font-medium text-slate-700 w-32 shrink-0">
          {{ fieldName }}
        </label>
        <InputText
          :model-value="modelValue[fieldName] ?? ''"
          placeholder="请输入数据"
          class="flex-1"
          @update:model-value="(val) => val !== undefined && updateField(fieldName, val)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  dataFields?: Record<string, string>
}

const props = defineProps<Props>()

const modelValue = defineModel<Record<string, string>>({ required: true })

// 字段名称列表
const fieldKeys = computed(() => Object.keys(props.dataFields ?? {}))

// 更新字段值
function updateField(fieldName: string, value: string) {
  modelValue.value[fieldName] = value
  // 触发响应式更新
  modelValue.value = { ...modelValue.value }
}
</script>
