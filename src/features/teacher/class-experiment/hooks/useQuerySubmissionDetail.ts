/**
 * 查询单个提交详情的 Hook
 */

import { getApiTeacherProcedureSubmissionsBySubmissionId } from '@/core/api/generated'
import type { QueryOptions } from '@/features/shared/types/UseQueryOptions'
import { useQuery } from '@tanstack/vue-query'
import client from '@/core/api/config'

/**
 * 查询单个提交的详细信息
 */
export function useQuerySubmissionDetail(submissionId: number, options?: Partial<QueryOptions>) {
  return useQuery({
    queryKey: options?.queryKey || ['submission-detail', submissionId],
    queryFn: () =>
      getApiTeacherProcedureSubmissionsBySubmissionId({
        path: { submissionId },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: options?.enable && !!submissionId,
  })
}
