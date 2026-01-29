<template>
  <Dialog v-model:visible="visible" header="添加题库答题步骤" :style="{ width: '60vw' }" :modal="true">
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

        <!-- 题库配置 -->
        <ProcedureTopicForm
          v-model:is-random="formData.isRandom"
          v-model:topic-number="formData.topicNumber"
          v-model:topic-tags="formData.topicTags"
          v-model:teacher-selected-topic-ids-str="formData.teacherSelectedTopicIdsStr"
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
import { useCreateTopicProcedure } from '@/features/teacher/experiment/procedure/hooks'
import { PROCEDURE_TYPE, DEFAULT_VALUES } from '@/features/teacher/experiment/procedure/constants'
import { formatDateToISO, parseArray } from '@/features/teacher/experiment/procedure/utils'
import type { BaseProcedureFields } from '@/features/teacher/experiment/procedure/types'
import ProcedureTopicForm from './ProcedureTopicForm.vue'

interface Props {
  experimentId: number
}

const props = defineProps<Props>()

const visible = ref<boolean>(false)
const toast = useToast()
const mutation = useCreateTopicProcedure()

const formData = ref<
  BaseProcedureFields & {
    isRandom: boolean
    topicNumber: number | null
    topicTags: string[]
    teacherSelectedTopicIdsStr: string
  }
>({
  type: PROCEDURE_TYPE.TOPIC,
  remark: '',
  proportion: DEFAULT_VALUES.PROPORTION,
  isSkip: false,
  startTime: null,
  endTime: null,
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
    startTime: null,
    endTime: null,
    isRandom: false,
    topicNumber: null,
    topicTags: [],
    teacherSelectedTopicIdsStr: '',
  }
}

const handleSubmit = async () => {
  // 基础验证
  if (!formData.value.remark.trim()) {
    toast.add({ severity: 'warn', summary: '提示', detail: '请输入步骤描述', life: 3000 })
    return
  }

  const body: any = {
    experimentId: props.experimentId,
    remark: formData.value.remark,
    proportion: formData.value.proportion,
    isSkip: formData.value.isSkip,
    startTime: formatDateToISO(formData.value.startTime),
    endTime: formatDateToISO(formData.value.endTime),
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
