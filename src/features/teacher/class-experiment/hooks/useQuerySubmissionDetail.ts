/**
 * 查询单个提交详情的 Hook
 */

import { type Ref, unref, computed } from 'vue'
import { getApiTeacherProcedureSubmissionsSubmissionid } from '@/core/api/generated'
import { useQuery } from '@tanstack/vue-query'
import client from '@/core/api/config'

/**
 * 查询单个提交的详细信息
 */
export function useQuerySubmissionDetail(
  submissionId: Ref<number>,
  options?: { enable?: Ref<boolean> }
) {
  return useQuery({
    queryKey: computed(() => ['submission-detail', unref(submissionId)]),
    queryFn: () =>
      getApiTeacherProcedureSubmissionsSubmissionid({
        path: { submissionId: unref(submissionId) },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: computed(() => unref(options?.enable) && !!unref(submissionId)),
  })
}
