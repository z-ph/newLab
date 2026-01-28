<template>
  <Dialog v-model:visible="visible" header="添加实验步骤" :style="{ width: '60vw' }" :modal="true">
    <form @submit.prevent="handleSubmit">
      <div class="mb-4 flex flex-col gap-3">
        <!-- 步骤类型 -->
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">步骤类型 <span class="text-red-500">*</span></label>
          <Select v-model="formData.type" :options="PROCEDURE_TYPE_OPTIONS" option-label="label" option-value="value"
            placeholder="选择步骤类型" class="w-full" />
        </div>

        <!-- 步骤描述 -->
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">步骤描述 <span class="text-red-500">*</span></label>
          <Textarea v-model="formData.remark" rows="3" class="w-full" placeholder="请输入步骤描述" />
        </div>

        <!-- 分数占比 -->
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">分数占比(%) <span class="text-red-500">*</span></label>
          <InputNumber v-model="formData.proportion" :min="0" :max="100" class="w-full" placeholder="请输入分数占比" />
        </div>

        <!-- 时间范围 -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">开始时间</label>
            <DatePicker v-model="formData.startTime" showTime showSeconds placeholder="选择开始时间" fluid class="w-full" />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">结束时间</label>
            <DatePicker v-model="formData.endTime" showTime showSeconds placeholder="选择结束时间" fluid class="w-full" />
          </div>
        </div>

        <!-- 可跳过 -->
        <div>
          <div class="flex items-center gap-2">
            <Checkbox v-model="formData.isSkip" binary />
            <label class="text-sm font-medium text-slate-700">允许学生跳过此步骤</label>
          </div>
        </div>

        <!-- 视频步骤特有字段 -->
        <div v-if="formData.type === 1" class="space-y-3 border-t border-slate-200 pt-3">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">视频ID <span class="text-red-500">*</span></label>
            <InputNumber v-model="formData.videoId" class="w-full" placeholder="请输入视频ID" />
          </div>
        </div>

        <!-- 数据收集步骤特有字段 -->
        <div v-if="formData.type === 2" class="space-y-3 border-t border-slate-200 pt-3">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">数据类型 <span class="text-red-500">*</span></label>
            <Select v-model="formData.dataType" :options="DATA_COLLECTION_TYPE_OPTIONS" option-label="label"
              option-value="value" placeholder="选择数据类型" class="w-full" />
          </div>
          <div v-if="formData.dataType === 1">
            <label class="mb-2 block text-sm font-medium text-slate-700">关键数据字段</label>
            <p class="text-xs text-slate-500 mb-2">请输入JSON格式的数据字段定义</p>
            <Textarea v-model="formData.dataFieldsJson" rows="4" class="w-full font-mono text-sm"
              placeholder='{"字段1": "答案1", "字段2": "答案2"}' />
          </div>
          <div v-if="formData.dataType === 2" class="space-y-2">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">表格行表头</label>
              <InputText v-model="formData.tableRowHeadersStr" class="w-full"
                placeholder="用逗号分隔，如：行1,行2,行3" />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">表格列表头</label>
              <InputText v-model="formData.tableColumnHeadersStr" class="w-full"
                placeholder="用逗号分隔，如：列1,列2,列3" />
            </div>
          </div>
        </div>

        <!-- 题库答题步骤特有字段 -->
        <div v-if="formData.type === 3" class="space-y-3 border-t border-slate-200 pt-3">
          <div class="flex items-center gap-2">
            <Checkbox v-model="formData.isRandom" binary />
            <label class="text-sm font-medium text-slate-700">随机抽取题目</label>
          </div>
          <div v-if="formData.isRandom">
            <label class="mb-2 block text-sm font-medium text-slate-700">题目数量 <span class="text-red-500">*</span></label>
            <InputNumber v-model="formData.topicNumber" :min="1" class="w-full" placeholder="请输入题目数量" />
          </div>
          <div v-if="formData.isRandom">
            <label class="mb-2 block text-sm font-medium text-slate-700">标签限制</label>

            <!-- 预定义标签 -->
            <div class="mb-3">
              <p class="text-xs text-slate-500 mb-2">选择预定义标签</p>
              <div class="flex flex-wrap gap-2">
                <div v-for="tag in PREDEFINED_TAGS" :key="tag" class="flex items-center gap-1">
                  <Checkbox
                    :input-id="`tag-${tag}`"
                    :model-value="selectedTagsMap[tag]"
                    :binary="true"
                    @update:model-value="val => selectedTagsMap[tag] = val"
                  />
                  <label :for="`tag-${tag}`" class="text-sm text-slate-700 cursor-pointer select-none">{{ tag }}</label>
                </div>
              </div>
            </div>

            <!-- 自定义标签输入 -->
            <div class="mb-3">
              <p class="text-xs text-slate-500 mb-2">或添加自定义标签</p>
              <div class="flex gap-2">
                <InputText v-model="customTagInput" placeholder="输入自定义标签" class="flex-1"
                  @keydown.enter.prevent="addCustomTag" />
                <Button label="添加" @click="addCustomTag" :disabled="!customTagInput.trim()" />
              </div>
            </div>

            <!-- 已选标签列表 -->
            <div v-if="formData.topicTags.length > 0">
              <p class="text-xs text-slate-500 mb-2">已选择 {{ formData.topicTags.length }} 个标签</p>
              <div class="flex flex-wrap gap-2">
                <Chip v-for="tag in formData.topicTags" :key="tag" :label="tag" removable
                  @remove="removeTag(tag)" class="bg-blue-50 text-blue-700" />
              </div>
            </div>
          </div>
          <div v-if="!formData.isRandom">
            <label class="mb-2 block text-sm font-medium text-slate-700">选定题目ID列表 <span class="text-red-500">*</span></label>
            <p class="text-xs text-slate-500 mb-2">用逗号分隔多个题目ID</p>
            <InputText v-model="formData.teacherSelectedTopicIdsStr" class="w-full" placeholder="如：1,2,3,4,5" />
          </div>
        </div>
      </div>
      <div class="flex justify-end gap-2">
        <Button label="取消" outlined @click="visible = false" />
        <Button label="添加" type="submit" :loading="isSubmitting" />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import {
  useCreateVideoProcedure,
  useCreateDataCollectionProcedure,
  useCreateTopicProcedure,
} from '@/features/teacher/experiment/procedure/hooks/useMutateProcedure'
import { PROCEDURE_TYPE_OPTIONS, DATA_COLLECTION_TYPE_OPTIONS } from '@/features/teacher/experiment/procedure/constants'

