/**
 * 批改打分 Hooks
 */

import { postApiTeacherProcedureSubmissionsBySubmissionIdGrade } from '@/core/api/generated'
import type { GradeProcedureRequest } from '@/core/api/generated'
import { useMutation } from '@tanstack/vue-query'
import client from '@/core/api/config'
import { toast } from '@/core/utils/toast'

// 批改请求类型（基于 API 类型派生）
export type GradeSubmissionRequest = {
  submissionId: number
} & GradeProcedureRequest

/**
 * 批改学生步骤提交
 */
export function useGradeSubmission() {
  return useMutation({
    mutationFn: (request: GradeSubmissionRequest) =>
      postApiTeacherProcedureSubmissionsBySubmissionIdGrade({
        path: { submissionId: request.submissionId },
        body: {
          score: request.score,
          teacherComment: request.teacherComment,
        },
        client,
      }),
    onSuccess: () => {
      toast.success('批改成功')
    },
  })
}
