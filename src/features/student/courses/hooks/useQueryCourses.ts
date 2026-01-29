import { getApiStudentProcedureSubmissions } from '@/core/api/generated'
import client from '@/core/api/config'
import { useQuery } from '@tanstack/vue-query'
import type { ProcedureSubmissionResponse } from '@/core/api/generated'

/**
 * 课程信息
 */
export interface CourseInfo {
  courseId: string
  submissions: ProcedureSubmissionResponse[]
}

/**
 * 查询课程列表（从实验提交记录中提取）
 */
export function useQueryCourses() {
  const query = useQuery({
    queryKey: ['student-courses'],
    queryFn: () =>
      getApiStudentProcedureSubmissions({
        client,
      }),
    select: (response) => {
      const submissions = response.data?.data ?? []

      // 按 courseId 分组
      const courseMap = new Map<string, ProcedureSubmissionResponse[]>()

      submissions.forEach((submission) => {
        if (submission.courseId) {
          if (!courseMap.has(submission.courseId)) {
            courseMap.set(submission.courseId, [])
          }
          courseMap.get(submission.courseId)!.push(submission)
        }
      })

      // 转换为课程列表
      const courses: CourseInfo[] = Array.from(courseMap.entries()).map(
        ([courseId, submissions]) => ({
          courseId,
          submissions,
        })
      )

      return courses
    },
  })

  return {
    courses: query.data,
    query,
  }
}
