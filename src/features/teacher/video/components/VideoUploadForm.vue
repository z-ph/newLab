<template>
  <div class="max-w-2xl mx-auto space-y-4">
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

    <div class="flex gap-2">
      <Button label="取消" severity="secondary" @click="handleCancel" />
      <Button
        label="上传"
        @click="handleConfirm"
        :loading="isPending"
        :disabled="!formData.file || !formData.title"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import FileUpload from 'primevue/fileupload'
import { useUploadVideo } from '@/features/teacher/video/hooks/useMutateVideo'

interface Emits {
  (e: 'success'): void
}

const emit = defineEmits<Emits>()
const router = useRouter()

// 从 API 类型派生，不重复定义
type VideoUploadFormData = {
  title?: string
  description?: string
  file?: File
}

const formData = ref<VideoUploadFormData>({
  title: '',
  description: '',
  file: undefined,
})

// 使用上传 mutation
const { mutate, isPending } = useUploadVideo()

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
  router.back()
}

// 确认上传
const handleConfirm = () => {
  if (!formData.value.file || !formData.value.title) return

  mutate(
    {
      file: formData.value.file,
      title: formData.value.title,
      description: formData.value.description,
    },
    {
      onSuccess: () => {
        emit('success')
      },
    }
  )
}
</script>
