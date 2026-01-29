import { postApiStudentBindClass } from '@/core/api/generated'
import client from '@/core/api/config'
import { useMutation } from '@tanstack/vue-query'
import { toast } from '@/core/utils/toast'

/**
 * 加入班级
 */
export function useBindClass() {
  return useMutation({
    mutationFn: (verificationCode: string) =>
      postApiStudentBindClass({
        body: { verificationCode },
        client,
      }),
    onSuccess: () => {
      toast.success('加入班级成功')
    },
  })
}
