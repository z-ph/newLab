import { getApiStudentExperimentsClassExperiments } from '@/core/api/generated'
import client from '@/core/api/config'
import { useQuery } from '@tanstack/vue-query'
import type { ClassExperimentDetailResponse } from '@/core/api/generated'

/**
 * 课程信息 - 从 API 类型派生
 */
export type CourseInfo = {
  courseId: ClassExperimentDetailResponse['courseId']
  courseName: ClassExperimentDetailResponse['courseName']
  classExperiments: ClassExperimentDetailResponse[]
}

/**
 * 查询课程列表（从班级实验列表中提取）
 */
export function useQueryCourses() {
  const query = useQuery({
    queryKey: ['student-courses'],
    queryFn: () =>
      getApiStudentExperimentsClassExperiments({
        client,
      }),
    select: (response) => {
      // API 返回的是分页对象
      const pageData = response.data?.data
      const classExperiments = Array.isArray(pageData)
        ? pageData
        : pageData?.records ?? []

      // 按 courseId 分组
      const courseMap = new Map<string, ClassExperimentDetailResponse[]>()

      classExperiments.forEach((classExperiment: ClassExperimentDetailResponse) => {
        if (classExperiment.courseId) {
          if (!courseMap.has(classExperiment.courseId)) {
            courseMap.set(classExperiment.courseId, [])
          }
          courseMap.get(classExperiment.courseId)!.push(classExperiment)
        }
      })

      // 转换为课程列表
      const courses: CourseInfo[] = Array.from(courseMap.entries()).map(
        ([courseId, classExperiments]) => ({
          courseId,
          courseName:
            classExperiments[0]?.courseName || '未命名课程', // ✅ 使用 courseName 字段
          classExperiments,
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
