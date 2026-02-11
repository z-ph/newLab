<template>
  <div>
    <div class="flex items-center justify-between mb-2">
      <div>
        <label class="block text-sm font-medium text-slate-700">表格配置与答案</label>
        <p class="text-xs text-slate-500">定义表头并填写参考答案（可选）</p>
      </div>
      <div class="flex gap-2">
        <Button
          label="添加行"
          icon="pi pi-plus"
          size="small"
          outlined
          @click="addRow"
        />
        <Button
          label="添加列"
          icon="pi pi-plus"
          size="small"
          outlined
          @click="addColumn"
        />
        <Button
          label="预览"
          icon="pi pi-eye"
          size="small"
          outlined
          @click="showPreview = true"
        />
      </div>
    </div>

    <!-- 交互式表格编辑 -->
    <div class="overflow-x-auto border border-slate-200 rounded">
      <table class="min-w-full divide-y divide-slate-200">
        <thead class="bg-slate-50">
          <tr>
            <!-- 左上角空单元格 -->
            <th class="px-2 py-2 text-center text-xs font-medium text-slate-500 bg-slate-100 border-b border-r border-slate-200 w-16">
              行\列
            </th>
            <!-- 列表头（可编辑） -->
            <th
              v-for="(_, colIndex) in columnHeaders"
              :key="`col-${colIndex}`"
              class="px-2 py-2 bg-slate-100 border-b border-slate-200 min-w-[120px]"
            >
              <div class="flex items-center gap-1">
                <InputText
                  v-model="columnHeaders[colIndex]"
                  placeholder="列名"
                  class="flex-1 text-xs"
                  @input="syncData"
                />
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  size="small"
                  @click="removeColumn(colIndex)"
                  v-tooltip.top="'删除列'"
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-slate-200">
          <tr v-for="(_, rowIndex) in rowHeaders" :key="`row-${rowIndex}`">
            <!-- 行表头（可编辑） -->
            <td class="px-2 py-2 bg-slate-50 border-r border-slate-200">
              <div class="flex items-center gap-1">
                <span class="text-xs text-slate-500">{{ rowIndex + 1 }}.</span>
                <InputText
                  v-model="rowHeaders[rowIndex]"
                  placeholder="行名"
                  class="flex-1 text-xs"
                  @input="syncData"
                />
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  size="small"
                  @click="removeRow(rowIndex)"
                  v-tooltip.top="'删除行'"
                />
              </div>
            </td>
            <!-- 数据单元格（答案输入） -->
            <td
              v-for="(_, colIndex) in columnHeaders"
              :key="`cell-${rowIndex}-${colIndex}`"
              class="px-2 py-2"
            >
              <InputText
                v-model="cellAnswers[getCellKey(rowIndex, colIndex)]"
                placeholder="参考答案（可选）"
                class="w-full text-xs"
                @input="syncData"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 空状态 -->
    <div v-if="rowHeaders.length === 0 || columnHeaders.length === 0" class="text-center py-8 bg-blue-50 rounded mt-4">
      <i class="pi pi-table text-blue-500 text-3xl mb-2"></i>
      <p class="text-sm text-blue-700">点击"添加行"和"添加列"开始创建表格</p>
    </div>

    <!-- 提示信息 -->
    <div class="mt-4 p-3 bg-amber-50 rounded border border-amber-200">
      <p class="text-xs text-amber-800">
        <i class="pi pi-info-circle mr-1"></i>
        <strong>提示：</strong>
      </p>
      <ul class="text-xs text-amber-700 mt-1 space-y-1 ml-4">
        <li>• 点击表格中的"列名"或"行名"可以直接编辑表头</li>
        <li>• 在单元格中填写参考答案（可选），用于教师判分时参考</li>
        <li>• 答案不是必填的，可以只填部分关键单元格的答案</li>
      </ul>
    </div>

    <!-- 预览对话框 -->
    <Dialog
      v-model:visible="showPreview"
      header="学生视角预览"
      :style="{ width: '90vw', maxWidth: '800px' }"
      modal
    >
      <div class="space-y-4">
        <p class="text-sm text-slate-600">以下是学生填写数据时将看到的表格样式：</p>

        <!-- 学生视角预览 -->
        <div class="overflow-x-auto border border-slate-200 rounded">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-4 py-2 text-center text-xs font-medium text-slate-500 uppercase tracking-wider bg-slate-100 border-b border-r border-slate-200">
                  行 \ 列
                </th>
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
                <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-700 bg-slate-50 border-r border-slate-200">
                  {{ row || '(未命名)' }}
                </td>
                <td
                  v-for="col in columnHeaders"
                  :key="`${row}-${col}`"
                  class="px-4 py-2"
                >
                  <InputText
                    disabled
                    placeholder="在此输入数据"
                    class="w-full"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 答案统计 -->
        <div v-if="filledAnswerCount > 0" class="p-3 bg-green-50 rounded border border-green-200">
          <p class="text-xs text-green-800">
            <i class="pi pi-check-circle mr-1"></i>
            已填写 <strong>{{ filledAnswerCount }}</strong> 个参考答案，共 <strong>{{ totalCells }}</strong> 个单元格
          </p>
        </div>
      </div>

      <template #footer>
        <Button label="关闭" @click="showPreview = false" autofocus />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// 定义模型
