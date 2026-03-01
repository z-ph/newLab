<template>
  <div class="bg-white border-b border-slate-200 block md:block hidden">
    <div class="flex items-center gap-1 px-3 py-2 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="switchTab(tab.key)"
        :class="[
          'group relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap min-w-0',
          activeTab === tab.key ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'text-slate-600 border border-transparent hover:bg-slate-50 hover:text-slate-900 hover:border-slate-200',
        ]"
      >
        <!-- 激活指示器 -->
        <div
          v-if="activeTab === tab.key"
          class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-r-full"
        />

        <!-- 标签页标题 -->
        <span class="truncate">{{ tab.title }}</span>

        <!-- 关闭按钮 -->
        <button
          v-if="tab.closable"
          @click.stop="closeTab(tab.key)"
          class="flex-shrink-0 ml-1 w-5 h-5 flex items-center justify-center rounded-md transition-colors"
          :class="activeTab === tab.key
            ? 'hover:bg-emerald-100 text-emerald-600 hover:text-emerald-800'
            : 'hover:bg-slate-200 text-slate-400 hover:text-slate-600'"
        >
          <i class="pi pi-times text-xs" />
        </button>
      </button>

      <!-- 空状态提示 -->
      <div v-if="tabs.length === 0" class="flex-1 flex items-center justify-center text-sm text-slate-400">
        <span>暂无打开的标签页</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGlobalTabManager } from '@/features/teacher/composables/useTabManager'

const { tabs, activeTab, switchTab, closeTab } = useGlobalTabManager()
</script>
