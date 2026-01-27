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
          <Dropdown v-model="selectedStatus" :options="statusOptions" option-label="label" option-value="value" placeholder="选择状态" class="w-48" />
          <Button icon="pi pi-search" outlined />
        </div>
      </template>
    </Card>

    <!-- 班级列表 -->
    <Card>
      <template #content>
        <DataTable v-model:selection="selectedClasses" :value="classes" :paginator="true" :rows="10" :loading="loading" selection-mode="multiple">
          <Column selection-mode="multiple" header-style="width: 3rem" />
          <Column field="classCode" header="班级代码" />
          <Column field="className" header="班级名称" />
          <Column field="studentCount" header="学生数" />
          <Column field="status" header="状态">
            <template #body="{ data }">
              <Tag :value="data.status === 'active' ? '进行中' : '已结课'" :severity="data.status === 'active' ? 'success' : 'secondary'" />
            </template>
          </Column>
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
            <label class="mb-2 block text-sm font-medium text-slate-700">班级代码</label>
            <InputText v-model="formData.classCode" class="w-full" />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">班级名称</label>
            <InputText v-model="formData.className" class="w-full" />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">班级描述</label>
            <Textarea v-model="formData.description" rows="3" class="w-full" />
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
import { ref } from 'vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import Textarea from 'primevue/textarea'

const loading = ref(false)
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
  classCode: '',
  className: '',
  description: '',
})

// 模拟数据
const classes = ref([
  { classCode: 'CS2024001', className: '计算机科学与技术1班', studentCount: 45, status: 'active' },
  { classCode: 'CS2024002', className: '计算机科学与技术2班', studentCount: 43, status: 'active' },
  { classCode: 'SE2024001', className: '软件工程1班', studentCount: 38, status: 'active' },
  { classCode: 'SE2024002', className: '软件工程2班', studentCount: 40, status: 'inactive' },
])

const handleCreate = () => {
  console.log('创建班级', formData.value)
  showCreateDialog.value = false
}
</script>
