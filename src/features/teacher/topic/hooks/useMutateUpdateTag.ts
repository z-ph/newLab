import { putApiTeacherTags } from '@/core/api/generated'
import { useMutation } from '@tanstack/vue-query'
import client from '@/core/api/config'
import { toast } from '@/core/utils/toast'
import type { UpdateTagRequest } from '@/core/api/generated'

/**
 * 更新标签
 */
export function useUpdateTag() {
  return useMutation({
    mutationFn: (data: UpdateTagRequest) =>
      putApiTeacherTags({
        body: data,
        client, // ✅ 传入自定义 client
      }),
    onSuccess: () => {
      toast.success('标签更新成功')
    },
  })
}
