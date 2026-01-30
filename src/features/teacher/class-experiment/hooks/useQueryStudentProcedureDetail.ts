/**
 * 学生步骤详情查询 Hooks
 */

import {
  getApiTeacherStudentsByStudentUsernameProceduresVideoByProcedureIdCompleted,
  getApiTeacherStudentsByStudentUsernameProceduresVideoByProcedureIdUncompleted,
  getApiTeacherStudentsByStudentUsernameProceduresDataCollectionByProcedureIdCompleted,
  getApiTeacherStudentsByStudentUsernameProceduresDataCollectionByProcedureIdUncompleted,
  getApiTeacherStudentsByStudentUsernameProceduresTopicByProcedureIdCompleted,
  getApiTeacherStudentsByStudentUsernameProceduresTopicByProcedureIdUncompleted,
  getApiTeacherStudentsByStudentUsernameProceduresTimedQuizByProcedureIdCompleted,
  getApiTeacherStudentsByStudentUsernameProceduresTimedQuizByProcedureIdUncompleted,
} from '@/core/api/generated'
import type { QueryOptions } from '@/features/shared/types/UseQueryOptions'
import { useQuery } from '@tanstack/vue-query'
import client from '@/core/api/config'

export type ProcedureType = 'video' | 'data-collection' | 'topic' | 'timed-quiz'
export type ProcedureStatus = 'completed' | 'uncompleted'

/**
 * 查询学生步骤详情（支持所有步骤类型）
 */
export function useQueryStudentProcedureDetail(
  studentUsername: string,
  procedureId: number,
  courseId: string,
  experimentId: number,
  procedureType: ProcedureType,
  status: ProcedureStatus,
  options?: Partial<QueryOptions>
) {
  return useQuery({
    queryKey: options?.queryKey || ['student-procedure-detail', studentUsername, procedureId, procedureType, status],
    queryFn: () => {
      // 根据步骤类型和状态调用不同的API
      const apiMap = {
        'video-completed': getApiTeacherStudentsByStudentUsernameProceduresVideoByProcedureIdCompleted,
        'video-uncompleted': getApiTeacherStudentsByStudentUsernameProceduresVideoByProcedureIdUncompleted,
        'data-collection-completed': getApiTeacherStudentsByStudentUsernameProceduresDataCollectionByProcedureIdCompleted,
        'data-collection-uncompleted': getApiTeacherStudentsByStudentUsernameProceduresDataCollectionByProcedureIdUncompleted,
        'topic-completed': getApiTeacherStudentsByStudentUsernameProceduresTopicByProcedureIdCompleted,
        'topic-uncompleted': getApiTeacherStudentsByStudentUsernameProceduresTopicByProcedureIdUncompleted,
        'timed-quiz-completed': getApiTeacherStudentsByStudentUsernameProceduresTimedQuizByProcedureIdCompleted,
        'timed-quiz-uncompleted': getApiTeacherStudentsByStudentUsernameProceduresTimedQuizByProcedureIdUncompleted,
      }

      const apiFn = apiMap[`${procedureType}-${status}`]
      if (!apiFn) {
        throw new Error(`Unsupported procedure type: ${procedureType} or status: ${status}`)
      }

      return apiFn({
        path: { studentUsername, procedureId },
        query: { courseId, experimentId },
        client,
      })
    },
    select: (res) => res.data?.data,
    enabled: options?.enable && !!studentUsername && !!procedureId && !!courseId && !!experimentId,
  })
}
