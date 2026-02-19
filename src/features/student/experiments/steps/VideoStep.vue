<template>
  <div class="space-y-4">
    <!-- 步骤信息 -->
    <Card>
      <template #content>
        <div class="space-y-2">
          <h3 class="text-base font-medium text-gray-900">{{ stepInfo?.remark || '观看实验视频' }}</h3>
          <p class="text-sm text-gray-600">请完整观看视频，不可倍速或拖动进度条</p>
        </div>
      </template>
    </Card>

    <!-- 视频播放器 -->
    <Card v-if="stepInfo?.videoId">
      <template #content>
        <div class="aspect-video bg-black rounded overflow-hidden">
          <video
            ref="videoRef"
            :src="videoUrl"
            controls
            controlsList="nodownload noremoteplayback noplaybackrate noplaybackstatus"
            disablePictureInPicture
            class="w-full h-full"
            @loadedmetadata="handleVideoLoaded"
            @timeupdate="handleTimeUpdate"
            @seeking="handleSeeking"
            @seeked="handleSeeked"
            @ratechange="handleRateChange"
            @ended="handleVideoEnded"
            @keydown.prevent="handleKeyDown"
            @wheel.prevent
            @contextmenu.prevent
          >
            您的浏览器不支持视频播放
          </video>
          <div v-if="isLoadingKey" class="flex items-center justify-center h-full text-white">
            <span>正在加载视频...</span>
          </div>
        </div>

        <!-- 播放进度 -->
        <div class="mt-3 flex items-center justify-between">
          <span class="text-xs text-gray-500">播放进度</span>
          <div class="flex items-center gap-2">
            <div class="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="h-full bg-blue-500 transition-all duration-300"
                :style="{ width: `${progress}%` }"
              />
            </div>
            <span class="text-xs text-gray-600 w-12 text-right">{{ progress }}%</span>
          </div>
        </div>
      </template>
    </Card>

    <!-- 完成状态 -->
    <Card v-if="isCompleted">
      <template #content>
        <div class="flex items-center justify-center py-4 text-green-600">
          <i class="pi pi-check-circle text-2xl mr-2" />
          <span class="text-sm font-medium">视频观看完成</span>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQueryVideoPlayKey } from '@/features/teacher/video/hooks'
import { useQueryProcedureDetail, useMarkVideoViewed, useQueryStudentExperimentDetail } from '../hooks'
import { VIDEO_CONFIG } from '../constants/config'
import { baseURL } from '@/core/api/config'
import { toast } from '@/core/utils/toast'

interface Props {
  stepId: number
  courseId: string
  experimentId: number
  classCode: string
}

const props = defineProps<Props>()

// 获取步骤详情（从实验详情的步骤列表中查找）
const { procedureDetail: stepInfo } = useQueryProcedureDetail(
  computed(() => props.stepId),
  {
    experimentId: computed(() => props.experimentId),
    classCode: computed(() => props.classCode),
  }
)

// 获取实验详情（用于刷新数据）
const { query: experimentQuery } = useQueryStudentExperimentDetail(
  computed(() => props.experimentId),
  computed(() => props.classCode)
)

// 视频播放密钥
const { data: playKey, isLoading: isLoadingKey } = useQueryVideoPlayKey(
  computed(() => stepInfo.value?.videoId)
)

// 视频播放 URL
const videoUrl = computed(() => {
  if (playKey.value) {
    return `${baseURL}${playKey.value}`
  }
  return ''
})

// 视频元素引用
const videoRef = ref<HTMLVideoElement | null>(null)

// 播放进度
const progress = ref(0)

// 记录合法的播放位置（用于防止拖动）
const lastValidTime = ref(0)

// 是否完成
const isCompleted = computed(() => stepInfo.value?.isLocked ?? false)

// 标记已观看 hook
const markVideoViewed = useMarkVideoViewed()

/**
 * 视频元数据加载完成
 */
function handleVideoLoaded() {
  if (!videoRef.value) return
  lastValidTime.value = 0
  progress.value = 0
}

/**
 * 更新播放进度
 */
function handleTimeUpdate() {
  if (!videoRef.value) return

  const currentTime = videoRef.value.currentTime
  const duration = videoRef.value.duration

  // 更新合法播放位置
  lastValidTime.value = currentTime

  // 计算播放进度百分比
  progress.value = Math.round((currentTime / duration) * 100)
}

/**
 * 防止拖动进度条（静默强制执行）
 */
function handleSeeking() {
  if (!videoRef.value) return

  // 静默恢复到合法位置，不显示提示
  if (Math.abs(videoRef.value.currentTime - lastValidTime.value) > VIDEO_CONFIG.SEEK_TOLERANCE) {
    videoRef.value.currentTime = lastValidTime.value
  }
}

/**
 * 拖动完成后再次确认位置
 */
function handleSeeked() {
  if (!videoRef.value) return

  // 双重保险：确保恢复到合法位置
  if (Math.abs(videoRef.value.currentTime - lastValidTime.value) > VIDEO_CONFIG.SEEK_TOLERANCE) {
    videoRef.value.currentTime = lastValidTime.value
  }
}

/**
 * 禁用所有键盘快捷键（静默阻止）
 */
function handleKeyDown(event: KeyboardEvent) {
  // 阻止所有键盘操作：空格、方向键、Home/End、数字键等
  event.preventDefault()
  event.stopPropagation()
  return false
}

/**
 * 防止倍速播放（静默强制执行）
 */
function handleRateChange() {
  if (!videoRef.value) return

  // 静默强制保持 1x 倍速，不显示提示
  if (videoRef.value.playbackRate !== 1) {
    videoRef.value.playbackRate = 1
  }
}

/**
 * 视频播放完成，自动标记为已观看
 */
async function handleVideoEnded() {
  if (!props.stepId) {
    toast.warn('步骤信息不完整')
    return
  }

  // 更新进度为 100%
  progress.value = 100

  try {
    // 调用标记已观看 API
    await markVideoViewed.mutateAsync({
      procedureId: props.stepId,
      classCode: props.classCode as NonNullable<typeof props.classCode>,
    })

    toast.success('视频观看完成')

    // 刷新数据
    experimentQuery.refetch()
  } catch (error) {
    console.error('标记视频观看失败:', error)
    toast.error('标记视频观看失败，请重试')
  }
}
</script>
