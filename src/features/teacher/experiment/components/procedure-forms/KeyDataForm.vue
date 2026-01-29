<template>
  <div>
    <label class="mb-2 block text-sm font-medium text-slate-700">关键数据字段</label>
    <p class="text-xs text-slate-500 mb-2">定义数据名称和对应的正确答案，用于自动判分</p>

    <Tabs v-model:value="activeTab">
      <TabList>
        <Tab value="interactive">交互式输入</Tab>
        <Tab value="json">JSON 编辑器</Tab>
      </TabList>
      <TabPanels>
        <!-- 交互式输入 -->
        <TabPanel value="interactive">
          <div class="space-y-2">
            <!-- 数据字段列表 -->
            <div
              v-for="(field, index) in dataFieldsList"
              :key="index"
              class="flex items-center gap-2"
            >
              <InputText
                v-model="field.name"
                placeholder="数据名称（如：温度）"
                class="flex-1"
                @input="syncToJson"
              />
              <InputText
                v-model="field.value"
                placeholder="正确答案（如：25）"
                class="flex-1"
                @input="syncToJson"
              />
              <Button
                icon="pi pi-trash"
                severity="danger"
                outlined
                @click="removeField(index)"
                :disabled="dataFieldsList.length === 0"
                v-tooltip.top="'删除'"
              />
            </div>

            <!-- 添加按钮 -->
            <Button
              label="添加数据字段"
              icon="pi pi-plus"
              severity="secondary"
              outlined
              class="w-full"
              @click="addField"
            />

            <!-- 提示信息 -->
            <p class="text-xs text-slate-500 mt-2">
              <i class="pi pi-info-circle mr-1"></i>
              添加需要收集的数据字段和正确答案，系统将自动判分
            </p>
          </div>
        </TabPanel>

        <!-- JSON 编辑器 -->
        <TabPanel value="json">
          <Textarea
            v-model="dataFieldsJson"
            rows="8"
            class="w-full font-mono text-sm"
            :placeholder="JSON_FIELD_PLACEHOLDER"
            @input="syncFromJson"
          />
          <div v-if="jsonError" class="mt-2 text-xs text-red-500">
            <i class="pi pi-exclamation-triangle mr-1"></i>
            {{ jsonError }}
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { JSON_FIELD_PLACEHOLDER } from '@/features/teacher/experiment/procedure/constants'

// 数据字段接口
interface DataField {
  name: string
  value: string
}

// 定义模型
const dataFieldsJson = defineModel<string>({ default: '' })

// Tab 状态
const activeTab = ref('interactive')

// 数据字段列表（交互式模式）
const dataFieldsList = ref<DataField[]>([])

// JSON 解析错误信息
const jsonError = ref('')

// 添加数据字段
const addField = () => {
  dataFieldsList.value.push({ name: '', value: '' })
  syncToJson()
}

// 删除数据字段
const removeField = (index: number) => {
  dataFieldsList.value.splice(index, 1)
  syncToJson()
}

// 从列表同步到 JSON
const syncToJson = () => {
  const validFields = dataFieldsList.value.filter((field) => field.name && field.value)

  const obj: Record<string, string> = {}
  validFields.forEach((field) => {
    obj[field.name] = field.value
  })

  dataFieldsJson.value = JSON.stringify(obj, null, 2)
  jsonError.value = ''
}

// 从 JSON 同步到列表
const syncFromJson = () => {
  try {
    const obj = JSON.parse(dataFieldsJson.value)
    dataFieldsList.value = Object.entries(obj).map(([name, value]) => ({
      name,
      value: String(value),
    }))
    jsonError.value = ''
  } catch (e) {
    jsonError.value = 'JSON 格式错误，请检查语法'
  }
}

// 监听 dataFieldsJson 变化，自动同步到列表
watch(
  () => dataFieldsJson.value,
  (newValue) => {
    if (activeTab.value === 'json' && newValue) {
      syncFromJson()
    }
  },
)
</script>
