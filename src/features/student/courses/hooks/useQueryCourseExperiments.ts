import { type Ref, unref, computed } from 'vue'
import { getApiStudentExperimentsClassExperiments } from '@/core/api/generated'
import client from '@/core/api/config'
import { useQuery } from '@tanstack/vue-query'
import type { ClassExperiment } from '@/core/api/generated'

/**
 * 实验信息 - 从 API 类型派生
 */
export type ExperimentInfo = {
  experimentId: ClassExperiment['experimentId']
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

      // 过滤掉没有 experimentId 的实验
      const validExperiments = courseExperiments.filter(
        (exp): exp is ClassExperiment & { experimentId: string } => !!exp.experimentId
      )

      // 按 experimentId 分组
      const experimentMap = new Map<ClassExperiment['experimentId'], ClassExperiment[]>()
      validExperiments.forEach((classExperiment) => {
        const experimentId = classExperiment.experimentId!
        if (!experimentMap.has(experimentId)) {
          experimentMap.set(experimentId, [])
        }
        experimentMap.get(experimentId)!.push(classExperiment)
      })

      // 转换为实验列表
      const experiments: ExperimentInfo[] = Array.from(experimentMap.entries()).map(
        ([experimentId, classExperiments]) => ({
          experimentId,
          classExperiments,
        })
      )

      return experiments
    },
    enabled: computed(() => !!unref(courseId)),
  })

  return {
    experiments: query.data,
    query,
  }
}
