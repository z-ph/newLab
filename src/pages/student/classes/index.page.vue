<template>
  <MobileLayout title="我的班级">
    <div class="mb-4">
      <Button
        label="加入班级"
        icon="pi pi-plus"
        class="w-full"
        @click="handleBindClass"
      />
    </div>

    <ClassList @view="handleViewClass" />
    <BindClassDialog ref="bindClassDialogRef" />
  </MobileLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import MobileLayout from '@/features/student/components/MobileLayout.vue'
import ClassList from '@/features/student/classes/components/ClassList.vue'
import BindClassDialog from '@/features/student/classes/components/BindClassDialog.vue'

const router = useRouter()
const bindClassDialogRef = ref<InstanceType<typeof BindClassDialog>>()

const handleBindClass = () => {
  bindClassDialogRef.value?.open()
}

const handleViewClass = (classCode: string) => {
  router.push(`/student/classes/${classCode}`)
}
</script>
