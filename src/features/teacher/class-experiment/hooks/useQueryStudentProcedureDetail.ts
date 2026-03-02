/**
 * 学生步骤详情查询 Hooks
 */

import {
  getApiTeacherStudentsStudentusernameProceduresVideoProcedureidCompleted,
  getApiTeacherStudentsStudentusernameProceduresVideoProcedureidUncompleted,
  getApiTeacherStudentsStudentusernameProceduresDataCollectionProcedureidCompleted,
  getApiTeacherStudentsStudentusernameProceduresDataCollectionProcedureidUncompleted,
  getApiTeacherStudentsStudentusernameProceduresTopicProcedureidCompleted,
  getApiTeacherStudentsStudentusernameProceduresTopicProcedureidUncompleted,
  getApiTeacherStudentsStudentusernameProceduresTimedQuizProcedureidCompleted,
  getApiTeacherStudentsStudentusernameProceduresTimedQuizProcedureidUncompleted,
} from '@/core/api/generated'
import { type Ref, unref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import client from '@/core/api/config'

export type ProcedureType = 'video' | 'data-collection' | 'topic' | 'timed-quiz'
export type ProcedureStatus = 'completed' | 'uncompleted'

/**
 * 查询学生步骤详情（支持所有步骤类型）
 */
export function useQueryStudentProcedureDetail(
  studentUsername: Ref<string>,
  procedureId: Ref<number>,
  courseId: Ref<string>,
  experimentId: Ref<number>,
  procedureType: ProcedureType,
  status: ProcedureStatus,
  options?: { enable?: Ref<boolean> }
) {
  return useQuery({
    queryKey: computed(() => ['student-procedure-detail', unref(studentUsername), unref(procedureId), procedureType, status]),
    queryFn: () => {
      // 根据步骤类型和状态调用不同的API
      const apiMap = {
        'video-completed': getApiTeacherStudentsStudentusernameProceduresVideoProcedureidCompleted,
        'video-uncompleted': getApiTeacherStudentsStudentusernameProceduresVideoProcedureidUncompleted,
        'data-collection-completed': getApiTeacherStudentsStudentusernameProceduresDataCollectionProcedureidCompleted,
        'data-collection-uncompleted': getApiTeacherStudentsStudentusernameProceduresDataCollectionProcedureidUncompleted,
        'topic-completed': getApiTeacherStudentsStudentusernameProceduresTopicProcedureidCompleted,
        'topic-uncompleted': getApiTeacherStudentsStudentusernameProceduresTopicProcedureidUncompleted,
        'timed-quiz-completed': getApiTeacherStudentsStudentusernameProceduresTimedQuizProcedureidCompleted,
        'timed-quiz-uncompleted': getApiTeacherStudentsStudentusernameProceduresTimedQuizProcedureidUncompleted,
      }


      const apiFn = apiMap[`${procedureType}-${status}`]
      if (!apiFn) {
        throw new Error(`Unsupported procedure type: ${procedureType} or status: ${status}`)
      }

      return apiFn({
        path: { studentUsername: unref(studentUsername), procedureId: unref(procedureId) },
        query: { courseId: unref(courseId), experimentId: unref(experimentId) },
        client,
      })
    },
    select: (res) => res.data?.data,
    enabled: computed(() => unref(options?.enable) && !!unref(studentUsername) && !!unref(procedureId) && !!unref(courseId) && !!unref(experimentId)),
  })
}
