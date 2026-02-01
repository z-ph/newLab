<template>
  <Dialog v-model:visible="visible" header="批量删除确认" modal>
    <div class="space-y-4">
      <p class="text-slate-700">
        确定要删除选中的 <span class="font-semibold text-red-600">{{ topicCount }}</span> 道题目吗？
      </p>
      <p class="text-sm text-slate-500">
        删除后将无法恢复，请谨慎操作。
      </p>
    </div>

    <template #footer>
      <Button label="取消" severity="secondary" @click="close" :disabled="isLoading" />
      <Button label="确定删除" severity="danger" @click="handleConfirm" :loading="isLoading" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import Dialog from "primevue/dialog"
import Button from "primevue/button"

interface Props {
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
})

interface Emits {
  (e: 'confirm', topicIds: number[]): void
}

const emit = defineEmits<Emits>()

// ✅ 状态封装在组件内部
const visible = ref(false)
const selectedTopicIds = ref<number[]>([])

// 选中的题目数量
const topicCount = computed(() => selectedTopicIds.value.length)

// 打开对话框
function open(topicIds: number[]) {
  if (topicIds.length === 0) return
  selectedTopicIds.value = topicIds
  visible.value = true
}

// 关闭对话框
function close() {
  visible.value = false
  selectedTopicIds.value = []
}

// 确认删除
function handleConfirm() {
  emit("confirm", selectedTopicIds.value)
  // 删除成功后由父组件关闭对话框
}

// ✅ 暴露方法
defineExpose({
  open,
  close,
})
</script>