const rowHeadersStr = defineModel<string>('rowHeadersStr', { default: '' })
const columnHeadersStr = defineModel<string>('columnHeadersStr', { default: '' })
const cellAnswersStr = defineModel<string>('cellAnswersStr', { default: '' })

// 预览对话框状态
const showPreview = ref(false)

// 表头和答案数据
const rowHeaders = ref<string[]>([])
const columnHeaders = ref<string[]>([])
const cellAnswers = ref<Record<string, string>>({})

// 获取单元格的 key
const getCellKey = (rowIndex: number, colIndex: number) => `${rowIndex}-${colIndex}`

// 添加行
const addRow = () => {
  rowHeaders.value.push(`行${rowHeaders.value.length + 1}`)
  syncData()
}

// 删除行
const removeRow = (index: number) => {
  rowHeaders.value.splice(index, 1)
  // 清理该行的答案
  Object.keys(cellAnswers.value).forEach(key => {
    if (key.startsWith(`${index}-`)) {
      delete cellAnswers.value[key]
    }
  })
  syncData()
}

// 添加列
const addColumn = () => {
  columnHeaders.value.push(`列${columnHeaders.value.length + 1}`)
  syncData()
}

// 删除列
const removeColumn = (index: number) => {
  columnHeaders.value.splice(index, 1)
  // 清理该列的答案
  Object.keys(cellAnswers.value).forEach(key => {
    const parts = key.split('-')
    const colIndex = parts[1] ? parseInt(parts[1]) : -1
    if (colIndex === index) {
      delete cellAnswers.value[key]
    }
  })
  syncData()
}

// 同步数据到字符串模型
const syncData = () => {
  // 同步表头
  rowHeadersStr.value = rowHeaders.value.filter(h => h.trim()).join(',')
  columnHeadersStr.value = columnHeaders.value.filter(h => h.trim()).join(',')

  // 同步答案：只保存有值的答案
  const answers: Record<string, string> = {}
  Object.entries(cellAnswers.value).forEach(([key, value]) => {
    if (value && value.trim()) {
      // 将行列索引转换为表头名称
      const parts = key.split('-')
      const rowIndex = parts[0] ? Number(parts[0]) : -1
      const colIndex = parts[1] ? Number(parts[1]) : -1
      if (rowIndex >= 0 && colIndex >= 0) {
        const rowName = rowHeaders.value[rowIndex]
        const colName = columnHeaders.value[colIndex]
        if (rowName && colName) {
          answers[`${rowName}-${colName}`] = value
        }
      }
    }
  })
  cellAnswersStr.value = JSON.stringify(answers)
}

// 从字符串初始化数据
const initFromStrings = () => {
  // 初始化表头
  if (rowHeadersStr.value) {
    rowHeaders.value = rowHeadersStr.value.split(',').filter(h => h.trim())
  } else {
    rowHeaders.value = []
  }

  if (columnHeadersStr.value) {
    columnHeaders.value = columnHeadersStr.value.split(',').filter(h => h.trim())
  } else {
    columnHeaders.value = []
  }

  // 初始化答案
  cellAnswers.value = {}
  if (cellAnswersStr.value) {
    try {
      const answers = JSON.parse(cellAnswersStr.value) as Record<string, string>
      // 将表头名称转换为行列索引
      Object.entries(answers).forEach(([key, value]) => {
        const parts = key.split('-')
        const rowName = parts[0] || ''
        const colName = parts[1] || ''
        const rowIndex = rowHeaders.value.indexOf(rowName)
        const colIndex = columnHeaders.value.indexOf(colName)
        if (rowIndex >= 0 && colIndex >= 0) {
          cellAnswers.value[getCellKey(rowIndex, colIndex)] = value
        }
      })
    } catch {
      // JSON 解析失败，忽略
    }
  }
}

// 监听字符串变化，初始化数据
watch(
  [() => rowHeadersStr.value, () => columnHeadersStr.value, () => cellAnswersStr.value],
  () => {
    initFromStrings()
  },
  { immediate: true }
)

// 统计数据
const totalCells = computed(() => rowHeaders.value.length * columnHeaders.value.length)
const filledAnswerCount = computed(() => {
  return Object.values(cellAnswers.value).filter(v => v && v.trim()).length
})
</script>
