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
            请使用微信��描教师提供的签到二维码
          </p>

          <Button
            label="打开微信扫码"
            icon="pi pi-qrcode"
            size="large"
            class="w-full"
            @click="handleScan"
          />

          <div class="text-xs text-gray-400 bg-gray-50 p-3 rounded">
            <p class="font-medium mb-1">提示：</p>
            <ul class="space-y-1 text-left">
              <li>• 确保已安装微信</li>
              <li>• 允许网页访问摄像头</li>
              <li>• 仅在课堂现场可签到</li>
            </ul>
          </div>
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
              :value="record.success ? '成功' : '失败'"
              :severity="record.success ? 'success' : 'danger'"
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
import { formatDateTime } from '@/features/student/attendance/utils'

interface Props {
  courseId: string
  experimentId: string
}

const props = defineProps<Props>()

const { records } = useQueryAttendanceRecords()

const attendanceStatus = ref(false)
const attendanceTime = ref<string>()

// 筛选当前实验的签到记录
const attendanceHistory = computed(() => {
  if (!records.value) return []
  return records.value
    .filter((r) => r.courseId === props.courseId && r.experimentId === props.experimentId)
    .map((r) => ({
      ...r,
      success: true, // AttendanceRecord 没有success字段，默认为true
    }))
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

function handleScan() {
  // 检查是否在微信环境中
  const isWechat = /micromessenger/i.test(navigator.userAgent)

  if (!isWechat) {
    // 提示用户使用微信打开
    alert('请在微信中打开页面进行扫码签到')
    return
  }

  // 调用微信 JS-SDK 扫码接口
  // @ts-ignore
  if (window.wx && window.wx.scanQRCode) {
    // @ts-ignore
    window.wx.scanQRCode({
      needResult: 1, // 1 表示需要返回结果
      scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码
      success: (res: any) => {
        // 扫码成功，res.resultStr 是扫码结果
        handleScanSuccess(res.resultStr)
      },
      fail: (err: any) => {
        console.error('扫码失败', err)
        alert('扫码失败，请重试')
      },
    })
  } else {
    // 微信 JS-SDK 未加载
    alert('微信扫码功能初始化中，请稍后再试')
  }
}

function handleScanSuccess(result: string) {
  // 解析扫码结果（通常是教师生成的签到码）
  console.log('扫码结果:', result)

  // TODO: 调用后端接口验证签到码
  // const verifyResult = await verifyAttendanceCode(result)

  // 模拟签到成功
  attendanceStatus.value = true
  attendanceTime.value = new Date().toISOString()
}
</script>
