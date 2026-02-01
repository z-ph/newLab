import { deleteApiTeacherTagsByTagId } from '@/core/api/generated'
import { useMutation } from '@tanstack/vue-query'
import client from '@/core/api/config'
import { toast } from '@/core/utils/toast'

/**
 * 删除标签
 */
export function useDeleteTag() {
  return useMutation({
    mutationFn: (tagId: number) =>
      deleteApiTeacherTagsByTagId({
        path: { tagId },
        client, // ✅ 传入自定义 client
      }),
    onSuccess: () => {
      toast.success('标签删除成功')
    },
  })
}
