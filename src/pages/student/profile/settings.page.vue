<template>
  <MobileLayout title="设置">
    <div class="space-y-4">
      <!-- 通知设置 -->
      <Card>
        <template #title>
          <div class="flex items-center gap-2">
            <i class="pi pi-bell text-gray-600" />
            <span>通知设置</span>
          </div>
        </template>
        <template #content>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-700">实验提醒</span>
              <ToggleSwitch v-model="settings.experimentReminder" />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-700">签到提醒</span>
              <ToggleSwitch v-model="settings.attendanceReminder" />
            </div>
          </div>
        </template>
      </Card>

      <!-- 账户设置 -->
      <Card>
        <template #title>
          <div class="flex items-center gap-2">
            <i class="pi pi-user text-gray-600" />
            <span>账户设置</span>
          </div>
        </template>
        <template #content>
          <div class="space-y-1">
            <div
              class="flex items-center justify-between py-3 px-2 cursor-pointer active:bg-gray-50 rounded"
            >
              <span class="text-sm text-gray-900">修改密码</span>
              <i class="pi pi-chevron-right text-gray-400 text-sm" />
            </div>
          </div>
        </template>
      </Card>
    </div>
  </MobileLayout>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import MobileLayout from '@/features/student/components/MobileLayout.vue'
import ToggleSwitch from 'primevue/toggleswitch'

const settings = reactive({
  experimentReminder: true,
  attendanceReminder: true,
})
</script>
