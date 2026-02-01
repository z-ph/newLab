<template>
  <div class="space-y-3 border-t border-slate-200 pt-3">
    <div class="text-sm font-medium text-slate-700">时间配置</div>

    <!-- 开始时间偏移量 -->
    <div>
      <label class="mb-2 block text-sm font-medium text-slate-700">
        上课后多久开始 (分钟)
      </label>
      <InputNumber
        v-model="localOffsetMinutes"
        :min="TIME_LIMITS.MIN_OFFSET_MINUTES"
        :max="TIME_LIMITS.MAX_OFFSET_MINUTES"
        class="w-full"
        placeholder="默认为 0，表示上课后立即开始"
        :show-buttons="true"
        :min-fraction-digits="0"
        :max-fraction-digits="0"
      />
      <p class="mt-1 text-xs text-slate-500">
        {{ formatOffsetDescription(localOffsetMinutes) }}
      </p>
    </div>

    <!-- 持续时间 -->
    <div>
      <label class="mb-2 block text-sm font-medium text-slate-700">
        持续时间 (分钟) <span class="text-red-500">*</span>
      </label>
      <InputNumber
        v-model="localDurationMinutes"
        :min="TIME_LIMITS.MIN_DURATION_MINUTES"
        :max="TIME_LIMITS.MAX_DURATION_MINUTES"
        class="w-full"
        placeholder="请输入持续时间"
        :show-buttons="true"
        :min-fraction-digits="0"
        :max-fraction-digits="0"
      />
      <p class="mt-1 text-xs text-slate-500">
        {{ formatDurationDescription(localDurationMinutes) }}
      </p>
    </div>

    <!-- 预计时间窗口预览 -->
    <div v-if="localOffsetMinutes !== null && localDurationMinutes !== null" class="bg-blue-50 p-3 rounded">
      <p class="text-xs font-medium text-blue-900 mb-1">预计时间窗口：</p>
      <p class="text-xs text-blue-700">
        上课后 {{ localOffsetMinutes }} 分钟开始 → 持续 {{ localDurationMinutes }} 分钟
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TIME_LIMITS } from '../../constants'
import { formatOffsetDescription, formatDurationDescription } from '@/features/teacher/experiment/utils'

interface Props {
  offsetMinutes: number
  durationMinutes: number
}

interface Emits {
  (e: 'update:offsetMinutes', value: number): void
  (e: 'update:durationMinutes', value: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localOffsetMinutes = computed({
  get: () => props.offsetMinutes,
  set: (value) => emit('update:offsetMinutes', value ?? 0),
})

const localDurationMinutes = computed({
  get: () => props.durationMinutes,
  set: (value) => emit('update:durationMinutes', value ?? 60),
})
</script>
