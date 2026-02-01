import { postApiTeacherTags } from '@/core/api/generated'
import { useMutation } from '@tanstack/vue-query'
import client from '@/core/api/config'
import { toast } from '@/core/utils/toast'

/**
 * 创建标签
 */
export function useCreateTag() {
  return useMutation({
    mutationFn: (params: { tagName: string; type: string }) =>
      postApiTeacherTags({
        body: params,
        client, // ✅ 传入自定义 client
      }),
    onSuccess: (response) => {
      toast.success('标签创建成功')
      return response.data?.data
    },
  })
}
