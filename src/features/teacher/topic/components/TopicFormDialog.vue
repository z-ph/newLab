<template>
  <Dialog v-model:visible="visible" :header="isEdit ? '编辑题目' : '新增题目'" modal :style="{ width: '700px' }">
    <form @submit.prevent="handleSubmit">
      <div class="space-y-4">
        <!-- 题目类型 -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">题目类型 <span class="text-red-500">*</span></label>
          <Select
            v-model="formData.type"
            :options="TOPIC_TYPE_OPTIONS"
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
          <div class="space-y-3">
            <!-- 学科标签 -->
            <div>
              <label class="block text-xs text-slate-600 mb-1">学科标签 <span class="text-red-500">*</span></label>
              <MultiSelect
                v-model="selectedSubjectTags"
                :options="subjectTagOptions"
                option-label="tagName"
                option-value="id"
                placeholder="选择学科标签"
                class="w-full"
                display="chip"
                :filter="true"
              />
              <!-- 快速创建学科标签 -->
              <div class="flex gap-2 mt-2">
                <InputText
                  v-model="newSubjectTagName"
                  placeholder="输入新学科标签名称（按回车快速创建）"
                  class="flex-1"
                  @keyup.enter="createNewSubjectTag"
                />
                <Button
                  label="创建"
                  size="small"
                  :disabled="!newSubjectTagName.trim() || isCreatingSubjectTag"
                  :loading="isCreatingSubjectTag"
                  @click="createNewSubjectTag"
                />
              </div>
            </div>

            <!-- 难度标签 -->
            <div>
              <label class="block text-xs text-slate-600 mb-1">难度标签 <span class="text-red-500">*</span></label>
              <MultiSelect
                v-model="selectedDifficultyTags"
                :options="difficultyTagOptions"
                option-label="tagName"
                option-value="id"
                placeholder="选择难度标签"
                class="w-full"
                display="chip"
                :filter="true"
              />
              <!-- 快速创建难度标签 -->
              <div class="flex gap-2 mt-2">
                <InputText
                  v-model="newDifficultyTagName"
                  placeholder="输入新难度标签名称（按回车快速创建）"
                  class="flex-1"
                  @keyup.enter="createNewDifficultyTag"
                />
                <Button
                  label="创建"
                  size="small"
                  :disabled="!newDifficultyTagName.trim() || isCreatingDifficultyTag"
                  :loading="isCreatingDifficultyTag"
                  @click="createNewDifficultyTag"
                />
              </div>
            </div>

            <!-- 自定义标签 -->
            <div>
              <label class="block text-xs text-slate-600 mb-1">自定义标签</label>
              <MultiSelect
                v-model="selectedCustomTags"
                :options="customTagOptions"
                option-label="tagName"
                option-value="id"
                placeholder="选择自定义标签"
                class="w-full"
                display="chip"
                :filter="true"
              />
              <!-- 快速创建自定义标签 -->
              <div class="flex gap-2 mt-2">
                <InputText
                  v-model="newCustomTagName"
                  placeholder="输入新自定义标签名称（按回车快速创建）"
                  class="flex-1"
                  @keyup.enter="createNewCustomTag"
                />
                <Button
                  label="创建"
                  size="small"
                  :disabled="!newCustomTagName.trim() || isCreatingCustomTag"
                  :loading="isCreatingCustomTag"
                  @click="createNewCustomTag"
                />
              </div>
            </div>

            <!-- 已选择的标签显示 -->
            <div v-if="selectedTags.length > 0" class="flex flex-wrap gap-2 mt-2">
              <Tag
                v-for="tagId in selectedTags"
                :key="tagId"
                :value="getTagNameById(tagId)"
                class="text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </form>

    <template #footer>
      <Button label="取消" severity="secondary" @click="close" />
      <Button label="确定" type="submit" :loading="isLoading" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue"
