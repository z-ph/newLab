<template>
  <div class="p-1">
    <Card>
      <template #content>
        <div class="mb-4">
          <h1 class="text-xl font-bold text-slate-900">创建题目</h1>
        </div>
        <TopicFormDialog ref="formDialogRef" @refresh="handleRefresh" />
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import { TopicFormDialog } from '@/features/teacher/topic'

const router = useRouter()
const formDialogRef = ref<InstanceType<typeof TopicFormDialog>>()

onMounted(() => {
  // 自动打开创建表单
  formDialogRef.value?.open()
})

const handleRefresh = () => {
  // 创建成功后跳转到列表页
  router.push('/teacher/topics/list')
}
</script>
