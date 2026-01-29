<template>
  <div class="space-y-2">
    <!-- 单选题 -->
    <div v-if="type === 1">
      <div v-for="(choice, idx) in validChoices" :key="idx" class="flex items-center gap-2">
        <RadioButton
          v-model="singleChoiceValue"
          :input-id="`choice-${choice.originalIndex}`"
          :value="getChoiceLabel(choice.originalIndex)"
        />
        <label :for="`choice-${choice.originalIndex}`" class="cursor-pointer">
          {{ getChoiceLabel(choice.originalIndex) }}: {{ choice.text }}
        </label>
      </div>
    </div>

    <!-- 多选题 -->
    <div v-if="type === 2">
      <div v-for="(choice, idx) in validChoices" :key="idx" class="flex items-center gap-2">
        <Checkbox
          v-model="multiChoiceValue"
          :input-id="`choice-${choice.originalIndex}`"
          :value="getChoiceLabel(choice.originalIndex)"
        />
        <label :for="`choice-${choice.originalIndex}`" class="cursor-pointer">
          {{ getChoiceLabel(choice.originalIndex) }}: {{ choice.text }}
        </label>
      </div>
    </div>

    <!-- 判断题 -->
    <div v-if="type === 3" class="flex gap-4">
      <div class="flex items-center gap-2">
        <RadioButton v-model="correctAnswer" input-id="correct" value="T" />
        <label for="correct" class="cursor-pointer">正确</label>
      </div>
      <div class="flex items-center gap-2">
        <RadioButton v-model="correctAnswer" input-id="wrong" value="F" />
        <label for="wrong" class="cursor-pointer">错误</label>
      </div>
    </div>

    <!-- 填空题/其他 -->
    <div v-if="type === 4 || type === 6">
      <InputText
        v-model="correctAnswer"
        placeholder="请输入正确答案"
        class="w-full"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import RadioButton from 'primevue/radiobutton'
import Checkbox from 'primevue/checkbox'
import InputText from 'primevue/inputtext'

interface Props {
  type: number
  choiceList: string[]
  modelValue: string
  selectedChoices?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  selectedChoices: () => [],
})

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'update:selectedChoices', value: string[]): void
}

const emit = defineEmits<Emits>()

const correctAnswer = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// 单选选中的值
const singleChoiceValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// 多选选中的值
const multiChoiceValue = computed({
  get: () => props.selectedChoices,
  set: (val) => emit('update:selectedChoices', val),
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

// 获取选项标签
function getChoiceLabel(index: number): string {
  return String.fromCharCode(65 + index) // A, B, C, ...
}
</script>
