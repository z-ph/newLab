<template>
  <div>
    <div v-if="query.isLoading.value" class="flex justify-center py-8">
      <ProgressSpinner />
    </div>

    <div v-else-if="classes && classes.length > 0" class="space-y-3">
      <Card
        v-for="classInfo in classes"
        :key="classInfo.classCode"
        class="cursor-pointer active:scale-[0.98] transition-transform"
        const handleView = (classCode: string) => {
  if (!classCode) return
  $emit('view', classCode)
}
      >
        <template #content>
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <h3 class="text-base font-semibold text-gray-900">
                {{ classInfo.className }}
              </h3>
              <p class="text-sm text-gray-500 mt-1">
                班级编号：{{ classInfo.classCode }}
              </p>
              <div class="flex items-center gap-3 mt-2">
                <Tag :value="`${classInfo.studentCount} 人`" severity="info" />
                <span class="text-xs text-gray-400">
                  {{ formatDateTime(classInfo.bindTime) }}
                </span>
              </div>
            </div>
            <i class="pi pi-chevron-right text-gray-400" />
          </div>
        </template>
      </Card>
    </div>

    <div v-else class="text-center py-12">
      <i class="pi pi-inbox text-4xl text-gray-300 mb-3" />
      <p class="text-sm text-gray-500">暂无班级</p>
      <p class="text-xs text-gray-400 mt-1">点击上方按钮加入班级</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQueryClasses } from '../hooks'
import { formatDateTime } from '../utils'

interface Emits {
  (e: 'view', classCode: string): void
}

defineEmits<Emits>()

const { classes, query } = useQueryClasses()
</script>