// 预定义标签
const PREDEFINED_TAGS = [
  '单选题',
  '多选题',
  '判断题',
  '填空题',
  '简答题',
  '计算题',
  '基础',
  '中等',
  '困难',
  '章节一',
  '章节二',
  '章节三',
]

interface Props {
  experimentId: number
}

interface Emits {
  (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const visible = defineModel<boolean>()

const toast = useToast()

const videoMutation = useCreateVideoProcedure()
const dataCollectionMutation = useCreateDataCollectionProcedure()
const topicMutation = useCreateTopicProcedure()

const isSubmitting = computed(() =>
  videoMutation.isPending.value ||
  dataCollectionMutation.isPending.value ||
  topicMutation.isPending.value
)

// 自定义标签输入
const customTagInput = ref('')

const formData = ref({
  type: null as number | null,
  remark: '',
  proportion: 10,
  isSkip: false,
  startTime: null as Date | null,
  endTime: null as Date | null,
  // 视频步骤
  videoId: null as number | null,
  // 数据收集步骤
  dataType: null as number | null,
  dataFieldsJson: '',
  tableRowHeadersStr: '',
  tableColumnHeadersStr: '',
  // 题库步骤
  isRandom: false,
  topicNumber: null as number | null,
  topicTags: [] as string[],
  teacherSelectedTopicIdsStr: '',
})

// 预定义标签选中状态映射
const selectedTagsMap = ref<Record<string, boolean>>({})

// 初始化标签映射
watch(() => formData.value.topicTags, (tags) => {
  PREDEFINED_TAGS.forEach(tag => {
    selectedTagsMap.value[tag] = tags.includes(tag)
  })
}, { deep: true })

// 监听预定义标签变化，同步到 topicTags
watch(selectedTagsMap, (map) => {
  Object.entries(map).forEach(([tag, selected]) => {
    const index = formData.value.topicTags.indexOf(tag)
    if (selected && index === -1) {
      formData.value.topicTags.push(tag)
    } else if (!selected && index > -1) {
      formData.value.topicTags.splice(index, 1)
    }
  })
}, { deep: true })

watch(visible, (newValue) => {
  if (!newValue) {
    resetForm()
  }
})

watch(() => formData.value.type, () => {
  // 切换类型时重置特定字段
  formData.value.videoId = null
  formData.value.dataType = null
  formData.value.dataFieldsJson = ''
  formData.value.tableRowHeadersStr = ''
  formData.value.tableColumnHeadersStr = ''
  formData.value.isRandom = false
  formData.value.topicNumber = null
  formData.value.topicTags = []
  formData.value.teacherSelectedTopicIdsStr = ''
})

const resetForm = () => {
  formData.value = {
    type: null,
    remark: '',
    proportion: 10,
    isSkip: false,
    startTime: null,
    endTime: null,
    videoId: null,
    dataType: null,
    dataFieldsJson: '',
    tableRowHeadersStr: '',
    tableColumnHeadersStr: '',
    isRandom: false,
    topicNumber: null,
    topicTags: [],
    teacherSelectedTopicIdsStr: '',
  }
  // 重置标签映射
  selectedTagsMap.value = {}
  customTagInput.value = ''
}

const formatDateTime = (date: Date | null): string | undefined => {
  if (!date) return undefined
  return date.toISOString()
}

const parseJson = (jsonStr: string) => {
  try {
    return JSON.parse(jsonStr || '{}')
  } catch {
    return {}
  }
}

const parseArray = (str: string): string[] | undefined => {
  if (!str.trim()) return undefined
  return str.split(',').map(s => s.trim()).filter(Boolean)
}

// 标签操作函数
const addCustomTag = () => {
  const tag = customTagInput.value.trim()
  if (tag && !formData.value.topicTags.includes(tag)) {
    formData.value.topicTags.push(tag)
    customTagInput.value = ''
    // 如果是预定义标签，同步更新映射
    if (PREDEFINED_TAGS.includes(tag)) {
      selectedTagsMap.value[tag] = true
    }
  }
}

const removeTag = (tag: string) => {
  const index = formData.value.topicTags.indexOf(tag)
  if (index > -1) {
    formData.value.topicTags.splice(index, 1)
    // 如果是预定义标签，同步更新映射
    if (PREDEFINED_TAGS.includes(tag)) {
      selectedTagsMap.value[tag] = false
    }
  }
}

const handleSubmit = async () => {
  if (!formData.value.type) {
    toast.add({
      severity: 'warn',
      summary: '提示',
      detail: '请选择步骤类型',
      life: 3000,
    })
    return
  }

  const type = formData.value.type

  // 基础验证
  if (!formData.value.remark.trim()) {
    toast.add({ severity: 'warn', summary: '提示', detail: '请输入步骤描述', life: 3000 })
    return
  }

  const baseBody = {
    experimentId: props.experimentId,
    remark: formData.value.remark,
    proportion: formData.value.proportion,
    isSkip: formData.value.isSkip,
    startTime: formatDateTime(formData.value.startTime),
    endTime: formatDateTime(formData.value.endTime),
  }

  if (type === 1) {
    // 视频步骤
    if (!formData.value.videoId) {
      toast.add({ severity: 'warn', summary: '提示', detail: '请输入视频ID', life: 3000 })
      return
    }
    await videoMutation.mutateAsync({
      body: {
        ...baseBody,
        videoId: formData.value.videoId,
      },
    })
  } else if (type === 2) {
    // 数据收集步骤
    if (!formData.value.dataType) {
      toast.add({ severity: 'warn', summary: '提示', detail: '请选择数据类型', life: 3000 })
      return
    }
    const body: any = {
      ...baseBody,
      dataType: formData.value.dataType,
    }
    if (formData.value.dataType === 1) {
      body.dataFields = parseJson(formData.value.dataFieldsJson)
    } else if (formData.value.dataType === 2) {
      body.tableRowHeaders = parseArray(formData.value.tableRowHeadersStr)
      body.tableColumnHeaders = parseArray(formData.value.tableColumnHeadersStr)
      body.tableDataAnswers = {}
    }
    await dataCollectionMutation.mutateAsync({ body })
  } else if (type === 3) {
    // 题库答题步骤
    const body: any = { ...baseBody }
    if (formData.value.isRandom) {
      if (!formData.value.topicNumber) {
        toast.add({ severity: 'warn', summary: '提示', detail: '请输入题目数量', life: 3000 })
        return
      }
      body.isRandom = true
      body.topicNumber = formData.value.topicNumber
      body.topicTags = formData.value.topicTags
    } else {
      const ids = parseArray(formData.value.teacherSelectedTopicIdsStr)
      if (!ids || ids.length === 0) {
        toast.add({ severity: 'warn', summary: '提示', detail: '请输入题目ID', life: 3000 })
        return
      }
      body.isRandom = false
      body.teacherSelectedTopicIds = ids.map(Number)
    }
    await topicMutation.mutateAsync({ body })
  }

  toast.add({
    severity: 'success',
    summary: '成功',
    detail: '步骤添加成功',
    life: 3000,
  })

  emit('success')
}
</script>
