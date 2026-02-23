<template>
  <Dialog
    v-model:visible="visible"
    header="延长时间"
    :modal="true"
    :style="{ width: '450px' }"
  >
    <div class="space-y-4">
      <!-- 已选学生 -->
      <div>
        <label class="mb-2 block text-sm font-medium text-slate-700">
          已选学生 ({{ selectedStudents.length }} 人)
        </label>
        <div class="max-h-32 overflow-y-auto rounded border border-slate-200 p-2">
          <div v-for="student in selectedStudents" :key="student.studentUsername" class="py-1 text-sm text-slate-600">
            {{ student.studentName }} ({{ student.studentUsername }})
          </div>
        </div>
      </div>

      <!-- 延长方式 -->
      <div>
        <label class="mb-2 block text-sm font-medium text-slate-700">
          延长方式
        </label>
        <div class="flex gap-4">
          <div class="flex items-center gap-2">
            <RadioButton
              v-model="extendMode"
              inputId="extendModeExperiment"
              value="experiment"
            />
            <label for="extendModeExperiment" class="text-sm">按实验延长</label>
          </div>
          <div class="flex items-center gap-2">
            <RadioButton
              v-model="extendMode"
              inputId="extendModeProcedure"
              value="procedure"
            />
            <label for="extendModeProcedure" class="text-sm">按步骤延长</label>
          </div>
        </div>
        <p class="mt-1 text-xs text-slate-500">
          {{ extendMode === 'experiment' ? '延长该实验下所有步骤的时间' : '只延长指定步骤的时间' }}
        </p>
      </div>

      <!-- 步骤选择（按步骤延长时显示） -->
      <div v-if="extendMode === 'procedure'">
        <label class="mb-2 block text-sm font-medium text-slate-700">
          选择步骤
        </label>
        <Select
          v-model="selectedProcedureId"
          :options="procedureOptions"
          option-label="label"
          option-value="value"
          placeholder="请选择步骤"
          class="w-full"
          @change="updateOriginalDeadline"
        />
      </div>

      <!-- 原截止时间 -->
      <div v-if="originalDeadline">
        <label class="mb-2 block text-sm font-medium text-slate-700">
          原截止时间
        </label>
        <div class="rounded border border-slate-200 bg-slate-50 p-2 text-sm text-slate-600">
          {{ formatDateTime(originalDeadline.toISOString()) }}
        </div>
      </div>

      <!-- 新截止时间 -->
      <div>
        <label class="mb-2 block text-sm font-medium text-slate-700">
          新截止时间 <span class="text-red-500">*</span>
        </label>
        <DatePicker
          v-model="newDeadline"
          showTime
          hourFormat="24"
          :minDate="minDeadline"
          placeholder="请选择新的截止时间"
          class="w-full"
        />
      </div>

      <!-- 延长时间显示 -->
      <div v-if="calculatedExtendedMinutes > 0">
        <label class="mb-2 block text-sm font-medium text-slate-700">
          需延长时间
        </label>
        <div class="rounded border border-blue-200 bg-blue-50 p-2 text-sm text-blue-600">
          <span class="font-medium">{{ calculatedExtendedMinutes }}</span> 分钟
        </div>
      </div>
    </div>

    <template #footer>
      <Button label="取消" severity="secondary" outlined @click="close" />
      <Button
        label="确认延长"
        :loading="isPending"
        :disabled="!canSubmit"
        @click="handleExtend"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import RadioButton from 'primevue/radiobutton'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import { useBatchExtendByProcedure, useBatchExtendByExperiment } from '@/features/teacher/experiment/procedure/hooks'
import { toast } from '@/core/utils/toast'
import { formatDateTime } from '@/features/shared/utils/formatters'

interface StudentInfo {
  studentUsername: string
  studentName: string
}

interface ProcedureInfo {
  id: number
  number: number
  type: number
  remark?: string
  offsetMinutes?: number
  durationMinutes?: number
}

const visible = ref(false)
const experimentId = ref<number>()
const experimentStartTime = ref<string>()
const procedures = ref<ProcedureInfo[]>([])
const selectedStudents = ref<StudentInfo[]>([])

