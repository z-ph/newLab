<template>
  <MobileLayout title="我的班级">
    <ClassList @view="handleViewClass" />
  </MobileLayout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import MobileLayout from '@/features/student/components/MobileLayout.vue'
import ClassList from '@/features/student/classes/components/ClassList.vue'

const router = useRouter()

const handleViewClass = (classCode: string) => {
  router.push(`/student/classes/${classCode}`)
}
</script>
