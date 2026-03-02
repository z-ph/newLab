/**
 * 班级实验概览数据查询 Hook
 * 支持按日期筛选、按班级分组、按实验分组
 */

import { type Ref, unref, computed } from 'vue'
import { getApiTeacherExperimentsClassExperiments } from '@/core/api/generated'
import type { ClassExperimentDetailResponse } from '@/core/api/generated'
import { useQuery } from '@tanstack/vue-query'
import client from '@/core/api/config'

/**
 * 查询班级实验列表（支持日期筛选）
 */
export function useClassExperimentOverview(
  params: {
    startDate?: Ref<string | undefined>
    endDate?: Ref<string | undefined>
  } = {}
) {
  const { startDate, endDate } = params

  const query = useQuery({
    queryKey: computed(() => [
      'class-experiment-overview',
      unref(startDate),
      unref(endDate),
    ]),
    queryFn: () =>
      getApiTeacherExperimentsClassExperiments({
        query: {
          startDate: unref(startDate),
          endDate: unref(endDate),
          pageable: false,
        },
        client,
      }),
    select: (response) => response.data?.data?.records ?? [],
    enabled: computed(() => {
      // 如果没有传入日期参数，默认查询所有数据
      if (!startDate && !endDate) return true
      // 如果传入了 startDate，确保它有值才启用查询
      if (startDate && !unref(startDate)) return false
      return true
    }),
  })

  return {
    query,
    experiments: computed(() => query.data.value ?? []),
    isLoading: query.isLoading,
    refetch: query.refetch,
  }
}

/**
 * 获取今天的日期字符串（yyyy-MM-dd）
 */
export function getTodayDateString(): string {
  const today = new Date()
  return today.toISOString().split('T')[0] ?? ''
}

/**
 * 筛选出今天的实验
 */
export function filterTodayExperiments(
  experiments: ClassExperimentDetailResponse[]
): ClassExperimentDetailResponse[] {
  const today = getTodayDateString()
  return experiments.filter((exp) => {
    if (!exp.startTime) return false
    const expDate = exp.startTime.split('T')[0]
    return expDate === today
  })
}

/**
 * 按班级分组实验
 */
export function groupExperimentsByClass(
  experiments: ClassExperimentDetailResponse[]
): Map<string, ClassExperimentDetailResponse[]> {
  const grouped = new Map<string, ClassExperimentDetailResponse[]>()

  experiments.forEach((exp) => {
    const classCode = exp.classCode ?? 'unknown'
    const existing = grouped.get(classCode) ?? []
    grouped.set(classCode, [...existing, exp])
  })

  return grouped
}

/**
 * 按实验分组实验
 */
export function groupExperimentsByExperiment(
  experiments: ClassExperimentDetailResponse[]
): Map<number, ClassExperimentDetailResponse[]> {
  const grouped = new Map<number, ClassExperimentDetailResponse[]>()

  experiments.forEach((exp) => {
    const experimentId = exp.experimentId ?? 0
    const existing = grouped.get(experimentId) ?? []
    grouped.set(experimentId, [...existing, exp])
  })

  return grouped
}

/**
 * 格式化日期范围显示
 */
export function formatClassExperimentTime(exp: ClassExperimentDetailResponse): string {
  const parts: string[] = []

  if (exp.courseTime) {
    parts.push(exp.courseTime)
  }

  if (exp.startTime) {
    const date = exp.startTime.split('T')[0] ?? ''
    parts.push(date)
  }

  return parts.join(' ')
}

/**
 * 获取班级显示名称（支持合班上课）
 */
export function getClassDisplayNames(exp: ClassExperimentDetailResponse): string {
  if (exp.isMergedClass && exp.classNames && exp.classNames.length > 0) {
    return exp.classNames.join(' + ')
  }
  return exp.className ?? '未知班级'
}

/**
 * 获取班级代码列表（支持合班上课）
 */
export function getClassCodes(exp: ClassExperimentDetailResponse): string[] {
  if (exp.isMergedClass && exp.classCodes && exp.classCodes.length > 0) {
    return exp.classCodes
  }
  return exp.classCode ? [exp.classCode] : []
}
