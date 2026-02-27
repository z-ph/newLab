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
              <Button label="新增题目" icon="pi pi-plus" @click="handleAdd" />
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
              <Button label="详情" size="small" text @click="handleDetail(data)" />
              <Button label="删除" size="small" text severity="danger" @click="handleDelete(data)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { useRouter } from "vue-router"
import { useConfirm } from "primevue/useconfirm"
import type { TopicDetailResponse, TopicQueryRequest } from "@/core/api/generated"
import { getTopicTypeName, getTopicTypeSeverity } from "@/features/teacher/topic/constants"
import { formatChoices } from "@/features/teacher/topic/utils/formatters"
import { formatDateTime } from "@/features/shared/utils"
import { getTagSeverity } from "@/features/teacher/topic/utils/tagHelpers"
import { useQueryTopicPage, useDeleteTopic } from "@/features/teacher/topic/hooks"

// ✅ 从 API 类型派生筛选条件类型
type TopicFilters = Pick<TopicQueryRequest, 'type' | 'keyword' | 'tagIds' | 'difficultyTagIds' | 'subjectTagIds'>

const props = defineProps<{
  filters?: TopicFilters
}>()

const router = useRouter()

// ✅ 直接在组件内调用 hook，利用 Vue Query 缓存
const { current, size, total, topics, query, type, keyword, tagIds, difficultyTagIds, subjectTagIds } =
  useQueryTopicPage({
    current: 1,
    size: 10,
  })

// ✅ 监听外部传入的筛选条件，同步到 hook 的状态
watch(
  () => props.filters,
  (newFilters) => {
    if (newFilters) {
      type.value = newFilters.type
      keyword.value = newFilters.keyword
      tagIds.value = newFilters.tagIds
      difficultyTagIds.value = newFilters.difficultyTagIds
      subjectTagIds.value = newFilters.subjectTagIds
      current.value = 1 // 重置到第一页
    }
  },
  { deep: true, immediate: true }
)

// 删除 mutation
const deleteMutation = useDeleteTopic()
const confirm = useConfirm()

// 选中的题目（用于批量删除）
const selectedTopics = ref<TopicDetailResponse[]>([])

// 分页
const onPage = (event: any) => {
  current.value = event.page + 1
  size.value = event.rows
}

// 查看详情/编辑（跳转到详情页）
const handleDetail = (topic: TopicDetailResponse) => {
  router.push(`/teacher/topics/${topic.id}`)
}

// 新增题目 - 跳转到创建页面
const handleAdd = () => {
  router.push('/teacher/topics/create')
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