import type { CreateTopicRequest, UpdateTopicRequest } from "@/core/api/generated"
import { TOPIC_TYPE_OPTIONS, TOPIC_TYPE, TAG_TYPE } from "@/features/teacher/topic/constants"
import { useQueryTags } from "@/features/teacher/topic/hooks"
import { postApiTeacherTags } from "@/core/api/generated"
import client from "@/core/api/config"
import { useMutation } from "@tanstack/vue-query"
import { toast } from "@/core/utils/toast"
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
const { data: tags, refetch: refetchTags } = useQueryTags()

// 新标签名称（三个类型分别存储）
const newSubjectTagName = ref("")
const newDifficultyTagName = ref("")
const newCustomTagName = ref("")

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

// 选中的标签（按类型分组）
const selectedSubjectTags = ref<number[]>([])
const selectedDifficultyTags = ref<number[]>([])
const selectedCustomTags = ref<number[]>([])

// 创建学科标签 mutation
const createSubjectTagMutation = useMutation({
  mutationFn: (tagName: string) =>
    postApiTeacherTags({
      body: {
        tagName,
        type: TAG_TYPE.SUBJECT,
      },
      client,
    }),
  onSuccess: (response) => {
    toast.success("学科标签创建成功")
    refetchTags()
    const newTagId = response.data?.data
    if (newTagId && !selectedSubjectTags.value.includes(newTagId)) {
      selectedSubjectTags.value.push(newTagId)
    }
    newSubjectTagName.value = ""
  },
})

// 创建难度标签 mutation
const createDifficultyTagMutation = useMutation({
  mutationFn: (tagName: string) =>
    postApiTeacherTags({
      body: {
        tagName,
        type: TAG_TYPE.DIFFICULTY,
      },
      client,
    }),
  onSuccess: (response) => {
    toast.success("难度标签创建成功")
    refetchTags()
    const newTagId = response.data?.data
    if (newTagId && !selectedDifficultyTags.value.includes(newTagId)) {
      selectedDifficultyTags.value.push(newTagId)
    }
    newDifficultyTagName.value = ""
  },
})

// 创建自定义标签 mutation
const createCustomTagMutation = useMutation({
  mutationFn: (tagName: string) =>
    postApiTeacherTags({
      body: {
        tagName,
        type: TAG_TYPE.CUSTOM,
      },
      client,
    }),
  onSuccess: (response) => {
    toast.success("自定义标签创建成功")
    refetchTags()
    const newTagId = response.data?.data
    if (newTagId && !selectedCustomTags.value.includes(newTagId)) {
      selectedCustomTags.value.push(newTagId)
    }
    newCustomTagName.value = ""
  },
})

// 是否正在创建标签
const isCreatingSubjectTag = computed(() => createSubjectTagMutation.isPending.value)
const isCreatingDifficultyTag = computed(() => createDifficultyTagMutation.isPending.value)
const isCreatingCustomTag = computed(() => createCustomTagMutation.isPending.value)

// 所有选中的标签（合并）
const selectedTags = computed(() => {
  return [
    ...selectedSubjectTags.value,
    ...selectedDifficultyTags.value,
    ...selectedCustomTags.value,
  ]
})

// 按类型过滤的标签选项
const subjectTagOptions = computed(() => {
  return tags.value?.filter(t => t.type === TAG_TYPE.SUBJECT) || []
})

const difficultyTagOptions = computed(() => {
  return tags.value?.filter(t => t.type === TAG_TYPE.DIFFICULTY) || []
})

const customTagOptions = computed(() => {
  return tags.value?.filter(t => t.type === TAG_TYPE.CUSTOM) || []
})

// 是否显示选项
const showChoices = computed(() => formData.value.type === TOPIC_TYPE.SINGLE_CHOICE || formData.value.type === TOPIC_TYPE.MULTIPLE_CHOICE)

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
  selectedSubjectTags.value = []
  selectedDifficultyTags.value = []
  selectedCustomTags.value = []
  visible.value = true
}

