<template>
  <div class="p-1 space-y-4">
    <Card>
      <template #content>
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-xl font-bold text-slate-900">创建题目</h1>
          <Button label="新增题目" icon="pi pi-plus" @click="openCreateDialog" />
        </div>
        <p class="text-slate-500 mb-4">点击上方按钮创建新题目，下方列表实时显示已有题目</p>
      </template>
    </Card>

    <Card>
      <template #content>
        <DataTable :value="topics" :loading="query.isLoading.value" :paginator="true" :rows="size"
          :total-records="total" lazy @page="onPage"
          paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
          :pt="{ header: { class: 'px-0!' } }">
          <template #header>
            <h2 class="text-lg font-semibold text-slate-800">已有题目</h2>
          </template>
          <Column field="id" header="ID" sortable />
          <Column field="type" header="题目类型" sortable>
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
          <Column field="tags" header="标签">
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
          <Column field="createdTime" header="创建时间" sortable>
            <template #body="{ data }">
              {{ formatDateTime(data.createdTime) }}
            </template>
          </Column>
          <Column header="操作" frozen frozen-align="right">
            <template #body="{ data }">
              <div class="flex gap-2">
                <Button label="编辑" size="small" text severity="primary" @click="handleEdit(data)" />
                <Button label="删除" size="small" text severity="danger" @click="handleDelete(data)" />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <TopicFormDialog ref="formDialogRef" @refresh="handleRefresh" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import Card from 'primevue/card'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import TopicFormDialog from '@/features/teacher/topic/components/TopicFormDialog.vue'
import { useQueryTopicPage, useDeleteTopic } from '@/features/teacher/topic/hooks'
import { getTopicTypeName, getTopicTypeSeverity } from '@/features/teacher/topic/constants'
import { formatDateTime } from '@/features/shared/utils'
import { getTagSeverity } from '@/features/teacher/topic/utils/tagHelpers'
import type { TopicDetailResponse } from '@/core/api/generated'
import type { DataTablePageEvent } from 'primevue/datatable'

const confirm = useConfirm()

const { current, size, total, topics, query } = useQueryTopicPage({
  current: 1,
  size: 5,
})

const deleteMutation = useDeleteTopic()
const formDialogRef = ref<InstanceType<typeof TopicFormDialog>>()

const openCreateDialog = () => {
  formDialogRef.value?.open()
}

const handleRefresh = () => {
  query.refetch()
}

const onPage = (event: DataTablePageEvent) => {
  current.value = event.page + 1
}

const handleEdit = (topic: TopicDetailResponse) => {
  formDialogRef.value?.openEdit(topic)
}

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
</script>
