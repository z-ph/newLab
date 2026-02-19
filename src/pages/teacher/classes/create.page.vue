<template>
  <div class="p-1">
    <Card>
      <template #content>
        <div class="mb-4">
          <h1 class="text-xl font-bold text-slate-900">创建班级</h1>
        </div>
        <ClassCreateForm @success="handleSuccess" />
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import ClassCreateForm from '@/features/teacher/class/components/ClassCreateForm.vue'

const handleSuccess = () => {
  // 成功后跳转到列表页，由表单组件处理
}
</script>
