<template>
  <Dialog v-model:visible="visible" header="上传视频" modal :style="{ width: '600px' }">
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">视频文件 *</label>
        <FileUpload
          mode="basic"
          accept="video/*"
          :max-file-size="104857600"
          @select="onFileSelect"
          :auto="false"
          choose-label="选择视频文件"
          class="w-full"
        />
        <p class="text-xs text-slate-500 mt-1">支持 MP4、AVI 等视频格式，最大 100MB</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">视频标题 *</label>
        <InputText v-model="formData.title" placeholder="输入视频标题" class="w-full" />
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">视频描述</label>
        <Textarea v-model="formData.description" placeholder="输入视频描述（可选）" rows="3" class="w-full" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">关联课程</label>
          <Select
            v-model="formData.courseId"
            :options="courseOptions"
            option-label="courseName"
            option-value="courseId"
            placeholder="无"
            class="w-full"
            show-clear
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">关联实验</label>
          <Select
            v-model="formData.experimentId"
            :options="experimentOptions"
            option-label="experimentName"
            option-value="experimentId"
            placeholder="无"
            class="w-full"
            show-clear
          />
        </div>
      </div>
    </div>

    <template #footer>
      <Button label="取消" severity="secondary" @click="handleCancel" />
      <Button
        label="上传"
        @click="handleConfirm"
        :loading="isLoading"
        :disabled="!formData.file || !formData.title"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import FileUpload from 'primevue/fileupload'
import Select from 'primevue/select'
import type { PostApiTeacherVideosUploadData } from '@/core/api/generated'

defineProps<{
  courseOptions: Array<{ courseId: string; courseName: string }>
  experimentOptions: Array<{ experimentId: string; experimentName: string }>
  isLoading?: boolean
}>()

// ✅ 从 API 类型派生，不重复定义
type VideoUploadFormData = Partial<PostApiTeacherVideosUploadData['query']> & {
  file?: File
}

interface Emits {
  (e: 'confirm', data: VideoUploadFormData): void
}

const emit = defineEmits<Emits>()

// ✅ 状态封装在组件内部
const visible = ref(false)
const formData = ref({
  title: '',
  description: '',
  file: undefined,
  courseId: undefined,
  experimentId: undefined,
} satisfies VideoUploadFormData)

// ✅ 打开对话框
function open() {
  formData.value = {
    title: '',
    description: '',
    file: undefined,
    courseId: undefined,
    experimentId: undefined,
  }
  visible.value = true
}

// ✅ 关闭对话框
function close() {
  visible.value = false
}

// 文件选择
const onFileSelect = (event: any) => {
  formData.value.file = event.files[0]
  // 自动填充标题
  if (!formData.value.title) {
    formData.value.title = event.files[0].name.replace(/\.[^/.]+$/, '')
  }
}

// 取消
const handleCancel = () => {
  close()
}

// 确认上传
const handleConfirm = () => {
  emit('confirm', formData.value)
}

// ✅ 暴露方法，不暴露状态
defineExpose({
  open,
  close,
})
</script>
