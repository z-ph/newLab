import { deleteApiTeacherVideosByVideoId, postApiTeacherVideosUpload } from "@/core/api/generated"
import { useMutation } from "@tanstack/vue-query"
import client from "@/core/api/config"
import { toast } from "@/core/utils/toast"

/**
 * 上传视频
 */
export function useUploadVideo() {
  return useMutation({
    mutationFn: async (params: {
      file: File
    } & Partial<Omit<import('@/core/api/generated').PostApiTeacherVideosUploadData['query'], 'title'>> & {
      title: string
    }) => {
      const { file, title, description, courseId, experimentId } = params

      // ✅ 使用自动生成的 API
      return await postApiTeacherVideosUpload({
        body: { file },
        query: { title, description, courseId, experimentId },
        client,
      })
    },
    onSuccess: () => {
      toast.success("视频上传成功")
    },
  })
}

/**
 * 删除视频
 */
export function useDeleteVideo() {
  return useMutation({
    mutationFn: async (videoId: number) => {
      return await deleteApiTeacherVideosByVideoId({
        path: { videoId },
        client,
      })
    },
    onSuccess: () => {
      toast.success("视频删除成功")
    },
  })
}
