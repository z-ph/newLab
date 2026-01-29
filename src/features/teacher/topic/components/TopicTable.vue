<template>
  <Card>
    <template #content>
      <DataTable
        :value="topics"
        :loading="isLoading"
        :paginator="true"
        :rows="10"
        :total-records="total"
        lazy
        paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rows-per-page-options="[10, 20, 50]"
        current-page-report-template="显示 {first} 到 {last} 共 {totalRecords} 条"
        @page="onPage"
        v-model:selection="selectedTopics"
        :selection-mode="isDeleting ? 'multiple' : undefined"
        data-key="id"
      >
        <Column v-if="isDeleting" selection-mode="multiple" header-style="width: 3rem" />

        <Column field="id" header="ID" sortable style="width: 80px" />

        <Column field="type" header="题目类型" sortable style="width: 120px">
          <template #body="{ data }">
            <Tag :value="getTopicTypeName(data.type)" :severity="getTypeSeverity(data.type)" />
          </template>
        </Column>

        <Column field="content" header="题目内容" sortable>
          <template #body="{ data }">
            <div class="max-w-md truncate" :title="data.content">
              {{ data.content }}
            </div>
          </template>
        </Column>

        <Column field="choices" header="选项" style="width: 200px">
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

        <Column field="tags" header="标签" style="width: 200px">
          <template #body="{ data }">
            <div v-if="data.tags && data.tags.length > 0" class="flex flex-wrap gap-1">
              <Tag
                v-for="tag in data.tags.slice(0, 3)"
                :key="tag.tagId"
                :value="tag.tagName"
                :severity="getTagSeverity(tag.tagType)"
                class="text-xs"
              />
              <Tag
                v-if="data.tags.length > 3"
                :value="`+${data.tags.length - 3}`"
                severity="secondary"
                class="text-xs"
              />
            </div>
            <span v-else class="text-slate-400">-</span>
          </template>
        </Column>

        <Column field="createdBy" header="创建者" sortable style="width: 120px" />

        <Column field="createdTime" header="创建时间" sortable style="width: 180px">
          <template #body="{ data }">
            {{ formatDateTime(data.createdTime) }}
          </template>
        </Column>

        <Column header="操作" style="width: 180px" frozen frozen-align="right">
          <template #body="{ data }">
            <div class="flex gap-2">
              <Button
                label="查看"
                size="small"
                text
                @click="$emit('view', data)"
              />
              <Button
                label="编辑"
                size="small"
                text
                severity="primary"
                @click="$emit('edit', data)"
              />
              <Button
                label="删除"
                size="small"
                text
                severity="danger"
                :disabled="isDeleting"
                @click="$emit('delete', data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref } from "vue"
import Card from "primevue/card"
import DataTable from "primevue/datatable"
import Column from "primevue/column"
import Button from "primevue/button"
import Tag from "primevue/tag"

import type { TopicDetailResponse } from "@/core/api/generated"
import { getTopicTypeName, formatChoices } from "@/features/teacher/topic/utils/formatters"

interface Props {
  topics: TopicDetailResponse[]
  isLoading: boolean
  total?: number
  isDeleting?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  total: 0,
  isDeleting: false,
})

interface Emits {
  (e: 'page', event: any): void
  (e: 'view', topic: TopicDetailResponse): void
  (e: 'edit', topic: TopicDetailResponse): void
  (e: 'delete', topic: TopicDetailResponse): void
  (e: 'batch-delete', topicIds: number[]): void
}

const emit = defineEmits<Emits>()

// 选中的题目（用于批量删除）
const selectedTopics = ref<TopicDetailResponse[]>([])

// 分页
const onPage = (event: any) => {
  emit('page', event)
}

// 获取题目类型对应的 Tag 颜色
function getTypeSeverity(type?: number): "success" | "info" | "warn" | "contrast" | undefined {
  if (!type) return undefined
  const severityMap: Record<number, "success" | "info" | "warn" | "contrast"> = {
    1: "success",
    2: "info",
    3: "warn",
    4: "contrast",
    6: "contrast",
  }
  return severityMap[type]
}

// 获取标签类型对应的 Tag 颜色
function getTagSeverity(tagType?: string): "success" | "info" | "warn" | "contrast" | undefined {
  if (!tagType) return undefined
  const severityMap: Record<string, "success" | "info" | "warn" | "contrast"> = {
    "1": "success",  // 学科标签
    "2": "warn",     // 难度标签
    "3": "info",     // 题型标签
    "4": "contrast", // 自定义标签
  }
  return severityMap[tagType]
}

// 格式化时间
function formatDateTime(dateStr?: string): string {
  if (!dateStr) return "-"
  try {
    const date = new Date(dateStr)
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return dateStr
  }
}
</script>
