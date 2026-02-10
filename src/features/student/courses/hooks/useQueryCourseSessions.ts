import { postApiStudentProcedureSubmissionsCourseSessions } from '@/core/api/generated'
import client from '@/core/api/config'
import { useQuery } from '@tanstack/vue-query'

/**
 * 查询学生的课程会话列表
 */
export function useQueryCourseSessions() {
  const query = useQuery({
    queryKey: ['student-course-sessions'],
    queryFn: () =>
      postApiStudentProcedureSubmissionsCourseSessions({
        body: { pageable: false },
        client,
      }),
    select: (response) => {
      // 当 pageable=false 时，返回的是数组而不是分页对象
      const data = response.data?.data
      return Array.isArray(data) ? data : data?.records ?? []
    },
  })

  return {
    courseSessions: query.data,
    isLoading: query.isLoading,
    query,
  }
}
