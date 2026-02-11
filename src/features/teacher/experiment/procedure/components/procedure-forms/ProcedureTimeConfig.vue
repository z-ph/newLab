<template>
  <div class="space-y-3 border-t border-slate-200 pt-3">
    <div class="text-sm font-medium text-slate-700">时间配置</div>

    <!-- 开始时间偏移量 -->
    <div>
      <label class="mb-2 block text-sm font-medium text-slate-700">
        开始时间偏移
      </label>
      <div class="flex gap-2">
        <InputNumber
          v-model="offsetValue"
          :min="minOffsetValue"
          :max="maxOffsetValue"
          class="flex-1"
          placeholder="0 表示上课时立即开始"
          :show-buttons="true"
          :min-fraction-digits="0"
          :max-fraction-digits="0"
        />
        <Select
          v-model="offsetUnit"
          :options="TIME_UNIT_OPTIONS"
          option-label="label"
          option-value="value"
          class="w-32"
        />
      </div>
      <div class="mt-1 space-y-1">
        <p class="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
          提示：正数表示上课后开始，负数表示上课前开始，0 表示上课时立即开始
        </p>
        <p class="text-xs text-slate-500">
          {{ offsetDescription }}
        </p>
      </div>
    </div>

    <!-- 持续时间 -->
    <div>
      <label class="mb-2 block text-sm font-medium text-slate-700">
        持续时间 <span class="text-red-500">*</span>
      </label>
      <div class="flex gap-2">
        <InputNumber
          v-model="durationValue"
          :min="minDurationValue"
          :max="maxDurationValue"
          class="flex-1"
          placeholder="请输入持续时间"
          :show-buttons="true"
          :min-fraction-digits="0"
          :max-fraction-digits="0"
        />
        <Select
          v-model="durationUnit"
          :options="TIME_UNIT_OPTIONS"
          option-label="label"
          option-value="value"
          class="w-32"
        />
      </div>
      <p class="mt-1 text-xs text-slate-500">
        {{ formatDurationDescription(durationMinutes) }}
      </p>
    </div>

    <!-- 预计时间窗口预览 -->
    <div v-if="offsetMinutes !== null && durationMinutes !== null" class="bg-blue-50 p-3 rounded">
      <p class="text-xs font-medium text-blue-900 mb-1">预计时间窗口：</p>
      <p class="text-xs text-blue-700">
        {{ timeWindowDescription }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { TIME_LIMITS, TIME_UNIT_OPTIONS, DEFAULT_TIME_UNIT, type TimeUnitUnit } from '../../constants'
import { formatOffsetDescription, formatDurationDescription } from '@/features/teacher/experiment/utils'

// 使用 defineModel 定义双向绑定的分钟数
const offsetMinutes = defineModel<number>('offsetMinutes', { default: 0 })
const durationMinutes = defineModel<number>('durationMinutes', { default: 60 })

// 偏移量的单位
const offsetUnit = ref<TimeUnitUnit>(DEFAULT_TIME_UNIT)
// 持续时间的单位
const durationUnit = ref<TimeUnitUnit>(DEFAULT_TIME_UNIT)

// 偏移量的显示值（根据当前单位换算）
const offsetValue = ref(0)
// 持续时间的显示值（根据当前单位换算）
const durationValue = ref(1)

// 获取单位的转换系数
const getConversionFactor = (unit: TimeUnitUnit): number => {
  return TIME_UNIT_OPTIONS.find(opt => opt.value === unit)?.conversionFactor || 1
}

// 计算不同单位下的最大/最小值
const minOffsetValue = computed(() => {
  return Math.ceil(TIME_LIMITS.MIN_OFFSET_MINUTES / getConversionFactor(offsetUnit.value))
})

const maxOffsetValue = computed(() => {
  return Math.floor(TIME_LIMITS.MAX_OFFSET_MINUTES / getConversionFactor(offsetUnit.value))
})

const minDurationValue = computed(() => {
  return Math.ceil(TIME_LIMITS.MIN_DURATION_MINUTES / getConversionFactor(durationUnit.value))
})

const maxDurationValue = computed(() => {
  return Math.floor(TIME_LIMITS.MAX_DURATION_MINUTES / getConversionFactor(durationUnit.value))
})

// 偏移量描述（支持负数，表示上课前）
const offsetDescription = computed(() => {
  if (offsetMinutes.value === 0) {
    return '上课时立即开始'
  } else if (offsetMinutes.value > 0) {
    return `上课后 ${formatOffsetDescription(offsetMinutes.value)} 开始`
  } else {
    return `上课前 ${formatOffsetDescription(-offsetMinutes.value)} 开始`
  }
})

// 时间窗口描述
const timeWindowDescription = computed(() => {
  const offsetText = offsetMinutes.value === 0
    ? '上课时'
    : offsetMinutes.value > 0
      ? `上课后 ${offsetMinutes.value} 分钟`
      : `上课前 ${-offsetMinutes.value} 分钟`
  return `${offsetText}开始 → 持续 ${durationMinutes.value} 分钟`
})

// 初始化显示值
const initOffsetValue = () => {
  offsetValue.value = Math.round(offsetMinutes.value / getConversionFactor(offsetUnit.value))
}

const initDurationValue = () => {
  durationValue.value = Math.ceil(durationMinutes.value / getConversionFactor(durationUnit.value))
}

// 监听 offsetValue 变化，自动转换为分钟
watch(offsetValue, (newValue) => {
  offsetMinutes.value = newValue * getConversionFactor(offsetUnit.value)
})

// 监听 durationValue 变化，自动转换为分钟
watch(durationValue, (newValue) => {
  durationMinutes.value = newValue * getConversionFactor(durationUnit.value)
})

// 监听单位变化，重新计算显示值
watch(offsetUnit, () => {
  // 使用 Math.round 确保负数取整正确
  offsetValue.value = Math.round(offsetMinutes.value / getConversionFactor(offsetUnit.value))
})

watch(durationUnit, () => {
  durationValue.value = Math.ceil(durationMinutes.value / getConversionFactor(durationUnit.value))
})

// 初始化
initOffsetValue()
initDurationValue()
</script>
