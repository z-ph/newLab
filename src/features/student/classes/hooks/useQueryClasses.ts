import { getApiStudentClasses } from '@/core/api/generated'
import client from '@/core/api/config'
import { useQuery } from '@tanstack/vue-query'

/**
 * 查询我的班级列表
 */
export function useQueryClasses() {
  const query = useQuery({
    queryKey: ['student-classes'],
    queryFn: () =>
      getApiStudentClasses({
        client,
      }),
    select: (response) => response.data?.data ?? [],
  })

  return {
    classes: query.data,
    query,
  }
}
