import { type Ref, toValue, computed } from 'vue'
import { getApiStudentGrades, getApiStudentGradesByGradeId } from '@/core/api/generated'
import client from '@/core/api/config'
import { useQuery } from '@tanstack/vue-query'

/**
 * 查询成绩列表
 */
export function useQueryGrades() {
  const query = useQuery({
    queryKey: ['student-grades'],
    queryFn: () =>
      getApiStudentGrades({
        client,
      }),
    select: (response) => response.data?.data ?? [],
  })

  return {
    grades: query.data,
    query,
  }
}

/**
 * 查询成绩详情
 */
export function useQueryGradeDetail(gradeId: Ref<number>) {
  const query = useQuery({
    queryKey: computed(() => ['student-grade-detail', toValue(gradeId)]),
    queryFn: () =>
      getApiStudentGradesByGradeId({
        path: { gradeId: toValue(gradeId) },
        client,
      }),
    select: (response) => response.data?.data,
    enabled: computed(() => !!toValue(gradeId)),
  })

  return {
    grade: query.data,
    query,
  }
}
