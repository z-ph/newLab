import { ref } from 'vue'
import {
  getApiStudentProcedureSubmissions,
  getApiStudentProcedureSubmissionsUncompleted,
} from '@/core/api/generated'
import client from '@/core/api/config'
import { useQuery } from '@tanstack/vue-query'

/**
 * 查询实验步骤提交列表
 */
export function useQueryProcedureSubmissions() {
  const query = useQuery({
    queryKey: ['student-procedure-submissions'],
    queryFn: () =>
      getApiStudentProcedureSubmissions({
        client,
      }),
    select: (response) => response.data?.data ?? [],
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
    queryKey: ['student-uncompleted-procedures', params],
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
