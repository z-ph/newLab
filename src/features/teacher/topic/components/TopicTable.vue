<template>
  <Card>
    <template #content>
      <DataTable :value="topics" :loading="query.isLoading.value" :paginator="true" :rows="size" :total-records="total"
        lazy
        paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rows-per-page-options="[10, 20, 50]" current-page-report-template="显示 {first} 到 {last} 共 {totalRecords} 条"
        @page="onPage" v-model:selection="selectedTopics" data-key="id"
        :pt="{ header: { class: 'px-0!' } }">
        <template #header>
          <div class="flex items-center justify-between">
            <h1 class="text-xl font-bold text-slate-900">题目管理</h1>
            <div class="flex gap-2">
              <Button
                v-if="selectedTopics.length > 0"
                :label="`删除选中 (${selectedTopics.length})`"
                icon="pi pi-trash"
                severity="danger"
                size="small"
                @click="handleBatchDelete"
              />
              <Button label="标签管理" icon="pi pi-tags" outlined severity="secondary" @click="emit('tag-manage')" />
              <Button label="新增题目" icon="pi pi-plus" @click="emit('add')" />
            </div>
          </div>
        </template>

        <Column field="id" header="ID" sortable  />

        <Column field="type" header="题目类型" sortable >
          <template #body="{ data }">
            <Tag :value="getTopicTypeName(data.type)" :severity="getTopicTypeSeverity(data.type)" />
          </template>
        </Column>

        <Column field="content" header="题目内容" sortable>
          <template #body="{ data }">
            <div class="max-w-md truncate" :title="data.content">
              {{ data.content }}
            </div>
          </template>
        </Column>

        <Column field="choices" header="选项" >
          <template #body="{ data }">
            <div v-if="data.choices" class="text-sm text-slate-600">
              <div v-for="(choice, index) in formatChoices(data.choices).slice(0, 2)" :key="index">
                {{ choice }}
              </div>
              <div v-if="formatChoices(data.choices).length > 2" class="text-slate-400">
                ...
              </div>
            </div>
            <span v-else class="text-slate-400">-</span>
          </template>
        </Column>

        <Column field="tags" header="标签" >
          <template #body="{ data }">
            <div v-if="data.tags && data.tags.length > 0" class="flex flex-wrap gap-1">
              <Tag v-for="t in data.tags.slice(0, 3)" :key="t.tagId" :value="t.tagName"
                :severity="getTagSeverity(t.tagType)" class="text-xs" />
              <Tag v-if="data.tags.length > 3" :value="`+${data.tags.length - 3}`" severity="secondary"
                class="text-xs" />
            </div>
            <span v-else class="text-slate-400">-</span>
          </template>
        </Column>

        <Column field="createdBy" header="创建者" sortable />

        <Column field="createdTime" header="创建时间" sortable >
          <template #body="{ data }">
            {{ formatDateTime(data.createdTime) }}
          </template>
        </Column>

        <Column header="操作"  frozen frozen-align="right">
          <template #body="{ data }">
            <div class="flex gap-2">
              <Button label="查看" size="small" text @click="handleView(data)" />
              <Button label="编辑" size="small" text severity="primary" @click="handleEdit(data)" />
              <Button label="删除" size="small" text severity="danger" @click="handleDelete(data)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useConfirm } from "primevue/useconfirm"
import type { TopicDetailResponse } from "@/core/api/generated"
import { getTopicTypeName, getTopicTypeSeverity } from "@/features/teacher/topic/constants"
import { formatChoices } from "@/features/teacher/topic/utils/formatters"
import { formatDateTime } from "@/features/shared/utils"
import { getTagSeverity } from "@/features/teacher/topic/utils/tagHelpers"
import { useQueryTopicPage, useDeleteTopic } from "@/features/teacher/topic/hooks"

interface Emits {
  (e: 'update:current', value: number): void
  (e: 'view', topic: TopicDetailResponse): void
  (e: 'edit', topic: TopicDetailResponse): void
  (e: 'tag-manage'): void
  (e: 'add'): void
}

const emit = defineEmits<Emits>()
// ✅ 直接在组件内调用 hook，利用 Vue Query 缓存
const { size, total, topics, query } =
  useQueryTopicPage({
    current: 1,
    size: 10,
  })

// 删除 mutation
const deleteMutation = useDeleteTopic()
const confirm = useConfirm()

// 选中的题目（用于批量删除）
const selectedTopics = ref<TopicDetailResponse[]>([])

// 分页
const onPage = (event: any) => {
  emit('update:current', event.page + 1)
}

// 查看详情
const handleView = (topic: TopicDetailResponse) => {
  emit('view', topic)
}

// 编辑
const handleEdit = (topic: TopicDetailResponse) => {
  emit('edit', topic)
}

// 删除单个
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

// ✅ 批量删除
function handleBatchDelete() {
  if (selectedTopics.value.length === 0) return
  confirm.require({
    message: `确定要删除选中的 ${selectedTopics.value.length} 个题目吗？删除后将无法恢复。`,
    header: "批量删除确认",
    icon: "pi pi-exclamation-triangle",
    acceptLabel: "确定",
    rejectLabel: "取消",
    accept: async () => {
      const topicIds = selectedTopics.value.map(topic => topic.id!)
      await Promise.all(topicIds.map(id => deleteMutation.mutateAsync(id)))
      selectedTopics.value = []
      query.refetch()
    },
  })
}
</script>
