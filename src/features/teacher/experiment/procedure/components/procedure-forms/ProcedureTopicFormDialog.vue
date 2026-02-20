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

        <!-- 题库配置 -->
        <ProcedureTopicForm v-model:is-random="formData.isRandom" v-model:topic-number="formData.topicNumber"
          v-model:topic-tags="formData.topicTags"
          v-model:teacher-selected-topic-ids-str="formData.teacherSelectedTopicIdsStr" />
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
import { useCreateTopicProcedure, useUpdateTopicProcedure } from '@/features/teacher/experiment/procedure/hooks'
import { PROCEDURE_TYPE, DEFAULT_VALUES } from '@/features/teacher/experiment/procedure/constants'
import { parseArray, stringifyArray } from '@/features/teacher/experiment/procedure/utils'
import type { BaseProcedureFields } from '@/features/teacher/experiment/procedure/types'
import type { TeacherProcedureDetailResponse } from '@/core/api/generated'
import ProcedureTopicForm from './ProcedureTopicForm.vue'
import ProcedureTimeConfig from './ProcedureTimeConfig.vue'

interface Props {
  experimentId: number
}
interface Emits {
  (e: 'refresh'): void
}
const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const visible = ref<boolean>(false)
const toast = useToast()

const createMutation = useCreateTopicProcedure()
const updateMutation = useUpdateTopicProcedure()

// 是否为编辑模式
const isEditing = ref(false)
const editingProcedureId = ref<number | null>(null)

// 当前使用的 mutation
const mutation = computed(() => isEditing.value ? updateMutation : createMutation)

// 对话框标题
const dialogTitle = computed(() => isEditing.value ? '编辑题库答题步骤' : '添加题库答题步骤')

interface FormData extends BaseProcedureFields {
  isRandom: boolean
  topicNumber: number | null
  topicTags: string[]
  teacherSelectedTopicIdsStr: string
}

const formData = ref<FormData>({
  type: PROCEDURE_TYPE.TOPIC,
  remark: '',
  proportion: DEFAULT_VALUES.PROPORTION,
  isSkip: false,
  offsetMinutes: DEFAULT_VALUES.OFFSET_MINUTES,
  durationMinutes: DEFAULT_VALUES.DURATION_MINUTES,
  isRandom: false,
  topicNumber: null,
  topicTags: [],
  teacherSelectedTopicIdsStr: '',
})

const resetForm = () => {
  formData.value = {
    type: PROCEDURE_TYPE.TOPIC,
    remark: '',
    proportion: DEFAULT_VALUES.PROPORTION,
    isSkip: false,
    offsetMinutes: DEFAULT_VALUES.OFFSET_MINUTES,
    durationMinutes: DEFAULT_VALUES.DURATION_MINUTES,
    isRandom: false,
    topicNumber: null,
    topicTags: [],
    teacherSelectedTopicIdsStr: '',
  }
  isEditing.value = false
  editingProcedureId.value = null
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
    type: PROCEDURE_TYPE.TOPIC,
    remark: procedure.remark ?? '',
    proportion: procedure.proportion ?? DEFAULT_VALUES.PROPORTION,
    isSkip: procedure.isSkip ?? false,
    offsetMinutes: procedure.offsetMinutes ?? DEFAULT_VALUES.OFFSET_MINUTES,
    durationMinutes: procedure.durationMinutes ?? DEFAULT_VALUES.DURATION_MINUTES,
    isRandom: procedure.topicIsRandom ?? false,
    topicNumber: procedure.topicNumber ?? null,
    topicTags: procedure.topicTags ? procedure.topicTags.split(',').filter(Boolean) : [],
    teacherSelectedTopicIdsStr: stringifyArray(procedure.topicIds),
  }

  visible.value = true
}

const handleSubmit = async () => {
  // 基础验证
  if (!formData.value.remark.trim()) {
    toast.add({ severity: 'warn', summary: '提示', detail: '请输入步骤描述', life: 3000 })
    return
  }

  const body: Record<string, unknown> = {
    remark: formData.value.remark,
    proportion: formData.value.proportion,
    isSkip: formData.value.isSkip,
    offsetMinutes: formData.value.offsetMinutes,
    durationMinutes: formData.value.durationMinutes,
  }

  if (formData.value.isRandom) {
    // 随机抽题
    if (!formData.value.topicNumber) {
      toast.add({ severity: 'warn', summary: '提示', detail: '请输入题目数量', life: 3000 })
      return
    }
    body.isRandom = true
    body.topicNumber = formData.value.topicNumber
    body.topicTags = formData.value.topicTags
  } else {
    // 教师指定题目
    const ids = parseArray(formData.value.teacherSelectedTopicIdsStr)
    if (!ids || ids.length === 0) {
      toast.add({ severity: 'warn', summary: '提示', detail: '请输入题目ID', life: 3000 })
      return
    }
    body.isRandom = false
    body.teacherSelectedTopicIds = ids.map(Number)
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
  handleCancel,
})
</script>
