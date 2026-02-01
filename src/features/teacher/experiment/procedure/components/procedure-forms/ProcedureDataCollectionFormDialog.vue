<template>
  <Dialog v-model:visible="visible" header="添加数据收集步骤" :modal="true" :style="{ maxWidth: '100vw' }">
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
          <InputNumber
            v-model="formData.proportion"
            :min="DEFAULT_VALUES.MIN_PROPORTION"
            :max="DEFAULT_VALUES.MAX_PROPORTION"
            class="w-full"
            placeholder="请输入分数占比"
          />
        </div>

        <!-- 可跳过 -->
        <div>
          <div class="flex items-center gap-2">
            <Checkbox v-model="formData.isSkip" binary />
            <label class="text-sm font-medium text-slate-700">允许学生跳过此步骤</label>
          </div>
        </div>

        <!-- 时间配置 -->
        <ProcedureTimeConfig
          v-model:offset-minutes="formData.offsetMinutes"
          v-model:duration-minutes="formData.durationMinutes"
        />

        <!-- 数据收集配置 -->
        <ProcedureDataCollectionForm
          v-model:data-type="formData.dataType"
          v-model:data-fields-json="formData.dataFieldsJson"
          v-model:table-row-headers-str="formData.tableRowHeadersStr"
          v-model:table-column-headers-str="formData.tableColumnHeadersStr"
        />
      </div>

      <div class="flex justify-end gap-2">
        <Button label="取消" outlined @click="handleCancel" />
        <Button label="添加" type="submit" :loading="mutation.isPending.value" />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useCreateDataCollectionProcedure } from '@/features/teacher/experiment/procedure/hooks'
import { PROCEDURE_TYPE, DEFAULT_VALUES } from '@/features/teacher/experiment/procedure/constants'
import { parseJson, parseArray } from '@/features/teacher/experiment/procedure/utils'
import type { BaseProcedureFields } from '@/features/teacher/experiment/procedure/types'
import ProcedureDataCollectionForm from './ProcedureDataCollectionForm.vue'
import ProcedureTimeConfig from './ProcedureTimeConfig.vue'

interface Props {
  experimentId: number
}

const props = defineProps<Props>()

const visible = ref<boolean>(false)
const toast = useToast()
const mutation = useCreateDataCollectionProcedure()

const formData = ref<
  BaseProcedureFields & {
    dataType: number | null
    dataFieldsJson: string
    tableRowHeadersStr: string
    tableColumnHeadersStr: string
  }
>({
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
  }
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

  const body: any = {
    experimentId: props.experimentId,
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
    body.tableDataAnswers = {}
  }

  await mutation.mutateAsync({ body })

  toast.add({ severity: 'success', summary: '成功', detail: '步骤添加成功', life: 3000 })
  visible.value = false
  resetForm()
}

function open() {
  visible.value = true
}

function handleCancel() {
  visible.value = false
  resetForm()
}

defineExpose({
  open,
  handleCancel,
})
</script>
