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

        <!-- 数据收集配置 -->
        <ProcedureDataCollectionForm v-model:data-type="formData.dataType"
          v-model:data-fields-json="formData.dataFieldsJson" v-model:table-row-headers-str="formData.tableRowHeadersStr"
          v-model:table-column-headers-str="formData.tableColumnHeadersStr"
          v-model:table-cell-answers-str="formData.tableCellAnswersStr" />

        <!-- 附加选项 -->
        <div class="border-t border-slate-200 pt-3">
          <h3 class="text-sm font-medium text-slate-700 mb-3">附加选项</h3>

          <!-- 误差范围 -->
          <div class="mb-3">
            <label class="mb-2 block text-sm font-medium text-slate-700">
              误差范围（可选）
            </label>
            <InputNumber
              v-model="formData.tolerance"
              :min="0"
              class="w-full"
              placeholder="用于数值类答案的判分，允许的误差范围"
            />
            <p class="text-xs text-slate-500 mt-1">
              <i class="pi pi-info-circle mr-1"></i>
              设置数值答案允许的误差范围（如：±0.1）
            </p>
          </div>

          <!-- 提交要求 -->
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <Checkbox v-model="formData.needPhoto" binary input-id="needPhoto" />
              <label for="needPhoto" class="text-sm text-slate-700">要求学生提交照片</label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox v-model="formData.needDoc" binary input-id="needDoc" />
              <label for="needDoc" class="text-sm text-slate-700">要求学生提交文档</label>
            </div>
          </div>
        </div>
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
import { useCreateDataCollectionProcedure, useUpdateDataCollectionProcedure } from '@/features/teacher/experiment/procedure/hooks'
import { PROCEDURE_TYPE, DEFAULT_VALUES } from '@/features/teacher/experiment/procedure/constants'
import { parseJson, parseArray } from '@/features/teacher/experiment/procedure/utils'
import type { BaseProcedureFields } from '@/features/teacher/experiment/procedure/types'
import type { TeacherProcedureDetailResponse } from '@/core/api/generated'
import ProcedureDataCollectionForm from './ProcedureDataCollectionForm.vue'
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
const createMutation = useCreateDataCollectionProcedure()
const updateMutation = useUpdateDataCollectionProcedure()

// 是否为编辑模式
const isEditing = ref(false)
const editingProcedureId = ref<number | null>(null)

// 当前使用的 mutation
const mutation = computed(() => isEditing.value ? updateMutation : createMutation)

// 对话框标题
const dialogTitle = computed(() => isEditing.value ? '编辑数据收集步骤' : '添加数据收集步骤')

interface FormData extends BaseProcedureFields {
  dataType: number | null
  dataFieldsJson: string
  tableRowHeadersStr: string
  tableColumnHeadersStr: string
  tableCellAnswersStr: string
  tolerance: number | null
  needPhoto: boolean
  needDoc: boolean
}

const formData = ref<FormData>({
  type: PROCEDURE_TYPE.DATA_COLLECTION,
  remark: '',
  proportion: DEFAULT_VALUES.PROPORTION,
  isSkip: false,
  offsetMinutes: DEFAULT_VALUES.OFFSET_MINUTES,
  durationMinutes: DEFAULT_VALUES.DURATION_MINUTES,
  dataType: null,
  dataFieldsJson: '',
  tableRowHeadersStr: '',
  tableColumnHeadersStr: '',
  tableCellAnswersStr: '',
  tolerance: null,
  needPhoto: false,
  needDoc: false,
})

const resetForm = () => {
  formData.value = {
    type: PROCEDURE_TYPE.DATA_COLLECTION,
    remark: '',
    proportion: DEFAULT_VALUES.PROPORTION,
    isSkip: false,
    offsetMinutes: DEFAULT_VALUES.OFFSET_MINUTES,
    durationMinutes: DEFAULT_VALUES.DURATION_MINUTES,
    dataType: null,
    dataFieldsJson: '',
    tableRowHeadersStr: '',
    tableColumnHeadersStr: '',
    tableCellAnswersStr: '',
    tolerance: null,
    needPhoto: false,
    needDoc: false,
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

  // 填充表单数据（只填充基本字段，详细配置需要重新设置）
  formData.value = {
    type: PROCEDURE_TYPE.DATA_COLLECTION,
    remark: procedure.remark ?? '',
    proportion: procedure.proportion ?? DEFAULT_VALUES.PROPORTION,
    isSkip: procedure.isSkip ?? false,
    offsetMinutes: procedure.offsetMinutes ?? DEFAULT_VALUES.OFFSET_MINUTES,
    durationMinutes: procedure.durationMinutes ?? DEFAULT_VALUES.DURATION_MINUTES,
    dataType: procedure.dataCollectionType ?? null,
    dataFieldsJson: '',
    tableRowHeadersStr: '',
    tableColumnHeadersStr: '',
    tableCellAnswersStr: '',
    tolerance: null,
    needPhoto: procedure.dataNeedPhoto ?? false,
    needDoc: procedure.dataNeedDoc ?? false,
  }

  visible.value = true
}

const handleSubmit = async () => {
  // 基础验证
  if (!formData.value.remark.trim()) {
    toast.add({ severity: 'warn', summary: '提示', detail: '请输入步骤描述', life: 3000 })
    return
  }

  if (!formData.value.dataType) {
    toast.add({ severity: 'warn', summary: '提示', detail: '请选择数据类型', life: 3000 })
    return
  }

  const body: Record<string, unknown> = {
    remark: formData.value.remark,
    proportion: formData.value.proportion,
    isSkip: formData.value.isSkip,
    offsetMinutes: formData.value.offsetMinutes,
    durationMinutes: formData.value.durationMinutes,
    dataType: formData.value.dataType,
  }

  if (formData.value.dataType === 1) {
    // 关键数据类型
    body.dataFields = parseJson(formData.value.dataFieldsJson)
  } else if (formData.value.dataType === 2) {
    // 表格数据类型
    body.tableRowHeaders = parseArray(formData.value.tableRowHeadersStr)
    body.tableColumnHeaders = parseArray(formData.value.tableColumnHeadersStr)
    // 表格答案（可选填）
    body.tableCellAnswers = parseJson(formData.value.tableCellAnswersStr || '{}')
  }

  // 附加选项（可选）
  if (formData.value.tolerance !== null) {
    body.tolerance = formData.value.tolerance
  }
  if (formData.value.needPhoto) {
    body.needPhoto = true
  }
  if (formData.value.needDoc) {
    body.needDoc = true
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
