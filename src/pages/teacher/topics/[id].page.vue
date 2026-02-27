<template>
  <div class="p-1 space-y-4">
    <Card>
      <template #content>
        <div class="mb-4 flex items-center justify-between">
          <h1 class="text-xl font-bold text-slate-900">{{ isEdit ? '编辑题目' : '查看题目' }}</h1>
          <div class="flex gap-2">
            <Button
              v-if="!isEdit"
              label="编辑"
              icon="pi pi-pencil"
              @click="enableEdit"
            />
            <Button label="返回" icon="pi pi-arrow-left" severity="secondary" @click="handleBack" />
          </div>
        </div>

        <div v-if="query.isLoading.value" class="flex justify-center py-8">
          <ProgressSpinner />
        </div>

        <div v-else-if="query.isError.value" class="text-center py-8 text-red-500">
          加载题目失败
        </div>

        <form v-else @submit.prevent="handleSubmit">
          <div class="space-y-4">
            <!-- 题目类型 -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                题目类型 <span class="text-red-500">*</span>
              </label>
              <Select
                v-model="formData.type"
                :options="TOPIC_TYPE_OPTIONS"
                option-label="label"
                option-value="value"
                placeholder="请选择题目类型"
                class="w-full"
                :disabled="true"
              />
            </div>

            <!-- 题目内容 -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                题目内容 <span class="text-red-500">*</span>
              </label>
              <Textarea
                v-model="formData.content"
                placeholder="请输入题目内容"
                rows="3"
                class="w-full"
                :disabled="!isEdit"
              />
            </div>

            <!-- 选项（单选/多选题需要） -->
            <TopicChoiceInput
              v-if="showChoices"
              :choice-list="choiceList"
              :disabled="!isEdit"
              @update:choice-list="choiceList = $event"
              @add-choice="addChoice"
            />

            <!-- 正确答案 -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                正确答案 <span class="text-red-500">*</span>
              </label>
              <TopicAnswerInput
                :type="formData.type || 0"
                :choice-list="choiceList"
                :model-value="formData.correctAnswer || ''"
                :disabled="!isEdit"
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
                  <label class="block text-xs text-slate-600 mb-1">
                    学科标签 <span class="text-red-500">*</span>
                  </label>
                  <MultiSelect
                    v-model="selectedSubjectTags"
                    :options="subjectTagOptions"
                    option-label="tagName"
                    option-value="id"
                    placeholder="选择学科标签"
                    class="w-full"
                    display="chip"
                    :filter="true"
                    :disabled="!isEdit"
                  />
                  <!-- 快速创建学科标签 -->
                  <div v-if="isEdit" class="flex gap-2 mt-2">
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
                  <label class="block text-xs text-slate-600 mb-1">
                    难度标签 <span class="text-red-500">*</span>
                  </label>
                  <MultiSelect
                    v-model="selectedDifficultyTags"
                    :options="difficultyTagOptions"
                    option-label="tagName"
                    option-value="id"
                    placeholder="选择难度标签"
                    class="w-full"
                    display="chip"
                    :filter="true"
                    :disabled="!isEdit"
                  />
                  <!-- 快速创建难度标签 -->
                  <div v-if="isEdit" class="flex gap-2 mt-2">
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
                    :disabled="!isEdit"
                  />
                  <!-- 快速创建自定义标签 -->
                  <div v-if="isEdit" class="flex gap-2 mt-2">
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

          <!-- 操作按钮（仅在编辑模式显示） -->
          <div v-if="isEdit" class="flex justify-end gap-2 mt-6">
            <Button label="取消" severity="secondary" @click="cancelEdit" />
            <Button
              label="保存"
              type="submit"
              :loading="updateMutation.isPending.value"
            />
          </div>
        </form>

        <!-- 创建信息 -->
        <div v-if="topic" class="flex items-center gap-4 text-sm text-slate-500 pt-4 mt-4 border-t">
          <span>创建者: {{ topic.createdBy || "-" }}</span>
          <span>创建时间: {{ formatDateTime(topic.createdTime) }}</span>
          <span v-if="topic.updatedTime">更新时间: {{ formatDateTime(topic.updatedTime) }}</span>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import Card from "primevue/card"
import Button from "primevue/button"
import Select from "primevue/select"
import Textarea from "primevue/textarea"
import InputText from "primevue/inputtext"
import MultiSelect from "primevue/multiselect"
import Tag from "primevue/tag"
import ProgressSpinner from "primevue/progressspinner"
import type { UpdateTopicRequest, TopicDetailResponse } from "@/core/api/generated"
import { TOPIC_TYPE_OPTIONS, TOPIC_TYPE, TAG_TYPE } from "@/features/teacher/topic/constants"
import {
  useQueryTopicById,
  useQueryTags,
  useCreateTag,
  useUpdateTopic,
} from "@/features/teacher/topic/hooks"
import { toast } from "@/core/utils/toast"
import { formatDateTime } from "@/features/shared/utils"
import TopicChoiceInput from "@/features/teacher/topic/components/TopicChoiceInput.vue"
import TopicAnswerInput from "@/features/teacher/topic/components/TopicAnswerInput.vue"

