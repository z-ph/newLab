<template>
  <div>
    <label class="mb-2 block text-sm font-medium text-slate-700">表格表头配置</label>
    <p class="text-xs text-slate-500 mb-2">定义表格的行表头和列表头，用于收集表格形式数据</p>

    <Tabs v-model:value="activeTab">
      <TabList>
        <Tab value="interactive">交互式输入</Tab>
        <Tab value="text">文本输入</Tab>
      </TabList>
      <TabPanels>
        <!-- 交互式输入 -->
        <TabPanel value="interactive">
          <div class="space-y-4">
            <!-- 行表头 -->
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">表格行表头</label>
              <div class="space-y-2">
                <div
                  v-for="(_, index) in rowHeadersList"
                  :key="`row-${index}`"
                  class="flex items-center gap-2"
                >
                  <InputText
                    v-model="rowHeadersList[index]"
                    :placeholder="`行表头 ${index + 1}`"
                    class="flex-1"
                    @input="syncToText"
                  />
                  <Button
                    icon="pi pi-trash"
                    severity="danger"
                    outlined
                    @click="removeRowHeader(index)"
                    :disabled="rowHeadersList.length === 0"
                    v-tooltip.top="'删除'"
                  />
                </div>
                <Button
                  label="添加行表头"
                  icon="pi pi-plus"
                  severity="secondary"
                  outlined
                  class="w-full"
                  @click="addRowHeader"
                />
              </div>
            </div>

            <!-- 列表头 -->
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">表格列表头</label>
              <div class="space-y-2">
                <div
                  v-for="(_, index) in columnHeadersList"
                  :key="`column-${index}`"
                  class="flex items-center gap-2"
                >
                  <InputText
                    v-model="columnHeadersList[index]"
                    :placeholder="`列表头 ${index + 1}`"
                    class="flex-1"
                    @input="syncToText"
                  />
                  <Button
                    icon="pi pi-trash"
                    severity="danger"
                    outlined
                    @click="removeColumnHeader(index)"
                    :disabled="columnHeadersList.length === 0"
                    v-tooltip.top="'删除'"
                  />
                </div>
                <Button
                  label="添加列表头"
                  icon="pi pi-plus"
                  severity="secondary"
                  outlined
                  class="w-full"
                  @click="addColumnHeader"
                />
              </div>
            </div>

            <!-- 提示信息 -->
            <p class="text-xs text-slate-500">
              <i class="pi pi-info-circle mr-1"></i>
              定义表格的行和列表头，学生将按照此结构填写数据
            </p>
          </div>
        </TabPanel>

        <!-- 文本输入 -->
        <TabPanel value="text">
          <div class="space-y-4">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">表格行表头</label>
              <InputText
                v-model="rowHeadersStr"
                class="w-full"
                :placeholder="ROW_HEADERS_PLACEHOLDER"
                @input="syncFromText"
              />
              <p class="text-xs text-slate-500 mt-1">用逗号分隔多个表头，如：行1,行2,行3</p>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">表格列表头</label>
              <InputText
                v-model="columnHeadersStr"
                class="w-full"
                :placeholder="COLUMN_HEADERS_PLACEHOLDER"
                @input="syncFromText"
              />
              <p class="text-xs text-slate-500 mt-1">用逗号分隔多个表头，如：列1,列2,列3</p>
            </div>
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  ROW_HEADERS_PLACEHOLDER,
  COLUMN_HEADERS_PLACEHOLDER,
} from '@/features/teacher/experiment/procedure/constants'

// 定义模型
const rowHeadersStr = defineModel<string>('rowHeadersStr', { default: '' })
const columnHeadersStr = defineModel<string>('columnHeadersStr', { default: '' })

// Tab 状态
const activeTab = ref('interactive')

// 数据字段列表（交互式模式）
const rowHeadersList = ref<string[]>([])
const columnHeadersList = ref<string[]>([])

// ===== 行表头方法 =====
const addRowHeader = () => {
  rowHeadersList.value.push('')
  syncToText()
}

const removeRowHeader = (index: number) => {
  rowHeadersList.value.splice(index, 1)
  syncToText()
}

// ===== 列表头方法 =====
const addColumnHeader = () => {
  columnHeadersList.value.push('')
  syncToText()
}

const removeColumnHeader = (index: number) => {
  columnHeadersList.value.splice(index, 1)
  syncToText()
}

// ===== 数据同步方法 =====
// 从列表同步到文本
const syncToText = () => {
  rowHeadersStr.value = rowHeadersList.value.filter((h) => h).join(',')
  columnHeadersStr.value = columnHeadersList.value.filter((h) => h).join(',')
}

// 从文本同步到列表
const syncFromText = () => {
  rowHeadersList.value = rowHeadersStr.value ? rowHeadersStr.value.split(',') : []
  columnHeadersList.value = columnHeadersStr.value ? columnHeadersStr.value.split(',') : []
}

// 监听文本变化，自动同步到列表
watch(
  [() => rowHeadersStr.value, () => columnHeadersStr.value],
  () => {
    if (activeTab.value === 'text') {
      syncFromText()
    }
  },
)
</script>
