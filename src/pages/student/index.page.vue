<template>
  <MobileLayout title="我的课程">
    <!-- 加入班级按钮 -->
    <div class="mb-4">
      <Button
        label="加入班级"
        icon="pi pi-plus"
        outlined
        class="w-full"
        @click="handleJoinClass"
      />
    </div>

    <!-- 课程列表 -->
    <CourseList @select="handleSelectCourse" />

    <!-- 加入班级对话框 -->
    <BindClassDialog ref="bindClassDialogRef" />
  </MobileLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import MobileLayout from '@/features/student/components/MobileLayout.vue'
import { CourseList } from '@/features/student/courses'
import BindClassDialog from '@/features/student/classes/components/BindClassDialog.vue'

const router = useRouter()
const bindClassDialogRef = ref<InstanceType<typeof BindClassDialog>>()

const handleJoinClass = () => {
  bindClassDialogRef.value?.open()
}

const handleSelectCourse = (courseId: string) => {
  router.push(`/student/courses/${courseId}`)
}
</script>
