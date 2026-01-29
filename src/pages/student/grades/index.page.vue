<template>
  <MobileLayout title="成绩查询">
    <GradeList @view="handleViewGrade" />
  </MobileLayout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import MobileLayout from '@/features/student/components/MobileLayout.vue'
import GradeList from '@/features/student/grades/components/GradeList.vue'

const router = useRouter()

const handleViewGrade = (gradeId: number) => {
  router.push(`/student/grades/${gradeId}`)
}
</script>