// 打开对话框（编辑）
function openEdit(topic: { id?: number; type?: number; content?: string; choices?: string; correctAnswer?: string; tags?: Array<{ tagId?: number; tagType?: string }> }) {
  isEdit.value = true
  editTopicId.value = topic.id

  formData.value = {
    type: topic.type,
    content: topic.content,
    choices: topic.choices,
    correctAnswer: topic.correctAnswer,
    tagIds: topic.tags?.map((tagggggg) => tagggggg.tagId!).filter(Boolean),
  }

  // 解析选项
  if (topic.choices) {
    choiceList.value = topic.choices.split("$")
  } else {
    choiceList.value = ["", "", "", ""]
  }

  // 解析正确答案（多选题需要拆分为数组）
  if (topic.type === TOPIC_TYPE.MULTIPLE_CHOICE) {
    selectedChoices.value = (topic.correctAnswer || "").split("").filter(Boolean)
  } else {
    selectedChoices.value = []
  }

  // 根据标签类型分组设置选中状态
  selectedSubjectTags.value = []
  selectedDifficultyTags.value = []
  selectedCustomTags.value = []

  topic.tags?.forEach(t => {
    if (t.tagId) {
      if (t.tagType === TAG_TYPE.SUBJECT) {
        selectedSubjectTags.value.push(t.tagId)
      } else if (t.tagType === TAG_TYPE.DIFFICULTY) {
        selectedDifficultyTags.value.push(t.tagId)
      } else if (t.tagType === TAG_TYPE.CUSTOM) {
        selectedCustomTags.value.push(t.tagId)
      }
    }
  })

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
    }
    // 单选题的答案已经通过 v-model 直接更新到 formData.correctAnswer
  }

  // 验证必选标签
  if (selectedSubjectTags.value.length === 0) {
    toast.warn("请至少选择一个学科标签")
    return
  }

  if (selectedDifficultyTags.value.length === 0) {
    toast.warn("请至少选择一个难度标签")
    return
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

// 根据 tagId 获取标签名称
function getTagNameById(tagId: number): string {
  const tagggggg = tags.value?.find(t => t.id === tagId)
  return tagggggg?.tagName || `标签${tagId}`
}

// 创建新学科标签
async function createNewSubjectTag() {
  const trimmedName = newSubjectTagName.value.trim()
  if (!trimmedName) return

  // 检查标签是否已存在
  const existingTag = tags.value?.find(t => t.tagName === trimmedName && t.type === TAG_TYPE.SUBJECT)
  if (existingTag) {
    toast.warn(`学科标签"${trimmedName}"已存在，请从列表中选择`)
    return
  }

  try {
    await createSubjectTagMutation.mutateAsync(trimmedName)
  } catch (error) {
    // 错误已经在拦截器中处理
  }
}

// 创建新难度标签
async function createNewDifficultyTag() {
  const trimmedName = newDifficultyTagName.value.trim()
  if (!trimmedName) return

  // 检查标签是否已存在
  const existingTag = tags.value?.find(t => t.tagName === trimmedName && t.type === TAG_TYPE.DIFFICULTY)
  if (existingTag) {
    toast.warn(`难度标签"${trimmedName}"已存在，请从列表中选择`)
    return
  }

  try {
    await createDifficultyTagMutation.mutateAsync(trimmedName)
  } catch (error) {
    // 错误已经在拦截器中处理
  }
}

// 创建新自定义标签
async function createNewCustomTag() {
  const trimmedName = newCustomTagName.value.trim()
  if (!trimmedName) return

  // 检查标签是否已存在
  const existingTag = tags.value?.find(t => t.tagName === trimmedName && t.type === TAG_TYPE.CUSTOM)
  if (existingTag) {
    toast.warn(`自定义标签"${trimmedName}"已存在，请从列表中选择`)
    return
  }

  try {
    await createCustomTagMutation.mutateAsync(trimmedName)
  } catch (error) {
    // 错误已经在拦截器中处理
  }
}

// ✅ 暴露方法
defineExpose({
  open,
  openEdit,
  close,
})
</script>
