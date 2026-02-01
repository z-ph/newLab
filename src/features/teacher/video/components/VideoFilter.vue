<template>
  <InputText v-model="filters.originalFileName" placeholder="输入文件名搜索" class="w-full" />
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext'

import type { VideoQueryRequest } from '@/core/api/generated'

// ✅ 从 API 类型派生
type VideoFilters = Pick<VideoQueryRequest, 'originalFileName'>

const filters = defineModel<VideoFilters>({
  required: true,
  default: () => ({ originalFileName: undefined }),
})
</script>
