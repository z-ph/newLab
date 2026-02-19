import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { postApiTeacherVideosQuery } from '@/core/api/generated'
import client from '@/core/api/config'
import type { VideoUploadResponse } from '@/core/api/generated'

/**
 * 根据视频 ID 查询视频详情
 *
 * 注意：由于后端 API 不支持按 ID 查询单个视频，
 * 这里使用查询所有视频然后过滤的方式实现
 */
export function useQueryVideoDetail(videoId: Ref<number | string>) {
  const query = useQuery({
    queryKey: computed(() => ['video-detail', videoId.value]),
    queryFn: () =>
      postApiTeacherVideosQuery({
        body: { pageable: false },
        client,
      }),
    select: (response) => {
      // 尝试多种方式获取视频列表
      let videos: VideoUploadResponse[] = []

      if (Array.isArray(response.data?.data)) {
        videos = response.data.data
      } else if (response.data?.data?.records) {
        // 分页数据
        videos = response.data.data.records
      }

      return videos.find((v: VideoUploadResponse) => v.id === Number(videoId.value))
    },
    enabled: computed(() => !!videoId.value),
  })

  const video = computed(() => query.data.value)

  return {
    video,
    query,
  }
}
