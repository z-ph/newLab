<template>
  <div class="p-1">
    <Card>
      <template #content>
        <div class="mb-4 flex items-center justify-between">
          <h1 class="text-xl font-bold text-slate-900">{{ pageTitle }}</h1>
          <Button label="返回" icon="pi pi-arrow-left" severity="secondary" @click="handleBack" />
        </div>

        <div class="flex flex-col gap-6">
          <!-- 编辑实验基本信息 -->
          <section>
            <h3 class="mb-3 text-base font-semibold text-slate-900">实验信息</h3>
            <form @submit.prevent="handleUpdateExperiment" class="flex flex-wrap items-end gap-3">
              <div class="flex-1 min-w-48">
                <label class="mb-2 block text-sm font-medium text-slate-700">
                  实验名称 <span class="text-red-500">*</span>
                </label>
                <InputText v-model="formData.experimentName" class="w-full" placeholder="请输入实验名称" />
              </div>
              <div class="w-32">
                <label class="mb-2 block text-sm font-medium text-slate-700">
                  分数占比(%)
                </label>
                <InputNumber v-model="formData.percentage" :min="0" :max="100" class="w-full" />
              </div>
              <Button type="submit" :loading="isSubmitting">保存</Button>
            </form>
          </section>

          <!-- 实验步骤管理 -->
          <section>
            <h3 class="mb-3 text-base font-semibold text-slate-900">实验步骤</h3>
            <ProcedureList
              :experiment-id="experimentId"
              @refresh="handleRefresh"
            />
          </section>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useQueryExperimentById, useUpdateExperiment, ProcedureList } from '@/features/teacher/experiment'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const experimentId = computed(() => Number((route.params as { experimentId: string }).experimentId))

// 从 query 获取标题参数
const pageTitle = computed(() => {
  const title = route.query.title as string
  return title ? decodeURIComponent(title) : '实验详情'
})

// 查询实验详情
const { data: experiment, refetch } = useQueryExperimentById(experimentId)

// 表单数据
const formData = reactive({
  experimentName: '',
  percentage: 0,
})

// 监听实验数据，填充表单
watch(experiment, (exp) => {
  if (exp) {
    formData.experimentName = exp.experimentName || ''
    formData.percentage = exp.percentage || 0
  }
}, { immediate: true })

// 更新实验
const isSubmitting = ref(false)
const updateMutation = useUpdateExperiment()

async function handleUpdateExperiment() {
  if (!formData.experimentName.trim()) {
    toast.add({ severity: 'warn', summary: '提示', detail: '请输入实验名称', life: 3000 })
    return
  }

  isSubmitting.value = true
  try {
    await updateMutation.mutateAsync({
      body: {
        id: experimentId.value,
        experimentName: formData.experimentName,
        percentage: formData.percentage,
      },
    })

    // 更新 URL query 参数中的 title
    router.replace({
      query: { ...route.query, title: encodeURIComponent(formData.experimentName) },
    })

    toast.add({ severity: 'success', summary: '成功', detail: '实验信息更新成功', life: 3000 })
    refetch()
  } finally {
    isSubmitting.value = false
  }
}

// 刷新步骤列表
function handleRefresh() {
  // ProcedureList 内部会自动刷新
}

// 返回
function handleBack() {
  router.back()
}
</script>
