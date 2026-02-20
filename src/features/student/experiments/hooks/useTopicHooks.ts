/**
 * 题目答题步骤 Hooks
 */

import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {
  postApiStudentProcedureSubmissionsTopicComplete,
  putApiStudentProcedureSubmissionsTopicUpdate,
} from '@/core/api/generated'
import type { MapString1 } from '@/core/api/generated'
import client from '@/core/api/config'
import { toast } from '@/core/utils/toast'

/**
 * 提交答案参数
 */
export interface SubmitTopicAnswersParams {
  procedureId: number
  classCode: string
  answers: Record<string, string>
}

/**
 * 将答案对象转换为 API 所需的 MapString1 类型
 * 注意：MapString1 类型定义不完整，实际是 Record<string, string>
 */
function toMapString1(answers: Record<string, string>): MapString1 {
  return answers as unknown as MapString1
}

/**
 * 提交题目答案
 */
export function useSubmitTopicAnswers() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: SubmitTopicAnswersParams) => {
      return postApiStudentProcedureSubmissionsTopicComplete({
        body: {
          procedureId: params.procedureId,
          classCode: params.classCode,
          answers: toMapString1(params.answers),
        },
        client,
      })
    },
    onSuccess: () => {
      toast.success('答案提交成功')
      queryClient.invalidateQueries({ queryKey: ['student-experiment-detail'] })
      queryClient.invalidateQueries({ queryKey: ['student-procedure-submissions'] })
    },
  })
}

/**
 * 更新题目答案
 */
export function useUpdateTopicAnswers() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: SubmitTopicAnswersParams) => {
      return putApiStudentProcedureSubmissionsTopicUpdate({
        body: {
          procedureId: params.procedureId,
          classCode: params.classCode,
          answers: toMapString1(params.answers),
        },
        client,
      })
    },
    onSuccess: () => {
      toast.success('答案更新成功')
      queryClient.invalidateQueries({ queryKey: ['student-experiment-detail'] })
      queryClient.invalidateQueries({ queryKey: ['student-procedure-submissions'] })
    },
  })
}
