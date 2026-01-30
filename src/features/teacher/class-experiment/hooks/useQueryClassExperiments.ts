/**
 * 班级实验查询 Hooks
 */

import { postApiTeacherClassQuery } from '@/core/api/generated'
import type { QueryOptions } from '@/features/shared/types/UseQueryOptions'
import { useQuery } from '@tanstack/vue-query'
import client from '@/core/api/config'

/**
 * 查询所有班级及其实验列表
 */
export function useQueryClassExperiments(options?: Partial<QueryOptions>) {
  return useQuery({
    queryKey: options?.queryKey || ['class-experiments'],
    queryFn: () =>
      postApiTeacherClassQuery({
        body: {
          pageable: false,
        },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: options?.enable,
  })
}

