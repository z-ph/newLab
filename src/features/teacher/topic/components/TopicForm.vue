<template>
  <div class="max-w-2xl mx-auto space-y-4">
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

      <!-- 提交按钮 -->
      <div class="flex justify-end gap-2 mt-6">
        <Button label="取消" severity="secondary" @click="handleCancel" />
        <Button
          :label="isEdit ? '更新' : '创建'"
          type="submit"
          :loading="isSubmitting"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { useRouter } from "vue-router"
import type { CreateTopicRequest, UpdateTopicRequest, TopicDetailResponse } from "@/core/api/generated"
import { TOPIC_TYPE_OPTIONS, TOPIC_TYPE, TAG_TYPE } from "@/features/teacher/topic/constants"
import { useQueryTags, useCreateTag, useCreateTopic, useUpdateTopic } from "@/features/teacher/topic/hooks"
import { toast } from "@/core/utils/toast"
import TopicChoiceInput from "./TopicChoiceInput.vue"
import TopicAnswerInput from "./TopicAnswerInput.vue"

interface Props {
  topic?: TopicDetailResponse
}

interface Emits {
  (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const router = useRouter()

const isEdit = computed(() => !!props.topic?.id)

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

// ✅ 使用 Hook 创建标签
const createTagMutation = useCreateTag()

// ✅ 使用 Hook 创建/更新题目
const createMutation = useCreateTopic()
const updateMutation = useUpdateTopic()

const isSubmitting = computed(() => createMutation.isPending.value || updateMutation.isPending.value)

// 重置表单
const resetForm = () => {
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
  newSubjectTagName.value = ""
  newDifficultyTagName.value = ""
  newCustomTagName.value = ""
}

// 监听 props 变化，编辑模式下填充表单
watch(() => props.topic, (newTopic) => {
  if (newTopic) {
    formData.value = {
      type: newTopic.type,
      content: newTopic.content,
      choices: newTopic.choices,
      correctAnswer: newTopic.correctAnswer,
      tagIds: newTopic.tags?.map((t) => t.tagId!).filter(Boolean),
    }

    // 解析选项
    if (newTopic.choices) {
      choiceList.value = newTopic.choices.split("$")
    } else {
      choiceList.value = ["", "", "", ""]
    }

    // 解析正确答案（多选题需要拆分为数组）
    if (newTopic.type === TOPIC_TYPE.MULTIPLE_CHOICE) {
      selectedChoices.value = (newTopic.correctAnswer || "").split("").filter(Boolean)
    } else {
      selectedChoices.value = []
    }

    // 根据标签类型分组设置选中状态
    selectedSubjectTags.value = []
    selectedDifficultyTags.value = []
    selectedCustomTags.value = []

    newTopic.tags?.forEach(t => {
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
  } else {
    resetForm()
  }
}, { immediate: true })

// 创建学科标签
const createNewSubjectTag = async () => {
  const trimmedName = newSubjectTagName.value.trim()
  if (!trimmedName) return

  // 检查标签是否已存在
  const existingTag = tags.value?.find(t => t.tagName === trimmedName && t.type === TAG_TYPE.SUBJECT)
  if (existingTag) {
    toast.warn(`学科标签"${trimmedName}"已存在，请从列表中选择`)
    return
  }

  const response = await createTagMutation.mutateAsync({
    tagName: trimmedName,
    type: TAG_TYPE.SUBJECT,
  })

  const newTagId = response.data?.data
  if (newTagId && !selectedSubjectTags.value.includes(newTagId)) {
    selectedSubjectTags.value.push(newTagId)
  }

  newSubjectTagName.value = ""
  await refetchTags()
}

// 创建难度标签
const createNewDifficultyTag = async () => {
  const trimmedName = newDifficultyTagName.value.trim()
  if (!trimmedName) return

  // 检查标签是否已存在
  const existingTag = tags.value?.find(t => t.tagName === trimmedName && t.type === TAG_TYPE.DIFFICULTY)
  if (existingTag) {
    toast.warn(`难度标签"${trimmedName}"已存在，请从列表中选择`)
    return
  }

  const response = await createTagMutation.mutateAsync({
    tagName: trimmedName,
    type: TAG_TYPE.DIFFICULTY,
  })

  const newTagId = response.data?.data
  if (newTagId && !selectedDifficultyTags.value.includes(newTagId)) {
    selectedDifficultyTags.value.push(newTagId)
  }

  newDifficultyTagName.value = ""
  await refetchTags()
}

// 创建自定义标签
const createNewCustomTag = async () => {
  const trimmedName = newCustomTagName.value.trim()
  if (!trimmedName) return

  // 检查标签是否已存在
  const existingTag = tags.value?.find(t => t.tagName === trimmedName && t.type === TAG_TYPE.CUSTOM)
  if (existingTag) {
    toast.warn(`自定义标签"${trimmedName}"已存在，请从列表中选择`)
    return
  }

  const response = await createTagMutation.mutateAsync({
    tagName: trimmedName,
    type: TAG_TYPE.CUSTOM,
  })

  const newTagId = response.data?.data
  if (newTagId && !selectedCustomTags.value.includes(newTagId)) {
    selectedCustomTags.value.push(newTagId)
  }

  newCustomTagName.value = ""
  await refetchTags()
}

// 是否正在创建标签
const isCreatingSubjectTag = computed(() => createTagMutation.isPending.value)
const isCreatingDifficultyTag = computed(() => createTagMutation.isPending.value)
const isCreatingCustomTag = computed(() => createTagMutation.isPending.value)

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

// 根据 tagId 获取标签名称
function getTagNameById(tagId: number): string {
  const tag = tags.value?.find(t => t.id === tagId)
  return tag?.tagName || `标签${tagId}`
}

// 取消
const handleCancel = () => {
  router.push('/teacher/topics/list')
}

// 提交表单
async function handleSubmit() {
  // 基础验证
  if (formData.value.type === undefined) {
    toast.warn("请选择题目类型")
    return
  }

  if (!formData.value.content?.trim()) {
    toast.warn("请输入题目内容")
    return
  }

  // 构建选项字符串
  if (showChoices.value) {
    const validOptions = choiceList.value.filter(Boolean)
    if (validOptions.length < 2) {
      toast.warn("请至少填写2个选项")
      return
    }
    formData.value.choices = validOptions.join("$")
  } else {
    formData.value.choices = undefined
  }

  // 构建正确答案
  if (showChoices.value) {
    if (formData.value.type === TOPIC_TYPE.MULTIPLE_CHOICE) {
      // 多选题：拼接选中的选项
      const answer = selectedChoices.value.sort().join("")
      if (!answer) {
        toast.warn("请选择正确答案")
        return
      }
      formData.value.correctAnswer = answer
    } else if (!formData.value.correctAnswer?.trim()) {
      toast.warn("请选择正确答案")
      return
    }
    // 单选题的答案已经通过 v-model 直接更新到 formData.correctAnswer
  } else {
    // 判断题或填空题
    if (!formData.value.correctAnswer?.trim()) {
      toast.warn("请输入正确答案")
      return
    }
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
    await createMutation.mutateAsync(formData.value as CreateTopicRequest)
    toast.success("题目创建成功")
  } else {
    // 编辑
    await updateMutation.mutateAsync({
      id: props.topic!.id!,
      ...formData.value,
    } as UpdateTopicRequest)
    toast.success("题目更新成功")
  }

  emit("success")
  router.push('/teacher/topics/list')
}

// 监听类型变化，重置选项和答案
watch(() => formData.value.type, () => {
  choiceList.value = ["", "", "", ""]
  selectedChoices.value = []
})
</script>
