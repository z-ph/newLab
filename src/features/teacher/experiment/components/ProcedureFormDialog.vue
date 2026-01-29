<template>
  <Dialog v-model:visible="visible" header="添加实验步骤" :style="{ width: '60vw' }" :modal="true">
    <form @submit.prevent="handleSubmit">
      <div class="mb-4 flex flex-col gap-3">
        <!-- 步骤类型 -->
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">
            步骤类型 <span class="text-red-500">*</span>
          </label>
          <Select
            v-model="formData.type"
            :options="PROCEDURE_TYPE_OPTIONS"
            option-label="label"
            option-value="value"
            placeholder="选择步骤类型"
            class="w-full"
          />
        </div>

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

        <!-- 时间范围 -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">开始时间</label>
            <DatePicker
              v-model="formData.startTime"
              showTime
              showSeconds
              placeholder="选择开始时间"
              fluid
              class="w-full"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">结束时间</label>
            <DatePicker
              v-model="formData.endTime"
              showTime
              showSeconds
              placeholder="选择结束时间"
              fluid
              class="w-full"
            />
          </div>
        </div>

        <!-- 可跳过 -->
        <div>
          <div class="flex items-center gap-2">
            <Checkbox v-model="formData.isSkip" binary />
            <label class="text-sm font-medium text-slate-700">允许学生跳过此步骤</label>
          </div>
        </div>

        <!-- 视频步骤特有字段 -->
        <ProcedureVideoForm
          v-if="formData.type === PROCEDURE_TYPE.VIDEO"
          v-model:video-id="formData.videoId"
        />

        <!-- 数据收集步骤特有字段 -->
        <ProcedureDataCollectionForm
          v-if="formData.type === PROCEDURE_TYPE.DATA_COLLECTION"
          v-model:data-type="formData.dataType"
          v-model:data-fields-json="formData.dataFieldsJson"
          v-model:table-row-headers-str="formData.tableRowHeadersStr"
          v-model:table-column-headers-str="formData.tableColumnHeadersStr"
        />

        <!-- 题库答题步骤特有字段 -->
        <ProcedureTopicForm
          v-if="formData.type === PROCEDURE_TYPE.TOPIC"
          v-model:is-random="formData.isRandom"
          v-model:topic-number="formData.topicNumber"
          v-model:topic-tags="formData.topicTags"
          v-model:teacher-selected-topic-ids-str="formData.teacherSelectedTopicIdsStr"
        />
      </div>
      <div class="flex justify-end gap-2">
        <Button label="取消" outlined @click="visible = false" />
        <Button label="添加" type="submit" :loading="isSubmitting" />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import {
  useCreateVideoProcedure,
  useCreateDataCollectionProcedure,
  useCreateTopicProcedure,
} from '@/features/teacher/experiment/procedure/hooks'
import {
  PROCEDURE_TYPE_OPTIONS,
  PROCEDURE_TYPE,
  DEFAULT_VALUES,
} from '@/features/teacher/experiment/procedure/constants'
import {
  createDefaultProcedureFormData,
  type ProcedureFormData,
} from '@/features/teacher/experiment/procedure/types'
import {
  formatDateToISO,
  parseJson,
  parseArray,
} from '@/features/teacher/experiment/procedure/utils'
import ProcedureVideoForm from '@/features/teacher/experiment/components/procedure-forms/ProcedureVideoForm.vue'
import ProcedureDataCollectionForm from '@/features/teacher/experiment/components/procedure-forms/ProcedureDataCollectionForm.vue'
import ProcedureTopicForm from '@/features/teacher/experiment/components/procedure-forms/ProcedureTopicForm.vue'

interface Props {
  experimentId: number
}

