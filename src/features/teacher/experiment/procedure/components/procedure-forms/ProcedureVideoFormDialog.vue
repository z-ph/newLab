<template>
  <Dialog v-model:visible="visible" header="添加视频步骤" :modal="true">
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
        <ProcedureTimeConfig
          v-model:offset-minutes="formData.offsetMinutes"
          v-model:duration-minutes="formData.durationMinutes"
        />

        <!-- 视频选择 -->
        <ProcedureVideoForm v-model:video-id="formData.videoId" />
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
import { useCreateVideoProcedure } from '@/features/teacher/experiment/procedure/hooks'
import { DEFAULT_VALUES } from '@/features/teacher/experiment/procedure/constants'
import type { BaseProcedureFields } from '@/features/teacher/experiment/procedure/types'
import ProcedureVideoForm from './ProcedureVideoForm.vue'
import ProcedureTimeConfig from './ProcedureTimeConfig.vue'

interface Props {
  experimentId: number
}


const props = defineProps<Props>()

const visible = ref<boolean>(false)
const toast = useToast()
const mutation = useCreateVideoProcedure()

const formData = ref<BaseProcedureFields & { videoId: number | null }>({
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

  await mutation.mutateAsync({
    body: {
      experimentId: props.experimentId,
      remark: formData.value.remark,
      proportion: formData.value.proportion,
      isSkip: formData.value.isSkip,
      offsetMinutes: formData.value.offsetMinutes,
      durationMinutes: formData.value.durationMinutes,
      videoId: formData.value.videoId,
    },
  })

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
  handleCancel
})
</script>
