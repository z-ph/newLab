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
        />
      </div>
    </div>
    <Button
      v-show="choiceList.length < 8"
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

interface Props {
  choiceList: string[]
}

defineProps<Props>()

interface Emits {
  (e: 'add-choice'): void
}

defineEmits<Emits>()

// 获取选项标签
function getChoiceLabel(index: number): string {
  return String.fromCharCode(65 + index) // A, B, C, ...
}
</script>
