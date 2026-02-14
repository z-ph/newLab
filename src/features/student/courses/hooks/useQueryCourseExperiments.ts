import { type Ref, unref, computed } from 'vue'
import { getApiStudentExperimentsClassExperiments } from '@/core/api/generated'
import client from '@/core/api/config'
import { useQuery } from '@tanstack/vue-query'
import type { ClassExperiment } from '@/core/api/generated'

/**
 * 实验信息
 */
export interface ExperimentInfo {
  experimentId: number
  classExperiments: ClassExperiment[]
}

/**
 * 查询课程的实验列表（从班级实验列表中过滤）
 */
export function useQueryCourseExperiments(courseId: Ref<string>) {
  const query = useQuery({
    queryKey: computed(() => ['student-course-experiments', unref(courseId)]),
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

      // 过滤出该课程的实验
      const courseExperiments = classExperiments.filter(
        (exp) => exp.courseId === unref(courseId)
      )

      // 按 experimentId 分组
      const experimentMap = new Map<number, ClassExperiment[]>()

      courseExperiments.forEach((classExperiment) => {
        if (classExperiment.experimentId) {
          if (!experimentMap.has(classExperiment.experimentId)) {
            experimentMap.set(classExperiment.experimentId, [])
          }
          experimentMap.get(classExperiment.experimentId)!.push(classExperiment)
        }
      })

      // 转换为实验列表
      const experiments: ExperimentInfo[] = Array.from(
        experimentMap.entries()
      ).map(([experimentId, classExperiments]) => ({
        experimentId,
        classExperiments,
      }))

      return experiments
    },
    enabled: computed(() => !!unref(courseId)),
  })

  return {
    experiments: query.data,
    query,
  }
}
