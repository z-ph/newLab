<template>
  <Card>
    <template #content>
      <DataTable
        v-model:selection="selectedClasses"
        :value="classes"
        :paginator="true"
        :rows="size"
        :loading="query.isLoading.value"
        selection-mode="multiple"
        :total-records="total"
        @page="onPageChange"
        :pt="{ header: { class: 'px-0!' } }"
      >
        <template #header>
          <slot name="header" />
        </template>
        <Column key="selection" selection-mode="multiple" />
        <Column key="className" field="className" header="班级名称" />
        <Column key="studentCount" field="studentCount" header="学生数" />
        <Column key="actions" header="操作">
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button
                icon="pi pi-users"
                outlined
                size="small"
                v-tooltip.top="'查看学生'"
                @click="emit('view-students', slotProps.data)"
              />
              <Button
                icon="pi pi-pencil"
                outlined
                size="small"
                @click="emit('edit', slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                outlined
                severity="danger"
                size="small"
                @click="handleDelete(slotProps.data)"
                :loading="deleteMutation.isPending.value"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import type { Class } from '@/core/api/generated'
import { useQueryClassPage } from '../hooks/useQueryClass'
import { useDeleteClass } from '../hooks/useMutateClassDelete'

interface PageStateEvent {
  page: number
  first: number
  rows: number
  pageCount: number
}

interface Emits {
  (e: 'page-change', event: PageStateEvent): void
  (e: 'edit', classItem: Class): void
  (e: 'view-students', classItem: Class): void
}

const emit = defineEmits<Emits>()

// ✅ 表格内部调用 hook 获取数据
const { current, size, query } = useQueryClassPage({
  current: 1,
  size: 10,
})

// ✅ 表格内部调用 mutation
const deleteMutation = useDeleteClass()
const confirm = useConfirm()

const selectedClasses = ref<Class[]>([])

// 计算属性
const classes = computed(() => query.data.value?.records || [])
const total = computed(() => query.data.value?.total || 0)

// 事件处理
const onPageChange = (event: PageStateEvent) => {
  current.value = event.page + 1
  emit('page-change', event)
}

// 删除处理
const handleDelete = (classItem: Class) => {
  const classId = classItem.id
  if (!classId) return

  confirm.require({
    message: `确定要删除班级"${classItem.className}"吗？此操作不可撤销。`,
    header: '删除确认',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: '取消',
    acceptLabel: '删除',
    acceptClass: 'p-button-danger',
    accept: async () => {
      await deleteMutation.mutateAsync({
        path: { id: classId },
      })
      query.refetch()
    },
  })
}

// 暴露
defineExpose({
  selectedClasses,
})
</script>
