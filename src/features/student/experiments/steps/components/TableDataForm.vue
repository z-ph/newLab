<template>
  <div>
    <label class="mb-2 block text-sm font-medium text-slate-700">表格数据</label>
    <p class="text-xs text-slate-500 mb-3">请在表格中填写实验数据</p>

    <!-- 空状态 -->
    <div v-if="rowHeaders.length === 0 || columnHeaders.length === 0" class="text-center py-8 bg-gray-50 rounded border border-gray-200">
      <i class="pi pi-table text-gray-400 text-3xl mb-2" />
      <p class="text-sm text-gray-500">暂无表格数据</p>
    </div>

    <!-- 表格编辑器 -->
    <div v-else class="overflow-x-auto border border-slate-200 rounded">
      <table class="min-w-full divide-y divide-slate-200">
        <thead class="bg-slate-50">
          <tr>
            <!-- 左上角空单元格 -->
            <th class="px-4 py-2 text-center text-xs font-medium text-slate-500 uppercase tracking-wider bg-slate-100 border-b border-r border-slate-200">
              行 \ 列
            </th>
            <!-- 列表头 -->
            <th
              v-for="col in columnHeaders"
              :key="col"
              class="px-4 py-2 text-left text-xs font-medium text-slate-700 uppercase tracking-wider bg-slate-100 border-b border-slate-200"
            >
              {{ col || '(未命名)' }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-slate-200">
          <tr v-for="row in rowHeaders" :key="row">
            <!-- 行表头 -->
            <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-700 bg-slate-50 border-r border-slate-200">
              {{ row || '(未命名)' }}
            </td>
            <!-- 数据单元格 -->
            <td
              v-for="col in columnHeaders"
              :key="`${row}-${col}`"
              class="px-2 py-2"
            >
              <InputText
                :model-value="modelValue[`${row}-${col}`] ?? ''"
                placeholder="请输入"
                class="w-full"
                @update:model-value="(val) => val !== undefined && updateCell(row, col, val)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'

interface Props {
  rowHeaders: string[]
  columnHeaders: string[]
  modelValue: Record<string, string>
}

const props = defineProps<Props>()

const modelValue = defineModel<Record<string, string>>({ required: true })

// 更新单元格答案
function updateCell(row: string, col: string, value: string) {
  const key = `${row}-${col}`
  if (value) {
    modelValue.value[key] = value
  } else {
    delete modelValue.value[key]
  }
  // 触发响应式更新
  modelValue.value = { ...modelValue.value }
}

// 监听表头变化，清除无效的单元格数据
watch(
  [() => props.rowHeaders, () => props.columnHeaders],
  ([newRows, newCols]) => {
    const validKeys = new Set<string>()
    newRows?.forEach((row) => {
      newCols?.forEach((col) => {
        validKeys.add(`${row}-${col}`)
      })
    })

    // 清除无效的单元格
    Object.keys(modelValue.value).forEach((key) => {
      if (!validKeys.has(key)) {
        delete modelValue.value[key]
      }
    })
    modelValue.value = { ...modelValue.value }
  },
  { deep: true }
)
</script>
