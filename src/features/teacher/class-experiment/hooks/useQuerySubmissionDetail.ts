/**
 * 查询单个提交详情的 Hook
 */

import { type MaybeRefOrGetter, toValue, computed } from 'vue'
import { getApiTeacherProcedureSubmissionsBySubmissionId } from '@/core/api/generated'
import { useQuery } from '@tanstack/vue-query'
import client from '@/core/api/config'

/**
 * 查询单个提交的详细信息
 */
export function useQuerySubmissionDetail(
  submissionId: MaybeRefOrGetter<number>,
  options?: { enable?: MaybeRefOrGetter<boolean> }
) {
  return useQuery({
    queryKey: computed(() => ['submission-detail', toValue(submissionId)]),
    queryFn: () =>
      getApiTeacherProcedureSubmissionsBySubmissionId({
        path: { submissionId: toValue(submissionId) },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: computed(() => toValue(options?.enable) && !!toValue(submissionId)),
  })
}
