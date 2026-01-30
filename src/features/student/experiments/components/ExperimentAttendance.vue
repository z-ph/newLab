<template>
  <div class="space-y-3">
    <!-- 签到状态卡片 -->
    <Card>
      <template #title>签到状态</template>
      <template #content>
        <div v-if="attendanceStatus" class="text-center py-6">
          <div class="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center" :class="statusBgClass">
            <i :class="statusIcon" class="text-3xl" />
          </div>
          <p class="text-lg font-semibold" :class="statusTextClass">
            {{ statusText }}
          </p>
          <p v-if="attendanceTime" class="text-sm text-gray-500 mt-1">
            签到时间：{{ formatDateTime(attendanceTime) }}
          </p>
        </div>

        <div v-else class="text-center py-6">
          <i class="pi pi-qrcode text-4xl text-gray-300 mb-3" />
          <p class="text-sm text-gray-500">未签到</p>
        </div>
      </template>
    </Card>

    <!-- 扫码签到说明 -->
    <Card v-if="!attendanceStatus">
      <template #title>扫码签到</template>
      <template #content>
        <div class="text-center space-y-4">
          <!-- 微信图标 -->
          <div class="w-20 h-20 mx-auto bg-green-50 rounded-full flex items-center justify-center">
            <svg class="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.045c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z" fill="#07C160"/>
            </svg>
          </div>

          <div class="space-y-2">
            <p class="text-base font-medium text-gray-900">请使用微信扫一扫</p>
            <p class="text-sm text-gray-600">扫描教师提供的签到二维码</p>
          </div>

          <!-- 操作步骤 -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <p class="text-sm font-medium text-blue-900 mb-2">操作步骤：</p>
            <ol class="text-xs text-blue-800 space-y-1.5 list-decimal list-inside">
              <li>打开微信，点击右上角「⋯」</li>
              <li>选择「扫一扫」功能</li>
              <li>扫描教师投影/屏幕上的签到二维码</li>
              <li>确认签到信息完成签到</li>
            </ol>
          </div>

          <!-- 提示信息 -->
          <div class="text-xs text-gray-400 bg-gray-50 p-3 rounded text-left">
            <p class="font-medium mb-1">提示：</p>
            <ul class="space-y-1">
              <li>• 仅在课堂现场可签到</li>
              <li>• 签到二维码由教师端生成</li>
              <li>• 签到成功后状态会自动更新</li>
            </ul>
          </div>
        </div>
      </template>
    </Card>

    <!-- 手动输入签到码（备用方案） -->
    <Card v-if="!attendanceStatus">
      <template #title>手动输入签到码</template>
      <template #subtitle>备用方案</template>
      <template #content>
        <div class="space-y-3">
          <p class="text-xs text-gray-500">如果无法扫码，可手动输入签到码</p>
          <InputText
            v-model="attendanceCode"
            placeholder="请输入签到码"
            class="w-full"
          />
          <Button
            label="提交签到码"
            class="w-full"
            :disabled="!attendanceCode.trim() || submitting"
            :loading="submitting"
            @click="handleSubmitCode"
          />
        </div>
      </template>
    </Card>

    <!-- 签到记录 -->
    <Card v-if="attendanceHistory && attendanceHistory.length > 0">
      <template #title>签到记录</template>
      <template #content>
        <div class="space-y-2">
          <div
            v-for="(record, index) in attendanceHistory"
            :key="index"
            class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
          >
            <span class="text-sm text-gray-900">
              {{ formatDateTime(record.attendanceTime) }}
            </span>
            <Tag
              :value="getAttendanceStatusText(record.attendanceStatus)"
              :severity="getAttendanceStatusSeverity(record.attendanceStatus)"
              class="text-xs"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQueryAttendanceRecords } from '@/features/student/attendance/hooks'
import { formatDateTime } from '@/features/shared/utils'
import { toast } from '@/core/utils/toast'

interface Props {
  courseId: string
  experimentId: string
}

const props = defineProps<Props>()

const { records } = useQueryAttendanceRecords()

const attendanceStatus = ref(false)
const attendanceTime = ref<string>()
const attendanceCode = ref('')
const submitting = ref(false)

// 筛选当前实验的签到记录
const attendanceHistory = computed(() => {
  if (!records.value) return []
  return records.value.filter(
    (r) => r.courseId === props.courseId && r.experimentId === props.experimentId
  )
})

// 检查今日是否已签到
const checkedToday = computed(() => {
  return attendanceHistory.value.length > 0
})

const statusText = computed(() => {
  return checkedToday.value ? '今日已签到' : '未签到'
})

const statusTextClass = computed(() => {
  return checkedToday.value ? 'text-green-600' : 'text-gray-500'
})

const statusBgClass = computed(() => {
  return checkedToday.value ? 'bg-green-100' : 'bg-gray-100'
})

const statusIcon = computed(() => {
  return checkedToday.value ? 'pi pi-check-circle text-green-600' : 'pi pi-clock text-gray-400'
})

async function handleSubmitCode() {
  if (!attendanceCode.value.trim()) {
    toast.warn('请输入签到码')
    return
  }

  submitting.value = true

  try {
    // TODO: 调用后端接口验证签到码
    // await verifyAttendanceCode(attendanceCode.value, props.courseId, props.experimentId)

    // 模拟签到成功
    attendanceStatus.value = true
    attendanceTime.value = new Date().toISOString()
    toast.success('签到成功')
    attendanceCode.value = ''
  } catch (error) {
    console.error('签到失败:', error)
    toast.error('签到失败，请检查签到码是否正确')
  } finally {
    submitting.value = false
  }
}

function getAttendanceStatusText(status?: number): string {
  const statusMap: Record<number, string> = {
    0: '正常',
    1: '迟到',
    2: '补签',
    3: '跨班签到',
  }
  return statusMap[status ?? 0] || '未知'
}

function getAttendanceStatusSeverity(status?: number): 'success' | 'info' | 'warning' | 'danger' {
  const severityMap: Record<number, 'success' | 'info' | 'warning' | 'danger'> = {
    0: 'success',
    1: 'warning',
    2: 'info',
    3: 'danger',
  }
  return severityMap[status ?? 0] || 'info'
}
</script>
