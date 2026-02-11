import { postApiTeacherClassQuery, getApiTeacherExperiments } from '@/core/api/generated'
import client from '@/core/api/config'
import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'

/**
 * 获取概览统计数据
 * 包括：班级总数、实验总数、学生总数、待批改数量
 */
export function useOverviewStatistics() {
  // 查询班级列表（用于获取班级总数和学生总数）
  const classQuery = useQuery({
    queryKey: ['overview', 'class-count'],
    queryFn: () =>
      postApiTeacherClassQuery({
        body: { pageable: false },
        client,
      }),
    select: (response) => {
      const classes = response.data?.data?.records ?? []
      // 计算学生总数（累加所有班级的学生数）
      const studentCount = classes.reduce((sum, cls) => sum + (cls.studentCount ?? 0), 0)
      return {
        classCount: classes.length,
        studentCount,
      }
    },
  })

  // 查询实验总数
  const experimentQuery = useQuery({
    queryKey: ['overview', 'experiment-count'],
    queryFn: () =>
      getApiTeacherExperiments({
        client,
      }),
    select: (response) => response.data?.data?.length ?? 0,
  })
  // 统计卡片数据
  const statistics = computed(() => [
    {
      title: '班级总数',
      value: classQuery.data.value?.classCount.toString() ?? '0',
      icon: 'pi pi-users',
      color: 'bg-emerald-500',
    },
    {
      title: '实验总数',
      value: experimentQuery.data.value?.toString() ?? '0',
      icon: 'pi pi-book',
      color: 'bg-orange-500',
    },
    {
      title: '学生总数',
      value: classQuery.data.value?.studentCount.toString() ?? '0',
      icon: 'pi pi-user',
      color: 'bg-cyan-500',
    },
  ])

  // 整体加载状态
  const isLoading = computed(
    () => classQuery.isLoading.value || experimentQuery.isLoading.value
  )

  return {
    statistics,
    isLoading,
    refetchAll: () => {
      classQuery.refetch()
      experimentQuery.refetch()
    },
  }
}