const extendMode = ref<'experiment' | 'procedure'>('experiment')
const selectedProcedureId = ref<number | undefined>(undefined)
const newDeadline = ref<Date | null>(null)

const extendByProcedure = useBatchExtendByProcedure()
const extendByExperiment = useBatchExtendByExperiment()

const isPending = computed(() => extendByProcedure.isPending.value || extendByExperiment.isPending.value)

const procedureOptions = computed(() => {
  return procedures.value.map((p) => ({
    label: `步骤 ${p.number}${p.remark ? ` - ${p.remark}` : ''}`,
    value: p.id,
  }))
})

// 计算原截止时间
const originalDeadline = computed(() => {
  if (!experimentStartTime.value) return null

  let procedure: ProcedureInfo | undefined
  if (extendMode.value === 'procedure') {
    procedure = procedures.value.find((p) => p.id === selectedProcedureId.value)
  } else {
    // 按实验延长时，取最后一个步骤的截止时间
    procedure = procedures.value[procedures.value.length - 1]
  }

  if (!procedure) return null

  const start = new Date(experimentStartTime.value)
  const offsetMinutes = procedure.offsetMinutes || 0
  const durationMinutes = procedure.durationMinutes || 0
  const totalMinutes = offsetMinutes + durationMinutes
  return new Date(start.getTime() + totalMinutes * 60 * 1000)
})

// 最小可选时间（原截止时间）
const minDeadline = computed(() => {
  return originalDeadline.value || new Date()
})

// 计算需要延长的分钟数
const calculatedExtendedMinutes = computed(() => {
  if (!newDeadline.value || !originalDeadline.value) return 0
  const diffMs = newDeadline.value.getTime() - originalDeadline.value.getTime()
  const diffMinutes = Math.ceil(diffMs / (1000 * 60))
  return Math.max(0, diffMinutes)
})

const canSubmit = computed(() => {
  if (newDeadline.value === null) return false
  if (selectedStudents.value.length === 0) return false
  if (extendMode.value === 'procedure' && selectedProcedureId.value === undefined) return false
  if (calculatedExtendedMinutes.value <= 0) return false
  return true
})

// 更新原截止时间显示
function updateOriginalDeadline() {
  // 触发计算属性重新计算
}

async function open(
  students: StudentInfo[],
  expId: number,
  procedureList: ProcedureInfo[],
  startTime: string,
  preselectedProcedureId?: number
) {
  selectedStudents.value = students
  experimentId.value = expId
  procedures.value = procedureList
  experimentStartTime.value = startTime
  newDeadline.value = null

  // 如果预选了步骤，则设置为按步骤延长模式
  if (preselectedProcedureId !== undefined) {
    extendMode.value = 'procedure'
    selectedProcedureId.value = preselectedProcedureId
  } else {
    extendMode.value = 'experiment'
    selectedProcedureId.value = undefined
  }

  visible.value = true

  // 等待 DOM 更新后再次确认选中值
  if (preselectedProcedureId !== undefined) {
    await nextTick()
    selectedProcedureId.value = preselectedProcedureId
  }
}

function close() {
  visible.value = false
}

async function handleExtend() {
  if (!experimentId.value || newDeadline.value === null || selectedStudents.value.length === 0) {
    return
  }

  if (calculatedExtendedMinutes.value <= 0) {
    toast.error('新截止时间必须晚于原截止时间')
    return
  }

  const studentUsernames = selectedStudents.value.map((s) => s.studentUsername)

  try {
    if (extendMode.value === 'experiment') {
      await extendByExperiment.mutateAsync({
        experimentId: experimentId.value,
        studentUsernames,
        extendedMinutes: calculatedExtendedMinutes.value,
      })
    } else {
      if (selectedProcedureId.value === undefined) return
      await extendByProcedure.mutateAsync({
        experimentalProcedureId: selectedProcedureId.value,
        studentUsernames,
        extendedMinutes: calculatedExtendedMinutes.value,
      })
    }

    toast.success('延长时间成功')
    close()
  } catch (error) {
    // 错误已由全局处理
  }
}

defineExpose({ open, close })
</script>
