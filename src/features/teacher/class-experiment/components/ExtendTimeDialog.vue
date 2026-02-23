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
        />
      </div>

      <!-- 延长时间 -->
      <div>
        <label class="mb-2 block text-sm font-medium text-slate-700">
          延长时间（分钟） <span class="text-red-500">*</span>
        </label>
        <InputNumber
          v-model="extendedMinutes"
          :min="1"
          :max="9999"
          fluid
          placeholder="请输入延长时间"
        />
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
import InputNumber from 'primevue/inputnumber'
import { useBatchExtendByProcedure, useBatchExtendByExperiment } from '@/features/teacher/experiment/procedure/hooks'
import { toast } from '@/core/utils/toast'

interface StudentInfo {
  studentUsername: string
  studentName: string
}

interface ProcedureInfo {
  id: number
  number: number
  type: number
  remark?: string
}

const visible = ref(false)
const experimentId = ref<number>()
const procedures = ref<ProcedureInfo[]>([])
const selectedStudents = ref<StudentInfo[]>([])

const extendMode = ref<'experiment' | 'procedure'>('experiment')
const selectedProcedureId = ref<number | undefined>(undefined)
const extendedMinutes = ref<number | null>(null)

const extendByProcedure = useBatchExtendByProcedure()
const extendByExperiment = useBatchExtendByExperiment()

const isPending = computed(() => extendByProcedure.isPending.value || extendByExperiment.isPending.value)

const procedureOptions = computed(() => {
  return procedures.value.map((p) => ({
    label: `步骤 ${p.number}${p.remark ? ` - ${p.remark}` : ''}`,
    value: p.id,
  }))
})

const canSubmit = computed(() => {
  if (extendedMinutes.value === null || extendedMinutes.value < 1) return false
  if (selectedStudents.value.length === 0) return false
  if (extendMode.value === 'procedure' && selectedProcedureId.value === undefined) return false
  return true
})

async function open(students: StudentInfo[], expId: number, procedureList: ProcedureInfo[], preselectedProcedureId?: number) {
  selectedStudents.value = students
  experimentId.value = expId
  procedures.value = procedureList
  extendedMinutes.value = null

  // 如果预选了步骤，则设置���按步骤延长模式
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
  if (!experimentId.value || extendedMinutes.value === null || selectedStudents.value.length === 0) {
    return
  }

  const studentUsernames = selectedStudents.value.map((s) => s.studentUsername)

  try {
    if (extendMode.value === 'experiment') {
      await extendByExperiment.mutateAsync({
        experimentId: experimentId.value,
        studentUsernames,
        extendedMinutes: extendedMinutes.value,
      })
    } else {
      if (selectedProcedureId.value === undefined) return
      await extendByProcedure.mutateAsync({
        experimentalProcedureId: selectedProcedureId.value,
        studentUsernames,
        extendedMinutes: extendedMinutes.value,
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
