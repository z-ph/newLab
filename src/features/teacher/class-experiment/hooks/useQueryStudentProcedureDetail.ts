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
import { type MaybeRefOrGetter, toValue, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import client from '@/core/api/config'

export type ProcedureType = 'video' | 'data-collection' | 'topic' | 'timed-quiz'
export type ProcedureStatus = 'completed' | 'uncompleted'

/**
 * 查询学生步骤详情（支持所有步骤类型）
 */
export function useQueryStudentProcedureDetail(
  studentUsername: MaybeRefOrGetter<string>,
  procedureId: MaybeRefOrGetter<number>,
  courseId: MaybeRefOrGetter<string>,
  experimentId: MaybeRefOrGetter<number>,
  procedureType: ProcedureType,
  status: ProcedureStatus,
  options?: { enable?: MaybeRefOrGetter<boolean> }
) {
  return useQuery({
    queryKey: computed(() => ['student-procedure-detail', toValue(studentUsername), toValue(procedureId), procedureType, status]),
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
        path: { studentUsername: toValue(studentUsername), procedureId: toValue(procedureId) },
        query: { courseId: toValue(courseId), experimentId: toValue(experimentId) },
        client,
      })
    },
    select: (res) => res.data?.data,
    enabled: computed(() => toValue(options?.enable) && !!toValue(studentUsername) && !!toValue(procedureId) && !!toValue(courseId) && !!toValue(experimentId)),
  })
}
