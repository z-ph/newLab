<template>
  <div>
    <!-- 页面头部 -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">实验管理</h1>
        <p class="text-slate-600">管理您的实验项目</p>
      </div>
      <Button label="新建实验" icon="pi pi-plus" @click="showCreateDialog = true" />
    </div>

    <!-- 实验卡片列表 -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card v-for="experiment in experiments" :key="experiment.id" class="hover:shadow-lg transition-shadow">
        <template #title>
          <div class="flex items-center justify-between">
            <span>{{ experiment.name }}</span>
            <Tag :value="getStatusText(experiment.status)" :severity="getStatusSeverity(experiment.status)" />
          </div>
        </template>
        <template #subtitle>{{ experiment.course }}</template>
        <template #content>
          <div class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-slate-600">分数占比</span>
              <span class="font-semibold text-slate-900">{{ experiment.percentage }}%</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-slate-600">截止时间</span>
              <span class="font-semibold text-slate-900">{{ experiment.deadline }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-slate-600">完成人数</span>
              <span class="font-semibold text-slate-900">{{ experiment.completed }}/{{ experiment.total }}</span>
            </div>
            <ProgressBar :value="(experiment.completed / experiment.total) * 100" class="mt-3" />
          </div>
        </template>
        <template #footer>
          <div class="flex gap-2">
            <Button label="编辑" outlined size="small" class="flex-1" />
            <Button label="查看详情" size="small" class="flex-1" />
          </div>
        </template>
      </Card>
    </div>

    <!-- 创建实验对话框 -->
    <Dialog v-model:visible="showCreateDialog" header="新建实验" :style="{ width: '60vw' }" :modal="true">
      <form @submit.prevent="handleCreate">
        <div class="mb-4 flex flex-col gap-3">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">实验名称</label>
            <InputText v-model="formData.name" class="w-full" />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">所属课程</label>
            <Dropdown v-model="formData.courseId" :options="courseOptions" option-label="label" option-value="value" placeholder="选择课程" class="w-full" />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">分数占比 (%)</label>
            <InputNumber v-model="formData.percentage" :min="0" :max="100" class="w-full" />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">截止时间</label>
            <Calendar v-model="formData.deadline" showTime class="w-full" />
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
import Calendar from 'primevue/calendar'
import Card from 'primevue/card'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import ProgressBar from 'primevue/progressbar'
import Tag from 'primevue/tag'

const showCreateDialog = ref(false)

const courseOptions = [
  { label: '数据结构', value: 1 },
  { label: '算法分析', value: 2 },
  { label: '数据库原理', value: 3 },
  { label: '计算机网络', value: 4 },
]

const formData = ref({
  name: '',
  courseId: null,
  percentage: 10,
  deadline: null,
})

// 模拟数据
const experiments = ref([
  {
    id: 1,
    name: '链表操作实验',
    course: '数据结构',
    percentage: 15,
    deadline: '2025-02-15',
    completed: 35,
    total: 45,
    status: 'published',
  },
  {
    id: 2,
    name: '排序算法实现',
    course: '算法分析',
    percentage: 20,
    deadline: '2025-02-20',
    completed: 28,
    total: 43,
    status: 'published',
  },
  {
    id: 3,
    name: 'SQL查询优化',
    course: '数据库原理',
    percentage: 25,
    deadline: '2025-03-01',
    completed: 0,
    total: 38,
    status: 'draft',
  },
])

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    draft: '草稿',
    published: '已发布',
    closed: '已截止',
  }
  return statusMap[status] || status
}

const getStatusSeverity = (status: string) => {
  const severityMap: Record<string, string> = {
    draft: 'secondary',
    published: 'success',
    closed: 'info',
  }
  return severityMap[status] || 'secondary'
}

const handleCreate = () => {
  console.log('创建实验', formData.value)
  showCreateDialog.value = false
}
</script>
