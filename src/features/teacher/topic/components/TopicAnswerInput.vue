<template>
  <div class="space-y-2">
    <!-- 单选题 -->
    <div v-if="type === TOPIC_TYPE.SINGLE_CHOICE">
      <div v-for="(choice, idx) in validChoices" :key="idx" class="flex items-center gap-2">
        <RadioButton
          v-model="singleChoiceValue"
          :input-id="`choice-${choice.originalIndex}`"
          :value="getChoiceLabel(choice.originalIndex)"
          :disabled="disabled"
        />
        <label :for="`choice-${choice.originalIndex}`" class="cursor-pointer">
          {{ getChoiceLabel(choice.originalIndex) }}: {{ choice.text }}
        </label>
      </div>
    </div>

    <!-- 多选题 -->
    <div v-if="type === TOPIC_TYPE.MULTIPLE_CHOICE">
      <div v-for="(choice, idx) in validChoices" :key="idx" class="flex items-center gap-2">
        <Checkbox
          v-model="multiChoiceValue"
          :input-id="`choice-${choice.originalIndex}`"
          :value="getChoiceLabel(choice.originalIndex)"
          :disabled="disabled"
        />
        <label :for="`choice-${choice.originalIndex}`" class="cursor-pointer">
          {{ getChoiceLabel(choice.originalIndex) }}: {{ choice.text }}
        </label>
      </div>
    </div>

    <!-- 判断题 -->
    <div v-if="type === TOPIC_TYPE.TRUE_FALSE" class="flex gap-4">
      <div class="flex items-center gap-2">
        <RadioButton v-model="correctAnswer" input-id="correct" value="T" :disabled="disabled" />
        <label for="correct" class="cursor-pointer">正确</label>
      </div>
      <div class="flex items-center gap-2">
        <RadioButton v-model="correctAnswer" input-id="wrong" value="F" :disabled="disabled" />
        <label for="wrong" class="cursor-pointer">错误</label>
      </div>
    </div>

    <!-- 填空题/简答题 -->
    <div v-if="type === TOPIC_TYPE.FILL_BLANK || type === TOPIC_TYPE.SHORT_ANSWER">
      <InputText
        v-model="correctAnswer"
        placeholder="请输入正确答案"
        class="w-full"
        :disabled="disabled"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import RadioButton from 'primevue/radiobutton'
import Checkbox from 'primevue/checkbox'
import InputText from 'primevue/inputtext'
import { TOPIC_TYPE, CHOICE_LABEL_START_CHAR_CODE } from '@/features/teacher/topic/constants'

interface Props {
  type: number
  choiceList: string[]
  selectedChoices?: string[]
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selectedChoices: () => [],
  disabled: false,
})

const correctAnswer = defineModel<string>('modelValue', { required: true })
const selectedChoices = defineModel<string[]>('selectedChoices', { default: () => [] })

// 单选选中的值
const singleChoiceValue = computed({
  get: () => correctAnswer.value,
  set: (val) => { correctAnswer.value = val },
})

// 多选选中的值
const multiChoiceValue = computed({
  get: () => selectedChoices.value,
  set: (val) => { selectedChoices.value = val },
})

// 有效选项列表（非空）
const validChoices = computed(() => {
  const result: Array<{ text: string; originalIndex: number }> = []
  props.choiceList.forEach((choice, index) => {
    if (choice) {
      result.push({ text: choice, originalIndex: index })
    }
  })
  return result
})

// 获取选项标签（A, B, C, ...）
function getChoiceLabel(index: number): string {
  return String.fromCharCode(CHOICE_LABEL_START_CHAR_CODE + index)
}
</script>
