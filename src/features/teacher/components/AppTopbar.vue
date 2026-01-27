<template>
  <div class="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
    <div class="flex items-center gap-4">
      <h2 class="text-xl font-semibold text-slate-900">{{ pageTitle }}</h2>
    </div>

    <div class="flex items-center gap-2">
      <Button icon="pi pi-bell" severity="secondary" text rounded />
      <Button icon="pi pi-cog" severity="secondary" text rounded />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Button from 'primevue/button'
import { MENU_ITEMS } from '@/features/teacher/constants'

const route = useRoute()

const pageTitle = computed(() => {
  const matched = MENU_ITEMS.find(
    (item) => route.path === item.path || route.path.startsWith(item.path + '/')
  )
  return matched?.title || '教师管理后台'
})
</script>
