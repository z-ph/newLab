<template>
  <MobileLayout title="签到管理">
    <Tabs v-model:value="activeTab" pt:tabList:class="justify-center" pt:tab:class="flex-1">
      <TabList>
        <Tab value="records">签到记录</Tab>
        <Tab value="stats">签到统计</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="records">
          <AttendanceList />
        </TabPanel>
        <TabPanel value="stats">
          <AttendanceStats />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </MobileLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MobileLayout from '@/features/student/components/MobileLayout.vue'
import AttendanceList from '@/features/student/attendance/components/AttendanceList.vue'
import AttendanceStats from '@/features/student/attendance/components/AttendanceStats.vue'

const activeTab = ref('records')
</script>
