<template>
  <div>
    <h1 class="mb-2 text-2xl font-bold text-slate-900">概览</h1>
    <p class="mb-6 text-slate-600">欢迎使用教师管理后台</p>

    <!-- 统计卡片 -->
    <div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card v-for="stat in statistics" :key="stat.title" class="hover:shadow-lg transition-shadow">
        <template #content>
          <div class="flex items-center gap-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-full text-white" :class="stat.color">
              <i :class="stat.icon" class="text-xl" />
            </div>
            <div>
              <p class="text-sm text-slate-600">{{ stat.title }}</p>
              <p class="text-2xl font-bold text-slate-900">{{ stat.value }}</p>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- 快速操作 -->
    <div>
      <h2 class="mb-4 text-lg font-semibold text-slate-900">快速操作</h2>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card
          v-for="action in quickActions"
          :key="action.title"
          class="cursor-pointer hover:shadow-lg transition-shadow"
          @click="router.push(action.path)"
        >
          <template #content>
            <div class="flex items-center gap-4 p-4">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <i :class="action.icon" class="text-lg" />
              </div>
              <div>
                <h3 class="font-semibold text-slate-900">{{ action.title }}</h3>
                <p class="text-sm text-slate-500">{{ action.description }}</p>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Card from 'primevue/card'

const router = useRouter()

const statistics = [
  { title: '班级总数', value: '12', icon: 'pi pi-users', color: 'bg-emerald-500' },
  { title: '实验总数', value: '48', icon: 'pi pi-book', color: 'bg-orange-500' },
  { title: '待批改', value: '23', icon: 'pi pi-pencil', color: 'bg-red-500' },
  { title: '学生总数', value: '356', icon: 'pi pi-user', color: 'bg-cyan-500' },
]

const quickActions = [
  { title: '创建班级', description: '添加新的班级', icon: 'pi pi-plus', path: '/teacher/classes' },
  { title: '发布实验', description: '创建新实验', icon: 'pi pi-upload', path: '/teacher/experiments' },
  { title: '批改作业', description: '查看待批改', icon: 'pi pi-check', path: '/teacher/submissions' },
]
</script>
