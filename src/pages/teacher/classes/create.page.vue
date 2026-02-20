<template>
  <div class="p-1 space-y-4">
    <Card>
      <template #content>
        <div class="mb-4">
          <h1 class="text-xl font-bold text-slate-900">创建班级</h1>
        </div>
        <ClassCreateForm @success="handleSuccess" />
      </template>
    </Card>

    <Card>
      <template #content>
        <DataTable :value="classes" :paginator="true" :rows="size" :loading="query.isLoading.value"
          :total-records="total" @page="onPageChange" :pt="{ header: { class: 'px-0!' } }">
          <template #header>
            <h2 class="text-lg font-semibold text-slate-800">已有班级</h2>
          </template>
          <Column key="className" field="className" header="班级名称" />
          <Column key="studentCount" field="studentCount" header="学生数" />
          <Column key="actions" header="操作">
            <template #body="slotProps">
              <div class="flex gap-2">
                <Button icon="pi pi-pencil" outlined size="small" @click="navigateToEdit(slotProps.data)" />
                <Button icon="pi pi-trash" outlined severity="danger" size="small"
                  @click="handleDelete(slotProps.data)" :loading="deleteMutation.isPending.value" />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import ClassCreateForm from '@/features/teacher/class/components/ClassCreateForm.vue'
import { useQueryClassPage } from '@/features/teacher/class/hooks/useQueryClass'
import { useDeleteClass } from '@/features/teacher/class/hooks/useMutateClassDelete'
import type { Class } from '@/core/api/generated'
import type { DataTablePageEvent } from 'primevue/datatable'

const router = useRouter()
const confirm = useConfirm()

const handleSuccess = () => {
  query.refetch()
}

// 班级列表数据
const { current, size, query } = useQueryClassPage({
  current: 1,
  size: 5,
})

const deleteMutation = useDeleteClass()

const classes = computed(() => query.data.value?.records || [])
const total = computed(() => query.data.value?.total || 0)

const onPageChange = (event: DataTablePageEvent) => {
  current.value = event.page + 1
}

const navigateToEdit = (classItem: Class) => {
  router.push({
    path: `/teacher/classes/${classItem.classCode}/edit`,
    query: {
      title: encodeURIComponent(classItem.className || '编辑班级'),
      ...(classItem.id ? { id: classItem.id.toString() } : {})
    }
  })
}

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
</script>
