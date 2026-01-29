<template>
  <div class="p-6">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">题目管理</h1>
        <p class="text-sm text-slate-500 mt-1">管理题库资源</p>
      </div>
      <div class="flex gap-2">
        <Button
          v-if="!isBatchDeleteMode"
          label="批量删除"
          icon="pi pi-trash"
          severity="danger"
          outlined
          @click="handleBatchDeleteMode"
        />
        <Button
          v-if="isBatchDeleteMode"
          label="取消批量"
          icon="pi pi-times"
          severity="secondary"
          @click="handleCancelBatch"
        />
        <Button
          v-if="isBatchDeleteMode && selectedTopics.length > 0"
          :label="`删除选中 (${selectedTopics.length})`"
          icon="pi pi-check"
          severity="danger"
          @click="handleConfirmBatchDelete"
        />
        <Button label="新增题目" icon="pi pi-plus" @click="handleAddClick" />
      </div>
    </div>

    <!-- 筛选器 -->
    <TopicFilter v-model="filters" class="mb-6" @search="handleSearch" />

    <!-- 题目列表 -->
    <TopicTable
      :topics="topics"
      :is-loading="query.isLoading.value"
      :total="total"
      :is-deleting="isBatchDeleteMode"
      @page="onPage"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- 新增/编辑对话框 -->
    <TopicFormDialog
      ref="formDialogRef"
      :is-loading="createMutation.isPending.value || updateMutation.isPending.value"
      @submit="handleSubmit"
    />

    <!-- 详情对话框 -->
    <TopicDetailDialog ref="detailDialogRef" />

    <!-- 批量删除对话框 -->
    <TopicBatchDeleteDialog
      ref="batchDeleteDialogRef"
      :is-loading="batchDeleteMutation.isPending.value"
      @confirm="handleBatchDelete"
    />

    <!-- 删除确认对话框 -->
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useConfirm } from "primevue/useconfirm"
import Button from "primevue/button"
import ConfirmDialog from "primevue/confirmdialog"

import type { TopicDetailResponse, CreateTopicRequest, UpdateTopicRequest } from "@/core/api/generated"

import {
  TopicFilter,
  TopicTable,
  TopicFormDialog,
  TopicDetailDialog,
  TopicBatchDeleteDialog,
} from "@/features/teacher/topic"
import {
  useQueryTopicPage,
  useCreateTopic,
  useUpdateTopic,
  useDeleteTopic,
  useBatchDeleteTopics,
} from "@/features/teacher/topic/hooks"

// ✅ 使用题目查询 hook，直接从 hook 获取所有状态
const { current, size, type, keyword, difficultyTagIds, subjectTagIds, topics, total, query } =
  useQueryTopicPage({
    current: 1,
    size: 10,
  })

// ✅ 通过 computed 组合筛选条件，直接绑定到 TopicFilter
const filters = computed({
  get: () => ({
    type: type.value,
    keyword: keyword.value,
    difficultyTagIds: difficultyTagIds.value,
    subjectTagIds: subjectTagIds.value,
  }),
  set: (value) => {
    type.value = value.type
    keyword.value = value.keyword
    difficultyTagIds.value = value.difficultyTagIds
    subjectTagIds.value = value.subjectTagIds
  },
})

// 使用 mutations
const createMutation = useCreateTopic()
const updateMutation = useUpdateTopic()
const deleteMutation = useDeleteTopic()
const batchDeleteMutation = useBatchDeleteTopics()

// ✅ 对话框 ref（不管理状态）
const formDialogRef = ref<InstanceType<typeof TopicFormDialog>>()
const detailDialogRef = ref<InstanceType<typeof TopicDetailDialog>>()
const batchDeleteDialogRef = ref<InstanceType<typeof TopicBatchDeleteDialog>>()

const confirm = useConfirm()

// 批量删除模式（UI 交互状态，可以保留在页面中）
const isBatchDeleteMode = ref(false)
const selectedTopics = ref<number[]>([])

// ✅ 新增按钮点击
const handleAddClick = () => {
  formDialogRef.value?.open()
}

// ✅ 查询按钮
const handleSearch = () => {
  current.value = 1
  // 筛选条件已通过 v-model 自动更新到 hook 的状态
  query.refetch()
}

// ✅ 分页
const onPage = (event: any) => {
  current.value = event.page + 1
  size.value = event.rows
}

// ✅ 查看详情
const handleView = (topic: TopicDetailResponse) => {
  detailDialogRef.value?.open(topic)
}

// ✅ 编辑
const handleEdit = (topic: TopicDetailResponse) => {
  formDialogRef.value?.openEdit(topic)
}

// ✅ 删除单个
const handleDelete = (topic: TopicDetailResponse) => {
  confirm.require({
    message: `确定要删除题目「${topic.content?.substring(0, 50)}${topic.content && topic.content.length > 50 ? '...' : ''}」吗？删除后将无法恢复。`,
    header: "删除确认",
    icon: "pi pi-exclamation-triangle",
    acceptLabel: "确定",
    rejectLabel: "取消",
    accept: async () => {
      await deleteMutation.mutateAsync(topic.id!)
      query.refetch()
    },
  })
}

// ✅ 新增/编辑提交
const handleSubmit = async (data: CreateTopicRequest | UpdateTopicRequest) => {
  if ("id" in data) {
    // 编辑
    await updateMutation.mutateAsync(data)
  } else {
    // 新增
    await createMutation.mutateAsync(data)
  }
  formDialogRef.value?.close()
  query.refetch()
}

// ✅ 进入批量删除模式
const handleBatchDeleteMode = () => {
  isBatchDeleteMode.value = true
  selectedTopics.value = []
}

// ✅ 取消批量删除
const handleCancelBatch = () => {
  isBatchDeleteMode.value = false
  selectedTopics.value = []
}

// ✅ 确认批量删除
const handleConfirmBatchDelete = () => {
  if (selectedTopics.value.length === 0) return
  batchDeleteDialogRef.value?.open(selectedTopics.value)
}

// ✅ 执行批量删除
const handleBatchDelete = async () => {
  await batchDeleteMutation.mutateAsync(selectedTopics.value)
  batchDeleteDialogRef.value?.close()
  isBatchDeleteMode.value = false
  selectedTopics.value = []
  query.refetch()
}
</script>
