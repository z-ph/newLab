import { type MaybeRefOrGetter, toValue, computed } from 'vue'
import { getApiStudentProcedureSubmissionsCourseByCourseId } from '@/core/api/generated'
import client from '@/core/api/config'
import { useQuery } from '@tanstack/vue-query'

/**
 * 实验信息
 */
export interface ExperimentInfo {
  experimentId: string
  submissions: any[]
}

/**
 * 查询课程的实验列表
 */
export function useQueryCourseExperiments(courseId: MaybeRefOrGetter<string>) {
  const query = useQuery({
    queryKey: computed(() => ['student-course-experiments', toValue(courseId)]),
    queryFn: () =>
      getApiStudentProcedureSubmissionsCourseByCourseId({
        path: { courseId: toValue(courseId) },
        client,
      }),
    select: (response) => {
      const submissions = response.data?.data ?? []

      // 按 experimentId 分组
      const experimentMap = new Map<string, any[]>()

      submissions.forEach((submission) => {
        if (submission.experimentId) {
          if (!experimentMap.has(submission.experimentId)) {
            experimentMap.set(submission.experimentId, [])
          }
          experimentMap.get(submission.experimentId)!.push(submission)
        }
      })

      // 转换为实验列表
      const experiments: ExperimentInfo[] = Array.from(
        experimentMap.entries()
      ).map(([experimentId, submissions]) => ({
        experimentId,
        submissions,
      }))

      return experiments
    },
    enabled: computed(() => !!toValue(courseId)),
  })

  return {
    experiments: query.data,
    query,
  }
}
