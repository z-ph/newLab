<template>
  <Card>
    <template #content>
      <DataTable v-model:selection="selectedClasses" :value="classes" :paginator="true" :rows="size"
        :loading="query.isLoading.value" selection-mode="multiple" :total-records="total"
        lazy
        paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rows-per-page-options="[10, 20, 50]"
        current-page-report-template="显示 {first} 到 {last} 共 {totalRecords} 条"
        @page="onPageChange"
        :pt="{ header: { class: 'px-0!' } }">
        <template #header>
          <div class="flex items-center justify-between">
            <h1 class="text-xl font-bold text-slate-900">班级管理</h1>
            <div class="flex gap-2">
              <Button label="绑定实验" icon="pi pi-link" outlined severity="secondary" @click="navigateToBind" />
              <Button label="批量导入" icon="pi pi-upload" outlined severity="secondary" @click="navigateToImport" />
              <Button label="新建班级" icon="pi pi-plus" @click="navigateToCreate" />
            </div>
          </div>

        </template>
        <Column key="selection" selection-mode="multiple" />
        <Column key="className" field="className" header="班级名称" />
        <Column key="studentCount" field="studentCount" header="学生数" />
        <Column key="actions" header="操作">
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button icon="pi-pencil" outlined size="small" @click="navigateToEdit(slotProps.data)" />
              <Button icon="pi pi-trash" outlined severity="danger" size="small" @click="handleDelete(slotProps.data)"
                :loading="deleteMutation.isPending.value" />
            </div>
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import { useQueryClassPage } from '../hooks/useQueryClass'
import { useDeleteClass } from '../hooks/useMutateClassDelete'
import type { Class } from '@/core/api/generated'
import type { DataTablePageEvent } from 'primevue/datatable'

const router = useRouter()

// ==================== 路由跳转 ====================
const navigateToCreate = () => {
  router.push('/teacher/classes/create')
}

const navigateToImport = () => {
  router.push('/teacher/classes/import')
}

const navigateToBind = () => {
  router.push('/teacher/classes/bind')
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

// ✅ 表格内部调用 hook 获取数据
const { current, size, query } = useQueryClassPage({
  current: 1,
  size: 10,
})

// 分页逻辑
const onPageChange = (event: DataTablePageEvent) => {
  current.value = event.page + 1
  size.value = event.rows
}

// ✅ 表格内部调用 mutation
const deleteMutation = useDeleteClass()
const confirm = useConfirm()

const selectedClasses = ref<Class[]>([])

// 计算属性
const classes = computed(() => query.data.value?.records || [])
const total = computed(() => query.data.value?.total || 0)

// 删除处理
const handleDelete = (classItem: Class) => {
  const code = classItem.classCode
  if (!code) return

  confirm.require({
    message: `确定要删除班级"${classItem.className}"吗？此操作不可撤销。`,
    header: '删除确认',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: '取消',
    acceptLabel: '删除',
    acceptClass: 'p-button-danger',
    accept: async () => {
      await deleteMutation.mutateAsync({
        path: { classCode: code },
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