interface Emits {
  (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const visible = defineModel<boolean>()

const toast = useToast()

const videoMutation = useCreateVideoProcedure()
const dataCollectionMutation = useCreateDataCollectionProcedure()
const topicMutation = useCreateTopicProcedure()

const isSubmitting = computed(() =>
  videoMutation.isPending.value ||
  dataCollectionMutation.isPending.value ||
  topicMutation.isPending.value
)

const formData = ref<ProcedureFormData>(createDefaultProcedureFormData())

watch(visible, (newValue) => {
  if (!newValue) {
    resetForm()
  }
})

watch(() => formData.value.type, () => {
  // 切换类型时重置特定字段
  resetTypeSpecificFields()
})

const resetForm = () => {
  formData.value = createDefaultProcedureFormData()
}

const resetTypeSpecificFields = () => {
  formData.value.videoId = null
  formData.value.dataType = null
  formData.value.dataFieldsJson = ''
  formData.value.tableRowHeadersStr = ''
  formData.value.tableColumnHeadersStr = ''
  formData.value.isRandom = false
  formData.value.topicNumber = null
  formData.value.topicTags = []
  formData.value.teacherSelectedTopicIdsStr = ''
}

const handleSubmit = async () => {
  if (!formData.value.type) {
    toast.add({
      severity: 'warn',
      summary: '提示',
      detail: '请选择步骤类型',
      life: 3000,
    })
    return
  }

  const type = formData.value.type

  // 基础验证
  if (!formData.value.remark.trim()) {
    toast.add({ severity: 'warn', summary: '提示', detail: '请输入步骤描述', life: 3000 })
    return
  }

  const baseBody = {
    experimentId: props.experimentId,
    remark: formData.value.remark,
    proportion: formData.value.proportion,
    isSkip: formData.value.isSkip,
    startTime: formatDateToISO(formData.value.startTime),
    endTime: formatDateToISO(formData.value.endTime),
  }

  if (type === PROCEDURE_TYPE.VIDEO) {
    // 视频步骤
    if (!formData.value.videoId) {
      toast.add({ severity: 'warn', summary: '提示', detail: '请选择视频', life: 3000 })
      return
    }
    await videoMutation.mutateAsync({
      body: {
        ...baseBody,
        videoId: formData.value.videoId,
      },
    })
  } else if (type === PROCEDURE_TYPE.DATA_COLLECTION) {
    // 数据收集步骤
    if (!formData.value.dataType) {
      toast.add({ severity: 'warn', summary: '提示', detail: '请选择数据类型', life: 3000 })
      return
    }
    const body: any = {
      ...baseBody,
      dataType: formData.value.dataType,
    }
    if (formData.value.dataType === 1) {
      body.dataFields = parseJson(formData.value.dataFieldsJson)
    } else if (formData.value.dataType === 2) {
      body.tableRowHeaders = parseArray(formData.value.tableRowHeadersStr)
      body.tableColumnHeaders = parseArray(formData.value.tableColumnHeadersStr)
      body.tableDataAnswers = {}
    }
    await dataCollectionMutation.mutateAsync({ body })
  } else if (type === PROCEDURE_TYPE.TOPIC) {
    // 题库答题步骤
    const body: any = { ...baseBody }
    if (formData.value.isRandom) {
      if (!formData.value.topicNumber) {
        toast.add({ severity: 'warn', summary: '提示', detail: '请输入题目数量', life: 3000 })
        return
      }
      body.isRandom = true
      body.topicNumber = formData.value.topicNumber
      body.topicTags = formData.value.topicTags
    } else {
      const ids = parseArray(formData.value.teacherSelectedTopicIdsStr)
      if (!ids || ids.length === 0) {
        toast.add({ severity: 'warn', summary: '提示', detail: '请输入题目ID', life: 3000 })
        return
      }
      body.isRandom = false
      body.teacherSelectedTopicIds = ids.map(Number)
    }
    await topicMutation.mutateAsync({ body })
  }

  toast.add({
    severity: 'success',
    summary: '成功',
    detail: '步骤添加成功',
    life: 3000,
  })

  emit('success')
}
</script>
