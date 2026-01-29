<template>
  <Card>
    <template #content>
      <div class="flex gap-4 items-end">
        <div class="flex-1">
          <label class="block text-sm font-medium text-slate-700 mb-2">搜索视频</label>
          <InputText v-model="fileName" placeholder="输入文件名搜索" class="w-full" />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import InputText from 'primevue/inputtext'
import Card from 'primevue/card'

import type { VideoQueryRequest } from '@/core/api/generated'

// ✅ 从 API 类型派生
type VideoFilters = Pick<VideoQueryRequest, 'originalFileName'>

interface Props {
  modelValue: VideoFilters
}

interface Emits {
  (e: 'update:modelValue', value: VideoFilters): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const fileName = computed({
  get: () => props.modelValue.originalFileName,
  set: (val) => emit('update:modelValue', { ...props.modelValue, originalFileName: val }),
})
</script>
