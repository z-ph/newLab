<template>
  <div class="p-1">
    <Card>
      <template #content>
        <div class="text-center py-8">
          <i class="pi pi-info-circle text-4xl text-slate-400 mb-4"></i>
          <h2 class="text-xl font-semibold text-slate-700 mb-2">创建题目</h2>
          <p class="text-slate-500 mb-6">请返回题目列表页面，点击"新增"按钮创建题目</p>
          <Button label="返回题目列表" icon="pi pi-arrow-left" @click="goToList" />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Button from 'primevue/button'

const router = useRouter()

const goToList = () => {
  router.push('/teacher/topics/list')
}
</script>
