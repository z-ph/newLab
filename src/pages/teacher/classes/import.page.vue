<template>
  <div class="p-1">
    <Card>
      <template #content>
        <div class="mb-4">
          <h1 class="text-xl font-bold text-slate-900">批量导入学生</h1>
        </div>
        <ClassImportForm @success="handleSuccess" />
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import ClassImportForm from '@/features/teacher/class/components/ClassImportForm.vue'

const handleSuccess = () => {
  // 成功后由表单组件处理跳转
}
</script>
