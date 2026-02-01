<template>
  <div>
    <!-- 视频步骤对话框 -->
    <ProcedureVideoFormDialog
      ref="videoDialogRef"
      v-if="procedureType === PROCEDURE_TYPE.VIDEO"
      :experiment-id="experimentId"
    />

    <!-- 数据收集步骤对话框 -->
    <ProcedureDataCollectionFormDialog
      ref="dataCollectionDialogRef"
      v-if="procedureType === PROCEDURE_TYPE.DATA_COLLECTION"
      :experiment-id="experimentId"
    />

    <!-- 题库答题步骤对话框 -->
    <ProcedureTopicFormDialog
      ref="topicDialogRef"
      v-if="procedureType === PROCEDURE_TYPE.TOPIC"
      :experiment-id="experimentId"
    />

    <!-- 步骤类型选择对框 -->
    <Dialog
      v-else
      v-model:visible="typeSelectVisible"
      header="添加实验步骤"
      :modal="true"
      :style="{ maxWidth: '100vw' }"
    >
      <div class="flex flex-col gap-3">
        <label class="block text-sm font-medium text-slate-700">
          选择步骤类型 <span class="text-red-500">*</span>
        </label>
        <div class="grid grid-cols-1 gap-3">
          <div
            v-for="option in PROCEDURE_TYPE_OPTIONS"
            :key="option.value"
            class="cursor-pointer rounded-lg border-2 border-slate-200 p-4 transition-all hover:border-blue-500 hover:bg-blue-50"
            @click="handleSelectType(option.value)"
          >
            <div class="flex items-center gap-3">
              <i :class="option.icon" class="text-2xl text-blue-600"></i>
              <div class="flex-1">
                <h3 class="text-base font-semibold text-slate-900">{{ option.label }}</h3>
                <p class="text-sm text-slate-600">{{ option.description }}</p>
              </div>
              <i class="pi pi-chevron-right text-slate-400"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-2">
        <Button label="取消" outlined @click="handleCancel" />
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PROCEDURE_TYPE_OPTIONS, PROCEDURE_TYPE } from '@/features/teacher/experiment/procedure/constants'
import ProcedureVideoFormDialog from './procedure-forms/ProcedureVideoFormDialog.vue'
import ProcedureDataCollectionFormDialog from './procedure-forms/ProcedureDataCollectionFormDialog.vue'
import ProcedureTopicFormDialog from './procedure-forms/ProcedureTopicFormDialog.vue'

interface Props {
  experimentId: number
}

interface Emits {
  (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 类型定义
type ProcedureType = (typeof PROCEDURE_TYPE)[keyof typeof PROCEDURE_TYPE]

// 步骤类型
const procedureType = ref<ProcedureType>()

// 各个子对话框的 ref
const videoDialogRef = ref<InstanceType<typeof ProcedureVideoFormDialog>>()
const dataCollectionDialogRef = ref<InstanceType<typeof ProcedureDataCollectionFormDialog>>()
const topicDialogRef = ref<InstanceType<typeof ProcedureTopicFormDialog>>()

// 类型选择对话框的可见性
const typeSelectVisible = ref(false)

// 打开对话框
function open() {
  procedureType.value = undefined
  typeSelectVisible.value = true
}

// 选择步骤类型
function handleSelectType(type: ProcedureType) {
  procedureType.value = type
  typeSelectVisible.value = false

  // 延迟一帧，确保子组件已经渲染
  setTimeout(() => {
    if (type === PROCEDURE_TYPE.VIDEO) {
      videoDialogRef.value?.open()
    } else if (type === PROCEDURE_TYPE.DATA_COLLECTION) {
      dataCollectionDialogRef.value?.open()
    } else if (type === PROCEDURE_TYPE.TOPIC) {
      topicDialogRef.value?.open()
    }
  }, 0)
}

// 取消 - 关闭所有对话框
function handleCancel() {
  typeSelectVisible.value = false
  procedureType.value = undefined
}

defineExpose({
  open,
})
</script>
