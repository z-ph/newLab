<template>
  <Card class="mb-6">
    <template #content>
      <div class="flex gap-4">
        <InputText
          v-model="searchKeyword"
          placeholder="搜索课程编号或名称"
          class="flex-1"
          @keyup.enter="handleSearch"
        />
        <Button icon="pi pi-search" outlined @click="handleSearch" />
        <Button
          v-if="hasFilter"
          label="清除"
          outlined
          severity="secondary"
          @click="handleClear"
        />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// ==================== Props & Emits ====================
interface Emits {
  (e: 'search', keyword: string): void
}

const emit = defineEmits<Emits>()

// ==================== 响应式数据 ====================
const searchKeyword = ref('')

// ==================== 计算属性 ====================
const hasFilter = computed(() => searchKeyword.value.trim().length > 0)

// ==================== 事件处理 ====================
const handleSearch = () => {
  emit('search', searchKeyword.value.trim())
}

const handleClear = () => {
  searchKeyword.value = ''
  emit('search', '')
}

// ==================== 暴露方法 ====================
defineExpose({
  clear: handleClear,
})
</script>
