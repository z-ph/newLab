<template>
  <div>
    <label class="block text-sm font-medium text-slate-700 mb-2">选项</label>
    <div class="space-y-2">
      <div v-for="(_, index) in choiceList" :key="index" class="flex items-center gap-2">
        <span class="w-8 text-center font-medium text-slate-700">{{ getChoiceLabel(index) }}</span>
        <InputText
          v-model="choiceList[index]"
          :placeholder="`选项 ${getChoiceLabel(index)}`"
          class="flex-1"
          :disabled="disabled"
        />
      </div>
    </div>
    <Button
      v-show="!disabled && choiceList.length < MAX_CHOICES_COUNT"
      label="添加选项"
      type="button"
      size="small"
      text
      severity="secondary"
      @click="$emit('add-choice')"
      class="mt-2"
    />
  </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { getChoiceLabel } from '@/features/teacher/topic/utils/formatters'
import { MAX_CHOICES_COUNT } from '@/features/teacher/topic/constants'

interface Props {
  choiceList: string[]
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  disabled: false,
})

interface Emits {
  (e: 'add-choice'): void
}

defineEmits<Emits>()
</script>
