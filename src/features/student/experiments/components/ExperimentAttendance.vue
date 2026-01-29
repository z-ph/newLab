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

    <!-- 扫码签到按钮 -->
    <Card v-if="!attendanceStatus">
      <template #title>扫码签到</template>
      <template #content>
        <div class="text-center space-y-4">
          <p class="text-sm text-gray-600">
            请使用微信扫描教师提供的签到二维码
          </p>

          <Button
            label="打开微信扫码"
            icon="pi pi-qrcode"
            size="large"
            class="w-full"
            :loading="scanning"
            @click="handleScan"
          />

          <div class="text-xs text-gray-400 bg-gray-50 p-3 rounded">
            <p class="font-medium mb-1">提示：</p>
            <ul class="space-y-1 text-left">
              <li>• 确保在微信浏览器中打开</li>
              <li>• 允许网页访问摄像头</li>
              <li>• 仅在课堂现场可签到</li>
            </ul>
          </div>
        </div>
      </template>
    </Card>

    <!-- 手动输入签到码（备用方案） -->
    <Card v-if="!attendanceStatus && !isWechatBrowser()">
      <template #title>手动输入签到码</template>
      <template #content>
        <div class="space-y-3">
          <InputText
            v-model="attendanceCode"
            placeholder="请输入签到码"
            class="w-full"
          />
          <Button
            label="提交签到码"
            class="w-full"
            :disabled="!attendanceCode.trim()"
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
import { ref, computed, onMounted } from 'vue'
import { useQueryAttendanceRecords } from '@/features/student/attendance/hooks'
import { formatDateTime } from '@/features/shared/utils'
import { scanQRCode, isWechatBrowser, setupWechatSDK } from '@/core/utils/wechat'
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
const scanning = ref(false)

// 页面加载时初始化微信 SDK
onMounted(async () => {
  try {
    await setupWechatSDK()
  } catch (error) {
    console.log('微信 SDK 初始化失败或不在微信环境:', error)
  }
})

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

async function handleScan() {
  // 检查是否在微信环境中
  if (!isWechatBrowser()) {
    toast.warn('请在微信中打开页面进行扫码签到')
    return
  }

  scanning.value = true

  try {
    // 调用微信扫码
    const result = await scanQRCode()
    await handleScanSuccess(result)
  } catch (error) {
    console.error('扫码失败:', error)
    toast.error('扫码失败，请重试')
  } finally {
    scanning.value = false
  }
}

async function handleScanSuccess(result: string) {
  // 解析扫码结果（通常是教师生成的签到码）
  console.log('扫码结果:', result)

  // TODO: 调用后端接口验证签到码
  // const verifyResult = await verifyAttendanceCode(result, props.courseId, props.experimentId)

  // 模拟签到成功
  attendanceStatus.value = true
  attendanceTime.value = new Date().toISOString()
  toast.success('签到成功')
}

async function handleSubmitCode() {
  if (!attendanceCode.value.trim()) {
    toast.warn('请输入签到码')
    return
  }

  try {
    // TODO: 调用后端接口验证签到码
    await handleScanSuccess(attendanceCode.value)
    attendanceCode.value = ''
  } catch (error) {
    console.error('签到失败:', error)
    toast.error('签到失败，请检查签到码是否正确')
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
