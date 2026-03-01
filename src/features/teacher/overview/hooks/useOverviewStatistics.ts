import { postApiTeacherClassQuery, getApiTeacherExperiments, postApiTeacherCoursesQuery } from '@/core/api/generated'
import client from '@/core/api/config'
import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'

/** 显示数量限制 */
const PREVIEW_LIMIT = 5

/**
 * 获取概览统计数据
 * 包括：课程列表、实验列表、班级列表（各显示前5条）
 */
export function useOverviewStatistics() {
  // 查询课程列表
  const courseQuery = useQuery({
    queryKey: ['overview', 'courses'],
    queryFn: () =>
      postApiTeacherCoursesQuery({
        body: { pageable: false },
        client,
      }),
    select: (response) => {
      const records = response.data?.data?.records ?? []
      return {
        total: response.data?.data?.total ?? records.length,
        records: records.slice(0, PREVIEW_LIMIT),
      }
    },
  })

  // 查询实验列表
  const experimentQuery = useQuery({
    queryKey: ['overview', 'experiments'],
    queryFn: () =>
      getApiTeacherExperiments({
        client,
      }),
    select: (response) => {
      const records = response.data?.data ?? []
      return {
        total: records.length,
        records: records.slice(0, PREVIEW_LIMIT),
      }
    },
  })

  // 查询班级列表
  const classQuery = useQuery({
    queryKey: ['overview', 'classes'],
    queryFn: () =>
      postApiTeacherClassQuery({
        body: { pageable: false },
        client,
      }),
    select: (response) => {
      const records = response.data?.data?.records ?? []
      return {
        total: records.length,
        records: records.slice(0, PREVIEW_LIMIT),
      }
    },
  })

  // 整体加载状态
  const isLoading = computed(
    () => courseQuery.isLoading.value || experimentQuery.isLoading.value || classQuery.isLoading.value
  )

  return {
    courses: computed(() => courseQuery.data.value),
    experiments: computed(() => experimentQuery.data.value),
    classes: computed(() => classQuery.data.value),
    isLoading,
    refetchAll: () => {
      courseQuery.refetch()
      experimentQuery.refetch()
      classQuery.refetch()
    },
  }
}
