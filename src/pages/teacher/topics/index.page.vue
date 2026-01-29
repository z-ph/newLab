<template>
  <div class="p-6">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">题目管理</h1>
        <p class="text-sm text-slate-500 mt-1">管理题库资源</p>
      </div>
      <div class="flex gap-2">
        <Button label="标签管理" icon="pi pi-tags" outlined severity="secondary" @click="handleTagManage" />
        <Button label="新增题目" icon="pi pi-plus" @click="handleAddClick" />
      </div>
    </div>

    <!-- 筛选器 -->
    <TopicFilter v-model="filters" class="mb-6" @search="handleSearch" />

    <!-- 题目列表 -->
    <TopicTable
      @update:current="current = $event"
      @view="handleView"
      @edit="handleEdit"
      @batch-delete="handleBatchDeleteClick"
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

    <!-- 标签管理对话框 -->
    <TagManageDialog ref="tagManageDialogRef" />

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import Button from "primevue/button"

import type { TopicDetailResponse, CreateTopicRequest, UpdateTopicRequest } from "@/core/api/generated"

import {
  TopicFilter,
  TopicTable,
  TopicFormDialog,
  TopicDetailDialog,
  TopicBatchDeleteDialog,
  TagManageDialog,
} from "@/features/teacher/topic"
import {
  useQueryTopicPage,
  useCreateTopic,
  useUpdateTopic,
  useBatchDeleteTopics,
} from "@/features/teacher/topic/hooks"

// ✅ 使用题目查询 hook，直接从 hook 获取所有状态
const { current, type, keyword, difficultyTagIds, subjectTagIds, query } =
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
const batchDeleteMutation = useBatchDeleteTopics()

// ✅ 对话框 ref（不管理状态）
const formDialogRef = ref<InstanceType<typeof TopicFormDialog>>()
const detailDialogRef = ref<InstanceType<typeof TopicDetailDialog>>()
const batchDeleteDialogRef = ref<InstanceType<typeof TopicBatchDeleteDialog>>()
const tagManageDialogRef = ref<InstanceType<typeof TagManageDialog>>()

// ✅ 新增按钮点击
const handleAddClick = () => {
  formDialogRef.value?.open()
}

// ✅ 标签管理
const handleTagManage = () => {
  tagManageDialogRef.value?.open()
}

// ✅ 查询按钮
const handleSearch = () => {
  current.value = 1
  // 筛选条件已通过 v-model 自动更新到 hook 的状态
  query.refetch()
}

// ✅ 查看详情
const handleView = (topic: TopicDetailResponse) => {
  detailDialogRef.value?.open(topic)
}

// ✅ 编辑
const handleEdit = (topic: TopicDetailResponse) => {
  formDialogRef.value?.openEdit(topic)
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

// ✅ 批量删除点击（来自 TopicTable）
const handleBatchDeleteClick = (topicIds: number[]) => {
  batchDeleteDialogRef.value?.open(topicIds)
}

// ✅ 执行批量删除
const handleBatchDelete = async (topicIds: number[]) => {
  await batchDeleteMutation.mutateAsync(topicIds)
  batchDeleteDialogRef.value?.close()
  query.refetch()
}
</script>
