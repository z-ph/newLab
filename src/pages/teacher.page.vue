<template>
  <div class="flex min-h-screen bg-slate-50">
    <AppSidebar ref="sidebarRef" />

    <div class="flex-1 flex flex-col overflow-hidden">
      <AppTopbar @toggle-drawer="sidebarRef?.toggleDrawer()" />

      <main class="flex-1 overflow-y-auto p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from '@/features/teacher/components/AppSidebar.vue'
import AppTopbar from '@/features/teacher/components/AppTopbar.vue'

const sidebarRef = ref<InstanceType<typeof AppSidebar>>()
</script>
