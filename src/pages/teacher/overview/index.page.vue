<template>
  <div class="flex flex-col gap-4">
    <Card>
      <template #header>
        <div class="flex items-center justify-between p-6 pb-0">
          <div>
            <h1 class="text-2xl font-bold text-slate-900">概览</h1>
            <p class="text-slate-600">欢迎使用教师管理后台</p>
          </div>
          <Button label="一键导入" icon="pi pi-upload" @click="openImportDialog" />
        </div>
      </template>
      <template #content>
        <div class="flex flex-col gap-6">
          <!-- 班级实验概览 -->
          <ClassExperimentOverview />

        </div>
      </template>
    </Card>
    <!-- 课程卡片 -->
    <Card class="hover:shadow-lg transition-shadow">
      <template #content>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white">
                <i class="pi pi-book text-lg" />
              </div>
              <div>
                <p class="text-sm text-slate-600">课程总数</p>
                <p class="text-xl font-bold text-slate-900">
                  <span v-if="isLoading">...</span>
                  <span v-else>{{ courses?.total ?? 0 }}</span>
                </p>
              </div>
            </div>
            <Button v-if="courses && courses.total > 5" label="查看更多" size="small" text
              @click="router.push('/teacher/courses')" />
          </div>
          <div class="space-y-2">
            <div v-if="isLoading" class="text-sm text-slate-400">加载中...</div>
            <div v-else-if="courses?.records?.length" v-for="course in courses.records" :key="course.id"
              class="flex items-center justify-between rounded-lg border border-slate-100 p-2 hover:bg-slate-50">
              <span class="text-sm text-slate-700">{{ course.courseName }}</span>
              <span class="text-xs text-slate-400">{{ course.teacherUsername }}</span>
            </div>
            <div v-else class="text-sm text-slate-400">暂无课程</div>
          </div>
        </div>
      </template>
    </Card>

    <!-- 实验卡片 -->
    <Card class="hover:shadow-lg transition-shadow">
      <template #content>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white">
                <i class="pi pi-flask text-lg" />
              </div>
              <div>
                <p class="text-sm text-slate-600">实验总数</p>
                <p class="text-xl font-bold text-slate-900">
                  <span v-if="isLoading">...</span>
                  <span v-else>{{ experiments?.total ?? 0 }}</span>
                </p>
              </div>
            </div>
            <Button v-if="experiments && experiments.total > 5" label="查看更多" size="small" text
              @click="router.push('/teacher/experiments')" />
          </div>
          <div class="space-y-2">
            <div v-if="isLoading" class="text-sm text-slate-400">加载中...</div>
            <div v-else-if="experiments?.records?.length" v-for="experiment in experiments.records" :key="experiment.id"
              class="flex items-center justify-between rounded-lg border border-slate-100 p-2 hover:bg-slate-50">
              <span class="text-sm text-slate-700">{{ experiment.experimentName }}</span>
              <span class="text-xs text-slate-400">{{ experiment.courseId }}</span>
            </div>
            <div v-else class="text-sm text-slate-400">暂无实验</div>
          </div>
        </div>
      </template>
    </Card>

    <!-- 班级卡片 -->
    <Card class="hover:shadow-lg transition-shadow">
      <template #content>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 text-white">
                <i class="pi pi-users text-lg" />
              </div>
              <div>
                <p class="text-sm text-slate-600">班级总数</p>
                <p class="text-xl font-bold text-slate-900">
                  <span v-if="isLoading">...</span>
                  <span v-else>{{ classes?.total ?? 0 }}</span>
                </p>
              </div>
            </div>
            <Button v-if="classes && classes.total > 5" label="查看更多" size="small" text
              @click="router.push('/teacher/classes')" />
          </div>
          <div class="space-y-2">
            <div v-if="isLoading" class="text-sm text-slate-400">加载中...</div>
            <div v-else-if="classes?.records?.length" v-for="cls in classes.records" :key="cls.classCode"
              class="flex items-center justify-between rounded-lg border border-slate-100 p-2 hover:bg-slate-50">
              <span class="text-sm text-slate-700">{{ cls.className }}</span>
              <span class="text-xs text-slate-400">{{ cls.studentCount }} 人</span>
            </div>
            <div v-else class="text-sm text-slate-400">暂无班级</div>
          </div>
        </div>
      </template>
    </Card>
  </div>
  <!-- 导入对话框 -->
  <ClassCourseExperimentsImportDialog ref="importDialogRef" @success="handleImportSuccess" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Card from 'primevue/card'
import { useOverviewStatistics, ClassCourseExperimentsImportDialog, ClassExperimentOverview } from '@/features/teacher/overview'

const router = useRouter()

// 使用 hook 获取统计数据
const { courses, experiments, classes, isLoading, refetchAll } = useOverviewStatistics()

// 导入对话框引用
const importDialogRef = ref<InstanceType<typeof ClassCourseExperimentsImportDialog>>()

// 打开导入对话框
function openImportDialog() {
  importDialogRef.value?.open()
}

// 导入成功后刷新统计数据
function handleImportSuccess() {
  refetchAll()
}
</script>
