<template>
  <Dialog v-model:visible="visible" :header="dialogTitle" :modal="true" :style="{ maxWidth: '100vw' }">
    <form @submit.prevent="handleSubmit">
      <div class="mb-4 flex flex-col gap-3">
        <!-- 步骤描述 -->
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">
            步骤描述 <span class="text-red-500">*</span>
          </label>
          <Textarea v-model="formData.remark" rows="3" class="w-full" placeholder="请输入步骤描述" />
        </div>

        <!-- 分数占比 -->
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">
            分数占比(%) <span class="text-red-500">*</span>
          </label>
          <InputNumber v-model="formData.proportion" :min="DEFAULT_VALUES.MIN_PROPORTION"
            :max="DEFAULT_VALUES.MAX_PROPORTION" class="w-full" placeholder="请输入分数占比" />
        </div>

        <!-- 可跳过 -->
        <div>
          <div class="flex items-center gap-2">
            <Checkbox v-model="formData.isSkip" binary />
            <label class="text-sm font-medium text-slate-700">允许学生跳过此步骤</label>
          </div>
        </div>

        <!-- 时间配置 -->
        <ProcedureTimeConfig v-model:offset-minutes="formData.offsetMinutes"
          v-model:duration-minutes="formData.durationMinutes" />

        <!-- 视频选择 -->
        <ProcedureVideoForm v-model:video-id="formData.videoId" />
      </div>

      <div class="flex justify-end gap-2">
        <Button label="取消" outlined @click="handleCancel" />
        <Button :label="isEditing ? '更新' : '添加'" type="submit" :loading="mutation.isPending.value" />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useCreateVideoProcedure, useUpdateVideoProcedure, useInsertVideoProcedure } from '@/features/teacher/experiment/procedure/hooks'
import { DEFAULT_VALUES } from '@/features/teacher/experiment/procedure/constants'
import type { BaseProcedureFields } from '@/features/teacher/experiment/procedure/types'
import type { TeacherProcedureDetailResponse } from '@/core/api/generated'
import ProcedureVideoForm from './ProcedureVideoForm.vue'
import ProcedureTimeConfig from './ProcedureTimeConfig.vue'

interface Props {
  experimentId: number
}

const props = defineProps<Props>()

const visible = ref<boolean>(false)
const toast = useToast()
const createMutation = useCreateVideoProcedure()
const updateMutation = useUpdateVideoProcedure()
const insertMutation = useInsertVideoProcedure()

// 是否为编辑模式
const isEditing = ref(false)
// 是否为插入模式
const isInserting = ref(false)
const editingProcedureId = ref<number | null>(null)
// 插入位置
const afterNumber = ref<number>(0)

// 当前使用的 mutation
const mutation = computed(() => {
  if (isEditing.value) return updateMutation
  if (isInserting.value) return insertMutation
  return createMutation
})

// 对话框标题
const dialogTitle = computed(() => {
  if (isEditing.value) return '编辑视频步骤'
  if (isInserting.value) return `插入视频步骤 (在第 ${afterNumber.value} 步后)`
  return '添加视频步骤'
})

interface Emit {
  (e: 'refresh'): void
}
const emit = defineEmits<Emit>()

interface FormData extends BaseProcedureFields {
  videoId: number | null
}

const formData = ref<FormData>({
  type: 1, // PROCEDURE_TYPE.VIDEO
  remark: '',
  proportion: DEFAULT_VALUES.PROPORTION,
  isSkip: false,
  offsetMinutes: DEFAULT_VALUES.OFFSET_MINUTES,
  durationMinutes: DEFAULT_VALUES.DURATION_MINUTES,
  videoId: null,
})

const resetForm = () => {
  formData.value = {
    type: 1,
    remark: '',
    proportion: DEFAULT_VALUES.PROPORTION,
    isSkip: false,
    offsetMinutes: DEFAULT_VALUES.OFFSET_MINUTES,
    durationMinutes: DEFAULT_VALUES.DURATION_MINUTES,
    videoId: null,
  }
  isEditing.value = false
  isInserting.value = false
  editingProcedureId.value = null
  afterNumber.value = 0
}

// 打开添加对话框
function open() {
  resetForm()
  visible.value = true
}

// 打开编辑对话框
function openEdit(procedure: TeacherProcedureDetailResponse) {
  resetForm()
  isEditing.value = true
  editingProcedureId.value = procedure.id ?? null

  // 填充表单数据
  formData.value = {
    type: 1,
    remark: procedure.remark ?? '',
    proportion: procedure.proportion ?? DEFAULT_VALUES.PROPORTION,
    isSkip: procedure.isSkip ?? false,
    offsetMinutes: procedure.offsetMinutes ?? DEFAULT_VALUES.OFFSET_MINUTES,
    durationMinutes: procedure.durationMinutes ?? DEFAULT_VALUES.DURATION_MINUTES,
    videoId: procedure.videoId ?? null,
  }

  visible.value = true
}

// 打开插入对话框
function openInsert(after: number) {
  resetForm()
  isInserting.value = true
  afterNumber.value = after
  visible.value = true
}

const handleSubmit = async () => {
  // 基础验证
  if (!formData.value.remark.trim()) {
    toast.add({ severity: 'warn', summary: '提示', detail: '请输入步骤描述', life: 3000 })
    return
  }

  if (!formData.value.videoId) {
    toast.add({ severity: 'warn', summary: '提示', detail: '请选择视频', life: 3000 })
    return
  }

  const body = {
    remark: formData.value.remark,
    proportion: formData.value.proportion,
    isSkip: formData.value.isSkip,
    offsetMinutes: formData.value.offsetMinutes,
    durationMinutes: formData.value.durationMinutes,
    videoId: formData.value.videoId,
  }

  if (isEditing.value) {
    // 编辑模式
    await updateMutation.mutateAsync({
      body: {
        id: editingProcedureId.value!,
        ...body,
      },
    })
    toast.add({ severity: 'success', summary: '成功', detail: '步骤更新成功', life: 3000 })
  } else if (isInserting.value) {
    // 插入模式
    await insertMutation.mutateAsync({
      body: {
        ...body,
        experimentId: props.experimentId,
        afterNumber: afterNumber.value,
      },
    })
    toast.add({ severity: 'success', summary: '成功', detail: '步骤插入成功', life: 3000 })
  } else {
    // 添加模式
    await createMutation.mutateAsync({
      body: {
        ...body,
        experimentId: props.experimentId,
      },
    })
    toast.add({ severity: 'success', summary: '成功', detail: '步骤添加成功', life: 3000 })
  }

  visible.value = false
  resetForm()
  emit('refresh')
}

function handleCancel() {
  visible.value = false
  resetForm()
}

defineExpose({
  open,
  openEdit,
  openInsert,
  handleCancel
})
</script>
