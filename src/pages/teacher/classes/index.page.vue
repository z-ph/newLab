<template>
  <div>
    <!-- 页面头部 -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">班级管理</h1>
        <p class="text-slate-600">管理您的班级信息</p>
      </div>
      <Button label="新建班级" icon="pi pi-plus" @click="showCreateDialog = true" />
    </div>

    <!-- 搜索和筛选 -->
    <Card class="mb-6">
      <template #content>
        <div class="flex gap-4">
          <InputText v-model="searchKeyword" placeholder="搜索班级名称或代码" class="flex-1" />
          <Select v-model="selectedStatus" :options="statusOptions" option-label="label" option-value="value" placeholder="选择状态" class="w-48" />
          <Button icon="pi pi-search" outlined />
        </div>
      </template>
    </Card>

    <!-- 班级列表 -->
    <Card>
      <template #content>
        <DataTable
        generic="ClassResponse"
          v-model:selection="selectedClasses"
          :value="query.data.value?.records || []"
          :paginator="true"
          :rows="size"
          :loading="query.isLoading.value"
          selection-mode="multiple"
          :total-records="query.data.value?.total"
          @page="onPageChange"
        >
          <Column selection-mode="multiple" header-style="width: 3rem" />
          <Column field="className" header="班级名称" />
          <Column field="studentCount" header="学生数" />
          <Column header="操作">
            <template #body>
              <div class="flex gap-2">
                <Button icon="pi pi-pencil" outlined size="small" />
                <Button icon="pi pi-trash" outlined severity="danger" size="small" />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- 创建班级对话框 -->
    <Dialog v-model:visible="showCreateDialog" header="新建班级" :style="{ width: '50vw' }" :modal="true">
      <form @submit.prevent="handleCreate">
        <div class="mb-4 flex flex-col gap-3">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">班级名称</label>
            <InputText v-model="formData.className" class="w-full" />
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <Button label="取消" outlined @click="showCreateDialog = false" />
          <Button label="创建" type="submit" />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { useQueryClassPage } from '@/features/teacher/class/hooks/useQueryClass'
import { useCreateClass } from '@/features/teacher/class/hooks/useMutateClass'
import { useToast } from 'primevue/usetoast'
import type { GetApiBodyParamsType } from '@/core/utils/typeUtils'
import type { postApiTeacherClass } from '@/core/api/generated'

interface PageStateEvent {
  page: number
  first: number
  rows: number
  pageCount: number
}

const toast = useToast()

const searchKeyword = ref('')
const selectedStatus = ref(null)
const selectedClasses = ref([])
const showCreateDialog = ref(false)

const statusOptions = [
  { label: '全部', value: null },
  { label: '进行中', value: 'active' },
  { label: '已结课', value: 'inactive' },
]

const formData = ref({
  className: '',
}) satisfies Ref<Partial<GetApiBodyParamsType<typeof postApiTeacherClass>>>
// 使用查询 hook 获取分页数据
const { current, size, query } = useQueryClassPage({
  current: 1,
  size: 10,
})

// 使用创建班级 hook
const createMutation = useCreateClass()

const handleCreate = async () => {
  try {
    await createMutation.mutateAsync({
      body: {
        className: formData.value.className,
        classCode: formData.value.className
      },
    })
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '班级创建成功',
      life: 3000,
    })
    showCreateDialog.value = false
    formData.value = {
      className: '',
    }
    // 刷新列表
    query.refetch()
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '班级创建失败',
      life: 3000,
    })
  }
}

// 处理分页
const onPageChange = (event: PageStateEvent) => {
  current.value = event.page + 1
}
</script>
