<template>
  <Dialog
    v-model:visible="visible"
    :header="isOneClickMode ? '一键延长（所有步骤）' : '延长时间'"
    :modal="true"
    :style="{ width: '500px' }"
  >
    <div class="space-y-4">
      <!-- 学生选择 -->
      <div>
        <label class="mb-2 block text-sm font-medium text-slate-700">
          选择学生 <span class="text-red-500">*</span>
        </label>
        <div class="mb-2 flex gap-2">
          <Button
            label="全选"
            size="small"
            outlined
            @click="selectAllStudents"
          />
          <Button
            label="取消全选"
            size="small"
            outlined
            severity="secondary"
            @click="clearSelectedStudents"
          />
        </div>
        <div class="max-h-48 overflow-y-auto rounded border border-slate-200 p-2">
          <div
            v-for="student in availableStudents"
            :key="student.studentUsername"
            class="flex items-center gap-2 border-b border-slate-100 py-1.5 last:border-b-0"
          >
            <Checkbox
              v-model="selectedStudentUsernames"
              :inputId="`student-${student.studentUsername}`"
              :value="student.studentUsername"
            />
            <label :for="`student-${student.studentUsername}`" class="flex-1 text-sm text-slate-600 cursor-pointer">
              {{ student.studentName }} ({{ student.studentUsername }})
            </label>
          </div>
        </div>
        <p class="mt-1 text-xs text-slate-500">
          已选择 {{ selectedStudentUsernames.length }} / {{ availableStudents.length }} 人
        </p>
      </div>

      <!-- 步骤选择（非一键延长模式时显示） -->
      <div v-if="!isOneClickMode">
        <label class="mb-2 block text-sm font-medium text-slate-700">
          选择步骤 <span class="text-red-500">*</span>
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
          <span v-if="isOneClickMode" class="ml-2 text-xs text-slate-400">(最后一个步骤)</span>
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
        :label="isOneClickMode ? '确认一键延长' : '确认延长'"
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
import Checkbox from 'primevue/checkbox'
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
const availableStudents = ref<StudentInfo[]>([])

// 一键延长模式（按实验延长所有步骤）
const isOneClickMode = ref(false)
// 用户选择的步骤 ID
const selectedProcedureId = ref<number | undefined>(undefined)
// 用户选择的学生学号列表
const selectedStudentUsernames = ref<string[]>([])
// 新截止时间
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

// 全选学生
const selectAllStudents = () => {
  selectedStudentUsernames.value = availableStudents.value.map((s) => s.studentUsername)
}

// 取消全选
const clearSelectedStudents = () => {
  selectedStudentUsernames.value = []
}

// 计算原截止时间
const originalDeadline = computed(() => {
  if (!experimentStartTime.value) return null

  let procedure: ProcedureInfo | undefined
  if (isOneClickMode.value) {
    // 一键延长模式：取最后一个步骤的截止时间
    procedure = procedures.value[procedures.value.length - 1]
  } else {
    // 按步骤延长模式
    procedure = procedures.value.find((p) => p.id === selectedProcedureId.value)
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
  if (selectedStudentUsernames.value.length === 0) return false
  // 按步骤延长时需要选择步骤
  if (!isOneClickMode.value && selectedProcedureId.value === undefined) return false
  if (calculatedExtendedMinutes.value <= 0) return false
  return true
})

// 更新原截止时间显示
function updateOriginalDeadline() {
  // 触发计算属性重新计算
}

/**
 * 打开延长时间对话框
 * @param students 可选的学生列表
 * @param expId 实验 ID
 * @param procedureList 步骤列表
 * @param startTime 实验开始时间
 * @param procedureId 预选的步骤 ID（如果传入，则为按步骤延长模式；否则为一键延长模式）
 */
async function open(
  students: StudentInfo[],
  expId: number,
  procedureList: ProcedureInfo[],
  startTime: string,
  procedureId?: number
) {
  availableStudents.value = students
  selectedStudentUsernames.value = students.map((s) => s.studentUsername) // 默认全选
  experimentId.value = expId
  procedures.value = procedureList
  experimentStartTime.value = startTime
  newDeadline.value = null

  // 根据是否传入 procedureId 决定模式
  if (procedureId !== undefined) {
    isOneClickMode.value = false
    selectedProcedureId.value = procedureId
  } else {
    isOneClickMode.value = true
    selectedProcedureId.value = undefined
  }

  visible.value = true

  // 等待 DOM 更新后再次确认选中值
  if (procedureId !== undefined) {
    await nextTick()
    selectedProcedureId.value = procedureId
  }
}

function close() {
  visible.value = false
}

async function handleExtend() {
  if (!experimentId.value || newDeadline.value === null || selectedStudentUsernames.value.length === 0) {
    return
  }

  if (calculatedExtendedMinutes.value <= 0) {
    toast.error('新截止时间必须晚于原截止时间')
    return
  }

  try {
    if (isOneClickMode.value) {
      // 一键延长：按实验延长所有步骤
      await extendByExperiment.mutateAsync({
        experimentId: experimentId.value,
        studentUsernames: selectedStudentUsernames.value,
        extendedMinutes: calculatedExtendedMinutes.value,
      })
    } else {
      // 按步骤延长
      if (selectedProcedureId.value === undefined) return
      await extendByProcedure.mutateAsync({
        experimentalProcedureId: selectedProcedureId.value,
        studentUsernames: selectedStudentUsernames.value,
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