const route = useRoute()
const router = useRouter()

// 解析路由参数
const topicId = computed(() => Number((route.params as { id: string }).id))
const isEdit = ref(route.query.mode === 'edit')

// 查询题目详情
const query = useQueryTopicById(topicId)
const topic = computed(() => query.data.value)

// 查询标签列表
const { data: tags, refetch: refetchTags } = useQueryTags()

// 新标签名称
const newSubjectTagName = ref("")
const newDifficultyTagName = ref("")
const newCustomTagName = ref("")

// 表单数据
const formData = ref<Partial<UpdateTopicRequest>>({
  type: undefined,
  content: "",
  choices: undefined,
  correctAnswer: "",
  tagIds: [],
})

// 选项列表
const choiceList = ref<string[]>(["", "", "", ""])

// 多选选中的选项
const selectedChoices = ref<string[]>([])

// 选中的标签（按类型分组）
const selectedSubjectTags = ref<number[]>([])
const selectedDifficultyTags = ref<number[]>([])
const selectedCustomTags = ref<number[]>([])

// Hooks
const createTagMutation = useCreateTag()
const updateMutation = useUpdateTopic()

// 是否正在创建标签
const isCreatingSubjectTag = computed(() => createTagMutation.isPending.value)
const isCreatingDifficultyTag = computed(() => createTagMutation.isPending.value)
const isCreatingCustomTag = computed(() => createTagMutation.isPending.value)

// 所有选中的标签
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
const showChoices = computed(
  () => formData.value.type === TOPIC_TYPE.SINGLE_CHOICE || formData.value.type === TOPIC_TYPE.MULTIPLE_CHOICE
)

// 添加选项
function addChoice() {
  choiceList.value.push("")
}

// 初始化表单数据
function initFormData(data: TopicDetailResponse) {
  // 解析选项
  if (data.choices) {
    try {
      const parsed = JSON.parse(data.choices) as Record<string, string>
      choiceList.value = Object.entries(parsed)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([, content]) => content)
    } catch {
      choiceList.value = ["", "", "", ""]
    }
  } else {
    choiceList.value = ["", "", "", ""]
  }

  // 解析正确答案
  if (data.type === TOPIC_TYPE.MULTIPLE_CHOICE) {
    selectedChoices.value = (data.correctAnswer || "").split("").filter(Boolean)
  } else {
    selectedChoices.value = []
  }

  // 根据标签类型分组设置选中状态
  selectedSubjectTags.value = []
  selectedDifficultyTags.value = []
  selectedCustomTags.value = []

  data.tags?.forEach(t => {
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

  formData.value = {
    type: data.type,
    content: data.content,
    choices: data.choices,
    correctAnswer: data.correctAnswer,
    tagIds: data.tags?.map(tag => tag.tagId!).filter(Boolean),
  }
}

// 监听数据加载完成
watch(topic, (data) => {
  if (data) {
    initFormData(data)
  }
}, { immediate: true })

// 创建学科标签
const createNewSubjectTag = async () => {
  const trimmedName = newSubjectTagName.value.trim()
  if (!trimmedName) return

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

// 根据 tagId 获取标签名称
function getTagNameById(tagId: number): string {
  const tag = tags.value?.find(t => t.id === tagId)
  return tag?.tagName || `标签${tagId}`
}

// 启用编辑模式
function enableEdit() {
  isEdit.value = true
  router.replace({ query: { mode: 'edit' } })
}

// 取消编辑
function cancelEdit() {
  isEdit.value = false
  router.replace({ query: {} })
  // 重新加载数据
  if (topic.value) {
    initFormData(topic.value)
  }
}

// 返回
function handleBack() {
  router.push('/teacher/topics')
}

// 提交表单
async function handleSubmit() {
  // 基础验证
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
    const choicesObj: Record<string, string> = {}
    validOptions.forEach((content, index) => {
      const label = String.fromCharCode(65 + index)
      choicesObj[label] = content
    })
    formData.value.choices = JSON.stringify(choicesObj)
  } else {
    formData.value.choices = undefined
  }

  // 构建正确答案
  if (showChoices.value) {
    if (formData.value.type === TOPIC_TYPE.MULTIPLE_CHOICE) {
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
  } else {
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

  // 更新题目
  await updateMutation.mutateAsync({
    id: topicId.value,
    ...formData.value,
  } as UpdateTopicRequest)

  toast.success("题目更新成功")
  isEdit.value = false
  router.replace({ query: {} })
  query.refetch()
}
</script>
