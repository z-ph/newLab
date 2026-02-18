import { ref, computed, unref, type Ref } from 'vue'
import {
  getApiStudentProcedureSubmissions,
  getApiStudentProcedureSubmissionsUncompleted,
} from '@/core/api/generated'
import client from '@/core/api/config'
import { useQuery } from '@tanstack/vue-query'

/**
 * 查询实验步骤提交列表的参数
 */
export interface UseQueryProcedureSubmissionsParams {
  /** 课程ID（可选，用于过滤） */
  courseId?: string | Ref<string | undefined>
  /** 实验ID（可选，用于过滤） */
  experimentId?: string | Ref<string | undefined>
}

/**
 * 查询实验步骤提交列表
 * @param params - 过滤参数（可选）
 */
export function useQueryProcedureSubmissions(params?: UseQueryProcedureSubmissionsParams) {
  const query = useQuery({
    queryKey: computed(() => [
      'student-procedure-submissions',
      unref(params?.courseId),
      unref(params?.experimentId),
    ]),
    queryFn: () =>
      getApiStudentProcedureSubmissions({
        client,
      }),
    select: (response) => {
      const allSubmissions = response.data?.data ?? []

      // 如果提供了过滤参数，在前端过滤
      if (params?.courseId || params?.experimentId) {
        const courseId = unref(params?.courseId)
        const experimentId = unref(params?.experimentId)

        return allSubmissions.filter((submission) => {
          if (courseId && submission.courseId !== courseId) return false
          if (experimentId && submission.experimentId !== experimentId) return false
          return true
        })
      }

      return allSubmissions
    },
  })

  return {
    submissions: query.data,
    query,
  }
}

/**
 * 查询未完成的实验步骤
 */
export function useQueryUncompletedProcedures(params?: {
  courseId: string
  experimentId: number
  procedureId: number
}) {
  if (!params) {
    return {
      data: ref(undefined),
      isLoading: ref(false),
      isError: ref(false),
      error: ref(null),
      isFetching: ref(false),
      refetch: () => {},
    }
  }

  return useQuery({
    queryKey: computed(() => ['student-uncompleted-procedures', params.courseId, params.experimentId, params.procedureId]),
    queryFn: () =>
      getApiStudentProcedureSubmissionsUncompleted({
        query: {
          courseId: params.courseId,
          experimentId: params.experimentId,
          procedureId: params.procedureId,
        },
        client,
      }),
    select: (response) => response.data?.data,
  })
}
