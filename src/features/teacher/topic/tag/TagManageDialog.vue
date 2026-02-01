<template>
  <Dialog v-model:visible="visible" header="标签管理" modal :style="{ maxWidth: '100vw' }">
    <div class="space-y-4">
      <!-- 创建标签表单 -->
      <div class="flex gap-2 items-end">
        <div class="flex-1 space-y-2">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">标签名称</label>
            <InputText v-model="newTagName" placeholder="输入标签名称" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">标签类型</label>
            <Select
              v-model="newTagType"
              :options="tagTypeOptions"
              option-label="label"
              option-value="value"
              placeholder="选择标签类型"
              class="w-full"
            />
          </div>
        </div>
        <Button
          label="创建标签"
          :disabled="!newTagName.trim() || !newTagType"
          :loading="isCreating"
          @click="handleCreateTag"
        />
      </div>

      <!-- 标签列表 -->
      <DataTable
        :value="tags"
        :loading="isLoading"
        paginator
        :rows="10"
        :rows-per-page-options="[10, 20, 50]"
        current-page-report-template="显示 {first} 到 {last} 共 {totalRecords} 条"
      >
        <Column field="id" header="ID" sortable />
        <Column field="tagName" header="标签名称" sortable>
          <template #body="{ data }">
            <Tag :value="data.tagName" :severity="getTagSeverity(data.type)" />
          </template>
        </Column>
        <Column field="type" header="标签类型" sortable>
          <template #body="{ data }">
            {{ getTagTypeName(data.type) }}
          </template>
        </Column>
        <Column field="description" header="描述">
          <template #body="{ data }">
            {{ data.description || '-' }}
          </template>
        </Column>
        <Column header="操作" frozen frozen-align="right">
          <template #body="{ data }">
            <div class="flex gap-2">
              <Button
                label="编辑"
                size="small"
                text
                @click="handleEdit(data)"
              />
              <Button
                label="删除"
                size="small"
                text
                severity="danger"
                @click="handleDelete(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <template #footer>
      <Button label="关闭" severity="secondary" @click="close" />
    </template>

    <!-- 编辑对话框 -->
    <Dialog v-model:visible="showEditDialog" header="编辑标签" modal :style="{ maxWidth: '100vw' }">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">标签名称</label>
          <InputText v-model="editFormData.tagName" placeholder="输入标签名称" class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">标签类型</label>
          <Select
            v-model="editFormData.type"
            :options="tagTypeOptions"
            option-label="label"
            option-value="value"
            placeholder="选择标签类型"
            class="w-full"
            :disabled="true"
          />
          <p class="text-xs text-slate-500 mt-1">标签类型创建后不可修改</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">描述</label>
          <Textarea v-model="editFormData.description" placeholder="输入标签描述（可选）" rows="3" class="w-full" />
        </div>
      </div>
      <template #footer>
        <Button label="取消" severity="secondary" @click="showEditDialog = false" />
        <Button label="保存" :loading="isUpdating" @click="handleUpdateTag" />
      </template>
    </Dialog>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useConfirm } from "primevue/useconfirm"
import { useQueryTags, useCreateTag, useUpdateTag, useDeleteTag } from "@/features/teacher/topic/hooks"
import { getTagTypeName, getTagSeverity } from "@/features/teacher/topic/utils"
import { toast } from "@/core/utils/toast"
import type { Tag, UpdateTagRequest } from "@/core/api/generated"

const confirm = useConfirm()

// ✅ 状态封装在组件内部
const visible = ref(false)
const showEditDialog = ref(false)

// 新建标签表单
const newTagName = ref("")
const newTagType = ref<string>("")

// 编辑表单
const editFormData = ref<UpdateTagRequest>({
  tagId: 0,
  tagName: "",
  type: "",
  description: "",
})

// 编辑标签
function handleEdit(tagggggg: Tag) {
  editFormData.value = {
    tagId: tagggggg.id!,
    tagName: tagggggg.tagName!,
    type: tagggggg.type!,
    description: tagggggg.description,
  }
  showEditDialog.value = true
}

// 查询标签列表（使用 Hook）
const { data: tags, isLoading, refetch } = useQueryTags()

// 创建标签（使用 Hook）
const createMutation = useCreateTag()

// 更新标签（使用 Hook）
const updateMutation = useUpdateTag()

// 删除标签（使用 Hook）
const deleteMutation = useDeleteTag()

// 标签类型选项（不包含题型标签）
const tagTypeOptions = [
  { label: "学科标签", value: "1" },
  { label: "难度标签", value: "2" },
  { label: "自定义标签", value: "4" },
]

// 计算属性
const isCreating = computed(() => createMutation.isPending.value)
const isUpdating = computed(() => updateMutation.isPending.value)

// 打开对话框
function open() {
  visible.value = true
  refetch()
}

// 关闭对话框
function close() {
  visible.value = false
}

// 创建标签
async function handleCreateTag() {
  if (!newTagName.value.trim() || !newTagType.value) return

  await createMutation.mutateAsync({
    tagName: newTagName.value.trim(),
    type: newTagType.value,
  })

  newTagName.value = ""
  newTagType.value = ""
  refetch()
}

// 更新标签
async function handleUpdateTag() {
  if (!editFormData.value.tagName.trim()) {
    toast.warn("标签名称不能为空")
    return
  }

  await updateMutation.mutateAsync(editFormData.value)
  showEditDialog.value = false
  refetch()
}

// 删除标签
function handleDelete(tag: Tag) {
  confirm.require({
    message: `确定要删除标签"${tag.tagName}"吗？删除后该标签将从所有题目中移除。`,
    header: "删除确认",
    icon: "pi pi-exclamation-triangle",
    acceptLabel: "确定",
    rejectLabel: "取消",
    accept: async () => {
      await deleteMutation.mutateAsync(tag.id!)
      refetch()
    },
  })
}

// ✅ 暴露方法
defineExpose({
  open,
  close,
})
</script>
