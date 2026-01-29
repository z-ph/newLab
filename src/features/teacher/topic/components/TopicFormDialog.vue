<template>
  <Dialog v-model:visible="visible" :header="isEdit ? '编辑题目' : '新增题目'" modal :style="{ width: '700px' }">
    <form @submit.prevent="handleSubmit">
      <div class="space-y-4">
        <!-- 题目类型 -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">题目类型 <span class="text-red-500">*</span></label>
          <Select
            v-model="formData.type"
            :options="typeOptions"
            option-label="label"
            option-value="value"
            placeholder="请选择题目类型"
            class="w-full"
            :disabled="isEdit"
          />
        </div>

        <!-- 题目内容 -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">题目内容 <span class="text-red-500">*</span></label>
          <Textarea
            v-model="formData.content"
            placeholder="请输入题目内容"
            rows="3"
            class="w-full"
          />
        </div>

        <!-- 选项（单选/多选题需要） -->
        <TopicChoiceInput
          v-if="showChoices"
          :choice-list="choiceList"
          @update:choice-list="choiceList = $event"
          @add-choice="addChoice"
        />

        <!-- 正确答案 -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">正确答案 <span class="text-red-500">*</span></label>
          <TopicAnswerInput
            :type="formData.type || 0"
            :choice-list="choiceList"
            :model-value="formData.correctAnswer || ''"
            @update:model-value="formData.correctAnswer = $event"
            :selected-choices="selectedChoices"
            @update:selected-choices="selectedChoices = $event"
          />
        </div>

        <!-- 标签选择 -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">标签</label>
          <MultiSelect
            v-model="selectedTags"
            :options="tags"
            option-label="tagName"
            option-value="tagId"
            placeholder="选择标签"
            class="w-full"
            display="chip"
          />
        </div>
      </div>

      <template #footer>
        <Button label="取消" severity="secondary" @click="close" />
        <Button label="确定" type="submit" :loading="isLoading" />
      </template>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue"
import type { CreateTopicRequest, UpdateTopicRequest } from "@/core/api/generated"
import { useQueryTags } from "@/features/teacher/topic/hooks"
import TopicChoiceInput from "./TopicChoiceInput.vue"
import TopicAnswerInput from "./TopicAnswerInput.vue"

interface Props {
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
})

interface Emits {
  (e: 'submit', data: CreateTopicRequest | UpdateTopicRequest): void
}

const emit = defineEmits<Emits>()

// ✅ 状态封装在组件内部
const visible = ref(false)
const isEdit = ref(false)
const editTopicId = ref<number>()

// ✅ 查询标签列表
const { data: tags } = useQueryTags()

// 题目类型选项
const typeOptions = [
  { label: "单选题", value: 1 },
  { label: "多选题", value: 2 },
  { label: "判断题", value: 3 },
  { label: "填空题", value: 4 },
  { label: "其他", value: 6 },
]

// 表单数据
const formData = ref<Partial<CreateTopicRequest>>({
  type: undefined,
  content: "",
  choices: undefined,
  correctAnswer: "",
  tagIds: [],
})

// 选项列表
const choiceList = ref<string[]>(["", "", "", ""])

// 多选选中的选项（临时存储）
const selectedChoices = ref<string[]>([])

// 选中的标签
const selectedTags = ref<number[]>([])

// 是否显示选项
const showChoices = computed(() => formData.value.type === 1 || formData.value.type === 2)

// 添加选项
function addChoice() {
  choiceList.value.push("")
}

// 打开对话框（新增）
function open() {
  isEdit.value = false
  editTopicId.value = undefined
  formData.value = {
    type: undefined,
    content: "",
    choices: undefined,
    correctAnswer: "",
    tagIds: [],
  }
  choiceList.value = ["", "", "", ""]
  selectedChoices.value = []
  selectedTags.value = []
  visible.value = true
}

// 打开对话框（编辑）
function openEdit(topic: { id?: number; type?: number; content?: string; choices?: string; correctAnswer?: string; tags?: Array<{ tagId?: number }> }) {
  isEdit.value = true
  editTopicId.value = topic.id

  formData.value = {
    type: topic.type,
    content: topic.content,
    choices: topic.choices,
    correctAnswer: topic.correctAnswer,
    tagIds: topic.tags?.map((tag) => tag.tagId!).filter(Boolean),
  }

  // 解析选项
  if (topic.choices) {
    choiceList.value = topic.choices.split("$")
  } else {
    choiceList.value = ["", "", "", ""]
  }

  // 解析正确答案（多选题需要拆分为数组）
  if (topic.type === 2) {
    selectedChoices.value = (topic.correctAnswer || "").split("").filter(Boolean)
  } else {
    selectedChoices.value = []
  }

  selectedTags.value = formData.value.tagIds || []
  visible.value = true
}

// 关闭对话框
function close() {
  visible.value = false
}

// 提交表单
function handleSubmit() {
  // 构建选项字符串
  if (showChoices.value) {
    const validOptions = choiceList.value.filter(Boolean)
    if (validOptions.length < 2) {
      // 至少需要2个选项
      return
    }
    formData.value.choices = validOptions.join("$")
  } else {
    formData.value.choices = undefined
  }

  // 构建正确答案
  if (showChoices.value) {
    if (formData.value.type === 2) {
      // 多选题：拼接选中的选项
      formData.value.correctAnswer = selectedChoices.value.sort().join("")
    } else {
      // 单选题：直接使用选中的选项
      formData.value.correctAnswer = selectedChoice.value
    }
  }

  // 设置标签
  formData.value.tagIds = selectedTags.value.length ? selectedTags.value : undefined

  if (!isEdit.value) {
    // 新增
    emit("submit", formData.value as CreateTopicRequest)
  } else {
    // 编辑
    emit("submit", {
      id: editTopicId.value!,
      ...formData.value,
    } as UpdateTopicRequest)
  }
}

// 监听类型变化，重置选项和答案
watch(() => formData.value.type, () => {
  choiceList.value = ["", "", "", ""]
  selectedChoices.value = []
})

// ✅ 暴露方法
defineExpose({
  open,
  openEdit,
  close,
})
</script>
