/**
 * 题目答题步骤 Hooks
 */

import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {
  postApiStudentProcedureSubmissionsTopicComplete,
  putApiStudentProcedureSubmissionsTopicUpdate,
} from '@/core/api/generated'
import type { TopicAnswerItem } from '@/core/api/generated'
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
 * 将答案 Record 转换为 TopicAnswerItem 数组
 */
function toTopicAnswerItems(answers: Record<string, string>): TopicAnswerItem[] {
  return Object.entries(answers).map(([topicId, answer]) => ({
    topicId: Number(topicId),
    answer,
  }))
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
          answers: toTopicAnswerItems(params.answers),
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
          answers: toTopicAnswerItems(params.answers),
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
